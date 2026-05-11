import { lazy, memo, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Skeleton } from "./components/ui/Skeleton";

// Lazy Load Pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const RoadmapDetailPage = lazy(() => import("./pages/RoadmapDetailPage"));
const MyRoadmapsPage = lazy(() => import("./pages/MyRoadmapsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ForgeProfilePage = lazy(() => import("./pages/ForgeProfilePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (increased for better performance)
      gcTime: 1000 * 60 * 15,    // 15 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Performance choice
    },
  },
});

// Full Page Loader for Suspense
const PageLoader = memo(function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col gap-6">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
});

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmaps/:roadmapId"
            element={
              <ProtectedRoute>
                <RoadmapDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-roadmaps"
            element={
              <ProtectedRoute>
                <MyRoadmapsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/forge-profile"
            element={
              <ProtectedRoute>
                <ForgeProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
            duration: 3000,
          }}
        />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
