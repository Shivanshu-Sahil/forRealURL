# AI Coding Agent Instructions for URL Shortener Project

Welcome to the URL Shortener project! This document provides essential guidance for AI coding agents to be productive in this codebase. The project is built using **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

---

## 📂 **Project Structure Overview**

- **Frontend**: Located in the `src/` directory, built with React and styled using Tailwind CSS.
  - `src/pages/`: Contains React components for different pages (e.g., `home.jsx`, `dashboard.jsx`, `redirect.jsx`).
  - `src/db/`: Handles Supabase integration (e.g., `supabase.js`).
  - `src/lib/`: Utility functions for shared logic.
- **Backend**: Managed by Supabase, which provides database and authentication services.
- **Public Assets**: Static files are in the `public/` directory.

---

## 🛠️ **Developer Workflows**

### **Build and Run**
- **Development**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`

### **Testing**
- No dedicated test framework is set up yet. Add tests as needed.

### **Linting**
- Run ESLint: `npm run lint`

---

## 📜 **Key Conventions and Patterns**

### **React Components**
- Use functional components with hooks (e.g., `useState`, `useEffect`).
- Page components are in `src/pages/`.

### **Routing**
- React Router DOM is used for routing (`v7.9.4`).
- Example routes:
  ```javascript
  const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/:shortCode', element: <RedirectPage /> },
  ]);
  ```

### **Styling**
- Tailwind CSS is used for styling. Configuration is in `tailwind.config.js`.
- Example:
  ```jsx
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click Me
  </button>
  ```

### **Supabase Integration**
- Supabase is used for database and authentication.
- Configuration is in `src/db/supabase.js`.
- Example usage:
  ```javascript
  const { data, error } = await supabase.from('urls').select('*');
  ```

---

## 🔗 **External Dependencies**

- **React**: UI library.
- **Vite**: Build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **Supabase**: Backend-as-a-service for database and authentication.

---

## 🚨 **Important Notes**

1. **Environment Variables**:
   - Supabase credentials are stored in `.env`.
   - Example:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

2. **Git Ignore**:
   - Sensitive files like `.env` and `node_modules/` are excluded via `.gitignore`.

3. **Deployment**:
   - Use Vercel for deployment. Ensure `.env` variables are configured in the Vercel dashboard.

---

Feel free to update this document as the project evolves!