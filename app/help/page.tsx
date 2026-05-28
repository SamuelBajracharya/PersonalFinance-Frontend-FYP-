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
    <div className="w-full flex flex-col md:items-center gap-6 md:gap-10 py-6 px-4 md:px-0">
      <div className="w-full md:w-1/2 flex flex-col items-start gap-4">
        <h1 className="text-xl md:text-3xl font-medium md:font-semibold tracking-wide text-textmain">Got a Question?</h1>

        {/* Big Text Field */}
        <textarea
          placeholder="Your question here..."
          className="w-full h-40 md:h-48 p-4 md:p-6 bg-transparent rounded-2xl md:rounded-3xl border border-primary outline-none text-base md:text-lg text-textmain placeholder-textsecondary"
        />

        {/* Button */}
        <button className="w-full bg-primary font-semibold px-10 py-3 rounded-full text-base md:text-lg shadow-md hover:bg-primary/80 transition text-textmain">
          Submit
        </button>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-start gap-4 mt-4 md:mt-0">
        {/* Heading */}
        <h2 className="text-textmain text-lg md:text-3xl font-medium md:font-semibold tracking-wide">
          Frequently Asked Questions
        </h2>

        {/* Accordions */}
        <div className="flex flex-col w-full gap-4 md:gap-6 mt-2">
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
