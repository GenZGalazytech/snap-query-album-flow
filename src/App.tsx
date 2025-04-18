
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Albums from "./pages/Albums";
import AlbumView from "./pages/AlbumView";
import Events from "./pages/Events";
import EventView from "./pages/EventView";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import SupabaseCredentialsWarning from "./components/SupabaseCredentialsWarning";

const queryClient = new QueryClient();

const hasSupabaseCredentials = 
  !!import.meta.env.VITE_SUPABASE_URL && 
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

const App = () => {
  if (!hasSupabaseCredentials) {
    return (
      <ThemeProvider defaultTheme="light">
        <SupabaseCredentialsWarning />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Upload />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Search />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/albums" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Albums />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/albums/:id" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AlbumView />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Events />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/events/:id" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EventView />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
