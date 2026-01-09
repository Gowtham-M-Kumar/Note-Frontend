'use client';

import { useState, useEffect } from 'react';
import WelcomeSection from '@/components/home/WelcomeSection';
import RecentNotes from '@/components/home/RecentNotes';
import EmptyState from '@/components/home/EmptyState';
import { notesAPI } from '@/lib/api';
import { Note } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Clock, FileText, LayoutGrid } from 'lucide-react';
import Link from 'next/link';


export default function DashboardHome() {
    const [hasNotes, setHasNotes] = useState<boolean | null>(null);

    useEffect(() => {
        checkNotes();
    }, []);

    const checkNotes = async () => {
        try {
            const allNotes = await notesAPI.list();
            setHasNotes(allNotes.length > 0);
        } catch (error) {
            console.error('Error checking notes', error);
            setHasNotes(false);
        }
    };

    const handleCreateNote = () => {
        window.dispatchEvent(new CustomEvent('open-create-note-modal'));
    };

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
            <WelcomeSection />

            {hasNotes ? (
                <>
                    {/* Quick Actions */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight px-2">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button
                                onClick={handleCreateNote}
                                className="group p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex flex-col items-start gap-4 hover:scale-[1.03] active:scale-95 text-left"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Plus className="h-6 w-6 stroke-[3px]" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Create Note</div>
                                    <div className="text-blue-100 text-xs font-medium">New thought</div>
                                </div>
                            </button>

                            <Link href="/dashboard/notes" className="group p-6 bg-white rounded-[2rem] text-gray-900 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all border border-gray-100 flex flex-col items-start gap-4 hover:scale-[1.03] active:scale-95">
                                <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-50 transition-colors rounded-2xl flex items-center justify-center text-gray-600 group-hover:text-blue-500">
                                    <LayoutGrid className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">All Notes</div>
                                    <div className="text-gray-400 text-xs font-medium italic">Manage vault</div>
                                </div>
                            </Link>
                        </div>
                    </section>

                    <RecentNotes />
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}
