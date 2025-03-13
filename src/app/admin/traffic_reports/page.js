"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMoreVertical, FiPlus, FiDownload, FiCalendar, FiClock, FiMapPin, FiChevronDown } from "react-icons/fi";

// Sample traffic incidents data from the image
const trafficIncidents = [
  {
    id: 1,
    type: "Accident",
    location: "8XM6+V9H, U.N. Ave, Mandaue City, 6014 Metro Manila",
    date: "01/05/2024",
    time: "21:00"
  },
  {
    id: 2,
    type: "Construction",
    location: "9X8P+VFJ, Consolacion-Tayud-Liloan Rd, Consolacion, Cebu J. Newall",
    date: "01/25/2024",
    time: "11:00"
  },
  {
    id: 3,
    type: "Road Block",
    location: "8XG2+7WV, Ground Floor MYFC Building, A. C. Cortes Ave, Mandaue City, 6014 Cebu",
    date: "2/26/2024",
    time: "15:00"
  },
  {
    id: 4,
    type: "Accident",
    location: "J Centre, AS Fortuna Cor. V. Albano St Extension, Mandaue City, 6014",
    date: "2/26/2024",
    time: "22:00"
  },
  {
    id: 5,
    type: "Heavy Traffic",
    location: "8WRW+HR6, Sitio Salvacion, Mandaue City, 6014 Cebu",
    date: "5/16/2024",
    time: "21:35"
  }
];

export default function TrafficReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const modalRef = useRef(null);
  const typeFilterRef = useRef(null);
  const incidentsPerPage = 10;
  
  // Incident form state
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    date: "",
    time: ""
  });
  
  // Incident type options
  const incidentTypes = [
    "Accident",
    "Construction",
    "Road Block",
    "Heavy Traffic",
    "Road Closure",
    "Flooding"
  ];
  
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
      
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target)) {
        setShowTypeFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddModal, hasChanges, showTypeFilter]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setHasChanges(true);
  };
  
  // Handle add incident form submission
  const handleAddIncident = () => {
    // Here you would typically make an API call to save the new incident
    console.log("Adding new traffic incident:", formData);
    
    // Reset form and close modal
    setFormData({
      type: "",
      location: "",
      date: "",
      time: ""
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
        type: "",
        location: "",
        date: "",
        time: ""
      });
      setHasChanges(false);
      setShowAddModal(false);
    }
  };

  // Filter incidents based on search query and type
  const filteredIncidents = trafficIncidents.filter(incident => {
    const matchesSearch = 
      incident.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.date?.includes(searchQuery) ||
      incident.time?.includes(searchQuery);
    
    const matchesType = selectedType ? incident.type === selectedType : true;
    
    return matchesSearch && matchesType;
  });

  // Calculate pagination
  const indexOfLastIncident = currentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = filteredIncidents.slice(indexOfFirstIncident, indexOfLastIncident);
  const totalPages = Math.ceil(filteredIncidents.length / incidentsPerPage);

  return (
    <motion.div
      className="p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header and Add Traffic Incident Button in same row */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Traffic Reports</h1>
          <p className="text-gray-600 mt-1">Manage and monitor traffic incidents</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus className="mr-2" /> Add Incident
          </button>
          <button
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Search and filters row */}
      <div className="flex flex-wrap mb-4 gap-3">
        {/* Incident Type Filter */}
        <div className="relative" ref={typeFilterRef}>
          <button
            onClick={() => setShowTypeFilter(!showTypeFilter)}
            className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Type: {selectedType || "All"} <FiChevronDown className="ml-2" />
          </button>
          
          {showTypeFilter && (
            <div className="absolute mt-1 w-48 bg-white rounded-md shadow-lg z-20">
              <ul className="py-1">
                <li 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedType("");
                    setShowTypeFilter(false);
                  }}
                >
                  All
                </li>
                {incidentTypes.map(type => (
                  <li 
                    key={type}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedType(type);
                      setShowTypeFilter(false);
                    }}
                  >
                    {type}
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
            placeholder="Search incidents..."
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

      {/* Traffic incidents table */}
      <div className="border rounded-md overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 bg-gray-50 border-b sticky top-0 z-10">
          <div className="px-4 py-3 text-left font-medium text-gray-700">Incident Type</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Location</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Date</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Time</div>
        </div>

        {/* Table body - scrollable container */}
        <div className="max-h-[60vh] overflow-y-auto">
          {currentIncidents.map((incident) => (
            <div key={`incident-${incident.id}`} className="grid grid-cols-4 border-b hover:bg-gray-50">
              <div className="px-4 py-4 text-sm text-gray-900">{incident.type}</div>
              <div className="px-4 py-4 text-sm text-gray-900">{incident.location}</div>
              <div className="px-4 py-4 text-sm text-gray-900">{incident.date}</div>
              <div className="px-4 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-900">{incident.time}</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <FiMoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {filteredIncidents.length > 0 && (
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
      
      {/* Add Traffic Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-6">Add Traffic Report</h2>
            
            {/* Form Fields */}
            <div className="space-y-5">
              <div className="flex items-start">
                <label className="block text-gray-700 w-28 pt-2">Incident Type:</label>
                <div className="flex-1">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="" disabled>Incident Type</option>
                    {incidentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-start">
                <label className="block text-gray-700 w-28 pt-2">Location:</label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location details"
                  />
                </div>
              </div>
              
              <div className="flex items-start">
                <label className="block text-gray-700 w-28 pt-2">Date:</label>
                <div className="flex-1 relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FiCalendar className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>
              
              <div className="flex items-start">
                <label className="block text-gray-700 w-28 pt-2">Time:</label>
                <div className="flex-1">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIncident}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Traffic Alert
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
