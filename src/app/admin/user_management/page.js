"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMoreVertical, FiChevronDown } from "react-icons/fi";

// Status enum
const UserStatus = {
  ACTIVE: "Active",
  DEACTIVATED: "Deactivated",
  INACTIVE: "Inactive"
};

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const statusFilterRef = useRef(null);
  const usersPerPage = 50;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate users on the client side only (after component mounts)
  useEffect(() => {
    const generateUsers = (count) => {
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
      const firstNames = ['John', 'Jane', 'Michael', 'Emma', 'David', 'Sarah', 'Robert', 'Emily', 'James', 'Olivia', 'William', 'Sophia', 'Joseph', 'Isabella', 'Charles', 'Mia', 'Thomas', 'Charlotte', 'Daniel', 'Amelia'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'];
      
      const users = [];
      
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        
        // Make most users active, fewer deactivated, and even fewer inactive
        const statusRandom = Math.random();
        let status;
        if (statusRandom < 0.7) {
          status = UserStatus.ACTIVE;
        } else if (statusRandom < 0.9) {
          status = UserStatus.DEACTIVATED;
        } else {
          status = UserStatus.INACTIVE;
        }
        
        users.push({
          email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${domain}`,
          fullName: `${firstName} ${lastName}`,
          phoneNumber: `09${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
          dateRegistered: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2023`,
          status
        });
      }
      
      return users.map((user, index) => ({
        ...user,
        id: index + 1 // Ensure IDs are unique and sequential
      }));
    };
    
    // Generate 120 users
    const generatedUsers = generateUsers(120);
    setUsers(generatedUsers);
    setIsLoading(false);
  }, []);

  // Filter users based on search query and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(searchQuery);
    
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Get status style based on status value
  const getStatusStyle = (status) => {
    switch(status) {
      case UserStatus.ACTIVE:
        return "bg-green-400 text-green-800";
      case UserStatus.DEACTIVATED:
        return "bg-yellow-400 text-yellow-800";
      case UserStatus.INACTIVE:
        return "bg-gray-400 text-gray-800";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  return (
    <motion.div
      className="p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User List</h1>
        <p className="text-gray-600 mt-1">Manage and view all system users</p>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-wrap mb-4 gap-3">
        {/* Status Filter */}
        <div className="relative" ref={statusFilterRef}>
          <button
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Status: {selectedStatus || "All"} <FiChevronDown className="ml-2" />
          </button>
          
          {showStatusFilter && (
            <div className="absolute mt-1 w-48 bg-white rounded-md shadow-lg z-20">
              <ul className="py-1">
                <li 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedStatus("");
                    setShowStatusFilter(false);
                  }}
                >
                  All
                </li>
                {Object.values(UserStatus).map(status => (
                  <li 
                    key={status}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusFilter(false);
                    }}
                  >
                    {status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Full name, email..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Users table */}
      <div className="border rounded-md overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 bg-gray-50 border-b sticky top-0 z-10">
          <div className="px-4 py-3 text-left font-medium text-gray-700">Email</div>
          <div className="px-3 py-3 text-left font-medium text-gray-700">Full name</div>
          <div className="px-2 py-3 text-left font-medium text-gray-700">Phone Number</div>
          <div className="px-1 py-3 text-left font-medium text-gray-700">Date Registered</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Status</div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          /* Table body - scrollable container - reduced height to prevent overflow */
          <div className="max-h-[60vh] overflow-y-auto">
            {currentUsers.map((user) => (
              <div key={`user-${user.id}`} className="grid grid-cols-5 border-b hover:bg-gray-50">
                <div className="px-4 py-4 text-sm text-gray-900">{user.email}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{user.fullName}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{user.phoneNumber}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{user.dateRegistered}</div>
                <div className="px-4 py-4 flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(user.status)}`}>
                    {user.status}
                  </span>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiMoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Pagination */}
      {!isLoading && (
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          
          {/* Dynamic page numbers */}
          {(() => {
            let pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
              // If we have fewer pages than max visible, show all
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              // We need to determine which pages to show
              if (currentPage <= 3) {
                // Near the start
                for (let i = 1; i <= 5; i++) {
                  pages.push(i);
                }
              } else if (currentPage >= totalPages - 2) {
                // Near the end
                for (let i = totalPages - 4; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Somewhere in the middle
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                  pages.push(i);
                }
              }
            }
            
            return pages.map(page => (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                {page}
              </button>
            ));
          })()}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
          <button 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </motion.div>
  );
}
