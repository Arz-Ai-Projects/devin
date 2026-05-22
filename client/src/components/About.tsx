import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, Award, Users } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'Years Experience', value: '5+', icon: <Briefcase className="text-navy-600" /> },
    { label: 'Tenders Submitted', value: '100+', icon: <Target className="text-navy-600" /> },
    { label: 'Projects Awarded', value: '50+', icon: <Award className="text-navy-600" /> },
    { label: 'UAE Based', value: 'Professional', icon: <Users className="text-navy-600" /> },
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
            <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full mb-8" />
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              "Dedicated estimation professional with extensive experience in construction and partition industries.
              Skilled in preparing detailed cost estimates, analyzing project specifications, evaluating supplier
              quotations, managing tender submissions, and collaborating with project teams to deliver competitive
              and accurate bids."
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-navy-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
