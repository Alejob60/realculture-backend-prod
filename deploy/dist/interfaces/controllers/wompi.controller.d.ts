export declare class WompiController {
    getCheckoutData(plan: string): {
        publicKey: string;
        currency: string;
        amount: number;
        reference: string;
        redirectUrl: string;
        signature: string;
    };
}
