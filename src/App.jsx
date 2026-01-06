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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/link/:id" element={<RequireAuth><Link /></RequireAuth>} />
      <Route path=":id" element={<Redirect />} />
    </Route>
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
