// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Blue Carbon Credit Registry
contract BlueCarbonCredits {
    address public nccr;
    uint256 public nextTokenId = 1;
    uint256 public nextTxId = 1;

    struct Credit {
        uint256 id;
        address owner;
        bool retired;
    }

    struct Transaction {
        uint256 id;
        string txType;      // "APPROVE" | "TRANSFER" | "RETIRE"
        address from;
        address to;
        uint256 creditId;
        uint256 timestamp;
    }

    mapping(uint256 => Credit) public credits;
    mapping(address => uint256[]) public ownedCredits;
    Transaction[] public allTransactions;

    event CreditGenerated(address indexed owner, uint256 indexed creditId);
    event CreditTransferred(uint256 indexed creditId, address from, address to);
    event CreditRetired(uint256 indexed creditId, address owner);

    constructor(address _nccr) {
        require(_nccr != address(0), "Invalid NCCR address");
        nccr = _nccr;
    }

    modifier onlyNCCR() {
        require(msg.sender == nccr, "Only NCCR can call this");
        _;
    }

    /// @notice NCCR generates credits for an NGO
    function generateCredits(address ngo, uint256 amount) external onlyNCCR {
        require(ngo != address(0), "Invalid NGO address");
        require(ngo != nccr, "Not Possible"); // NCCR cannot generate credits for itself
        require(amount > 0, "Amount must be > 0");

        for (uint256 i = 0; i < amount; i++) {
            uint256 creditId = nextTokenId++;
            credits[creditId] = Credit(creditId, ngo, false);
            ownedCredits[ngo].push(creditId);

            emit CreditGenerated(ngo, creditId);

            allTransactions.push(Transaction(
                nextTxId++, "APPROVE", msg.sender, ngo, creditId, block.timestamp
            ));
        }
    }





  


    /// @notice Transfer a number of credits to another address
    function transferCredits(address to, uint256 amount) external {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        uint256[] storage userCredits = ownedCredits[msg.sender];
        require(userCredits.length >= amount, "Not enough credits");

        for (uint256 i = 0; i < amount; i++) {
            uint256 creditId = userCredits[userCredits.length - 1]; // take last
            userCredits.pop();

            require(!credits[creditId].retired, "Credit already retired"); // ✅ check

            credits[creditId].owner = to;
            ownedCredits[to].push(creditId);

            emit CreditTransferred(creditId, msg.sender, to);

            allTransactions.push(Transaction(
                nextTxId++, "TRANSFER", msg.sender, to, creditId, block.timestamp
            ));
        }
    }

    /// @notice Retire a number of credits
    function retireCredits(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        uint256[] storage userCredits = ownedCredits[msg.sender];
        require(userCredits.length >= amount, "Not enough credits");

        for (uint256 i = 0; i < amount; i++) {
            uint256 creditId = userCredits[userCredits.length - 1]; // take last
            userCredits.pop();

            require(!credits[creditId].retired, "Credit already retired"); // ✅ check


            credits[creditId].owner = nccr;
            credits[creditId].retired = true;
            ownedCredits[nccr].push(creditId);

            emit CreditRetired(creditId, msg.sender);

            allTransactions.push(Transaction(
                nextTxId++, "RETIRE", msg.sender, nccr, creditId, block.timestamp
            ));
        }
    }

    // ------------------------
    // View Functions
    // ------------------------
    function getOwnedCredits(address owner) external view returns (uint256[] memory) {
        return ownedCredits[owner];
    }

    function getCredit(uint256 creditId) external view returns (Credit memory) {
        return credits[creditId];
    }

    function getAllTransactions() external view returns (Transaction[] memory) {
        return allTransactions;
    }

    function getWalletBalance(address owner) external view returns (uint256 total) {
        uint256[] memory ids = ownedCredits[owner];
        for (uint256 i = 0; i < ids.length; i++) {
            if (!credits[ids[i]].retired) total++;
        }
    }
}
