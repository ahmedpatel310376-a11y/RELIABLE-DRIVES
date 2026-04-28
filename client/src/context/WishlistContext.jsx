import { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(() => JSON.parse(localStorage.getItem("rd_wishlist") || "[]"));

  const toggle = (id) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("rd_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({ ids, toggle, has: (id) => ids.includes(id) }), [ids]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
