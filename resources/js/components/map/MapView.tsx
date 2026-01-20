import React, { useState, useEffect } from 'react';
import { Message } from '@/types';
import { MessageCard } from './MessageCard';
import { useMapStore } from '@/store/mapStore';
import axios from 'axios';

interface MapViewProps {
    onMessageClick?: (message: Message) => void;
}

export function MapView({ onMessageClick }: MapViewProps) {
    const { messages, setMessages, setSelectedMessage } = useMapStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/map/messages');
            setMessages(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMessageClick = async (message: Message) => {
        setSelectedMessage(message);
        onMessageClick?.(message);

        try {
            await axios.post(`/api/messages/${message.id}/read`);
        } catch (err) {
            console.error('Failed to record message read:', err);
        }
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-900 relative overflow-auto">
            <div className="p-4">
                <h1 className="text-white text-3xl font-bold mb-4">Discover Messages</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-600/20 border border-red-600 text-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-400 text-center">
                            No messages available yet. Be the first to post one!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                onClick={() => handleMessageClick(message)}
                                className="cursor-pointer transform hover:scale-105 transition-transform"
                            >
                                <MessageCard message={message} />
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={fetchMessages}
                    className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg"
                >
                    🔄
                </button>
            </div>
        </div>
    );
}
