"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

interface AccordionProps {
  question: string;
  answer: string;
}

export default function Accordion({ question, answer }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border rounded-3xl transition-all duration-300 cursor-pointer bg-secondaryBG
        ${isOpen ? "border-accent" : "border-none"} w-full`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Question Section */}
      <div className="flex items-center justify-between px-8 py-2 pt-4">
        <h4 className="text-white font-medium text-lg md:text-2xl py-2">
          {question}
        </h4>
        {isOpen ? (
          <FaMinus className="text-accent size-6" />
        ) : (
          <FaPlus className="text-accent size-6" />
        )}
      </div>

      {/* Answer Section */}
      {isOpen && (
        <div className="px-12 py-6 pt-2 text-gray-300 text-sm md:text-xl">
          {answer}
        </div>
      )}
    </div>
  );
}
