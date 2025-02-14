import { Connection } from "@solana/web3.js";
import { walletStore } from "$lib/wallet/walletStore.svelte";
import toast from "svelte-french-toast";

const LOCAL_STORAGE_KEY = "rsvp-walletaddress";

// Check if Phantom wallet is available
export const checkWallet = async () => {
  if ("solana" in window && window?.solana?.isPhantom) {
    console.info("Phantom wallet found!");
    return window.solana;
  } else {
    console.warn("Phantom wallet not found. Please install it.");
    toast.error("Phantom wallet not found");

    return null;
  }
};

// Connect to the wallet
export const connectWallet = async (connection?: Connection) => {
  const wallet = await checkWallet();
  if (!wallet) return;
  try {
    const response = await wallet.connect();
    const walletAddress = response.publicKey.toString();

    // TODO: replace this with api - rpc will be handled by backend
    const balance = 1;

    // update wallet store with wallet address and balance
    walletStore.update((store) => ({
      ...store,
      walletAddress,
      balance: 1,
    }));

    // store wallet address in local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, walletAddress);

    return { walletAddress, balance };
  } catch (error) {
    console.error("Wallet connection failed:", error);
  }
};

export const disconnectWallet = async () => {
  const wallet = await checkWallet();
  if (!wallet) return;

  try {
    // Disconnect the wallet
    await wallet.disconnect();

    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Clear wallet information from the store
    walletStore.update((store) => ({
      ...store,
      walletAddress: null,
      balance: 0,
    }));

    // Optional: Clear other session data if needed
    // For example, if you store token data or other wallet-related data in localStorage or sessionStorage
  } catch (error) {
    console.error("Wallet disconnection failed:", error);
  }
};
