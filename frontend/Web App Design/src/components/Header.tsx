import { Leaf, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { NotificationDropdown, ExchangeNotification } from "./NotificationDropdown";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  notifications: ExchangeNotification[];
  onAcceptNotification: (notificationId: string) => void;
  onRejectNotification: (notificationId: string) => void;
  onStartChat: (notificationId: string) => void;
  onConfirmComplete: (notificationId: string, code: string) => void;
}

export function Header({ 
  currentPage, 
  onNavigate,
  notifications,
  onAcceptNotification,
  onRejectNotification,
  onStartChat,
  onConfirmComplete,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", value: "home" },
    { label: "Profile", value: "profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-primary">CMU ShareCycle</span>
              <span className="text-xs text-muted-foreground">Green Campus</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={currentPage === item.value ? "default" : "ghost"}
                onClick={() => onNavigate(item.value)}
                className={currentPage === item.value ? "rounded-xl" : "rounded-xl"}
              >
                {item.label}
              </Button>
            ))}
            
            {/* Notification Dropdown */}
            <NotificationDropdown
              notifications={notifications}
              onAccept={onAcceptNotification}
              onReject={onRejectNotification}
              onStartChat={onStartChat}
              onConfirmComplete={onConfirmComplete}
            />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={currentPage === item.value ? "default" : "ghost"}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start rounded-xl"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}