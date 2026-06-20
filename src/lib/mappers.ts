/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  User,
  Form,
  FormField,
  FormResponse,
  ActivityLog,
  FinanceRecord,
  Notification,
  DashboardStats,
} from "@/types";

// ──────────────────────────────────────────────
// Forward Mappers (API snake_case → Frontend camelCase)
// ──────────────────────────────────────────────

export function mapUser(apiUser: any): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    avatar: apiUser.avatar,
    phone: apiUser.phone,
    department: apiUser.department,
    status: apiUser.status,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

export function mapUsers(apiUsers: any[]): User[] {
  return (apiUsers ?? []).map(mapUser);
}

export function mapFormField(apiField: any): FormField {
  return {
    id: apiField.id,
    type: apiField.type,
    label: apiField.label,
    placeholder: apiField.placeholder,
    required: apiField.required,
    options: apiField.options,
    order: apiField.field_order,
  };
}

export function mapFormFields(apiFields: any[]): FormField[] {
  return (apiFields ?? []).map(mapFormField);
}

export function mapForm(apiForm: any): Form {
  return {
    id: apiForm.id,
    title: apiForm.title,
    description: apiForm.description,
    fields: mapFormFields(apiForm.fields),
    status: apiForm.status,
    createdBy: apiForm.created_by,
    responseCount: apiForm.response_count,
    createdAt: apiForm.created_at,
    updatedAt: apiForm.updated_at,
    googleSheetId: apiForm.google_sheet_id,
  };
}

export function mapForms(apiForms: any[]): Form[] {
  return (apiForms ?? []).map(mapForm);
}

export function mapFormResponse(apiResponse: any): FormResponse {
  return {
    id: apiResponse.id,
    formId: apiResponse.form_id,
    respondentName: apiResponse.respondent_name,
    respondentEmail: apiResponse.respondent_email,
    answers: apiResponse.answers ?? {},
    submittedAt: apiResponse.submitted_at,
    surveyorId: apiResponse.surveyor_id,
    surveyorName: apiResponse.surveyor_name,
  };
}

export function mapFormResponses(apiResponses: any[]): FormResponse[] {
  return (apiResponses ?? []).map(mapFormResponse);
}

export function mapActivityLog(apiLog: any): ActivityLog {
  return {
    id: apiLog.id,
    userId: apiLog.user_id,
    userName: apiLog.user_name,
    action: apiLog.action,
    entity: apiLog.entity,
    entityId: apiLog.entity_id,
    details: apiLog.details,
    ipAddress: apiLog.ip_address,
    createdAt: apiLog.created_at,
  };
}

export function mapActivityLogs(apiLogs: any[]): ActivityLog[] {
  return (apiLogs ?? []).map(mapActivityLog);
}

export function mapFinanceRecord(apiRecord: any): FinanceRecord {
  return {
    id: apiRecord.id,
    formId: apiRecord.form_id,
    formTitle: apiRecord.form_title,
    category: apiRecord.category,
    description: apiRecord.description,
    amount: apiRecord.amount,
    date: apiRecord.date,
    status: apiRecord.status,
    approvedBy: apiRecord.approved_by,
    createdAt: apiRecord.created_at,
  };
}

export function mapFinanceRecords(apiRecords: any[]): FinanceRecord[] {
  return (apiRecords ?? []).map(mapFinanceRecord);
}

export function mapNotification(apiNotif: any): Notification {
  return {
    id: apiNotif.id,
    title: apiNotif.title,
    message: apiNotif.message,
    type: apiNotif.type,
    read: apiNotif.read,
    entityId: apiNotif.entity_id,
    entityType: apiNotif.entity_type,
    createdAt: apiNotif.created_at,
  };
}

export function mapNotifications(apiNotifs: any[]): Notification[] {
  return (apiNotifs ?? []).map(mapNotification);
}

export function mapDashboardStats(apiStats: any): DashboardStats {
  return {
    totalForms: apiStats.totalForms,
    totalResponses: apiStats.totalResponses,
    totalUsers: apiStats.totalUsers,
    activeSurveys: apiStats.activeSurveys,
    monthlyResponses: (apiStats.monthlyResponses ?? []).map(
      (m: any) => ({ month: m.month, count: m.count }),
    ),
    responsesByForm: (apiStats.responsesByForm ?? []).map(
      (r: any) => ({ form: r.form?.title ?? r.form_id, count: r.count }),
    ),
    recentActivity: mapActivityLogs(apiStats.recentActivity ?? []),
  };
}

// ──────────────────────────────────────────────
// Reverse Mappers (Frontend camelCase → API snake_case)
// ──────────────────────────────────────────────

export function toApiCreateUser(formData: {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  phone?: string;
  department?: string;
  status: string;
}): Record<string, unknown> {
  return {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    avatar: formData.avatar,
    phone: formData.phone,
    department: formData.department,
    status: formData.status,
  };
}

export function toApiUpdateUser(
  formData: Partial<{
    name: string;
    email: string;
    role: string;
    avatar: string;
    phone: string;
    department: string;
    status: string;
  }>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (formData.name !== undefined) payload.name = formData.name;
  if (formData.email !== undefined) payload.email = formData.email;
  if (formData.role !== undefined) payload.role = formData.role;
  if (formData.avatar !== undefined) payload.avatar = formData.avatar;
  if (formData.phone !== undefined) payload.phone = formData.phone;
  if (formData.department !== undefined) payload.department = formData.department;
  if (formData.status !== undefined) payload.status = formData.status;
  return payload;
}

export function toApiCreateForm(formData: {
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
}): Record<string, unknown> {
  return {
    title: formData.title,
    description: formData.description,
    status: formData.status,
    fields: formData.fields.map((f) => ({
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options,
      field_order: f.order,
    })),
  };
}

export function toApiUpdateForm(
  formData: Partial<{
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
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (formData.title !== undefined) payload.title = formData.title;
  if (formData.description !== undefined) payload.description = formData.description;
  if (formData.status !== undefined) payload.status = formData.status;
  if (formData.fields !== undefined) {
    payload.fields = formData.fields.map((f) => ({
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options,
      field_order: f.order,
    }));
  }
  return payload;
}

export function toApiSubmitResponse(formData: {
  respondentName: string;
  respondentEmail: string;
  answers: Record<string, string | string[] | number>;
  surveyorId?: string;
  surveyorName?: string;
}): Record<string, unknown> {
  return {
    respondent_name: formData.respondentName,
    respondent_email: formData.respondentEmail,
    answers: formData.answers,
    surveyor_id: formData.surveyorId,
    surveyor_name: formData.surveyorName,
  };
}
