# Paldo Backend Foundation Plan

Status: planned

This document is the implementation reference for the first real backend pass.
It is intentionally scoped to the current product state, with inventory as the
first live module, while leaving a clean path to Turso, auth, POS, and the
other modules later.

## Goals

- Replace inventory demo data with a real SQLite-backed backend.
- Use Drizzle ORM with a structure that can move to Turso later with minimal
  churn.
- Keep the current inventory UI direction intact while improving data
  boundaries.
- Add a real `users` model and capture the acting user for inventory logging.
- Use consistent naming and layering across backend and frontend.

## Non-goals For This Phase

- Full auth implementation.
- Public API design.
- Backend implementation for payroll, utang, dashboard, or POS.
- Reworking the inventory UX beyond the already-agreed batch `Stock in`
  direction.

## Current Inventory UI Assumptions

- `Stock in` is a page-level inventory action.
- `Add product` is a page-level secondary action beside `Stock in`.
- The product list card is browse-focused: search, filters, list, pagination.
- `Stock movement history` stays contextual to a specific product.
- `Adjust stock` is secondary and surfaced from product history, not from the
  main list or product details view.

## Stack Decisions

### Database and ORM

- ORM: `drizzle-orm`
- Migration tool: `drizzle-kit`
- Seed tool: `drizzle-seed`
- Driver: `@libsql/client`
- Local database URL: `file:./data/paldo.sqlite`
- Future production database: Turso via `libsql`

Why:

- Drizzle officially supports SQLite with `libsql`, and `libsql` supports both
  local file-backed SQLite and Turso.
- Using `libsql` from day one avoids a future driver-level rewrite when we move
  from local SQLite to Turso.

References:

- Drizzle SQLite: <https://orm.drizzle.team/docs/get-started-sqlite>
- Drizzle + Turso: <https://orm.drizzle.team/docs/tutorials/drizzle-with-turso>
- Drizzle Seed: <https://orm.drizzle.team/docs/kit-seed-data>
- Next.js Server Actions: <https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations>
- Turso local development: <https://docs.turso.tech/local-development>

### Mutations: Server Actions vs API Endpoints

Decision: use server actions for internal inventory mutations.

Use server actions for:

- add product
- edit product
- archive or restore product
- stock in
- adjust stock

Use route handlers only when there is a real external boundary, such as:

- file upload endpoints
- CSV import endpoints
- webhooks
- third-party clients
- future mobile app clients if they do not run in the same Next.js app

Why:

- The current app is App Router-only and internal.
- Server actions remove unnecessary request boilerplate.
- We can keep validation, auth checks, transactions, and cache invalidation in
  one place.

## Backend Design Principles

- Keep SQL naming in `snake_case`.
- Keep TypeScript property names in `camelCase`.
- Never trust client-submitted `userId` or `businessId`; derive actor and
  access from the server session.
- Wrap stock-changing writes in transactions.
- Record inventory changes as append-only movements.
- Keep UI models separate from raw database rows.
- Centralize database access in query and action modules rather than calling
  Drizzle directly from arbitrary components.

## Proposed Folder Structure

This structure matches the current repo style and keeps backend concerns
separate without introducing a full `src/` migration.

```text
app/
  actions/
    inventory/
      add-product.ts
      edit-product.ts
      archive-product.ts
      stock-in.ts
      adjust-stock.ts

db/
  index.ts
  schema/
    users.ts
    businesses.ts
    business-memberships.ts
    categories.ts
    units.ts
    products.ts
    stock-ins.ts
    stock-movements.ts
    index.ts
  relations.ts
  queries/
    inventory.ts
    businesses.ts
  mappers/
    inventory.ts
  seed/
    data/
      inventory.ts
    run.ts

lib/
  auth/
    current-user.ts
  inventory/
    dto.ts
    validation.ts
```

Notes:

- `db/schema/*` owns table definitions only.
- `db/queries/*` owns read access.
- `app/actions/*` owns mutations and orchestration.
- `db/mappers/*` converts database rows to frontend-friendly view models.
- `lib/auth/current-user.ts` is the single place that resolves the current
  signed-in user.

## Naming Conventions

### Database

- Tables: plural `snake_case`
- Columns: `snake_case`
- Foreign keys: `<entity>_id`
- Timestamps: `created_at`, `updated_at`
- Booleans: `is_active`

Examples:

- `business_memberships`
- `actor_user_id`
- `low_stock_threshold`

### TypeScript

- Variables and properties: `camelCase`
- Types and interfaces: `PascalCase`
- Action files: verb-noun, kebab-case
- Query files: noun-based, kebab-case

Examples:

- `actorUserId`
- `lowStockThreshold`
- `stock-in.ts`
- `inventory.ts`

### Frontend Data Shapes

- UI components should receive `camelCase` DTOs only.
- Do not leak raw Drizzle row objects directly into client components.
- Form drafts should stay UI-focused.
- Server mappers should handle translation from DB shape to UI shape.

## Real Backend Models For The Current Inventory UI

The current UI already implies these domain objects:

- users
- businesses
- categories
- units
- products
- stock ins
- stock movements

To support multiple businesses correctly, we also need:

- business memberships

### 1. users

Purpose:

- application-level user identity
- actor tracking for mutations and stock logging

Columns:

- `id`
- `email`
- `password_hash`
- `display_name`
- `is_active`
- `created_at`
- `updated_at`
- `last_login_at`

### 2. businesses

Purpose:

- business switcher
- inventory scoping

Columns:

- `id`
- `name`
- `type`
- `country`
- `currency`
- `address`
- `logo_url`
- `is_active`
- `created_at`
- `updated_at`

### 3. business_memberships

Purpose:

- attach users to businesses
- support owner/member roles later without redesign

Columns:

- `id`
- `user_id`
- `business_id`
- `role`
- `joined_at`

Constraints:

- unique `(user_id, business_id)`

### 4. categories

Purpose:

- normalized product category options per business

Columns:

- `id`
- `business_id`
- `name`
- `created_by_user_id`
- `created_at`
- `updated_at`

Constraints:

- unique `(business_id, name)`

### 5. units

Purpose:

- normalized unit options per business

Strict decision:

- units should be business-scoped in the real backend
- do not make them global, because the current UI allows editing them within a
  business context

Columns:

- `id`
- `business_id`
- `name`
- `created_by_user_id`
- `created_at`
- `updated_at`

Constraints:

- unique `(business_id, name)`

### 6. products

Purpose:

- main inventory record

Columns:

- `id`
- `business_id`
- `category_id`
- `unit_id`
- `name`
- `sku`
- `buying_price`
- `selling_price`
- `current_stock`
- `low_stock_threshold`
- `is_active`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`

Constraints:

- unique `(business_id, sku)`

Notes:

- Keep `current_stock` denormalized for fast reads.
- Stock movements remain the audit source of truth.

### 7. stock_ins

Purpose:

- explicit inbound stock entries with financial context
- one row per received product line, even when the UI submits one batch stock-in

Columns:

- `id`
- `business_id`
- `product_id`
- `quantity_added`
- `cost_per_unit`
- `total_cost`
- `supplier_name`
- `notes`
- `created_by_user_id`
- `created_at`

### 8. stock_movements

Purpose:

- append-only inventory audit log
- product history view
- future POS and void integration

Columns:

- `id`
- `business_id`
- `product_id`
- `type`
- `quantity_change`
- `stock_before`
- `stock_after`
- `reference_type`
- `reference_id`
- `notes`
- `actor_user_id`
- `created_at`

Allowed `type` values for now:

- `stock_in`
- `adjustment`
- `sale`
- `void`

Allowed `reference_type` values for now:

- `stock_in`
- `adjustment`
- `sale`
- `void`
- `system`

Notes:

- `actor_user_id` is required for logging.
- `reference_type` is better than a single ambiguous `reference_id`.
- POS can later create `sale` and `void` movements without redesigning this
  table.

## Audit Rules

- Every stock change must create a `stock_movements` row.
- Every stock-in line must create both:
  - a `stock_ins` row
  - a matching `stock_movements` row
- Every adjust-stock action must create a `stock_movements` row with:
  - `type = adjustment`
  - `reference_type = adjustment`
  - required notes
- Product archive and restore do not create stock movements because they do not
  change stock.
- `actor_user_id` must always come from the server session, never from the
  client.

## Transaction Rules

Wrap these in a single database transaction:

- add product if category or unit may be created inline
- stock in
- adjust stock
- archive or restore if additional audit rows are added later

Transaction expectations:

- read the current product row inside the transaction
- calculate `stock_before` and `stock_after` on the server
- write the product update and movement log atomically
- fail the full mutation if any step fails

## Seeding Plan

We will seed only what the current UI needs, using deterministic demo-like data.

Initial seed contents:

- 1 user
- 3 businesses
- memberships linking the user to those businesses
- categories per business
- units per business
- products per business
- stock ins
- stock movements

Seed strategy:

- use `drizzle-seed`
- keep seed data in plain TypeScript modules
- mirror the current `lib/dummy-data.ts` values closely so the UI behavior
  remains familiar
- keep seeds id-stable and rerunnable for development

## Frontend Integration Plan

The frontend should adopt backend conventions too.

### Reads

- Fetch inventory data through server-side query functions.
- Map database rows to UI DTOs before passing them to client components.
- Keep `InventoryView` focused on interaction state, not database shape.

### Writes

- Use server actions for inventory mutations.
- Keep mutation payloads small and explicit.
- Derive `currentUserId` on the server.
- Revalidate or refresh inventory reads after mutation success.
- Keep `Stock movement history` contextual to a product instead of introducing a
  global ledger route in this phase.

### Form Handling

The current UI lets users type category and unit names directly. We should keep
that UX, but change the backend flow:

- the frontend submits category and unit names
- the server resolves existing records by name within the selected business
- if missing, the server creates them in the same transaction
- the product row always stores `category_id` and `unit_id`, never raw names

### DTO Guidance

Recommended UI-facing types:

- `InventoryListItem`
- `InventoryProductDetails`
- `InventoryStockMovementItem`
- `AddProductInput`
- `EditProductInput`
- `StockInInput`
- `AdjustStockInput`

Keep DTOs separate from schema definitions.

## Auth and Current User Handling

Even before full auth implementation, the backend plan assumes a current-user
helper with this contract:

- `requireCurrentUser()`
- returns the authenticated user
- throws or redirects if no user is available

Business access helper:

- `requireBusinessAccess(businessId)`
- checks that the current user belongs to the business
- returns membership context

Mutation rule:

- never trust client-submitted ownership or membership claims

## Recommended Implementation Order

1. Install Drizzle, libSQL, seed, and env tooling.
2. Add database config and connection setup.
3. Create schema files and generated migrations.
4. Add the seed pipeline.
5. Seed local SQLite with current demo-equivalent data.
6. Add inventory query functions.
7. Add inventory server actions.
8. Replace `dummy-data` usage in inventory only.
9. Verify the current UI against the current batch `Stock in` flow.
10. Move to auth integration after the inventory backend is stable.

## Risks To Avoid

- mixing DB calls directly into client components
- using global units across all businesses
- trusting client-provided actor IDs
- updating `current_stock` without writing a movement log
- skipping transactions for stock-changing actions
- leaking raw schema rows into UI components
- introducing API routes for purely internal form mutations

## Open Questions

These are not blockers for the backend foundation plan, but they affect later
implementation details:

- which auth solution will back `currentUser`
- whether product SKU should be required or nullable long-term
- whether supplier names should become a real table later
- whether import flows should create staged import tables later

## Immediate Next Step

When we start implementation, the next concrete task is:

- install the database and migration dependencies
- add the DB config
- define the inventory-first schema
- add the seed script
