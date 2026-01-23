import { Head, Link, usePage } from '@inertiajs/react';
import { map, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { MapPin, Globe2, MessageSquare, Users, Sparkles, TrendingUp, Lock, Zap, ArrowRight, ChevronRight, Star, Send, Eye, MapPinned, Compass, Navigation, Radio, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';

// Scroll Animation Hook
function useScrollAnimation(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold, rootMargin: '50px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
}

// Animated Section Wrapper
function AnimatedSection({
    children,
    className = '',
    animation = 'fade-up',
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'blur-in';
    delay?: number;
}) {
    const { ref, isVisible } = useScrollAnimation(0.1);

    const animations = {
        'fade-up': 'translate-y-10 opacity-0',
        'fade-down': '-translate-y-10 opacity-0',
        'fade-left': 'translate-x-10 opacity-0',
        'fade-right': '-translate-x-10 opacity-0',
        'zoom-in': 'scale-95 opacity-0',
        'blur-in': 'opacity-0 blur-sm',
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${className} ${
                isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100 blur-0' : animations[animation]
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Floating Particle
function FloatingParticle({ delay = 0, size = 4 }: { delay?: number; size?: number }) {
    return (
        <div
            className="absolute rounded-full bg-[#ADFF00] opacity-20 animate-float-particle"
            style={{
                width: size,
                height: size,
                animationDelay: `${delay}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }}
        />
    );
}

// Glowing Orb Component
function GlowingOrb({ className, color = '#ADFF00', size = 300 }: { className?: string; color?: string; size?: number }) {
    return (
        <div
            className={`absolute rounded-full blur-[100px] animate-pulse-slow ${className}`}
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
            }}
        />
    );
}

// Grid Background
function GridBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Animated grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(173, 255, 0, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(173, 255, 0, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
                }}
            />
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ADFF00]/5 to-transparent h-[200%] animate-scan-line" />
        </div>
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="MapConnect - Drop Messages Across The Globe">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link rel="preconnect" href="https://api.fontshare.com" />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800,900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Base Background */}
            <div className="fixed inset-0 bg-black" />

            {/* Grid Background */}
            <GridBackground />

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.5} size={Math.random() * 4 + 2} />
                ))}
            </div>

            {/* Glowing Orbs */}
            <GlowingOrb className="top-[-10%] left-[-5%]" size={500} />
            <GlowingOrb className="top-[40%] right-[-10%]" size={400} color="#ADFF00" />
            <GlowingOrb className="bottom-[10%] left-[20%]" size={300} color="#88CC00" />

            {/* Content */}
            <div className="relative z-10 min-h-screen overflow-y-auto" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50">
                    {/* Backdrop blur for nav */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16 sm:h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ADFF00] flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-[0_0_30px_rgba(173,255,0,0.5)]">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                                </div>
                                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                    Map<span className="text-[#ADFF00]">Connect</span>
                                </span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={map()}
                                        className="group px-6 py-3 rounded-full bg-[#ADFF00] hover:bg-[#c4ff4d] text-black font-bold transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(173,255,0,0.4)]"
                                    >
                                        Open Map
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-5 py-2.5 rounded-full text-white/80 hover:text-white font-medium transition-all hover:bg-white/5"
                                        >
                                            Sign in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="group px-6 py-3 rounded-full bg-[#ADFF00] hover:bg-[#c4ff4d] text-black font-bold transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(173,255,0,0.4)] hover:shadow-[0_0_50px_rgba(173,255,0,0.6)]"
                                            >
                                                Get Started
                                                <Sparkles className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6 text-white" />
                                ) : (
                                    <Menu className="w-6 h-6 text-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 overflow-hidden ${
                        mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="p-4 space-y-3">
                            {auth.user ? (
                                <Link
                                    href={map()}
                                    className="block w-full px-6 py-4 rounded-2xl bg-[#ADFF00] text-black font-bold text-center shadow-[0_0_30px_rgba(173,255,0,0.4)]"
                                >
                                    Open Map
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="block w-full px-6 py-4 rounded-2xl border border-white/20 text-white font-semibold text-center hover:bg-white/5 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="block w-full px-6 py-4 rounded-2xl bg-[#ADFF00] text-black font-bold text-center shadow-[0_0_30px_rgba(173,255,0,0.4)]"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="min-h-screen flex items-center pt-20 sm:pt-24 pb-10 px-4 sm:px-6 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Left Content */}
                            <AnimatedSection animation="fade-right">
                            <div className="space-y-6 sm:space-y-8 relative z-10">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#ADFF00]/10 border border-[#ADFF00]/30 animate-pulse-border">
                                    <div className="w-2 h-2 rounded-full bg-[#ADFF00] animate-ping" />
                                    <span className="text-[#ADFF00] text-xs sm:text-sm font-semibold tracking-wide">
                                        🌍 NOW LIVE IN 150+ COUNTRIES
                                    </span>
                                </div>

                                {/* Main Heading */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                        <span className="text-white block">DROP YOUR</span>
                                        <span className="relative inline-block">
                                            <span className="text-[#ADFF00] relative z-10">MARK</span>
                                            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 12" fill="none">
                                                <path d="M2 10C20 4 50 2 60 6C80 10 100 4 118 8" stroke="#ADFF00" strokeWidth="3" strokeLinecap="round" className="animate-draw-line" />
                                            </svg>
                                        </span>
                                        <span className="text-white"> ON THE</span>
                                        <span className="text-white block">WORLD</span>
                                    </h1>

                                    <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed">
                                        Drop anonymous messages anywhere on the globe.
                                        <span className="text-white font-medium"> Discover hidden stories</span>,
                                        build your reputation, and connect with explorers worldwide.
                                    </p>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                                    <Link
                                        href={register()}
                                        className="group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ADFF00] text-black font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(173,255,0,0.4)]"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Compass className="w-5 h-5" />
                                            Start Exploring
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#ADFF00] to-[#88FF00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>

                                    <Link
                                        href={login()}
                                        className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/20 text-white font-semibold text-base sm:text-lg transition-all duration-300 hover:border-[#ADFF00]/50 hover:bg-[#ADFF00]/5 flex items-center justify-center gap-3"
                                    >
                                        <span>Watch Demo</span>
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ADFF00]/20 transition-colors">
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Social Proof with Real Avatars */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
                                    <div className="flex -space-x-3">
                                        {[
                                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                                            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                                        ].map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`User ${i + 1}`}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black object-cover"
                                                style={{ zIndex: 5 - i }}
                                            />
                                        ))}
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-[#ADFF00] flex items-center justify-center text-xs sm:text-sm font-bold text-black" style={{ zIndex: 0 }}>
                                            +5k
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#ADFF00] text-[#ADFF00]" />
                                            ))}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            <span className="text-white font-semibold">5,000+</span> explorers joined this week
                                        </p>
                                    </div>
                                </div>
                            </div>
                            </AnimatedSection>

                            {/* Right Content - Hero Image with Floating Elements */}
                            <AnimatedSection animation="fade-left" delay={200}>
                            <div className="relative lg:h-[600px] h-[350px] sm:h-[400px]">
                                {/* Main Image Container */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Outer Ring */}
                                    <div className="absolute w-[95%] h-[95%] rounded-3xl border border-[#ADFF00]/20 animate-pulse-border" />
                                    <div className="absolute w-[88%] h-[88%] rounded-3xl border border-[#ADFF00]/10" />

                                    {/* Main Hero Image */}
                                    <div className="relative w-[85%] sm:w-[80%] h-[85%] sm:h-[80%] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#ADFF00]/30 shadow-[0_0_100px_rgba(173,255,0,0.2)]">
                                        <img
                                            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
                                            alt="Earth from space"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                        <div className="absolute inset-0 bg-[#ADFF00]/10 mix-blend-overlay" />

                                        {/* Scan line effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ADFF00]/10 to-transparent h-[200%] animate-scan-line" />
                                    </div>

                                    {/* Floating Message Cards - Hidden on very small screens, adjusted for tablets */}
                                    <div className="absolute top-[5%] right-[5%] lg:right-[0%] animate-float-slow z-20 hidden sm:block">
                                        <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-2 sm:p-3 border border-[#ADFF00]/30 shadow-[0_0_30px_rgba(173,255,0,0.3)] max-w-[120px] sm:max-w-[160px] lg:max-w-[200px]">
                                            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&q=80" alt="Tokyo" className="w-full h-14 sm:h-20 lg:h-24 object-cover rounded-xl mb-2 sm:mb-3" />
                                            <div className="flex items-center gap-2 mb-1">
                                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="User" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                                                <span className="text-white text-xs sm:text-sm font-semibold">Tokyo, Japan</span>
                                            </div>
                                            <p className="text-gray-400 text-xs hidden lg:block">"夢を追いかけて! 🗼"</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-[#ADFF00]">
                                                <Eye className="w-3 h-3" />
                                                <span>2.4k reads</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-[10%] left-[5%] lg:left-[-8%] animate-float-slower z-20 hidden sm:block">
                                        <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-2 sm:p-3 border border-white/20 shadow-xl max-w-[120px] sm:max-w-[160px] lg:max-w-[200px]">
                                            <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&q=80" alt="New York" className="w-full h-14 sm:h-20 lg:h-24 object-cover rounded-xl mb-2 sm:mb-3" />
                                            <div className="flex items-center gap-2 mb-1">
                                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="User" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                                                <span className="text-white text-xs sm:text-sm font-semibold">New York, USA</span>
                                            </div>
                                            <p className="text-gray-400 text-xs hidden lg:block">"The city never sleeps 🌃"</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                <Eye className="w-3 h-3" />
                                                <span>1.8k reads</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-[35%] left-[5%] lg:left-[-12%] animate-float z-20 hidden lg:block">
                                        <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-2 sm:p-3 border border-[#ADFF00]/30 shadow-[0_0_30px_rgba(173,255,0,0.2)] max-w-[140px] sm:max-w-[180px]">
                                            <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80" alt="Bali" className="w-full h-14 sm:h-20 object-cover rounded-xl mb-2 sm:mb-3" />
                                            <div className="flex items-center gap-2 mb-1">
                                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="User" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                                                <span className="text-white text-xs sm:text-sm font-semibold">Bali</span>
                                            </div>
                                            <p className="text-gray-400 text-xs hidden sm:block">"Paradise found 🌺"</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-[#ADFF00]">
                                                <Eye className="w-3 h-3" />
                                                <span>3.1k reads</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pulse Points - Hidden on mobile */}
                                    <div className="absolute top-[20%] right-[20%] z-30 hidden sm:block">
                                        <div className="w-4 h-4 bg-[#ADFF00] rounded-full animate-ping" />
                                        <div className="absolute inset-0 w-4 h-4 bg-[#ADFF00] rounded-full shadow-[0_0_20px_rgba(173,255,0,0.8)]" />
                                    </div>
                                    <div className="absolute bottom-[35%] right-[10%] z-30 hidden sm:block">
                                        <div className="w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                        <div className="absolute inset-0 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                                    </div>
                                    <div className="absolute top-[55%] left-[15%] z-30 hidden sm:block">
                                        <div className="w-3 h-3 bg-[#ADFF00] rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                                        <div className="absolute inset-0 w-3 h-3 bg-[#ADFF00] rounded-full shadow-[0_0_15px_rgba(173,255,0,0.8)]" />
                                    </div>
                                </div>
                            </div>
                            </AnimatedSection>
                        </div>
                    </div>

                    {/* Scroll Indicator - Hidden on mobile */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce hidden sm:flex">
                        <span className="text-gray-500 text-sm">Scroll to explore</span>
                        <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1">
                            <div className="w-1.5 h-3 bg-[#ADFF00] rounded-full animate-scroll-down" />
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
                    {/* Section Decoration */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />

                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <AnimatedSection className="text-center mb-12 sm:mb-20" animation="fade-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Radio className="w-4 h-4 text-[#ADFF00]" />
                                <span className="text-gray-400 text-sm font-medium">How it works</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                <span className="text-white">THREE STEPS TO </span>
                                <span className="text-[#ADFF00] relative">
                                    CONNECT
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ADFF00]/30 rounded-full" />
                                </span>
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
                                Join the global conversation in minutes
                            </p>
                        </AnimatedSection>

                        {/* Steps with Images */}
                        <div className="grid lg:grid-cols-3 gap-8 relative">
                            {/* Step 1 */}
                            <AnimatedSection animation="fade-up" delay={0}>
                                <div className="relative group h-full">
                                    <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#ADFF00]/30 transition-all duration-500 h-full">
                                        {/* Step Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80"
                                                alt="Map exploration"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-[#ADFF00] flex items-center justify-center text-2xl font-bold text-black shadow-[0_0_30px_rgba(173,255,0,0.4)]" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                01
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                <MapPinned className="w-5 h-5 text-[#ADFF00]" />
                                                PICK YOUR SPOT
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Explore the interactive map and choose any location on Earth. Your favorite café, a hidden beach, or the top of a mountain.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Step 2 */}
                            <AnimatedSection animation="fade-up" delay={150}>
                                <div className="relative group lg:mt-12 h-full">
                                    <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/30 transition-all duration-500 h-full">
                                        {/* Step Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80"
                                                alt="Writing message"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                02
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                <Send className="w-5 h-5 text-white" />
                                                DROP YOUR MESSAGE
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Write something meaningful, funny, or inspiring. Your message becomes a digital landmark for others to discover.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Step 3 */}
                            <AnimatedSection animation="fade-up" delay={300}>
                                <div className="relative group h-full">
                                    <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#ADFF00]/30 transition-all duration-500 h-full">
                                        {/* Step Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                                                alt="Analytics dashboard"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-[#ADFF00] flex items-center justify-center text-2xl font-bold text-black shadow-[0_0_30px_rgba(173,255,0,0.4)]" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                03
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                <Navigation className="w-5 h-5 text-[#ADFF00]" />
                                                WATCH IT TRAVEL
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Track how many people read your message. Rise up the leaderboard and become a global voice.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section className="py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header - Offset to left */}
                        <AnimatedSection className="mb-12 sm:mb-24 max-w-2xl" animation="fade-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ADFF00]/10 border border-[#ADFF00]/30 mb-6">
                                <Sparkles className="w-4 h-4 text-[#ADFF00]" />
                                <span className="text-[#ADFF00] text-sm font-semibold">Powerful Features</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold mb-4 sm:mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                <span className="text-white">BUILT FOR</span><br />
                                <span className="text-[#ADFF00]">EXPLORERS</span>
                            </h2>
                            <p className="text-base sm:text-xl text-gray-400 leading-relaxed">
                                Every feature designed to amplify your voice across the globe.
                            </p>
                        </AnimatedSection>

                        {/* Clean Organized Grid with Dynamic Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

                            {/* Row 1: Hero Card + Limited Messages */}
                            {/* Feature 1 - Large Hero Card */}
                            <AnimatedSection
                                className="lg:col-span-7"
                                animation="fade-right"
                            >
                                <div className="group relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden border-2 border-[#ADFF00]/40 hover:border-[#ADFF00] transition-all duration-500 h-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
                                        alt="Mountain landscape"
                                        className="w-full h-[280px] sm:h-[350px] lg:h-full lg:min-h-[380px] object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
                                        <div className="flex items-start gap-4 sm:gap-5">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#ADFF00] flex items-center justify-center shrink-0 shadow-[0_0_60px_rgba(173,255,0,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                <Globe2 className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                    GLOBAL CANVAS
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md">
                                                    The entire world is your canvas. Drop messages at famous landmarks, hidden gems, or anywhere that matters to you.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-sm border border-[#ADFF00]/40 text-[#ADFF00] text-xs sm:text-sm font-bold">
                                        150+ Countries
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Feature 2 - Limited Messages Card */}
                            <AnimatedSection
                                className="lg:col-span-5"
                                animation="fade-left"
                                delay={100}
                            >
                                <div className="group relative rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 overflow-hidden bg-white border-4 border-black h-full transform hover:-translate-y-1 transition-all duration-500 shadow-[10px_10px_0px_0px_#ADFF00] sm:shadow-[16px_16px_0px_0px_#ADFF00] hover:shadow-[14px_14px_0px_0px_#ADFF00] sm:hover:shadow-[20px_20px_0px_0px_#ADFF00]">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-[#ADFF00]" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                        LIMITED MESSAGES
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                                        Quality over quantity. Each message you drop becomes precious and meaningful.
                                    </p>
                                    <div className="flex items-center gap-2 text-black font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-[#ADFF00]" />
                                        5 messages per day
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Row 2: Leaderboard + Community Pill + Badges */}
                            {/* Feature 3 - Leaderboard Card */}
                            <AnimatedSection
                                className="lg:col-span-6"
                                animation="fade-up"
                                delay={200}
                            >
                                <div className="group relative rounded-2xl sm:rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#ADFF00] to-[#88CC00] p-1 h-full">
                                    <div className="rounded-xl sm:rounded-[1.75rem] bg-black p-5 sm:p-8 h-full">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ADFF00] flex items-center justify-center shrink-0 group-hover:animate-pulse">
                                                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                    CLIMB THE LEADERBOARD
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    Compete globally. Your messages get read, you rise in ranks.
                                                </p>
                                            </div>
                                            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#ADFF00]/30 group-hover:text-[#ADFF00]/50 transition-colors hidden sm:block" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                #1
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Feature 4 - Community + Badges Stack */}
                            <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
                                {/* Community Pill */}
                                <AnimatedSection
                                    animation="fade-left"
                                    delay={250}
                                >
                                    <div className="group relative rounded-2xl sm:rounded-full px-5 sm:px-8 py-4 sm:py-5 bg-black border-2 border-white/20 hover:border-[#ADFF00] transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[#ADFF00] transition-colors">
                                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-bold text-base sm:text-lg">5K+ Community</div>
                                                <div className="text-gray-500 text-xs sm:text-sm">Active explorers worldwide</div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#ADFF00] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </AnimatedSection>

                                {/* Badges Card */}
                                <AnimatedSection
                                    animation="fade-left"
                                    delay={300}
                                >
                                    <div className="group relative rounded-[2rem] overflow-hidden border border-white/10 hover:border-[#ADFF00]/50 transition-all duration-500 bg-gradient-to-br from-white/10 to-black p-6 lg:p-8">
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ADFF00] to-[#88CC00] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Sparkles className="w-6 h-6 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                    EARN BADGES
                                                </h3>
                                                <p className="text-gray-500 text-xs">Unlock achievements</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['🌍 Explorer', '⭐ Rising Star', '🔥 Viral', '👑 Legend'].map((badge, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-[#ADFF00]/20 hover:text-[#ADFF00] transition-colors cursor-pointer"
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>

                            {/* Row 3: Privacy + Discover Nearby */}
                            {/* Feature 5 - Privacy Card */}
                            <AnimatedSection
                                className="lg:col-span-5"
                                animation="fade-right"
                                delay={400}
                            >
                                <div className="group relative rounded-[2rem] overflow-hidden h-full border border-[#ADFF00]/30 hover:border-[#ADFF00] transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#ADFF00]/20 via-black to-black" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#ADFF00]" />
                                    <div className="relative p-8">
                                        <div className="w-14 h-14 rounded-2xl bg-[#ADFF00] flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                                            <Lock className="w-7 h-7 text-black" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                            PRIVACY FIRST
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed mb-6">
                                            Anonymous by default. No tracking. No data selling. You're always in control.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 rounded-full bg-[#ADFF00]/20 text-[#ADFF00] text-xs font-bold">Encrypted</span>
                                            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold">Anonymous</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Feature 6 - Discover Nearby Card */}
                            <AnimatedSection
                                className="lg:col-span-7"
                                animation="fade-left"
                                delay={500}
                            >
                                <div className="group relative rounded-[2rem] overflow-hidden bg-black border-2 border-white/10 hover:border-[#ADFF00]/40 p-8 transition-all duration-500 h-full">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-white/20">
                                            <MapPin className="w-8 h-8 text-[#ADFF00]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                                DISCOVER NEARBY
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed mb-5">
                                                Find messages dropped near you. Uncover hidden stories in your neighborhood and connect with local explorers.
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {[1,2,3,4].map(i => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ADFF00]/40 to-[#ADFF00]/10 border-2 border-black flex items-center justify-center text-xs">
                                                            📍
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-gray-500 text-sm">23 messages nearby</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Stats Section with Animated Counters */}
                <section className="py-32 px-6 relative">
                    <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ADFF00]/5 rounded-full blur-3xl" />
                    </div>

                    <AnimatedSection className="max-w-7xl mx-auto relative z-10" animation="zoom-in">
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { value: 10000, suffix: '+', label: 'Messages Dropped', sublabel: 'Worldwide' },
                                { value: 150, suffix: '+', label: 'Countries', sublabel: 'Connected' },
                                { value: 5000, suffix: '+', label: 'Active Explorers', sublabel: 'Growing daily' },
                                { value: 99, suffix: '%', label: 'Satisfaction', sublabel: 'User rated' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="mb-4 relative">
                                        <span className={`text-5xl lg:text-7xl font-bold ${index % 2 === 0 ? 'text-[#ADFF00]' : 'text-white'} group-hover:scale-110 inline-block transition-transform`} style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                            <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
                                        </span>
                                    </div>
                                    <div className="text-white font-semibold text-lg mb-1">{stat.label}</div>
                                    <div className="text-gray-500 text-sm">{stat.sublabel}</div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </section>

                {/* Testimonials Carousel */}
                <section className="py-32 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <AnimatedSection className="text-center mb-20" animation="fade-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Star className="w-4 h-4 text-[#ADFF00] fill-[#ADFF00]" />
                                <span className="text-gray-400 text-sm font-medium">Loved by thousands</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                <span className="text-white">WHAT </span>
                                <span className="text-[#ADFF00]">EXPLORERS</span>
                                <span className="text-white"> SAY</span>
                            </h2>
                        </AnimatedSection>

                        {/* Testimonials Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    quote: "MapConnect changed how I travel. I leave messages everywhere I go and love reading what others share. It's like a global diary!",
                                    name: "Sarah Chen",
                                    role: "Travel Blogger",
                                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
                                    highlight: true
                                },
                                {
                                    quote: "The gamification is addictive! Climbing the leaderboard and earning badges keeps me engaged. Best social platform I've used.",
                                    name: "Marcus Rodriguez",
                                    role: "Digital Nomad",
                                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
                                    highlight: false
                                },
                                {
                                    quote: "Simple, beautiful, and meaningful. I've discovered amazing perspectives from people I'd never meet otherwise.",
                                    name: "Emma Wilson",
                                    role: "Photographer",
                                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
                                    highlight: true
                                }
                            ].map((testimonial, index) => (
                                <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                                <div
                                    className={`group relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                                        testimonial.highlight
                                            ? 'bg-gradient-to-b from-[#ADFF00]/10 to-transparent border border-[#ADFF00]/30 hover:border-[#ADFF00]/50'
                                            : 'bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    {/* Quote Icon */}
                                    <div className="absolute top-6 right-6 text-6xl font-serif text-[#ADFF00]/20 group-hover:text-[#ADFF00]/30 transition-colors">
                                        "
                                    </div>

                                    {/* Stars */}
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-[#ADFF00] text-[#ADFF00]" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                        "{testimonial.quote}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                                        />
                                        <div>
                                            <div className="text-white font-semibold text-lg">{testimonial.name}</div>
                                            <div className="text-gray-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6 relative">
                    <AnimatedSection animation="zoom-in">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative rounded-[3rem] overflow-hidden">
                            {/* Background Image */}
                            <img
                                src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80"
                                alt="Night sky"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-[#ADFF00]/20" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(173,255,0,0.3)_0%,transparent_60%)]" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ADFF00]/10 rounded-full blur-3xl" />
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ADFF00]/10 rounded-full blur-3xl" />

                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `linear-gradient(rgba(173, 255, 0, 0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(173, 255, 0, 0.3) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }} />

                            {/* Border */}
                            <div className="absolute inset-0 rounded-[3rem] border border-[#ADFF00]/30" />

                            {/* Content */}
                            <div className="relative z-10 p-12 lg:p-20 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ADFF00]/20 border border-[#ADFF00]/40 mb-8 animate-pulse-border">
                                    <Zap className="w-4 h-4 text-[#ADFF00]" />
                                    <span className="text-[#ADFF00] text-sm font-semibold">Free to get started</span>
                                </div>

                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                    <span className="text-white">READY TO LEAVE</span><br />
                                    <span className="text-[#ADFF00]">YOUR MARK?</span>
                                </h2>

                                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                    Join thousands of explorers who are already sharing their stories across the globe. Your adventure begins with a single click.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href={register()}
                                        className="group w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#ADFF00] hover:bg-[#c4ff4d] text-black text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_60px_rgba(173,255,0,0.4)] hover:shadow-[0_0_80px_rgba(173,255,0,0.6)] hover:scale-105"
                                    >
                                        <Compass className="w-6 h-6" />
                                        Start Your Journey
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-white/20 hover:border-[#ADFF00]/50 text-white text-lg font-semibold transition-all duration-300 hover:bg-[#ADFF00]/5"
                                    >
                                        Already exploring? Sign in
                                    </Link>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        <span>Privacy First</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                                    <div className="flex items-center gap-2">
                                        <Globe2 className="w-4 h-4" />
                                        <span>150+ Countries</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        <span>Instant Setup</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </AnimatedSection>
                </section>

                {/* Footer */}
                <footer className="py-16 px-6 relative">
                    <AnimatedSection animation="fade-up">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            {/* Logo */}
                            <div className="flex items-center gap-3 group">
                                <div className="w-12 h-12 rounded-2xl bg-[#ADFF00] flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-[0_0_30px_rgba(173,255,0,0.4)]">
                                    <MapPin className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                        Map<span className="text-[#ADFF00]">Connect</span>
                                    </span>
                                    <div className="text-gray-500 text-sm">Drop your mark on the world</div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-8 text-gray-400">
                                <a href="#" className="hover:text-[#ADFF00] transition-colors">Privacy</a>
                                <a href="#" className="hover:text-[#ADFF00] transition-colors">Terms</a>
                                <a href="#" className="hover:text-[#ADFF00] transition-colors">Contact</a>
                            </div>

                            {/* Copyright */}
                            <div className="text-gray-500 text-sm">
                                © 2026 MapConnect. Connecting worlds, one message at a time.
                            </div>
                        </div>
                    </div>
                    </AnimatedSection>
                </footer>
            </div>
        </>
    );
}
