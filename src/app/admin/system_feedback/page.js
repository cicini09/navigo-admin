"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMoreVertical, FiMessageSquare, FiFilter, FiChevronDown, FiCheck, FiX } from "react-icons/fi";

// Feedback status types
const FeedbackStatus = {
  RESOLVED: "Resolved",
  UNRESOLVED: "Unresolved",
  IN_PROGRESS: "In Progress"
};

// Feedback types
const FeedbackTypes = [
  "Account-Related Feedback",
  "Bug Report",
  "Feature Request",
  "Performance Feedback",
  "Data Accuracy Feedback",
  "General Complaint",
  "Other"
];

export default function SystemFeedback() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  const statusFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const feedbacksPerPage = 10;

  // Sample feedback data from the image
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      fullName: "Gerard Keay",
      type: "Account-Related Feedback",
      date: "01/23/2024",
      status: "Unresolved",
      description: "I'm having trouble updating my profile information. The save button doesn't seem to work after I make changes to my details.",
      response: ""
    },
    {
      id: 2,
      fullName: "Jonathan Sims",
      type: "Data Accuracy Feedback",
      date: "02/02/2024",
      status: "Resolved",
      description: "The traffic data for downtown seems to be consistently off by about 10-15 minutes. Can this be recalibrated?",
      response: "We've adjusted our data collection parameters and improved the frequency of updates. The accuracy should be improved now."
    },
    {
      id: 3,
      fullName: "Arthur Nolan",
      type: "Bug Report",
      date: "01/23/2024",
      status: "Resolved",
      description: "The app crashes every time I try to view the traffic camera feed on my Samsung device.",
      response: "We've fixed the compatibility issue with Samsung devices in our latest update."
    },
    {
      id: 4,
      fullName: "Georgie Barker",
      type: "Feature Request",
      date: "02/02/2024",
      status: "Unresolved",
      description: "It would be great if we could get notifications when traffic conditions change drastically on our saved routes.",
      response: ""
    },
    {
      id: 5,
      fullName: "Helen Richardson",
      type: "Performance Feedback",
      date: "01/23/2024",
      status: "Resolved",
      description: "The app is very slow to load during peak hours, sometimes taking up to 30 seconds to show the map.",
      response: "We've optimized our server response times and improved caching to reduce load times significantly."
    },
    {
      id: 6,
      fullName: "Gertrude Robinson",
      type: "General Complaint",
      date: "02/02/2024",
      status: "Unresolved",
      description: "The user interface is confusing and it's hard to find the features I need quickly.",
      response: ""
    }
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target)) {
        setShowTypeFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter feedbacks based on search query and selected filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus ? feedback.status === selectedStatus : true;
    const matchesType = selectedType ? feedback.type === selectedType : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate pagination
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);

  // Get status style based on status value
  const getStatusStyle = (status) => {
    switch(status) {
      case FeedbackStatus.RESOLVED:
        return "bg-green-400 text-green-800";
      case FeedbackStatus.UNRESOLVED:
        return "bg-yellow-400 text-yellow-800";
      case FeedbackStatus.IN_PROGRESS:
        return "bg-blue-400 text-blue-800";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  // Handle status change
  const handleStatusChange = (feedback, newStatus) => {
    const updatedFeedbacks = feedbacks.map(f => {
      if (f.id === feedback.id) {
        return { ...f, status: newStatus };
      }
      return f;
    });
    setFeedbacks(updatedFeedbacks);
    setSelectedFeedback({ ...feedback, status: newStatus });
  };

  // Handle response submission
  const handleResponseSubmit = (feedback, response) => {
    const updatedFeedbacks = feedbacks.map(f => {
      if (f.id === feedback.id) {
        return { ...f, response, status: "Resolved" };
      }
      return f;
    });
    setFeedbacks(updatedFeedbacks);
    setSelectedFeedback({ ...feedback, response, status: "Resolved" });
  };

  // View feedback details
  const viewFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  return (
    <motion.div
      className="p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Feedback</h1>
          <p className="text-gray-600 mt-1">Manage and respond to user feedback and issues</p>
        </div>
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            <FiMessageSquare className="mr-2" /> Send Message
          </button>
        </div>
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
                {Object.values(FeedbackStatus).map(status => (
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
        
        {/* Feedback Type Filter */}
        <div className="relative" ref={typeFilterRef}>
          <button
            onClick={() => setShowTypeFilter(!showTypeFilter)}
            className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Type: {selectedType || "All"} <FiChevronDown className="ml-2" />
          </button>
          
          {showTypeFilter && (
            <div className="absolute mt-1 w-64 bg-white rounded-md shadow-lg z-20">
              <ul className="py-1 max-h-60 overflow-y-auto">
                <li 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedType("");
                    setShowTypeFilter(false);
                  }}
                >
                  All
                </li>
                {FeedbackTypes.map(type => (
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
            placeholder="Search by name, type, or description..."
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

      {/* Feedback table */}
      <div className="border rounded-md overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 bg-gray-50 border-b sticky top-0 z-10">
          <div className="px-4 py-3 text-left font-medium text-gray-700">Full Name</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Feedback Type</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Date</div>
          <div className="px-4 py-3 text-left font-medium text-gray-700">Status</div>
        </div>

        {/* Table body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {currentFeedbacks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No feedback found matching your filters.
            </div>
          ) : (
            currentFeedbacks.map((feedback) => (
              <div 
                key={`feedback-${feedback.id}`} 
                className="grid grid-cols-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => viewFeedbackDetails(feedback)}
              >
                <div className="px-4 py-4 text-sm text-gray-900">{feedback.fullName}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{feedback.type}</div>
                <div className="px-4 py-4 text-sm text-gray-900">{feedback.date}</div>
                <div className="px-4 py-4 flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(feedback.status)}`}>
                    {feedback.status}
                  </span>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      viewFeedbackDetails(feedback);
                    }}
                  >
                    <FiMoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredFeedbacks.length > 0 && (
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

      {/* Feedback Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Feedback Details</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Submitted by</p>
                <p className="font-medium">{selectedFeedback.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedFeedback.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Feedback Type</p>
                <p className="font-medium">{selectedFeedback.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center">
                  <span 
                    className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(selectedFeedback.status)}`}
                  >
                    {selectedFeedback.status}
                  </span>
                  <div className="relative ml-2">
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) => handleStatusChange(selectedFeedback, e.target.value)}
                      className="py-1 pl-2 pr-8 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(FeedbackStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Feedback Description</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p>{selectedFeedback.description}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Admin Response</h3>
              <textarea
                value={selectedFeedback.response}
                onChange={(e) => setSelectedFeedback({...selectedFeedback, response: e.target.value})}
                placeholder="Type your response here..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={() => handleResponseSubmit(selectedFeedback, selectedFeedback.response)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              >
                <FiCheck className="mr-2" /> Submit Response
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
  