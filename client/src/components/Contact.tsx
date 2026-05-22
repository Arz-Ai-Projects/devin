import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Send, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
                Interested in collaborating or have a project that needs accurate estimation?
                Reach out today for professional engineering consultancy and cost solutions.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <MapPin className="text-navy-600" />, label: 'Location', value: 'Abu Dhabi, UAE' },
                  { icon: <Mail className="text-navy-600" />, label: 'Email', value: 'amna.tv@example.com' },
                  { icon: <Linkedin className="text-navy-600" />, label: 'LinkedIn', value: 'linkedin.com/in/amnatv-945922174' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-12 h-12 bg-navy-50 dark:bg-navy-900/50 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{item.label}</div>
                      <div className="text-slate-900 dark:text-white font-bold">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <a href="#" className="w-12 h-12 bg-navy-800 text-white rounded-full flex items-center justify-center hover:bg-navy-900 transition-colors shadow-lg">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg">
                  <MessageCircle size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-navy-600 text-white rounded-full flex items-center justify-center hover:bg-navy-700 transition-colors shadow-lg">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-navy-900/5 border border-slate-100 dark:border-slate-800"
            >
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-navy-500 dark:text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-navy-500 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-navy-500 dark:text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-navy-500 dark:text-white transition-all resize-none"
                  ></textarea>
                </div>

                <button className="w-full py-5 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-navy-900/20 transition-all group">
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
