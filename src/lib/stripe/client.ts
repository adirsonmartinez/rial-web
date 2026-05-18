import Stripe from "stripe";

let cachedClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (cachedClient) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe no está configurado: falta STRIPE_SECRET_KEY");
  }

  cachedClient = new Stripe(secretKey, {
    appInfo: { name: "rial-web" },
  });
  return cachedClient;
}
