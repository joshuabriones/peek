import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    User,
    MessageCircle,
    Heart,
    Lock,
    Users,
    MapPin,
    Eye,
    Navigation,
    Flame,
} from 'lucide-react';

interface UserProfile {
    id: number;
    name: string;
    nickname: string;
    bio: string;
}

interface UserMessage {
    id: number;
    content: string;
    latitude: number;
    longitude: number;
    read_count: number;
    tag?: string;
    created_at: string;
}

interface FollowStatus {
    is_following: boolean;
    is_followed_by: boolean;
    is_mutual: boolean;
    followers_count: number;
    following_count: number;
}

interface PageProps {
    auth?: {
        user?: {
            id: number;
        };
    };
}

export default function ProfileView() {
    const page = usePage();
    const auth = (page.props as any)?.auth;
    const params = new URLSearchParams(window.location.search);
    const userIdParam = params.get('user_id');
    const viewingUserId = userIdParam === 'me' ? (auth?.user?.id ?? null) : userIdParam;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMutual, setIsMutual] = useState(false);

    useEffect(() => {
        fetchData();
    }, [viewingUserId]);

    const fetchData = async () => {
        if (!viewingUserId) {
            router.visit('/map');
            return;
        }

        setLoading(true);
        try {
            // Fetch user profile
            const profileResponse = await axios.get(`/api/users/${viewingUserId}`);
            setProfile(profileResponse.data);

            // Fetch follow status
            const statusResponse = await axios.get(`/api/users/${viewingUserId}/follow-status`);
            setFollowStatus(statusResponse.data);
            setIsMutual(statusResponse.data.is_mutual);

            // If mutual follow, fetch their messages
            if (statusResponse.data.is_mutual) {
                try {
                    const messagesResponse = await axios.get(`/api/users/${viewingUserId}/messages`);
                    setMessages(messagesResponse.data);
                } catch (err) {
                    console.error('Failed to fetch user messages:', err);
                }
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowClick = async () => {
        if (!viewingUserId || !followStatus) return;

        try {
            const isCurrentlyFollowing = followStatus.is_following;
            const endpoint = isCurrentlyFollowing
                ? `/api/users/${viewingUserId}/unfollow`
                : `/api/users/${viewingUserId}/follow`;

            const response = await axios.post(endpoint);

            setFollowStatus({
                ...followStatus,
                is_following: response.data.is_following,
                is_mutual: response.data.is_mutual,
            });
            setIsMutual(response.data.is_mutual);

            // Refetch messages if mutual status changed
            if (response.data.is_mutual && messages.length === 0) {
                const messagesResponse = await axios.get(`/api/users/${viewingUserId}/messages`);
                setMessages(messagesResponse.data);
            }
        } catch (err: any) {
            console.error('Failed to update follow status:', err);
            alert(err.response?.data?.message || 'Failed to update follow status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#ADFF00]/30 border-t-[#ADFF00] rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Profile not found</p>
            </div>
        );
    }

    return (
        <>
            <Head title={`${profile.nickname || profile.name}'s Profile`} />

            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                        <button
                            onClick={() => router.visit('/map')}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <h1 className="text-xl font-bold text-white">
                            {profile.nickname ? `@${profile.nickname}` : profile.name}
                        </h1>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />
                </div>

                {/* Profile Section */}
                <div className="max-w-2xl mx-auto pt-24 pb-8 px-4">
                    {/* Profile Card */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                        {/* Profile Header */}
                        <div className="flex items-start gap-6 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ADFF00]/30 to-[#ADFF00]/10 flex items-center justify-center border border-[#ADFF00]/30 flex-shrink-0">
                                <User className="w-8 h-8 text-[#ADFF00]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {profile.nickname ? `@${profile.nickname}` : profile.name}
                                </h2>
                                {profile.nickname && (
                                    <p className="text-gray-500 mb-2">{profile.name}</p>
                                )}
                                {profile.bio && (
                                    <p className="text-gray-400 mb-3">{profile.bio}</p>
                                )}

                                {/* Stats */}
                                <div className="flex gap-6 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[#ADFF00] font-bold">
                                            {followStatus?.followers_count || 0}
                                        </span>
                                        <span className="text-xs text-gray-500">Followers</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#ADFF00] font-bold">
                                            {followStatus?.following_count || 0}
                                        </span>
                                        <span className="text-xs text-gray-500">Following</span>
                                    </div>
                                </div>

                                {/* Follow Button */}
                                <button
                                    onClick={handleFollowClick}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                                        followStatus?.is_following
                                            ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                            : 'bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90'
                                    }`}
                                >
                                    {followStatus?.is_following ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        </div>

                        {/* Mutual Follow Status */}
                        {isMutual && (
                            <div className="bg-[#ADFF00]/10 border border-[#ADFF00]/30 rounded-lg px-4 py-3 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-[#ADFF00]" />
                                <span className="text-sm text-[#ADFF00] font-medium">You follow each other!</span>
                            </div>
                        )}
                    </div>

                    {/* Messages Section */}
                    {isMutual ? (
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-[#ADFF00]" />
                                Messages ({messages.length})
                            </h3>

                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">No messages yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className="bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-all group"
                                        >
                                            <p className="text-white mb-3">{msg.content}</p>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-4 h-4" />
                                                        <span>{msg.read_count}</span>
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
                            )}
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-2xl p-8 text-center">
                            <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-2">This profile is private</p>
                            <p className="text-sm text-gray-500">
                                {followStatus?.is_followed_by
                                    ? 'Follow this user to see their messages'
                                    : 'You need to follow each other to view their messages'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
