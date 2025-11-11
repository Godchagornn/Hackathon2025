import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { SharePage } from "./components/SharePage";
import { ProfilePage } from "./components/ProfilePage";
import { MessagesPage } from "./components/MessagesPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { FloatingMessagesButton } from "./components/FloatingMessagesButton";
import { Toaster } from "./components/ui/sonner";
import { ExchangeNotification } from "./components/NotificationDropdown";

type Page = "home" | "share" | "profile" | "messages";
type AuthPage = "login" | "register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [notifications, setNotifications] = useState<ExchangeNotification[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleAddNotification = (notification: ExchangeNotification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // Function to generate unique exchange code
  const generateExchangeCode = () => {
    const prefix = "XC";
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNum}`;
  };

  const handleAcceptNotification = (notificationId: string) => {
    const exchangeCode = generateExchangeCode();
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId 
          ? { ...notif, status: "accepted" as const, exchangeCode } 
          : notif
      )
    );
  };

  const handleRejectNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, status: "rejected" as const } : notif
      )
    );
  };

  const handleStartChat = (notificationId: string) => {
    // Find the notification
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      // Navigate to messages page
      setCurrentPage("messages");
    }
  };

  const handleConfirmComplete = (notificationId: string, code: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId && notif.exchangeCode === code
          ? { ...notif, status: "completed" as const }
          : notif
      )
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <LandingPage onNavigate={handleNavigate} onAddNotification={handleAddNotification} />;
      case "share":
        return <SharePage onNavigate={handleNavigate} />;
      case "messages":
        return <MessagesPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // Show auth pages if not logged in
  if (!isLoggedIn) {
    return (
      <>
        {authPage === "login" ? (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setAuthPage("register")}
          />
        ) : (
          <RegisterPage 
            onRegisterSuccess={handleRegisterSuccess}
            onBackToLogin={() => setAuthPage("login")}
          />
        )}
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        notifications={notifications}
        onAcceptNotification={handleAcceptNotification}
        onRejectNotification={handleRejectNotification}
        onStartChat={handleStartChat}
        onConfirmComplete={handleConfirmComplete}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      
      {/* Floating Messages Button - Only show when not on messages page */}
      {currentPage !== "messages" && (
        <FloatingMessagesButton
          unreadCount={unreadMessagesCount}
          onClick={() => handleNavigate("messages")}
        />
      )}
      
      <Toaster position="top-center" />
    </div>
  );
}
