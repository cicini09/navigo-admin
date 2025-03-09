"use client";
import { motion } from "framer-motion";

export default function SystemFeedback() {
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold">System Feedback</h1>
      <p>Manage users here.</p>
    </motion.div>
  );
}
