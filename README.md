<div align="center">

<h1>✨ Zylst</h1>

<p><strong>Stop Guessing. Gift at the Zenith.</strong></p>

<p>
  The wishlist platform where your deepest desires meet their perfect match—without spoiling the surprise.
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss" alt="Tailwind" />
</p>

</div>

---

## 📖 About

**Zylst** is a premium social wishlist platform built for celebrations. Create a wishlist for any event—birthday, wedding, graduation—share it with friends and family, and let them claim gifts mysteriously without spoiling the surprise. After the event date passes, the curtain lifts and everyone gets to see who gifted what.

> Think of it as a beautifully designed, socially-aware alternative to traditional gift registries.

---

## 👀 Vision

To eliminate gift-giving disappointment through a social wishlist platform that balances **clarity for the giver** with **mystery for the receiver**.

---

## 📖 The Story of Zylst

In astronomy, the **Zenith** is the highest point directly above an observer. Zylst represents the pinnacle of personal desire — the exact point on the map that leads to someone's greatest happiness.

Most gift-giving is a shot in the dark. Zylst provides the coordinates. By using Zylst, friends aren't just buying products; they are fulfilling the exact vision of their loved ones with **surgical precision and a touch of mystery**. The recipient gets exactly what they wanted. The giver feels like a hero. And the surprise is preserved.

---

## 🌟 Key Features

### 🎁 Wishlist Management
- Create and name wishlists tied to a specific **event date**
- Add items with rich metadata: description, product link, estimated price, category, priority (low/medium/high), and tags
- Inline editing of wishlist name, event date, and all item fields — no modals needed for the owner
- **Completion progress bar** shows how many items have been claimed

### 🔐 Role-Based Access Control
Zylst uses a three-tier permission model:

| Role | Permissions |
|---|---|
| **Owner** | Full control: edit wishlist, add/delete/edit items, manage collaborators, force-unclaim items |
| **CoHost** | Can add/edit/delete items and manage collaborator roles |
| **Viewer** | Can view all items and claim/unclaim their own gifts |
| **Guest** | View-only; prompted to log in to interact |

### 🕵️ Mystery Claim System
- Any logged-in user (Viewer, CoHost, or Owner) can **claim** an item by toggling it
- Before the event date, claimed items show only **"Claimed"** — the claimer's identity is hidden
- After the event date, the chip reveals the claimer's username
- **Triple-click easter egg**: The owner/claimer can "peek" at who claimed an item via a 3-click gesture on the chip

### 👥 Collaboration & Sharing
- Share a direct URL with anyone — no account required to view
- **QR Code generation** for each wishlist, downloadable as a PNG
- **Copy Link** button for quick sharing
- Logged-in users can **join a wishlist** as a Viewer to track it on their dashboard
- Owners can promote Viewers to CoHosts or remove members entirely

### 🔑 Authentication
- Cookie-based session management (`httpOnly`, `secure` in production)
- Sessions last **7 days**
- Password hashing with **bcrypt** (10 salt rounds)
- Input validation with **Zod** on both client and server
- **Inline Login Drawer** on wishlist pages — guests can log in without leaving the page

### 🚀 Landing Page & Waitlist
- Stunning dark-mode landing page with animated **Celestial Background**
- **Rolling counter** displaying live waitlist signups
- Email waitlist capture with a join form
- "How It Works" and "Features" sections with scroll-triggered animations

### 🎡 Coming Soon
- **The Lucky Wheel** — Friends can spin a fate wheel to randomly decide which gift to grant
- **Proof of Joy** — Scan a Gift QR to reveal the giver and trigger a confetti celebration
- **Blessings Board** — A digital signature wall where givers leave messages that unlock on the event date
- **Secret Santa Mode** — Anonymous group exchanges with an internal chat for Santa to ask recipient questions
- **Zylst Scraper** — Browser extension to save any product from any URL directly to your list

> See the full [Strategic Roadmap](#️-strategic-roadmap) below for all planned phases.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React Compiler enabled) |
| **UI Library** | React 19 |
| **Component Library** | [HeroUI v2](https://heroui.com/) |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **ORM** | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Database** | PostgreSQL (via `pg`) |
| **Auth** | Custom cookie-based sessions + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **QR Codes** | [qrcode.react](https://github.com/zpao/qrcode.react) |
| **Language** | TypeScript 5 |

---

## 🗄️ Database Schema

```
User ─────────────────────────────────────────────────
  id, email (unique), password (hashed), username (unique)
  interests[], source
  → owns Wishlists
  → member of Collaborator (via Collaborator.userId)
  → has ClaimedItems (Items they have claimed)

Wishlist ─────────────────────────────────────────────
  id (cuid), name, eventDate
  → belongs to User (owner, optional)
  → has Items[]
  → has Collaborators[]

Item ──────────────────────────────────────────────────
  id (cuid), text, completed, position, link, description
  price, currency, imageUrl, category, priority, tags[]
  → belongs to Wishlist
  → claimedBy User (optional, "ClaimedItems" relation)

Collaborator ─────────────────────────────────────────
  id (cuid), role (VIEWER | COHOST)
  → links User ↔ Wishlist (unique pair)

Waitlist ─────────────────────────────────────────────
  id, email (unique), createdAt
```

---

## 📂 Project Structure

```
Zylst/
├── prisma/
│   ├── schema.prisma       # Database models
│   ├── seed.ts             # Database seeder
│   └── migrations/         # Prisma migration history
│
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   ├── actions/
│   │   │   ├── auth.ts     # signup, login, logout, getSession
│   │   │   ├── wishlist.tsx # CRUD for wishlists & items
│   │   │   └── waitlist.ts # Waitlist join & count
│   │   ├── signup/         # Signup page
│   │   └── wishlists/
│   │       ├── page.tsx        # Wishlists dashboard
│   │       ├── layout.tsx      # Dashboard layout (sidebar)
│   │       └── [id]/
│   │           ├── page.tsx        # Server component (fetches data)
│   │           └── WishlistClient.tsx # Rich client-side wishlist UI
│   │
│   ├── components/
│   │   ├── CelestialBackGround.tsx  # Animated star/particle background
│   │   ├── JoinWaitingList.tsx      # Waitlist email form + rolling counter
│   │   └── ui/
│   │       ├── Navbar.tsx            # Landing page navbar
│   │       ├── Footer.tsx            # Site footer
│   │       ├── LoginDrawer.tsx       # Inline login/signup slide-over
│   │       ├── WishlistNavbar.tsx    # Wishlist dashboard navbar
│   │       └── WishlistSidebar.tsx   # Sidebar with wishlist list & creation
│   │
│   ├── lib/
│   │   └── prisma.ts        # Prisma client singleton
│   │
│   └── types/
│       └── wishlist.ts      # TypeScript types for Wishlist, Item, etc.
│
├── generated/prisma/        # Generated Prisma client output
├── next.config.ts           # Next.js config (React Compiler enabled)
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** database (local or hosted)
- **npm** or equivalent package manager

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zylst.git
cd zylst
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

> Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL connection details.

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

This will apply all migrations and generate the Prisma client into `generated/prisma/`.

### 5. (Optional) Seed the Database

```bash
npx tsx prisma/seed.ts
```

### 6. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Apply and generate new migrations |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx tsx prisma/seed.ts` | Seed the database with initial data |

---

## 🔒 Authentication Flow

Zylst uses a **lightweight custom session system** — no third-party auth library needed:

1. User signs up or logs in via a **Server Action** (`auth.ts`)
2. Credentials are validated with **Zod**, password compared with **bcrypt**
3. On success, an `httpOnly` cookie named `session` is set (stores user email)
4. Server components read this cookie via `getSession()` to determine the current user
5. Sessions expire after **7 days**
6. Logout deletes the cookie immediately

---

## 🎨 Design Philosophy

Zylst is built around a **dark, premium aesthetic**:

- **Color palette**: Deep navy/black background (`#020617`), blue accent (`#3B82F6`), zinc tones for UI elements
- **Glassmorphism**: `backdrop-blur`, semi-transparent cards, subtle white borders
- **Animations**: Framer Motion powers entrance animations, staggered reveals, and micro-interactions
- **Typography**: System font stack with Tailwind's `font-sans`, tight tracking for headings
- **Celestial Background**: Animated particle/star canvas for the landing page atmosphere

---

## 🗺️ Strategic Roadmap

### Phase 1 — The Ascent *(Core Utility)*
> Establish the foundational "Zenith" utility and mystery claim logic.

- [ ] **Zylst Scraper** — Universal browser extension: "Save to Zylst" from any URL
- [ ] **Mystery Claim Mechanic** — Recipients see "Item Secured"; giver identity hidden until the physical gift is opened
- [ ] **Zenith Timer** — Countdown to your next milestone (Birthday, Wedding, Anniversary) with reminders to build your list
- [ ] **Notification Engine v1** — Real-time alerts for "New Wish Added" and "A Wish has been Reached"
- [ ] **Zylst QR Codes** — Invite QR (links friends to the event list) + Gift-Tag QR (printed sticker for physical boxes)

### Phase 2 — The Social Horizon *(Virality & Sentiment)*
> Drive virality and sentiment-driven engagement.

- [ ] **Blessings Board** — A digital "Signature Wall" for every event. Friends leave text, sticker, or video blessings that unlock only after the event date — like a birthday card meets a wedding guestbook
- [ ] **Proof of Joy** — A dedicated gift handover photo/video feature. Scanning the Gift-Tag QR triggers the "Thank You" flow, finally revealing the secret giver and preserving the memory
- [ ] **Social Blocklist** — Never be reminded about gifting for someone you've blocked (with AI-assisted recognition)

### Phase 3 — The Gamified Peak *(Retention & Fun)*
> Retention, fun, and the start of monetization.

- [ ] **The Lucky Wheel** — For the "I don't know what to get" friend. Spin to let fate select a gift from the recipient's list *(weighted toward affiliate partners for revenue)*
- [ ] **Secret Santa Mode** — Group exchange portal with anonymous "Internal Chat" so Santa can ask the recipient questions without revealing identity

### Phase 4 — The Data View *(B2B Scaling)*
> B2B scaling and trend forecasting powered by intent data.

- [ ] **Trend & Spending Dashboard** — Internal PM view: Desire Velocity (most-added items) and Price Elasticity (discount threshold for Wish → Claim conversion)
- [ ] **Demographic Insights** — Aggregated age/region spending habits to attract retail partnerships
- [ ] **Brand Partner API** — Let brands promote items to users whose wishlists suggest a matching taste profile

---

## 💰 Revenue Strategy

Zylst captures **intent data** at the exact moment a user saves a wish — more valuable than traditional past-purchase data.

### 1. Affiliate & Referral Engine *(Primary B2C)*
Every gift link is a revenue opportunity. Integrate with affiliate networks (Amazon, Shopify, Rakuten) to earn **3–15% commission** on purchases made through Zylst links. Priority given to high-margin categories: Beauty (10–18%), Home/Lifestyle (8–12%).

### 2. B2B Intent Analytics
Sell aggregated, anonymised trend reports to retailers and brands:
- **Desire Index** — Which SKUs are being wished for before they spike on a brand's own site
- **Friction Reports** — Why wishes aren't becoming claims (price? shipping? no promo?)
- **Wishlist Velocity Alerts** — Early warning when a niche item sees a 300%+ spike in 48 hours

### 3. Service & Mystery Fees
- **Concierge Fee** — For non-partner stores, Zylst handles the purchase to maintain 100% mystery: flat **$1.99** or **3–5%**
- **Gift Card Commission** — When users buy gift cards through Zylst: ~5% commission + breakage revenue

### 4. Premium "Celestial" Tier *(Freemium)*
| Feature | Free | Premium |
|---|---|---|
| Blessings Board | Text & stickers | Video blessings, 4K uploads, legacy boards |
| Wishlist themes | Default | Custom skins (Minimalist Zenith, seasonal, etc.) |
| Secret Santa | Small groups | Large groups (20+) with automation & chat ($4.99/room) |

### 💡 The Lucky Wheel Strategy
The wheel isn't purely random — **affiliate partner items carry weighted probability** (a "Golden Wedge"). When the wheel lands on a specific item, Zylst can trigger a real-time **Flash Promo** ("Buy in the next 10 mins for an extra 5% off") to drive immediate conversion.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, make your changes in a feature branch, and open a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for full details.

---

<div align="center">
  <p>Built with ❤️ to make gifting extraordinary.</p>
  <p><strong>Zylst — Gift at the Zenith.</strong></p>
</div>