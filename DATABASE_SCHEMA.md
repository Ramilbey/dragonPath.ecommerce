# Database Schema

**Database Engine**: PostgreSQL 14+  
**Design Principle**: Relational, normalized, ACID-compliant, with soft deletes for auditability.  
**Data Residency**: All data stored in Uzbekistan (compliance with local law).  
**Ethical Alignment**: Enforces halal-compliant commerce, seller authenticity, and cross-border trust.

---

## Overview

This schema supports the core requirements of the Silk Road Exchange Platform:
- B2B and B2C trade across Asia
- Seller verification & product authenticity
- Escrow-based payments tied to delivery proof
- Multilingual content with moderation
- Risk analysis for banned users

---

## Core Tables

### `users`
Stores all platform participants.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT UNIQUE | Login credential |
| `phone` | TEXT | Optional contact |
| `full_name` | TEXT | Display name |
| `role` | ENUM('buyer', 'seller', 'admin') | Access control |
| `is_verified` | BOOLEAN DEFAULT false | Completes KYC-style onboarding |
| `verification_docs` | JSONB | URLs to govt docs, shop photos, factory video |
| `country_code` | CHAR(2) | e.g., 'UZ', 'CN', 'KZ' |
| `created_at` | TIMESTAMP | Account creation time |
| `banned_at` | TIMESTAMP NULL | Soft-delete for risk analysis |

> ✅ **Index**: `(role, country_code)` for admin dashboards.

---

### `products`
Verified sellers' offerings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `seller_id` | UUID FK → `users.id` | Owner |
| `name` | TEXT | Product title (original language) |
| `description` | TEXT | Details (original language) |
| `price_cents` | INTEGER | Store in cents to avoid float errors |
| `currency` | CHAR(3) | e.g., 'UZS', 'CNY' |
| `category` | TEXT | For filtering |
| `origin_country` | CHAR(2) | Required for authenticity |
| `images_urls` | TEXT[] | Array of secure image URLs |
| `video_url` | TEXT NULL | Proof of product condition |
| `is_halal_compliant` | BOOLEAN DEFAULT true | Enforced during listing |
| `is_active` | BOOLEAN DEFAULT true | Can be deactivated |
| `created_at` | TIMESTAMP | Listing time |

> ✅ **Index**: `(seller_id, is_active)`, `(category, origin_country)`

---

### `orders`
Tracks purchase lifecycle.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `buyer_id` | UUID FK → `users.id` | Purchaser |
| `total_cents` | INTEGER | Sum of items + fees |
| `currency` | CHAR(3) | Order currency |
| `status` | ENUM('pending_payment', 'paid', 'shipped', 'delivered', 'cancelled') | Drives business logic |
| `escrow_released_to_seller` | BOOLEAN DEFAULT false | Funds released after logistics pickup |
| `escrow_released_to_logistics` | BOOLEAN DEFAULT false | Fee released after delivery |
| `created_at` | TIMESTAMP | Order time |
| `cancelled_at` | TIMESTAMP NULL | If buyer cancels within 10 days |

> ✅ **Index**: `(buyer_id, status)`, `(created_at)`

---

### `order_items`
Line items in an order.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `order_id` | UUID FK → `orders.id` | Parent order |
| `product_id` | UUID FK → `products.id` | Referenced product |
| `quantity` | INTEGER | Number purchased |
| `price_at_time_cents` | INTEGER | Snapshot of price at order time |

---

### `deliveries`
Manages escrow release and liability assignment.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `order_id` | UUID FK → `orders.id` | Linked order |
| `logistics_partner` | TEXT | e.g., 'Pochta UZ', 'SF Express' |
| `tracking_number` | TEXT | For user tracking |
| `seller_handover_proof_url` | TEXT | Photo/video from seller before shipping |
| `logistics_pickup_proof_url` | TEXT | Confirmation from logistics |
| `delivery_proof_url` | TEXT | From buyer or logistics upon receipt |
| `condition_notes` | TEXT | Optional notes on item state |
| `damage_liability` | ENUM('seller', 'logistics', 'none') | Used for penalty deduction |
| `created_at` | TIMESTAMP | Delivery record created |
| `delivered_at` | TIMESTAMP NULL | When marked as delivered |

> ✅ **Index**: `(order_id)`, `(delivered_at)`

---

### `payments`
Secure financial records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `order_id` | UUID FK → `orders.id` | Associated order |
| `amount_cents` | INTEGER | Paid amount |
| `currency` | CHAR(3) | Payment currency |
| `payment_method` | TEXT | 'payme', 'click', 'visa', etc. |
| `gateway_transaction_id` | TEXT | From payment processor (e.g., Payme) |
| `status` | ENUM('succeeded', 'failed', 'refunded') | Final state |
| `captured_at` | TIMESTAMP NULL | When funds were taken |
| `refunded_at` | TIMESTAMP NULL | If refunded |
| `created_at` | TIMESTAMP | Payment initiation |

> 🔒 **Never stores raw card data** — only gateway tokens.

---

### `reviews`
Post-delivery feedback with moderation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `order_id` | UUID FK → `orders.id` | Must be delivered first |
| `reviewer_id` | UUID FK → `users.id` | Author |
| `rating` | SMALLINT (1–5) | Star rating |
| `comment` | TEXT | Text review |
| `media_urls` | TEXT[] | Photos/videos (moderated) |
| `language` | CHAR(2) | Detected language (uz, ar, zh, en, ru) |
| `moderation_status` | ENUM('pending', 'approved', 'rejected') | Auto-moderated |
| `moderation_reason` | TEXT NULL | If rejected |
| `created_at` | TIMESTAMP | Submission time |

> ⚠️ Rejected reviews are stored but not displayed.

---

### `messages`
Real-time buyer-seller communication.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `sender_id` | UUID FK → `users.id` | Message author |
| `receiver_id` | UUID FK → `users.id` | Recipient |
| `original_text` | TEXT | Message content |
| `original_language` | CHAR(2) | For translation |
| `detected_bad_content` | BOOLEAN DEFAULT false | AI moderation flag |
| `moderation_status` | ENUM('blocked', 'allowed') | Never deliver if blocked |
| `created_at` | TIMESTAMP | Sent time |

> 🌐 Approved messages are auto-translated on read.

---

### `banned_users_analysis`
Supports risk prediction and prevention.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID PK → `users.id` | Banned user |
| `ban_reason` | TEXT | Why they were banned |
| `behavior_patterns` | JSONB | e.g., `{"fake_listings": 3, "scam_reports": 2}` |
| `risk_score` | FLOAT | Predicted threat level (0.0–1.0) |
| `predicted_threat_level` | TEXT | 'low', 'medium', 'high' |
| `analyst_notes` | TEXT | Human insights |
| `created_at` | TIMESTAMP | When analysis was added |

---

## Future Extensions

- `product_translations(product_id, lang, name, description)`  
- `review_translations(review_id, lang, comment)`  
- Geospatial indexing on `users.address` using **PostGIS** for location verification.

---

## Security & Compliance

- All PII encrypted at rest (via PostgreSQL TDE or app-level encryption).
- Payment data handled via PCI-compliant gateways only.
- Daily backups with point-in-time recovery.
- Audit logs for all sensitive operations (seller approval, fund release).

---