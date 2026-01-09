'use client';

import { motion } from 'framer-motion';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyState() {
    const handleCreateNote = () => {
        window.dispatchEvent(new CustomEvent('open-create-note-modal'));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[3rem] shadow-xl border border-gray-50"
        >
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-inner">
                <FileText className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your vault is empty</h2>
            <p className="text-gray-500 max-w-sm mb-10 text-lg font-medium leading-relaxed">
                Capture your first thought, a quick task, or a deep insight. It only takes a second.
            </p>
            <Button
                onClick={handleCreateNote}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 h-16 text-xl font-bold shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
                <Plus className="h-6 w-6 stroke-[3px]" />
                Create your first note
            </Button>
        </motion.div>
    );
}
