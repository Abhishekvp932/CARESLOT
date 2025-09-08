import { Check, Trash2 } from "lucide-react";
import { useGetUserNotificationQuery } from "@/features/users/userApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
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

export default function NotificationComponent() {
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id;

  const { data, isLoading, isError,refetch } = useGetUserNotificationQuery({ patientId });
 


  useEffect(()=>{
    if(patientId){
      refetch();
    }
  },[patientId]);
    const [notificationUnread] = useNotificationUnreadMutation();
    const [notificationDelete] = useNotificationDeleteMutation();
    const  [deleteAllNotification]= useDeleteAllNotificationMutation();
  const notifications: Notification[] = Array.isArray(data)
    ? data.map((n: any) => ({
        _id: n._id,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
      }))
    : [];

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  if (isLoading) return <p className="p-4 text-gray-500">Loading notifications...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading notifications</p>;
  


  const handleMarkAsRead = async (notificationId: string) => {
    try {
        const res = await notificationUnread(notificationId).unwrap();
        console.log(res);
         refetch();
    } catch (error) {
        console.log(error);
    }
  };

  const handleDelete = async(notificationId: string) => {
     try {
        const res = await notificationDelete(notificationId).unwrap();
        console.log(res);
        refetch();
     } catch (error) {
        console.log(error);
     }
  };

  const handleDeleteAll = async() => {
     try {
        const res = await deleteAllNotification(patientId).unwrap();
        console.log(res);
        refetch();
     } catch (error) {
        console.log(error);
     }
  };

  const renderNotification = (notif: Notification) => (
    <div
      key={notif._id}
      className={`flex justify-between items-start p-3 border-b hover:bg-gray-50 transition ${
        notif.isRead ? "bg-white" : "bg-blue-50"
      }`}
    >
      <div>
        <h3 className="font-semibold text-sm">{notif.title}</h3>
        <p className="text-gray-600 text-sm">{notif.message}</p>
        <span className="text-xs text-gray-400">
          {new Date(notif.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2 ml-2">
        {!notif.isRead && (
          <button
            onClick={() => handleMarkAsRead(notif._id)}
            className="p-1 rounded-full hover:bg-green-100 text-green-600"
            title="Mark as Read"
          >
            <Check size={16} />
          </button>
        )}
        <button
          onClick={() => handleDelete(notif._id)}
          className="p-1 rounded-full hover:bg-red-100 text-red-600"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-h-96 overflow-y-auto border rounded-md">
   
      {notifications.length > 0 && (
        <div className="flex justify-end p-2 bg-gray-50 border-b">
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-1 text-red-600 text-sm font-medium hover:text-red-800"
          >
            <Trash2 size={16} />
            Delete All
          </button>
        </div>
      )}

      
      <h2 className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100">
        Unread Notifications ({unreadNotifications.length})
      </h2>
      {unreadNotifications.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">No unread notifications</p>
      ) : (
        unreadNotifications.map(renderNotification)
      )}

      
      <h2 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 mt-2">
        Read Notifications ({readNotifications.length})
      </h2>
      {readNotifications.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">No read notifications</p>
      ) : (
        readNotifications.map(renderNotification)
      )}
    </div>
  );
}
