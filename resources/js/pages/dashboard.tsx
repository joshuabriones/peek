import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { MessageSquarePlus, LogOut, Settings, TrendingUp, X, Sparkles } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ASCII Art Text Background Component
function AsciiTextBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
    const [time, setTime] = useState(0);

    // Characters to use for the ASCII effect - ordered by visual density
    const chars = ' .:-=+*#%@';

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const charWidth = 8;
                const charHeight = 14;
                const cols = Math.ceil(window.innerWidth / charWidth);
                const rows = Math.ceil(window.innerHeight / charHeight);
                setDimensions({ cols, rows });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(t => t + 0.02);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const asciiGrid = useMemo(() => {
        const { cols, rows } = dimensions;
        if (cols === 0 || rows === 0) return '';

        let result = '';
        const centerX = cols / 2;
        const centerY = rows / 2;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Create flowing wave patterns that emanate from multiple points
                const dx1 = (x - centerX) / cols;
                const dy1 = (y - centerY) / rows;
                const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

                // Second wave center (top-left area)
                const dx2 = (x - cols * 0.2) / cols;
                const dy2 = (y - rows * 0.3) / rows;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                // Third wave center (bottom-right area)
                const dx3 = (x - cols * 0.8) / cols;
                const dy3 = (y - rows * 0.7) / rows;
                const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                // Combine multiple wave patterns
                const wave1 = Math.sin(dist1 * 15 - time * 2) * 0.5 + 0.5;
                const wave2 = Math.sin(dist2 * 12 - time * 1.5 + Math.PI) * 0.3 + 0.3;
                const wave3 = Math.sin(dist3 * 10 - time * 2.5) * 0.2 + 0.2;

                // Add some noise/texture
                const noise = Math.sin(x * 0.5 + time) * Math.cos(y * 0.3 - time * 0.5) * 0.15;

                // Combine all effects
                let value = (wave1 + wave2 + wave3 + noise);

                // Add radial fade from edges
                const edgeFade = 1 - Math.max(
                    Math.abs(x - centerX) / centerX,
                    Math.abs(y - centerY) / centerY
                ) * 0.3;

                value *= edgeFade;

                // Clamp and map to character
                value = Math.max(0, Math.min(1, value));
                const charIndex = Math.floor(value * (chars.length - 1));
                result += chars[charIndex];
            }
            result += '\n';
        }

        return result;
    }, [dimensions, time, chars]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none select-none"
            style={{
                zIndex: 0,
                background: '#000000'
            }}
        >
            <pre
                className="absolute inset-0 m-0 p-0 leading-none"
                style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    lineHeight: '14px',
                    letterSpacing: '0px',
                    color: 'transparent',
                    background: 'linear-gradient(135deg, rgba(173, 255, 0, 0.12) 0%, rgba(173, 255, 0, 0.06) 50%, rgba(173, 255, 0, 0.08) 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    whiteSpace: 'pre',
                    overflow: 'hidden'
                }}
            >
                {asciiGrid}
            </pre>
            {/* Gradient overlays for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 30% 20%, rgba(173, 255, 0, 0.06) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 70% 80%, rgba(173, 255, 0, 0.04) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}
            />
            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
}

// Small ASCII decoration for panels
function AsciiPanelDecoration({ width = 200, height = 100 }: { width?: number; height?: number }) {
    const chars = '░▒▓█▀▄▌▐';
    const [grid, setGrid] = useState('');

    useEffect(() => {
        const charWidth = 6;
        const charHeight = 10;
        const cols = Math.floor(width / charWidth);
        const rows = Math.floor(height / charHeight);

        let result = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Create a flowing pattern
                const wave = Math.sin(x * 0.3 + y * 0.2) * Math.cos(y * 0.4 - x * 0.1);
                const value = (wave + 1) / 2;
                const charIndex = Math.floor(value * (chars.length - 1));
                result += chars[charIndex];
            }
            result += '\n';
        }
        setGrid(result);
    }, [width, height]);

    return (
        <pre
            className="absolute inset-0 m-0 p-0 overflow-hidden pointer-events-none select-none"
            style={{
                fontFamily: 'monospace',
                fontSize: '8px',
                lineHeight: '10px',
                color: 'rgba(173, 255, 0, 0.05)',
                whiteSpace: 'pre'
            }}
        >
            {grid}
        </pre>
    );
}

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
        const color = isTop ? '#FFFFFF' : '#ADFF00';
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

            {/* ASCII Text Background Effect */}
            <AsciiTextBackground />

            {/* Top Glass Navigation */}
            <div className="fixed top-0 left-0 right-0 z-[1000]" style={{
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(173, 255, 0, 0.2)'
            }}>
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6" style={{ color: '#ADFF00' }} />
                        <h1 className="text-xl font-bold" style={{ color: '#ADFF00' }}>
                            MapConnect
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-full" style={{
                            background: 'rgba(173, 255, 0, 0.1)',
                            border: '1px solid rgba(173, 255, 0, 0.3)'
                        }}>
                            <span className="text-sm" style={{ color: '#ADFF00' }}>
                                ⚡ {remaining} messages left today
                            </span>
                        </div>

                        <button
                            onClick={() => setLeaderboardOpen(!leaderboardOpen)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all"
                            style={{ color: '#666666' }}
                        >
                            <TrendingUp className="w-5 h-5" />
                        </button>

                        <Link href="/settings/profile" className="p-2 rounded-lg hover:bg-white/10 transition-all" style={{ color: '#666666' }}>
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Full Screen Map */}
            <div className="fixed inset-0 z-10" style={{ paddingTop: '73px' }}>
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
                                <div className="p-4 rounded-2xl" style={{
                                    background: 'rgba(0, 0, 0, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(173, 255, 0, 0.2)',
                                    minWidth: '280px'
                                }}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-white text-base">
                                                {msg.user?.nickname || 'Anonymous'}
                                            </h3>
                                            {msg.user?.bio && (
                                                <p className="text-xs mt-1" style={{ color: '#666666' }}>{msg.user.bio}</p>
                                            )}
                                        </div>
                                        {msg.isTopMessage && (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{
                                                background: 'rgba(173, 255, 0, 0.2)',
                                                color: '#ADFF00'
                                            }}>
                                                🔥 Top
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white text-sm leading-relaxed mb-3">{msg.content}</p>
                                    <div className="flex items-center gap-2 text-xs" style={{ color: '#666666' }}>
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
                        className="fixed top-0 right-0 bottom-0 w-96 z-[1002] overflow-hidden"
                        style={{
                            background: 'rgba(0, 0, 0, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderLeft: '1px solid rgba(173, 255, 0, 0.2)',
                            animation: 'slideInRight 0.3s ease-out'
                        }}
                    >
                        {/* ASCII Decoration Background */}
                        <AsciiPanelDecoration width={384} height={800} />
                        <div className="relative z-10 p-6 overflow-y-auto h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold" style={{ color: '#ADFF00' }}>
                                    🔥 Top 10 Today
                                </h2>
                                <button
                                    onClick={() => setLeaderboardOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" style={{ color: '#666666' }} />
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
                                                    background: idx === 0 ? '#ADFF00' :
                                                               idx === 1 ? '#FFFFFF' :
                                                               idx === 2 ? '#666666' :
                                                               'rgba(173, 255, 0, 0.2)',
                                                    color: idx < 3 ? '#000000' : '#ADFF00'
                                                }}
                                            >
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white text-sm mb-1">
                                                    {msg.user?.nickname || 'Anonymous'}
                                                </p>
                                                <p className="text-xs line-clamp-2 mb-2" style={{ color: '#666666' }}>
                                                    {msg.content}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold" style={{ color: '#ADFF00' }}>
                                                        🔥 {msg.readCount} reads
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {topMessages.length === 0 && (
                                    <div className="text-center py-12" style={{ color: '#666666' }}>
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
                        className="rounded-3xl w-full max-w-md overflow-hidden relative"
                        style={{
                            background: 'rgba(0, 0, 0, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(173, 255, 0, 0.2)',
                            animation: 'scaleIn 0.3s ease-out'
                        }}
                    >
                        {/* ASCII Decoration Background */}
                        <AsciiPanelDecoration width={450} height={500} />
                        <div className="relative z-10 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Drop a Message</h2>
                                <button
                                    onClick={() => setPlacementMode(false)}
                                    className="p-2 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" style={{ color: '#666666' }} />
                                </button>
                            </div>

                            <div className="mb-6 p-4 rounded-xl" style={{
                                background: 'rgba(173, 255, 0, 0.1)',
                                border: '1px solid rgba(173, 255, 0, 0.2)'
                            }}>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" style={{ color: '#ADFF00' }} />
                                    <span className="text-sm font-medium" style={{ color: '#ADFF00' }}>
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
                                            border: '1px solid rgba(173, 255, 0, 0.2)',
                                            color: 'white'
                                        }}
                                        rows={4}
                                    />
                                    <p className="text-xs mt-2" style={{ color: '#666666' }}>
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
                                                border: '1px solid rgba(173, 255, 0, 0.2)',
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
                                                border: '1px solid rgba(173, 255, 0, 0.2)',
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
                                            color: '#666666'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={posting || !latitude || !longitude || !messageContent.trim()}
                                        className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: '#ADFF00',
                                            color: 'black',
                                            boxShadow: '0 4px 20px rgba(173, 255, 0, 0.3)'
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

                @keyframes pulse-glow {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.1);
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

                /* Make map tiles slightly transparent to show ASCII background */
                .leaflet-tile-pane {
                    opacity: 0.92;
                }
            `}</style>
        </>
    );
}
