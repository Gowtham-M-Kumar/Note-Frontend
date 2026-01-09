'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeSection() {
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 relative overflow-hidden mb-10"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                <svg className="w-40 h-40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                    <span className="w-8 h-[2px] bg-blue-600"></span>
                    Overview
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
                    Welcome back, <span className="text-blue-600">{user?.username || 'Notes User'}</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                    Capture your thoughts, organize your ideas, and keep your history safe. What would you like to record today?
                </p>
            </div>
        </motion.div>
    );
}
