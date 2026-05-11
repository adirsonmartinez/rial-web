// ─── Common API shapes ──────────────────────────────────────────────

export interface VenflowListResponse<T> {
  object: "list";
  data: T[];
  has_more: boolean;
  url: string;
}

export interface VenflowErrorBody {
  code: string;
  message: string;
  details: unknown | null;
}

// ─── Resources (from REST API) ──────────────────────────────────────

export type VenflowPlanFrequency =
  | "monthly"
  | "quarterly"
  | "biannual"
  | "annual";

export interface VenflowProduct {
  id: string;
  object: "product";
  name: string;
  description: string | null;
  active: boolean;
  external_id: string | null;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface VenflowPlan {
  id: string;
  object: "plan";
  name: string;
  description: string | null;
  price: number;
  frequency: VenflowPlanFrequency;
  is_taxes_included: boolean;
  product_id: string | null;
  external_id: string | null;
  active: boolean;
  livemode: boolean;
  created: number;
  updated: number;
}

export interface VenflowCheckoutSession {
  id: string;
  object: "checkout.session";
  status: "pending" | "completed" | "expired" | string;
  url: string;
  customer: string | null;
  amount_total: number;
  redirect_url: string | null;
  expires_at: number;
  metadata: Record<string, unknown>;
  plan: {
    id: string;
    name: string;
    amount: number;
  };
}

export type VenflowMetadataValue = string | number | boolean | null;

export interface CreateCheckoutSessionParams {
  plan: string;
  redirect_url?: string;
  customer?: string;
  metadata?: Record<string, VenflowMetadataValue>;
}

// ─── Webhook event payloads ─────────────────────────────────────────

export type VenflowSubscriptionStatus =
  | "active"
  | "inactive"
  | "cancelled"
  | "pending";

export type VenflowPaymentStatus = "pending" | "completed" | "failed";

export type VenflowInvoiceStatus =
  | "open"
  | "paid"
  | "uncollectible"
  | "draft";

export type VenflowCancellationType =
  | "scheduled_cancellation"
  | "manual"
  | "payment_failure";

export interface VenflowEventClient {
  id: string;
  email: string;
  name: string;
  lastName: string;
}

export interface VenflowEventSubscription {
  id: string;
  status: VenflowSubscriptionStatus | string;
  externalId: string | null;
}

export interface VenflowEventCancellationReason {
  type: VenflowCancellationType;
  scheduledDate?: string;
  message?: string;
}

export interface VenflowEventInvoice {
  id: string;
  status: VenflowInvoiceStatus;
  total: string;
  amountDue: string;
}

export interface VenflowEventPayment {
  id: string;
  status: VenflowPaymentStatus;
  retries: number;
  gatewayUUID: string;
  errorMessage: string | null;
  amount: string;
}

export interface VenflowEventSession {
  id: string;
  metadata: Record<string, unknown> | null;
}

export interface UserCreateEvent {
  eventType: "USER_CREATE_EVENT";
  client: VenflowEventClient;
}

export interface SubscriptionCreateEvent {
  eventType: "SUBSCRIPTION_CREATE_EVENT";
  client: VenflowEventClient;
  subscription: VenflowEventSubscription;
}

export interface SubscriptionCancelledEvent {
  eventType: "SUBSCRIPTION_CANCELLED_EVENT";
  client: VenflowEventClient;
  subscription: VenflowEventSubscription & {
    cancellationReason: VenflowEventCancellationReason;
  };
}

export interface InvoiceCreateEvent {
  eventType: "INVOICE_CREATE_EVENT";
  client: VenflowEventClient;
  subscription: VenflowEventSubscription;
  invoice: VenflowEventInvoice;
}

export interface InvoiceUpdateEvent {
  eventType: "INVOICE_UPDATE_EVENT";
  client: VenflowEventClient;
  subscription: VenflowEventSubscription;
  invoice: VenflowEventInvoice;
}

export interface PaymentSuccessEvent {
  eventType: "PAYMENT_SUCCESS_EVENT";
  client: VenflowEventClient;
  payment: VenflowEventPayment;
  session?: VenflowEventSession;
}

export interface PaymentFailedEvent {
  eventType: "PAYMENT_FAILED_EVENT";
  client: VenflowEventClient;
  payment: VenflowEventPayment;
  session?: VenflowEventSession;
}

export type VenflowWebhookEvent =
  | UserCreateEvent
  | SubscriptionCreateEvent
  | SubscriptionCancelledEvent
  | InvoiceCreateEvent
  | InvoiceUpdateEvent
  | PaymentSuccessEvent
  | PaymentFailedEvent;

export type VenflowEventType = VenflowWebhookEvent["eventType"];
