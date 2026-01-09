'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { notesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const noteSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    content: z.string().min(1, 'Content is required'),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function CreateNoteModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema),
    });

    useEffect(() => {
        const handleOpenModal = () => {
            setIsOpen(true);
        };

        window.addEventListener('open-create-note-modal', handleOpenModal);
        return () => {
            window.removeEventListener('open-create-note-modal', handleOpenModal);
        };
    }, []);

    const onSubmit = async (data: NoteFormData) => {
        setIsSubmitting(true);
        try {
            await notesAPI.create(data);
            toast.success('Note created successfully');
            setIsOpen(false);
            reset();

            // Refresh the current page to show the new note
            router.refresh();

            // Dispatch an event so other components can update if needed
            window.dispatchEvent(new CustomEvent('note-created'));
        } catch (error) {
            toast.error('Failed to create note');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[420px] rounded-xl p-5 border-none shadow-lg z-[100]">
                <DialogHeader className="mb-3">
                    <DialogTitle className="text-xl font-bold">Quick Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Input
                            id="title"
                            placeholder="Title..."
                            className="h-10 rounded-lg text-sm"
                            {...register('title')}
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Textarea
                            id="content"
                            placeholder="What's on your mind?"
                            rows={4}
                            className="resize-none rounded-lg text-sm p-3"
                            {...register('content')}
                            disabled={isSubmitting}
                        />
                        {errors.content && (
                            <p className="text-xs text-destructive">{errors.content.message}</p>
                        )}
                    </div>
                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Note'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
