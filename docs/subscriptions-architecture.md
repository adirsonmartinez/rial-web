# Arquitectura de Suscripciones (Rial Plus)

Esta doc explica cómo está armado el sistema de suscripciones entre la app móvil (iOS/Android), el sitio web (Venflow VES), y la base de datos compartida en Supabase. Sirve de referencia para cualquier consumidor que necesite leer/escribir el estado de suscripción de un usuario.

## TL;DR

- **Supabase es la fuente única de verdad.** Toda lectura del estado actual de suscripción debe consultar Supabase (no RevenueCat ni Venflow directamente).
- Múltiples canales de cobro alimentan la misma tabla `subscriptions`:
  - **iOS** → StoreKit → RevenueCat → webhook → Edge Function `revenuecat-webhook` → `subscriptions`
  - **Android** → Google Play Billing → RevenueCat → mismo webhook → `subscriptions` *(pendiente configurar Play Console)*
  - **Web/Bs** → Venflow → backend → `subscriptions` (provider = `venflow`)
- Un trigger automático (`sync_user_subscription`) propaga el estado a `users.subscription_plan` para lookups rápidos.

## Diagrama de flujo

```
Compra iOS / Android                         Compra Web (Bs)
        │                                            │
        ▼                                            ▼
   Apple/Google                                  Venflow
        │                                            │
        ▼                                            ▼
   RevenueCat                              backend web (existente)
        │                                            │
        │ webhook firmado                            │
        ▼                                            ▼
Edge Function `revenuecat-webhook`        INSERT/UPDATE directo en
        │                                  `subscriptions` (provider='venflow')
        ▼                                            │
   UPSERT en `subscriptions`                         │
        │                                            │
        └─────────────┬──────────────────────────────┘
                      ▼
        trigger `sync_user_subscription`
                      │
                      ▼
        UPDATE en `users` (subscription_plan,
        subscription_status, subscription_expires_at)
                      │
                      ▼
              Apps/Web leen estado
```

## Tablas relevantes

### `subscription_plans` (catálogo)

Define los planes disponibles. Tres filas actualmente:

| name | display_name | is_active | Notas |
|------|--------------|-----------|-------|
| `free` | Gratis | `true` | Default para todos los users nuevos. Tiene `limits` jsonb con los caps. |
| `plus` | Rial Plus | `true` | Plan de pago. **El único plan vendible activo.** |
| `pro` | Pro | `false` | Legacy, desactivado. No usar. |

Columnas clave (todas en `public.subscription_plans`):

- `id uuid` — PK referenciado por `subscriptions.plan_id`
- `name text` — identificador interno (`'free'`, `'plus'`)
- `display_name text` — texto user-facing
- `price_monthly`, `price_quarterly`, `price_semiannual`, `price_yearly` — precios USD por billing cycle
- `apple_product_id_monthly|quarterly|semiannual|yearly` — App Store product IDs
- `google_product_id_monthly|quarterly|semiannual|yearly` — Play Console product IDs
- `features jsonb`, `limits jsonb` — feature flags y caps numéricos
- `is_active boolean`, `is_default boolean`, `sort_order int`

### `subscriptions` (estado real por usuario)

Una fila por *combinación* `(provider, provider_customer_id)`. Un usuario puede tener simultáneamente filas de distintos providers (ej. apple + venflow, si compró en ambos canales).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `users.id` |
| `plan_id` | `uuid` | FK → `subscription_plans.id` |
| `status` | `text` | `active`, `trialing`, `past_due`, `cancelled`, `expired`, `paused` |
| `billing_cycle` | `text` | `monthly`, `quarterly`, `semiannual`, `yearly`, `lifetime` |
| `provider` | `text` | `apple`, `google`, `venflow`, `r4conecta`, `stripe`, `manual`, `revenuecat` |
| `provider_customer_id` | `text` | ID estable del cliente en el provider (RC: `original_app_user_id`; Venflow: customer UUID interno) |
| `provider_subscription_id` | `text` | ID de la suscripción en el provider (RC: `original_transaction_id`; Venflow: subscription UUID) |
| `provider_product_id` | `text` | Product ID en el provider (`com.adimtnez.rial.plus.monthly`, etc.) |
| `started_at` | `timestamptz` | Inicio absoluto de la suscripción |
| `current_period_start` | `timestamptz` | Inicio del período actual de cobro |
| `current_period_end` | `timestamptz` | Fin del período actual |
| `expires_at` | `timestamptz` | Cuándo deja de tener acceso (cancelled + period_end pasado → expired) |
| `cancel_at_period_end` | `boolean` | `true` cuando el user canceló pero aún tiene acceso |
| `cancelled_at` | `timestamptz` | Momento de cancelación |
| `trial_started_at`, `trial_ends_at` | `timestamptz` | Periodo de trial (si aplica) |
| `metadata` | `jsonb` | Datos auxiliares (last_event_id, environment, refund flag, etc.) |

**Unique constraint:** `(provider, provider_customer_id)` — usar este como conflict target para UPSERTs.

**Status check constraint:** `status IN ('active', 'trialing', 'past_due', 'cancelled', 'expired', 'paused')`.

**Billing cycle check:** `billing_cycle IN ('monthly', 'quarterly', 'semiannual', 'yearly', 'lifetime')`.

**Provider check:** `provider IN ('revenuecat', 'stripe', 'apple', 'google', 'manual', 'r4conecta', 'venflow')`.

### `subscription_payments` (historial de cobros)

Un pago real (USD vía store, VES vía Venflow, etc). Una suscripción puede tener N pagos a lo largo del tiempo (renovaciones).

| Columna | Notas |
|---------|-------|
| `subscription_id` | FK → `subscriptions.id` |
| `user_id` | FK → `users.id` |
| `amount`, `currency` | Monto cobrado y moneda (`USD`, `VES`, etc.) |
| `status` | `succeeded`, `failed`, `pending`, `refunded` (libre, no constraint) |
| `provider`, `provider_payment_id`, `provider_invoice_id` | Identificadores del pago en el gateway |
| `paid_at`, `refunded_at` | Timestamps |
| `metadata` | jsonb (ej. Venflow guarda `gateway_uuid`, `session_id`, `retries`) |

### `users` (estado denormalizado)

Mantenido automáticamente por el trigger `sync_user_subscription`. **No escribir manualmente** salvo casos de manutención (ej. limpieza de cuentas de prueba).

| Columna relevante | Tipo | Descripción |
|-------------------|------|-------------|
| `subscription_plan` | `text` | `'free'` o `'plus'` (el `name` del plan) |
| `subscription_status` | `text` | Mirror de `subscriptions.status` del último cambio |
| `subscription_expires_at` | `timestamptz` | Mirror de `subscriptions.expires_at` |
| `trial_used` | `boolean` | Si ya consumió un trial alguna vez |

### `subscription_usage` (contadores mensuales por user)

Usado para enforcement de límites del plan `free` (transacciones/mes, voice notes/mes, etc.). Una fila por `(user_id, month, year)`.

Campos: `transactions_count`, `voice_records_count`, `ai_suggestions_count`, `exports_count`, `templates_used_count`, `budgets_created_count`, `massive_dictation_count`.

## Trigger automático: `sync_user_subscription`

```sql
-- Definición (ya existente en DB)
CREATE OR REPLACE FUNCTION public.sync_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET subscription_plan = (SELECT name FROM public.subscription_plans WHERE id = NEW.plan_id),
      subscription_status = NEW.status,
      subscription_expires_at = NEW.expires_at,
      updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger fires en INSERT y UPDATE de subscriptions
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_user_subscription();
```

**Importante:**
- El trigger **NO se dispara en DELETE**. Si borras un row, debes actualizar `users` manualmente.
- Si el usuario tiene múltiples subs activas (ej. apple + venflow), `users` refleja la del **último UPDATE/INSERT** — no la "mejor". Para lecturas confiables, usa el RPC `user_has_active_plan` (que consulta `subscriptions` directamente).

## RPCs disponibles

### `user_has_active_plan(p_user_id uuid, p_plan_name text = NULL) → boolean`

Verifica si el user tiene alguna suscripción activa (cualquier provider). Si `p_plan_name` es null, devuelve `true` si tiene CUALQUIER plan activo. Si especificas `'plus'`, valida solo ese plan.

```sql
SELECT user_has_active_plan('a2e8cfe8-...', 'plus'); -- true / false
```

Implementación interna:

```sql
SELECT EXISTS (
  SELECT 1 FROM subscriptions s
  JOIN subscription_plans p ON s.plan_id = p.id
  WHERE s.user_id = $1
    AND s.status IN ('active', 'trialing')
    AND (s.expires_at IS NULL OR s.expires_at > now())
    AND ($2 IS NULL OR p.name = $2)
);
```

### `get_user_current_plan(p_user_id uuid) → TABLE`

Devuelve plan + limits + features del user. Si no tiene sub activa, devuelve el plan `free`. Conveniente para gating en una sola query.

```sql
SELECT plan_name, plan_display_name, status, expires_at, is_trial, limits, features
FROM get_user_current_plan('a2e8cfe8-...');
```

### `get_user_subscription_info(p_user_id uuid) → TABLE`

Variante específica con info de uso (`transactions_used`, `transactions_remaining`, etc.).

### `check_plan_limit(p_user_id uuid, p_limit_key text, p_current_count int = 0) → boolean`

Útil al crear recursos para validar si el user aún tiene cupo:

```sql
SELECT check_plan_limit('a2e8cfe8-...', 'transactions_per_month', 30);
-- true si aún puede crear; false si excede el límite del plan
```

## Convenciones para escribir en `subscriptions` desde otros backends

Si el backend web (Venflow) o cualquier otro servicio necesita crear/actualizar suscripciones, debe seguir estas reglas:

### Al crear una suscripción

```sql
INSERT INTO subscriptions (
  user_id, plan_id, status, billing_cycle,
  provider, provider_customer_id, provider_subscription_id, provider_product_id,
  started_at, current_period_start, current_period_end, expires_at,
  metadata
) VALUES (
  '<supabase user.id>',
  (SELECT id FROM subscription_plans WHERE name = 'plus'),
  'active',
  'monthly',  -- o 'quarterly', 'semiannual', 'yearly'
  'venflow',
  '<venflow customer UUID>',
  '<venflow subscription UUID>',
  NULL,       -- o product ID si Venflow tiene productos diferenciados
  now(),
  now(),
  now() + INTERVAL '1 month',  -- ajustar al cycle
  now() + INTERVAL '1 month',
  jsonb_build_object('source', 'venflow', 'session_id', '<session>')
)
ON CONFLICT (provider, provider_customer_id) DO UPDATE
SET
  status = EXCLUDED.status,
  current_period_end = EXCLUDED.current_period_end,
  expires_at = EXCLUDED.expires_at,
  cancelled_at = NULL,
  cancel_at_period_end = false,
  updated_at = now();
```

El trigger se encarga de actualizar `users.subscription_plan = 'plus'` automáticamente.

### Al renovar

Usar el mismo UPSERT con dates frescos. El conflict target `(provider, provider_customer_id)` actualiza la fila existente.

### Al cancelar (user pidió cancelar pero aún tiene acceso hasta el período)

```sql
UPDATE subscriptions
SET cancel_at_period_end = true,
    cancelled_at = now()
WHERE provider = 'venflow'
  AND provider_customer_id = '<venflow customer UUID>';
-- NO cambiar status — sigue 'active' hasta expirar
```

### Al expirar (period_end ya pasó y no se renovó)

```sql
UPDATE subscriptions
SET status = 'expired'
WHERE provider = 'venflow'
  AND provider_customer_id = '<venflow customer UUID>';
-- El trigger propaga 'expired' a users.subscription_status
-- isPlus en la app pasa a false automáticamente
```

### Al hacer refund

```sql
UPDATE subscriptions
SET status = 'cancelled',
    cancelled_at = now(),
    metadata = metadata || jsonb_build_object('refund', true)
WHERE provider = 'venflow'
  AND provider_customer_id = '<venflow customer UUID>';
```

### Registrar el pago

Adicionalmente al cobro exitoso, inserta en `subscription_payments`:

```sql
INSERT INTO subscription_payments (
  subscription_id, user_id, amount, currency, status, provider,
  provider_payment_id, provider_invoice_id, paid_at, metadata
) VALUES (
  '<subscription.id>',
  '<user.id>',
  589.98,
  'VES',
  'succeeded',
  'venflow',
  '<venflow payment ID>',
  '<venflow invoice ID>',
  now(),
  jsonb_build_object('gateway_uuid', '<uuid>', 'session_id', '<session>')
);
```

## Cómo leer el estado de suscripción desde otra app (web/dashboard)

**Para mostrar al user su plan actual:**

```sql
SELECT subscription_plan, subscription_status, subscription_expires_at
FROM users WHERE id = '<user.id>';
```

Fast (denormalizado), aceptable cuando la consistencia eventual está OK.

**Para tomar decisiones de gating (sin riesgo de stale data):**

```sql
SELECT * FROM get_user_current_plan('<user.id>');
-- Devuelve: plan_name, plan_display_name, status, expires_at, is_trial, limits, features
```

**Para validar un límite específico antes de crear un recurso:**

```sql
SELECT check_plan_limit('<user.id>', 'transactions_per_month', <current_count>);
```

## App móvil: cómo lo consume

La app usa el hook `useRialPlus()` que internamente:

1. Lee `users.subscription_plan` y `subscription_status` vía Supabase JS client
2. Calcula `isPlus = (plan === 'plus' && status IN ['active', 'trialing'] && (expires_at == null || > now()))`
3. Se refresca:
   - Al iniciar sesión
   - Cuando RC dispara `customerInfoUpdateListener` (post-compra Apple/Google)
   - Al volver a foreground (AppState)
   - Después de `Purchases.purchasePackage()` con polling de hasta 6 intentos (espera a que llegue el webhook)

Si el web quiere replicar esta lógica, basta con: consultar `users.subscription_plan === 'plus'` y verificar que `subscription_expires_at > now()` (o null).

## Edge Function `revenuecat-webhook`

URL: `https://<PROJECT_REF>.supabase.co/functions/v1/revenuecat-webhook`

Recibe eventos de RC (configurados en RC Dashboard → Integrations → Webhooks). Maneja:

| Evento RC | Acción en `subscriptions` |
|-----------|---------------------------|
| `INITIAL_PURCHASE`, `RENEWAL`, `PRODUCT_CHANGE`, `UNCANCELLATION`, `NON_RENEWING_PURCHASE` | UPSERT status=`active` con dates frescos |
| `CANCELLATION` | `cancel_at_period_end=true`, `cancelled_at` |
| `EXPIRATION` | `status='expired'` |
| `BILLING_ISSUE` | `status='past_due'` |
| `REFUND` | `status='cancelled'`, `cancelled_at`, `metadata.refund=true` |
| Otros (TEST, TRANSFER, SUBSCRIBER_ALIAS) | Log e ignorar |

Auth: Bearer token compartido en header `Authorization`. Secret en Supabase env `REVENUECAT_WEBHOOK_TOKEN`.

Source: `supabase/functions/revenuecat-webhook/index.ts` (deployed via `supabase deploy_edge_function`).

## Web app (Venflow VES): cómo está implementado

Contraparte de la sección de app móvil, para el canal de pago en Bolívares vía Venflow. Implementado en la Next.js app de este repo.

### Flujo de checkout end-to-end

1. User selecciona cadencia en `/app/plan` y entra a `/app/checkout?cadence=mensual` (o trimestral/semestral/anual).
2. `CheckoutView` muestra el resumen + opciones de moneda (Bolívares disponible; otras monedas marcado como “Próximamente”).
3. Al hacer click en “Continuar”, el front hace `POST /api/venflow/checkout` con `{ cadence }`.
4. La ruta `src/app/api/venflow/checkout/route.ts` valida cadencia + auth, llama a `createCheckoutSession()` (en `src/lib/venflow/client.ts`) contra la API de Venflow y devuelve `{ url }`.
5. El browser redirige al checkout de Venflow. El user paga (Pago Móvil / domiciliación Bs).
6. Venflow redirige de vuelta a `/app/checkout/result?status=success|pending|error|cancelled`.
7. `CheckoutResultView` arranca polling sobre `users.subscription_plan` (cada 2.5 s, hasta 24 intentos = ~60 s). Cuando detecta `plan='plus' AND status IN ('active','trialing') AND (expires_at IS NULL OR expires_at > now())` cambia el status a `success` y dispara confetti (`canvas-confetti`).

### Webhook receiver

Endpoint: `POST /api/venflow/webhooks` — `src/app/api/venflow/webhooks/route.ts`.

Auth: el header `x-webhook-secret` debe coincidir con `process.env.VENFLOW_WEBHOOK_SECRET`. Si no, responde 401. Si falta la env var, responde 500.

| Evento Venflow | Handler | Acción en Supabase |
|---|---|---|
| `USER_CREATE_EVENT` | log only | No-op (informativo). |
| `SUBSCRIPTION_CREATE_EVENT` | `handleSubscriptionCreate` | UPDATE `provider_subscription_id`, `provider_product_id` sobre la sub existente. Si todavía no existe (PAYMENT_SUCCESS no llegó), skipea con `console.warn` sin lanzar. |
| `PAYMENT_SUCCESS_EVENT` | `handlePaymentSuccess` | UPSERT en `subscriptions` con `status='active'`, `current_period_end`, `expires_at`. Preserva `started_at` si la fila ya existía, mergea `metadata`. Luego INSERT en `subscription_payments`. |
| `PAYMENT_FAILED_EVENT` | `handlePaymentFailed` | UPDATE `status='past_due'` sobre la sub. |
| `INVOICE_CREATE_EVENT` | `handleInvoiceCreate` | Guarda `last_invoice_id` y `last_invoice_status` en `subscriptions.metadata`. Si la sub no existe aún, skipea con warning. |
| `INVOICE_UPDATE_EVENT` | `handleInvoiceUpdate` | Mismo storage en metadata + back-fill de `provider_invoice_id` sobre el `subscription_payments` más reciente que aún no lo tenga. |
| `SUBSCRIPTION_CANCELLED_EVENT` | `handleSubscriptionCancelled` | UPDATE `cancel_at_period_end=true`, `cancelled_at=now()`. **No** cambia `status` (sigue `active` hasta que el cron lo expire). |

Implementación: `src/lib/venflow/webhooks.ts`. Tipos de eventos: `src/lib/venflow/types.ts`. Todos los handlers usan el admin client (`src/lib/supabase/admin.ts`) para bypassear RLS.

Ningún handler escribe en `users` directamente — el trigger `sync_user_subscription` propaga.

### Orden de eventos no determinista

Venflow no garantiza un orden lógico de entrega. Patrón observado en producción:

1. `INVOICE_CREATE_EVENT` llega primero, antes que `PAYMENT_SUCCESS_EVENT`.
2. `SUBSCRIPTION_CREATE_EVENT` puede llegar antes o después de `PAYMENT_SUCCESS_EVENT`.
3. `PAYMENT_SUCCESS_EVENT` es el único que crea la fila en `subscriptions` (vía UPSERT).
4. `INVOICE_UPDATE_EVENT` llega al final y completa los datos faltantes.

Para soportar esto los handlers son tolerantes:

- Si una dependencia (la sub o el payment) no existe todavía, **no fallan** — loguean y retornan.
- Eventos posteriores (especialmente `INVOICE_UPDATE`) hacen back-fill de los IDs que no estaban disponibles al momento del primer evento.

Esto implica que cualquier consumidor que observe el estado **debe esperar a que llegue `PAYMENT_SUCCESS`** antes de considerar la sub válida — los otros eventos solos no garantizan acceso.

### Polling post-checkout (UX)

Como los webhooks pueden tardar varios segundos (vimos hasta ~15 s en pruebas), la página de resultado del checkout (`/app/checkout/result?status=pending|success`) corre un polling en cliente en lugar de mostrar un estado final cerrado. El usuario ve un estado “en proceso” y la pantalla pasa a `success` + confetti automáticamente cuando el trigger `sync_user_subscription` ya actualizó `users`. Si supera el timeout (60 s) deja el estado pending y el user puede simplemente refrescar.

### Gestión post-venta (cancelar, reactivar, cambiar plan)

La web **no expone** APIs públicas para que el user opere sobre su suscripción. El flujo actual es manual asistido:

- **User Plus** en el modal de configuración → tab Suscripción ve los botones:
  - **Cancelar suscripción** / **Solicitar reactivación** (según `cancel_at_period_end`).
  - **Solicitar cambio de plan** abre un modal con las 4 cadencias, marca la actual y al seleccionar otra dispara un `mailto:` con el plan elegido pre-llenado.
- Todos los botones terminan en un `mailto:` a `soporte@somosrial.com` con asunto y body ya redactados.
- **Admin** procesa la solicitud desde el módulo `/admin/clientes/[id]`, que llama a:
  - `POST /api/admin/subscription/cancel` → setea `cancel_at_period_end=true`, `cancelled_at=now()`, mergea metadata con `admin_action: { type: 'cancel', at }`. **No** cambia `status` ni toca Venflow (la cancelación real en Venflow se hace fuera, vía dashboard de Venflow o soporte).
  - `POST /api/admin/subscription/reactivate` → revierte el flag.

Ninguna de estas rutas toca `users` directamente: confían en el trigger.

### Cron de expiración

Endpoint: `GET /api/cron/expire-subscriptions` (`src/app/api/cron/expire-subscriptions/route.ts`), invocado por Vercel Cron diariamente a las **00:05 UTC** (ver `vercel.json`).

Auth: header `Authorization: Bearer ${CRON_SECRET}`.

Lógica: busca filas `subscriptions` con `provider='venflow'`, `status='active'`, `cancel_at_period_end=true` y `current_period_end <= now()`, y las marca como `status='expired'`. El trigger propaga a `users`.

Esto convive con `expire_overdue_subscriptions()` (pg_cron, descrito en la sección de mobile más abajo): ambos cubren el mismo gap pero con criterios ligeramente distintos. El cron de Vercel solo expira lo que ya estaba marcado para cancelar; la función SQL es defensiva y captura cualquier sub vencida sin marca, en cualquier provider.

### Variables de entorno

| Var | Uso |
|-----|-----|
| `VENFLOW_API_KEY` | Auth contra la API de Venflow al crear sessions de checkout. |
| `VENFLOW_WEBHOOK_SECRET` | Verificación del header `x-webhook-secret` en webhooks entrantes. |
| `VENFLOW_CHECKOUT_URL_BASE` | Base URL del checkout de Venflow al que se redirige. |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS en `createAdminClient()` para todas las rutas server-side. |
| `CRON_SECRET` | Bearer token que Vercel Cron envía al endpoint de expiración. |

### Mapa de archivos

```
src/app/api/venflow/checkout/route.ts              # POST → crea session en Venflow
src/app/api/venflow/webhooks/route.ts              # POST → router de eventos
src/lib/venflow/client.ts                          # cliente HTTP contra Venflow API
src/lib/venflow/webhooks.ts                        # handlers (1 por evento)
src/lib/venflow/types.ts                           # tipos de eventos
src/lib/venflow/plans.ts                           # mapping cadence ↔ plan_id Venflow
src/views/dashboard/PlanView.tsx                   # tabla de planes en /app/plan
src/views/dashboard/CheckoutView.tsx               # UI de selección cadencia + moneda
src/views/dashboard/CheckoutResultView.tsx         # status page con polling + confetti
src/views/dashboard/SettingsModal.tsx              # gestión post-venta vía mailto
src/app/api/admin/subscription/cancel/route.ts     # admin: cancelar (cancel_at_period_end)
src/app/api/admin/subscription/reactivate/route.ts # admin: reactivar
src/app/api/cron/expire-subscriptions/route.ts     # cron: marcar expired
vercel.json                                        # schedule del cron
```

## Web app (Stripe USD): cómo está implementado

Canal paralelo a Venflow, para pagos internacionales en USD con tarjeta. Comparte la misma capa de datos (`subscriptions` con `provider='stripe'`) y la misma UI de checkout/result, solo cambia el provider al que se llama.

### Flujo de checkout

1. En `/app/checkout` el user elige la opción **"Suscribirse con otra moneda"**.
2. Click en "Continuar" → `POST /api/stripe/checkout` con `{ cadence }`.
3. La ruta `src/app/api/stripe/checkout/route.ts`:
   - Valida cadencia + auth.
   - Reusa el `provider_customer_id` si el user ya tiene una sub en Stripe; si no, crea un **Stripe Customer** con `metadata.user_id` apuntando a Supabase.
   - Crea un **Checkout Session** en modo `subscription` con `allow_promotion_codes: true`, `client_reference_id = user.id`, success/cancel URLs hacia `/app/checkout/result`.
   - Devuelve `{ url }` del checkout.
4. Browser redirige a `checkout.stripe.com`. El user paga con tarjeta (Apple/Google Pay también soportados).
5. Stripe redirige a `/app/checkout/result?status=success|cancelled`. El polling del `CheckoutResultView` espera a que el trigger `sync_user_subscription` propague `users.subscription_plan='plus'` (mismo polling que para Venflow) y dispara confetti.

### Webhook receiver

Endpoint: `POST /api/stripe/webhooks` — `src/app/api/stripe/webhooks/route.ts`.

Auth: signature criptográfica vía `stripe.webhooks.constructEvent()` contra `STRIPE_WEBHOOK_SECRET`. Si falla, 400. Si falta la env var, 500.

| Evento Stripe | Handler | Acción |
|---|---|---|
| `checkout.session.completed` | `handleCheckoutSessionCompleted` | UPSERT en `subscriptions` con `status='active'`, dates, `provider_customer_id`, `provider_subscription_id`, `provider_product_id=price.id`. Es el único evento que crea la fila. |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Sync de `status`, `billing_cycle`, `cancel_at_period_end`, `cancelled_at`, dates, `provider_product_id` (en caso de plan change). |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | `status='expired'`, `cancel_at_period_end=false`. |
| `invoice.paid` | `handleInvoicePaid` | INSERT en `subscription_payments` con `amount`, `currency`, `provider_invoice_id`, `hosted_invoice_url`. |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | `status='past_due'`. |

Implementación: `src/lib/stripe/webhooks.ts`. Cliente: `src/lib/stripe/client.ts`. Mapping cadence ↔ price ID: `src/lib/stripe/plans.ts`.

A diferencia de Venflow, Stripe entrega eventos en orden lógico: `checkout.session.completed` siempre llega primero. Esto simplifica los handlers — no necesitamos los patrones tolerantes a out-of-order de Venflow.

Nota sobre el SDK: Stripe v22 movió `current_period_start/end` desde el nivel `Subscription` a `subscription.items.data[0]`. Helpers `getPeriodStart()` / `getPeriodEnd()` encapsulan este lookup.

### Gestión post-venta: Customer Portal

Los usuarios con `provider='stripe'` no usan el flujo mailto del SettingsModal. En su lugar, el modal muestra un único botón **"Administrar suscripción"** que:

1. Llama a `POST /api/stripe/portal` (`src/app/api/stripe/portal/route.ts`).
2. La ruta crea un **Billing Portal Session** para el customer del user y devuelve `{ url }`.
3. El user es redirigido al portal hosted de Stripe donde puede:
   - Cancelar la suscripción (queda con `cancel_at_period_end=true` hasta el período).
   - Cambiar de plan entre las 4 cadencias (Stripe gestiona el prorrateo).
   - Actualizar método de pago.
   - Descargar facturas (PDF).

Todos los cambios disparan `customer.subscription.updated` y se reflejan automáticamente en `subscriptions`.

**Configuración requerida** en Stripe Dashboard → Settings → Billing → Customer portal:
- Habilitar "Cancel subscriptions".
- Habilitar "Switch plans" con las 4 prices.
- Habilitar "Update payment method".
- Habilitar "View invoice history".

### Promo codes / cupones

El campo "Add promotion code" aparece automáticamente en el Checkout cuando `allow_promotion_codes: true` está habilitado en la session (ya lo está en nuestro código). Los cupones se crean desde Stripe Dashboard → Products → Coupons → "Create promotion code". No requiere cambios de código para usarlos.

### Variables de entorno

| Var | Uso |
|-----|-----|
| `STRIPE_SECRET_KEY` | Auth contra la API de Stripe (server-side). `sk_test_*` en sandbox, `sk_live_*` en prod. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret para verificar webhooks. Único por endpoint, configurado en Stripe Dashboard → Developers → Webhooks. |
| `STRIPE_PRICE_MONTHLY` | Price ID en Stripe para la cadencia mensual (`price_*`). |
| `STRIPE_PRICE_QUARTERLY` | Price ID trimestral. |
| `STRIPE_PRICE_SEMIANNUAL` | Price ID semestral. |
| `STRIPE_PRICE_YEARLY` | Price ID anual. |

Los precios USD de cada cadencia (4.99 / 13.49 / 23.99 / 41.99) viven en Stripe, no en código — el frontend solo muestra los valores hardcodeados en `CheckoutView`/`PlanView`. Si cambian los precios en Stripe, actualizar también el `cadenceCatalog` del front.

### Mapa de archivos

```
src/lib/stripe/client.ts                       # SDK instance (cached)
src/lib/stripe/plans.ts                        # mapping Cadence ↔ STRIPE_PRICE_*
src/lib/stripe/types.ts                        # tipos angostos para eventos
src/lib/stripe/webhooks.ts                     # handlers (5 eventos)
src/app/api/stripe/checkout/route.ts           # POST → Checkout Session
src/app/api/stripe/webhooks/route.ts           # POST → signature + router
src/app/api/stripe/portal/route.ts             # POST → Billing Portal Session
src/views/dashboard/CheckoutView.tsx           # branch venflow/stripe según moneda
src/views/dashboard/SettingsModal.tsx          # "Administrar suscripción" → portal
```

### Diferencias con Venflow

| Aspecto | Venflow | Stripe |
|---------|---------|--------|
| Moneda | VES | USD |
| Auth de webhook | Header `x-webhook-secret` plain | Signature criptográfica HMAC-SHA256 |
| Orden de eventos | No determinista (handlers tolerantes) | Determinista |
| IVA | 16% aplicado en el front | No aplicado (precios sin tax) |
| Gestión post-venta | Mailto a soporte → admin opera vía `/admin/clientes/[id]` | Self-service vía Customer Portal |
| Cron de expiración | Vercel Cron sobre `/api/cron/expire-subscriptions` | `customer.subscription.deleted` lo gestiona en tiempo real |

## Lecciones del testing end-to-end

Durante las pruebas con sandbox de Apple (subscriber `tuxedo@revenuecat.com`) verificamos el ciclo completo *purchase → cancel → expiration*. Hallazgos importantes para cualquier consumidor del sistema:

### 1. Validar `expires_at` siempre, incluso si `status='active'`

Los webhooks de `EXPIRATION` pueden tardar en llegar (ver punto 2). Mientras tanto, `subscriptions.status` queda en `active` aunque `expires_at` ya esté en el pasado. **Cualquier consumidor (app móvil, web, dashboard) debe validar también `expires_at > now()` antes de conceder acceso.**

Patrón recomendado para chequear "is plus":

```ts
function isPlus(row: { plan: string; status: string; expires_at: string | null }): boolean {
  if (row.plan !== 'plus') return false;
  if (row.status !== 'active' && row.status !== 'trialing') return false;
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return false;
  return true;
}
```

La app móvil ya implementa esto en `subscription-store.ts → computeIsPlus()`. Si el web replica la lógica, asegúrate de incluir el check de `expires_at`.

### 2. Apple sandbox puede demorar el webhook `EXPIRATION`

En sandbox Apple envía el evento `EXPIRATION` con **retraso de 5+ minutos** después del fin del período. Esto es comportamiento conocido del entorno de pruebas, no un bug. En producción los webhooks de Apple son más confiables, aunque ocasionalmente también se demoran.

Implicaciones:
- No asumir que `EXPIRATION` llegará puntualmente al `expires_at`.
- Por eso el check defensivo del punto 1 es **obligatorio** en el cliente.
- El webhook eventualmente llega y normaliza el estado (`status='expired'`) — solo hay que tolerar la ventana de inconsistencia.

### 3. Job de mantenimiento (safety net) — ya configurado

Como red de seguridad contra webhooks que nunca lleguen (caso raro pero posible), hay un cron job ejecutándose cada hora vía `pg_cron` que marca como expiradas las suscripciones vencidas.

**Función:** `public.expire_overdue_subscriptions() RETURNS integer`

```sql
CREATE OR REPLACE FUNCTION public.expire_overdue_subscriptions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE public.subscriptions
  SET status = 'expired',
      updated_at = now()
  WHERE status IN ('active', 'trialing')
    AND expires_at IS NOT NULL
    AND expires_at < now() - INTERVAL '1 hour';  -- buffer por timezone / clock skew

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
```

**Cron schedule** (`cron.job` `jobid=1`, `jobname='expire-overdue-subscriptions'`):

```sql
SELECT cron.schedule(
  'expire-overdue-subscriptions',
  '0 * * * *',  -- cada hora en punto UTC
  $$SELECT public.expire_overdue_subscriptions();$$
);
```

El trigger `sync_user_subscription` propaga `status='expired'` a `users.subscription_status`, garantizando que los reportes/queries que dependen de `users` sean confiables sin necesidad del check defensivo de `expires_at`.

**Monitoreo:**

```sql
-- Últimas ejecuciones del job
SELECT * FROM cron.job_run_details
WHERE jobid = 1
ORDER BY start_time DESC
LIMIT 10;

-- Ejecución manual (devuelve cuántas filas afectó)
SELECT public.expire_overdue_subscriptions();
```

## Enforcement de límites del plan free

El enforcement de los caps definidos en `subscription_plans.limits` está implementado en la app móvil con un patrón consistente:

1. **Hook de límite por feature** — calcula `used`, `limit` y `canCreate*` consultando Supabase. Recibe `isPlus` del subscription store; si es Plus, devuelve `canCreate=true` sin queries adicionales.
2. **Pre-check en el punto de entrada** — al tapar "guardar" (o al montar la pantalla de creación, según UX), abre un `BottomSheet` con CTA a Plus si el cap fue alcanzado.
3. **Defense server-side en el mutation** — antes del `INSERT`, vuelve a consultar el conteo y lanza `Error` con mensaje user-facing. Garantía: aunque el cliente se salte el pre-check, el insert falla.
4. **Indicador centralizado** — la pantalla `/settings/usage` muestra el estado de TODOS los límites con barras de progreso. Los pills inline en cada feature fueron removidos (single source of truth visual).
5. **Red dot en menú** — el item "Uso" en Configuración muestra un puntico rojo si **algún** cap está al tope.

### Mapa de enforcement por límite

| Limit | Cap free | Cómo se cuenta | Hook |
|---|---:|---|---|
| `transactions_per_month` | 30 | `transactions` table, mes actual, `commission_transfer_id IS NULL` | `useTransactionLimit` |
| `voice_records_per_month` | 5 | `subscription_usage.voice_records_count` vía RPC | `useVoiceLimit` |
| `voice_massive_dictation` | 1 | `subscription_usage.massive_dictation_count` vía RPC | `useVoiceLimit` |
| `accounts_total` / `_national` / `_international` | 5/3/2 | `accounts` table, excluye Efectivo (ver abajo) | `useAccountLimit` |
| `templates` (manuales) | 5 | `transaction_templates` con `recurrence_pattern='never'` | `useTemplateLimit` |
| Templates programados | 5 | `transaction_templates` con `recurrence_pattern <> 'never' AND status='active'` | `useTemplateLimit` |
| `saved_lists` | 3 | `shopping_lists` del mes actual, `deleted_at IS NULL` | `useShoppingListLimit` |
| `list_items_per_list` | 20 | `shopping_list_items` del listId, sin enforcement de delete | `useShoppingListLimit` (constante exportada) |

### Caso especial: voice usa contadores en `subscription_usage`

Las grabaciones por voz **no son rows persistentes** (a diferencia de tx, accounts, etc), así que necesitan contadores explícitos. Se incrementan con un RPC atómico que tambén aplica el cap server-side:

```sql
-- Lee los counts del mes para auth.uid()
get_voice_usage() RETURNS TABLE(voice_records_count int, massive_dictation_count int)

-- UPSERT atómico en subscription_usage(user_id, month, year)
-- Si el user es free y el contador a incrementar ya está al cap,
-- el RPC retorna los counts actuales SIN incrementar (silent no-op).
-- Esto es defensa en profundidad: aunque el cliente se equivoque,
-- el contador nunca crece más allá del cap.
increment_voice_usage(p_is_massive boolean) RETURNS TABLE(voice_records_count int, massive_dictation_count int)
```

Una grabación cuenta como `voice_records_count` si produce 1 tx, o como `massive_dictation_count` si produce >1 tx. La determinación es **post-hoc** (después de la transcripción + extracción), no pre-declarada por el usuario.

### Caso especial: Efectivo (Bs y USD) no cuenta para el cap de cuentas

La regla del plan free es "5 cuentas (3 nat + 2 int). Efectivo USD y VES no cuentan". La detección:

- **Efectivo Bs** — `bank_key = 'efectivo-bs'` (canónico, en `NATIONAL_BANKS` del catálogo)
- **Efectivo USD** — heurística porque no hay key canónico:
  - `bank_key = 'efectivo-usd'` (reservado para futuros) **O**
  - `type = 'international' AND bank_key IS NULL AND name ILIKE '%efectivo%'`

El conteo se hace con queries paralelas (total + cash) y la resta da el conteo enforced. La defense en `useCreateAccount` aplica el mismo criterio.

### Patrón "Plus cortesía" (grace period)

Para introducir enforcement sin penalizar a users existentes que ya excedían algún cap, se otorgó Plus gratis hasta fin de mes mediante inserción masiva en `subscriptions`:

```sql
INSERT INTO subscriptions (
  user_id, plan_id, status, billing_cycle,
  provider, provider_customer_id,
  started_at, current_period_start, current_period_end, expires_at,
  metadata
)
SELECT
  c.id,
  (SELECT id FROM subscription_plans WHERE name = 'plus'),
  'active', 'monthly',
  'manual',                            -- provider distintivo
  c.id::text,                          -- user_id as text para conflict target
  now(), now(),
  '<fin de mes>'::timestamptz,
  '<fin de mes>'::timestamptz,
  jsonb_build_object(
    'reason', 'courtesy_grace_period', -- marcador para detectar y comunicar
    'auto_revoke', true,
    'granted_at', now()
  )
FROM candidates c
ON CONFLICT (provider, provider_customer_id) DO NOTHING;
```

El cron `expire-overdue-subscriptions` revoca automáticamente cuando `expires_at < now() - 1h`. El cliente detecta `metadata.reason='courtesy_grace_period'` y muestra un sheet de bienvenida 1 vez por user (marcador en AsyncStorage: `courtesy_grant_shown_<user_id>`).

### Estructura del código

```
src/features/<feature>/hooks/use-<feature>-limit.ts   # hook con queries + canCreate
src/features/<feature>/data/mutations.ts              # defense server-side antes del INSERT
app/<feature>/new.tsx                                 # pre-check + modal + (opcional) banner inline
app/settings/usage.tsx                                # vista centralizada con barras
src/shared/components/courtesy-welcome-sheet.tsx      # sheet 1x para Plus cortesía
src/shared/hooks/use-courtesy-grant.ts                # detección del flag en subscriptions
```

## Reglas y constraints importantes

1. **RLS está activo en todas las tablas.** Los users solo leen sus propias filas. Para escrituras desde backend, usar **service role key** (bypass RLS).
2. **Nunca borrar de `users` si tiene subs/payments asociados** — usa `ON DELETE CASCADE` en `subscriptions.user_id` así que se borrarán también. Si el user volverá, mejor `is_active=false` o similar.
3. **Plan `pro` está desactivado** — no asignarlo a nuevos users.
4. **Múltiples provedores simultáneos están permitidos** por design (un user puede tener apple + venflow). La constraint unique permite la combinación.
5. **Tu trigger actualiza `users` con el último cambio**, no con el "mejor". Si necesitas saber "este user tiene algún plan activo", usa el RPC `user_has_active_plan` que consulta directamente `subscriptions`.

## Reglas de Apple / Google

- **No menciones, promuevas o linkees al pago web desde la app iOS.** Apple lo rechaza (regla 3.1.1).
- En la app iOS solo se muestran planes vendidos vía StoreKit/RC.
- En el sitio web puede haber Venflow + cualquier otro método.
- Si un user paga por web, al abrir la app iOS verá su plan activo (gracias a Supabase shared). Eso sí está permitido — Apple solo restringe la promoción del pago externo desde dentro de la app.

## Información adicional

- **Project ID Supabase:** `yxkoiradnswnfizcirsc`
- **Project URL:** `https://yxkoiradnswnfizcirsc.supabase.co`
- **App bundle iOS:** `com.adimtnez.rial`
- **Entitlement RevenueCat:** `Rial Plus`
- **Offering RevenueCat:** `default`
- **Package identifiers RC:** `$rc_monthly`, `$rc_three_month`, `$rc_six_month`, `$rc_annual`

Para preguntas o dudas, contactar al equipo móvil.
