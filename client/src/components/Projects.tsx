import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Tag, Briefcase } from 'lucide-react';

export const Projects: React.FC = () => {
  const projects = [
    {
      title: 'Commercial Office Fit-Out Estimation',
      description: 'Comprehensive cost analysis and BOQ preparation for a high-end corporate office interior project.',
      value: 'AED 1.2 Million',
      scope: 'Full interior fit-out, MEP, and custom partition systems.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Glass Partition System Estimation',
      description: 'Detailed quantity take-off and technical estimation for a specialized acoustic glass partition system.',
      value: 'AED 450,000',
      scope: 'Acoustic glazed partitions and frameless glass doors.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Corporate Headquarters Tender Submission',
      description: 'Management of complex tender documentation and competitive bidding for a regional HQ project.',
      value: 'AED 5.8 Million',
      scope: 'End-to-end tender management and vendor coordination.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Healthcare Interior Project Cost Analysis',
      description: 'Specialized estimation for medical facility partitions adhering to stringent health and safety standards.',
      value: 'AED 2.1 Million',
      scope: 'Hygienic wall systems and specialized healthcare partitions.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Educational Facility Partition Works',
      description: 'Estimation and budgeting for large-scale acoustic partition solutions for a new university wing.',
      value: 'AED 850,000',
      scope: 'Auditorium acoustics and classroom partition walls.',
      image: 'https://images.unsplash.com/photo-1523050353055-f114663f8ec3?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Large Scale Commercial Building Estimation',
      description: 'Master budgeting and commercial analysis for a multi-story commercial development.',
      value: 'AED 12 Million',
      scope: 'Core and shell commercial partitioning and interior works.',
      image: 'https://images.unsplash.com/photo-1428360913996-83f606f4017e?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-navy-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button className="w-full py-2 bg-white text-navy-900 font-bold rounded-lg flex items-center justify-center gap-2">
                    View Details
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1">{project.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag size={16} className="text-navy-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Value:</span>
                    <span className="text-navy-600 dark:text-blue-400">{project.value}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Briefcase size={16} className="text-navy-500 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Scope:</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1">{project.scope}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-navy-50 dark:hover:bg-slate-800 transition-colors">
                  Project Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
