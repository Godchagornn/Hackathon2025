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
import type { AuthSessionPayload } from "./types/auth";
import type { ItemCardProps } from "./components/ItemCard";

type Page = "home" | "share" | "profile" | "messages";
type AuthPage = "login" | "register";

type ItemCardData = ItemCardProps & {
  id: number;
  ownerId: number;
  description?: string | null;
  images?: string[];
};

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=ShareCycle";

const mapApiItemToCard = (item: any): ItemCardData => ({
  id: item.id,
  ownerId: item.ownerId ?? item.user_id ?? 0,
  title: item.title,
  category: item.category ?? "General",
  condition: item.condition ?? "good",
  status: item.status ?? "available",
  image: item.images?.[0] ?? PLACEHOLDER_IMAGE,
  location: item.owner?.faculty ?? "Chiang Mai University",
  user: item.owner?.name ?? "CMU Student",
  ecoScore: undefined,
  expiryDate: undefined,
  description: item.description,
  images: item.images ?? [],
});

export default function App() {
  const [authSession, setAuthSession] = useState<AuthSessionPayload | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [notifications, setNotifications] = useState<ExchangeNotification[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | undefined>();
  const [profilePosts, setProfilePosts] = useState<ProfilePost[]>([]);
  const [items, setItems] = useState<ItemCardData[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cmu_session");
      if (stored) {
        setAuthSession(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("ไม่สามารถอ่าน session จาก localStorage", error);
    }
  }, [API_BASE_URL]);

  const isLoggedIn = Boolean(authSession);
  const resolvedProfileId = authSession?.user.id ?? ACTIVE_PROFILE_ID;

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSuccess = (session: AuthSessionPayload) => {
    setAuthSession(session);
    localStorage.setItem("cmu_session", JSON.stringify(session));
  };

  const handleStartChat = (_notificationId: string) => {
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

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message ?? "โหลดรายการไม่สำเร็จ");
      }
      const mapped = (body.items ?? []).map(mapApiItemToCard);
      setItems(mapped);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("โหลดสินค้าไม่สำเร็จ", { description: message });
    }
  }, [API_BASE_URL]);

  const loadConversationSummary = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body?.message ?? "ไม่สามารถโหลดสถานะแชท");
        }
        const totalUnread = (body.conversations ?? []).reduce(
          (sum: number, conv: any) => sum + (conv.unreadCount ?? 0),
          0
        );
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        toast.error("โหลดสถานะแชทไม่สำเร็จ", { description: message });
      }
    },
    [API_BASE_URL]
  );

  const handleConversationSnapshot = useCallback((list: Array<{ unreadCount?: number }>) => {
    const total = list.reduce((sum, conv) => sum + (conv.unreadCount ?? 0), 0);
    setUnreadMessagesCount(total);
  }, []);

  const loadProfile = useCallback(
    async (profileId: number, token: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    },
    [API_BASE_URL, mapPostsResponse, mapProfileResponse]
  );

  const loadNotifications = useCallback(
    async (profileId: number, token: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body?.message ?? "Failed to load notifications");
        }

        setNotifications(body.notifications ?? []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        toast.error("โหลดการแจ้งเตือนไม่สำเร็จ", { description: message });
      }
    },
    [API_BASE_URL]
  );

  const performNotificationAction = useCallback(
    async (
      profileId: number,
      notificationId: string,
      action: "accept" | "reject" | "complete",
      token: string,
      payload?: Record<string, unknown>
    ) => {
      const response = await fetch(
        `${API_BASE_URL}/profiles/${profileId}/notifications/${notificationId}/${action === "complete" ? "complete" : action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === body.notification.id ? body.notification : notif))
      );

      return body.notification as ExchangeNotification;
    },
    [API_BASE_URL]
  );

  const authToken = authSession?.token ?? "";

  const handleAcceptNotification = useCallback(
    async (notificationId: string) => {
      if (!authToken) return;
      await performNotificationAction(resolvedProfileId, notificationId, "accept", authToken);
      await loadNotifications(resolvedProfileId, authToken);
    },
    [performNotificationAction, loadNotifications, resolvedProfileId, authToken]
  );

  const handleRejectNotification = useCallback(
    async (notificationId: string) => {
      if (!authToken) return;
      await performNotificationAction(resolvedProfileId, notificationId, "reject", authToken);
      await loadNotifications(resolvedProfileId, authToken);
    },
    [performNotificationAction, loadNotifications, resolvedProfileId, authToken]
  );

  const handleConfirmComplete = useCallback(
    async (notificationId: string, code: string) => {
      if (!authToken) return;
      await performNotificationAction(resolvedProfileId, notificationId, "complete", authToken, { code });
      await loadNotifications(resolvedProfileId, authToken);
    },
    [performNotificationAction, loadNotifications, resolvedProfileId, authToken]
  );

  useEffect(() => {
    if (isLoggedIn && authToken) {
      loadProfile(resolvedProfileId, authToken);
      loadNotifications(resolvedProfileId, authToken);
    }
  }, [isLoggedIn, authToken, resolvedProfileId, loadNotifications, loadProfile]);

  useEffect(() => {
    if (isLoggedIn) {
      loadItems();
    }
  }, [isLoggedIn, loadItems]);

  useEffect(() => {
    if (isLoggedIn && authToken) {
      loadConversationSummary(authToken);
    }
  }, [isLoggedIn, authToken, loadConversationSummary]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <LandingPage
            onNavigate={handleNavigate}
            activeProfileId={resolvedProfileId}
            apiBaseUrl={API_BASE_URL}
            authToken={authToken}
            items={items}
            onRefreshItems={loadItems}
          />
        );
      case "share":
        return (
          <SharePage
            onNavigate={handleNavigate}
            items={items}
            apiBaseUrl={API_BASE_URL}
            authToken={authToken}
            activeProfileId={resolvedProfileId}
            onRefreshItems={loadItems}
          />
        );
      case "messages":
        return (
          <MessagesPage
            apiBaseUrl={API_BASE_URL}
            authToken={authToken}
            currentUserId={resolvedProfileId}
            onConversationsSnapshot={handleConversationSnapshot}
          />
        );
      case "profile":
        return <ProfilePage profile={profileInfo} posts={profilePosts} />;
      default:
        return (
          <LandingPage
            onNavigate={handleNavigate}
            activeProfileId={resolvedProfileId}
            apiBaseUrl={API_BASE_URL}
            authToken={authToken}
            items={items}
            onRefreshItems={loadItems}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        {authPage === "login" ? (
          <LoginPage
            onLoginSuccess={handleAuthSuccess}
            onNavigateToRegister={() => setAuthPage("register")}
          />
        ) : (
          <RegisterPage
            onRegisterSuccess={handleAuthSuccess}
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
      <main className="flex-1">{renderPage()}</main>
      <Footer />

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
