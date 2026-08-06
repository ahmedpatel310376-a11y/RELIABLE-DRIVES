export const SELLER_PHONE = import.meta.env.VITE_SELLER_PHONE || "7045352593";
export const SELLER_PHONE_E164 = `91${SELLER_PHONE.replace(/\D/g, "")}`;
export const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/secure-inventory";
