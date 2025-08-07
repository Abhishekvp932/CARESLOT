import React from 'react';
import { useSelector } from 'react-redux';
import { AvatarImage,Avatar } from "@/components/ui/avatar";
import { useGetUserDataQuery } from '@/features/users/userApi';
import type { RootState } from '@/app/store';
import { 
  User, 
  Settings, 
  FileText, 
  BarChart3, 
  Mail, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Profile');
  const user = useSelector((state:RootState)=> state.auth.user);
  const {data:users} = useGetUserDataQuery(user?._id);
  const menuItems = [
    { name: 'Profile', icon: User, color: 'text-green-500' },
    { name: 'Sessions', icon: BarChart3, color: 'text-purple-500' },
    { name: 'Documents', icon: FileText, color: 'text-orange-500' },
    { name: 'Messages', icon: Mail, color: 'text-red-500' },
    { name: 'Calendar', icon: Calendar, color: 'text-indigo-500' },
    { name: 'Settings', icon: Settings, color: 'text-gray-500' },
  ];

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 h-full transition-all duration-300 ease-in-out flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Menu className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : item.color} transition-colors duration-200 ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Avatar>
               <AvatarImage src={users?.profile_img} />
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
               {users?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {users?.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;