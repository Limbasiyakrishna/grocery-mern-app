import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Add response interceptor to suppress 401 errors for read-only operations
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently handle 401 errors - they're expected when user isn't logged in
    if (error.response?.status === 401) {
      // Don't show error, just return a rejected promise
      return Promise.reject(error);
    }
    // For other errors, return the error normally
    return Promise.reject(error);
  }
);

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [collaborationId, setCollaborationId] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [isCartsSyncing, setIsCartsSyncing] = useState(false);

  // check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
        setCollaborationId(data.user.collaborativeCartId);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Handle auth error quietly
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products.length > 0 ? data.products : dummyProducts);
      } else {
        toast.error(data.message);
        setProducts(dummyProducts);
      }
    } catch (error) {
      setProducts(dummyProducts);
    }
  };
  // add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems || {}); // safeguard for undefined

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success(`cart updated`);
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += cartItems[items] * itemInfo.offerPrice;
      }
    }
    
    // Social Discount Logic
    let discount = 0;
    if (participantCount === 2) discount = 0.02; // 2% off
    else if (participantCount >= 3) discount = 0.05; // 5% off
    
    totalAmount = totalAmount * (1 - discount);
    
    return Math.floor(totalAmount * 100) / 100;
  };
  // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success(`remove from cart`);
      setCartItems(cartData);
    }
  };
  // sync shared cart items
  const syncSharedCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("/api/cart/sync");
      if (data.success) {
        setCartItems(data.cartItems || {});
        if (data.isShared) {
          setParticipantCount(data.participantCount || 1);
        } else {
          setParticipantCount(1);
        }
      }
    } catch (error) {
      // Sync error handled quietly or via toast if critical
    }
  };

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // Polling for collaborative cart updates
  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(() => {
        syncSharedCart();
      }, 5000); // sync every 5 seconds
    }
    return () => clearInterval(interval);
  }, [user]);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const startCollaboration = async () => {
    try {
      const { data } = await axios.get("/api/cart/start");
      if (data.success) {
        setCollaborationId(data.roomId);
        toast.success("Room created! Share the link with friends.");
        await syncSharedCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start collaboration");
    }
  };

  const joinCollaboration = async (roomId) => {
    try {
      const { data } = await axios.post("/api/cart/join", { roomId });
      if (data.success) {
        setCollaborationId(roomId);
        setCartItems(data.cartItems);
        setParticipantCount(data.participantCount || 1);
        toast.success("Welcome to the shared cart!");
        await syncSharedCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Room ID");
    }
  };

  const leaveCollaboration = async () => {
    try {
      const { data } = await axios.get("/api/cart/leave");
      if (data.success) {
        setCollaborationId(null);
        toast.success("Back to your private cart.");
        await fetchUser(); // reload personal cart
      }
    } catch (error) {
      toast.error("Failed to leave collaboration");
    }
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
    collaborationId,
    setCollaborationId,
    participantCount,
    syncSharedCart,
    startCollaboration,
    joinCollaboration,
    leaveCollaboration
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
