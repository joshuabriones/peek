import { Form, Head } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Welcome Back"
            description="Sign in to continue your journey"
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-[#ADFF00]/10 border border-[#ADFF00]/30 text-center text-sm font-medium text-[#ADFF00]">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email Field */}
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
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} className="text-red-400" />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm text-[#ADFF00] hover:text-[#ADFF00]/80 transition-colors"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.password} className="text-red-400" />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-white/20 data-[state=checked]:bg-[#ADFF00] data-[state=checked]:border-[#ADFF00] data-[state=checked]:text-black"
                                />
                                <Label htmlFor="remember" className="text-gray-400 text-sm cursor-pointer">
                                    Remember me for 30 days
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 w-full h-12 bg-[#ADFF00] hover:bg-[#ADFF00]/90 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(173,255,0,0.3)] hover:shadow-[0_0_30px_rgba(173,255,0,0.5)] group"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner className="text-black" />
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-gray-500">or</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        {canRegister && (
                            <div className="text-center">
                                <span className="text-gray-400 text-sm">
                                    New to MapConnect?{' '}
                                </span>
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="text-[#ADFF00] hover:text-[#ADFF00]/80 font-semibold transition-colors"
                                >
                                    Create an account
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
