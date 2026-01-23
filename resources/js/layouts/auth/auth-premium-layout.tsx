import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { home } from '@/routes';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

// Pulsing location pin component
function LocationPin({ x, y, delay, size = 'md' }: { x: number; y: number; delay: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: { outer: 'w-3 h-3', inner: 'w-1.5 h-1.5' },
        md: { outer: 'w-4 h-4', inner: 'w-2 h-2' },
        lg: { outer: 'w-5 h-5', inner: 'w-2.5 h-2.5' },
    };

    return (
        <div
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            {/* Pulse ring */}
            <div
                className={`absolute ${sizes[size].outer} rounded-full bg-[#ADFF00]/40 animate-ping`}
                style={{ animationDelay: `${delay}s`, animationDuration: '2s' }}
            />
            {/* Core dot */}
            <div className={`relative ${sizes[size].inner} rounded-full bg-[#ADFF00] shadow-[0_0_10px_rgba(173,255,0,0.8)]`} />
        </div>
    );
}

export default function AuthPremiumLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    // Location pins positioned to look like they're on land masses
    const locationPins = [
        { x: 25, y: 35, delay: 0, size: 'lg' as const },      // North America
        { x: 18, y: 55, delay: 0.5, size: 'md' as const },    // South America
        { x: 48, y: 32, delay: 1, size: 'md' as const },      // Europe
        { x: 52, y: 45, delay: 1.5, size: 'sm' as const },    // Africa
        { x: 70, y: 38, delay: 0.3, size: 'lg' as const },    // Asia
        { x: 78, y: 55, delay: 0.8, size: 'md' as const },    // Australia
        { x: 35, y: 42, delay: 1.2, size: 'sm' as const },    // Atlantic
        { x: 62, y: 28, delay: 1.8, size: 'sm' as const },    // Russia
        { x: 75, y: 32, delay: 0.6, size: 'sm' as const },    // Japan
        { x: 55, y: 52, delay: 2, size: 'sm' as const },      // Indian Ocean
    ];

    return (
        <div className="min-h-screen flex bg-black overflow-hidden">
            {/* Add custom font */}
            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            {/* Left Side - Map Panel (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
                        alt="Earth from space"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/80" />
                </div>

                {/* Location Pins */}
                <div className="absolute inset-0">
                    {locationPins.map((pin, i) => (
                        <LocationPin key={i} {...pin} />
                    ))}
                </div>

                {/* Logo - Top Left */}
                <div className="absolute top-8 left-8 z-10">
                    <Link href={home()} className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-[#ADFF00] flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-[0_0_20px_rgba(173,255,0,0.5)]">
                            <MapPin className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                            Map<span className="text-[#ADFF00]">Connect</span>
                        </span>
                    </Link>
                </div>

                {/* Subtle tagline - Bottom Left */}
                <div className="absolute bottom-8 left-8 z-10">
                    <p className="text-white/60 text-sm max-w-xs">
                        Connecting explorers across <span className="text-[#ADFF00]">150+ countries</span>
                    </p>
                </div>
            </div>

            {/* Right Side - Form Panel */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col min-h-screen">
                {/* Mobile Header */}
                <div className="lg:hidden p-6 flex items-center justify-center border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <Link href={home()} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ADFF00] flex items-center justify-center shadow-[0_0_20px_rgba(173,255,0,0.4)]">
                            <MapPin className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                            Map<span className="text-[#ADFF00]">Connect</span>
                        </span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
                    {/* Subtle background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#ADFF00]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ADFF00]/3 rounded-full blur-3xl" />

                    <div className="relative z-10 w-full max-w-md">
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ADFF00]/10 border border-[#ADFF00]/30 mb-5">
                                <Sparkles className="w-7 h-7 text-[#ADFF00]" />
                            </div>
                            <h1
                                className="text-2xl sm:text-3xl font-bold text-white mb-2"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                            >
                                {title}
                            </h1>
                            <p className="text-gray-400">{description}</p>
                        </div>

                        {/* Form Content */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-xs">
                                By continuing, you agree to our{' '}
                                <a href="#" className="text-[#ADFF00]/70 hover:text-[#ADFF00] hover:underline">Terms</a>
                                {' '}and{' '}
                                <a href="#" className="text-[#ADFF00]/70 hover:text-[#ADFF00] hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
