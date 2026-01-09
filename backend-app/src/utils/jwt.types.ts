export interface JwtPayload {
    userId: string;
    email: string;
    tokenVersion: number;
}