import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import ArenaPage from "./pages/ArenaPage";
import MirrorSpeak from "./pages/MirrorSpeak";
import Dashboard from "./Dashboard";
import UnderConstruction from "./pages/UnderConstruction";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Redirect to home if not signed in
  if (!isSignedIn) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Header Component with Navigation
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-16 overflow-visible">
            <img src="/v logo.png" alt="Voxia Logo" className="h-30 w-auto" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/home" 
              className={({ isActive }) => 
                isActive 
                  ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                  : "text-gray-600 hover:text-indigo-600 transition-colors"
              }
            >
              Home
            </NavLink>
            <SignedIn>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                    : "text-gray-600 hover:text-indigo-600 transition-colors"
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/arena" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1" 
                    : "text-gray-600 hover:text-indigo-600 transition-colors"
                }
              >
                Arena
              </NavLink>
            </SignedIn>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors" />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4 pb-2">
            <div className="flex flex-col space-y-4">
              <NavLink 
                to="/home" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-indigo-600 font-medium border-l-4 border-indigo-600 pl-2" 
                    : "text-gray-600 hover:text-indigo-600 transition-colors pl-2"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <SignedIn>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-indigo-600 font-medium border-l-4 border-indigo-600 pl-2" 
                      : "text-gray-600 hover:text-indigo-600 transition-colors pl-2"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/arena" 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-indigo-600 font-medium border-l-4 border-indigo-600 pl-2" 
                      : "text-gray-600 hover:text-indigo-600 transition-colors pl-2"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Arena
                </NavLink>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/404" element={<UnderConstruction />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/arena" 
              element={
                <ProtectedRoute>
                  <ArenaPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mirror" 
              element={
                <ProtectedRoute>
                  <MirrorSpeak />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
