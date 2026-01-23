import { Form, Head } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight, Shield } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Start Your Journey"
            description="Create your account and begin exploring"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            {/* Name Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                                    Full name
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="John Doe"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.name} className="text-red-400" />
                            </div>

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
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} className="text-red-400" />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.password} className="text-red-400" />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-gray-300 text-sm font-medium">
                                    Confirm password
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="text-red-400" />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 w-full h-12 bg-[#ADFF00] hover:bg-[#ADFF00]/90 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(173,255,0,0.3)] hover:shadow-[0_0_30px_rgba(173,255,0,0.5)] group"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing ? (
                                    <Spinner className="text-black" />
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-1">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-gray-500">or</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <span className="text-gray-400 text-sm">
                                Already have an account?{' '}
                            </span>
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-[#ADFF00] hover:text-[#ADFF00]/80 font-semibold transition-colors"
                            >
                                Sign in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
