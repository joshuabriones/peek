import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, X } from 'lucide-react';
import axios from 'axios';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface LeaderboardPanelProps {
    onClose: () => void;
}

export function LeaderboardPanel({ onClose }: LeaderboardPanelProps) {
    const [topMessages, setTopMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopMessages();
        const interval = setInterval(fetchTopMessages, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchTopMessages = async () => {
        try {
            const response = await axios.get('/api/messages/top/today');
            setTopMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch top messages:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 text-white h-full flex flex-col overflow-hidden border-l border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={24} />
                    <h2 className="text-lg font-bold">Top 10 Today</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                ) : topMessages.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                        No messages yet today
                    </p>
                ) : (
                    topMessages.map((message, index) => (
                        <div
                            key={message.id}
                            className="bg-gray-700/50 hover:bg-gray-700 rounded-lg p-3 cursor-pointer transition border border-gray-600"
                        >
                            {/* Rank */}
                            <div className="flex items-start gap-3 mb-2">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    index === 0
                                        ? 'bg-yellow-500 text-black'
                                        : index === 1
                                        ? 'bg-gray-400 text-black'
                                        : index === 2
                                        ? 'bg-orange-600'
                                        : 'bg-gray-600'
                                }`}>
                                    {index + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                        {message.user?.nickname || message.user?.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {formatDistanceToNow(new Date(message.created_at), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Flame size={14} />
                                    <span className="text-sm font-bold">
                                        {message.readCount}
                                    </span>
                                </div>
                            </div>

                            {/* Message Preview */}
                            <p className="text-sm text-gray-300 line-clamp-2">
                                {message.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 bg-gray-700/50 text-xs text-gray-400 text-center">
                Updates every 30 seconds
            </div>
        </div>
    );
}
