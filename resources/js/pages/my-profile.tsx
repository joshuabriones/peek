import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    User,
    MessageCircle,
    Users,
    Eye,
    Navigation,
    Mail,
    Edit,
} from 'lucide-react';

interface UserMessage {
    id: number;
    content: string;
    latitude: number;
    longitude: number;
    read_count: number;
    tag?: string;
    created_at: string;
}

interface FollowStats {
    followers_count: number;
    following_count: number;
}

export default function MyProfile() {
    const page = usePage();
    const auth = (page.props as any)?.auth;
    const user = auth?.user;

    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [stats, setStats] = useState<FollowStats>({
        followers_count: 0,
        following_count: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const fetchData = async () => {
        if (!user?.id) {
            router.visit('/map');
            return;
        }

        setLoading(true);
        try {
            // Fetch follow stats
            const statusResponse = await axios.get(`/api/users/${user.id}/follow-status`);
            setStats(statusResponse.data);

            // Fetch user messages
            try {
                const messagesResponse = await axios.get(`/api/users/me/messages`);
                setMessages(messagesResponse.data);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
            }
        } catch (err) {
            console.error('Failed to fetch profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#ADFF00]/30 border-t-[#ADFF00] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Head title={`${user.nickname || user.name}'s Profile`} />

            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.visit('/map')}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <h1 className="text-xl font-bold text-white">My Profile</h1>
                        </div>
                        <button
                            onClick={() => router.visit('/settings/profile')}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Edit className="w-5 h-5 text-[#ADFF00]" />
                        </button>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />
                </div>

                {/* Profile Section */}
                <div className="max-w-3xl mx-auto pt-24 pb-8 px-4">
                    {/* Profile Card */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 mb-8">
                        {/* Profile Header */}
                        <div className="flex items-start gap-8 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ADFF00]/30 to-[#ADFF00]/10 flex items-center justify-center border border-[#ADFF00]/30 flex-shrink-0">
                                <User className="w-10 h-10 text-[#ADFF00]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-white mb-1">
                                    {user.nickname ? `@${user.nickname}` : user.name}
                                </h2>
                                {user.nickname && (
                                    <p className="text-gray-500 mb-2">{user.name}</p>
                                )}
                                {user.bio && (
                                    <p className="text-gray-300 mb-4 max-w-xl">{user.bio}</p>
                                )}

                                {/* Contact Info */}
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                                    <Mail className="w-4 h-4 text-[#ADFF00]" />
                                    <span>{user.email}</span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-[#ADFF00]">
                                            {messages.length}
                                        </span>
                                        <span className="text-xs text-gray-500">Messages</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-[#ADFF00]">
                                            {stats.followers_count}
                                        </span>
                                        <span className="text-xs text-gray-500">Followers</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-[#ADFF00]">
                                            {stats.following_count}
                                        </span>
                                        <span className="text-xs text-gray-500">Following</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => router.visit(`/followers-following?user_id=${user.id}&tab=followers`)}
                                className="py-2 px-4 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4 text-[#ADFF00]" />
                                Followers
                            </button>
                            <button
                                onClick={() => router.visit(`/followers-following?user_id=${user.id}&tab=following`)}
                                className="py-2 px-4 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4 text-[#ADFF00]" />
                                Following
                            </button>
                        </div>
                    </div>

                    {/* My Pins Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-[#ADFF00]" />
                            My Pins ({messages.length})
                        </h3>

                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No messages yet. Start by dropping a pin on the map!</p>
                                <button
                                    onClick={() => router.visit('/map')}
                                    className="mt-4 px-6 py-2 bg-[#ADFF00] text-black font-semibold rounded-lg hover:bg-[#ADFF00]/90 transition-all"
                                >
                                    Go to Map
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {(() => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);

                                    const todayMessages = messages.filter((msg) => {
                                        const msgDate = new Date(msg.created_at);
                                        msgDate.setHours(0, 0, 0, 0);
                                        return msgDate.getTime() === today.getTime();
                                    });

                                    const previousMessages = messages.filter((msg) => {
                                        const msgDate = new Date(msg.created_at);
                                        msgDate.setHours(0, 0, 0, 0);
                                        return msgDate.getTime() < today.getTime();
                                    });

                                    return (
                                        <>
                                            {todayMessages.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#ADFF00] mb-3 uppercase tracking-wide">
                                                        Today
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {todayMessages.map((msg) => (
                                                            <div
                                                                key={msg.id}
                                                                onClick={() => router.visit(`/map?lat=${msg.latitude}&lng=${msg.longitude}`)}
                                                                className="bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-all group cursor-pointer"
                                                            >
                                                                <p className="text-white mb-3">{msg.content}</p>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <div className="flex items-center gap-4 text-gray-400">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Eye className="w-4 h-4" />
                                                                            <span>{msg.read_count} reads</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Navigation className="w-4 h-4" />
                                                                            <span>
                                                                                {msg.latitude.toFixed(2)}, {msg.longitude.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {msg.tag && (
                                                                        <span className="px-2 py-1 bg-[#ADFF00]/10 text-[#ADFF00] text-xs rounded-full">
                                                                            {msg.tag}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {previousMessages.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#ADFF00] mb-3 uppercase tracking-wide">
                                                        Previous
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {previousMessages.map((msg) => (
                                                            <div
                                                                key={msg.id}
                                                                className="bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-all group"
                                                            >
                                                                <p className="text-white mb-3">{msg.content}</p>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <div className="flex items-center gap-4 text-gray-400">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Eye className="w-4 h-4" />
                                                                            <span>{msg.read_count} reads</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Navigation className="w-4 h-4" />
                                                                            <span>
                                                                                {msg.latitude.toFixed(2)}, {msg.longitude.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {msg.tag && (
                                                                        <span className="px-2 py-1 bg-[#ADFF00]/10 text-[#ADFF00] text-xs rounded-full">
                                                                            {msg.tag}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
