import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import {
    MapPin,
    Settings,
    TrendingUp,
    X,
    Sparkles,
    Send,
    Zap,
    Trophy,
    Crown,
    Medal,
    Eye,
    MessageCircle,
    Navigation,
    Globe,
    Flame,
    ChevronRight,
    MapPinned,
    User,
    Clock,
    Star,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logout } from '@/routes';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function Dashboard() {
    const [messages, setMessages] = useState<any[]>([]);
    const [leaderboardOpen, setLeaderboardOpen] = useState(false);
    const [placementMode, setPlacementMode] = useState(false);
    const [topMessages, setTopMessages] = useState<any[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [posting, setPosting] = useState(false);
    const [remaining, setRemaining] = useState(2);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        router.flushAll();
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/map/messages');
            setMessages(response.data);
        } catch (err: any) {
            console.error('Failed to fetch messages:', err);
            setMessages([]);
        }
    };

    const fetchTopMessages = async () => {
        try {
            const response = await axios.get('/api/messages/top/today');
            setTopMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch top messages:', err);
            setTopMessages([]);
        }
    };

    const fetchRemaining = async () => {
        try {
            const response = await axios.get('/api/messages/remaining');
            setRemaining(response.data.remaining);
        } catch (err) {
            console.error('Failed to fetch remaining count:', err);
        }
    };

    const handlePopupOpen = async (messageId: number) => {
        try {
            const response = await axios.post(`/api/messages/${messageId}/read`);
            if (response.data.success && response.data.newReadCount) {
                // Update the message's read count in state
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === messageId
                            ? { ...msg, readCount: response.data.newReadCount }
                            : msg
                    )
                );
            }
        } catch (err) {
            console.error('Failed to mark message as read:', err);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchTopMessages();
        fetchRemaining();
    }, []);

    const handleMapRightClick = (lat: number, lng: number) => {
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setPlacementMode(true);
    };

    const handlePostMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!latitude || !longitude || !messageContent.trim()) {
            alert('Please fill in all fields');
            return;
        }

        setPosting(true);

        try {
            await axios.get('/sanctum/csrf-cookie');

            const response = await axios.post('/api/messages', {
                content: messageContent.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            });

            setRemaining(response.data.remaining);
            setMessageContent('');
            setLatitude('');
            setLongitude('');
            setPlacementMode(false);

            await fetchMessages();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to post message');
        } finally {
            setPosting(false);
        }
    };

    // Custom marker icons
    const createMarkerIcon = (isTop: boolean) => {
        const color = isTop ? '#FFFFFF' : '#ADFF00';
        return L.divIcon({
            html: `
                <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                    <div style="
                        position: absolute;
                        width: 32px;
                        height: 32px;
                        background: ${color}20;
                        border-radius: 50%;
                        animation: ripple 2s ease-out infinite;
                    "></div>
                    <div style="
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        background: ${color}40;
                        border-radius: 50%;
                        animation: ripple 2s ease-out infinite 0.5s;
                    "></div>
                    <div style="
                        position: relative;
                        width: 12px;
                        height: 12px;
                        background: ${color};
                        border-radius: 50%;
                        box-shadow: 0 0 20px ${color}, 0 0 40px ${color}80;
                    "></div>
                </div>
            `,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-5 h-5 text-yellow-400" />;
            case 1:
                return <Medal className="w-5 h-5 text-gray-300" />;
            case 2:
                return <Medal className="w-5 h-5 text-amber-600" />;
            default:
                return <span className="text-sm font-bold text-gray-500">#{index + 1}</span>;
        }
    };

    const getRankBg = (index: number) => {
        switch (index) {
            case 0:
                return 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-transparent border-yellow-500/30';
            case 1:
                return 'bg-gradient-to-r from-gray-400/20 via-gray-300/10 to-transparent border-gray-400/30';
            case 2:
                return 'bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent border-amber-500/30';
            default:
                return 'bg-white/5 border-white/10 hover:bg-white/10';
        }
    };

    return (
        <>
            <Head title="Dashboard" />

            {/* Custom fonts */}
            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            {/* Top Navigation */}
            <div className="fixed top-0 left-0 right-0 z-[1000]">
                <div className="bg-black/80 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between px-4 md:px-6 py-3">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#ADFF00] flex items-center justify-center shadow-[0_0_20px_rgba(173,255,0,0.4)]">
                                <MapPin className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-lg font-bold text-white hidden sm:block" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                Map<span className="text-[#ADFF00]">Connect</span>
                            </span>
                        </div>

                        {/* Center Stats */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Messages remaining */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#ADFF00]/10 border border-[#ADFF00]/30">
                                <Zap className="w-4 h-4 text-[#ADFF00]" />
                                <span className="text-sm font-semibold text-[#ADFF00]">
                                    {remaining} left
                                </span>
                            </div>

                            {/* Total messages indicator */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-400">
                                    {messages.length} pins
                                </span>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLeaderboardOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 transition-all group"
                            >
                                <Flame className="w-4 h-4 text-orange-400 group-hover:animate-pulse" />
                                <span className="text-sm font-medium text-orange-400 hidden sm:block">Hot Today</span>
                            </button>

                            {/* User Menu Dropdown */}
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

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-[999]"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        {/* Menu */}
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
                </div>

                {/* Subtle gradient line */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />
            </div>

            {/* Full Screen Map */}
            <div className="fixed inset-0 z-10" style={{ paddingTop: '65px' }}>
                <MapContainer
                    center={[20, 0]}
                    zoom={3}
                    minZoom={3}
                    maxZoom={18}
                    maxBounds={[[-85, -180], [85, 180]]}
                    maxBoundsViscosity={1.0}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    worldCopyJump={true}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    <MapClickHandler onClick={handleMapRightClick} />
                    {messages.map((msg) => (
                        <Marker
                            key={msg.id}
                            position={[msg.latitude, msg.longitude]}
                            icon={createMarkerIcon(msg.isTopMessage)}
                            eventHandlers={{
                                popupopen: () => handlePopupOpen(msg.id)
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="min-w-[280px] max-w-[320px]">
                                    {/* Popup Card */}
                                    <div className="bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                        {/* Header with gradient */}
                                        <div className="relative px-4 pt-4 pb-3">
                                            {msg.isTopMessage && (
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ADFF00] via-yellow-400 to-orange-500" />
                                            )}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ADFF00]/30 to-[#ADFF00]/10 flex items-center justify-center border border-[#ADFF00]/30">
                                                        <User className="w-5 h-5 text-[#ADFF00]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-white text-sm">
                                                            {msg.user?.nickname || 'Anonymous'}
                                                        </h3>
                                                        {msg.user?.bio && (
                                                            <p className="text-xs text-gray-500 line-clamp-1">{msg.user.bio}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {msg.isTopMessage && (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                                                        <Flame className="w-3 h-3 text-orange-400" />
                                                        <span className="text-xs font-semibold text-orange-400">Hot</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Message content */}
                                        <div className="px-4 pb-3">
                                            <p className="text-white text-sm leading-relaxed">{msg.content}</p>
                                        </div>

                                        {/* Footer stats */}
                                        <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-gray-400">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-xs font-medium">{msg.readCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-400">
                                                    <Navigation className="w-4 h-4" />
                                                    <span className="text-xs font-medium">
                                                        {msg.latitude.toFixed(2)}, {msg.longitude.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setPlacementMode(true)}
                className="fixed bottom-6 right-6 z-[1000] group"
            >
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#ADFF00] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    {/* Button */}
                    <div className="relative flex items-center gap-3 px-5 py-4 bg-[#ADFF00] rounded-2xl shadow-lg hover:scale-105 transition-transform">
                        <MapPinned className="w-5 h-5 text-black" />
                        <span className="font-semibold text-black hidden sm:block">Drop Pin</span>
                    </div>
                </div>
            </button>

            {/* Leaderboard Modal */}
            {leaderboardOpen && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setLeaderboardOpen(false)}
                    />

                    {/* Modal */}
                    <div
                        className="relative w-full max-w-lg bg-gray-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-modal-in"
                    >
                        {/* Top gradient accent */}
                        <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />

                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
                                        <Trophy className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                            Today's Leaderboard
                                        </h2>
                                        <p className="text-sm text-gray-500">Most viewed messages</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setLeaderboardOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Leaderboard list */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-2">
                                {topMessages.map((msg, idx) => (
                                    <div
                                        key={msg.id}
                                        className={`p-4 rounded-2xl border transition-all ${getRankBg(idx)}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Rank */}
                                            <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center">
                                                {getRankIcon(idx)}
                                            </div>

                                            {/* User & Message */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-white text-sm">
                                                        {msg.user?.nickname || 'Anonymous'}
                                                    </span>
                                                    {idx === 0 && (
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-1">
                                                    {msg.content}
                                                </p>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30">
                                                <Eye className="w-4 h-4 text-[#ADFF00]" />
                                                <span className="text-sm font-bold text-[#ADFF00]">{msg.readCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {topMessages.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                            <MessageCircle className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <p className="text-gray-400 font-medium">No messages yet today</p>
                                        <p className="text-sm text-gray-600 mt-1">Be the first to drop a pin!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs">Resets daily at midnight</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setLeaderboardOpen(false);
                                        setPlacementMode(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ADFF00]/10 border border-[#ADFF00]/30 text-[#ADFF00] text-sm font-medium hover:bg-[#ADFF00]/20 transition-all"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Join the race
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Placement Modal */}
            {placementMode && (
                <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setPlacementMode(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md bg-gray-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-modal-in">
                        {/* Top gradient accent */}
                        <div className="h-1 bg-gradient-to-r from-[#ADFF00] via-emerald-400 to-cyan-400" />

                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[#ADFF00]/10 flex items-center justify-center border border-[#ADFF00]/30">
                                        <MapPinned className="w-6 h-6 text-[#ADFF00]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                            Drop Your Pin
                                        </h2>
                                        <p className="text-sm text-gray-500">Share with the world</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPlacementMode(false)}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Remaining indicator */}
                        <div className="mx-6 mt-6">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#ADFF00]/5 border border-[#ADFF00]/20">
                                <div className="w-10 h-10 rounded-xl bg-[#ADFF00]/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-[#ADFF00]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {remaining} message{remaining !== 1 ? 's' : ''} remaining
                                    </p>
                                    <p className="text-xs text-gray-500">Resets daily at midnight</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handlePostMessage} className="p-6 space-y-5">
                            {/* Message textarea */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Your Message
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        maxLength={500}
                                        placeholder="What do you want to share with the world?"
                                        className="w-full px-4 py-3 rounded-xl resize-none bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ADFF00]/50 focus:ring-2 focus:ring-[#ADFF00]/20 transition-all"
                                        rows={4}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                                        {messageContent.length}/500
                                    </div>
                                </div>
                            </div>

                            {/* Coordinates */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <Navigation className="w-4 h-4" />
                                    Coordinates
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder="Latitude"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ADFF00]/50 focus:ring-2 focus:ring-[#ADFF00]/20 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder="Longitude"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ADFF00]/50 focus:ring-2 focus:ring-[#ADFF00]/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    💡 Tip: Click anywhere on the map to auto-fill coordinates
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPlacementMode(false)}
                                    className="flex-1 py-3.5 px-6 rounded-xl font-medium bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={posting || !latitude || !longitude || !messageContent.trim() || remaining === 0}
                                    className="flex-1 py-3.5 px-6 rounded-xl font-semibold bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(173,255,0,0.3)]"
                                >
                                    {posting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Drop Pin
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes ripple {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                @keyframes modal-in {
                    from {
                        transform: scale(0.95) translateY(10px);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                .animate-modal-in {
                    animation: modal-in 0.2s ease-out;
                }

                .leaflet-popup-content-wrapper,
                .leaflet-popup-tip {
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                }

                .leaflet-popup-content {
                    margin: 0 !important;
                }

                .leaflet-container {
                    background: #0a0a0a;
                }

                /* Custom scrollbar for modals */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }

                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
}
