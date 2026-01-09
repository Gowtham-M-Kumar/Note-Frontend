'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface RestoreConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function RestoreConfirm({
    isOpen,
    onClose,
    onConfirm,
}: RestoreConfirmProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-[400px]">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        <RotateCcw className="h-10 w-10 text-blue-500" />
                    </div>
                </div>
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Restore this version?
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-lg mt-2">
                        This will replace the current content of your note with the content from this earlier version.
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium">
                        Don't worry, the current version will be saved to the history before being replaced.
                    </p>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                        variant="ghost"
                        className="flex-1 rounded-2xl h-12 font-bold"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 rounded-2xl h-12 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                        onClick={onConfirm}
                    >
                        Yes, Restore
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
