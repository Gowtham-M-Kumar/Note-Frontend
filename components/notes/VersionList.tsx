'use client';

import { NoteVersion } from '@/lib/types';
import VersionCard from './VersionCard';
import { History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VersionListProps {
    versions: NoteVersion[];
    onRestore: (versionId: number) => void;
}

export default function VersionList({ versions, onRestore }: VersionListProps) {
    if (versions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 rotate-6 group">
                    <History className="h-10 w-10 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No history yet</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                    Start editing this note and we'll automatically save previous versions for you.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnimatePresence mode="popLayout">
                {versions.map((version, index) => (
                    <VersionCard
                        key={version.id}
                        version={version}
                        isLatest={index === 0}
                        onRestore={onRestore}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
