import { Check, Trash2, Bell, CheckCheck } from "lucide-react";
import { useGetUserNotificationQuery } from "@/features/users/userApi";
import { useReadAllNotificationMutation } from "@/features/users/userApi";
import { useNotificationUnreadMutation } from "@/features/users/userApi";
import { useNotificationDeleteMutation } from "@/features/users/userApi";
import { useDeleteAllNotificationMutation } from "@/features/users/userApi";
import { useEffect } from "react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
interface Props {
  patientId:string
}
export default function NotificationComponent({ patientId }:Props) {
  const { data, isLoading, isError, refetch } = useGetUserNotificationQuery({
    patientId,
  });

  useEffect(() => {
    if (patientId) {
      refetch();
    }
  }, [patientId]);

  const [notificationUnread] = useNotificationUnreadMutation();
  const [notificationDelete] = useNotificationDeleteMutation();
  const [deleteAllNotification] = useDeleteAllNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();

  const notifications: Notification[] = Array.isArray(data)
    ? data
        .map((n: Notification) => ({
          _id: n._id,
          title: n.title,
          message: n.message,
          isRead: n.isRead,
          createdAt: n.createdAt,
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : [];

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-medium">Error loading notifications</p>
      </div>
    );
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await notificationUnread(notificationId).unwrap();
      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const res = await notificationDelete(notificationId).unwrap();
      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await deleteAllNotification(patientId).unwrap();
      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log("readll all function is working?");
      const res = await readAllNotification(patientId).unwrap();
      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotification = (notif: Notification) => (
    <div
      key={notif._id}
      className={`flex justify-between items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        notif.isRead ? "bg-white" : "bg-blue-50"
      }`}
    >
      <div className="flex-1 mr-3">
        <div className="flex items-start gap-2 mb-1">
          {!notif.isRead && (
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
          )}
          <h3 className="font-semibold text-gray-900 text-sm">{notif.title}</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed ml-4">
          {notif.message}
        </p>
        <span className="text-xs text-gray-400 ml-4 mt-1 inline-block">
          {new Date(notif.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        {!notif.isRead && (
          <button
            onClick={() => handleMarkAsRead(notif._id)}
            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
            title="Mark as Read"
          >
            <Check size={16} />
          </button>
        )}
        <button
          onClick={() => handleDelete(notif._id)}
          className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-h-[32rem] overflow-hidden rounded-xl bg-white shadow-lg">
      {notifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Notifications
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 px-3 py-1.5 text-green-600 text-xs font-medium hover:bg-green-50 rounded-lg transition-colors"
            >
              <CheckCheck size={14} />
              Read All
            </button>

            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1 px-3 py-1.5 text-red-600 text-xs font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="overflow-y-auto max-h-[28rem]">
        {notifications.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>
        )}

        {unreadNotifications.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 sticky top-0 z-10">
              <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Unread ({unreadNotifications.length})
              </h3>
            </div>
            {unreadNotifications.map(renderNotification)}
          </div>
        )}

        {readNotifications.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Read ({readNotifications.length})
              </h3>
            </div>
            {readNotifications.map(renderNotification)}
          </div>
        )}
      </div>
    </div>
  );
}
