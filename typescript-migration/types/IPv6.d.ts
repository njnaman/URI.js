declare global {
    interface IPv6Interface {
        best: (address: string) => string;
    }
}
export {};
