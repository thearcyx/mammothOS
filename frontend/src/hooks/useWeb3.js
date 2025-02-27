const API_URL = import.meta.env.VITE_API_URL;

export const fetchWallet = async () => {
  try {
    let response = await fetch(`${API_URL}/getWallet`, {
      method: "GET",
      credentials: "include",
    });

    let data = await response.json();

    if (response.status === 200) {
      console.log("✅ Wallet Fetched:", data.wallet.address);
      return data.wallet;
    } else {
      console.error("❌ Wallet Fetch Failed:", data.message);
      return null;
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    return null;
  }
};

export async function mintNFT(tokenId) {
  try {
    const wallet = await fetchWallet();
    const recipient = wallet.address;
    
    if(wallet.ownedMammothOSBadges.includes(tokenId)) {
      return { success: false, txReceipt: null, message: "NFT already minted." };
    }

    const response = await fetch(`${API_URL}/mintNFT`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ recipient, tokenId }), // ✅ Sadece tokenId gönderiyoruz
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("❌ Minting Error:", error);
    alert("An error occurred while minting.");
  }
}
