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
    <div className="fixed inset-0 !z-[2147483645] flex items-center justify-center bg-overlay/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-secondaryBG p-8">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-8 top-8 text-textsecondary hover:text-textmain transition cursor-pointer"
          type="button"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-primary mb-4">{title}</h2>
          <p className="text-textsecondary text-lg">
            Please type{" "}
            <span className="text-primary font-medium">{`"${confirmationText}"`}</span>{" "}
            to confirm.
          </p>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={`Type "${confirmationText}" to confirm`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full rounded-full bg-transparent border-1 border-primary px-6 py-3 text-lg text-textmain focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-textsecondary"
        />

        {/* Actions */}
        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`rounded-full bg-primary py-4 text-lg font-medium text-textmain hover:bg-primary/80 transition disabled:opacity-70 ${isConfirmDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            type="button"
          >
            Confirm
          </button>

          <button
            onClick={handleClose}
            className="rounded-full bg-accentBG py-4 text-lg text-textmain hover:bg-accentBG/80 transition cursor-pointer"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextConfirmationOverlay;
