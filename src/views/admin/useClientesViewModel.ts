"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ClienteBillingCycleFilter,
  ClienteProviderFilter,
  ClienteStatus,
  ListClientesResult,
} from "@/lib/admin/clientes";

export type UseClientesArgs = {
  initialData: ListClientesResult;
};

export type ClientesViewModel = {
  data: ListClientesResult | null;
  loading: boolean;
  error: string | null;
  search: string;
  billingCycle: ClienteBillingCycleFilter;
  status: ClienteStatus;
  provider: ClienteProviderFilter;
  page: number;
  setSearch: (value: string) => void;
  setBillingCycle: (value: ClienteBillingCycleFilter) => void;
  setStatus: (value: ClienteStatus) => void;
  setProvider: (value: ClienteProviderFilter) => void;
  goToPage: (value: number) => void;
};

export function useClientesViewModel({
  initialData,
}: UseClientesArgs): ClientesViewModel {
  const [data, setData] = useState<ListClientesResult | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [billingCycle, setBillingCycleState] =
    useState<ClienteBillingCycleFilter>("all");
  const [status, setStatusState] = useState<ClienteStatus>("all");
  const [provider, setProviderState] =
    useState<ClienteProviderFilter>("all");
  const [page, setPage] = useState(1);
  const firstFetchRef = useRef(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch((prev) => {
        const next = search.trim();
        return prev === next ? prev : next;
      });
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (firstFetchRef.current) {
      firstFetchRef.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (billingCycle !== "all") params.set("cycle", billingCycle);
    if (status !== "all") params.set("status", status);
    if (provider !== "all") params.set("provider", provider);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    const url = `/api/admin/clientes${query ? `?${query}` : ""}`;
    const ac = new AbortController();

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error ?? `Error ${res.status}`);
        }
        const json = (await res.json()) as ListClientesResult;
        setData(json);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [debouncedSearch, billingCycle, status, provider, page]);

  return {
    data,
    loading,
    error,
    search,
    billingCycle,
    status,
    provider,
    page,
    setSearch: (value) => {
      setSearch(value);
      setPage(1);
    },
    setBillingCycle: (value) => {
      setBillingCycleState(value);
      setPage(1);
    },
    setStatus: (value) => {
      setStatusState(value);
      setPage(1);
    },
    setProvider: (value) => {
      setProviderState(value);
      setPage(1);
    },
    goToPage: (value) => setPage(Math.max(1, value)),
  };
}
