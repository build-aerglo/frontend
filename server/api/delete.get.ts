import ImageKit from "imagekit";
import { defineEventHandler, getQuery } from "h3";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);

  if (!url || typeof url !== "string") {
    return { error: "Image URL is required" };
  }

  // Example:
  // urlEndpoint = https://ik.imagekit.io/clerreview
  // url = https://ik.imagekit.io/clerreview/images/profile/file.png

  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT!.replace(/\/$/, "");

  if (!url.startsWith(endpoint)) {
    return { error: "Invalid ImageKit URL" };
  }

  // Remove endpoint from URL
  const relativePath = url.replace(endpoint, "");
  // /images/profile/frame_PkFLeRgHo.png

  const parts = relativePath.split("/").filter(Boolean);

  if (parts.length < 2) {
    return { error: "Invalid image path" };
  }

  const fileName = parts.pop()!;
  const folderPath = parts.join("/"); // images/profile

  // get id
  const files = await new Promise<any[]>((resolve, reject) => {
    imagekit.listFiles(
      {
        path: folderPath,
        searchQuery: `name = "${fileName}"`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result || []);
      }
    );
  });

  if (!files.length) {
    return { error: "File not found" };
  }

  const fileId = files[0].fileId;

  // delete
  await new Promise((resolve, reject) => {
    imagekit.deleteFile(fileId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

  return {
    success: true,
    deleted: `${folderPath}/${fileName}`,
    fileId: fileId,
  };
});
