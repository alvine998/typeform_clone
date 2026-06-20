# FormFlow API Documentation

Base URL: `http://localhost:4000/api`

---

## Auth

### POST /api/auth/login

Login with email and password, returns JWT token.

**Request:**
```json
{
  "email": "admin@formflow.com",
  "password": "admin1234"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "admin-uuid-1111",
      "name": "Admin User",
      "email": "admin@formflow.com",
      "role": "admin",
      "avatar": null,
      "department": "Engineering"
    }
  }
}
```

### POST /api/auth/logout

Invalidate token (placeholder).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Logged out"
}
```

### GET /api/auth/me

Get current authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "admin-uuid-1111",
    "name": "Admin User",
    "email": "admin@formflow.com",
    "role": "admin",
    "avatar": null,
    "phone": "+1-555-0101",
    "department": "Engineering",
    "status": "active",
    "created_at": "2026-06-17T03:30:12.000Z",
    "updated_at": "2026-06-17T03:30:12.000Z"
  }
}
```

---

## Users (Admin only)

All endpoints require `Authorization: Bearer <token>` with admin role.

### GET /api/users

List all users with optional filters.

**Query params:** `?search=&role=surveyor&status=active&page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "users": [
      {
        "id": "admin-uuid-1111",
        "name": "Admin User",
        "email": "admin@formflow.com",
        "role": "admin",
        "avatar": null,
        "phone": "+1-555-0101",
        "department": "Engineering",
        "status": "active",
        "created_at": "2026-06-17T03:30:12.000Z",
        "updated_at": "2026-06-17T03:30:12.000Z"
      }
    ],
    "total": 8,
    "page": 1,
    "totalPages": 1
  }
}
```

### GET /api/users/:id

Get user by ID.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "admin-uuid-1111",
    "name": "Admin User",
    "email": "admin@formflow.com",
    "role": "admin",
    "status": "active"
  }
}
```

### POST /api/users

Create a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "surveyor",
  "phone": "+62812345678",
  "department": "Engineering"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "surveyor",
    "phone": "+62812345678",
    "department": "Engineering",
    "status": "active"
  }
}
```

### PUT /api/users/:id

Update user.

**Request:** (partial update)
```json
{
  "name": "John Updated",
  "department": "Marketing"
}
```

**Response 200:** (updated user object)

### DELETE /api/users/:id

Delete user.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "User deleted"
  }
}
```

---

## Forms

### GET /api/forms

List all forms.

**Headers:** `Authorization: Bearer <token>`

**Query params:** `?status=active&page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "forms": [
      {
        "id": "form-uuid-1001",
        "title": "Customer Satisfaction Survey",
        "description": "Quarterly feedback from our customers",
        "status": "active",
        "created_by": "surv-uuid-2111",
        "response_count": 4,
        "google_sheet_id": null,
        "created_at": "2026-06-17T03:30:12.000Z",
        "updated_at": "2026-06-17T03:30:45.000Z",
        "field_count": 4
      }
    ],
    "total": 6,
    "page": 1,
    "totalPages": 1
  }
}
```

### GET /api/forms/:id

Get form with all fields.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "form-uuid-1001",
    "title": "Customer Satisfaction Survey",
    "description": "Quarterly feedback from our customers",
    "status": "active",
    "created_by": "surv-uuid-2111",
    "response_count": 4,
    "google_sheet_id": null,
    "created_at": "2026-06-17T03:30:12.000Z",
    "updated_at": "2026-06-17T03:30:45.000Z",
    "fields": [
      {
        "id": "field-uuid-1101",
        "form_id": "form-uuid-1001",
        "type": "text",
        "label": "Full Name",
        "placeholder": "Enter your name",
        "required": true,
        "options": null,
        "field_order": 1
      },
      {
        "id": "field-uuid-1102",
        "form_id": "form-uuid-1001",
        "type": "email",
        "label": "Email Address",
        "placeholder": "you@example.com",
        "required": true,
        "options": null,
        "field_order": 2
      },
      {
        "id": "field-uuid-1103",
        "form_id": "form-uuid-1001",
        "type": "rating",
        "label": "Overall Rating",
        "required": true,
        "options": null,
        "field_order": 3
      },
      {
        "id": "field-uuid-1104",
        "form_id": "form-uuid-1001",
        "type": "textarea",
        "label": "Additional Comments",
        "placeholder": "Tell us more",
        "required": false,
        "options": null,
        "field_order": 4
      }
    ]
  }
}
```

### POST /api/forms

Create form with fields (Admin only).

**Headers:** `Authorization: Bearer <token>` (admin)

**Request:**
```json
{
  "title": "Customer Survey",
  "description": "Measure satisfaction",
  "fields": [
    {
      "type": "text",
      "label": "Your Name",
      "placeholder": "Enter name",
      "required": true,
      "field_order": 1
    },
    {
      "type": "rating",
      "label": "Rate our service",
      "required": true,
      "field_order": 2
    },
    {
      "type": "radio",
      "label": "How often?",
      "required": false,
      "options": ["Daily", "Weekly", "Monthly"],
      "field_order": 3
    }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": "new-form-uuid",
    "title": "Customer Survey",
    "description": "Measure satisfaction",
    "status": "draft",
    "fields": [...]
  }
}
```

### PUT /api/forms/:id

Update form and/or fields (Admin only).

**Request:**
```json
{
  "title": "Updated Title",
  "status": "active",
  "fields": [
    { "type": "text", "label": "Name", "required": true, "field_order": 1 }
  ]
}
```

**Response 200:** (updated form with fields)

### DELETE /api/forms/:id

Delete form (Admin only). Cascades to fields and responses.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "Form deleted"
  }
}
```

### POST /api/forms/:id/duplicate

Duplicate form with all fields (Admin only).

**Response 201:**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": "new-copy-uuid",
    "title": "Original Title (Copy)",
    "status": "draft",
    "fields": [...]
  }
}
```

---

## Form Responses (Public)

### POST /api/forms/:id/responses

Submit a response to a form. Public — no auth required.

**Request:**
```json
{
  "respondentName": "Andi Wijaya",
  "respondentEmail": "andi@email.com",
  "answers": {
    "field-uuid-1101": "Andi Wijaya",
    "field-uuid-1102": "andi@email.com",
    "field-uuid-1103": 5,
    "field-uuid-1104": "Great service!"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": "new-response-uuid",
    "message": "Response submitted successfully"
  }
}
```

### GET /api/forms/:id/responses

Get all responses for a form (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query params:** `?page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "responses": [
      {
        "id": "resp-uuid-5001",
        "form_id": "form-uuid-1001",
        "respondent_name": "Frank Viewer",
        "respondent_email": "frank@formflow.com",
        "answers": {
          "field-uuid-1101": "Frank Viewer",
          "field-uuid-1102": "frank@formflow.com",
          "field-uuid-1103": 4,
          "field-uuid-1104": "Great service!"
        },
        "surveyor_id": null,
        "submitted_at": "2026-06-17T03:30:12.000Z"
      }
    ],
    "total": 4,
    "page": 1,
    "totalPages": 1
  }
}
```

### GET /api/responses/:id

Get single response by ID (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "resp-uuid-5001",
    "form_id": "form-uuid-1001",
    "respondent_name": "Frank Viewer",
    "respondent_email": "frank@formflow.com",
    "answers": {
      "field-uuid-1101": "Frank Viewer",
      "field-uuid-1102": "frank@formflow.com",
      "field-uuid-1103": 4,
      "field-uuid-1104": "Great service!"
    },
    "submitted_at": "2026-06-17T03:30:12.000Z"
  }
}
```

---

## Dashboard (Admin only)

All endpoints require `Authorization: Bearer <token>` with admin role.

### GET /api/dashboard/stats

Get dashboard statistics.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "totalForms": 6,
    "totalResponses": 9,
    "totalUsers": 7,
    "activeSurveys": 3,
    "monthlyResponses": [
      { "month": "2026-06", "count": 9 }
    ],
    "responsesByForm": [
      {
        "form_id": "form-uuid-1001",
        "count": 4,
        "form": { "title": "Customer Satisfaction Survey" }
      },
      {
        "form_id": "form-uuid-1002",
        "count": 1,
        "form": { "title": "Employee Onboarding" }
      },
      {
        "form_id": "form-uuid-1004",
        "count": 2,
        "form": { "title": "IT Support Ticket" }
      },
      {
        "form_id": "form-uuid-1005",
        "count": 2,
        "form": { "title": "Health & Safety Audit" }
      }
    ],
    "recentActivity": [
      {
        "id": "alog-uuid-6001",
        "user_id": "surv-uuid-2111",
        "user_name": "Carol Surveyor",
        "action": "create",
        "entity": "form",
        "entity_id": "form-uuid-1001",
        "details": "Created Customer Satisfaction Survey",
        "ip_address": "192.168.1.10",
        "created_at": "2026-06-17T03:30:12.000Z"
      }
    ]
  }
}
```

### GET /api/dashboard/charts

Get chart data.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "responsesOverTime": [
      { "date": "2026-06-17", "count": 9 }
    ],
    "formsByStatus": [
      { "status": "active", "count": 3 },
      { "status": "closed", "count": 1 },
      { "status": "draft", "count": 2 }
    ]
  }
}
```

---

## Activity Logs (Admin only)

### GET /api/activity-logs

List activity logs with filters.

**Headers:** `Authorization: Bearer <token>` (admin)

**Query params:** `?action=create&userId=surv-uuid-2111&page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "logs": [
      {
        "id": "alog-uuid-6001",
        "user_id": "surv-uuid-2111",
        "user_name": "Carol Surveyor",
        "action": "create",
        "entity": "form",
        "entity_id": "form-uuid-1001",
        "details": "Created Customer Satisfaction Survey",
        "ip_address": "192.168.1.10",
        "created_at": "2026-06-17T03:30:12.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "totalPages": 1
  }
}
```

### POST /api/activity-logs

Create activity log entry.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "action": "publish",
  "entity": "form",
  "entityId": "form-uuid-1001",
  "details": "Published Customer Satisfaction Survey"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": "new-log-uuid",
    "user_id": "admin-uuid-1111",
    "user_name": "Admin User",
    "action": "publish",
    "entity": "form",
    "entity_id": "form-uuid-1001",
    "details": "Published Customer Satisfaction Survey",
    "ip_address": "::1",
    "created_at": "2026-06-17T03:30:12.000Z"
  }
}
```

---

## Finance Records (Admin only)

### GET /api/finance

List finance records.

**Headers:** `Authorization: Bearer <token>` (admin)

**Query params:** `?status=pending&category=Consulting&page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "records": [
      {
        "id": "fin-uuid-7001",
        "form_id": "form-uuid-1001",
        "form_title": "Customer Satisfaction Survey",
        "category": "Project Payment",
        "description": null,
        "amount": 1500.00,
        "date": "2025-06-01",
        "status": "approved",
        "approved_by": "admin-uuid-1111",
        "created_at": "2026-06-17T03:30:12.000Z"
      }
    ],
    "total": 6,
    "page": 1,
    "totalPages": 1
  }
}
```

### GET /api/finance/:id

Get single finance record.

**Response 200:** (single finance record object)

### PUT /api/finance/:id

Update finance record.

**Request:**
```json
{
  "description": "Updated description",
  "amount": 2000.00,
  "category": "Consulting"
}
```

**Response 200:** (updated record)

### PUT /api/finance/:id/approve

Approve finance record.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "fin-uuid-7003",
    "status": "approved",
    "approved_by": "admin-uuid-1111",
    ...
  }
}
```

### PUT /api/finance/:id/reject

Reject finance record.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "fin-uuid-7006",
    "status": "rejected",
    "approved_by": "admin-uuid-1111",
    ...
  }
}
```

---

## Notifications

All endpoints require `Authorization: Bearer <token>`.

### GET /api/notifications

List notifications for current user.

**Headers:** `Authorization: Bearer <token>`

**Query params:** `?unread=true&limit=5`

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "notif-uuid-8003",
      "title": "Form Published",
      "message": "Employee Onboarding form published",
      "type": "form",
      "read": false,
      "entity_id": "form-uuid-1002",
      "entity_type": "form",
      "user_id": "admin-uuid-1111",
      "created_at": "2026-06-17T03:30:12.000Z"
    }
  ]
}
```

### PUT /api/notifications/:id/read

Mark single notification as read.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "notif-uuid-8003",
    "read": true,
    ...
  }
}
```

### PUT /api/notifications/read-all

Mark all notifications as read for current user.

**Response 200:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "message": "All notifications marked as read"
  }
}
```

---

## Field Types Reference

| Type       | Description              | Has Options |
|------------|--------------------------|-------------|
| `text`     | Single line text input   | No          |
| `textarea` | Multi line text input    | No          |
| `radio`    | Single select (visible)  | Yes         |
| `checkbox` | Multiple select          | Yes         |
| `select`   | Dropdown select          | Yes         |
| `rating`   | Numeric rating           | No          |
| `date`     | Date picker              | No          |
| `email`    | Email input              | No          |
| `number`   | Number input             | No          |
| `file`     | File upload              | No          |

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Form not found or not active"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Not Found"
}
```

### 429 Rate Limited
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```
