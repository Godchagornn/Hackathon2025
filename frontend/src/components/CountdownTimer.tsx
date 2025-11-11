import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  expiryDate: string; // ISO date string
}

export function CountdownTimer({ expiryDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryDate).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("หมดอายุแล้ว");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`เหลือ ${days} วัน`);
      } else if (hours > 0) {
        setTimeLeft(`เหลือ ${hours} ชั่วโมง`);
      } else {
        setTimeLeft(`เหลือ ${minutes} นาที`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
        isExpired
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      <Clock className="h-3 w-3" />
      <span>{timeLeft}</span>
    </div>
  );
}
