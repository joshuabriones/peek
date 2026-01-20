import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { MapPin, Globe2, MessageSquare, Users, Sparkles, TrendingUp, Lock, Zap } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to MapConnect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>
            
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-midnight via-[#0F1A2E] to-midnight overflow-hidden">
                {/* Animated grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(77,238,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(77,238,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-grid-flow" />
                
                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-[120px] animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet/20 rounded-full blur-[120px] animate-float-slower" />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold/10 rounded-full blur-[100px] animate-float" />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-cyan/20">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center glow-cyan">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-cyan via-violet to-gold bg-clip-text text-transparent">
                                MapConnect
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan to-violet hover:from-cyan/80 hover:to-violet/80 text-white font-semibold transition-all glow-cyan"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="px-6 py-2.5 rounded-lg hover:bg-white/5 text-white transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan to-violet hover:from-cyan/80 hover:to-violet/80 text-white font-semibold transition-all glow-cyan"
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
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-sm font-semibold mb-8 animate-pulse-glow">
                                <Sparkles className="w-4 h-4" />
                                <span>Connect with the world, one message at a time</span>
                            </div>
                            
                            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-white via-cyan to-violet bg-clip-text text-transparent">
                                    Drop Messages
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-violet via-gold to-cyan bg-clip-text text-transparent animate-gradient-x">
                                    Across The Globe
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Place messages anywhere on Earth. Discover what others are saying. 
                                Build your reputation. Join a global community of explorers.
                            </p>
                            
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet hover:from-cyan/80 hover:to-violet/80 text-white text-lg font-bold transition-all transform hover:scale-105 glow-cyan inline-flex items-center gap-2"
                                    >
                                        <Globe2 className="w-5 h-5" />
                                        Open Map
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-violet hover:from-cyan/80 hover:to-violet/80 text-white text-lg font-bold transition-all transform hover:scale-105 glow-cyan inline-flex items-center gap-2"
                                        >
                                            <Zap className="w-5 h-5" />
                                            Start Exploring
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="px-8 py-4 rounded-xl glass border border-cyan/30 hover:border-cyan/50 text-white text-lg font-semibold transition-all transform hover:scale-105"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Hero Image/Map Preview */}
                        <div className="relative max-w-5xl mx-auto animate-fade-in-up-delay">
                            <div className="glass rounded-2xl border border-cyan/30 overflow-hidden glow-cyan">
                                <div className="aspect-video relative bg-gradient-to-br from-midnight to-[#0F1A2E]">
                                    {/* Mock map interface */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNzcsIDIzOCwgMjM0LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                                    
                                    {/* Animated pins */}
                                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan rounded-full animate-ping" />
                                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan rounded-full glow-cyan" />
                                    
                                    <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-gold rounded-full animate-ping animation-delay-300" />
                                    <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-gold rounded-full glow-gold" />
                                    
                                    <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-violet rounded-full animate-ping animation-delay-600" />
                                    <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-violet rounded-full glow-violet" />
                                    
                                    <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-cyan rounded-full animate-ping animation-delay-900" />
                                    <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-cyan rounded-full glow-cyan" />

                                    {/* Floating message cards */}
                                    <div className="absolute top-1/3 right-1/4 glass rounded-lg p-3 border border-cyan/30 max-w-xs animate-float">
                                        <p className="text-white text-sm mb-1">Hello from Tokyo! 🗼</p>
                                        <div className="text-xs text-gray-400">👁  234 reads</div>
                                    </div>

                                    <div className="absolute bottom-1/4 left-1/3 glass rounded-lg p-3 border border-gold/30 max-w-xs animate-float-slower">
                                        <p className="text-white text-sm mb-1">Beautiful sunset in Bali 🌅</p>
                                        <div className="text-xs text-gray-400">👁 567 reads</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-cyan to-transparent rounded-full blur-3xl opacity-50 animate-pulse-slow" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-violet to-transparent rounded-full blur-3xl opacity-50 animate-pulse-slower" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                                Why <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">MapConnect</span>?
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                A revolutionary platform to share your thoughts with the world
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="glass rounded-2xl p-8 border border-cyan/20 hover:border-cyan/40 transition-all transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center mb-6 glow-cyan group-hover:scale-110 transition-transform">
                                    <Globe2 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Global Canvas</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Drop your message anywhere on Earth. From the Eiffel Tower to Mount Everest, 
                                    the world is your canvas.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="glass rounded-2xl p-8 border border-violet/20 hover:border-violet/40 transition-all transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up animation-delay-200">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet to-gold flex items-center justify-center mb-6 glow-violet group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Daily Messages</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Share your thoughts with limited daily messages. Quality over quantity. 
                                    Make every word count.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="glass rounded-2xl p-8 border border-gold/20 hover:border-gold/40 transition-all transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up animation-delay-400">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-cyan flex items-center justify-center mb-6 glow-gold group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Top Messages</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    The most-read messages rise to the top. Build your reputation and 
                                    become a global influencer.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="glass rounded-2xl p-8 border border-cyan/20 hover:border-cyan/40 transition-all transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up animation-delay-600">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center mb-6 glow-cyan group-hover:scale-110 transition-transform">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Discover Others</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Read messages from people around the world. Unlock profiles and 
                                    connect with interesting minds.
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="glass rounded-2xl p-8 border border-violet/20 hover:border-violet/40 transition-all transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up animation-delay-800">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet to-gold flex items-center justify-center mb-6 glow-violet group-hover:scale-110 transition-transform">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Privacy First</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Your data is secure. Messages are anonymous by default. 
                                    You control what you share.
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="glass rounded-2xl p-8 border border-gold/20 hover:border-gold/40 transition-all transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up animation-delay-1000">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-cyan flex items-center justify-center mb-6 glow-gold group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Gamified Experience</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Earn streak badges, climb leaderboards, and unlock achievements. 
                                    Turn exploration into an adventure.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass rounded-3xl border border-cyan/30 p-12 lg:p-16">
                            <div className="grid md:grid-cols-3 gap-12 text-center">
                                <div className="animate-fade-in-up">
                                    <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent mb-2">
                                        10K+
                                    </div>
                                    <div className="text-xl text-gray-300 font-semibold">Messages Placed</div>
                                    <div className="text-sm text-gray-500 mt-1">And counting...</div>
                                </div>
                                <div className="animate-fade-in-up animation-delay-200">
                                    <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-violet to-gold bg-clip-text text-transparent mb-2">
                                        150+
                                    </div>
                                    <div className="text-xl text-gray-300 font-semibold">Countries Covered</div>
                                    <div className="text-sm text-gray-500 mt-1">Truly global</div>
                                </div>
                                <div className="animate-fade-in-up animation-delay-400">
                                    <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-gold to-cyan bg-clip-text text-transparent mb-2">
                                        5K+
                                    </div>
                                    <div className="text-xl text-gray-300 font-semibold">Active Users</div>
                                    <div className="text-sm text-gray-500 mt-1">Join the community</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                                Loved by <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">Explorers</span>
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                See what our community has to say
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="glass rounded-2xl p-8 border border-cyan/20 animate-fade-in-up">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-gold text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 leading-relaxed italic">
                                    "MapConnect changed how I travel. I leave messages everywhere I go 
                                    and love reading what others share. It's like a global diary!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-white font-bold text-lg">
                                        S
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">Sarah Chen</div>
                                        <div className="text-sm text-gray-400">Travel Blogger</div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-2xl p-8 border border-violet/20 animate-fade-in-up animation-delay-200">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-gold text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 leading-relaxed italic">
                                    "The gamification is addictive! Climbing the leaderboard and earning 
                                    badges keeps me engaged. Best social platform I've used."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet to-gold flex items-center justify-center text-white font-bold text-lg">
                                        M
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">Marcus Rodriguez</div>
                                        <div className="text-sm text-gray-400">Digital Nomad</div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-2xl p-8 border border-gold/20 animate-fade-in-up animation-delay-400">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-gold text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 leading-relaxed italic">
                                    "Simple, beautiful, and meaningful. I've discovered amazing 
                                    perspectives from people I'd never meet otherwise."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-cyan flex items-center justify-center text-white font-bold text-lg">
                                        E
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">Emma Watson</div>
                                        <div className="text-sm text-gray-400">Photographer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="glass rounded-3xl border border-cyan/30 p-12 lg:p-16 text-center overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan/20 to-transparent rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-violet/20 to-transparent rounded-full blur-3xl" />
                                
                                <div className="relative z-10">
                                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                                        Ready to <span className="bg-gradient-to-r from-cyan via-violet to-gold bg-clip-text text-transparent animate-gradient-x">Explore</span>?
                                    </h2>
                                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                                        Join thousands of explorers sharing their stories across the globe. 
                                        Your adventure starts now.
                                    </p>
                                    
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-cyan to-violet hover:from-cyan/80 hover:to-violet/80 text-white text-lg font-bold transition-all transform hover:scale-105 glow-cyan"
                                        >
                                            <Globe2 className="w-6 h-6" />
                                            Open Your Map
                                        </Link>
                                    ) : (
                                        <div className="flex items-center justify-center gap-4 flex-wrap">
                                            <Link
                                                href={register()}
                                                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-cyan to-violet hover:from-cyan/80 hover:to-violet/80 text-white text-lg font-bold transition-all transform hover:scale-105 glow-cyan"
                                            >
                                                <Zap className="w-6 h-6" />
                                                Get Started Free
                                            </Link>
                                            <Link
                                                href={login()}
                                                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl glass border border-cyan/30 hover:border-cyan/50 text-white text-lg font-semibold transition-all"
                                            >
                                                Sign In
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-black bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
                                    MapConnect
                                </span>
                            </div>
                            
                            <div className="text-gray-400 text-sm">
                                © 2026 MapConnect. Connecting the world, one message at a time.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes grid-flow {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(50px); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
                
                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-30px, 30px); }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                
                @keyframes pulse-slower {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 3s ease infinite;
                }
                
                .animate-grid-flow {
                    animation: grid-flow 20s linear infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                
                .animate-float-slower {
                    animation: float-slower 10s ease-in-out infinite;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
                
                .animate-fade-in-up-delay {
                    animation: fade-in-up 0.8s ease-out 0.3s both;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                
                .animation-delay-800 {
                    animation-delay: 0.8s;
                }
                
                .animation-delay-900 {
                    animation-delay: 0.9s;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-pulse-slower {
                    animation: pulse-slower 6s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
