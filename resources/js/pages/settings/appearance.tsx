import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    return (
        <SettingsLayout>
            <Head title="Appearance settings" />
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ADFF00]/10">
                            <Palette className="h-5 w-5 text-[#ADFF00]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Appearance
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Customize how MapConnect looks for you
                            </p>
                        </div>
                    </div>

                    <AppearanceTabs />
                </div>
        </SettingsLayout>
    );
}
