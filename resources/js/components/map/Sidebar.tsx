import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, Settings, TrendingUp, MessageSquarePlus, Award } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface SidebarProps {
    onPlaceMessage: () => void;
    onToggleLeaderboard: () => void;
}

export function Sidebar({ onPlaceMessage, onToggleLeaderboard }: SidebarProps) {
    const { user } = useAuth();

    return (
        <div className="bg-gray-800 text-white h-full flex flex-col border-r border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    MapConnect
                </h1>
                <p className="text-gray-400 text-sm">Discover Messages Nearby</p>
            </div>

            {/* User Profile Section */}
            {user && (
                <div className="p-4 border-b border-gray-700 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{user.name}</p>
                            <p className="text-gray-400 text-sm truncate">
                                @{user.nickname || 'user'}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-700/50 rounded p-2 text-center">
                            <p className="text-sm text-gray-400">Streak</p>
                            <p className="text-lg font-bold text-yellow-400">{user.daily_streak || 0}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded p-2 text-center">
                            <p className="text-sm text-gray-400">Posts</p>
                            <p className="text-lg font-bold text-blue-400">0</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="p-4 space-y-2 flex-1">
                <button
                    onClick={onPlaceMessage}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <MessageSquarePlus size={18} />
                    Post Message
                </button>

                <button
                    onClick={onToggleLeaderboard}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <TrendingUp size={18} />
                    Leaderboard
                </button>

                <Link
                    href={route('profile.edit')}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <Settings size={18} />
                    Settings
                </Link>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <LogOut size={18} />
                    Logout
                </Link>
            </div>
        </div>
    );
}
