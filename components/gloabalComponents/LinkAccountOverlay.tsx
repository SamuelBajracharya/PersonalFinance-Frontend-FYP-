"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLoginToBank } from "@/hooks/useBankTransaction";
import { useBankOverlay } from "@/stores/useBankOverlay";

const LinkAccountOverlay: React.FC = () => {
  const { isOpen, close, setBankLinked } = useBankOverlay();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useLoginToBank();

  if (!isOpen) return null;

  const handleClose = () => {
    if (isPending) return;
    setUsername("");
    setPassword("");
    close();
  };

  const handleSubmit = () => {
    if (!username || !password) return;

    mutate(
      { username, password },
      {
        onSuccess: () => {
          setBankLinked(true);

          setUsername("");
          setPassword("");
          close();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-secondaryBG p-8">
        {/* Close */}
        <button
          onClick={handleClose}
          disabled={isPending}
          className="absolute right-8 top-8 text-gray-200 hover:text-white transition disabled:opacity-50 cursor-pointer"
        >
          <FaTimes size={28} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-[#f39c12] mb-2">
            Link Bank Account
          </h2>
          <p className="text-gray-300 text-lg">
            Log in to your bank to start syncing transactions.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Phone number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-full bg-transparent px-8 py-3 text-lg border-1 border-primary text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full bg-transparent px-8 py-3 text-lg border-1 border-primary text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleSubmit}
            disabled={!username || !password || isPending}
            className="flex-1 rounded-full bg-primary py-4 text-lg font-medium hover:bg-primary/80 transition disabled:opacity-60 cursor-pointer"
          >
            {isPending ? "Linking..." : "Link Account"}
          </button>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 rounded-full  py-4 text-white bg-accentBG font-medium text-lg hover:bg-white/5 transition disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkAccountOverlay;
