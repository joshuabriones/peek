import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    MapPin,
    ArrowLeft,
    Eye,
    Clock,
    MessageSquare,
    Navigation,
    Sparkles,
    ChevronRight,
    LogOut,
    User,
    ChevronDown,
    Settings
} from 'lucide-react';
import { logout } from '@/routes';

interface Message {
    id: number;
    content: string;
    latitude: number;
    longitude: number;
    readCount: number;
    createdAt: string;
    createdAtFull: string;
}

export default function MyMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.flushAll();
    };

    const fetchMyMessages = async () => {
        try {
            const response = await axios.get('/api/messages/my/today');
            setMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyMessages();
    }, []);

    const handleMessageClick = (message: Message) => {
        // Navigate to dashboard with coordinates to center on
        router.visit(`/map?lat=${message.latitude}&lng=${message.longitude}&zoom=15&messageId=${message.id}`);
    };

    return (
        <>
            <Head title="My Messages" />

            {/* Custom fonts */}
            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-black">
                {/* Top Navigation */}
                <div className="fixed top-0 left-0 right-0 z-[1000]">
                    <div className="bg-black/80 backdrop-blur-xl border-b border-white/10">
                        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
                            {/* Left: Back + Logo */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/map"
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                >
                                    <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors hidden sm:block">Map</span>
                                </Link>
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#ADFF00] flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-black" />
                                    </div>
                                    <span className="text-base font-bold text-white hidden sm:block" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                        My Messages
                                    </span>
                                </div>
                            </div>

                            {/* Right: User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    <div className="w-6 h-6 rounded-full bg-[#ADFF00]/20 flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-[#ADFF00]" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[999]"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-gray-950 border border-white/10 shadow-xl z-[1001] overflow-hidden">
                                            <div className="py-1">
                                                <Link
                                                    href="/settings/profile"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </Link>
                                                <div className="h-px bg-white/10 mx-3 my-1" />
                                                <Link
                                                    href={logout()}
                                                    as="button"
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Log out
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Subtle gradient line */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />
                </div>

                {/* Content Area */}
                <div className="pt-[80px] pb-8 px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-[#ADFF00]/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-[#ADFF00]" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                        Today's Messages
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {messages.length} message{messages.length !== 1 ? 's' : ''} dropped today
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-2 border-[#ADFF00]/20 border-t-[#ADFF00] rounded-full animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-gray-950/50 p-8 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
                                <p className="text-gray-500 mb-6">You haven't dropped any pins today. Go explore the map!</p>
                                <Link
                                    href="/map"
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#ADFF00] text-black font-semibold rounded-xl hover:bg-[#ADFF00]/90 transition-all"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Open Map
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((message) => (
                                    <button
                                        key={message.id}
                                        onClick={() => handleMessageClick(message)}
                                        className="w-full text-left rounded-2xl border border-white/10 bg-gray-950/50 hover:bg-gray-900/50 hover:border-[#ADFF00]/30 p-5 transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Message content */}
                                                <p className="text-white text-sm leading-relaxed mb-3 line-clamp-2">
                                                    {message.content}
                                                </p>

                                                {/* Meta info */}
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{message.createdAt}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>{message.readCount} view{message.readCount !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Navigation className="w-3.5 h-3.5" />
                                                        <span>{message.latitude.toFixed(2)}, {message.longitude.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arrow indicator */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="w-10 h-10 rounded-xl bg-[#ADFF00]/10 flex items-center justify-center group-hover:bg-[#ADFF00]/20 transition-colors">
                                                    <ChevronRight className="w-5 h-5 text-[#ADFF00] group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Info note */}
                        {messages.length > 0 && (
                            <div className="mt-6 p-4 rounded-xl bg-[#ADFF00]/5 border border-[#ADFF00]/20">
                                <p className="text-sm text-gray-400">
                                    <span className="text-[#ADFF00] font-medium">Tip:</span> Click on any message to view it on the map.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
