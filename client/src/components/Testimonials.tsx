import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Michael Chen',
      role: 'Project Manager',
      content: 'Amna consistently delivers highly accurate estimates and supports project success through detailed cost analysis.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'Sarah Johnson',
      role: 'Commercial Director',
      content: 'Her attention to detail in BOQ preparation and tender submission is exceptional. A true professional in estimation.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'Ahmed Al-Maktoum',
      role: 'Operations Head',
      content: 'Reliable, accurate, and deeply knowledgeable about partition systems. Amna has been instrumental in our successful bids.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Client Feedback</h2>
          <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative"
            >
              <Quote className="absolute top-6 right-8 text-navy-200 dark:text-navy-800" size={40} />

              <p className="text-slate-600 dark:text-slate-400 mb-8 italic relative z-10 leading-relaxed">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-navy-600 dark:text-blue-400 font-semibold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
