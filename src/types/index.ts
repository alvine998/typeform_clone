export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "surveyor" | "viewer";
  avatar?: string;
  phone?: string;
  department?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  id: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select" | "rating" | "date" | "email" | "number" | "file";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  status: "draft" | "active" | "closed";
  createdBy: string;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
  googleSheetId?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  respondentName: string;
  respondentEmail: string;
  answers: Record<string, string | string[] | number>;
  submittedAt: string;
  surveyorId?: string;
  surveyorName?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface FinanceRecord {
  id: string;
  formId: string;
  formTitle: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  totalUsers: number;
  activeSurveys: number;
  monthlyResponses: { month: string; count: number }[];
  responsesByForm: { form: string; count: number }[];
  recentActivity: ActivityLog[];
}

export interface QuestionReport {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  totalAnswers: number;
  distribution: { label: string; count: number; percentage: number }[];
  averageRating?: number;
}

export interface SurveyorStats {
  surveyorId: string;
  surveyorName: string;
  totalResponses: number;
  formsAssigned: number;
  lastActive: string;
  completionRate: number;
}

export type Locale = "en" | "id";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "response" | "form" | "user" | "system";
  read: boolean;
  entityId?: string;
  entityType?: "form" | "response" | "user";
  createdAt: string;
}
