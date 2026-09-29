# Implementation Plan — BidFlow SLC

> This document is intended for AI coding agents and developers.
> Follow phases in order.
> Do not introduce features from later phases unless explicitly requested.

---

# 1. Technical Objective

Build a production-ready SLC for a private B2B RFQ / reverse-auction SaaS using:

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- Realtime provider
- Resend
- Object storage

The first version should optimize for:

- Correctness
- Auditability
- Tenant isolation
- Simple supplier onboarding
- Reliable bidding
- Small operational burden for a solo developer

---

# 2. Recommended Stack

## Application

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Route Handlers
- Server Actions where appropriate
- Prisma ORM
- PostgreSQL

## Authentication

Preferred:

- Better Auth

Acceptable alternatives:

- Auth.js
- Clerk

## Realtime

Preferred:

- Ably

Alternatives:

- Pusher
- Supabase Realtime

Bid submission must still use normal server requests.

## Email

- Resend

## File storage

Preferred:

- Cloudflare R2

Alternative:

- S3
- UploadThing

## Hosting

Preferred:

- Vercel

## Monitoring

Suggested:

- Sentry
- Vercel Analytics / logs

---

# 3. Repository Structure

Suggested structure:

```text
src/
  app/
    (auth)/
    dashboard/
    supplier/
    api/

  components/
    ui/
    events/
    bids/
    suppliers/

  features/
    auth/
    organizations/
    events/
    suppliers/
    bidding/
    awards/
    audit/

  lib/
    auth/
    db/
    realtime/
    email/
    storage/
    permissions/
    validation/

  server/
    services/
    repositories/

  types/

prisma/
  schema.prisma
  seed.ts
```

Keep business logic out of React components.

---

# 4. Architecture Rules

## 4.1 Server is authoritative

Never calculate authoritative:

- Event status
- Rank
- Winning bid
- Auction end
- Bid validity

on the client only.

Client calculations may be used for display only.

---

## 4.2 Multi-tenancy

Every buyer-owned entity must have an organization boundary.

Examples:

```text
Organization
  └── SourcingEvent
      ├── EventSupplier
      ├── Lot
      ├── Item
      ├── Bid
      ├── Award
      └── AuditLog
```

All queries must include organization/event authorization.

Never accept `organizationId` from the client and trust it blindly.

Resolve authorized organization membership server-side.

---

## 4.3 Immutable bids

Bid rows are append-only.

Do not UPDATE the amount on an existing bid.

If a bid needs administrative invalidation:

- mark status
- create audit record
- retain original bid

---

## 4.4 Use transactions

Any bid operation affecting multiple records should use:

```ts
prisma.$transaction(...)
```

Bid transaction should perform:

1. Re-fetch event state.
2. Verify event is open.
3. Verify server time.
4. Verify supplier eligibility.
5. Validate bid.
6. Insert bid.
7. Apply event extension if needed.
8. Insert audit log.
9. Commit.
10. Broadcast realtime event.

Do not publish realtime state before commit.

---

# 5. Phase 0 — Project Bootstrap

## Deliverables

- Next.js project
- TypeScript
- ESLint
- Prettier
- Tailwind
- shadcn/ui
- Prisma
- PostgreSQL connection
- `.env.example`
- Basic CI checks

## Environment variables

Example:

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

Do not commit secrets.

---

# 6. Phase 1 — Authentication & Organizations

## Build

### Authentication

- Sign up
- Sign in
- Sign out
- Email verification
- Forgot password

### Organization onboarding

Buyer signs up and creates:

```text
Organization
- name
- slug
- type = BUYER
```

### Membership

Implement:

```text
OrganizationMember
- userId
- organizationId
- role
```

Roles:

```text
OWNER
ADMIN
PROCUREMENT_USER
VIEWER
SUPPLIER_ADMIN
SUPPLIER_USER
```

## Acceptance criteria

- User can register.
- User can create buyer organization.
- User can only access organizations they belong to.
- Unauthorized users receive 403 or redirect.
- Organization data cannot leak across tenants.

---

# 7. Phase 2 — Event Management

## Create Prisma models

Minimum:

```text
SourcingEvent
Lot
Item
```

### SourcingEvent

Suggested fields:

```text
id
organizationId
title
description
type
status
currency
startsAt
endsAt
originalEndsAt
minimumDecrement
softCloseEnabled
softCloseThresholdSeconds
softCloseExtensionSeconds
createdById
createdAt
updatedAt
```

### Lot

```text
id
eventId
name
description
displayOrder
```

### Item

```text
id
lotId
name
description
quantity
unit
targetPrice
displayOrder
```

## UI

Buyer dashboard:

- Event list
- New event
- Draft event
- Event details
- Edit event
- Delete draft event

Event wizard:

1. Basics
2. Items / lots
3. Suppliers
4. Auction rules
5. Review
6. Launch

## Acceptance criteria

- Buyer can create DRAFT event.
- Buyer can add lots/items.
- Buyer can configure dates.
- Buyer can configure minimum decrement.
- Buyer can configure soft close.
- Only draft events can be freely edited.

---

# 8. Phase 3 — Suppliers & Invitations

## Models

```text
SupplierProfile
EventSupplier
Invitation
```

### EventSupplier

Suggested fields:

```text
id
eventId
supplierOrganizationId
status
invitedEmail
invitedAt
joinedAt
```

## Invitation flow

Buyer enters supplier:

```text
companyName
contactName
email
```

System:

1. Creates invitation.
2. Generates signed/random token.
3. Sends email.
4. Supplier opens invitation.
5. Supplier creates account or signs in.
6. Supplier accepts event.
7. Supplier organization is created/reused.
8. EventSupplier becomes ACCEPTED.

## Rules

- Invitation token must expire.
- Invitation token must be single-use or safely reusable only until acceptance.
- Supplier cannot join arbitrary events by guessing IDs.
- Supplier cannot access buyer-only event data.

## Acceptance criteria

- Supplier receives email.
- Supplier can accept invitation.
- Existing supplier account can reuse its organization.
- Buyer sees invitation status.

---

# 9. Phase 4 — Standard RFQ

Implement non-realtime RFQ before live auction.

## Supplier experience

Supplier can:

- View event
- View items
- View requirements
- Submit quotation

Possible initial implementation:

Bid is stored per lot.

Do not overcomplicate item-level bidding until needed.

Suggested first domain choice:

```text
One bid amount per lot
```

If product requirements require item-level quotation:

```text
Bid
BidLine
```

Prefer lot-level bidding for SLC simplicity unless item-level pricing is essential.

## Acceptance criteria

- Supplier can submit valid quote.
- Supplier can submit revised quote while event is open.
- Each revision creates a new immutable Bid.
- Buyer can see all bids after submission according to visibility rules.

---

# 10. Phase 5 — Bidding Engine

## Add model

```text
Bid
```

Suggested:

```text
id
eventId
lotId
supplierOrganizationId
submittedById
amount
currency
status
createdAt
```

Indexes:

```text
eventId
lotId
supplierOrganizationId
createdAt
```

Add composite indexes as required by query patterns.

---

## Bid service

Create dedicated service:

```text
src/features/bidding/server/submitBid.ts
```

Pseudo-code:

```ts
async function submitBid(input, session) {
  return prisma.$transaction(async (tx) => {
    const event = await loadEventForBid(tx, input.eventId)

    assertUserCanBid(...)
    assertEventOpen(...)
    assertServerTimeAllowed(...)
    assertSupplierInvited(...)
    assertLotExists(...)
    assertCurrency(...)
    assertMinimumDecrement(...)

    const bid = await tx.bid.create(...)

    const extension = await maybeExtendAuction(...)

    await tx.auditLog.create(...)

    return {
      bid,
      extension,
    }
  })
}
```

After transaction:

```ts
await realtime.publish(...)
```

---

# 11. Ranking Rules

MVP ranking:

Lowest valid amount = rank 1.

For equal bids:

Earlier server-side `createdAt` wins tie priority.

Document this rule.

Example:

```text
Supplier A
100,000
14:00:01

Supplier B
100,000
14:00:03

Supplier A ranks above Supplier B.
```

Do not use browser timestamps.

---

# 12. Minimum Decrement

Example:

Current best:

```text
100,000
```

Minimum decrement:

```text
1,000
```

Next valid leader bid must be:

```text
<= 99,000
```

Define precisely whether decrement applies:

- relative to current best bid
- relative to supplier's previous bid

Recommended MVP:

> Minimum decrement is applied against current best bid.

Add tests for boundary conditions.

---

# 13. Soft Close

Implement only after base bidding tests pass.

Algorithm:

```text
if
  event.softCloseEnabled
  AND endsAt - serverNow <= threshold
then
  endsAt = serverNow + extensionDuration
```

Alternative rule:

```text
endsAt = current endsAt + extensionDuration
```

Choose one and document it.

Recommended:

> Extend from current end time by extension duration.

Example:

```text
endsAt = 15:00
threshold = 2m
extension = 2m

bid = 14:59

new endsAt = 15:02
```

Create audit record:

```text
AUCTION_EXTENDED
```

---

# 14. Phase 6 — Realtime

Do not make realtime authoritative.

## Event channel

Example:

```text
event:{eventId}
```

Messages:

```text
BID_ACCEPTED
RANKING_UPDATED
EVENT_EXTENDED
EVENT_CLOSED
```

Avoid broadcasting sensitive competitor data to supplier clients.

Supplier message should contain only data they are permitted to see.

Example:

```json
{
  "type": "RANKING_UPDATED",
  "eventId": "...",
  "lotId": "...",
  "yourRank": 2,
  "eventEndsAt": "..."
}
```

Buyer channel may contain richer data.

---

# 15. Phase 7 — Audit Logging

Create:

```text
AuditLog
```

Implement helper:

```ts
recordAudit({
  actorUserId,
  organizationId,
  eventId,
  action,
  entityType,
  entityId,
  metadata,
});
```

Required actions:

```text
EVENT_CREATED
EVENT_UPDATED
EVENT_LAUNCHED
SUPPLIER_INVITED
INVITATION_ACCEPTED
BID_SUBMITTED
BID_INVALIDATED
AUCTION_EXTENDED
EVENT_CLOSED
SUPPLIER_AWARDED
EXPORT_GENERATED
```

---

# 16. Phase 8 — Award

Create:

```text
Award
```

Suggested fields:

```text
id
eventId
lotId
supplierOrganizationId
awardedById
reason
status
awardedAt
```

Rules:

- Lowest bidder is not automatically awarded.
- Buyer selects award.
- Award action generates audit log.
- Award can only happen after event closes unless explicitly overridden by authorized buyer.
- Any override should be audited.

---

# 17. Phase 9 — Reporting & Export

Buyer event summary should include:

```text
Event
Invited suppliers
Participating suppliers
Initial best quotation
Final best quotation
Potential savings
Lowest bidder
Awarded supplier
Bid history
Auction extension history
```

Exports:

- CSV or XLSX
- Audit CSV
- PDF can come later

Prefer XLSX over PDF initially.

---

# 18. Phase 10 — Qualification Questions

Only add after main flow works.

Models:

```text
QualificationQuestion
QualificationAnswer
```

Types:

```text
YES_NO
TEXT
NUMBER
SELECT
```

Rules:

```text
required
disqualifying
```

Keep evaluation simple.

Do not build scoring matrices yet.

---

# 19. Testing Strategy

## Unit tests

Must cover:

- Minimum decrement
- Event timing
- Bid eligibility
- Ranking
- Ties
- Soft close
- Supplier authorization
- Role permissions

## Integration tests

Must cover:

### Concurrent bids

Two suppliers submit almost simultaneously.

Expected:

- Both transactions resolve consistently.
- Ranking is deterministic.
- Minimum decrement cannot be bypassed.

### Event close boundary

Test:

- Bid 1 ms before close
- Bid exactly at close
- Bid after close

Define behavior using server timestamps.

### Tenant isolation

Organization A must never access Organization B resources.

### Invitation security

- Expired invite
- Already accepted invite
- Tampered token
- Wrong user

---

# 20. Security Requirements

Must include:

- Server-side authorization
- Tenant isolation
- CSRF protection where applicable
- Secure session cookies
- Rate limiting
- Input validation
- Zod schemas
- SQL injection protection through Prisma
- Signed upload URLs
- File type validation

Rate-limit especially:

```text
login
invitation acceptance
bid submission
email sending
```

---

# 21. Performance Requirements

SLC target:

- Event page loads < 2 seconds under normal usage
- Bid acknowledgement feels near realtime
- Realtime update target < 1 second under normal network conditions
- Support at least 50 concurrent suppliers in one event without architectural redesign

Do not optimize prematurely for thousands of simultaneous bidders.

---

# 22. State Machine

Recommended event state transitions:

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
DRAFT → CANCELLED
SCHEDULED → CANCELLED
OPEN → CANCELLED
```

Do not allow arbitrary state updates from the client.

Create explicit server actions/services:

```text
scheduleEvent()
openEvent()
closeEvent()
cancelEvent()
awardEvent()
```

---

# 23. Scheduled State Transitions

Do not rely only on a user refreshing the page.

Possible approaches:

- Vercel Cron
- background job provider
- scheduled server job

However, every request should still derive effective event state from server time so scheduled jobs are not the only correctness mechanism.

Example:

If status says OPEN but:

```text
serverNow > endsAt
```

bid submission must reject the bid.

---

# 24. UI Pages

## Buyer

```text
/dashboard
/events
/events/new
/events/[id]
/events/[id]/edit
/events/[id]/suppliers
/events/[id]/live
/events/[id]/results
/suppliers
/settings
```

## Supplier

```text
/supplier
/supplier/invitations
/supplier/events/[id]
/supplier/events/[id]/bid
```

---

# 25. Dashboard MVP

Buyer dashboard:

- Active events
- Upcoming events
- Recently closed events
- Draft events

Cards may show:

```text
Event name
Status
Suppliers invited
Suppliers participating
Ends at
Current best price
```

Do not build advanced analytics dashboard yet.

---

# 26. UX Rules

## Buyer

Creating an event should feel like a wizard.

Avoid overwhelming procurement users with every auction option at once.

## Supplier

Supplier should be able to reach bid screen quickly.

Target:

```text
Invitation email
→ Sign in
→ Accept terms
→ Bid
```

Avoid mandatory supplier profile completion for private events.

---

# 27. Email Templates

Build:

```text
supplier-invitation
event-starting
event-open
event-ending-soon
auction-extended
event-closed
supplier-awarded
```

Do not build complex marketing email flows.

---

# 28. Logging & Observability

Use:

- structured server logs
- Sentry
- audit logs

Do not log:

- passwords
- auth tokens
- invitation secrets
- sensitive private documents
- full secrets

---

# 29. Deployment Checklist

Before production:

- Production database configured
- Migrations applied
- Database backups enabled
- Environment secrets configured
- Email domain verified
- Rate limits enabled
- Error monitoring enabled
- Storage bucket private
- HTTPS enforced
- Auth cookies secure
- Tenant isolation tests pass
- Concurrent bid tests pass
- Soft-close tests pass

---

# 30. Do Not Build List

Coding agents must not add the following without explicit approval:

- Public supplier marketplace
- Payment escrow
- Buyer → supplier payment processing
- Invoicing
- Purchase orders
- Delivery tracking
- Contract lifecycle management
- SAP integration
- Oracle integration
- AI supplier recommendation
- AI bidding agents
- AI negotiation
- Pricing prediction
- Mobile app
- Supplier ratings
- SAML
- Full ERP
- Blockchain
- Cryptocurrency
- Microservice architecture

Use a modular monolith.

---

# 31. Coding Agent Rules

When working on BidFlow:

1. Read `prd.md`.
2. Read `plan.md`.
3. Check current phase before implementing.
4. Do not add future features without explicit request.
5. Prefer simple architecture.
6. Use TypeScript strict mode.
7. Use Zod for external input validation.
8. Put authorization on the server.
9. Write tests for bidding logic.
10. Treat bid history as immutable.
11. Use database transactions for bid submission.
12. Broadcast realtime events only after successful commit.
13. Do not expose competitor-sensitive data.
14. Keep tenant boundaries explicit.
15. Do not make UI state authoritative.

---

# 32. Recommended Build Order

```text
01 Project Bootstrap
02 Auth
03 Buyer Organizations
04 Roles / Permissions
05 Event CRUD
06 Lots / Items
07 Supplier Invitations
08 Supplier Portal
09 Standard RFQ Submission
10 Bid History
11 Reverse Auction Validation
12 Ranking
13 Minimum Decrement
14 Soft Close
15 Realtime Updates
16 Audit Logs
17 Award
18 Excel Export
19 Qualification Questions
20 Billing
```

Billing should come after the core product is usable.

---

# 33. First Production Milestone

The first usable milestone is complete when:

A buyer can:

1. Create an organization.
2. Create an RFQ.
3. Add one or more lots.
4. Invite suppliers.
5. Launch event.

A supplier can:

6. Accept invitation.
7. Submit a quotation.
8. Submit revised bids.

The buyer can:

9. Watch updates.
10. Close event.
11. Award a supplier.
12. Download event results.

And the system:

13. Preserves immutable bid history.
14. Maintains tenant isolation.
15. Uses server-side auction timing.
16. Records audit logs.

If all 16 are working reliably, the SLC is ready for initial customer testing.
