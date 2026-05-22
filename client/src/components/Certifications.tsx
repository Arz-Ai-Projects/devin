import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck } from 'lucide-react';

export const Certifications: React.FC = () => {
  const certifications = [
    { title: 'Construction Cost Estimation', issuer: 'Professional Certification' },
    { title: 'Tender Management', issuer: 'Industry Excellence' },
    { title: 'Project Cost Control', issuer: 'Engineering Board' },
    { title: 'Quantity Surveying', issuer: 'Technical Institution' }
  ];

  return (
    <section id="certifications" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Certifications</h2>
          <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-navy-200 dark:hover:border-navy-800 transition-colors"
            >
              <div className="w-14 h-14 bg-navy-50 dark:bg-navy-900/30 text-navy-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{cert.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
