// Components
import { Form, Head } from '@inertiajs/react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Reset Password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-[#ADFF00]/10 border border-[#ADFF00]/30 text-center text-sm font-medium text-[#ADFF00]">
                    {status}
                </div>
            )}

            <div className="space-y-5">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
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
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="email@example.com"
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ADFF00]/50 focus:ring-[#ADFF00]/20 transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} className="text-red-400" />
                            </div>

                            <div className="mt-6 flex items-center justify-start">
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-[#ADFF00] hover:bg-[#ADFF00]/90 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(173,255,0,0.3)] hover:shadow-[0_0_30px_rgba(173,255,0,0.5)] group"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <Spinner className="text-black" />
                                    ) : (
                                        <>
                                            Send reset link
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-gray-500">or</span>
                    </div>
                </div>

                <div className="text-center">
                    <TextLink
                        href={login()}
                        className="inline-flex items-center text-[#ADFF00] hover:text-[#ADFF00]/80 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to login
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
