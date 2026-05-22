import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, Cpu, BrainCircuit } from 'lucide-react';

export const Skills: React.FC = () => {
  const skillGroups = [
    {
      title: 'Core Skills',
      icon: <Calculator className="w-6 h-6" />,
      skills: ['Cost Estimation', 'Quantity Take-Off', 'Tender Submission', 'BOQ Preparation', 'Material Cost Analysis', 'Commercial Evaluation', 'Project Budgeting', 'Vendor Coordination', 'Cost Control', 'Engineering Documentation']
    },
    {
      title: 'Software Skills',
      icon: <Cpu className="w-6 h-6" />,
      skills: ['Microsoft Excel', 'AutoCAD', 'ERP Systems', 'Microsoft Office Suite', 'PDF Measurement Tools', 'Construction Estimation Software']
    },
    {
      title: 'Professional Skills',
      icon: <BrainCircuit className="w-6 h-6" />,
      skills: ['Customer Relationship Management (CRM)', 'Negotiation', 'Team Collaboration', 'Technical Analysis', 'Time Management', 'Problem Solving']
    }
  ];

  return (
    <section id="skills" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Professional Skills</h2>
          <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="w-12 h-12 bg-navy-100 dark:bg-navy-900/50 text-navy-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                {group.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
