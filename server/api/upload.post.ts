import ImageKit from "imagekit";
import { defineEventHandler, readMultipartFormData } from "h3";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const file = form?.find((f) => f.name === "file");
  const pathField = form?.find((f) => f.name === "path");

  if (!file) {
    return { error: "No file uploaded" };
  }

  // Folder + optional path
  const baseFolder = "images";
  const subPath = pathField?.data?.toString() || "";
  const finalFolder = subPath ? `${baseFolder}/${subPath}` : baseFolder;

  const upload = await imagekit.upload({
    file: file.data,
    fileName: file.filename ?? "Image",
    folder: finalFolder,
  });

  return {
    url: upload.url,
    thumbnail: upload.thumbnailUrl,
  };
});
