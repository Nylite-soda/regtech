// components/ui/ActionNotAllowedModal.tsx
"use client";

import React, { useEffect } from "react";
import { X, AlertOctagon, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActionNotAllowedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ActionNotAllowedModal: React.FC<ActionNotAllowedModalProps> = ({
  isOpen,
  onClose,
  title = "Action Not Allowed",
  message = "You don't have permission to perform this action. Please contact your administrator for assistance.",
  actionLabel = "Contact Support",
  onAction,
}) => {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              duration: 0.2,
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="relative bg-[#AD0000] px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-red-50 rounded-full">
                    <AlertOctagon className="w-6 h-6 text-[#AD0000]" />
                  </div>
                  <div>
                    <p className="text-gray-700">{message}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Dismiss
                </button>
                {onAction && (
                  <button
                    onClick={onAction}
                    className="px-4 py-2 bg-[#AD0000] text-white rounded-md hover:bg-red-800 transition-colors flex items-center gap-2"
                  >
                    {actionLabel}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionNotAllowedModal;
