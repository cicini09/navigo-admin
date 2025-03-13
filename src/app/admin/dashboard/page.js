"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Dashboard() {
  return (
    <motion.div
      className="p-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      {/* Top container with background pattern - extended width */}
      <div className="relative bg-dashboard-pattern rounded-lg mb-6 p-4 mx-auto w-full max-w-screen-2xl">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/dashboard_abstract_pattern.png" 
            alt="Dashboard Background Pattern" 
            layout="fill" 
            objectFit="cover"
            className="rounded-lg opacity-50"
          />
        </div>
        
        {/* Container for the three top boxes */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {/* Top Box 1 */}
          <div className="bg-temp-container h-36 rounded-lg shadow-md">
            {/* Content will be added later */}
          </div>
          
          {/* Top Box 2 */}
          <div className="bg-temp-container h-36 rounded-lg shadow-md">
            {/* Content will be added later */}
          </div>
          
          {/* Top Box 3 */}
          <div className="bg-temp-container h-36 rounded-lg shadow-md">
            {/* Content will be added later */}
          </div>
        </div>
      </div>
      
      {/* Bottom container for the two larger boxes - extended width */}
      <div className="grid grid-cols-3 gap-6 mx-auto w-full max-w-screen-2xl">
        {/* Bottom Left Box (takes up 2/3 of width) */}
        <div className="col-span-2 bg-temp-container h-96 rounded-lg shadow-md">
          {/* Content will be added later */}
        </div>
        
        {/* Bottom Right Box (takes up 1/3 of width) */}
        <div className="bg-temp-container h-96 rounded-lg shadow-md">
          {/* Content will be added later */}
        </div>
      </div>
    </motion.div>
  );
}
