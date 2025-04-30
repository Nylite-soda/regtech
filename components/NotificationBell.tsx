// components/NotificationBell.tsx
import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell } from 'lucide-react';
import { BASE_URL } from '@/lib/utils';
import './notifications.css';

interface NotificationBellProps {
  userId: string;
  authToken: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId, authToken }) => {
  const { notifications, unreadCount, setUnreadCount } = useNotifications(userId, authToken);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const markAsRead = async (notificationId: string): Promise<void> => {
    await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="notification-container">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Bell /> {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="empty">No new notifications</div>
          ) : (
            notifications.map((notification: Notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              >
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                {!notification.is_read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="mark-read"
                  >
                    Mark as read
                  </button>
                )}
                {notification.action_url && (
                  <a href={notification.action_url} className="action-link">
                    View
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;