import { Link, router } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { User, Lock, Shield, MapPin, ArrowLeft, LogOut } from 'lucide-react';

import { useActiveUrl } from '@/hooks/use-active-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';

interface SettingsNavItem extends NavItem {
    label: string;
}

const navItems: SettingsNavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: User,
        label: 'Profile',
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: Lock,
        label: 'Password',
    },
    {
        title: 'Two-Factor',
        href: show(),
        icon: Shield,
        label: '2FA',
    },
    // TO DO: Add appearance/theme settings when ready
    // {
    //     title: 'Appearance',
    //     href: editAppearance(),
    //     icon: Palette,
    //     label: 'Theme',
    // },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { urlIsActive } = useActiveUrl();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Custom fonts */}
            <link
                href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
                rel="stylesheet"
            />

            {/* Top Navigation */}
            <div className="fixed top-0 left-0 right-0 z-[1000]">
                <div className="bg-black/80 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
                        {/* Left: Back + Logo */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/map"
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                <span className="text-sm text-gray-400 group-hover:text-white transition-colors hidden sm:block">Back</span>
                            </Link>
                            <div className="flex items-center gap-2 ml-2">
                                <div className="w-8 h-8 rounded-lg bg-[#ADFF00] flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-black" />
                                </div>
                                <span className="text-base font-bold text-white hidden sm:block" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                                    Settings
                                </span>
                            </div>
                        </div>

                        {/* Center: Tab Navigation */}
                        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                            {navItems.map((item, index) => {
                                const isActive = urlIsActive(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-[#ADFF00] text-black'
                                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        )}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>


                    </div>

                    {/* Mobile Tab Navigation */}
                    <div className="md:hidden px-4 pb-3">
                        <nav className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
                            {navItems.map((item, index) => {
                                const isActive = urlIsActive(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={`mobile-${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap',
                                            isActive
                                                ? 'bg-[#ADFF00] text-black'
                                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        )}
                                    >
                                        {Icon && <Icon className="w-3.5 h-3.5" />}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Subtle gradient line */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ADFF00]/50 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="pt-[120px] md:pt-[80px] pb-8 px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-white/10 bg-gray-950/50 backdrop-blur-sm p-6 md:p-8 shadow-xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
