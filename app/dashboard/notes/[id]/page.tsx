'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notesAPI } from '@/lib/api';
import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, History } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState<Note | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      const data = await notesAPI.get(noteId);
      setNote(data);
      reset({
        title: data.title,
        content: data.content,
      });
    } catch (error) {
      toast.error('Failed to load note');
      router.push('/dashboard/notes');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      await notesAPI.update(noteId, data);
      toast.success('Note updated successfully');
      router.push('/dashboard/notes');
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Link>
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-2xl overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Edit Note</CardTitle>
            <Button variant="outline" className="rounded-full gap-2 font-bold text-blue-600 border-blue-100 hover:bg-blue-50 transition-all shadow-sm" asChild>
              <Link href={`/dashboard/notes/${noteId}/versions`}>
                <History className="h-4 w-4" />
                View History
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Title</Label>
              <Input
                id="title"
                placeholder="Enter note title"
                className="h-14 rounded-2xl text-lg font-semibold border-gray-100 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                {...register('title')}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-destructive font-medium ml-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="content" className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter note content"
                rows={12}
                className="rounded-2xl text-lg border-gray-100 focus:ring-blue-500/10 focus:border-blue-500 transition-all p-6 resize-none"
                {...register('content')}
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="text-sm text-destructive font-medium ml-1">{errors.content.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving Changes...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Save Changes
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="h-14 rounded-2xl px-10 font-bold text-gray-500"
                onClick={() => router.push('/dashboard/notes')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
