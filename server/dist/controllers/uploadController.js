import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { env } from "../config/env.js";
const ALLOWED_MIMES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export async function uploadImage(req, res) {
    if (!isCloudinaryConfigured()) {
        res.status(503).json({
            error: "Image upload is not configured. Set CLOUDINARY_* env variables.",
        });
        return;
    }
    const file = req.file;
    if (!file || !file.buffer) {
        res.status(400).json({ error: "No file uploaded. Use field name 'file'." });
        return;
    }
    if (!ALLOWED_MIMES.has(file.mimetype)) {
        res.status(400).json({
            error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF.",
        });
        return;
    }
    if (file.size > MAX_SIZE_BYTES) {
        res.status(400).json({
            error: "File too large. Maximum size is 5MB.",
        });
        return;
    }
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({
                resource_type: "image",
                timeout: 120000, // 2 min – avoid 499 TimeoutError on slow connections
                ...(env.cloudinaryUploadPreset
                    ? { upload_preset: env.cloudinaryUploadPreset }
                    : { folder: "products" }),
            }, (err, uploadResult) => {
                if (err)
                    return reject(err);
                if (!uploadResult?.secure_url)
                    return reject(new Error("No URL returned"));
                resolve({ secure_url: uploadResult.secure_url });
            })
                .end(file.buffer);
        });
        res.json({ url: result.secure_url });
    }
    catch (err) {
        console.error("Cloudinary upload error:", err);
        res.status(500).json({ error: "Upload failed" });
    }
}
//# sourceMappingURL=uploadController.js.map