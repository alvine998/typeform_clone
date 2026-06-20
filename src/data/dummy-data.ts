import type { User, Form, FormResponse, ActivityLog, FinanceRecord, DashboardStats, QuestionReport, SurveyorStats, Notification } from "@/types";

export const dummyUsers: User[] = [
  { id: "u1", name: "Admin User", email: "admin@formflow.com", role: "admin", avatar: "", phone: "+62812345678", department: "Management", status: "active", createdAt: "2024-01-15T08:00:00Z", updatedAt: "2024-12-01T10:00:00Z" },
  { id: "u2", name: "Budi Santoso", email: "budi@formflow.com", role: "surveyor", avatar: "", phone: "+62812345679", department: "Research", status: "active", createdAt: "2024-02-20T09:00:00Z", updatedAt: "2024-11-28T14:30:00Z" },
  { id: "u3", name: "Siti Rahayu", email: "siti@formflow.com", role: "surveyor", avatar: "", phone: "+62812345680", department: "Research", status: "active", createdAt: "2024-03-10T10:00:00Z", updatedAt: "2024-11-25T09:15:00Z" },
  { id: "u4", name: "Ahmad Hidayat", email: "ahmad@formflow.com", role: "viewer", avatar: "", phone: "+62812345681", department: "Finance", status: "active", createdAt: "2024-04-05T11:00:00Z", updatedAt: "2024-11-20T16:45:00Z" },
  { id: "u5", name: "Dewi Lestari", email: "dewi@formflow.com", role: "surveyor", avatar: "", phone: "+62812345682", department: "Marketing", status: "inactive", createdAt: "2024-05-12T08:30:00Z", updatedAt: "2024-10-15T11:20:00Z" },
  { id: "u6", name: "Rizki Pratama", email: "rizki@formflow.com", role: "surveyor", avatar: "", phone: "+62812345683", department: "Operations", status: "active", createdAt: "2024-06-18T07:45:00Z", updatedAt: "2024-12-02T08:30:00Z" },
  { id: "u7", name: "Maya Putri", email: "maya@formflow.com", role: "viewer", avatar: "", phone: "+62812345684", department: "HR", status: "active", createdAt: "2024-07-22T09:00:00Z", updatedAt: "2024-11-30T15:10:00Z" },
  { id: "u8", name: "John Smith", email: "john@formflow.com", role: "admin", avatar: "", phone: "+62812345685", department: "IT", status: "active", createdAt: "2024-08-01T10:00:00Z", updatedAt: "2024-12-01T12:00:00Z" },
];

export const dummyForms: Form[] = [
  {
    id: "f1", title: "Customer Satisfaction Survey", description: "Measure customer satisfaction with our products and services",
    fields: [
      { id: "q1", type: "rating", label: "How satisfied are you with our service?", required: true, order: 1 },
      { id: "q2", type: "radio", label: "How often do you use our product?", required: true, options: ["Daily", "Weekly", "Monthly", "Rarely"], order: 2 },
      { id: "q3", type: "textarea", label: "What can we improve?", required: false, placeholder: "Share your thoughts...", order: 3 },
      { id: "q4", type: "checkbox", label: "Which features do you use most?", required: false, options: ["Dashboard", "Reports", "Forms", "Analytics"], order: 4 },
      { id: "q5", type: "select", label: "How did you hear about us?", required: true, options: ["Social Media", "Friend", "Advertisement", "Search Engine"], order: 5 },
    ],
    status: "active", createdBy: "u1", responseCount: 245, createdAt: "2024-06-15T08:00:00Z", updatedAt: "2024-12-01T10:00:00Z", googleSheetId: "sheet_1"
  },
  {
    id: "f2", title: "Employee Engagement Survey", description: "Annual employee engagement and satisfaction survey",
    fields: [
      { id: "q1", type: "rating", label: "Rate your work-life balance", required: true, order: 1 },
      { id: "q2", type: "rating", label: "Rate your manager's leadership", required: true, order: 2 },
      { id: "q3", type: "radio", label: "Would you recommend this company to a friend?", required: true, options: ["Yes", "No", "Maybe"], order: 3 },
      { id: "q4", type: "textarea", label: "What would you change about the workplace?", required: false, order: 4 },
    ],
    status: "active", createdBy: "u1", responseCount: 189, createdAt: "2024-07-20T09:00:00Z", updatedAt: "2024-11-30T14:00:00Z"
  },
  {
    id: "f3", title: "Market Research Questionnaire", description: "Understanding market trends and consumer preferences",
    fields: [
      { id: "q1", type: "text", label: "What is your age?", required: true, order: 1 },
      { id: "q2", type: "select", label: "What is your income range?", required: true, options: ["< 5 Million", "5-10 Million", "10-20 Million", "> 20 Million"], order: 2 },
      { id: "q3", type: "checkbox", label: "What products are you interested in?", required: true, options: ["Electronics", "Fashion", "Food", "Health", "Education"], order: 3 },
      { id: "q4", type: "radio", label: "Preferred shopping method?", required: true, options: ["Online", "In-store", "Both"], order: 4 },
    ],
    status: "active", createdBy: "u2", responseCount: 312, createdAt: "2024-08-10T10:00:00Z", updatedAt: "2024-12-02T08:00:00Z"
  },
  {
    id: "f4", title: "Product Feedback Form", description: "Collect feedback on our latest product release",
    fields: [
      { id: "q1", type: "rating", label: "Overall product rating", required: true, order: 1 },
      { id: "q2", type: "radio", label: "Would you buy this product again?", required: true, options: ["Definitely", "Probably", "Not sure", "No"], order: 2 },
      { id: "q3", type: "textarea", label: "Describe your experience", required: false, order: 3 },
    ],
    status: "draft", createdBy: "u1", responseCount: 0, createdAt: "2024-11-01T11:00:00Z", updatedAt: "2024-11-01T11:00:00Z"
  },
  {
    id: "f5", title: "Event Registration Form", description: "Register for our upcoming annual conference",
    fields: [
      { id: "q1", type: "text", label: "Full Name", required: true, order: 1 },
      { id: "q2", type: "email", label: "Email Address", required: true, order: 2 },
      { id: "q3", type: "text", label: "Company/Organization", required: true, order: 3 },
      { id: "q4", type: "select", label: "Session Preference", required: true, options: ["Morning", "Afternoon", "Full Day"], order: 4 },
      { id: "q5", type: "checkbox", label: "Dietary Requirements", required: false, options: ["None", "Vegetarian", "Halal", "Gluten-free"], order: 5 },
    ],
    status: "closed", createdBy: "u3", responseCount: 156, createdAt: "2024-05-01T08:00:00Z", updatedAt: "2024-09-15T17:00:00Z"
  },
  {
    id: "f6", title: "Training Needs Assessment", description: "Identify training needs across departments",
    fields: [
      { id: "q1", type: "select", label: "Your department", required: true, options: ["IT", "HR", "Finance", "Marketing", "Operations"], order: 1 },
      { id: "q2", type: "checkbox", label: "Skills you want to develop", required: true, options: ["Leadership", "Technical", "Communication", "Project Management", "Data Analysis"], order: 2 },
      { id: "q3", type: "radio", label: "Preferred training format", required: true, options: ["Online", "In-person", "Hybrid"], order: 3 },
    ],
    status: "active", createdBy: "u8", responseCount: 98, createdAt: "2024-09-01T09:00:00Z", updatedAt: "2024-12-01T11:00:00Z"
  },
];

export const dummyResponses: FormResponse[] = [
  { id: "r1", formId: "f1", respondentName: "Andi Wijaya", respondentEmail: "andi@email.com", answers: { q1: 5, q2: "Daily", q3: "Great service overall!", q4: ["Dashboard", "Analytics"], q5: "Social Media" }, submittedAt: "2024-11-15T10:30:00Z", surveyorId: "u2", surveyorName: "Budi Santoso" },
  { id: "r2", formId: "f1", respondentName: "Rina Marlina", respondentEmail: "rina@email.com", answers: { q1: 4, q2: "Weekly", q3: "Could use more templates", q4: ["Forms"], q5: "Friend" }, submittedAt: "2024-11-16T14:20:00Z", surveyorId: "u2", surveyorName: "Budi Santoso" },
  { id: "r3", formId: "f1", respondentName: "Dian Kusuma", respondentEmail: "dian@email.com", answers: { q1: 5, q2: "Daily", q3: "Love the analytics feature!", q4: ["Dashboard", "Reports", "Analytics"], q5: "Search Engine" }, submittedAt: "2024-11-17T09:45:00Z", surveyorId: "u3", surveyorName: "Siti Rahayu" },
  { id: "r4", formId: "f2", respondentName: "Eko Prasetyo", respondentEmail: "eko@email.com", answers: { q1: 4, q2: 4, q3: "Yes", q4: "More flexible hours" }, submittedAt: "2024-11-18T11:00:00Z" },
  { id: "r5", formId: "f2", respondentName: "Fitri Handayani", respondentEmail: "fitri@email.com", answers: { q1: 3, q2: 5, q3: "Maybe", q4: "Better communication" }, submittedAt: "2024-11-19T15:30:00Z" },
  { id: "r6", formId: "f3", respondentName: "Gilang Ramadhan", respondentEmail: "gilang@email.com", answers: { q1: "28", q2: "10-20 Million", q3: ["Electronics", "Health"], q4: "Online" }, submittedAt: "2024-11-20T08:15:00Z", surveyorId: "u6", surveyorName: "Rizki Pratama" },
  { id: "r7", formId: "f3", respondentName: "Hana Permata", respondentEmail: "hana@email.com", answers: { q1: "35", q2: "> 20 Million", q3: ["Fashion", "Food"], q4: "Both" }, submittedAt: "2024-11-21T13:40:00Z", surveyorId: "u3", surveyorName: "Siti Rahayu" },
  { id: "r8", formId: "f5", respondentName: "Irwan Setiawan", respondentEmail: "irwan@email.com", answers: { q1: "Irwan Setiawan", q2: "irwan@email.com", q3: "Tech Corp", q4: "Full Day", q5: ["Halal"] }, submittedAt: "2024-08-20T10:00:00Z" },
  { id: "r9", formId: "f6", respondentName: "Joko Widodo", respondentEmail: "joko@email.com", answers: { q1: "IT", q2: ["Technical", "Data Analysis"], q3: "Online" }, submittedAt: "2024-10-05T09:30:00Z" },
  { id: "r10", formId: "f1", respondentName: "Kartika Sari", respondentEmail: "kartika@email.com", answers: { q1: 4, q2: "Monthly", q3: "Improve mobile app", q4: ["Reports"], q5: "Advertisement" }, submittedAt: "2024-11-22T16:50:00Z", surveyorId: "u2", surveyorName: "Budi Santoso" },
];

export const dummyActivityLogs: ActivityLog[] = [
  { id: "a1", userId: "u1", userName: "Admin User", action: "Created", entity: "Form", entityId: "f4", details: "Created form 'Product Feedback Form'", ipAddress: "192.168.1.1", createdAt: "2024-12-01T08:00:00Z" },
  { id: "a2", userId: "u2", userName: "Budi Santoso", action: "Submitted", entity: "Response", entityId: "r1", details: "Submitted response for 'Customer Satisfaction Survey'", ipAddress: "192.168.1.2", createdAt: "2024-11-15T10:30:00Z" },
  { id: "a3", userId: "u1", userName: "Admin User", action: "Updated", entity: "User", entityId: "u5", details: "Updated user status to inactive", ipAddress: "192.168.1.1", createdAt: "2024-12-01T09:15:00Z" },
  { id: "a4", userId: "u8", userName: "John Smith", action: "Exported", entity: "Form", entityId: "f1", details: "Exported 'Customer Satisfaction Survey' to Excel", ipAddress: "192.168.1.5", createdAt: "2024-12-01T10:00:00Z" },
  { id: "a5", userId: "u3", userName: "Siti Rahayu", action: "Submitted", entity: "Response", entityId: "r3", details: "Submitted response for 'Customer Satisfaction Survey'", ipAddress: "192.168.1.3", createdAt: "2024-11-17T09:45:00Z" },
  { id: "a6", userId: "u1", userName: "Admin User", action: "Synced", entity: "Form", entityId: "f1", details: "Synced 'Customer Satisfaction Survey' to Google Sheets", ipAddress: "192.168.1.1", createdAt: "2024-12-01T11:00:00Z" },
  { id: "a7", userId: "u6", userName: "Rizki Pratama", action: "Submitted", entity: "Response", entityId: "r6", details: "Submitted response for 'Market Research Questionnaire'", ipAddress: "192.168.1.6", createdAt: "2024-11-20T08:15:00Z" },
  { id: "a8", userId: "u1", userName: "Admin User", action: "Created", entity: "User", entityId: "u8", details: "Created user 'John Smith'", ipAddress: "192.168.1.1", createdAt: "2024-08-01T10:00:00Z" },
  { id: "a9", userId: "u8", userName: "John Smith", action: "Created", entity: "Form", entityId: "f6", details: "Created form 'Training Needs Assessment'", ipAddress: "192.168.1.5", createdAt: "2024-09-01T09:00:00Z" },
  { id: "a10", userId: "u2", userName: "Budi Santoso", action: "Updated", entity: "Response", entityId: "r1", details: "Updated response for 'Customer Satisfaction Survey'", ipAddress: "192.168.1.2", createdAt: "2024-11-16T08:00:00Z" },
];

export const dummyFinanceRecords: FinanceRecord[] = [
  { id: "fr1", formId: "f1", formTitle: "Customer Satisfaction Survey", category: "Research", description: "Survey platform subscription", amount: 5000000, date: "2024-11-01", status: "approved", approvedBy: "Admin User", createdAt: "2024-11-01T08:00:00Z" },
  { id: "fr2", formId: "f2", formTitle: "Employee Engagement Survey", category: "HR", description: "Employee engagement tools", amount: 3500000, date: "2024-11-15", status: "approved", approvedBy: "Admin User", createdAt: "2024-11-15T09:00:00Z" },
  { id: "fr3", formId: "f3", formTitle: "Market Research Questionnaire", category: "Marketing", description: "Market analysis data collection", amount: 8000000, date: "2024-11-20", status: "pending", createdAt: "2024-11-20T10:00:00Z" },
  { id: "fr4", formId: "f5", formTitle: "Event Registration Form", category: "Events", description: "Conference venue and catering", amount: 25000000, date: "2024-09-15", status: "approved", approvedBy: "John Smith", createdAt: "2024-09-15T11:00:00Z" },
  { id: "fr5", formId: "f6", formTitle: "Training Needs Assessment", category: "Training", description: "Online training platform license", amount: 4500000, date: "2024-12-01", status: "pending", createdAt: "2024-12-01T08:00:00Z" },
  { id: "fr6", formId: "f1", formTitle: "Customer Satisfaction Survey", category: "Research", description: "Incentive vouchers for respondents", amount: 2000000, date: "2024-11-10", status: "rejected", approvedBy: "Admin User", createdAt: "2024-11-10T14:00:00Z" },
  { id: "fr7", formId: "f3", formTitle: "Market Research Questionnaire", category: "Marketing", description: "Field survey logistics", amount: 12000000, date: "2024-12-02", status: "pending", createdAt: "2024-12-02T09:00:00Z" },
];

export const dummyDashboardStats: DashboardStats = {
  totalForms: 6,
  totalResponses: 1000,
  totalUsers: 8,
  activeSurveys: 4,
  monthlyResponses: [
    { month: "Jun", count: 45 },
    { month: "Jul", count: 78 },
    { month: "Aug", count: 120 },
    { month: "Sep", count: 95 },
    { month: "Oct", count: 156 },
    { month: "Nov", count: 245 },
    { month: "Dec", count: 261 },
  ],
  responsesByForm: [
    { form: "Customer Satisfaction", count: 245 },
    { form: "Employee Engagement", count: 189 },
    { form: "Market Research", count: 312 },
    { form: "Event Registration", count: 156 },
    { form: "Training Assessment", count: 98 },
  ],
  recentActivity: dummyActivityLogs.slice(0, 5),
};

export const dummyQuestionReports: Record<string, QuestionReport[]> = {
  f1: [
    { fieldId: "q1", fieldLabel: "How satisfied are you with our service?", fieldType: "rating", totalAnswers: 245, distribution: [
      { label: "1 Star", count: 5, percentage: 2 }, { label: "2 Stars", count: 10, percentage: 4 },
      { label: "3 Stars", count: 35, percentage: 14 }, { label: "4 Stars", count: 95, percentage: 39 },
      { label: "5 Stars", count: 100, percentage: 41 },
    ], averageRating: 4.1 },
    { fieldId: "q2", fieldLabel: "How often do you use our product?", fieldType: "radio", totalAnswers: 245, distribution: [
      { label: "Daily", count: 98, percentage: 40 }, { label: "Weekly", count: 85, percentage: 35 },
      { label: "Monthly", count: 42, percentage: 17 }, { label: "Rarely", count: 20, percentage: 8 },
    ] },
    { fieldId: "q4", fieldLabel: "Which features do you use most?", fieldType: "checkbox", totalAnswers: 245, distribution: [
      { label: "Dashboard", count: 180, percentage: 73 }, { label: "Reports", count: 145, percentage: 59 },
      { label: "Forms", count: 120, percentage: 49 }, { label: "Analytics", count: 165, percentage: 67 },
    ] },
    { fieldId: "q5", fieldLabel: "How did you hear about us?", fieldType: "select", totalAnswers: 245, distribution: [
      { label: "Social Media", count: 90, percentage: 37 }, { label: "Friend", count: 65, percentage: 27 },
      { label: "Advertisement", count: 50, percentage: 20 }, { label: "Search Engine", count: 40, percentage: 16 },
    ] },
  ],
};

export const dummySurveyorStats: Record<string, SurveyorStats[]> = {
  f1: [
    { surveyorId: "u2", surveyorName: "Budi Santoso", totalResponses: 120, formsAssigned: 3, lastActive: "2024-12-01T10:00:00Z", completionRate: 92 },
    { surveyorId: "u3", surveyorName: "Siti Rahayu", totalResponses: 85, formsAssigned: 2, lastActive: "2024-11-30T14:00:00Z", completionRate: 88 },
    { surveyorId: "u6", surveyorName: "Rizki Pratama", totalResponses: 40, formsAssigned: 2, lastActive: "2024-12-02T08:00:00Z", completionRate: 78 },
  ],
  f3: [
    { surveyorId: "u6", surveyorName: "Rizki Pratama", totalResponses: 180, formsAssigned: 1, lastActive: "2024-12-02T08:00:00Z", completionRate: 95 },
    { surveyorId: "u3", surveyorName: "Siti Rahayu", totalResponses: 132, formsAssigned: 1, lastActive: "2024-11-28T10:00:00Z", completionRate: 90 },
  ],
};

export const dummyNotifications: Notification[] = [
  { id: "n1", title: "New Response", message: "Andi Wijaya submitted a response to Customer Satisfaction Survey", type: "response", read: false, entityId: "r1", entityType: "response", createdAt: "2024-12-02T10:30:00Z" },
  { id: "n2", title: "New Response", message: "Rina Marlina submitted a response to Employee Engagement Survey", type: "response", read: false, entityId: "r2", entityType: "response", createdAt: "2024-12-02T09:15:00Z" },
  { id: "n3", title: "Form Closed", message: "Event Registration Form has been closed", type: "form", read: false, entityId: "f5", entityType: "form", createdAt: "2024-12-01T16:00:00Z" },
  { id: "n4", title: "New User", message: "John Smith joined as admin", type: "user", read: false, entityId: "u8", entityType: "user", createdAt: "2024-12-01T10:00:00Z" },
  { id: "n5", title: "System Update", message: "FormFlow has been updated to version 2.0", type: "system", read: false, createdAt: "2024-11-30T08:00:00Z" },
  { id: "n6", title: "New Response", message: "Dian Kusuma submitted a response to Market Research Questionnaire", type: "response", read: true, entityId: "r3", entityType: "response", createdAt: "2024-11-29T14:20:00Z" },
  { id: "n7", title: "Form Created", message: "Training Needs Assessment form was created", type: "form", read: true, entityId: "f6", entityType: "form", createdAt: "2024-11-28T09:00:00Z" },
];
