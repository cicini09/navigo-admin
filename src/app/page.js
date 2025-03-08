"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminFlow() {
  const [showSplash, setShowSplash] = useState(true);
  const splashDuration = 3000;
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, splashDuration);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center w-full h-screen bg-[#256DD3] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        
        transition={{ duration: 1 }}
      >
        <Image 
          src="/abstract_corner_pattern.png" 
          alt="Corner Pattern" 
          width={200} 
          height={200} 
          className="absolute top-0 left-0 rotate-0 opacity-75"
        />
        <Image 
          src="/admin_logo.png" 
          alt="Admin Logo" 
          width={300} 
          height={300} 
          className="mb-4"
        />
        <motion.h1 
          className="text-6xl font-bold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          NaviGo
        </motion.h1>
        <motion.h2 
          className="text-3xl font-bold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Admin
        </motion.h2>
        <Image 
          src="/abstract_corner_pattern.png" 
          alt="Corner Pattern" 
          width={200} 
          height={200} 
          className="absolute bottom-0 right-0 rotate-180 opacity-75"
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="relative w-full h-screen flex items-center justify-center bg-[#256DD3]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Image 
        src="/admin_login_bg.png" 
        alt="Admin Login Background" 
        layout="fill" 
        objectFit="cover" 
        className="absolute inset-0 z-0"
      />
      
      <motion.div 
        className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-96"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Log in as Admin</h2>
        
        <label className="block mb-2 text-gray-700">Email</label>
        <input 
          type="email" 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
        />

        <label className="block mt-4 mb-2 text-gray-700">Password</label>
        <div className="relative">
          <input 
            type={passwordVisible ? "text" : "password"} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          />
          <button 
            type="button" 
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <button 
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
        >
          Log in
        </button>
      </motion.div>
    </motion.div>
  );
}
