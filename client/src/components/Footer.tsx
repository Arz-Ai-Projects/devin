import React from 'react';
import { HardHat, Linkedin, Mail, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 pt-16 pb-8 border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-navy-900 dark:text-white font-bold text-2xl tracking-tight mb-2">
              <HardHat className="text-navy-600 dark:text-blue-400" />
              <span>Amna TV</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Senior Estimation Engineer</p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-navy-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-slate-400 hover:text-green-600 transition-colors">
              <MessageCircle size={24} />
            </a>
            <a href="#" className="text-slate-400 hover:text-navy-600 dark:hover:text-blue-400 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © 2026 Amna TV. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400 dark:text-slate-500">
            <a href="#" className="hover:text-navy-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-navy-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
