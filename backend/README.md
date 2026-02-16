# EWaste Tracker - Backend API

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
CONTRACT_ADDRESS=<your_deployed_contract_address>
PRIVATE_KEY=<your_wallet_private_key>
FRONTEND_URL=http://localhost:3000
```

**Important:** Use the same `PRIVATE_KEY` and `CONTRACT_ADDRESS` from contract deployment.

### 3. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 📋 API Endpoints

### `GET /api/health`
Health check and blockchain status

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "blockchain": {
    "connected": true,
    "balance": "0.5 MATIC",
    "totalDevices": 10
  }
}
```

---

### `POST /api/register-device`
Register new e-waste device

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
    "deviceId": 1,
    "co2Saved": 280,
    "toxicWastePrevented": 0.375,
    "sustainabilityScore": 85,
    "impactType": "projected"
  }
}
```

---

### `POST /api/update-status`
Update device lifecycle status

**Request:**
```json
{
  "deviceId": 1,
  "newStatus": "Recycled"
}
```

**Response:**
```json
{
  "success": true,
  "deviceId": 1,
  "newStatus": "Recycled",
  "transactionHash": "0x...",
  "verifiedImpact": {
    "deviceId": 1,
    "co2Saved": 280,
    "toxicWastePrevented": 0.375,
    "sustainabilityScore": 85,
    "impactType": "verified"
  }
}
```

---

### `GET /api/device/:id`
Get device details with impact data

**Response:**
```json
{
  "success": true,
  "device": {
    "id": 1,
    "deviceType": "Laptop",
    "status": "Recycled",
    "weight": 2.5,
    "location": "Downtown Seattle",
    "transportDistance": 15
  },
  "projectedImpact": { ... },
  "verifiedImpact": { ... },
  "timeline": [
    {
      "status": "Disposed",
      "timestamp": 1234567890,
      "transactionHash": "0x..."
    }
  ]
}
```

---

### `POST /api/estimate-impact`
Estimate environmental impact (no registration)

**Request:**
```json
{
  "deviceType": "Phone",
  "weight": 0.2,
  "transportDistance": 30
}
```

**Response:**
```json
{
  "success": true,
  "impact": {
    "co2Saved": 70,
    "toxicWastePrevented": 0.024,
    "sustainabilityScore": 78,
    "impactType": "projected"
  }
}
```

---

### `GET /api/dashboard`
Get dashboard statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalDevices": 50,
    "totalCO2Saved": 12500,
    "totalToxicWastePrevented": 125,
    "averageSustainabilityScore": 82,
    "devicesByStatus": {
      "disposed": 10,
      "collected": 15,
      "recycled": 25
    }
  }
}
```

---

## 🏗️ Architecture

### Blockchain Service
- Handles all smart contract interactions
- Manages transaction signing and waiting
- Parses blockchain events

### Impact Calculator (AI Logic)
- Rule-based emission factors
- Device-specific calculations
- Transport distance adjustments
- Sustainability scoring (0-100)

### Data Store
- In-memory storage for MVP
- Device metadata (weight, location)
- Impact calculations (projected & verified)
- Timeline events

---

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Test Device Registration
```bash
curl -X POST http://localhost:5000/api/register-device \
  -H "Content-Type: application/json" \
  -d '{
    "deviceType": "Laptop",
    "weight": 2.5,
    "location": "Seattle"
  }'
```

---

## 🎯 Production Build

```bash
npm run build
npm start
```

---

## 🔧 Troubleshooting

### "PRIVATE_KEY not found"
- Ensure `.env` file exists
- Copy private key from MetaMask
- Don't include `0x` prefix

### "CONTRACT_ADDRESS not found"
- Deploy smart contract first
- Copy address from deployment output
- Update `.env` file

### "Insufficient funds"
- Get testnet MATIC from faucet
- Check wallet balance: `/api/health`

### Transaction failures
- Check wallet has MATIC
- Verify contract is deployed
- Check Mumbai testnet status

---

## 📊 AI Impact Calculator Logic

### Emission Factors
- **Laptop:** 280kg CO2
- **Phone:** 70kg CO2  
- **TV:** 400kg CO2

### Adjustments
- Weight multiplier (actual vs average)
- Transport emissions deduction
- Toxic waste calculation (device-specific %)

### Sustainability Score (0-100)
- CO2 saved: 0-60 points
- Toxic waste prevented: 0-25 points
- Transport distance: +/-15 points

---

## 🎬 Demo Tips

1. **Pre-register 5-10 devices** before demo
2. **Test all endpoints** with Postman/curl
3. **Check wallet balance** (need ~0.1 MATIC)
4. **Note example device IDs** for quick access
5. **Have backup data** in case blockchain is slow

---

## ✅ Next Steps

✅ Backend API complete
⬜ Build frontend
⬜ Connect frontend to backend
⬜ Final integration testing
