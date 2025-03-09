"use client";
import Link from "next/link";
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">NaviGo</h1>
        
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
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
}
