import { usePage } from '@inertiajs/react';
import { User } from '@/types';

interface PageProps {
    auth: {
        user: User;
    };
}

export function useAuth() {
    const { auth } = usePage<PageProps>().props;
    return { user: auth.user };
}
