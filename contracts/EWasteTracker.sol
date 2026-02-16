// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EWasteTracker
 * @notice Simple e-waste lifecycle tracking contract for hackathon MVP
 * @dev Optimized for clarity and demo presentation, not production use
 */
contract EWasteTracker {
    
    // ============ State Variables ============
    
    address public owner;
    uint256 public deviceCounter;
    
    // ============ Structs ============
    
    struct Device {
        uint256 id;
        string deviceType;      // "Laptop", "Phone", "TV"
        string status;          // "Disposed", "Collected", "Recycled"
        address registeredBy;   // Backend wallet address
        uint256 registeredAt;   // Timestamp
        uint256 lastUpdated;    // Last status change timestamp
    }
    
    // ============ Storage ============
    
    // deviceId => Device
    mapping(uint256 => Device) public devices;
    
    // ============ Events ============
    
    event DeviceRegistered(
        uint256 indexed deviceId,
        string deviceType,
        address indexed registeredBy,
        uint256 timestamp
    );
    
    event StatusUpdated(
        uint256 indexed deviceId,
        string oldStatus,
        string newStatus,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier deviceExists(uint256 _deviceId) {
        require(_deviceId > 0 && _deviceId <= deviceCounter, "Device does not exist");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
        deviceCounter = 0;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Register a new e-waste device
     * @param _deviceType Type of device (Laptop, Phone, TV)
     * @return deviceId The newly created device ID
     */
    function registerDevice(string memory _deviceType) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(bytes(_deviceType).length > 0, "Device type cannot be empty");
        
        deviceCounter++;
        uint256 newDeviceId = deviceCounter;
        
        devices[newDeviceId] = Device({
            id: newDeviceId,
            deviceType: _deviceType,
            status: "Disposed",  // Initial status
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        emit DeviceRegistered(
            newDeviceId,
            _deviceType,
            msg.sender,
            block.timestamp
        );
        
        return newDeviceId;
    }
    
    /**
     * @notice Update device lifecycle status
     * @param _deviceId ID of the device to update
     * @param _newStatus New status ("Collected" or "Recycled")
     */
    function updateStatus(uint256 _deviceId, string memory _newStatus) 
        public 
        onlyOwner 
        deviceExists(_deviceId) 
    {
        require(bytes(_newStatus).length > 0, "Status cannot be empty");
        
        Device storage device = devices[_deviceId];
        string memory oldStatus = device.status;
        
        // Validate status progression
        require(
            !_compareStrings(oldStatus, _newStatus),
            "Status unchanged"
        );
        
        device.status = _newStatus;
        device.lastUpdated = block.timestamp;
        
        emit StatusUpdated(
            _deviceId,
            oldStatus,
            _newStatus,
            block.timestamp
        );
    }
    
    /**
     * @notice Get device details
     * @param _deviceId ID of the device
     * @return Device struct with all details
     */
    function getDevice(uint256 _deviceId) 
        public 
        view 
        deviceExists(_deviceId) 
        returns (Device memory) 
    {
        return devices[_deviceId];
    }
    
    /**
     * @notice Get total number of registered devices
     * @return Total device count
     */
    function getTotalDevices() public view returns (uint256) {
        return deviceCounter;
    }
    
    /**
     * @notice Transfer contract ownership (for deployment management)
     * @param _newOwner Address of new owner
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
    
    // ============ Internal Helpers ============
    
    /**
     * @dev Compare two strings for equality
     */
    function _compareStrings(string memory a, string memory b) 
        internal 
        pure 
        returns (bool) 
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
