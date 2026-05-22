import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-900/5 dark:bg-blue-500/5 skew-x-12 transform translate-x-20 z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-900/50 text-navy-700 dark:text-blue-300 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-navy-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-navy-600"></span>
              </span>
              Available for new opportunities in Abu Dhabi
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              Amna TV
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-navy-600 dark:text-blue-400 mb-6">
              Senior Estimation Engineer
            </h2>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-8">
              <MapPin size={20} className="text-navy-500" />
              <span className="text-lg">Abu Dhabi, United Arab Emirates</span>
            </div>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-xl">
              "Experienced Estimation Engineer with over 5 years of expertise in quantity take-offs,
              tender preparation, cost estimation, project budgeting, and commercial analysis.
              Specialized in partition systems and delivering accurate cost solutions."
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-navy-800 hover:bg-navy-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-navy-900/20 transition-all"
              >
                <Download size={20} />
                Download CV
              </motion.button>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-navy-100 dark:border-slate-700 text-navy-900 dark:text-white rounded-xl font-bold flex items-center gap-2 hover:bg-navy-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <Mail size={20} />
                Contact Me
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 aspect-[4/5] max-w-md mx-auto">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                alt="Amna TV - Senior Estimation Engineer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Engineering elements decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-navy-600 rounded-2xl -z-0 opacity-20" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-navy-600 rounded-2xl -z-0 opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
