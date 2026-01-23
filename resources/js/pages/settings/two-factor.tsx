import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck, Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';

import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <SettingsLayout>
            <Head title="Two-Factor Authentication" />
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ADFF00]/10">
                            <Shield className="h-5 w-5 text-[#ADFF00]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Two-Factor Authentication
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                    </div>

                    {twoFactorEnabled ? (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#ADFF00]/5 border border-[#ADFF00]/20">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ADFF00]/20">
                                    <ShieldCheck className="h-5 w-5 text-[#ADFF00]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-foreground">2FA is Active</span>
                                        <Badge className="bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90">
                                            Enabled
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your account is protected with two-factor authentication.
                                        You'll be prompted for a secure code during login.
                                    </p>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                                <Smartphone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    Use a TOTP-compatible authenticator app (Google Authenticator, Authy, 1Password, etc.)
                                    to generate your login codes.
                                </p>
                            </div>

                            <TwoFactorRecoveryCodes
                                recoveryCodesList={recoveryCodesList}
                                fetchRecoveryCodes={fetchRecoveryCodes}
                                errors={errors}
                            />

                            <div className="pt-4">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                            className="gap-2"
                                        >
                                            <ShieldBan className="h-4 w-4" />
                                            Disable Two-Factor Auth
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                                    <ShieldBan className="h-5 w-5 text-destructive" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-foreground">2FA is Disabled</span>
                                        <Badge variant="destructive">Not Protected</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your account is not protected by two-factor authentication.
                                        Enable it now for enhanced security.
                                    </p>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                                <Smartphone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    When enabled, you'll need your phone to generate a secure code each time you log in.
                                    This protects your account even if your password is compromised.
                                </p>
                            </div>

                            <div className="pt-4">
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="gap-2 bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Continue Setup
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() => setShowSetupModal(true)}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="gap-2 bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90"
                                            >
                                                <ShieldCheck className="h-4 w-4" />
                                                Enable Two-Factor Auth
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
        </SettingsLayout>
    );
}
