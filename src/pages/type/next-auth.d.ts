// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string | undefined;
            email: string | undefined | null;
            name?: string | null;
            image?: string | null;
            token?: string | null
        };
    }

    interface User {
        id: string;
    }
}
