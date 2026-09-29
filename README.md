# BidFlow

> **Lightweight eSourcing for modern procurement teams.**  
> Turn Excel, email, and WhatsApp-based supplier quotations into structured RFQs, live reverse auctions, and auditable sourcing events.

---

## Overview

**BidFlow** is a B2B eSourcing SaaS built for procurement teams that need a simpler way to run supplier quotations and reverse auctions without adopting a heavyweight enterprise procurement suite.

Buyers can create sourcing events, invite suppliers, collect quotations, run live reverse auctions, compare offers, award suppliers, and export a complete audit trail.

The initial product focuses on **private sourcing** using a **Bring Your Own Vendors (BYOV)** model.

```text
Create RFQ
   ↓
Add Items / Lots
   ↓
Invite Suppliers
   ↓
Collect Quotations
   ↓
Optional Live Reverse Auction
   ↓
Compare Offers
   ↓
Award Supplier
   ↓
Export Results
```

---

## Why BidFlow?

Many procurement teams still manage sourcing through a combination of:

- Excel spreadsheets
- Email threads
- WhatsApp conversations
- Manually consolidated supplier quotations
- Repeated negotiation rounds with little auditability

BidFlow aims to replace that workflow with a lightweight, structured sourcing process.

### Core positioning

> **The sourcing tool procurement teams graduate to after Excel.**

BidFlow is intentionally **not** trying to become a full ERP or an SAP Ariba replacement.

---

## Core Features

### Private RFQs

Create structured sourcing events with:

- Event details
- Lots and items
- Quantities
- Units of measure
- Specifications
- Start and end times
- Supplier invitations

---

### Supplier Invitations

Invite suppliers directly by email.

Suppliers can:

- Accept an invitation
- Join a private sourcing event
- Review event requirements
- Submit quotations
- Participate in live bidding

Private suppliers do not require marketplace-style onboarding or complex KYB verification.

---

### Reverse Auctions

Run live reverse auctions with:

- Immutable bid history
- Server-side validation
- Minimum bid decrement
- Supplier ranking
- Real-time updates
- Soft-close / anti-sniping extensions
- Event timing controlled by the server

The database is always the source of truth.

---

### Supplier Award

The lowest bidder is **not automatically awarded**.

Buyers can select the awarded supplier based on:

- Price
- Quality
- Lead time
- Capacity
- Delivery requirements
- Commercial terms
- Internal procurement considerations

Award decisions can include a written justification.

---

### Audit Trail

BidFlow records important sourcing activity such as:

- Event creation
- Event updates
- Supplier invitations
- Invitation acceptance
- Bid submissions
- Auction extensions
- Event closure
- Supplier awards
- Export generation

Auditability is a core product feature, not an afterthought.

---

### Procurement Reports

After an event closes, buyers can review:

- Suppliers invited
- Suppliers participating
- Bid history
- Initial lowest quotation
- Final lowest quotation
- Potential savings
- Lowest bidder
- Awarded supplier
- Award reason

Initial export target:

- XLSX
- CSV

---

## Product Scope

### Current / SLC Scope

BidFlow's initial SLC focuses on:

- Authentication
- Buyer organizations
- Organization roles
- Event creation
- Lots and items
- Supplier invitations
- Supplier portal
- Standard RFQ submission
- Reverse auction bidding
- Bid ranking
- Minimum decrement rules
- Soft-close extensions
- Real-time updates
- Audit logs
- Supplier award
- Result export

---

### Explicit Non-Goals

The following are intentionally **out of scope for v1**:

- Public supplier marketplace
- Escrow
- Buyer-to-supplier payments
- Invoice processing
- Purchase order lifecycle
- Delivery tracking
- Contract lifecycle management
- ERP replacement
- SAP integration
- Oracle integration
- AI negotiation agents
- AI supplier recommendations
- AI price prediction
- Supplier scorecards
- Mobile application
- SAML / enterprise SSO
- Complex sourcing optimization

The goal is to build a reliable sourcing workflow before expanding into adjacent procurement products.

---

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js Route Handlers
- Server Actions where appropriate
- Prisma ORM
- PostgreSQL

### Authentication

Preferred:

- Better Auth

Possible alternatives:

- Auth.js
- Clerk

### Real-time Updates

Preferred:

- Ably

Possible alternatives:

- Pusher
- Supabase Realtime

Bid submission still happens through standard server requests. Real-time infrastructure is used only to push updated event state to connected clients.

### Email

- Resend

### File Storage

Preferred:

- Cloudflare R2

Alternatives:

- Amazon S3
- UploadThing

### Hosting

- Vercel

### Monitoring

- Sentry
- Vercel logs / analytics

---

## Architecture

BidFlow is designed as a **modular monolith**.

```text
                    ┌─────────────────┐
                    │     Browser     │
                    │ Buyer/Supplier  │
                    └────────┬────────┘
                             │
                      HTTPS / POST
                             │
                    ┌────────▼────────┐
                    │     Next.js     │
                    │ API + UI Layer  │
                    └────────┬────────┘
                             │
                  Business Validation
                             │
                    ┌────────▼────────┐
                    │     Prisma      │
                    │   PostgreSQL    │
                    └────────┬────────┘
                             │
                    Successful Commit
                             │
                    ┌────────▼────────┐
                    │    Realtime     │
                    │  Ably / Pusher  │
                    └────────┬────────┘
                             │
                    Broadcast Updates
                             │
               ┌─────────────┴─────────────┐
               ▼                           ▼
          Buyer UI                    Supplier UI
```

---

## Bidding Architecture

Bid submission follows a strict server-authoritative flow:

```text
Supplier submits bid
        ↓
Authenticate user
        ↓
Authorize supplier
        ↓
Validate event state
        ↓
Validate server time
        ↓
Validate minimum decrement
        ↓
Database transaction
        ↓
Insert immutable bid
        ↓
Apply soft-close extension if required
        ↓
Write audit log
        ↓
Commit transaction
        ↓
Publish realtime update
```

### Important Rule

**Never overwrite an existing bid.**

Bad:

```text
Bid = 100,000
UPDATE Bid = 95,000
```

Good:

```text
Bid #1 = 100,000 @ 14:03:12
Bid #2 =  95,000 @ 14:08:44
```

Bid history must remain auditable.

---

## Multi-Tenancy

BidFlow is multi-tenant.

Every buyer-owned resource belongs to an organization.

```text
Organization
  └── Sourcing Event
      ├── Suppliers
      ├── Lots
      ├── Items
      ├── Bids
      ├── Awards
      └── Audit Logs
```

Tenant isolation is enforced server-side.

Never trust an `organizationId` supplied by the client without validating the authenticated user's membership.

---

## Suggested Domain Models

```text
User
Organization
OrganizationMember

SupplierProfile

SourcingEvent
EventSupplier

Lot
Item

Bid

Invitation

QualificationQuestion
QualificationAnswer

Award

AuditLog

Notification
```

---

## Event Lifecycle

```text
DRAFT
  ↓
SCHEDULED
  ↓
OPEN
  ↓
CLOSED
  ↓
AWARDED
```

Alternative exits:

```text
DRAFT     → CANCELLED
SCHEDULED → CANCELLED
OPEN      → CANCELLED
```

Event state transitions must be handled through explicit server-side operations.

---

## Soft Close

BidFlow supports anti-sniping auction extensions.

Example:

```text
Auction ends:        15:00
Soft-close window:   2 minutes
Extension duration:  2 minutes

New bid:             14:59

New auction end:     15:02
```

If another valid bid arrives inside the new soft-close window, the auction may extend again.

All timing decisions use **server time**.

---

## Supplier Privacy

Suppliers should not automatically see:

- Competitor names
- Competitor contact information
- Full competitor bid history

Default supplier visibility:

- Own bid history
- Own current rank
- Updated event end time

Additional visibility modes may be introduced later.

---

## Getting Started

> Setup details may change as the project evolves.

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/BidFlow.git
cd BidFlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env.local
```

Example variables:

```env
DATABASE_URL=
AUTH_SECRET=

RESEND_API_KEY=
EMAIL_FROM=

ABLY_API_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Development Principles

When contributing to BidFlow:

1. Keep the architecture simple.
2. Prefer a modular monolith over microservices.
3. Keep business logic out of React components.
4. Validate external input with Zod.
5. Enforce authorization server-side.
6. Treat bids as immutable records.
7. Use database transactions for bid submission.
8. Broadcast realtime updates only after successful commit.
9. Never expose competitor-sensitive data unintentionally.
10. Never make browser state authoritative.

---

## AI Agent Instructions

This repository is designed to work with AI coding agents.

Before implementing any feature, agents should read:

- [`prd.md`](./prd.md)
- [`plan.md`](./plan.md)

Agents should:

- Follow the current implementation phase
- Respect explicit non-goals
- Avoid speculative abstractions
- Avoid adding unrequested infrastructure
- Prefer production-safe simplicity
- Add tests for bidding logic
- Preserve tenant isolation
- Preserve bid immutability

Agents must not add major features such as payments, public marketplace functionality, AI negotiation, ERP integrations, or microservices unless explicitly requested.

---

## Roadmap

### Phase 1 — Private RFQ

- Buyer organizations
- Event creation
- Lots and items
- Supplier invitations
- Supplier quotation
- Award
- Audit trail
- Export

### Phase 2 — Reverse Auctions

- Live bidding
- Realtime rank updates
- Minimum decrement
- Soft close
- Bid history

### Phase 3 — Supplier Database

- Saved supplier directory
- Reusable supplier profiles
- Supplier tags

### Phase 4 — Supplier Discovery

- Public supplier profiles
- Supplier verification
- Supplier search

### Phase 5 — Supplier Performance

- Performance history
- Supplier analytics
- Ratings / internal scorecards

### Phase 6 — Integrations

- Public API
- Webhooks
- ERP integrations

---

## Product Philosophy

BidFlow should win by being simpler than enterprise procurement platforms while being dramatically more structured than spreadsheets and chat messages.

The goal is not:

> Build a cheaper SAP Ariba.

The goal is:

> **Build the sourcing tool procurement teams graduate to after Excel.**

---

## Status

🚧 **Early development / SLC**

The product is currently focused on validating the core private sourcing and reverse-auction workflow.

---

## Documentation

- [`prd.md`](./prd.md) — Product requirements and product guardrails
- [`plan.md`](./plan.md) — Technical implementation plan and build phases

---

## License

License to be determined.

For now, treat the repository as proprietary unless stated otherwise.
