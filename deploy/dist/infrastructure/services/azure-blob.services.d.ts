export declare class AzureBlobService {
    private readonly logger;
    private readonly containerName;
    private readonly account;
    private readonly accountKey;
    private readonly sharedKeyCredential;
    private readonly blobServiceClient;
    constructor();
    uploadToContainer(filePath: string, subfolder?: string): Promise<string>;
    getSignedUrl(filename: string, expiresInSeconds?: number): Promise<string>;
    deleteBlob(filename: string): Promise<void>;
}
