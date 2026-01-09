'use client';

import { NoteVersion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VersionCardProps {
    version: NoteVersion;
    isLatest: boolean;
    onRestore: (versionId: number) => void;
}

export default function VersionCard({ version, isLatest, onRestore }: VersionCardProps) {
    const formattedDate = new Date(version.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="w-full"
        >
            <Card className={`overflow-hidden border-2 transition-all ${isLatest ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100'}`}>
                <CardHeader className="pb-3 border-b border-gray-100/50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                            <Clock className="h-4 w-4" />
                            {formattedDate}
                        </div>
                        {isLatest && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                <CheckCircle2 className="h-3 w-3" />
                                Current Version
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-5">
                    <div className="bg-white/50 rounded-xl p-4 border border-gray-100 shadow-sm max-h-48 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                            {version.content}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t border-gray-100/50 justify-end py-3 px-6">
                    {!isLatest && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestore(version.id)}
                            className="rounded-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Restore this version
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
