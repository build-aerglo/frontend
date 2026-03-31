import ImageKit from "imagekit";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { defineEventHandler, readMultipartFormData } from "h3";

const provider = process.env.STORAGE_PROVIDER;

// IMAGEKIT
const imagekit =
  provider === "imagekit"
    ? new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
      })
    : null;

// AZURE
let blobServiceClient: BlobServiceClient | null = null;

if (provider === "azure") {
  const credential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT!,
    process.env.AZURE_STORAGE_KEY!,
  );

  blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
    credential,
  );
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  const file = form?.find((f) => f.name === "file");
  const pathField = form?.find((f) => f.name === "path");

  if (!file) {
    return { error: "No file uploaded" };
  }

  const mimeType = file.type || "";

  const baseFolder = mimeType.startsWith("image/") ? "images" : "documents";
  const subPath = pathField?.data?.toString() || "";
  const finalFolder = subPath ? `${baseFolder}/${subPath}` : baseFolder;

  // IMAGEKIT
  if (provider === "imagekit") {
    const upload = await imagekit!.upload({
      file: file.data,
      fileName: file.filename ?? "Image",
      folder: finalFolder,
    });

    return {
      url: upload.url,
      thumbnail: upload.thumbnailUrl,
    };
  }

  // AZURE
  if (provider === "azure") {
    const container = process.env.AZURE_STORAGE_CONTAINER!;
    const containerClient = blobServiceClient!.getContainerClient(container);

    const blobName = `${finalFolder}/${file.filename}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.data);

    const url = blockBlobClient.url;

    return {
      url,
      thumbnail: url,
    };
  }

  return { error: "Invalid storage provider" };
});
