"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMoreVertical, FiEye, FiEyeOff, FiPlus, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

// Status enum
const AdminStatus = {
  ACTIVE: "Active",
  DEACTIVATED: "Deactivated",
  INACTIVE: "Inactive"
};

export default function AdminManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const statusFilterRef = useRef(null);
  const adminsPerPage = 10;
  
  const modalRef = useRef(null);
  
  // New admin form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (hasChanges) {
          setShowDiscardDialog(true);
        } else {
          setShowAddModal(false);
        }
      }
      
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddModal, hasChanges, showStatusFilter]);

  // Generate admins on the client side only (after component mounts)
  useEffect(() => {
    const generateAdmins = (count) => {
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
      const firstNames = ['John', 'Jane', 'Michael', 'Emma', 'David', 'Sarah', 'Alex', 'Sam', 'Jonathan', 'Olivia'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Newall', 'Davies'];
      
      const adminsList = [];
      
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        
        // Most admins are active
        let status = AdminStatus.ACTIVE;
        
        adminsList.push({
          email: `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
          fullName: `${firstName} ${lastName}`,
          phoneNumber: `09${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
          dateRegistered: `12/25/2023`,
          status
        });
      }
      
      return adminsList.map((admin, index) => ({
        ...admin,
        id: index + 1 // Ensure IDs are unique and sequential
      }));
    };
    
    // Generate 10 admins
    const generatedAdmins = generateAdmins(10);
    setAdmins(generatedAdmins);
    setIsLoading(false);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setHasChanges(true);
  };

  // Handle add admin form submission
  const handleAddAdmin = () => {
    // Here you would typically make an API call to save the new admin
    console.log("Adding new admin:", formData);
    
    // For demo purposes, add the new admin to the list
    const newAdmin = {
      id: admins.length + 1,
      email: formData.email,
      fullName: formData.name,
      phoneNumber: formData.phoneNumber,
      dateRegistered: new Date().toLocaleDateString(),
      status: AdminStatus.ACTIVE
    };
    
    setAdmins([...admins, newAdmin]);
    
    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    });
    setHasChanges(false);
    setShowAddModal(false);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      setShowAddModal(false);
    }
  };

  // Handle discard changes confirmation
  const handleDiscardChanges = (confirm) => {
    setShowDiscardDialog(false);
    if (confirm) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
      });
      setHasChanges(false);
      setShowAddModal(false);
    }
  };

  // Filter admins based on search query and status
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phoneNumber?.includes(searchQuery);
    
    const matchesStatus = selectedStatus ? admin.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  // Get status style based on status value
  const getStatusStyle = (status) => {
    switch(status) {
      case AdminStatus.ACTIVE:
        return "bg-green-400 text-green-800";
      case AdminStatus.DEACTIVATED:
        return "bg-yellow-400 text-yellow-800";
      case AdminStatus.INACTIVE:
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
      {/* Page Header and Add Admin Button in same row */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin List</h1>
          <p className="text-gray-600 mt-1">Manage system administrators</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus className="mr-2" /> Add Admin
          </button>
        </div>
      </div>

      {/* Search and filters row */}
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
                {Object.values(AdminStatus).map(status => (
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

      {/* Admins table */}
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
            <p className="mt-2 text-gray-600">Loading admins...</p>
          </div>
        ) : (
          /* Table body - scrollable container - reduced height to prevent overflow */
          <div className="max-h-[60vh] overflow-y-auto">
            {currentAdmins.map((admin) => (
              <div key={`admin-${admin.id}`} className="grid grid-cols-5 border-b hover:bg-gray-50">
                <div className="px-4 py-4 text-sm text-gray-900">{admin.email}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{admin.fullName}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{admin.phoneNumber}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{admin.dateRegistered}</div>
                <div className="px-4 py-4 flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(admin.status)}`}>
                    {admin.status}
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

      {/* Pagination - Now in its own div, not in a flexbox with the Add Admin button */}
      {!isLoading && (
        <div className="flex justify-end mt-4 px-4">
          <div className="flex items-center space-x-2">
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
            
            {/* Dynamic Page Numbers */}
            {(() => {
              let pages = [];
              const maxVisiblePages = 5;

              if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (currentPage <= 3) {
                  for (let i = 1; i <= 5; i++) pages.push(i);
                } else if (currentPage >= totalPages - 2) {
                  for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                } else {
                  for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
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
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center">Add Admin</h2>
            
            {/* Admin Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image 
                  src="/admin-icon.png" 
                  alt="Admin Profile" 
                  width={96} 
                  height={96} 
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1 bg-green-400 text-green-800 rounded-full text-sm">
                Active
              </span>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone Number:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Confirm Password:</label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Admin
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Discard Changes Dialog */}
      {showDiscardDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Discard Changes?</h3>
            <p className="text-gray-600 mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleDiscardChanges(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                No, Keep Editing
              </button>
              <button
                onClick={() => handleDiscardChanges(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Yes, Discard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
