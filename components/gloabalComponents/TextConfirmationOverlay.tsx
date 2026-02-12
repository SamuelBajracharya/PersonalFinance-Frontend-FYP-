"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface TextConfirmationOverlayProps {
  title: string;
  confirmationText: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TextConfirmationOverlay: React.FC<TextConfirmationOverlayProps> = ({
  title,
  confirmationText,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputText === confirmationText) {
      onConfirm();
      setInputText("");
    }
  };

  const handleClose = () => {
    setInputText("");
    onCancel();
  };

  const isConfirmDisabled = inputText !== confirmationText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-secondaryBG p-8">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-8 top-8 text-gray-300 hover:text-white transition cursor-pointer"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-primary mb-4">{title}</h2>
          <p className="text-gray-300 text-lg">
            Please type{" "}
            <span className="text-white font-medium">{`"${confirmationText}"`}</span>{" "}
            to confirm.
          </p>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={`Type "${confirmationText}" to confirm`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full rounded-full bg-transparent border-1 border-primary px-6 py-3 text-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Actions */}
        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="rounded-full bg-primary py-4 text-lg font-medium hover:bg-primary/80 transition disabled:opacity-70 cursor-pointer"
          >
            Confirm
          </button>

          <button
            onClick={handleClose}
            className="rounded-full bg-accentBG py-4 text-lg hover:bg-white/5 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextConfirmationOverlay;
