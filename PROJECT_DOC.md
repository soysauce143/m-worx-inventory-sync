Project Overview
Purpose
A modern inventory management application designed to help users manage, monitor, and interact with product stock efficiently. It features item CRUD, user authentication, and analytics features.
Tech Stack
•	Frontend: Vite, React, TypeScript, ShadCN/UI, TailwindCSS
•	Backend: Supabase (PostgreSQL + Auth + Realtime)
•	Others: Capacitor (optional for mobile), ESLint, PostCSS

ERD – Entity Relationship Diagram
 
Database Schemas
users (handled by Supabase Auth)
•	id (UUID): Primary key
•	email (string)
•	full_name (string, optional)

inventory_items
•	id (UUID): Primary key
•	user_id (UUID): Foreign key (linked to users)
•	name (string)
•	quantity (integer)
•	category (string)
•	created_at (timestamp)
•	updated_at (timestamp)
________________________________________
API Specification
Uses Supabase client SDK (or REST via RLS policies).
GET /inventory
•	Returns: List of inventory items for the authenticated user.
POST /inventory
•	Body:
{
  "name": "Item name",
  "quantity": 10,
  "category": "Electronics"
}

PATCH /inventory/:id
•	Body: Any updatable fields (name, quantity, category)
DELETE /inventory/:id
•	Deletes a specific item.
Supabase handles most routes via its auto-generated APIs.


Authentication Flow
 
Supabase Auth - Email/Password Flow
1.	User signs up or logs in via Supabase Auth UI or SDK.
2.	Auth token is stored in local storage/session.
3.	Auth token is sent with each request (via Supabase client).
4.	RLS policies restrict access to only the user's data.
Setup Guide
Prerequisites
•	Node.js v18+
•	npm or pnpm
•	Supabase project with tables set up
INSTALLATION

bash

git clone https://github.com/soysauce143/inventory-app.git
cd inventory-app
npm install

RUNNING THE APP
npm run dev

Example “.env”  File

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

Usage Guide
Login
•	User logs in with email and password.
•	Session is stored via Supabase client.
Inventory Actions
•	Create: Fill the form and submit to add new inventory.
•	Read: Items are listed automatically after login.
•	Update: Edit button allows inline or form-based updates.
•	Delete: Delete button removes the item from the database.
________________________________________
Testing (Optional)
API Test Example (using Postman or Insomnia)
•	Test endpoints by passing Supabase session token in headers.
Unit Tests (Future addition)
•	Use Vitest or Jest with React Testing Library

