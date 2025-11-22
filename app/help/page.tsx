"use client";

import Accordion from "@/components/gloabalComponents/FaqBox";
import React from "react";

export default function FAQSection() {
  const faqData = [
    {
      question: "What is your refund policy?",
      answer:
        "We provide a full refund within 30 days of purchase, no questions asked.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery usually takes 3–5 business days depending on your location.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes, we offer 24/7 customer support through email and live chat.",
    },
    {
      question: "Can I change or cancel my order?",
      answer:
        "Yes, you can modify or cancel your order within 12 hours of placing it by contacting our support team.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to most countries worldwide. Shipping times and fees may vary depending on your region.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-10 py-6">
      <h1 className="text-3xl font-semibold tracking-wide">Got a Question?</h1>

      {/* Big Text Field */}
      <textarea
        placeholder="Type your question here..."
        className="w-1/2 h-48 p-6 rounded-3xl border-2 border-primary outline-none text-lg"
      />

      {/* Button */}
      <button className="w-1/2  bg-primary font-semibold px-10 py-3 rounded-full text-lg shadow-md hover:bg-primary/80 transition">
        Submit
      </button>

      {/* Heading */}
      <h2 className="text-white text-3xl font-semibold mt-6 tracking-wides">
        Frequently Asked Questions
      </h2>

      {/* Accordions */}
      <div className="flex flex-col w-1/2 gap-6 mt-4">
        {faqData.map((item, index) => (
          <Accordion
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
