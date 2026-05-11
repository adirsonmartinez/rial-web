import type {
  CreateCheckoutSessionParams,
  VenflowCheckoutSession,
  VenflowErrorBody,
} from "./types";

const DEFAULT_API_BASE = "https://api.venflow.app/v1";

function readConfig() {
  const apiBase = process.env.VENFLOW_API_BASE ?? DEFAULT_API_BASE;
  const secretKey = process.env.VENFLOW_SECRET_KEY;
  const organizationId = process.env.VENFLOW_ORG_ID;

  if (!secretKey || !organizationId) {
    throw new Error(
      "Venflow no está configurado: faltan VENFLOW_SECRET_KEY o VENFLOW_ORG_ID",
    );
  }

  return { apiBase, secretKey, organizationId };
}

export class VenflowApiError extends Error {
  readonly status: number;
  readonly body: VenflowErrorBody | null;

  constructor(status: number, body: VenflowErrorBody | null) {
    super(body?.message ?? `Venflow API error (HTTP ${status})`);
    this.name = "VenflowApiError";
    this.status = status;
    this.body = body;
  }
}

async function venflowFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { apiBase, secretKey, organizationId } = readConfig();

  const res = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      "Api-Key": secretKey,
      Organization: organizationId,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res
      .json()
      .catch(() => null)) as VenflowErrorBody | null;
    throw new VenflowApiError(res.status, body);
  }

  return res.json() as Promise<T>;
}

export function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<VenflowCheckoutSession> {
  return venflowFetch<VenflowCheckoutSession>("/checkout/sessions", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
