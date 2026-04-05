import { useState, useEffect } from "react";

// 🔐 AUTH PAGES
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword"; 

// 📊 DASHBOARD PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import CreateQuotation from "./pages/dashboard/CreateQuotation";
import Preview from "./pages/dashboard/Preview";
import Export from "./pages/dashboard/Export";
import EditProfile from "./pages/dashboard/EditProfile"; 

// ⚙️ SETTINGS & HELP PAGES
import Settings from "./pages/dashboard/Settings";
import HelpSupport from "./pages/dashboard/HelpSupport";

// 💎 MASTER SUBSCRIPTION PAGE
import Subscription from "./pages/dashboard/Subscription";

export default function App() {
  const [page, setPage] = useState("loading");
  const [quotationId, setQuotationId] = useState(null);
  const [user, setUser] = useState(null); 
  const [resetToken, setResetToken] = useState(null); 

  // ==========================================
  // 🔄 URL ROUTING & AUTH CHECK
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); 
    const path = window.location.pathname;

    // 1. Parse User Data Safely
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data. Clearing corrupted data.");
        localStorage.removeItem("user");
      }
    }

    // 2. PUBLIC ROUTE: Reset Password Link Check
    if (path.startsWith("/reset-password/")) {
      const tokenFromUrl = path.split("/")[2]; // Extracts token from /reset-password/TOKEN
      if (tokenFromUrl) {
        setResetToken(tokenFromUrl);
        setPage("reset-password");
        return; 
      }
    }

    // 3. PUBLIC ROUTE: External Preview Link Check
    if (path.startsWith("/preview/")) {
      const idFromUrl = path.split("/")[2]; 
      if (idFromUrl && idFromUrl.length === 24) {
        setQuotationId(idFromUrl);
        setPage("preview");
        return; 
      }
    }

    // 4. PROTECTED ROUTES: Standard Auth Check
    if (token) {
      if (path.includes("/subscription")) setPage("subscription");
      else if (path.includes("/edit-profile")) setPage("edit-profile");
      else if (path.includes("/settings")) setPage("settings");
      else if (path.includes("/help")) setPage("help");
      else if (path.includes("/create")) setPage("create");
      else if (path.includes("/preview")) setPage("preview"); 
      else if (path.includes("/export")) setPage("export");
      else setPage("dashboard");
    } else {
      // Fallback for unauthenticated users
      setPage("login"); 
    }
  }, []);

  // ==========================================
  // 🧭 NAVIGATION HANDLERS (Props passed to children)
  // ==========================================
  const navProps = {
    goToDashboard: () => {
      window.history.pushState({}, "", "/dashboard"); 
      setPage("dashboard");
    },

    // 🔥 CREATE QUOTE LOGIC (With Trial & Subscription Checks)
    goToCreate: () => {
      const now = new Date();
      const trialDate = user?.trialExpiresAt ? new Date(user.trialExpiresAt) : null;
      const isSubscribed = user?.isSubscribed;
      const isTrialUsedBefore = user?.isTrialUsed; 

      if (isSubscribed) {
        // User has an active Standard or Pro Plan
        window.history.pushState({}, "", "/create");
        setPage("create");
      } 
      else if (isTrialUsedBefore && (!trialDate || trialDate < now)) {
        // Trial has been used and is currently expired
        alert("🚨 Your 1-Month Free Trial has expired. Please upgrade to the Standard or Pro plan to continue creating quotations.");
        window.history.pushState({}, "", "/subscription");
        setPage("subscription");
      }
      else if (trialDate && trialDate < now) {
        // Trial period time has elapsed
        alert("⏳ Your Free Trial period has ended. Please choose a subscription plan to continue.");
        window.history.pushState({}, "", "/subscription");
        setPage("subscription");
      } 
      else {
        // User is still within their free trial period
        window.history.pushState({}, "", "/create");
        setPage("create");
      }
    },

    goToPreview: () => {
      window.history.pushState({}, "", "/preview");
      setPage("preview");
    },

    goToExport: () => {
      window.history.pushState({}, "", "/export");
      setPage("export");
    },

    goToSubscription: () => { 
      window.history.pushState({}, "", "/subscription");
      setPage("subscription");
    },

    goToEditProfile: () => { 
      window.history.pushState({}, "", "/edit-profile");
      setPage("edit-profile");
    },

    goToSettings: () => { 
      window.history.pushState({}, "", "/settings");
      setPage("settings");
    },

    goToHelp: () => { 
      window.history.pushState({}, "", "/help");
      setPage("help");
    }
  };

  // Prevent rendering empty screen while validating auth state
  if (page === "loading") return null; 

  return (
    <>
      {/* 🔐 AUTHENTICATION */}
      {page === "login" && (
        <Login
          goToRegister={() => setPage("register")}
          goToForgot={() => setPage("forgot")}
          goToDashboard={() => {
            const loggedInUser = localStorage.getItem("user");
            if(loggedInUser) setUser(JSON.parse(loggedInUser));
            navProps.goToDashboard();
          }}
        />
      )}

      {page === "register" && <Register goToLogin={() => setPage("login")} />}
      
      {page === "forgot" && <ForgotPassword goToLogin={() => setPage("login")} />}
      
      {page === "reset-password" && (
        <ResetPassword 
          token={resetToken} 
          goToLogin={() => {
            window.history.pushState({}, "", "/"); 
            setPage("login");
          }} 
        />
      )}

      {/* 📊 PROTECTED DASHBOARD ROUTES */}
      {page === "dashboard" && (
        <Dashboard {...navProps} user={user} setQuotationId={setQuotationId} />
      )}

      {page === "create" && (
        <CreateQuotation 
          {...navProps} 
          user={user} 
          goBack={navProps.goToDashboard} 
          setQuotationId={setQuotationId} 
          quotationId={quotationId} 
        />
      )}

      {page === "preview" && (
        <Preview 
          {...navProps} 
          user={user} 
          goBack={navProps.goToCreate} 
          quotationId={quotationId} 
        />
      )}

      {page === "export" && (
        <Export 
          {...navProps} 
          user={user} 
          goBack={navProps.goToPreview} 
          quotationId={quotationId} 
        />
      )}

      {page === "subscription" && (
        <Subscription {...navProps} user={user} />
      )}

      {page === "edit-profile" && (
        <EditProfile 
          {...navProps} 
          user={user} 
          setUser={setUser} 
          goBack={navProps.goToDashboard} 
        />
      )}

      {page === "settings" && (
        <Settings {...navProps} user={user} />
      )}

      {page === "help" && (
        <HelpSupport {...navProps} user={user} />
      )}
    </>
  );
}