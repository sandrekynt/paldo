# Paldo — MVP 1 Technical Plan

> Simple business management tool — Inventory, Payroll, POS, Utang Tracker, and Dashboard.
> Built for Filipino small businesses, designed for the world.

---

## Tech Stack

| Layer                 | Tool                      | Notes                                     |
| --------------------- | ------------------------- | ----------------------------------------- |
| Frontend              | Next.js 14 (App Router)   | Main framework                            |
| UI Components         | shadcn/ui + Tailwind CSS  | Minimal, clean UI                         |
| ORM                   | Drizzle ORM               | Type-safe, lightweight                    |
| Database (local)      | SQLite via better-sqlite3 | Local dev, zero setup                     |
| Database (production) | Turso                     | Hosted SQLite, near-zero migration effort |
| Auth                  | NextAuth.js (Auth.js)     | Email + password, session handling        |
| PDF Generation        | React-PDF                 | Payslip generation                        |
| CSV / Excel Import    | SheetJS (xlsx)            | File import handling                      |
| Email                 | Resend                    | Password reset, notifications             |
| Storage               | Cloudflare R2             | Logo uploads, CSV imports                 |
| Payments PH           | PayMongo                  | GCash, Maya, cards                        |
| Payments Global       | Stripe                    | Cards, international                      |
| Hosting               | Vercel                    | Free tier, perfect Next.js pairing        |

---

## Product Modules — MVP 1

### 1. Inventory

- Add / edit / archive products (name, category, buying price, selling price, stock qty, unit)
- Category as free text with suggestions from previously used values
- Unit as fixed dropdown (piece, kilo, gram, pack, bottle, box, liter, sack, dozen, other)
- Restock (add incoming stock + cost, optional supplier name)
- Manual stock adjustment with required reason note
- Low stock alert (badge on product, dedicated low stock view)
- Full stock movement history per product
- Import products via CSV / Excel with smart column matching + preview
- Downloadable import template

### 2. Payroll

- Add / archive employees (name, position, employment type, salary type, basic pay)
- Run payroll per cutoff (semi-monthly)
- Auto-compute SSS, PhilHealth, Pag-IBIG, withholding tax (TRAIN Law)
- Manual additions per cutoff (overtime, allowances, bonuses)
- Manual deductions per cutoff (absences, tardiness, cash advance)
- Generate payslip PDF per employee
- Import employees via CSV / Excel with smart column matching + preview
- Downloadable import template

### 3. POS

- Select products from inventory (live stock pulled automatically)
- Multi-item cart per transaction
- Apply discount per transaction (fixed amount or percentage)
- Payment method: Cash or GCash
- Mark transaction as utang (auto-logs to Utang Tracker)
- Auto-deduct stock on every completed sale
- Void transaction with required reason
- Daily sales summary (total revenue, number of transactions)

### 4. Utang Tracker

- Log customer name + amount owed
- Link utang to a POS transaction or add manually
- Record partial or full payment
- Outstanding balance per customer
- Full payment history per customer
- Total outstanding balance across all customers

### 5. Dashboard

- Today's sales vs yesterday
- Low stock alerts list
- Next payroll cutoff countdown
- Total outstanding utang
- Gross profit this month (revenue minus cost of goods)
- Recent transactions feed

---

## Shared Features

- Business profile setup (name, type, country, currency)
- Single user — owner only for MVP 1
- One user can create and manage multiple businesses
- Business switcher (selector on login if multiple, direct to dashboard if one)
- Fully mobile responsive
- CSV / Excel import with smart column matching + preview + downloadable templates

---

## Database Schema

### users

```
id            text  primary key
email         text  unique not null
password      text  not null
created_at    text  not null
last_login_at text
```

### businesses

```
id          text  primary key
owner_id    text  → users.id
name        text  not null
type        text
country     text  default 'PH'
currency    text  default 'PHP'
address     text
logo_url    text
is_active   int   default 1
created_at  text  not null
```

### user_businesses

```
id          text  primary key
user_id     text  → users.id
business_id text  → businesses.id
role        text  default 'owner'
joined_at   text  not null
```

### products

```
id                  text    primary key
business_id         text    → businesses.id
name                text    not null
category            text
unit                text    not null
buying_price        real    not null
selling_price       real    not null
current_stock       int     default 0
low_stock_threshold int     default 5
is_active           int     default 1
created_at          text    not null
updated_at          text    not null
```

### stock_movements

```
id              text  primary key
product_id      text  → products.id
business_id     text  → businesses.id
type            text  (restock, sale, adjustment, void)
quantity_change int   (positive = added, negative = deducted)
stock_before    int
stock_after     int
reference_id    text  (transaction_id or restock_id)
notes           text
created_at      text  not null
```

### restocks

```
id              text  primary key
product_id      text  → products.id
business_id     text  → businesses.id
quantity_added  int   not null
cost_per_unit   real  not null
total_cost      real  not null
supplier_name   text
notes           text
created_at      text  not null
```

### employees

```
id                text  primary key
business_id       text  → businesses.id
full_name         text  not null
position          text
employment_type   text  (regular, probationary, contractual, part_time)
salary_type       text  (monthly, daily)
basic_salary      real  not null
date_hired        text
sss_number        text
philhealth_number text
pagibig_number    text
tin_number        text
is_active         int   default 1
created_at        text  not null
```

### payroll_periods

```
id            text  primary key
business_id   text  → businesses.id
period_start  text  not null
period_end    text  not null
status        text  (draft, finalized)
created_at    text  not null
finalized_at  text
```

### payroll_records

```
id                        text  primary key
period_id                 text  → payroll_periods.id
employee_id               text  → employees.id
basic_pay                 real
overtime_pay              real  default 0
allowances                real  default 0
bonuses                   real  default 0
other_additions           real  default 0
absences_deduction        real  default 0
tardiness_deduction       real  default 0
cash_advance_deduction    real  default 0
other_deductions          real  default 0
sss_employee_share        real
philhealth_employee_share real
pagibig_employee_share    real
withholding_tax           real
gross_pay                 real
total_deductions          real
net_pay                   real
notes                     text
created_at                text  not null
```

### government_contribution_tables

```
id                text  primary key
contribution_type text  (sss, philhealth, pagibig, withholding_tax)
effective_date    text
table_data        text  (JSON string of brackets and rates)
notes             text
```

### transactions

```
id               text  primary key
business_id      text  → businesses.id
transaction_date text  not null
payment_method   text  (cash, gcash, utang)
subtotal         real
discount_type    text  (none, amount, percentage)
discount_value   real  default 0
total_amount     real
status           text  (completed, voided)
void_reason      text
created_at       text  not null
```

### transaction_items

```
id            text  primary key
transaction_id text → transactions.id
product_id    text  → products.id
quantity      int
unit_price    real
buying_price  real
subtotal      real
```

### utang_records

```
id              text  primary key
business_id     text  → businesses.id
transaction_id  text  → transactions.id (nullable if added manually)
customer_name   text  not null
amount_owed     real  not null
amount_paid     real  default 0
balance         real
status          text  (unpaid, partial, paid)
notes           text
created_at      text  not null
updated_at      text  not null
```

### utang_payments

```
id              text  primary key
utang_id        text  → utang_records.id
amount_paid     real  not null
payment_date    text  not null
notes           text
created_at      text  not null
```

---

## UI Principles

- Single column layouts — no sidebars on mobile
- Floating action button (FAB) for primary actions (add product, record sale)
- Cards over tables — friendlier on small screens
- Minimal text — icons + short labels
- Instant feedback — no full page reloads for simple actions
- Errors in plain language — no technical messages
- Empty states with a clear call to action — never a blank screen

---

## Screen Map

### Auth

- Login
- Register
- Forgot password
- Reset password

### Onboarding

- Create first business (name, type, currency)
- Business switcher (if multiple businesses)

### Dashboard

- Overview cards (sales, low stock, payroll countdown, utang)
- Recent transactions feed

### Inventory

- Product list (search, filter by category, low stock badge)
- Add / edit product form
- Product detail + stock movement history
- Restock form
- Manual adjustment form
- Low stock view
- Import screen (upload, preview, confirm)

### Payroll

- Employee list
- Add / edit employee form
- Run payroll (select period, review computations)
- Payroll detail per employee (additions, deductions, net pay)
- Payslip PDF preview + download
- Import screen (upload, preview, confirm)

### POS

- Product selector (search, categories)
- Cart (items, quantities, discount)
- Payment screen (method, amount, change calculator for cash)
- Receipt / confirmation screen
- Daily sales summary

### Utang Tracker

- Customer list (outstanding balance per customer)
- Customer detail (all utang records, payment history)
- Add utang manually
- Record payment form
- Total outstanding view

### Settings

- Business profile (name, type, country, currency, logo)
- Add new business
- Switch business
- Account settings (email, password)

---

## Development Phases

---

### Phase 0 — Project Setup

**Goal:** Working Next.js project with auth and business switcher before any module.
**Estimated time:** 3–5 days

Steps:

1. Initialize Next.js 14 project with App Router
2. Install and configure shadcn/ui + Tailwind
3. Install Drizzle ORM + better-sqlite3
4. Define full DB schema in Drizzle
5. Run first migration — all tables created locally
6. Set up NextAuth.js — email + password login
7. Build register, login, forgot password, reset password screens
8. Build business creation screen (first time setup)
9. Build business switcher logic (session stores active business)
10. Build base layout (nav, mobile bottom bar, business switcher in header)
11. Protect all routes — redirect to login if no session

**Done when:** You can register, create a business, log in, and see an empty dashboard.

---

### Phase 1 — Inventory Module

**Goal:** Owner can manage their full product catalog and stock.
**Estimated time:** 1.5–2 weeks

Steps:

1. Build product list screen (empty state, search, category filter)
2. Build add product form (name, category with suggestions, unit dropdown, prices, stock, threshold)
3. Build edit product form
4. Build product detail screen + stock movement history
5. Build restock form (qty, cost, supplier, notes) + stock_movement log
6. Build manual adjustment form (qty change, required reason) + stock_movement log
7. Build low stock alert view (filtered list)
8. Build archive / restore product
9. Build CSV / Excel import (upload → column match → preview → confirm)
10. Build downloadable import template
11. Connect low stock alerts to dashboard

**Done when:** Owner can add products, restock, adjust, import from Excel, and see low stock alerts.

---

### Phase 2 — POS Module

**Goal:** Owner can record sales and stock auto-updates.
**Estimated time:** 1–1.5 weeks

Steps:

1. Build product selector screen (search, category tabs, stock badge)
2. Build cart (add items, adjust quantities, remove items)
3. Build discount logic (fixed or percentage)
4. Build payment screen (cash with change calculator, GCash, mark as utang)
5. Record transaction + transaction_items to DB
6. Auto-deduct stock on sale + log stock_movement (type: sale)
7. Build void transaction flow (reason required, stock restored)
8. Build daily sales summary screen
9. Connect today's sales to dashboard

**Done when:** Owner can run a full sale, stock updates automatically, and they can see daily totals.

---

### Phase 3 — Utang Tracker Module

**Goal:** Owner can track customer credit and record payments.
**Estimated time:** 3–5 days

Steps:

1. Auto-create utang_record when POS transaction marked as utang
2. Build customer list (name, total outstanding balance)
3. Build customer detail (all utang records, payment history)
4. Build add utang manually form
5. Build record payment form (partial or full)
6. Update balance and status on payment
7. Connect total outstanding utang to dashboard

**Done when:** Owner can see who owes them money, how much, and record payments.

---

### Phase 4 — Payroll Module

**Goal:** Owner can run payroll and generate payslips.
**Estimated time:** 2–2.5 weeks

Steps:

1. Build employee list screen
2. Build add / edit employee form
3. Seed government contribution tables (SSS, PhilHealth, Pag-IBIG, withholding tax)
4. Build payroll period creation (select start and end date)
5. Build payroll computation logic (auto-calculate all government deductions)
6. Build payroll review screen (per employee — additions, deductions, net pay)
7. Build manual additions and deductions inputs
8. Build finalize payroll action (locks the period)
9. Build payslip PDF template using React-PDF
10. Build payslip download (single and bulk)
11. Build CSV / Excel employee import
12. Connect next payroll cutoff countdown to dashboard

**Done when:** Owner can run a full payroll cycle and download correct payslips.

---

### Phase 5 — Dashboard + Polish

**Goal:** Dashboard feels complete, app feels production-ready.
**Estimated time:** 3–5 days

Steps:

1. Complete dashboard (all cards connected to real data)
2. Add empty states to all screens (friendly messages, clear CTAs)
3. Add loading states (skeletons, not spinners where possible)
4. Add error handling (friendly messages, no crashes)
5. Mobile UI pass (test every screen on small screen)
6. Performance pass (fast page loads, no unnecessary re-renders)
7. Final design consistency pass (spacing, typography, colors)

**Done when:** The full app feels complete, fast, and polished on mobile.

---

### Phase 6 — Pre-Launch

**Goal:** Ready for real users.
**Estimated time:** 3–5 days

Steps:

1. Switch DB from local SQLite to Turso
2. Set up Vercel deployment
3. Set up Resend for transactional emails
4. Set up Cloudflare R2 for file storage
5. Set up PayMongo for Philippine payments
6. Add "Powered by Paldo" on free tier payslips
7. Create downloadable import templates (hosted)
8. Write basic FAQ / help page
9. Test full flow end to end on mobile
10. Soft launch to 5 real business owners

**Done when:** Real business owners are using it daily.

---

## Total Estimated Timeline

| Phase     | Description                              | Time           |
| --------- | ---------------------------------------- | -------------- |
| Phase 0   | Project setup + auth + business switcher | 3–5 days       |
| Phase 1   | Inventory module                         | 1.5–2 weeks    |
| Phase 2   | POS module                               | 1–1.5 weeks    |
| Phase 3   | Utang tracker                            | 3–5 days       |
| Phase 4   | Payroll module                           | 2–2.5 weeks    |
| Phase 5   | Dashboard + polish                       | 3–5 days       |
| Phase 6   | Pre-launch                               | 3–5 days       |
| **Total** |                                          | **8–12 weeks** |

---

## What NOT to Build in MVP 1

- Staff / multi-user accounts
- Multi-branch support
- Expenses tracker
- Supplier / purchase order management
- Customer loyalty / points
- BIR filing automation
- Mobile app (web app first)
- Advanced analytics
- Integrations (Shopee, Lazada, etc.)
- Subscription / payment system (validate first, monetize after)

---

## Definition of Done — MVP 1

A real business owner can:

1. Register and set up their business in under 5 minutes
2. Import their existing products from Excel
3. Record sales through the POS and stock updates automatically
4. Track who owes them money and record payments
5. Run payroll and download correct payslips
6. See their business at a glance on the dashboard
7. Do all of the above on their phone
