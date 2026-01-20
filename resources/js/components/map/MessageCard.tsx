import React from 'react';
import { Message } from '@/types';
import { MessageCircle, Eye, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MessageCardProps {
    message: Message;
    onUnlock?: () => void;
}

export function MessageCard({ message, onUnlock }: MessageCardProps) {
    return (
        <div className="bg-gray-800 text-white rounded-lg p-4 min-w-xs max-w-sm shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {message.isTopMessage && <Star size={18} className="text-yellow-500" />}
                        {message.user?.nickname || message.user?.name || 'Anonymous'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                </div>
                {message.userHasRead && (
                    <Eye size={16} className="text-blue-400 flex-shrink-0" />
                )}
            </div>

            {/* Bio Preview */}
            {message.user?.bio && (
                <p className="text-gray-300 text-sm mb-3 italic border-l-2 border-blue-500 pl-2">
                    "{message.user.bio}"
                </p>
            )}

            {/* Message Content */}
            <p className="text-gray-100 mb-4 leading-relaxed">{message.content}</p>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-700 pt-3">
                <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{message.readCount} reads</span>
                </div>

                {message.isTopMessage && (
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                        🔥 Top Message
                    </span>
                )}
            </div>
        </div>
    );
}
