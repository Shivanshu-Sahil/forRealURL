<div align="center">

# 🔗 URL Shortener

### Transform Long URLs into Short, Trackable Links

![URL Shortener Demo](https://i.postimg.cc/ZYD16RZy/URL-Shortener-Fast-Secure-Link-Management-Google-Chrome-22-10-2025-2-10-35-pm.png)

<img alt="React" src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react">
<img alt="Vite" src="https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite">
<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css">
<img alt="Supabase" src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase">

**A modern, full-stack URL shortening service with real-time analytics, user authentication, and beautiful responsive design.**

[Live Demo](https://your-app.vercel.app) • [Report Bug](https://github.com/Shivanshu-Sahil/forRealURL/issues) • [Request Feature](https://github.com/Shivanshu-Sahil/forRealURL/issues)

</div>

# ✨ Features 

🔗 **Smart URL Shortening**: Transform long URLs into clean, shareable links with custom codes or auto-generation

📊 **Real-Time Analytics**: Track clicks, monitor engagement, and discover your audience with device & location insights

🔐 **Secure Authentication**: Private dashboards with Supabase Auth - your links stay yours

📱 **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices

⚡ **Lightning Fast Redirects**: Millisecond redirects powered by Vercel's global edge network

🎨 **QR Code Generation**: Instant scannable codes for print materials and offline campaigns

📈 **Click Intelligence**: Detailed history with timestamps, referrers, and user agent data

🎯 **Custom Branding**: Create memorable short codes that match your brand identity

🗂️ **Smart Dashboard**: Centralized management with sorting, filtering, and bulk operations

🛡️ **Privacy & Security**: Row-level security ensures only you can access your data

## 🛠️ Tech Stack

**Frontend**
- **Framework**: React 19 with Vite  
- **Language**: JavaScript ES6+
- **Styling**: Tailwind CSS + Radix UI
- **Routing**: React Router DOM
- **Charts**: Recharts for analytics
- **Icons**: Lucide React
- **Build Tool**: Vite

**Backend & Database**  
- **Backend**: Supabase (PostgreSQL + Auth)
- **Real-time**: Supabase subscriptions
- **Security**: Row-level security (RLS)
- **API**: Auto-generated RESTful endpoints

**Additional Tools**
- **Analytics**: ua-parser-js for device detection
- **Validation**: Yup schemas
- **QR Codes**: react-qrcode-logo
- **Utilities**: clsx + tailwind-merge
- **Deployment**: Vercel

# Getting Started

## 📋 Prerequisites

- **Node.js** (v20 or higher) – [Download here](https://nodejs.org/)
- **npm** or **yarn** – Comes with Node.js
- **Supabase account** – [Sign up free](https://supabase.com/)
- **Git** – For version control

---

## � Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Shivanshu-Sahil/forRealURL.git
cd forRealURL
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Wait for database provisioning (~2 minutes)
   - Go to **Settings** → **API** and copy your credentials

4. **Configure environment variables**

```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Set up database tables**

6. **Launch the application**

```bash
npm run dev
```

7. **Start shortening!** 
   - Open `http://localhost:5173`
   - Sign up for an account
   - Create your first short link and watch the magic happen!

## � Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel
```bash
# Connect your GitHub repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on git push
```

## 🙌 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

## 📬 Contact & Support

- **GitHub**: [@Shivanshu-Sahil](https://github.com/Shivanshu-Sahil)
- **Project**: [forRealURL Repository](https://github.com/Shivanshu-Sahil/forRealURL)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/Shivanshu-Sahil/forRealURL/issues)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with 🔗 for modern link management and real-time analytics**

*Built with passion for clean code, beautiful design, and seamless user experiences*

⭐ **Star this repo if you found it helpful!** ⭐

</div>