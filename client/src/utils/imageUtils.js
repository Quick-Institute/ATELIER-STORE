// Image Helpers & Safe Fallbacks for Atelier Store
export const DEFAULT_GARMENT_FALLBACK = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_AVATAR_FALLBACK = (name = 'Patron') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Patron')}&background=1c1917&color=f5f5f4&bold=true`;

// Curated luxury patron avatar presets for Profile Settings
export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
];

/**
 * Format any image URL (handles relative uploads, localhost ports, data URIs)
 */
export function formatImageUrl(urlStr, fallback = DEFAULT_GARMENT_FALLBACK) {
  if (!urlStr || typeof urlStr !== 'string') return fallback;
  const trimmed = urlStr.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^\/+/, '');
  return `http://localhost:5001/${cleanPath}`;
}

/**
 * Extract & format image from any item or product object (cart, wishlist, catalog, order)
 */
export function resolveProductImage(item, fallback = DEFAULT_GARMENT_FALLBACK) {
  if (!item) return fallback;
  if (typeof item === 'string') return formatImageUrl(item, fallback);

  const candidate =
    item.img ||
    item.image ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) ||
    item.rawProduct?.img ||
    item.rawProduct?.image ||
    (Array.isArray(item.rawProduct?.images) && item.rawProduct.images.length > 0 && item.rawProduct.images[0]) ||
    item.raw?.img ||
    item.raw?.image ||
    (Array.isArray(item.raw?.images) && item.raw.images.length > 0 && item.raw.images[0]);

  if (candidate && typeof candidate === 'string' && candidate.trim()) {
    return formatImageUrl(candidate, fallback);
  }

  return fallback;
}

/**
 * Resolve user profile avatar safely
 */
export function resolveUserAvatar(user, fallbackName = 'Patron') {
  if (!user) return DEFAULT_AVATAR_FALLBACK(fallbackName);
  const name = user.name || fallbackName;
  const avatar = user.avatar || user.photoURL || '';

  if (!avatar || typeof avatar !== 'string' || !avatar.trim()) {
    return DEFAULT_AVATAR_FALLBACK(name);
  }

  // Filter out expired Facebook CDN links that return 403 Forbidden
  if (avatar.includes('fbcdn.net') || avatar.includes('facebook.com')) {
    return DEFAULT_AVATAR_FALLBACK(name);
  }

  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
    return avatar;
  }

  const cleanPath = avatar.replace(/^\/+/, '');
  return `http://localhost:5001/${cleanPath}`;
}

/**
 * React onError handler for product images
 */
export const handleImageError = (fallback = DEFAULT_GARMENT_FALLBACK) => (e) => {
  if (e && e.currentTarget && e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};

/**
 * React onError handler for user avatars
 */
export const handleAvatarError = (name = 'Patron') => (e) => {
  const fallback = DEFAULT_AVATAR_FALLBACK(name);
  if (e && e.currentTarget && e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};
