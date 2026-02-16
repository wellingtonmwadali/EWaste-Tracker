# EWaste Tracker - Smart Contract Deployment Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Mumbai Testnet MATIC
1. Create a MetaMask wallet (or use existing)
2. Get your private key: MetaMask → Account → ... → Account Details → Export Private Key
3. Get free testnet MATIC: https://faucet.polygon.technology/
   - Select Mumbai network
   - Paste your wallet address
   - Click "Submit"

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PRIVATE_KEY=your_metamask_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=optional_for_verification
```

### 4. Compile Contract
```bash
npm run compile
```

### 5. Deploy to Mumbai
```bash
npm run deploy:mumbai
```

**Save the contract address!** You'll need it for the backend.

---

## 📋 Contract Functions (For Backend Integration)

### `registerDevice(string deviceType)`
- Registers new e-waste device
- Returns: deviceId (uint256)
- Emits: `DeviceRegistered` event

### `updateStatus(uint256 deviceId, string newStatus)`
- Updates device lifecycle status
- Accepts: "Collected" or "Recycled"
- Emits: `StatusUpdated` event

### `getDevice(uint256 deviceId)`
- Returns device details
- Returns: Device struct

### `getTotalDevices()`
- Returns total registered devices
- Returns: uint256

---

## 🔍 Verify Contract on PolygonScan

After deployment:
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

---

## 🧪 Test Locally (Optional)

```bash
# Start local hardhat node
npx hardhat node

# In another terminal, deploy
npm run deploy:local
```

---

## ⚠️ Important for Demo

1. **Keep private key secure** - Don't commit .env file
2. **Fund wallet with ~0.5 MATIC** - Enough for 100+ transactions
3. **Test registration before demo** - Ensure contract works
4. **Note contract address** - Backend needs this

---

## 📊 Expected Gas Costs

- Deploy contract: ~0.02 MATIC
- Register device: ~0.0008 MATIC  
- Update status: ~0.0005 MATIC

Total for 50 demo devices: ~0.07 MATIC ($0.05 USD)

---

## 🎯 Next Steps

✅ Smart contract deployed
⬜ Build backend API
⬜ Build frontend
⬜ Connect everything

**Ready for backend development!**
