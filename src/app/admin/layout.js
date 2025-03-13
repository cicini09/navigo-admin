"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "User Management", path: "/admin/user_management" },
  { name: "Admin Management", path: "/admin/admin_management" },
  { name: "Traffic Reports", path: "/admin/traffic_reports" },
  { name: "System Feedback", path: "/admin/system_feedback" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen">
      {/* Top Tab Bar with Profile */}
      <div className="bg-primarydarker text-white flex justify-between items-center px-6 py-3 shadow-md">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <h1 className="text-4xl font-bold">NaviGo</h1>
        </div>
        
        {/* Empty space in the middle */}
        <div className="flex-1"></div>
        
        {/* Profile Icon */}
        <div className="flex items-center">
          <div className="relative w-10 h-10 cursor-pointer">
            <Image 
              src="/admin-icon.png" 
              alt="Admin Profile" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-white flex flex-col p-4">
          {/* Sidebar Links */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md ${
                  pathname === item.path ? "bg-white text-royalblue font-bold" : "hover:bg-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <Link href="/">
              <button className="w-full bg-white text-blue-700 py-2 rounded-md hover:bg-gray-200">
                Log out
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
