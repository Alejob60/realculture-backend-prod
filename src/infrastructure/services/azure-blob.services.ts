import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name);
  private readonly containerName =
    process.env.AZURE_STORAGE_CONTAINER_IMAGES || 'images';
  private readonly account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
  private readonly accountKey = process.env.AZURE_STORAGE_KEY!;
  private readonly sharedKeyCredential: StorageSharedKeyCredential;
  private readonly blobServiceClient: BlobServiceClient;

  constructor() {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.account,
      this.accountKey,
    );
    this.blobServiceClient = new BlobServiceClient(
      `https://${this.account}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );
  }

  /**
   * Sube un archivo desde el sistema de archivos local al contenedor de Azure Blob.
   * Retorna la URL pública (sin firma).
   */
  async uploadToContainer(
    filePath: string,
    subfolder: string = '',
  ): Promise<string> {
    const fileName = path.basename(filePath);
    const blobName = subfolder ? `${subfolder}/${fileName}` : fileName;

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const fileBuffer = fs.readFileSync(filePath);

    try {
      await blockBlobClient.upload(fileBuffer, fileBuffer.length);
      const blobUrl = blockBlobClient.url;
      this.logger.log(`📤 Archivo subido a Azure Blob Storage: ${blobUrl}`);
      return blobUrl;
    } catch (error) {
      this.logger.error(`❌ Error al subir archivo a Azure: ${error.message}`);
      throw new HttpException(
        'Error al subir archivo a Azure Blob Storage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Devuelve una URL firmada SAS para el archivo especificado, válida por X segundos.
   */
  async getSignedUrl({
  filename,
  container,
  expiresInSeconds = 86400, // Establecemos 86400 por defecto (1 día)
}: {
  filename: string;
  container: string;
  expiresInSeconds: number;
}): Promise<string> {
  const containerClient = this.blobServiceClient.getContainerClient(container);
  const blobClient = containerClient.getBlobClient(filename);

  const expiresOn = new Date(Date.now() + expiresInSeconds * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: filename,
      permissions: BlobSASPermissions.parse('r'), // Permiso de lectura
      expiresOn,
      protocol: SASProtocol.Https,
    },
    this.sharedKeyCredential,
  ).toString();

  const signedUrl = `${blobClient.url}?${sasToken}`;
  this.logger.log(`🔐 URL firmada generada: ${signedUrl}`);
  return signedUrl;
}

  /**
   * Elimina un archivo del contenedor de Azure.
   */
  async deleteBlob(filename: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlobClient(filename);

    try {
      const exists = await blobClient.exists();
      if (exists) {
        await blobClient.delete();
        this.logger.log(`🗑️ Blob eliminado: ${filename}`);
      } else {
        this.logger.warn(`⚠️ Blob no encontrado para eliminar: ${filename}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error al eliminar archivo ${filename}: ${error.message}`);
      throw new HttpException(
        'Error al eliminar archivo de Azure Blob Storage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
