import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useMapStore } from '@/store/mapStore';

interface MessagePlacementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MessagePlacementModal({ isOpen, onClose }: MessagePlacementModalProps) {
    const [content, setContent] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remaining, setRemaining] = useState(2);
    const { addMessage } = useMapStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!latitude || !longitude || !content.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/messages', {
                content: content.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            });

            setRemaining(response.data.remaining);
            addMessage(response.data.message);

            setContent('');
            setLatitude('');
            setLongitude('');
            setError(null);

            setTimeout(() => onClose(), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to post message');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-gray-800 text-white rounded-lg shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Place Your Message</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-700 rounded-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                    {/* Messages Remaining */}
                    <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span>You have <strong>{remaining}</strong> message(s) remaining today</span>
                    </div>

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Your Message
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={500}
                            placeholder="Share something interesting, funny, or inspiring..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                            rows={4}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            {content.length}/500 characters
                        </p>
                    </div>

                    {/* Location Input */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Latitude
                            </label>
                            <input
                                type="number"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="-90 to 90"
                                step="0.00001"
                                min="-90"
                                max="90"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Longitude
                            </label>
                            <input
                                type="number"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="-180 to 180"
                                step="0.00001"
                                min="-180"
                                max="180"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 rounded-lg p-3">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-700 p-4 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !latitude || !longitude || !content.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        <Send size={18} />
                        {loading ? 'Posting...' : 'Post Message'}
                    </button>
                </div>
            </div>
        </div>
    );
}
