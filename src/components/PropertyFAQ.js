"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function PropertyFAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-display text-xl text-ink-950">Frequently Asked Questions</h2>

      <div className="mt-4 flex flex-col gap-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="overflow-hidden rounded-sm border border-ink-800/10 bg-paper-50">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base text-ink-950">{faq.question}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-800/5 text-ink-900">
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-ink-800/10 px-5 py-4">
                  <p className="text-sm leading-relaxed text-ink-800/70">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}