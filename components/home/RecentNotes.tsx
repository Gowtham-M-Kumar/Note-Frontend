'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notesAPI } from '@/lib/api';
import { Note } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RecentNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRecentNotes();

        const handleNoteCreated = () => {
            loadRecentNotes();
        };

        window.addEventListener('note-created', handleNoteCreated);
        return () => {
            window.removeEventListener('note-created', handleNoteCreated);
        };
    }, []);

    const loadRecentNotes = async () => {
        try {
            const allNotes = await notesAPI.list();
            // Sort by updated_at descending and take first 6
            const recent = allNotes
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .slice(0, 6);
            setNotes(recent);
        } catch (error) {
            console.error('Failed to load recent notes', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-3xl" />
                ))}
            </div>
        );
    }

    if (notes.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    Recent Activity
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                </h2>
                <Link
                    href="/dashboard/notes"
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors"
                >
                    View all notes
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {notes.map((note, index) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <Link href={`/dashboard/notes/${note.id}`} className="block">
                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all h-full flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                                        {note.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 italic">
                                        "{note.content}"
                                    </p>
                                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-2 mt-auto">
                                        <Clock className="h-3 w-3" />
                                        {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
