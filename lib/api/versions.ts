import { api } from '../api';
import type { NoteVersion, Note } from '../types';

export const versionsAPI = {
    getNoteVersions: async (noteId: number): Promise<NoteVersion[]> => {
        const response = await api.get<NoteVersion[]>(`/notes/${noteId}/versions/`);
        return response.data;
    },

    restoreNoteVersion: async (noteId: number, versionId: number): Promise<Note> => {
        const response = await api.post<Note>(`/notes/${noteId}/versions/${versionId}/restore/`);
        return response.data;
    },
};
