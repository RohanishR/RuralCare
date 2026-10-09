"use client";

import { useEffect, useState, useRef } from "react";
import { Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // In a real app, you might want to poll or use WebSockets for real-time updates.
    // For now, poll every 60 seconds.
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

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
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-11 h-11 flex items-center justify-center rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors text-on-surface-variant"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
            <h3 className="font-bold text-on-surface text-label-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-primary hover:text-primary/80 text-label-sm font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-body-md flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-outline-variant">notifications_off</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 rounded-lg flex flex-col gap-1 cursor-pointer transition-colors ${
                      notif.read ? "hover:bg-surface-container-lowest opacity-70" : "bg-primary-container/10 hover:bg-primary-container/20 border border-primary/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-label-md font-bold ${notif.read ? "text-on-surface" : "text-on-surface"}`}>
                        {notif.title}
                      </p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>}
                    </div>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-label-sm text-outline mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-outline-variant bg-surface-container-low text-center">
            <a href="/notifications" className="text-primary hover:text-primary/80 text-label-sm font-bold transition-colors inline-block py-1">
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
