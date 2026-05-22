import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Education</h2>
          <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-navy-600/5 rounded-full -translate-y-16 translate-x-16" />

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-700 shrink-0">
                <GraduationCap size={40} className="text-navy-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Civil Engineering</h3>
                <p className="text-xl text-navy-600 dark:text-blue-400 font-semibold mb-6">Calicut University, Thenhipalem, Malappuram</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Calendar size={18} />
                    <span className="font-medium">2016 – 2019</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={18} />
                    <span className="font-medium">Kerala, India</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
