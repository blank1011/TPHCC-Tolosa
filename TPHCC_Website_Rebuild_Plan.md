# TPHCC Website Rebuild Plan
## The Potter's House Christian Church — Tolosa, Leyte
**Project:** Full website rebuild using Next.js (App Router)
**Goal:** Modernized, faster, more visually compelling church website

---

## 1. TECH STACK

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Next.js 14+ (App Router)** | SSG/SSR, great SEO, easy deployment |
| Styling | **Tailwind CSS v3** | Fast, responsive, utility-first |
| Animations | **Framer Motion** | Smooth scroll reveals, hero animations |
| Icons | **Lucide React** | Clean, consistent icon set |
| Maps | **Leaflet.js + react-leaflet** | For the church locator map |
| Video source | **YouTube Data API v3** | Auto-fetch videos from your channel — no manual updates needed |
| Video embed | **react-youtube** | Embed player inline for sermon cards |
| Fonts | **Google Fonts** (see Typography) | Free, fast via next/font |
| Deployment | **Vercel** | Free tier, auto deploy from GitHub |
| CMS (optional) | **Notion API or JSON files** | Easy for pastor to update events/sermons |

---

## 2. PROJECT STRUCTURE

```
tphcc-website/
├── app/
│   ├── layout.tsx              # Root layout (nav + footer)
│   ├── page.tsx                # Home page
│   ├── events/
│   │   └── page.tsx            # Events page
│   ├── media/
│   │   └── page.tsx            # Messages/Videos page
│   ├── about/
│   │   └── page.tsx            # What We Believe page
│   ├── gallery/
│   │   └── page.tsx            # Gallery page
│   └── leyte-churches/
│       └── page.tsx            # (Skip for now — placeholder)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ServiceTimes.tsx
│   │   ├── UpcomingEvents.tsx
│   │   ├── MinistriesSlider.tsx
│   │   ├── FindUs.tsx
│   │   └── RecentMessages.tsx
│   ├── media/
│   │   └── VideoCard.tsx
│   ├── about/
│   │   └── BeliefCard.tsx
│   └── ui/
│       ├── SectionHeader.tsx
│       └── Button.tsx
├── data/
│   ├── serviceTimes.ts
│   ├── beliefs.ts
│   ├── videos.ts
│   └── ministries.ts
├── public/
│   ├── images/
│   │   ├── hero-placeholder.jpg
│   │   ├── basketball-placeholder.jpg
│   │   └── logo.png
│   └── favicon.ico
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 3. DESIGN SYSTEM

### Color Palette
```
--navy:       #1B2E6B   (primary brand, nav, footer, section bg)
--red:        #C0392B   (accents, CTA buttons, LIVE badge)
--white:      #FFFFFF   (backgrounds, card text)
--light-gray: #F4F6F9   (alternating section backgrounds)
--mid-gray:   #6B7280   (body text, secondary labels)
--gold:       #D4A017   (optional highlight — featured badge)
```

### Typography
```
Display:  "Playfair Display" (Bold) — section headings, hero title
Body:     "Inter" (Regular/Medium) — paragraph text, nav links
Accent:   "Montserrat" (SemiBold, uppercase tracking) — labels, badges
```
Import in `layout.tsx` via `next/font/google`.

### Spacing Scale (Tailwind defaults are fine)
- Section padding: `py-16 md:py-24`
- Container max: `max-w-6xl mx-auto px-4`
- Card gap: `gap-6`

---

## 4. PAGE-BY-PAGE BREAKDOWN

---

### PAGE 1: HOME (`/`)

#### Section 1 — Hero
- **Full-screen hero** with darkened background image (placeholder for now)
- Large bold headline stacked:
  ```
  Changing Lives
  Making Disciples
  Reaching the World
  ```
- Sub-paragraph: church mission statement
- Two CTA buttons: `Learn More` (red/filled) + `Watch Messages` (outlined white)
- Framer Motion: fade-in-up on load (staggered: title → text → buttons)
- **Placeholder:** `<div className="bg-gray-700 w-full h-screen">` with overlay

```tsx
// HeroSection.tsx structure
<section className="relative h-screen flex items-center">
  {/* BG placeholder */}
  <div className="absolute inset-0 bg-gray-800" />
  {/* Replace with: <Image src="/images/hero.jpg" fill objectFit="cover" /> */}
  <div className="absolute inset-0 bg-black/60" />
  
  <div className="relative z-10 max-w-6xl mx-auto px-4">
    <motion.h1>Changing Lives...</motion.h1>
    <motion.p>Church mission text...</motion.p>
    <motion.div className="flex gap-4">
      <Button variant="red">Learn More</Button>
      <Button variant="outline">Watch Messages</Button>
    </motion.div>
  </div>
</section>
```

#### Section 2 — Service Times
- Blue/navy background with world map watermark (CSS background-image or SVG)
- 5 cards in a flex row (wraps on mobile):
  - Sunday Morning (Sun icon) — School: 9:30 AM / Worship: 10:30 AM
  - Sunday Evening (Moon icon) — 5:30 PM
  - Wednesday Evening (Church icon) — 5:30 PM
  - Discipleship Friday (People icon) — 6:30 PM
  - Saturday (Hand icon) — Prayer: 6:00 AM / Outreach: 7:00 AM
- Card style: white bg, navy icon, red time text, rounded-xl, shadow

```tsx
// ServiceTimes.tsx
const services = [
  { icon: <Sun />, title: "Sunday Morning", lines: ["Sunday School: 9:30 AM", "Worship: 10:30 AM"], highlight: "Worship: 10:30 AM" },
  { icon: <Moon />, title: "Sunday Evening", lines: ["5:30 PM"], highlight: "5:30 PM" },
  // ...etc
]
```

#### Section 3 — Upcoming Events
- White bg section
- Heading: "Upcoming Events" + "View All →" link (red)
- If no events: elegant empty state with calendar icon and "No upcoming events. Check back soon!"
- **Improvement over original:** Use a card-based layout with date badges for when events exist

#### Section 4 — Ministries Slider
- Full-bleed image carousel (3–4 slides) with left/right arrows
- Each slide: placeholder image + overlay text
  - Slide 1: **Basketball Ministry** — "Building character, teamwork, and faith through sports"
  - Slide 2: (add your own — e.g., Youth Ministry, Outreach, etc.)
- **Placeholder:** gray boxes with overlay text while real images are added
- Auto-advance every 5s, manual override with arrows
- Framer Motion: `AnimatePresence` slide transitions

#### Section 5 — Find Us
- Two-column layout: left = address/contact info, right = embedded Leaflet map
- Address: Brgy. Imelda, Tolosa, Leyte
- Phone: (63) 992-431-0216
- Email: placeholder "to be added soon"
- Map: Leaflet centered on Tolosa, Leyte coordinates (11.0469° N, 125.0223° E)
- Two buttons: `Get Directions` (navy) + `View All Leyte Churches` (red, disabled/placeholder for now)

#### Section 6 — Recent Messages
- 3-column grid of video thumbnail cards, **auto-fetched live from your YouTube channel**
- Each card: YouTube thumbnail image, title, date, play button overlay
- "View All →" link to `/media`
- **Improvement:** hover effect lifts card + reveals play button
- Shows the **3 most recent uploads** automatically — no manual updates needed ever

> ⚙️ **How it works:** Next.js fetches your latest videos from the YouTube Data API at build time (or on-demand via ISR). When you upload a new sermon to YouTube, the website updates itself.

**YouTube API setup:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **YouTube Data API v3**
3. Create an API key (restrict to your domain for security)
4. Add to `.env.local`:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   YOUTUBE_CHANNEL_ID=your_channel_id_here
   ```
   > To find your Channel ID: go to your YouTube channel → click your profile icon → Settings → Advanced settings → copy the Channel ID (starts with `UC...`)

**Server-side fetch in `app/page.tsx` (ISR — revalidates every 6 hours):**
```tsx
// app/page.tsx
async function getLatestVideos() {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=3&type=video`,
    { next: { revalidate: 21600 } } // 6 hours
  )
  const data = await res.json()
  return data.items
}

export default async function HomePage() {
  const videos = await getLatestVideos()
  return (
    // ...
    <RecentMessages videos={videos} />
  )
}
```

**`components/home/RecentMessages.tsx`:**
```tsx
interface YouTubeVideo {
  id: { videoId: string }
  snippet: {
    title: string
    publishedAt: string
    thumbnails: { high: { url: string } }
  }
}

export default function RecentMessages({ videos }: { videos: YouTubeVideo[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl text-navy">Recent Messages</h2>
          <a href="/media" className="text-brand hover:underline text-sm font-label">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <a
              key={video.id.videoId}
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden shadow hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="relative">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full aspect-video object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-navy line-clamp-2">{video.snippet.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(video.snippet.publishedAt).toLocaleDateString('en-PH', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### PAGE 2: EVENTS (`/events`)

- Page header: "Upcoming Events" / "Stay updated with our church activities and services"
- If empty: centered icon + message (same as original but polished)
- **Improvement:** Add a filter bar (All / Sunday / Special Events) for when events exist
- Event card format (for future use):
  ```
  [DATE BADGE] | Title | Time | Location | Brief description
  ```

---

### PAGE 3: MEDIA / MESSAGES (`/media`)

- Page header: "Messages" / "Watch our latest sermons, worship sessions, and church events"
- Grid: 3 columns desktop / 2 tablet / 1 mobile
- **All videos are fetched live from your YouTube channel automatically** — no `data/videos.ts` needed
- Each card:
  - YouTube thumbnail (clickable → opens YouTube in new tab)
  - Title (bold)
  - Date (gray text, formatted as "June 14, 2026")
  - Play button overlay on hover
- **Improvement:** Add search/filter by title (client-side filter on fetched results)
- Loads up to **50 most recent videos** from your channel

**`app/media/page.tsx` (server component — ISR 6 hours):**
```tsx
async function getAllVideos() {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`,
    { next: { revalidate: 21600 } }
  )
  const data = await res.json()
  return data.items
}

export default async function MediaPage() {
  const videos = await getAllVideos()
  return <VideoGrid videos={videos} />
}
```

**`components/media/VideoGrid.tsx` (client component — handles search filter):**
```tsx
'use client'
import { useState } from 'react'

export default function VideoGrid({ videos }) {
  const [search, setSearch] = useState('')
  const filtered = videos.filter(v =>
    v.snippet.title.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search messages..."
        className="w-full border rounded-lg px-4 py-2 mb-8 focus:outline-none focus:ring-2 focus:ring-navy"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(video => (
          <VideoCard key={video.id.videoId} video={video} />
        ))}
      </div>
    </div>
  )
}
```

> 💡 **LIVE detection:** The YouTube API also returns `liveBroadcastContent: "live"` on items that are currently streaming. You can use this to show a red "🔴 LIVE NOW" badge on the card and link directly to the live stream — matching the LIVE button in your navbar.

---

### PAGE 4: ABOUT / WHAT WE BELIEVE (`/about`)

- Page header: "What We Believe" / "Statement of Faith for The Potter's House Christian Church"
- Red divider line below header (matches original)
- Intro paragraph: "Our faith is rooted in the timeless truths of God's Word..."
- **12 Belief Cards** (accordion or stacked cards):

```ts
// data/beliefs.ts
export const beliefs = [
  {
    icon: "church",
    title: "One God",
    body: "There is only one God, and that He is eternally existent in Three Persons: Father, Son, and Holy Spirit."
  },
  {
    icon: "star",
    title: "God the Father",
    body: "God the Father is the Creator of the universe. He created man in His own image for fellowship, and called man back to Himself through Christ after the rebellion and fall of man."
  },
  {
    icon: "cross",
    title: "Jesus Christ",
    body: "Jesus Christ is eternally God. He was together with the Father and the Holy Spirit from the beginning, and through Him all things were made. He left Heaven and became incarnate by the Holy Spirit of the Virgin Mary; henceforth, He is forever one Christ with two natures—God and man—in one Person."
  },
  {
    icon: "flame",
    title: "The Holy Spirit",
    body: "The Holy Spirit is God, the Lord, and giver of life, who was active in the Old Testament, and given to the Church in fullness at Pentecost. He empowers the saints for service and witness, cleanses man from the old nature, and conforms us to the image of Christ."
  },
  {
    icon: "wind",
    title: "Baptism in the Holy Spirit",
    body: "The baptism in the Holy Spirit with evidence of speaking in tongues, subsequent to conversion, releases the fullness of the Spirit, and is evidenced by the fruits and gifts of the Holy Spirit."
  },
  {
    icon: "book-open",
    title: "The Bible",
    body: "The Bible containing the Old and New Testament is alone the only infallible, inspired Word of God, and that its authority is ultimate, final, and eternal. It cannot be added to, subtracted from, or superseded in any regard. The Bible is the source of all doctrine, instruction, correction, and reproof."
  },
  {
    icon: "heart",
    title: "Christ's Death & Atonement",
    body: "Christ's vicarious death on the cross paid the penalty for the sins of the whole world. Its benefits of healing (body, soul, and spirit) are provided for in the atonement as well."
  },
  {
    icon: "gift",
    title: "Salvation",
    body: "Salvation is a free gift of God, based on the merits of the death of His Son, and is appropriated by faith. Salvation is affected by personal repentance, belief in the Lord Jesus (justification), and personal acceptance of Him into one's life as Lord and Savior (regeneration)."
  },
  {
    icon: "users",
    title: "The Christian Life",
    body: "The Christian life is to be one of consecration, devotion, and holiness. The shortcomings of the individual are because of the still progressing sanctification of the saints. For those abiding in Christ until their deaths or His return, the promises of eternal blessing in the presence of God are assured."
  },
  {
    icon: "building",
    title: "The Church",
    body: "The Church is the Body of Christ, the habitation of God among the saints through the Spirit. Every believer born of the Spirit has a place in the church designated by God. A place where Christ is working in the lives of the called out ones and calling ministers to the great commission to go into all the world and make disciples of every nation."
  },
  {
    icon: "droplets",
    title: "Ordinances",
    body: "We believe in the ordinances of Baptism and the Lord's Supper. Baptism is the outward sign of what God has already done in the individual's life and is a public testimony that the person now belongs to Christ. The Lord's Supper is a commemoration of the death of the Lord and is done in remembrance of Him until He comes again."
  },
  {
    icon: "sun-rise",
    title: "The Second Coming",
    body: "We believe in the bodily, personal, second coming of the Lord Jesus Christ, the resurrection of the saints, the millennium, and the final judgment. The final judgment will determine the eternal status of both the saints and the unbelievers, determined by their relationship to Jesus Christ."
  }
]
```

- **Closing scripture pull-quote:**
  ```
  "Jesus Christ is the same yesterday, today, and forever."
  — Hebrews 13:8
  ```
  Style: large italic serif, centered, navy bg or light bg with left border accent

- **Improvement:** Cards expand on click (accordion) on mobile to save space

---

### PAGE 5: GALLERY (`/gallery`)

- For now: "Gallery Coming Soon" page
- Elegant placeholder with camera icon, message, and Return to Homepage button
- Style it better than just a construction notice — e.g., a soft grid of blurred placeholder squares with a "Photos Coming Soon" overlay

---

### PAGE 6: LEYTE CHURCHES (`/leyte-churches`)

- Skip for now — redirect to homepage or show a "Coming Soon" page

---

## 5. SHARED COMPONENTS

### Navbar (`components/layout/Navbar.tsx`)
- Logo left, nav links right
- Links: HOME | EVENTS | MEDIA | ABOUT | GALLERY | LINKS ▾ | 🔴 LIVE
- LIVE badge: red pulsing dot + "LIVE" text → links to YouTube channel
- Mobile: hamburger → slide-down drawer
- Scroll behavior: transparent on hero, white/navy on scroll (use `useScrollPosition` hook)
- Active link: underline or color change

### Footer (`components/layout/Footer.tsx`)
- 4-column layout on desktop, stacked on mobile
- Col 1: Logo + tagline + location
- Col 2: Quick Links (Home, Events, Media, About, Leyte Churches)
- Col 3: Service Times (Sun 9AM, Sun Evening 5:30PM, Wed 5:30PM)
- Col 4: Connect With Us (Facebook icon + YouTube icon)
- Bottom bar: "© 2026 The Potter's House Christian Church. All rights reserved. | Tolosa, Leyte"

---

## 6. STEP-BY-STEP BUILD INSTRUCTIONS

### Step 1 — Initialize Project
```bash
npx create-next-app@latest tphcc-website --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd tphcc-website
```

### Step 2 — Install Dependencies
```bash
npm install framer-motion lucide-react react-leaflet leaflet
npm install @types/leaflet --save-dev
```
> No extra YouTube package needed — videos are fetched directly via the YouTube Data API v3 REST endpoint using Next.js's built-in `fetch` with ISR caching.

### Step 3 — Configure Tailwind
In `tailwind.config.ts`, extend with brand colors:
```ts
theme: {
  extend: {
    colors: {
      navy:  '#1B2E6B',
      brand: '#C0392B',
      gold:  '#D4A017',
    },
    fontFamily: {
      display: ['Playfair Display', 'serif'],
      body:    ['Inter', 'sans-serif'],
      label:   ['Montserrat', 'sans-serif'],
    }
  }
}
```

### Step 4 — Set Up Fonts in `app/layout.tsx`
```tsx
import { Playfair_Display, Inter, Montserrat } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })
const inter    = Inter({ subsets: ['latin'], variable: '--font-body' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-label' })
```

### Step 5 — Build Navbar + Footer first
These wrap every page — get them right before building inner pages.

### Step 6 — Build Home Page Section by Section
Order: Hero → ServiceTimes → UpcomingEvents → MinistriesSlider → FindUs → RecentMessages

### Step 7 — Build Data Files
Populate `data/beliefs.ts` and `data/serviceTimes.ts` with real content.
> ~~`data/videos.ts`~~ — **no longer needed.** Videos come live from YouTube API automatically.

### Step 8 — Build Inner Pages
Order: Media → About → Events → Gallery (placeholder)

### Step 9 — Leaflet Map Setup
Leaflet needs a CSS import and a `dynamic` import (no SSR):
```tsx
// In FindUs.tsx or map page
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./LeafletMap'), { ssr: false })
```
```tsx
// LeafletMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const TOLOSA_COORDS: [number, number] = [11.0469, 125.0223]

export default function LeafletMap() {
  return (
    <MapContainer center={TOLOSA_COORDS} zoom={16} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={TOLOSA_COORDS}>
        <Popup>The Potter's House Christian Church — Brgy. Imelda, Tolosa, Leyte</Popup>
      </Marker>
    </MapContainer>
  )
}
```

### Step 10 — Image Placeholders
Use this pattern everywhere until real images are provided:
```tsx
{/* PLACEHOLDER — replace with real photo */}
<div className="relative w-full h-[500px] bg-gray-700 flex items-center justify-center">
  <span className="text-white/40 text-sm font-label uppercase tracking-widest">
    Photo Coming Soon
  </span>
</div>
```

### Step 11 — Mobile Responsiveness
Test every section at 375px, 768px, 1024px, 1440px.
Key breakpoints to watch: 5-card service times row → 2-col → 1-col.

### Step 12 — Deploy to Vercel
```bash
# Push to GitHub first, then:
npx vercel
# Or connect GitHub repo at vercel.com
```

---

## 7. IMPROVEMENTS OVER ORIGINAL

| Feature | Original | Rebuilt Version |
|--------|----------|-----------------|
| Hero CTA | 1 button | 2 buttons (Learn More + Watch Messages) |
| Animations | None | Framer Motion scroll reveals |
| Events (empty) | Plain gray box | Illustrated empty state |
| Video source | Manual/static embed | **Live from YouTube API — auto-updates** |
| Video grid | Static 3-col | Search by title, live data |
| LIVE badge | Static link | **Detects active livestream via API** |
| About page | Stacked cards | Accordion on mobile |
| Navbar | Static | Transparent → solid on scroll |
| Gallery | "Under Construction" page | Blurred placeholder grid |
| Mobile nav | Unknown | Hamburger slide drawer |
| Fonts | Default system | Playfair Display + Inter pair |

---

## 8. WHAT TO GATHER BEFORE BUILDING

- [ ] Hero background photo (outdoor preaching, service, or church building)
- [ ] Basketball Ministry photo
- [ ] Any other ministry photos for slider (Youth, Outreach, etc.)
- [ ] Church logo (high-res PNG with transparent bg)
- [ ] YouTube Channel URL (for LIVE button link)
- [ ] YouTube video IDs for each sermon on the media page
- [ ] Facebook page URL
- [ ] Email address (when ready)
- [ ] Exact coordinates of church on Google Maps

---

## 9. OPTIONAL FUTURE ADDITIONS

- **Sermon notes PDF download** per video
- **Contact form** (using Resend or EmailJS)
- **Event registration** (simple form → Google Sheets or email)
- **Prayer request form**
- **PWA support** (add-to-homescreen for church members)
- **Leyte Churches directory** with full Leaflet map

---

*Built for The Potter's House Christian Church — Tolosa, Leyte. Changing Lives. Making Disciples. Reaching the World.*
