import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle2 } from 'lucide-react';

export const Experience: React.FC = () => {
  const experiences = [
    {
      company: 'Vista Partitions',
      role: 'Senior Estimation Engineer',
      period: 'July 2024 – Present',
      responsibilities: [
        'Lead estimation activities for partition and interior projects.',
        'Prepare detailed cost estimates and commercial proposals.',
        'Coordinate with suppliers and procurement teams.',
        'Analyze project drawings and specifications.',
        'Manage tender submissions and bid documentation.'
      ]
    },
    {
      company: 'Vista Partitions',
      role: 'Estimation Engineer',
      period: 'February 2020 – July 2024',
      responsibilities: [
        'Prepared BOQs and project estimates.',
        'Conducted quantity take-offs from drawings.',
        'Assisted in tender preparation and submission.',
        'Coordinated with project and sales teams.',
        'Evaluated subcontractor and supplier quotations.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Professional Experience</h2>
          <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-12 last:pb-0"
            >
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-navy-600 z-10" />

              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-navy-600 dark:text-blue-400 font-semibold mt-1">
                      <Building2 size={18} />
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-500 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Calendar size={16} />
                    {exp.period}
                  </div>
                </div>

                <ul className="space-y-3">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={18} className="text-navy-500 mt-1 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
