import ImageKit from "imagekit";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { defineEventHandler, getQuery } from "h3";

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
  const { url } = getQuery(event);

  if (!url || typeof url !== "string") {
    return { error: "Image URL is required" };
  }

  // IMAGEKIT DELETE
  if (provider === "imagekit") {
    const endpoint = process.env.IMAGEKIT_URL_ENDPOINT!.replace(/\/$/, "");

    const relativePath = url.replace(endpoint, "");
    const parts = relativePath.split("/").filter(Boolean);

    const fileName = parts.pop()!;
    const folderPath = parts.join("/");

    const files = await new Promise<any[]>((resolve, reject) => {
      imagekit!.listFiles(
        {
          path: folderPath,
          searchQuery: `name = "${fileName}"`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result || []);
        },
      );
    });

    if (!files.length) return { error: "File not found" };

    const fileId = files[0].fileId;

    await new Promise((resolve, reject) => {
      imagekit!.deleteFile(fileId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return { success: true };
  }

  // AZURE DELETE
  if (provider === "azure") {
    const container = process.env.AZURE_STORAGE_CONTAINER!;

    const urlObj = new URL(url);
    const blobPath = urlObj.pathname.replace(`/${container}/`, "");

    const containerClient = blobServiceClient!.getContainerClient(container);
    const blobClient = containerClient.getBlobClient(blobPath);

    await blobClient.deleteIfExists();

    return { success: true };
  }

  return { error: "Invalid storage provider" };
});
