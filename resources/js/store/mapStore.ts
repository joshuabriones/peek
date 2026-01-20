import { create } from 'zustand';
import { Message } from '@/types';

interface MapStore {
    messages: Message[];
    selectedMessage: Message | null;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setSelectedMessage: (message: Message | null) => void;
    updateMessageReadCount: (messageId: number, count: number) => void;
}

export const useMapStore = create<MapStore>((set) => ({
    messages: [],
    selectedMessage: null,

    setMessages: (messages) => set({ messages }),

    addMessage: (message) =>
        set((state) => ({
            messages: [message, ...state.messages],
        })),

    setSelectedMessage: (message) => set({ selectedMessage: message }),

    updateMessageReadCount: (messageId, count) =>
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, readCount: count } : msg
            ),
        })),
}));
