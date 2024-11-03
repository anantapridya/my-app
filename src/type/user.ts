type UserSession = {
    id: string | undefined;
    email: string | null | undefined;
    name?: string | null;
    image?: string | null;
    token?: string | null;
};