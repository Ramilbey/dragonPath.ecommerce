# Software Requirements Specification (SRS)  
**Project Name**: DragonPath
**Vision**: Revive the spirit of the historic Silk Road by enabling trusted, ethical, and seamless commerce across Asia—where sellers and buyers from all former Silk Road nations exchange goods, culture, and value with full transparency and mutual respect.

---

## 1. Project Vision & Objectives

- Enable **B2B and B2C trade** between manufacturers, artisans, and consumers across Central Asia, China, and broader Asia.
- Establish a **trust-first marketplace** where authenticity, reliability, and ethical conduct are enforced by design.
- Promote **economic empowerment** of local producers while ensuring **halal-compliant, ethical commerce** (without explicit religious branding).
- Support **multilingual, real-time communication** and **secure, escrow-based payments** tied to delivery milestones.
- Prioritize **speed, security, and user clarity**—especially on low-bandwidth networks common in target regions.

---

## 2. Functional Requirements

### 2.1 User Roles & Authentication
- **FR-01**: System shall support four user roles: Guest, Buyer, Seller, Admin.
- **FR-02**: Sellers must complete **verified onboarding** including:
  - Government-issued business registration documents.cat 
  - Physical address of shop/factory (with geolocation).
  - Photo/video proof of product authenticity.
  - Identity verification (KYC-style).
- **FR-03**: Buyers may browse as guests but must register to purchase or review.

### 2.2 Product Management
- **FR-04**: Verified sellers may add, edit, or deactivate products.
- **FR-05**: Each product listing must include:
  - High-quality images/videos.
  - Clear description in seller’s native language (auto-translated to others).
  - Origin country, material, and compliance info.

### 2.3 Reviews & Feedback
- **FR-06**: Buyers may submit reviews with text, photos, or video after delivery confirmation.
- **FR-07**: All user-generated content (text/video) shall be scanned for:
  - Profanity, hate speech, or 18+ content → **blocked if detected**.
  - Automatic warning and prompt to re-record/upload.
- **FR-08**: Reviews shall be **automatically translated** into the viewer’s selected language.

### 2.4 Secure Messaging
- **FR-09**: Buyers and sellers may message each other in real time.
- **FR-10**: All messages shall be **auto-translated** between users’ languages.
- **FR-11**: Messages containing prohibited content (bad words, stickers, GIFs, 18+) shall be **blocked at send time**.

### 2.5 Order & Escrow Payment Flow
- **FR-12**: Buyers must pay **before order fulfillment** via local or international payment gateways.
- **FR-13**: Supported payment methods include:
  - Local: Payme, Click, UzCard, Kaspi, Alipay, etc.
  - International: Visa, Mastercard (via PCI-compliant processor).
- **FR-14**: Funds are held in **escrow** until delivery milestones are met:
  - **Seller receives payment** only after providing proof of handover to logistics (e.g., photo + tracking ID).
  - **Logistics partner receives fee** only after buyer confirms **successful, undamaged delivery**.
- **FR-15**: Product condition must be documented:
  - Seller uploads photo/video of item **before shipping**.
  - Logistics confirms condition at pickup.
  - Enables **liability assignment** if damage occurs.
- **FR-16**: Buyers may **cancel orders and receive full refund** within **10 days** of payment, **only if** logistics has not yet picked up the item.

### 2.6 Admin & Trust Enforcement
- **FR-17**: Admins may **ban users** (not delete) for fraud, scams, or policy violations.
- **FR-18**: Banned users are added to a **risk registry** for:
  - Behavioral analysis.
  - Pattern detection.
  - Future risk prediction and prevention.
- **FR-19**: No user data is ever sold to third parties.

---

## 3. Non-Functional Requirements

### 3.1 Performance
- **NFR-01**: Core pages (home, product list, checkout) must load in **≤ 2 seconds** on 3G/4G networks.
- **NFR-02**: System shall handle **5,000 concurrent users** at launch.

### 3.2 Security & Privacy
- **NFR-03**: All payment data must be processed via **PCI-DSS compliant** gateways; **never stored** on platform servers.
- **NFR-04**: User data (including messages, docs, media) must be **encrypted at rest and in transit**.
- **NFR-05**: Platform must comply with **Uzbekistan data residency laws**—all user data stored in Uzbekistan.

### 3.3 Localization & Accessibility
- **NFR-06**: Full UI and content support for:
  - Uzbek (Latin), Russian, English, Chinese (Mandarin), Arabic.
  - Auto-detection + manual language switch.
- **NFR-07**: Real-time translation for messages and reviews across all supported languages.

### 3.4 Ethical & Compliance
- **NFR-08**: Platform enforces **halal-compliant commerce principles** by:
  - Prohibiting alcohol, pork, gambling, adult content, interest-based financing (riba).
  - Requiring transparent sourcing and honest representation.
  - (Note: Not marketed as “religious”—but ethically aligned.)
- **NFR-09**: All sellers must provide **tax-compliant business registration** from their country.

### 3.5 Reliability & User Experience
- **NFR-10**: On error, system shows **clear, actionable messages** (e.g., “No internet,” “Account under review,” “Payment failed – check card details”).
- **NFR-11**: No cash-on-delivery; all transactions are **prepaid and escrow-managed** to ensure commitment and reduce fraud.

### 3.6 Future-Readiness
- **NFR-12**: Architecture must support future features:
  - AI-powered product discovery.
  - Advanced logistics tracking.
  - Mobile app (iOS/Android).

---

## 4. Constraints & Assumptions

- Initial focus: **Web-first**, responsive design (mobile-friendly).
- Hosting location: To be determined (but data must reside in Uzbekistan per law).
- Payment integrations will be added incrementally per country.
- “Halal by design” is implemented through **policy enforcement**, not religious labeling.

---

## 5. Out of Scope (For Now)

- Native mobile apps (Phase 2).
- Cryptocurrency payments.
- Social media login (e.g., Telegram, WeChat) — may be added later.