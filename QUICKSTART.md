# 🚀 EWaste Tracker - Quick Start Guide

## 📦 What's Inside

This package contains a complete hackathon MVP for AI-powered blockchain e-waste tracking:

```
ewaste-tracker-mvp/
├── contracts/          # Solidity smart contracts
├── backend/           # Node.js + TypeScript API
├── frontend/          # Next.js + React application
└── README.md          # Full documentation
```

---

## ⚡ Setup in 15 Minutes

### Prerequisites
- Node.js 18+ installed
- MetaMask wallet
- Mumbai testnet MATIC ([Get free from faucet](https://faucet.polygon.technology/))

### Step 1: Deploy Smart Contract (5 min)

```bash
cd contracts
npm install
cp .env.example .env
# Edit .env - add your MetaMask private key
npm run deploy:mumbai
```

**💡 Save the contract address shown in the output!**

### Step 2: Start Backend (3 min)

```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env:
#   - Add CONTRACT_ADDRESS from step 1
#   - Add same PRIVATE_KEY as contracts
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 3: Start Frontend (2 min)

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

### Step 4: Test! (5 min)

1. Open `http://localhost:3000`
2. Click "Register Your Device"
3. Fill form (Laptop, 2.5kg, Seattle)
4. Watch blockchain transaction confirm
5. Update status: Disposed → Collected → Recycled
6. See confetti animation! 🎉
7. View dashboard with live stats

---

## 🎯 Demo Flow

**Perfect for 3-minute pitch:**

1. **Problem** (30s): Show homepage - explain e-waste crisis
2. **Solution** (30s): Explain blockchain + AI approach
3. **Live Demo** (90s):
   - Register device → blockchain tx
   - Update status → confetti
   - Dashboard → animated stats
4. **Impact** (30s): Show verified environmental metrics

---

## 📚 Documentation

- `README.md` - Full project documentation
- `contracts/CONTRACT_DEPLOYMENT.md` - Smart contract details
- `backend/README.md` - API documentation
- Check inline code comments for implementation details

---

## ⚠️ Common Issues

**"Insufficient funds"**
→ Get Mumbai MATIC: https://faucet.polygon.technology/

**"Contract not found"**
→ Make sure CONTRACT_ADDRESS in backend/.env matches deployed contract

**"Port already in use"**
→ Kill process: `lsof -ti:5000 | xargs kill -9`

---

## 🏆 Hackathon Tips

1. **Test before presenting** - Run full flow 2-3 times
2. **Have backup** - Pre-register 5-10 devices
3. **Check balance** - Need ~0.5 MATIC for demo
4. **Open tabs** - PolygonScan, Dashboard, Device page
5. **Practice timing** - 3-min demo script

---

## 🚀 What Makes This Win

✅ **Complete MVP** - Smart contract → backend → frontend
✅ **Production quality** - Clean code, TypeScript, documentation
✅ **Real innovation** - Blockchain + AI hybrid
✅ **Smooth UX** - Animations, confetti, responsive design
✅ **Actual impact** - Solves real e-waste crisis

---

## 📞 Need Help?

Check these first:
- `/api/health` endpoint - Is backend running?
- Browser console - Any JavaScript errors?
- PolygonScan - Did transactions confirm?

---

**Built with 💚 for a sustainable future**

Blockchain + AI = Transparent Environmental Impact
