const BASE_URL = "https://formflow-api.lukmanulhakim.com/api";

// ── Token helpers ──────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

function clearToken(): void {
  localStorage.removeItem("auth_token");
}

// ── API response shape ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Generic fetch wrapper ──────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const method = (options.method ?? "GET").toUpperCase();
  if (method !== "GET" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }

  return body.data;
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: unknown }> {
  const data = await apiFetch<{ token: string; user: unknown }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<null>("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

export async function getMe(): Promise<unknown> {
  return apiFetch<unknown>("/auth/me");
}

// ── Users ──────────────────────────────────────────────────────────────────────

export interface GetUsersParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getUsers(params?: GetUsersParams): Promise<unknown> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.role) searchParams.set("role", params.role);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<unknown>(`/users${qs ? `?${qs}` : ""}`);
}

export async function getUser(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/users/${id}`);
}

export async function createUser(data: unknown): Promise<unknown> {
  return apiFetch<unknown>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: string, data: unknown): Promise<unknown> {
  return apiFetch<unknown>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/users/${id}`, {
    method: "DELETE",
  });
}

// ── Forms ──────────────────────────────────────────────────────────────────────

export interface GetFormsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export async function getForms(params?: GetFormsParams): Promise<unknown> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<unknown>(`/forms${qs ? `?${qs}` : ""}`);
}

export async function getForm(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/forms/${id}`);
}

export async function createForm(data: unknown): Promise<unknown> {
  return apiFetch<unknown>("/forms", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateForm(id: string, data: unknown): Promise<unknown> {
  return apiFetch<unknown>(`/forms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteForm(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/forms/${id}`, {
    method: "DELETE",
  });
}

export async function duplicateForm(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/forms/${id}/duplicate`, {
    method: "POST",
  });
}

// ── Responses ──────────────────────────────────────────────────────────────────

export async function submitResponse(
  formId: string,
  data: unknown,
): Promise<unknown> {
  // submitResponse is public — no auth header should be attached.
  // We fetch directly without going through apiFetch so the token is never sent.
  const res = await fetch(`${BASE_URL}/forms/${formId}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body: ApiResponse<unknown> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }

  return body.data;
}

export interface GetResponsesParams {
  page?: number;
  limit?: number;
}

export async function getResponses(
  formId: string,
  params?: GetResponsesParams,
): Promise<unknown> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<unknown>(`/forms/${formId}/responses${qs ? `?${qs}` : ""}`);
}

export async function getResponse(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/responses/${id}`);
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<unknown> {
  return apiFetch<unknown>("/dashboard/stats");
}

export async function getDashboardCharts(): Promise<unknown> {
  return apiFetch<unknown>("/dashboard/charts");
}

// ── Activity Logs ──────────────────────────────────────────────────────────────

export interface GetActivityLogsParams {
  page?: number;
  limit?: number;
}

export async function getActivityLogs(
  params?: GetActivityLogsParams,
): Promise<unknown> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<unknown>(`/activity-logs${qs ? `?${qs}` : ""}`);
}

export async function createActivityLog(data: unknown): Promise<unknown> {
  return apiFetch<unknown>("/activity-logs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Finance ────────────────────────────────────────────────────────────────────

export interface GetFinanceRecordsParams {
  page?: number;
  limit?: number;
}

export async function getFinanceRecords(
  params?: GetFinanceRecordsParams,
): Promise<unknown> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<unknown>(`/finance${qs ? `?${qs}` : ""}`);
}

export async function getFinanceRecord(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/finance/${id}`);
}

export async function updateFinanceRecord(
  id: string,
  data: unknown,
): Promise<unknown> {
  return apiFetch<unknown>(`/finance/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function approveFinanceRecord(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/finance/${id}/approve`, {
    method: "PUT",
  });
}

export async function rejectFinanceRecord(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/finance/${id}/reject`, {
    method: "PUT",
  });
}

// ── Notifications ──────────────────────────────────────────────────────────────

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

export async function getNotifications(
  params?: GetNotificationsParams,
): Promise<unknown> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<unknown>(`/notifications${qs ? `?${qs}` : ""}`);
}

export async function markNotificationRead(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/notifications/${id}/read`, {
    method: "PUT",
  });
}

export async function markAllNotificationsRead(): Promise<unknown> {
  return apiFetch<unknown>("/notifications/read-all", {
    method: "PUT",
  });
}
