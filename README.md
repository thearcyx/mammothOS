# **MammothOS**

MammothOS is a **Windows 98-styled operating system** built with **Vite and ReactJS**, powered by **Para**. It offers a **retro-inspired digital environment** featuring apps, games, and a seamless **on-chain experience** with a **gasless wallet**.

Games are developed using **PhaserJS** and played with a **pre-generated wallet by Para**, enabling frictionless blockchain interactions. Leveraging **ethers.js**, MammothOS connects effortlessly to blockchains and smart contracts, providing a smooth and immersive Web3 experience.

---

## **Tech Stack**
### **Frontend**
- **React & Redux** – Component-based UI with state management.
- **TailwindCSS** – Utility-first styling framework.
- **PhaserJS** – 2D game engine for browser-based games.

### **Backend**
- **Node.js & Express** – Server-side logic and API handling.
- **AWS SDK (DynamoDB)** – NoSQL database storage.
- **JWT (JSON Web Tokens)** – Secure authentication.
- **Para SDK & Ethers.js** – Web3 wallet integration and smart contract interactions.
- **Crypto-JS** – Secure encryption and hashing.

---

## **System Overview**
### **Frontend**

#### **Apps**
- **Discord.jsx**  
  Displays the Mammoths Overlord Discord server widget, allowing users to view and join the server.

- **Documents.jsx**  
  A **Windows 98-style** file explorer for viewing stored documents.

- **IExplorer.jsx**  
  A **Windows 98-style** internet explorer interface.

- **Mammoth.jsx**  
  Displays a **GIF of the Mammoths NFT Collection**.

- **Mammoths.jsx**  
  A **Phaser.js-based Snake game** featuring mammoths instead of a snake.
  - Runs inside `useEffect` for controlled execution.
  - Uses a **custom game loop** to update movement and interactions.
  - Supports **keyboard inputs** for directional control.
  - Features **collision detection** with the game boundaries and itself.
  - Expands when consuming food, spawning new food each time.
  - Ends when colliding with the body, world bounds, or reaching max length.

- **Mockey.jsx**  
  A **Phaser.js-based Pong game** featuring an **ice hockey** theme.
  - Uses **custom ball physics** for realistic bounce effects.
  - Implements an **AI goalie** for single-player mode.
  - Ends when either the player or the AI reaches 5 points.

- **Recycle.jsx**  
  A **Windows 98-style recycle bin interface**.

- **Tetris.jsx**  
  A **Phaser.js-based Tetris game** featuring **iced tetrominoes**.
  - Implements **classic Tetris mechanics** with keyboard controls.
  - Features a **leveling system** based on cleared lines.
  - Ends when the **tetrominoes reach the top**.

- **Twitter.jsx**  
  A **Windows 98-styled** interface inspired by X (formerly Twitter).

#### **Components**
##### **UI**
- **Popup.jsx**  
  A **popup window** that appears after a game ends, allowing players to save their score on-chain.
  - **Draggable window** for repositioning.
  - Uses **Web3 hooks** to mint NFTs or check if an NFT has already been minted.

- **Startup.jsx**  
  A **startup screen** for users who haven't logged in yet.
  - Plays **three phases** before completing setup.
  - Creates a **wallet** in the third phase, linked to the user's X account.

- **Wallet.jsx**  
  A **Windows 98-style wallet app** displaying **badges as game prestige NFTs** and checking if they have been minted.
  - Will include a **wallet claiming feature** in future updates.

- **Window.jsx**  
  The **main container** for all apps.
  - Spawns all apps within this component.
  - Passes the `openPopup` function to relevant apps.
  - Manages core app features and interactions.

#### **Hooks**
- **useWeb3.js**  
  Connects with the backend to access **wallet functions** and **mint NFTs**.

---

### **Backend**

#### **Server**
- **server.js**  
  Handles **all frontend API calls** and integrates with Web3.
  - Implements **HTTPS cookies** to verify signed-in users.

#### **Helpers**
- **encryption.jsx**  
  Provides **AES-based encryption** for secure data handling.

#### **Modules**
- **admin.js**  
  Loads the **contract ABI** and connects to the contract.
  - Supports **mintNFTWithSignature** and **getOwnedTypes**.

- **dynamoDB.js**  
  Handles **AWS DynamoDB operations**.
  - Reads and writes **user data** securely.

- **paraWallet.js**  
  Manages **Para-based wallet operations**.
  - Creates **Para Server instances** for authentication.
  - Manages **active OAuth sessions** for secure login.
  - Checks **wallet existence** and creates **pregen wallets** for X account users.
  - Supports **signing messages** with the wallet.

---
## **Roadmap** 🚀

### ✅ **Phase 1: Post-Mammothon (Current Stage)**
- Integrate new games and NFT collections.
- Develop custom games in collaboration with NFT and Dapp projects.
- Implement the Claim Pre-generated Wallet feature.
- Expand OS functionalities with new elements like a sound player.

### 🔄 **Phase 2: Q2**
- Introduce an XP system, allowing players to earn XP by playing games and minting badges.
- Develop quest-based games to enhance player engagement.
- Implement XP rewards for active users.

---

## **Demo Images** 📸

![Startup](https://i.imgur.com/BPrn5fl.png)
![Desktop](https://i.imgur.com/KzligFo.png)
![Mammoths](https://i.imgur.com/hcG5Cqp.png)
![Tetris](https://i.imgur.com/VIiCxhb.png)
![Mockey](https://i.imgur.com/cz4vCgx.png)
![Wallet](https://i.imgur.com/PnnKisU.png)
![Other Apps](https://i.imgur.com/ozPQBuf.png)
