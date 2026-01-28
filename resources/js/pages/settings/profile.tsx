import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, Mail, Check, AtSign } from 'lucide-react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <SettingsLayout>
            <Head title="Profile settings" />
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ADFF00]/10">
                            <User className="h-5 w-5 text-[#ADFF00]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Profile Information
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Update your name and email address
                            </p>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            className="pl-10"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="nickname" className="text-sm font-medium">
                                        Nickname
                                    </Label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="nickname"
                                            className="pl-10"
                                            defaultValue={auth.user.nickname}
                                            name="nickname"
                                            required
                                            autoComplete="username"
                                            placeholder="YourNickname"
                                        />
                                    </div>
                                    <InputError message={errors.nickname} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio" className="text-sm font-medium">
                                        Bio
                                    </Label>
                                    <textarea
                                        id="bio"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ADFF00]/50 focus:border-transparent"
                                        defaultValue={auth.user.bio || ''}
                                        name="bio"
                                        placeholder="Tell others about yourself..."
                                        rows={3}
                                    />
                                    <InputError message={errors.bio} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-10"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-300"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                    A new verification link has been sent to your email.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        disabled={processing}
                                        className="bg-[#ADFF00] text-black hover:bg-[#ADFF00]/90"
                                        data-test="update-profile-button"
                                    >
                                        Save Changes
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
                                            Saved
                                        </span>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <DeleteUser />
                </div>
        </SettingsLayout>
    );
}
