import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  handlePaymentFailed,
  handlePaymentSuccess,
  handleSubscriptionCancelled,
} from "@/lib/venflow/webhooks";
import type { VenflowWebhookEvent } from "@/lib/venflow/types";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.VENFLOW_WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.error("[venflow webhook] VENFLOW_WEBHOOK_SECRET no configurado");
    return NextResponse.json(
      { error: "Webhook no configurado" },
      { status: 500 },
    );
  }

  const providedSecret = request.headers.get("x-webhook-secret");
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: VenflowWebhookEvent;
  try {
    event = (await request.json()) as VenflowWebhookEvent;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!event?.eventType) {
    return NextResponse.json(
      { error: "Falta eventType en el payload" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.eventType) {
      case "PAYMENT_SUCCESS_EVENT":
        await handlePaymentSuccess(event, supabase);
        break;
      case "SUBSCRIPTION_CANCELLED_EVENT":
        await handleSubscriptionCancelled(event, supabase);
        break;
      case "PAYMENT_FAILED_EVENT":
        await handlePaymentFailed(event, supabase);
        break;
      case "USER_CREATE_EVENT":
      case "SUBSCRIPTION_CREATE_EVENT":
      case "INVOICE_CREATE_EVENT":
      case "INVOICE_UPDATE_EVENT":
        console.log("[venflow webhook] info event received:", event.eventType);
        break;
      default: {
        const unknownEvent = event as { eventType: string };
        console.log(
          "[venflow webhook] unknown event type:",
          unknownEvent.eventType,
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[venflow webhook] error processing",
      event.eventType,
      err,
    );
    return NextResponse.json(
      { received: true, error: "processing_failed", message },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
