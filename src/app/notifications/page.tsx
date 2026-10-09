"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, CheckCircle2, BellRing } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) {
      try {
        await markNotificationAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-3xl flex-1 flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container transition-colors text-on-surface border border-outline-variant"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <BellRing className="w-6 h-6 text-primary" />
                Notifications
              </h1>
              <p className="text-on-surface-variant text-sm mt-1">Stay updated with your appointments and health alerts.</p>
            </div>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-colors rounded-lg font-bold text-sm shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant bg-surface rounded-2xl border border-outline-variant border-dashed">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">notifications_off</span>
            <p className="text-lg font-bold text-on-surface">No notifications yet</p>
            <p className="text-sm mt-1">When you get notifications, they'll show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-5 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all border shadow-sm ${
                  notif.read ? "bg-surface border-outline-variant opacity-80 hover:opacity-100" : "bg-primary-container/20 border-primary/20 shadow-md hover:bg-primary-container/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-lg font-bold ${notif.read ? "text-on-surface" : "text-primary"}`}>
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wide">
                      New
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-outline font-medium bg-surface-container px-2 py-1 rounded-md">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                  </span>
                  <span className="text-xs text-outline font-medium bg-surface-container px-2 py-1 rounded-md capitalize">
                    {notif.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
