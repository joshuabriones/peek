import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Users, User, MessageCircle } from 'lucide-react';

interface Follower {
    id: number;
    name: string;
    nickname: string;
    bio: string;
    is_mutual: boolean;
}

export default function FollowersFollowing() {
    const page = usePage();
    const auth = (page.props as any)?.auth;
    const params = new URLSearchParams(window.location.search);
    const userIdParam = params.get('user_id');
    const userId = userIdParam === 'me' ? (auth?.user?.id ?? null) : userIdParam;
    const tab = params.get('tab') || 'followers';

    const [followers, setFollowers] = useState<Follower[]>([]);
    const [following, setFollowing] = useState<Follower[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetchData();
    }, [userId, tab]);

    const fetchData = async () => {
        if (!userId) {
            router.visit('/map');
            return;
        }

        setLoading(true);
        try {
            if (tab === 'followers') {
                const response = await axios.get(`/api/users/${userId}/followers`);
                setFollowers(response.data);
            } else {
                const response = await axios.get(`/api/users/${userId}/following`);
                setFollowing(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch followers/following:', err);
        } finally {
            setLoading(false);
        }
    };

    const items = tab === 'followers' ? followers : following;

    const handleViewProfile = (userId: number) => {
        router.visit(`/profile?user_id=${userId}`);
    };

    return (
        <>
            <Head title={tab === 'followers' ? 'Followers' : 'Following'} />

            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.visit('/my-profile')}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    {tab === 'followers' ? 'Followers' : 'Following'}
                                </h1>
                                <p className="text-sm text-gray-400">{items.length} {tab === 'followers' ? 'followers' : 'following'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="max-w-2xl mx-auto pt-24 pb-8 px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-2 border-[#ADFF00]/30 border-t-[#ADFF00] rounded-full animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No {tab} yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ADFF00]/30 to-[#ADFF00]/10 flex items-center justify-center border border-[#ADFF00]/30 flex-shrink-0">
                                                <User className="w-6 h-6 text-[#ADFF00]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-white truncate">
                                                    {item.nickname ? `@${item.nickname}` : item.name}
                                                </h3>
                                                {item.nickname && (
                                                    <p className="text-sm text-gray-500 truncate">{item.name}</p>
                                                )}
                                                {item.bio && (
                                                    <p className="text-sm text-gray-400 line-clamp-1">{item.bio}</p>
                                                )}
                                                {item.is_mutual && (
                                                    <p className="text-xs text-[#ADFF00] font-medium">Mutual follow</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewProfile(item.id)}
                                            className="ml-4 flex-shrink-0 px-4 py-2 bg-[#ADFF00] text-black font-semibold rounded-lg hover:bg-[#ADFF00]/90 transition-all"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
