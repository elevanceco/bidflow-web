# Product Requirements Document — BidFlow

> Working name: **BidFlow**
> Product category: B2B eSourcing / RFQ / Reverse Auction SaaS
> Target platform: Web
> Primary stack: Next.js, React, Prisma, PostgreSQL
> Primary customer: Procurement teams at SMEs and mid-market companies

---

## 1. Product Summary

BidFlow is a lightweight B2B eSourcing platform for procurement teams that currently manage supplier quotations through Excel, email, WhatsApp, and manual comparison sheets.

The product allows buyers to:

1. Create an RFQ / sourcing event.
2. Add items, lots, quantities, and specifications.
3. Invite known suppliers privately.
4. Collect initial quotations.
5. Optionally run a live reverse auction.
6. Compare bids.
7. Award a supplier.
8. Export an auditable result.

### Core positioning

> Turn your Excel-based vendor quotation process into an auditable sourcing event in minutes.

BidFlow is **not** intended to be a full ERP, payment platform, or enterprise procurement suite in the first versions.

The initial wedge is:

**Excel + Email + WhatsApp → Structured RFQ + Reverse Auction + Audit Trail**

---

## 2. Product Principles

The following principles should guide all implementation decisions.

### 2.1 Private sourcing first

The initial product is not a public procurement marketplace.

Buyers bring their own suppliers.

This is the **BYOV — Bring Your Own Vendors** model.

Public supplier discovery is a future expansion only after a supplier network grows organically.

### 2.2 Reverse auction is a feature, not the entire product

The product should eventually support:

- Standard RFQ
- Multi-round quotation
- Live reverse auction

The system should not force every sourcing event into a live auction.

### 2.3 Lowest bidder does not automatically win

The product must distinguish:

- Lowest current bidder
- Awarded supplier

The buyer always makes the final award decision.

Award decisions may consider:

- Price
- Quality
- Lead time
- Capacity
- Commercial terms
- Compliance
- Delivery requirements

### 2.4 Database is the source of truth

Never trust:

- Browser time
- Client-side ranking
- Client-side bid validation
- Client-side auction state

All bidding rules must be validated server-side.

### 2.5 Bids are immutable

Never overwrite historical bids.

Every new bid must create a new bid record.

Example:

- Bid 1: Rp100,000,000 at 14:03:12
- Bid 2: Rp95,000,000 at 14:08:44

Do not update Bid 1 to Rp95,000,000.

### 2.6 Auditability is a core feature

Procurement teams need defensible event history.

Important changes and actions must be recorded in an audit log.

---

## 3. Target Customers

### Initial ICP

Primary targets:

- SMEs
- Mid-market companies
- Manufacturers
- Distributors
- Construction companies
- Hospitality groups
- Multi-location businesses

Ideal customers already have established suppliers but manage RFQs manually.

### Primary buyer persona

**Procurement Officer / Procurement Manager**

Common pain points:

- Chasing suppliers over WhatsApp or email
- Manually comparing quotation spreadsheets
- No standardized bid process
- No audit trail
- Difficulty tracking negotiation rounds
- Difficulty proving savings
- Supplier quotations arrive in inconsistent formats
- Procurement events are difficult to revisit later

### Supplier persona

Supplier sales representative who needs to:

- Receive invitation
- Understand RFQ requirements
- Submit quotation
- Participate in a reverse auction
- See their own bidding position
- Avoid complex onboarding

---

## 4. MVP Scope

The MVP must include three major product areas.

---

# 4.1 Private RFQ & Supplier Invitation

## Buyer capabilities

Buyer can:

- Create sourcing event
- Enter event title
- Enter event description
- Select sourcing type
- Set event start time
- Set event end time
- Add items or lots
- Define item quantities
- Define specifications
- Define units of measure
- Add suppliers
- Invite suppliers through email
- Configure auction rules
- Launch event
- Monitor invited suppliers
- See supplier participation status

## Supplier invitation flow

Preferred flow:

1. Buyer enters supplier email.
2. System sends a signed invitation link.
3. Supplier opens link.
4. Supplier verifies email / creates account.
5. Supplier accepts event terms.
6. Supplier joins event.

Private suppliers do not require full KYB for MVP.

Required checks:

- Email verification
- Valid invitation token
- Supplier organization association
- Event eligibility

---

# 4.2 Bidding Engine

The bidding engine is the most important technical component.

## Required capabilities

- Bid submission
- Server-side bid validation
- Immutable bid history
- Current best price
- Supplier ranking
- Minimum bid decrement
- Event start validation
- Event end validation
- Supplier eligibility validation
- Currency validation
- Lot/item validation
- Realtime updates
- Soft-close extension
- Audit logging

## Bid validation

When a supplier submits a bid, server must validate:

1. User is authenticated.
2. User belongs to a supplier organization.
3. Supplier is invited to the event.
4. Supplier has accepted required event terms.
5. Event is active.
6. Current server time is within bidding window.
7. Supplier is allowed to bid on the lot/item.
8. Bid amount is valid.
9. Bid follows minimum decrement rules.
10. Bid currency matches event currency.

The database must commit the valid bid before realtime updates are broadcast.

## Suggested bid flow

```text
POST /api/events/:eventId/bids

Authenticate
↓
Authorize supplier
↓
Validate event state
↓
Validate bid rules
↓
Open database transaction
↓
Insert immutable bid
↓
Recalculate current leader / rank projection
↓
Insert audit log
↓
Apply auction extension if necessary
↓
Commit transaction
↓
Publish realtime event
```

---

# 4.3 Result & Award

After bidding closes, buyer can view an event result.

Result should include:

- Event name
- Event start
- Event end
- Suppliers invited
- Suppliers participating
- Number of bids
- Initial lowest quotation
- Final lowest quotation
- Potential savings
- Lowest bidder
- Awarded supplier
- Award reason
- Complete bid history

Buyer can:

- Award supplier
- Add award justification
- Export result
- Export audit history

Do not automatically award the lowest supplier.

---

## 5. Sourcing Types

### MVP

Support:

1. Standard RFQ
2. Live Reverse Auction

### Future

Possible:

3. Multi-round RFQ
4. Sealed bid
5. Forward auction
6. Multi-stage evaluation

Do not implement future sourcing types unless explicitly scheduled.

---

## 6. Auction Rules

Each reverse auction may include:

- Start time
- End time
- Minimum decrement
- Soft-close enabled
- Soft-close threshold
- Extension duration
- Maximum optional bid limit
- Ranking visibility

### Soft close

Example:

- Event ends at 15:00
- Threshold = 2 minutes
- Extension = 2 minutes

A valid bid at 14:59 extends the event to 15:02.

If another valid bid occurs at 15:01, extend to 15:04.

The extension is based on server time.

---

## 7. Supplier Visibility Rules

Default private auction behavior should minimize supplier-to-supplier information exposure.

Suppliers should not see:

- Competitor company names
- Competitor contact information
- Full competitor bid history

Configurable future visibility options may include:

- Own rank only
- Own rank + distance from leader
- Current best price
- Anonymous participant count

For MVP, safest default:

> Supplier sees own bid history and current rank.

---

## 8. Qualification Questions

Optional lightweight event qualification may be included.

Buyer can define:

- Yes / No
- Text
- Numeric
- Dropdown

Question may be marked:

- Required
- Informational
- Disqualifying

Examples:

- Can deliver to Jakarta?
- Minimum monthly capacity?
- ISO certification available?
- Lead time under 30 days?

Do not build complex supplier scoring in MVP.

---

## 9. Organization & Roles

Minimum system roles:

### Buyer organization

- OWNER
- ADMIN
- PROCUREMENT_USER
- VIEWER

### Supplier organization

- SUPPLIER_ADMIN
- SUPPLIER_USER

Permissions must be enforced server-side.

---

## 10. Suggested Data Model

Suggested Prisma entities:

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

Possible enums:

```text
OrganizationType
BUYER
SUPPLIER

EventType
RFQ
REVERSE_AUCTION

EventStatus
DRAFT
SCHEDULED
OPEN
CLOSED
AWARDED
CANCELLED

InvitationStatus
PENDING
ACCEPTED
DECLINED
EXPIRED

BidStatus
VALID
WITHDRAWN
INVALIDATED

AwardStatus
PENDING
AWARDED
REJECTED
```

---

## 11. Audit Log

Important actions must generate audit records.

Examples:

- User signed in
- Event created
- Event edited
- Supplier invited
- Supplier invitation accepted
- Supplier joined event
- Supplier submitted bid
- Bid rejected
- Auction extended
- Buyer changed auction rules
- Event opened
- Event closed
- Supplier awarded
- Award changed
- Export generated

Recommended fields:

```text
id
organizationId
eventId
actorUserId
action
entityType
entityId
metadata
ipAddress
userAgent
createdAt
```

Sensitive metadata should be stored carefully.

---

## 12. Realtime Requirements

Recommended architecture:

- HTTP request for submitting bids
- Realtime provider for publishing state updates

Preferred providers:

- Ably
- Pusher
- Supabase Realtime

Avoid custom WebSocket infrastructure in MVP unless clearly necessary.

Realtime messages should never be treated as authoritative.

After receiving realtime updates, UI should display server-derived state.

---

## 13. Authentication

Recommended:

- Auth.js
- Better Auth
- Clerk

Must support:

- Email login
- Email verification
- Organization membership
- Invitation acceptance

Optional later:

- Google / Microsoft SSO
- SAML
- Enterprise SSO

Do not build SAML in MVP.

---

## 14. File Handling

Possible event attachments:

- Scope documents
- Specifications
- Images
- PDF requirements

Use:

- S3
- Cloudflare R2
- UploadThing

Do not store binary files directly in PostgreSQL.

---

## 15. Email

Recommended provider:

- Resend

Emails required:

- Supplier invitation
- Invitation reminder
- Event opening
- Event ending soon
- Auction extension
- Event closed
- Award notification

Reminder automation can be minimal in MVP.

---

## 16. Pricing Assumptions

Primary payer:

**Buyer**

Suppliers should participate free.

Potential launch pricing:

### Free Trial

- 1 sourcing event

### Single Event

- Rp199,000–399,000 per event

### Team

- ~Rp999,000/month

### Business

- ~Rp2,500,000–3,000,000+/month

### Enterprise

- Custom

Do not implement percentage-of-savings billing in MVP.

Do not charge suppliers to bid.

---

## 17. Public Marketplace — NOT MVP

Public supplier discovery is a future phase.

Future supplier verification levels may include:

### Level 0

Email verified

### Level 1

Business domain verified

### Level 2

Business identity verified

Possible Indonesian information:

- Legal company name
- NIB
- NPWP
- Company address

### Level 3

Enhanced KYB

Do not automate KYB in MVP.

---

## 18. Explicit Non-Goals

The following are **not MVP features**:

- Public supplier marketplace
- Escrow
- Buyer-to-supplier payments
- Invoice processing
- Purchase order lifecycle
- Delivery tracking
- Contract management
- ERP replacement
- SAP integration
- Oracle integration
- AI negotiation
- AI supplier recommendation
- AI price prediction
- Supplier scorecards
- Complex optimization solver
- Mobile app
- SAML
- Multi-currency settlement
- Tax calculation

Agents must not add these unless specifically requested.

---

## 19. Legal / Compliance Guardrails

BidFlow is a sourcing facilitation platform.

It should not be represented as:

- A buyer
- A supplier
- A contracting party
- A guarantor of supplier performance
- A payment intermediary

Important areas requiring legal review before production scale:

- Competition law
- Bid-rigging / collusion rules
- Privacy law
- Electronic systems regulations
- Platform terms
- Supplier disputes
- Commercial confidentiality

Do not build escrow or fund custody into the MVP.

---

## 20. MVP Success Metrics

Primary metrics:

- Events created
- Events launched
- Invitations sent
- Supplier invitation acceptance rate
- Supplier participation rate
- Average bids per event
- Percentage of launched events reaching completion
- Repeat buyer usage
- Time from event creation to launch
- Estimated savings per event

North-star candidate:

> Successfully completed sourcing events per active buyer organization.

---

## 21. Product Roadmap

### Phase 1 — Private RFQ

- Buyer organizations
- Supplier invitations
- RFQ
- Bid submission
- Award
- Audit trail
- Export

### Phase 2 — Reverse Auction

- Live rank
- Realtime updates
- Minimum decrement
- Soft close

### Phase 3 — Supplier Database

- Saved supplier directory
- Supplier reuse across events
- Supplier tags

### Phase 4 — Supplier Discovery

- Public supplier profiles
- Verification levels
- Search / discovery

### Phase 5 — Supplier Performance

- Performance history
- Ratings
- Procurement analytics

### Phase 6 — Integrations

- API
- Webhooks
- ERP integrations

---

## 22. Core Product Rule

When making product decisions, prioritize:

1. Procurement workflow reliability
2. Auditability
3. Simplicity
4. Supplier participation
5. Buyer usability

Do not attempt to build a cheaper SAP Ariba.

Build:

> The sourcing tool procurement teams graduate to after Excel.
