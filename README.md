<div align="center">

# 🔗 URL Shortener + Linktree Platform

### Transform Long URLs into Short, Trackable Links & Create Your Personal Link Hub

![URL Shortener Demo](https://i.postimg.cc/ZYD16RZy/URL-Shortener-Fast-Secure-Link-Management-Google-Chrome-22-10-2025-2-10-35-pm.png)

<img alt="React" src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react">
<img alt="Vite" src="https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite">
<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css">
<img alt="Supabase" src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase">
<img alt="Recharts" src="https://img.shields.io/badge/Recharts-Analytics-FF6B6B?style=for-the-badge">

**A modern, full-stack URL shortening service with integrated Linktree platform, real-time analytics, dual dashboards, and beautiful Neobrutalism design.**

</div>

---

## ✨ Features 

### 🔗 URL Shortening
- **Custom Short Codes**: Create memorable branded links or auto-generate unique codes
- **Click Tracking**: Real-time tracking with timestamps, referrers, and user agent data
- **QR Code Generation**: Instant downloadable QR codes for offline campaigns
- **Link Management**: Centralized dashboard with search, filter, and bulk operations

### 🌳 Linktree Platform
- **Personal Profile Pages**: Create your own `realurl.vercel.app/username` link hub
- **Drag-and-Drop Reordering**: Organize links with intuitive drag-and-drop interface
- **Auto-Icon Detection**: Smart detection for 20+ platforms (GitHub, LinkedIn, Twitter, Instagram, YouTube, etc.)
- **Theme Customization**: Custom colors for links and background with live preview
- **Avatar Upload**: Personalized profile with image upload to Supabase storage
- **Public Sharing**: Shareable profile URL for bio links

### 📊 Dual Analytics Dashboards
- **URL Analytics**: Track clicks, devices, locations, and browsers per shortened link
- **Linktree Analytics**: Monitor profile views with 30-day trends and visitor insights
- **Recharts Visualizations**: Interactive line charts, pie charts, and progress bars
- **Geographic Insights**: Top countries and cities breakdown
- **Device Statistics**: Desktop, mobile, and tablet distribution

### 🔐 Security & Authentication
- **Supabase Auth**: Secure email/password authentication
- **Row-Level Security**: Complete user data isolation with PostgreSQL RLS policies
- **Protected Routes**: Auth guards for private dashboards
- **Session Management**: Secure token-based sessions

### 🎨 UI/UX
- **Neobrutalism Design**: Bold borders, vibrant colors, and offset shadows
- **Responsive Layout**: Flawless experience across all devices
- **Toast Notifications**: Real-time feedback for all actions
- **Loading States**: Skeleton loaders and spinners
- **Clipboard Integration**: One-click copy with visual confirmation

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite 7, JavaScript ES6+ |
| **Styling** | Tailwind CSS 4, Radix UI, Neobrutalism |
| **Charts** | Recharts (Line, Pie, Bar) |
| **Icons** | Lucide React (20+ platform icons) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Analytics** | ua-parser-js, IP Geolocation |
| **Validation** | Yup schemas |
| **QR Codes** | react-qrcode-logo |
| **Utilities** | clsx, tailwind-merge, react-hot-toast |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ – [Download](https://nodejs.org/)
- **Supabase account** – [Sign up free](https://supabase.com/)

### Installation

```bash
# Clone repository
git clone https://github.com/Shivanshu-Sahil/forRealURL.git
cd forRealURL

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Supabase credentials to .env

# Run database migrations (see linktree_schema.sql)

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `urls` | Shortened URLs with user ownership |
| `clicks` | Click tracking with device/location data |
| `linktrees` | User profile pages with theme settings |
| `linktree_links` | Individual links with ordering |
| `linktree_views` | Profile view analytics |

All tables have **Row-Level Security (RLS)** enabled for complete data isolation.

---

## 📦 Deployment

```bash
# Production build
npm run build
npm run preview

# Deploy to Vercel
# Connect GitHub repo → Add env variables → Auto-deploy on push
```

---

## 🙌 Contributing

Contributions are **greatly appreciated**! Feel free to open issues or submit PRs.

## 📬 Contact

- **GitHub**: [@Shivanshu-Sahil](https://github.com/Shivanshu-Sahil)
- **Project**: [forRealURL Repository](https://github.com/Shivanshu-Sahil/forRealURL)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/Shivanshu-Sahil/forRealURL/issues)

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with 🔗 for modern link management, Linktree profiles, and real-time analytics**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
