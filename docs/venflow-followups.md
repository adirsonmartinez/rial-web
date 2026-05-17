# Venflow — Recomendaciones a futuro

Backlog de mejoras identificadas durante el audit de la integración Venflow vs. `docs/subscriptions-architecture.md` (escrito por el equipo móvil). Lo que ya quedó implementado en la base actual cumple para el flujo de testing y producción inicial; este doc lista lo que conviene atacar más adelante.

## 1. Sync en tiempo real con la app móvil para pagos Venflow

**Problema:** cuando un user paga por Venflow desde el web (primera compra o cuota de domiciliación), Supabase queda actualizado al instante vía nuestro webhook + trigger `sync_user_subscription`. Pero la **app móvil no se entera** hasta que el user:

- Inicia sesión
- Mueve la app a foreground (listener de AppState)
- Reabre la app

Esto es porque los listeners de refresh del store de suscripción (`subscription-store.ts → useRialPlus()`) están atados a eventos de **RevenueCat** (`customerInfoUpdateListener`), que solo se disparan para compras Apple/Google. Venflow no atraviesa RC.

**Recomendación:** suscribir el store móvil a un canal de **Supabase Realtime** sobre la tabla `subscriptions`, filtrado por `user_id = auth.uid()`. Cuando llega un INSERT/UPDATE relacionado al usuario, refrescar el cómputo de `isPlus()`.

**Por qué importa:** la mejor UX es que el user pague por web → vuelva al móvil → vea Plus al instante. Hoy tiene que reabrir la app.

**Por qué no se hizo ahora:** requiere cambios en la app móvil (no algo que podamos resolver desde el web). Para el flujo de testing actual aceptamos la latencia.

**Quién lo implementa:** equipo móvil. Lado web no requiere cambios — `subscriptions` ya tiene Realtime habilitado por defecto en Supabase.

**Esbozo del cambio en RN:**

```ts
const channel = supabase
  .channel(`subscription-${userId}`)
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${userId}` },
    () => refreshSubscriptionState(),
  )
  .subscribe();
```

## 2. Refund / chargeback flow

**Problema:** Venflow **no emite evento de refund** en su catálogo de webhooks. Los refunds o disputas tienen que manejarse manualmente.

**Recomendación:** agregar al admin (`/admin/clientes/[id]`) una acción "Marcar como reembolsado" que dispare un endpoint `POST /api/admin/subscription/refund` con la siguiente lógica (alineada con la doc):

```sql
UPDATE subscriptions
SET status = 'cancelled',
    cancelled_at = now(),
    metadata = metadata || jsonb_build_object(
      'refund', true,
      'refund_reason', :reason,
      'refund_admin', :admin_id
    )
WHERE provider = 'venflow'
  AND provider_customer_id = :customer_id;

UPDATE subscription_payments
SET status = 'refunded',
    refunded_at = now()
WHERE id = :payment_id;
```

**Por qué no se hizo ahora:** ningún caso real reportado todavía. Conviene esperar al primer refund para definir exactamente qué campos pedirle al admin y si queremos notificar al user.

## 3. Decidir el destino del cron `expire-subscriptions`

**Contexto:** el equipo móvil ya tiene un `pg_cron` job (`jobid=1`, `expire_overdue_subscriptions`) que marca subs como `expired` cuando `expires_at < now() - 1h`, sin importar provider.

Nuestro cron web (`/api/cron/expire-subscriptions`) hace algo parecido pero más restringido: solo subs `venflow` con `cancel_at_period_end=true`. Ahora que **siempre escribimos `expires_at`** (fix de este sprint), el `pg_cron` del mobile cubre nuestras filas también.

**Recomendación:** confirmar con el equipo móvil y luego **eliminar el cron web**. La doc apunta a `expire_overdue_subscriptions()` como single safety net.

**Por qué no se hizo ahora:** queríamos verificar primero en producción que el `expires_at` se está escribiendo correctamente desde los webhooks antes de desactivar nuestra red local. Después de ~2 semanas de tráfico real se puede borrar.

**Preguntas para el equipo móvil:**

1. ¿Confirman que `expire_overdue_subscriptions()` corre cada hora y cubre todos los providers incluyendo `venflow`?
2. ¿Algún reporte/dashboard interno consume nuestro endpoint web del cron?

## 4. Manejo de `INVOICE_UPDATE_EVENT`

**Problema:** hoy solo lo loggeamos. Venflow puede usarlo para señalar `invoice.status = 'uncollectible'` (cuando un cobro definitivamente falló) o `'paid'` (redundante con `PAYMENT_SUCCESS_EVENT`).

**Recomendación:** agregar handler que:
- `status='uncollectible'` → marcar `subscriptions.status='past_due'` (similar a `PAYMENT_FAILED_EVENT`).
- `status='paid'` → no-op (ya lo cubre `PAYMENT_SUCCESS_EVENT`).
- Otros → log y skip.

**Por qué no se hizo ahora:** el flujo de fallo ya está cubierto por `PAYMENT_FAILED_EVENT` (que ya pone `past_due`). El `uncollectible` sería un fallback adicional pero no crítico.

## 5. Polling / verificación post-checkout en el web

**Problema:** después de que el user completa el checkout en Venflow y vuelve a `/app/checkout/success` (o donde se redirija), el webhook puede no haber llegado todavía. El user puede ver "no estás en Plus" en el dashboard si refresca muy rápido.

**Recomendación:** en la pantalla post-checkout, hacer **polling de la fila de subscriptions** con backoff (3–6 intentos cada 2s) y mostrar un loader hasta confirmar `status='active'` y `plan='plus'`. El móvil hace algo equivalente con `Purchases.purchasePackage()` + polling de hasta 6 intentos.

**Por qué no se hizo ahora:** no hemos validado cuánto tarda el webhook en producción. Si llega en <1s típicamente, no vale la complejidad. Si llega en 5–10s, vale.

**Acción previa:** medir latencia real del webhook después de los primeros 20–30 pagos de producción.

## 6. Tests automatizados de los handlers de webhook

Hoy no hay tests para `webhooks.ts`. Conviene agregar:

- Tests unitarios de cada handler con un mock de `AdminSupabaseClient`
- Test de orden de eventos: `SUBSCRIPTION_CREATE` antes de `PAYMENT_SUCCESS` y viceversa
- Test de idempotencia: re-procesar el mismo evento dos veces no duplica payments ni rompe subs
- Test del merge de `metadata` (que no sobrescribe llaves previas)

**Por qué no se hizo ahora:** el proyecto no tiene infraestructura de tests todavía. Cuando se monte (vitest + supabase test client), estos son los primeros candidatos.

## 7. Limpiar tipos de `event.payment.amount`

`VenflowEventPayment.amount` está tipado como `string` en `src/lib/venflow/types.ts:131`. Eso obliga a hacer `Number(event.payment.amount)` en cada insert. Si Venflow garantiza que siempre es un decimal con punto, podemos:

- Cambiar el tipo a `number` (parseando en el deserializer del webhook), o
- Mantenerlo string pero agregar un helper `parseVenflowAmount()` con validación.

**Por qué no se hizo ahora:** trivial pero requiere coordinar el cambio con cualquier consumidor que ya use el tipo.

---

## Referencias

- Doc principal: [`docs/subscriptions-architecture.md`](./subscriptions-architecture.md)
- Implementación actual: `src/lib/venflow/webhooks.ts`, `src/app/api/venflow/webhooks/route.ts`
- Catálogo de eventos Venflow: ver imagen compartida por el equipo (USER_CREATE, SUBSCRIPTION_CREATE/CANCELLED, INVOICE_CREATE/UPDATE, PAYMENT_SUCCESS/FAILED)
