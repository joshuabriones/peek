import React, { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

interface MapLayoutProps {
    children?: ReactNode;
    onSidebarToggle?: (open: boolean) => void;
    sidebarOpen?: boolean;
}

export function MapLayout({ children, onSidebarToggle, sidebarOpen = false }: MapLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-900">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
