import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { SharePage } from "./components/SharePage";
import { ProfilePage, type ProfileInfo, type ProfilePost } from "./components/ProfilePage";
import { MessagesPage } from "./components/MessagesPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { FloatingMessagesButton } from "./components/FloatingMessagesButton";
import { Toaster } from "./components/ui/sonner";
import { ExchangeNotification } from "./components/NotificationDropdown";
import { toast } from "sonner";
import { API_BASE_URL, ACTIVE_PROFILE_ID } from "./config";

type Page = "home" | "share" | "profile" | "messages";
type AuthPage = "login" | "register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [notifications, setNotifications] = useState<ExchangeNotification[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | undefined>();
  const [profilePosts, setProfilePosts] = useState<ProfilePost[]>([]);

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

  const handleStartChat = (_notificationId: string) => {
    // Find the notification
    setCurrentPage("messages");
  };

  const mapProfileResponse = useCallback((payload: any): ProfileInfo => {
    const profile = payload?.profile ?? {};
    const stats = profile?.stats ?? {};
    return {
      name: profile.name ?? profile.email ?? "CMU Student",
      faculty: profile.faculty ?? "Unknown faculty",
      email: profile.email ?? "unknown@cmu.ac.th",
      location: profile.bio ?? "Chiang Mai University",
      role: stats.itemsShared > 10 ? "Green Ambassador" : "Student",
      avatar: profile.avatar ?? undefined,
      stats: {
        itemsShared: stats.itemsShared ?? "--",
        co2Reduced: `${(stats.completedExchanges ?? 0) * 2} kg`,
      },
    };
  }, []);

  const mapPostsResponse = useCallback((payload: any): ProfilePost[] => {
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const exchanges = Array.isArray(payload?.exchanges) ? payload.exchanges : [];

    const itemPosts: ProfilePost[] = items.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category ?? "General",
      type: item.condition ?? "N/A",
      status: item.status ?? "available",
      image: item.images?.[0],
      views: item.views ?? 0,
      exchangeHistory: null,
    }));

    const exchangePosts: ProfilePost[] = exchanges.map((exchange: any) => ({
      id: `exchange-${exchange.id}`,
      title: exchange.itemTitle ?? "Exchange request",
      category: "Exchange",
      type: exchange.role,
      status: exchange.status,
      exchangeHistory: {
        completedDate: exchange.updatedAt ?? exchange.createdAt ?? "",
        exchangedWith: exchange.role === "owner" ? "Requester" : "Owner",
        receivedItem: {
          title: exchange.offeredItemTitle ?? "Requested item",
        },
        co2Saved: `${exchange.status === "completed" ? 2 : 1} kg`,
      },
      image: undefined,
    }));

    return [...itemPosts, ...exchangePosts];
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${ACTIVE_PROFILE_ID}`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message ?? "Failed to fetch profile");
      }

      setProfileInfo(mapProfileResponse(body));
      setProfilePosts(mapPostsResponse(body));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("โหลดข้อมูลโปรไฟล์ไม่สำเร็จ", { description: message });
    }
  }, [mapPostsResponse, mapProfileResponse, API_BASE_URL, ACTIVE_PROFILE_ID]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${ACTIVE_PROFILE_ID}/notifications`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message ?? "Failed to load notifications");
      }

      setNotifications(body.notifications ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("โหลดการแจ้งเตือนไม่สำเร็จ", { description: message });
    }
  }, [API_BASE_URL, ACTIVE_PROFILE_ID]);

  const performNotificationAction = useCallback(
    async (notificationId: string, action: "accept" | "reject" | "complete", payload?: Record<string, unknown>) => {
      const response = await fetch(
        `${API_BASE_URL}/profiles/${ACTIVE_PROFILE_ID}/notifications/${notificationId}/${action === "complete" ? "complete" : action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: action === "complete" ? JSON.stringify(payload ?? {}) : undefined,
        }
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.message ?? "ไม่สามารถอัปเดตการแจ้งเตือนได้");
      }

      if (!body.notification) {
        throw new Error("ไม่มีข้อมูลการแจ้งเตือนที่อัปเดต");
      }

      setNotifications(prev =>
        prev.map((notif) => (notif.id === body.notification.id ? body.notification : notif))
      );

      return body.notification as ExchangeNotification;
    },
    [API_BASE_URL, ACTIVE_PROFILE_ID]
  );

  const handleAcceptNotification = useCallback(
    async (notificationId: string) => {
      await performNotificationAction(notificationId, "accept");
      await loadNotifications();
    },
    [performNotificationAction, loadNotifications]
  );

  const handleRejectNotification = useCallback(
    async (notificationId: string) => {
      await performNotificationAction(notificationId, "reject");
      await loadNotifications();
    },
    [performNotificationAction, loadNotifications]
  );

  const handleConfirmComplete = useCallback(
    async (notificationId: string, code: string) => {
      await performNotificationAction(notificationId, "complete", { code });
      await loadNotifications();
    },
    [performNotificationAction, loadNotifications]
  );

  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
      loadNotifications();
    }
  }, [isLoggedIn, loadNotifications, loadProfile]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <LandingPage
            onNavigate={handleNavigate}
            activeProfileId={ACTIVE_PROFILE_ID}
            apiBaseUrl={API_BASE_URL}
          />
        );
      case "share":
        return <SharePage onNavigate={handleNavigate} />;
      case "messages":
        return <MessagesPage />;
      case "profile":
        return <ProfilePage profile={profileInfo} posts={profilePosts} />;
      default:
        return (
          <LandingPage
            onNavigate={handleNavigate}
            activeProfileId={ACTIVE_PROFILE_ID}
            apiBaseUrl={API_BASE_URL}
          />
        );
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
