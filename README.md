# 🌱 EWaste Tracker - AI-Powered Blockchain E-Waste Platform

> **Hackathon MVP**: Transparent e-waste lifecycle tracking with blockchain immutability and AI-powered environmental impact measurement.

---

## 🎯 Project Overview

**Problem**: 53.6M tons of e-waste generated annually, with only 17.4% properly recycled. Zero transparency in disposal process.

**Solution**: Blockchain + AI platform that:
- ✅ Tracks device lifecycle (Disposed → Collected → Recycled)
- ✅ Calculates real environmental impact (CO₂ saved, toxic waste prevented)
- ✅ Provides verified, immutable records on Polygon blockchain
- ✅ Displays aggregate impact through live dashboard

---

## 🏗️ Architecture

### **Smart Contract** (Solidity)
- Deployed on Polygon Mumbai testnet
- Device registration with auto-incrementing IDs
- Status updates (Disposed → Collected → Recycled)
- Event emissions for backend tracking

### **Backend** (Node.js + TypeScript + Express)
- Handles all blockchain interactions (no MetaMask required)
- AI impact calculator with emission factors
- REST API for frontend communication
- In-memory data store (MVP simplicity)

### **Frontend** (Next.js 14 + TypeScript + Tailwind)
- Server-side rendered pages
- Real-time dashboard with animated counters
- Device registration and tracking
- Timeline visualization with confetti celebration

---

## 🚀 Quick Start (15 minutes)

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Mumbai testnet MATIC (free from faucet)

### 1️⃣ Deploy Smart Contract

```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your wallet private key
npm run deploy:mumbai
# Save the contract address!
```

### 2️⃣ Start Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env:
#   CONTRACT_ADDRESS=<from step 1>
#   PRIVATE_KEY=<same as contract deployment>
npm run dev
# Backend runs on http://localhost:5000
```

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
# Frontend runs on http://localhost:3000
```

### 4️⃣ Test the Flow

1. Visit `http://localhost:3000`
2. Click "Register Your Device"
3. Fill form: Laptop, 2.5kg, "Downtown Seattle"
4. Submit → Wait for blockchain confirmation
5. View device page with projected impact
6. Update status to "Collected" → "Recycled"
7. See confetti + verified impact! 🎉
8. Check dashboard for aggregate stats

---

## 📁 Project Structure

```
ewaste-tracker/
├── contracts/              # Smart contracts
│   ├── EWasteTracker.sol  # Main contract
│   ├── deploy.ts          # Deployment script
│   └── hardhat.config.ts  # Hardhat config
│
├── backend/               # Backend API
│   └── src/
│       ├── index.ts       # Express server
│       ├── routes.ts      # API endpoints
│       ├── blockchain-service.ts  # Contract interaction
│       ├── impact-calculator.ts   # AI logic
│       ├── data-store.ts  # In-memory storage
│       └── types.ts       # TypeScript types
│
└── frontend/              # Next.js frontend
    └── src/
        ├── app/
        │   ├── page.tsx          # Home page
        │   ├── register/page.tsx # Registration
        │   ├── device/[id]/page.tsx  # Device details
        │   └── dashboard/page.tsx    # Dashboard
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Timeline.tsx
        │   ├── AnimatedCounter.tsx
        │   └── Confetti.tsx
        └── lib/
            └── api.ts     # API client
```

---

## 🔌 API Endpoints

### `POST /api/register-device`
Register new device on blockchain

**Request:**
```json
{
  "deviceType": "Laptop",
  "weight": 2.5,
  "location": "Downtown Seattle"
}
```

**Response:**
```json
{
  "success": true,
  "deviceId": 1,
  "transactionHash": "0x...",
  "projectedImpact": {
    "co2Saved": 280,
    "toxicWastePrevented": 0.375,
    "sustainabilityScore": 85
  }
}
```

### `POST /api/update-status`
Update device lifecycle status

**Request:**
```json
{
  "deviceId": 1,
  "newStatus": "Recycled"
}
```

### `GET /api/device/:id`
Get device details with impact data

### `GET /api/dashboard`
Get aggregate statistics

---

## 🧠 AI Impact Calculator

### Emission Factors (kg CO₂)
- **Laptop**: 280kg
- **Phone**: 70kg
- **TV**: 400kg

### Calculation Logic
1. Base CO₂ from device type
2. Weight adjustment multiplier
3. Transport emissions deduction
4. Toxic waste percentage (device-specific)
5. Sustainability score (0-100)

### Score Components
- CO₂ saved: 0-60 points
- Toxic waste prevented: 0-25 points
- Transport distance: +/-15 points

---

## 🎬 Demo Script (3 minutes)

### **Slide 1: Problem** (30s)
"53 million tons of e-waste yearly. Only 17% recycled. Zero transparency."

### **Slide 2: Solution** (30s)
"Blockchain tracking + AI impact = Verified environmental results."

### **Slide 3: Live Demo** (90s)
1. Show homepage → "Track E-Waste, Save the Planet"
2. Register device → Form submission
3. Show blockchain transaction on PolygonScan
4. Update status → Collected → Recycled
5. Confetti animation! 🎉
6. Dashboard → Real numbers, animated counters

### **Slide 4: Impact** (30s)
"Every device tracked. Every impact verified. Transparent. Immutable. Actionable."

---

## 🏆 Hackathon Judging Points

### ✅ **Innovation**
- Blockchain + AI hybrid approach
- Real-time impact calculation
- Verified vs projected impact distinction

### ✅ **Technical Execution**
- Full-stack TypeScript
- Clean architecture
- Production-ready code quality
- Zero external dependencies (vanilla Solidity)

### ✅ **Real-World Impact**
- Solves actual e-waste crisis
- Scalable to enterprise/government
- Clear environmental metrics

### ✅ **UX/Demo Quality**
- Beautiful dark mode UI
- Smooth animations
- Confetti celebration (emotional hook!)
- Mobile-responsive

---

## 🐛 Troubleshooting

### "Insufficient funds"
→ Get Mumbai MATIC: https://faucet.polygon.technology/

### "Contract not found"
→ Deploy contract first, update `CONTRACT_ADDRESS` in backend `.env`

### "Network error"
→ Check backend is running on port 5000

### "Device not found"
→ Backend and blockchain must use same contract address

---

## 🚀 Production Deployment

### Smart Contract
→ Deploy to Polygon mainnet (change RPC URL)

### Backend
→ Deploy to Railway/Render/Fly.io with PostgreSQL

### Frontend
→ Deploy to Vercel (automatic from GitHub)

**Environment Variables:**
- Frontend: `NEXT_PUBLIC_API_URL=https://your-backend.com`
- Backend: Update `FRONTEND_URL`, `CONTRACT_ADDRESS`

---

## 📊 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Blockchain** | Polygon Mumbai | Fast, low-cost testnet |
| **Smart Contract** | Solidity 0.8.19 | Industry standard |
| **Backend** | Node.js + TypeScript | Type safety, async handling |
| **API** | Express | Minimal, proven |
| **Frontend** | Next.js 14 | SSR, performance, SEO |
| **Styling** | Tailwind CSS | Rapid development |
| **Blockchain Client** | Ethers.js v6 | Modern, well-maintained |

---

## 🎯 Future Enhancements (Post-Hackathon)

- [ ] ML model for impact prediction
- [ ] Multi-chain support (Ethereum, BSC)
- [ ] IoT integration (QR codes, NFC tags)
- [ ] Recycling facility partnerships
- [ ] NFT certificates for recycled devices
- [ ] Carbon credit tokenization
- [ ] Mobile app (React Native)
- [ ] Government dashboard integration

---

## 📝 License

MIT License - Built for hackathon demonstration

---

## 🙏 Acknowledgments

Built with 💚 for a sustainable future.

**Key Features:**
- ♻️ Transparent lifecycle tracking
- 🤖 AI-powered impact measurement
- 🔗 Blockchain immutability
- 📊 Real-time dashboard
- 🎉 Delightful UX

---

## 📞 Support

Issues? Questions?
- Check `/api/health` endpoint
- Review browser console for errors
- Verify blockchain transactions on PolygonScan

**Demo-ready in 15 minutes. Impact-ready forever.** 🌍
