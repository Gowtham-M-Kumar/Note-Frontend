'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { versionsAPI } from '@/lib/api/versions';
import { notesAPI } from '@/lib/api';
import type { NoteVersion, Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import VersionList from '@/components/notes/VersionList';
import RestoreConfirm from '@/components/notes/RestoreConfirm';
import { ArrowLeft, Clock, History } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VersionsPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = parseInt(params.id as string);

  const [versions, setVersions] = useState<NoteVersion[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null);

  useEffect(() => {
    if (noteId) {
      loadData();
    }
  }, [noteId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [versionsData, noteData] = await Promise.all([
        versionsAPI.getNoteVersions(noteId),
        notesAPI.get(noteId),
      ]);
      setVersions(versionsData);
      setNote(noteData);
    } catch (error) {
      toast.error('Failed to load version history');
      console.error(error);
      router.push('/dashboard/notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreClick = (versionId: number) => {
    setVersionToRestore(versionId);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    if (versionToRestore === null) return;

    try {
      await versionsAPI.restoreNoteVersion(noteId, versionToRestore);
      toast.success('Version restored successfully!');
      router.push('/dashboard/notes');
    } catch (error) {
      toast.error('Failed to restore version');
    } finally {
      setRestoreDialogOpen(false);
      setVersionToRestore(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8 mt-10">
        <Skeleton className="h-10 w-48 rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="space-y-6 pt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-3xl shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-8 md:p-12 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-10 mt-6 overflow-visible">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" className="rounded-full pl-2 pr-6 h-12 text-gray-500 hover:text-blue-600 hover:bg-white shadow-sm transition-all group" asChild>
              <Link href="/dashboard/notes">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                Back to my notes
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <History className="h-40 w-40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-blue-600"></span>
                Historical Snapshots
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-2">
                Version History
              </h1>
              {note && (
                <div className="flex items-center text-gray-400 font-medium">
                  <span className="text-gray-900 border-b-2 border-blue-500/20">{note.title}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Versions List Wrapper */}
        <div className="pt-4">
          <VersionList
            versions={versions}
            onRestore={handleRestoreClick}
          />
        </div>

        {/* Footer Info */}
        <div className="py-10 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Every update you make creates a new snapshot. History is kept forever.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <RestoreConfirm
        isOpen={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
      />
    </div>
  );
}
