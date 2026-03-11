import { assets } from "../assets/assets";

/**
 * Resolves an image filename to a displayable URL.
 * Priority: 1. Direct URL (has "/") → use as-is
 *            2. Matches a key in local assets → use imported asset
 *            3. Fallback → backend /images/ static endpoint
 */
export const getImgSrc = (imgName) => {
    if (!imgName) return assets.logo;
    const name = String(imgName);
    if (name.startsWith("http") || name.includes("/")) return name;

    // strip extension and try assets map
    const cleanName = name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, "");
    if (assets[cleanName]) return assets[cleanName];
    if (assets[name]) return assets[name];

    // fallback to backend static
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}/images/${name}`;
};
