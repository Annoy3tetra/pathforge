import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoadmapDetailPage from "./pages/RoadmapDetailPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>

      <Toaster position="top-right" />

      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

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

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;