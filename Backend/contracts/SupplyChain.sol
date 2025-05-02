// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SupplyChain {
    enum Status { Confirmed, Processing, AllApproved, InTransit, Delivered }
    
    struct Transaction {
        uint256 orderId;
        string itemId;
        string itemName;
        uint256 quantity;
        string category;
        Status status;
    }
    
    Transaction[] public transactions;
    mapping(address => Transaction[]) private userTransactions;
    mapping(uint256 => uint256) private orderIdToIndex;
    mapping(uint256 => bool) public orderIdExists;
    address public admin;

    event TransactionAdded(uint256 indexed orderId, address indexed sender, address indexed receiver);
    event StatusUpdated(uint256 indexed orderId, Status newStatus);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addTransaction(
        uint256 _orderId,
        string memory _itemId,
        string memory _itemName,
        uint256 _quantity,
        string memory _category
    ) external {
        require(!orderIdExists[_orderId], "Order ID already exists");
        
        Transaction memory newTransaction = Transaction(
            _orderId,
            _itemId,
            _itemName,
            _quantity,
            _category,
            Status.Confirmed
        );
        
        transactions.push(newTransaction);
        uint256 index = transactions.length - 1;
        orderIdToIndex[_orderId] = index;
        orderIdExists[_orderId] = true;
        
        userTransactions[msg.sender].push(newTransaction);
        
        emit TransactionAdded(_orderId, msg.sender, address(0));
    }

    function updateStatus(uint256 _orderId, Status _newStatus) external onlyAdmin {
        require(orderIdExists[_orderId], "Order ID does not exist");
        uint256 index = orderIdToIndex[_orderId];
        Transaction storage transaction = transactions[index];
        
        require(uint8(_newStatus) == uint8(transaction.status) + 1, "Invalid status transition");
        require(transaction.status != Status.Delivered, "Transaction already delivered");

        transaction.status = _newStatus;
        emit StatusUpdated(_orderId, _newStatus);
    }

    function getUserTransactions() external view returns (Transaction[] memory) {
        return userTransactions[msg.sender];
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}