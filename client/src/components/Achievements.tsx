import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileCheck, Award, Wallet } from 'lucide-react';

export const Achievements: React.FC = () => {
  const achievements = [
    { label: 'Years Experience', value: '5+', icon: <Award className="w-8 h-8" /> },
    { label: 'Tender Submissions', value: '100+', icon: <FileCheck className="w-8 h-8" /> },
    { label: 'Awarded Projects', value: '50+', icon: <TrendingUp className="w-8 h-8" /> },
    { label: 'Estimated Value', value: 'AED Millions', icon: <Wallet className="w-8 h-8" /> },
  ];

  return (
    <section className="py-20 bg-navy-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-navy-400 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-blue-400 mb-4 flex justify-center">
                {item.icon}
              </div>
              <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                {item.value}
              </div>
              <div className="text-navy-200 font-medium uppercase tracking-widest text-xs md:text-sm">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
