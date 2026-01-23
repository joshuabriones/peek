import { Form, Head } from '@inertiajs/react';
import { Mail, Lock, Shield, ArrowRight } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout
            title="Set New Password"
            description="Create a secure password for your account"
        >
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        {/* Email Field (Read Only) */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                                Email address
                            </Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <InputError message={errors.email} className="text-red-400" />
                        </div>

                        {/* Password Fields Row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                                    New password
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        autoFocus
                                        placeholder="••••••••"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.password} className="text-red-400" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-gray-300 text-sm font-medium">
                                    Confirm
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="text-red-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="mt-4 w-full h-12 bg-[#ADFF00] hover:bg-[#ADFF00]/90 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(173,255,0,0.3)] hover:shadow-[0_0_30px_rgba(173,255,0,0.5)] group"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? (
                                <Spinner className="text-black" />
                            ) : (
                                <>
                                    Reset password
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
