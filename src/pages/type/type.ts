type User = {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
};

type UserSessionResponse = {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    };
    loginTime: string;
    logoutTime: string;
    status: string;
};

type MessagePayload = {
    email: string,
    date: string,
    description: string
}
type MessageResponse = {
    _id: string,
    email: string,
    date: string,
    description: string
}