import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

if (
  env.cloudinaryCloudName &&
  env.cloudinaryApiKey &&
  env.cloudinaryApiSecret
) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
}

export { cloudinary };

export function isCloudinaryConfigured(): boolean {
  return !!(
    env.cloudinaryCloudName &&
    env.cloudinaryApiKey &&
    env.cloudinaryApiSecret
  );
}

/** Upload a buffer (e.g. from AI-generated image) to Cloudinary and return the secure URL. */
// export function uploadBufferToCloudinary(
//   buffer: Buffer,
//   options?: { folder?: string; format?: string }
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: options?.folder ?? "products",
//           resource_type: "image",
//           timeout: 120000, // 2 min – avoid 499 TimeoutError on slow connections
//           ...(env.cloudinaryUploadPreset
//             ? { upload_preset: env.cloudinaryUploadPreset }
//             : {}),
//         },
//         (err, result) => {
//           if (err) return reject(err);
//           if (!result?.secure_url) return reject(new Error("No URL returned"));
//           resolve(result.secure_url);
//         }
//       )
//       .end(buffer);
//   });
// }
