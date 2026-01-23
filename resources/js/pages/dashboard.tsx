import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { MessageSquarePlus, LogOut, Settings, TrendingUp, X, Sparkles } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    const [loading, setLoading] = useState(false);
    const [leaderboardOpen, setLeaderboardOpen] = useState(false);
    const [placementMode, setPlacementMode] = useState(false);
    const [topMessages, setTopMessages] = useState<any[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [posting, setPosting] = useState(false);
    const [remaining, setRemaining] = useState(2);

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
        const color = isTop ? '#F5C16C' : '#4DEEEA';
        return L.divIcon({
            html: `
                <div style="position: relative; width: 16px; height: 16px;">
                    <div style="
                        width: 16px;
                        height: 16px;
                        background: ${color};
                        border-radius: 50%;
                        box-shadow: 0 0 20px ${color}, 0 0 40px ${color}50;
                        animation: pulse-glow 2s ease-in-out infinite;
                    "></div>
                </div>
            `,
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    };

    return (
        <>
            <Head title="Dashboard" />

            {/* Top Glass Navigation */}
            <div className="fixed top-0 left-0 right-0 z-[1000] glass" style={{
                background: 'rgba(20, 26, 43, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6" style={{ color: '#4DEEEA' }} />
                        <h1 className="text-xl font-bold" style={{
                            background: 'linear-gradient(135deg, #4DEEEA 0%, #9B8CFF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            MapConnect
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-full" style={{
                            background: 'rgba(77, 238, 234, 0.1)',
                            border: '1px solid rgba(77, 238, 234, 0.3)'
                        }}>
                            <span className="text-sm" style={{ color: '#4DEEEA' }}>
                                ⚡ {remaining} messages left today
                            </span>
                        </div>

                        <button
                            onClick={() => setLeaderboardOpen(!leaderboardOpen)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all"
                            style={{ color: '#A0A6B8' }}
                        >
                            <TrendingUp className="w-5 h-5" />
                        </button>

                        <Link href="/settings/profile" className="p-2 rounded-lg hover:bg-white/10 transition-all" style={{ color: '#A0A6B8' }}>
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Full Screen Map */}
            <div className="fixed inset-0" style={{ paddingTop: '73px' }}>
                <MapContainer
                    center={[20, 0]}
                    zoom={3}
                    minZoom={3}
                    maxZoom={18}
                    maxBounds={[
                        [-85, -180],
                        [85, 180]
                    ]}
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
                                <div className="glass p-4 rounded-2xl" style={{
                                    background: 'rgba(20, 26, 43, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    minWidth: '280px'
                                }}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-white text-base">
                                                {msg.user?.nickname || 'Anonymous'}
                                            </h3>
                                            {msg.user?.bio && (
                                                <p className="text-xs mt-1" style={{ color: '#A0A6B8' }}>{msg.user.bio}</p>
                                            )}
                                        </div>
                                        {msg.isTopMessage && (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{
                                                background: 'rgba(245, 193, 108, 0.2)',
                                                color: '#F5C16C'
                                            }}>
                                                🔥 Top
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white text-sm leading-relaxed mb-3">{msg.content}</p>
                                    <div className="flex items-center gap-2 text-xs" style={{ color: '#A0A6B8' }}>
                                        <span>📖 {msg.readCount} reads</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Leaderboard Slide Panel */}
            {leaderboardOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[1001]"
                        onClick={() => setLeaderboardOpen(false)}
                    />
                    <div
                        className="fixed top-0 right-0 bottom-0 w-96 glass z-[1002] overflow-y-auto"
                        style={{
                            background: 'rgba(20, 26, 43, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                            animation: 'slideInRight 0.3s ease-out'
                        }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold" style={{
                                    background: 'linear-gradient(135deg, #F5C16C 0%, #4DEEEA 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    🔥 Top 10 Today
                                </h2>
                                <button
                                    onClick={() => setLeaderboardOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" style={{ color: '#A0A6B8' }} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {topMessages.map((msg, idx) => (
                                    <div
                                        key={msg.id}
                                        className="p-4 rounded-xl hover:bg-white/5 transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                                                style={{
                                                    background: idx === 0 ? 'linear-gradient(135deg, #F5C16C 0%, #FF9A3C 100%)' :
                                                               idx === 1 ? 'linear-gradient(135deg, #A0A6B8 0%, #7A8299 100%)' :
                                                               idx === 2 ? 'linear-gradient(135deg, #CD7F32 0%, #9B5F24 100%)' :
                                                               'rgba(77, 238, 234, 0.2)',
                                                    color: idx < 3 ? '#0B1220' : '#4DEEEA'
                                                }}
                                            >
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white text-sm mb-1">
                                                    {msg.user?.nickname || 'Anonymous'}
                                                </p>
                                                <p className="text-xs line-clamp-2 mb-2" style={{ color: '#A0A6B8' }}>
                                                    {msg.content}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold" style={{ color: '#F5C16C' }}>
                                                        🔥 {msg.readCount} reads
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {topMessages.length === 0 && (
                                    <div className="text-center py-12" style={{ color: '#A0A6B8' }}>
                                        <p>No messages yet today</p>
                                        <p className="text-sm mt-2">Be the first to post!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Message Placement Modal */}
            {placementMode && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1003] flex items-center justify-center p-4">
                    <div
                        className="glass rounded-3xl w-full max-w-md overflow-hidden"
                        style={{
                            background: 'rgba(20, 26, 43, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            animation: 'scaleIn 0.3s ease-out'
                        }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Drop a Message</h2>
                                <button
                                    onClick={() => setPlacementMode(false)}
                                    className="p-2 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" style={{ color: '#A0A6B8' }} />
                                </button>
                            </div>

                            <div className="mb-6 p-4 rounded-xl shimmer" style={{
                                background: 'rgba(77, 238, 234, 0.1)',
                                border: '1px solid rgba(77, 238, 234, 0.2)'
                            }}>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" style={{ color: '#4DEEEA' }} />
                                    <span className="text-sm font-medium" style={{ color: '#4DEEEA' }}>
                                        You have {remaining} message(s) remaining today
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handlePostMessage} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        maxLength={500}
                                        placeholder="Share something with the world..."
                                        className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'white'
                                        }}
                                        rows={4}
                                    />
                                    <p className="text-xs mt-2" style={{ color: '#A0A6B8' }}>
                                        {messageContent.length}/500 characters
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder="40.7128"
                                            className="w-full px-4 py-2 rounded-xl focus:outline-none"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder="-74.0060"
                                            className="w-full px-4 py-2 rounded-xl focus:outline-none"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setPlacementMode(false)}
                                        className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:bg-white/10"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#A0A6B8'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={posting || !latitude || !longitude || !messageContent.trim()}
                                        className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'linear-gradient(135deg, #4DEEEA 0%, #9B8CFF 100%)',
                                            color: 'white',
                                            boxShadow: '0 4px 20px rgba(77, 238, 234, 0.3)'
                                        }}
                                    >
                                        {posting ? 'Posting...' : 'Drop Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
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
            `}</style>
        </>
    );
}
