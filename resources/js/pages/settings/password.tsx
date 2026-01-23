import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Lock, KeyRound, ShieldCheck, Check } from 'lucide-react';

import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <SettingsLayout>
            <Head title="Password settings" />
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ADFF00]/10">
                            <Lock className="h-5 w-5 text-[#ADFF00]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Update Password
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Ensure your account uses a strong password
                            </p>
                        </div>
                    </div>

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-sm font-medium">
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            className="pl-10"
                                            autoComplete="current-password"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="pl-10"
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="pl-10"
                                            autoComplete="new-password"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        disabled={processing}
                                        className="bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90"
                                        data-test="update-password-button"
                                    >
                                        Update Password
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-200"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out duration-200"
                                        leaveTo="opacity-0"
                                    >
                                        <span className="flex items-center gap-1.5 text-sm text-[#ADFF00]">
                                            <Check className="h-4 w-4" />
                                            Password Updated
                                        </span>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
        </SettingsLayout>
    );
}
