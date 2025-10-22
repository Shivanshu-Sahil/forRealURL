# 🚀 Vercel Deployment Guide - URL Shortener

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub/GitLab/Bitbucket account with your code pushed
- ✅ A Vercel account (free tier works great)
- ✅ Supabase project set up with database and authentication
- ✅ Environment variables ready (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

---

## 🎯 Deployment Steps

### **Method 1: Deploy via Vercel Dashboard (Recommended for First Time)**

#### **Step 1: Push Code to Git Repository**
```bash
# If not already initialized
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# Push to GitHub (replace with your repo URL)
git remote add origin https://github.com/yourusername/url-shortener.git
git branch -M main
git push -u origin main
```

#### **Step 2: Import Project to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"** or **"Import Project"**
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Choose the `url-shortener` repository
5. Click **"Import"**

#### **Step 3: Configure Project Settings**

Vercel will auto-detect Vite, but verify these settings:

**Framework Preset**: `Vite`
**Root Directory**: `./` (leave as default)
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`
**Node Version**: `20.x` (recommended)

#### **Step 4: Add Environment Variables**

Click on **"Environment Variables"** section and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1N...` | Production, Preview, Development |

**⚠️ Important Notes:**
- Use the **Anon/Public key** from Supabase (NOT the service role key)
- Enable for all environments (Production, Preview, Development)
- Variables starting with `VITE_` are exposed to the client-side

#### **Step 5: Deploy**
1. Click **"Deploy"**
2. Wait 1-3 minutes for build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

---

### **Method 2: Deploy via Vercel CLI (Advanced)**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy**
```bash
# First time deployment (interactive setup)
vercel

# Production deployment
vercel --prod
```

#### **Step 4: Add Environment Variables via CLI**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## 🔧 Post-Deployment Configuration

### **1. Configure Custom Domain (Optional)**
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain (e.g., `short.yourdomain.com`)
4. Update DNS records as instructed by Vercel

### **2. Update Supabase Redirect URLs**
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URLs to **Redirect URLs**:
   ```
   https://your-project-name.vercel.app/auth
   https://your-custom-domain.com/auth
   ```
3. Add to **Site URL**: `https://your-project-name.vercel.app`

### **3. Enable Analytics (Optional)**
1. In Vercel dashboard, go to **Analytics** tab
2. Enable **Web Analytics** for visitor insights
3. Enable **Speed Insights** for performance monitoring

---

## ✅ Best Practices Checklist

### **Security**
- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use Supabase Row Level Security (RLS) policies
- ✅ Rotate API keys if accidentally exposed
- ✅ Use environment variables for all sensitive data
- ✅ Keep dependencies updated regularly

### **Performance**
- ✅ Enable Vercel Edge Network (automatic)
- ✅ Use `vercel.json` for caching headers (✓ Already configured)
- ✅ Optimize images (use WebP format when possible)
- ✅ Lazy load components with React.lazy()
- ✅ Enable Gzip/Brotli compression (automatic on Vercel)

### **SEO & Meta Tags**
- ✅ Add proper meta tags in `index.html`
- ✅ Configure Open Graph tags for social sharing
- ✅ Add `robots.txt` for search engines
- ✅ Generate sitemap.xml

### **Monitoring**
- ✅ Set up Vercel deployment notifications (Slack/Discord/Email)
- ✅ Monitor build times and bundle size
- ✅ Track 4xx/5xx errors in Vercel Logs
- ✅ Enable real-time logging for debugging

### **Git Workflow**
- ✅ Main branch = Production
- ✅ Create feature branches for development
- ✅ Use Preview Deployments for PRs (automatic)
- ✅ Test thoroughly in preview before merging

---

## 🔍 Troubleshooting Common Issues

### **Issue 1: 404 on Page Refresh**
**Solution**: The `vercel.json` rewrites configuration handles this. If still failing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### **Issue 2: Environment Variables Not Working**
**Solutions**:
- Ensure variables start with `VITE_` prefix
- Redeploy after adding variables (click "Redeploy" button)
- Check variables are set for correct environment
- Clear build cache: Settings → Redeploy with cache cleared

### **Issue 3: Build Fails**
**Common causes**:
- Missing dependencies: Run `npm install` locally first
- Node version mismatch: Specify version in `package.json`:
  ```json
  "engines": {
    "node": ">=20.0.0"
  }
  ```
- ESLint errors: Fix or temporarily disable in `vercel.json`

### **Issue 4: Supabase Connection Failed**
**Solutions**:
- Verify environment variables in Vercel dashboard
- Check Supabase project is active
- Confirm API keys are correct
- Check network/CORS settings in Supabase

---

## 📊 Monitoring Your Deployment

### **Vercel Dashboard Sections:**
1. **Deployments**: View all deployments and their status
2. **Domains**: Manage custom domains and SSL
3. **Analytics**: Traffic and performance metrics
4. **Logs**: Real-time application logs
5. **Settings**: Environment variables, build settings

### **Key Metrics to Watch:**
- Build time (should be < 2 minutes)
- Bundle size (aim for < 500KB initial load)
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- Error rates

---

## 🔄 Continuous Deployment (CI/CD)

Vercel automatically sets up CI/CD when connected to Git:

**Automatic Deployments:**
- ✅ Push to `main` → Production deployment
- ✅ Push to any branch → Preview deployment
- ✅ Pull Request → Preview deployment with unique URL

**Manual Control:**
```bash
# Deploy specific branch
vercel --prod --branch=staging

# Rollback to previous deployment
vercel rollback [deployment-url]
```

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Application loads at Vercel URL
- ✅ All routes work (/, /auth, /dashboard, etc.)
- ✅ Supabase connection works (can create/view URLs)
- ✅ Authentication flow works correctly
- ✅ URL shortening and redirection work
- ✅ Analytics/stats display correctly

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Supabase Docs**: https://supabase.com/docs
- **React Router**: https://reactrouter.com/

---

## 🚀 Quick Deploy Command

For immediate deployment (after Git setup):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

---

**Happy Deploying! 🎊**

Remember: Preview deployments are free and unlimited. Test everything there before production!
