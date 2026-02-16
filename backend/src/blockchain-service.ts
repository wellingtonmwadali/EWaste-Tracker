import { ethers } from 'ethers';
import { CONTRACT_ABI } from './contract-abi';
import { Device } from './types';

/**
 * Blockchain Service
 * Handles all smart contract interactions
 */

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  
  constructor() {
    // Initialize provider with timeout configuration
    const rpcUrl = process.env.MUMBAI_RPC_URL || "https://rpc-amoy.polygon.technology";
    this.provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
      staticNetwork: true,
      batchMaxCount: 1,
    });
    // Set longer timeout for slow networks
    this.provider.pollingInterval = 12000; // 12 seconds
    
    // Initialize wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in environment variables');
    }
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    
    // Initialize contract
    let contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('CONTRACT_ADDRESS not found in environment variables');
    }
    
    // Validate contract address format
    // if (contractAddress === 'your_deployed_contract_address_here') {
    //   throw new Error('Invalid CONTRACT_ADDRESS. Please deploy the smart contract first and update the .env file.');
    // }
    
    // Add 0x prefix if missing
    if (!contractAddress.startsWith('0x')) {
      contractAddress = '0x' + contractAddress;
    }
    
    this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
    
    console.log('✅ Blockchain service initialized');
    console.log('📍 Contract address:', contractAddress);
    console.log('👤 Wallet address:', this.wallet.address);
  }
  
  /**
   * Register a new device on blockchain
   */
  async registerDevice(deviceType: string): Promise<{ deviceId: number; txHash: string }> {
    try {
      console.log(`📝 Registering ${deviceType} on blockchain...`);
      
      // Call smart contract
      const tx = await this.contract.registerDevice(deviceType);
      console.log('⏳ Transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);
      console.log('📋 Receipt logs count:', receipt.logs.length);
      
      // Parse event to get device ID using contract event filters
      let deviceId: number | null = null;
      
      // Method 1: Try using getEvent from the receipt
      for (const log of receipt.logs) {
        try {
          // Check if this log is from our contract
          if (log.address.toLowerCase() !== (await this.contract.getAddress()).toLowerCase()) {
            continue;
          }
          
          const parsed = this.contract.interface.parseLog({
            topics: [...log.topics],
            data: log.data
          });
          
          console.log('🔍 Parsed event:', parsed?.name);
          
          if (parsed && parsed.name === 'DeviceRegistered') {
            deviceId = Number(parsed.args[0]);
            console.log(`✅ Device registered with ID: ${deviceId}`);
            break;
          }
        } catch (error) {
          console.log('⚠️ Could not parse log:', error);
          continue;
        }
      }
      
      // Method 2: Query the contract for total devices if event parsing fails
      if (deviceId === null) {
        console.log('⚠️ Event not found, querying contract for device count...');
        try {
          const totalDevices = await this.contract.getTotalDevices();
          deviceId = Number(totalDevices);
          console.log(`✅ Got device ID from contract: ${deviceId}`);
        } catch (error: any) {
          console.error('❌ Error querying contract:', error.message);
          console.error('Full error:', error);
          throw new Error(`DeviceRegistered event not found in transaction and could not query contract: ${error.message}`);
        }
      }
      
      return {
        deviceId,
        txHash: receipt.hash,
      };
      
    } catch (error: any) {
      console.error('❌ Error registering device:', error.message);
      throw new Error(`Failed to register device: ${error.message}`);
    }
  }
  
  /**
   * Update device status on blockchain
   */
  async updateDeviceStatus(deviceId: number, newStatus: string): Promise<string> {
    try {
      console.log(`📝 Updating device ${deviceId} to status: ${newStatus}...`);
      
      // Call smart contract
      const tx = await this.contract.updateStatus(deviceId, newStatus);
      console.log('⏳ Transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);
      
      return receipt.hash;
      
    } catch (error: any) {
      console.error('❌ Error updating status:', error.message);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }
  
  /**
   * Get device details from blockchain
   */
  async getDevice(deviceId: number): Promise<Device> {
    try {
      const device = await this.contract.getDevice(deviceId);
    
      return {
        id: Number(device.id),
        deviceType: device.deviceType,
        status: device.status,
        registeredBy: device.registeredBy,
        registeredAt: Number(device.registeredAt),
        lastUpdated: Number(device.lastUpdated),
      };
      
    } catch (error: any) {
      console.error('❌ Error fetching device:', error.message);
      throw new Error(`Failed to fetch device: ${error.message}`);
    }
  }
  
  /**
   * Get total number of registered devices
   */
  async getTotalDevices(): Promise<number> {
    try {
      const total = await Promise.race([
        this.contract.getTotalDevices(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout - RPC too slow')), 15000)
        )
      ]);
      console.log(`📊 Total devices registered: ${total}`);
      return Number(total);
      
    } catch (error: any) {
      console.error('❌ Error fetching total devices:', error.message);
      // Return 0 if blockchain is unreachable instead of crashing
      if (error.message.includes('timeout')) {
        console.log('⚠️ Timeout - returning 0 devices. Check RPC endpoint.');
        return 0;
      }
      throw new Error(`Failed to fetch total devices: ${error.message}`);
    }
  }
  
  /**
   * Check wallet balance
   */
  async getBalance(): Promise<string> {
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error: any) {
      console.error('❌ Error fetching balance:', error.message);
      return '0';
    }
  }
}

// Singleton instance
export const blockchainService = new BlockchainService();
