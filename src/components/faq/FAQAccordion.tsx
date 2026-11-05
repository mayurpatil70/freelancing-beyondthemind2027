'use client';

import React, { useState } from 'react';
import { FAQItem } from '@/types';
import { ChevronDown, Search, HelpCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([faqs[0]?.id || 'faq-1']);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions on retreat dates, accommodation, meditation..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-emerald-950/70 border border-gold-500/25 text-ivory-100 placeholder-stone-subtle/50 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 font-medium',
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold shadow-gold-sm'
                  : 'bg-emerald-900/40 text-ivory-200/80 hover:text-gold-300 hover:bg-emerald-800/40 border border-gold-500/15'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Items */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-emerald-950/40 border border-gold-500/15">
            <HelpCircle className="w-8 h-8 text-gold-400/60 mx-auto mb-2" />
            <h4 className="font-serif text-lg text-ivory-100 font-medium">No matching questions found</h4>
            <p className="text-xs text-stone-subtle/80 mt-1 max-w-md mx-auto">
              Our retreat team is always here to assist with personalized details.
            </p>
            <a
              href="https://wa.me/918075572018?text=Namaste%20Beyond%20the%20Mind%20Team%2C%20I%20have%20a%20question%20regarding%20the%20retreat."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/50 text-xs tracking-wider uppercase font-medium hover:bg-gold-500 hover:text-emerald-950 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Retreat Concierge on WhatsApp</span>
            </a>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className={cn(
                  'rounded-2xl transition-all duration-300 border overflow-hidden',
                  isOpen
                    ? 'bg-[#07261F]/80 border-gold-400/40 shadow-md'
                    : 'bg-emerald-950/50 border-gold-500/15 hover:border-gold-500/30'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg text-ivory-100 font-medium leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      'p-1.5 rounded-full border border-gold-500/30 text-gold-400 transition-transform duration-300 shrink-0',
                      isOpen ? 'rotate-180 bg-gold-500/20 text-gold-300' : 'rotate-0 bg-emerald-900/40'
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-subtle/90 font-light leading-relaxed border-t border-emerald-900/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

