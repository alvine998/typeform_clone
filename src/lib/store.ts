/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type {
  Form,
  User,
  FormResponse,
  ActivityLog,
  FinanceRecord,
  Notification,
  DashboardStats,
} from "@/types";
import * as api from "./api";
import * as mappers from "./mappers";

interface AppState {
  forms: Form[];
  users: User[];
  responses: FormResponse[];
  activityLogs: ActivityLog[];
  financeRecords: FinanceRecord[];
  notifications: Notification[];
  dashboardStats: DashboardStats | null;
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;

  setSidebarOpen: (open: boolean) => void;

  // Fetch actions
  fetchForms: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchFormResponses: (formId: string) => Promise<FormResponse[]>;
  fetchActivityLogs: () => Promise<void>;
  fetchFinanceRecords: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;

  // Mutation actions
  addForm: (data: {
    title: string;
    description: string;
    status: string;
    fields: Array<{
      type: string;
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
      order: number;
    }>;
  }) => Promise<void>;
  updateForm: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      fields: Array<{
        type: string;
        label: string;
        placeholder?: string;
        required: boolean;
        options?: string[];
        order: number;
      }>;
    }>,
  ) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
  duplicateForm: (id: string) => Promise<void>;

  addUser: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
    phone?: string;
    department?: string;
    status: string;
  }) => Promise<void>;
  updateUser: (
    id: string,
    data: Partial<{
      name: string;
      email: string;
      role: string;
      avatar: string;
      phone: string;
      department: string;
      status: string;
    }>,
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  addResponse: (
    formId: string,
    data: {
      respondentName: string;
      respondentEmail: string;
      answers: Record<string, string | string[] | number>;
      surveyorId?: string;
      surveyorName?: string;
    },
  ) => Promise<void>;

  addActivityLog: (data: {
    userId: string;
    userName: string;
    action: string;
    entity: string;
    entityId: string;
    details: string;
    ipAddress: string;
  }) => Promise<void>;

  updateFinanceRecord: (id: string, data: Partial<FinanceRecord>) => Promise<void>;
  approveFinanceRecord: (id: string) => Promise<void>;
  rejectFinanceRecord: (id: string) => Promise<void>;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  forms: [],
  users: [],
  responses: [],
  activityLogs: [],
  financeRecords: [],
  notifications: [],
  dashboardStats: null,
  sidebarOpen: false,
  loading: false,
  error: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // ── Fetch actions ──────────────────────────────────────────────────────────

  fetchForms: async () => {
    set({ loading: true, error: null });
    try {
      const res = (await api.getForms()) as any;
      set({ forms: mappers.mapForms(res.forms ?? res), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = (await api.getUsers()) as any;
      set({ users: mappers.mapUsers(res.users ?? res), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchFormResponses: async (formId) => {
    set({ loading: true, error: null });
    try {
      const res = (await api.getResponses(formId)) as any;
      const mapped = mappers.mapFormResponses(res.responses ?? res);
      set({ loading: false });
      return mapped;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      return [];
    }
  },

  fetchActivityLogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = (await api.getActivityLogs()) as any;
      set({ activityLogs: mappers.mapActivityLogs(res.logs ?? res), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchFinanceRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = (await api.getFinanceRecords()) as any;
      set({ financeRecords: mappers.mapFinanceRecords(res.records ?? res), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = (await api.getNotifications()) as any;
      set({ notifications: mappers.mapNotifications(Array.isArray(res) ? res : res.notifications ?? []), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = (await api.getDashboardStats()) as any;
      set({ dashboardStats: mappers.mapDashboardStats(data), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  // ── Mutation actions ───────────────────────────────────────────────────────

  addForm: async (data) => {
    try {
      const apiData = await api.createForm(mappers.toApiCreateForm(data));
      const form = mappers.mapForm(apiData);
      set((s) => ({ forms: [...s.forms, form] }));
    } catch (e) {
      throw e;
    }
  },

  updateForm: async (id, data) => {
    try {
      const apiData = await api.updateForm(id, mappers.toApiUpdateForm(data));
      const form = mappers.mapForm(apiData);
      set((s) => ({
        forms: s.forms.map((f) => (f.id === id ? form : f)),
      }));
    } catch (e) {
      throw e;
    }
  },

  deleteForm: async (id) => {
    try {
      await api.deleteForm(id);
      set((s) => ({ forms: s.forms.filter((f) => f.id !== id) }));
    } catch (e) {
      throw e;
    }
  },

  duplicateForm: async (id) => {
    try {
      const apiData = await api.duplicateForm(id);
      const form = mappers.mapForm(apiData);
      set((s) => ({ forms: [...s.forms, form] }));
    } catch (e) {
      throw e;
    }
  },

  addUser: async (data) => {
    try {
      const apiData = await api.createUser(mappers.toApiCreateUser(data));
      const user = mappers.mapUser(apiData);
      set((s) => ({ users: [...s.users, user] }));
    } catch (e) {
      throw e;
    }
  },

  updateUser: async (id, data) => {
    try {
      const apiData = await api.updateUser(id, mappers.toApiUpdateUser(data));
      const user = mappers.mapUser(apiData);
      set((s) => ({
        users: s.users.map((u) => (u.id === id ? user : u)),
      }));
    } catch (e) {
      throw e;
    }
  },

  deleteUser: async (id) => {
    try {
      await api.deleteUser(id);
      set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
    } catch (e) {
      throw e;
    }
  },

  addResponse: async (formId, data) => {
    try {
      await api.submitResponse(formId, mappers.toApiSubmitResponse(data));
      // API returns { id, message } — not a full response object.
      // We don't add to local state; callers can refetch if needed.
    } catch (e) {
      throw e;
    }
  },

  addActivityLog: async (data) => {
    try {
      const apiData = await api.createActivityLog(data);
      const log = mappers.mapActivityLog(apiData);
      set((s) => ({ activityLogs: [log, ...s.activityLogs] }));
    } catch (e) {
      throw e;
    }
  },

  updateFinanceRecord: async (id, data) => {
    try {
      const apiData = await api.updateFinanceRecord(id, data);
      const record = mappers.mapFinanceRecord(apiData);
      set((s) => ({
        financeRecords: s.financeRecords.map((r) =>
          r.id === id ? record : r,
        ),
      }));
    } catch (e) {
      throw e;
    }
  },

  approveFinanceRecord: async (id) => {
    try {
      const apiData = await api.approveFinanceRecord(id);
      const record = mappers.mapFinanceRecord(apiData);
      set((s) => ({
        financeRecords: s.financeRecords.map((r) =>
          r.id === id ? record : r,
        ),
      }));
    } catch (e) {
      throw e;
    }
  },

  rejectFinanceRecord: async (id) => {
    try {
      const apiData = await api.rejectFinanceRecord(id);
      const record = mappers.mapFinanceRecord(apiData);
      set((s) => ({
        financeRecords: s.financeRecords.map((r) =>
          r.id === id ? record : r,
        ),
      }));
    } catch (e) {
      throw e;
    }
  },

  markNotificationRead: async (id) => {
    try {
      const apiData = await api.markNotificationRead(id);
      const notification = mappers.mapNotification(apiData);
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? notification : n,
        ),
      }));
    } catch (e) {
      throw e;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await api.markAllNotificationsRead();
      // API returns { message } — just mark all local notifications as read
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (e) {
      throw e;
    }
  },
}));
