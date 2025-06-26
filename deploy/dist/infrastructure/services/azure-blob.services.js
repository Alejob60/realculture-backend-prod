"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AzureBlobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureBlobService = void 0;
const common_1 = require("@nestjs/common");
const storage_blob_1 = require("@azure/storage-blob");
const fs = require("fs");
const path = require("path");
let AzureBlobService = AzureBlobService_1 = class AzureBlobService {
    logger = new common_1.Logger(AzureBlobService_1.name);
    containerName = process.env.AZURE_STORAGE_CONTAINER_IMAGES || 'images';
    account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    accountKey = process.env.AZURE_STORAGE_KEY;
    sharedKeyCredential;
    blobServiceClient;
    constructor() {
        this.sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(this.account, this.accountKey);
        this.blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${this.account}.blob.core.windows.net`, this.sharedKeyCredential);
    }
    async uploadToContainer(filePath, subfolder = '') {
        const fileName = path.basename(filePath);
        const blobName = subfolder ? `${subfolder}/${fileName}` : fileName;
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const fileBuffer = fs.readFileSync(filePath);
        await blockBlobClient.upload(fileBuffer, fileBuffer.length);
        const blobUrl = blockBlobClient.url;
        this.logger.log(`📤 Archivo subido a Azure Blob Storage: ${blobUrl}`);
        return blobUrl;
    }
    async getSignedUrl(filename, expiresInSeconds = 86400) {
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        const blobClient = containerClient.getBlobClient(filename);
        const expiresOn = new Date(Date.now() + expiresInSeconds * 1000);
        const sasToken = (0, storage_blob_1.generateBlobSASQueryParameters)({
            containerName: this.containerName,
            blobName: filename,
            permissions: storage_blob_1.BlobSASPermissions.parse('r'),
            expiresOn,
            protocol: storage_blob_1.SASProtocol.Https,
        }, this.sharedKeyCredential).toString();
        const signedUrl = `${blobClient.url}?${sasToken}`;
        this.logger.log(`🔐 URL firmada generada: ${signedUrl}`);
        return signedUrl;
    }
    async deleteBlob(filename) {
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        const blobClient = containerClient.getBlobClient(filename);
        const exists = await blobClient.exists();
        if (exists) {
            await blobClient.delete();
            this.logger.log(`🗑️ Blob eliminado: ${filename}`);
        }
        else {
            this.logger.warn(`⚠️ Blob no encontrado para eliminar: ${filename}`);
        }
    }
};
exports.AzureBlobService = AzureBlobService;
exports.AzureBlobService = AzureBlobService = AzureBlobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AzureBlobService);
//# sourceMappingURL=azure-blob.services.js.map