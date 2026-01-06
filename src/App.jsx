import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { UrlProvider } from '@/context';
import AppLayout from './layouts/layout';
import Home from './pages/home';
import Auth from '@/pages/auth';
import Dashboard from '@/pages/dashboard';
import Link from '@/pages/link';
import Redirect from '@/pages/redirect';
import RequireAuth from '@/components/require-auth';
import { Toaster } from 'react-hot-toast';

// Linktree pages
import Linktree from '@/pages/linktree.jsx';
import LinktreeView from '@/pages/linktree-view.jsx';
import LinktreeAnalytics from '@/pages/linktree-analytics.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes WITH header/footer */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/link/:id" element={<RequireAuth><Link /></RequireAuth>} />
        <Route path="/linktree/analytics" element={<RequireAuth><LinktreeAnalytics /></RequireAuth>} />
        {/* Short URL redirect - must be last in this group */}
        <Route path=":id" element={<Redirect />} />
      </Route>

      {/* Routes WITHOUT header/footer (fullscreen) */}
      <Route path="/linktree" element={<RequireAuth><Linktree /></RequireAuth>} />
      <Route path="/lt/:id" element={<LinktreeView />} />
    </>
  )
);

function App() {
  return (
    <UrlProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
