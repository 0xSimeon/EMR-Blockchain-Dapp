// SPDX-License-Identifier:GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title A Medical Record management and storage
/// @author Simeon Udoh
/// @dev All methods are live, use responsibly. 
/// @custom:experimental This is an experimental contract still in active development.

contract MedicalRecord {

    /// @dev: This is to keep track of the patient count in the system. 
    using Counters for Counters.Counter;
    Counters.Counter public patientId;

    /// @dev This is the structure for patient record. 
    struct PatientData {
        uint256 id;
        address patientWalletAddress;
        string patientIPFSHash;
        string [] reports;
        bytes32 txHash;
        uint256 dateCreated;
    }
    
    /// @custom:event On-chain events to keep track of patientData
    event LogPatientData(
        uint256 id,
        address patientWalletAddress,
        string patientIPFSHash,
        bytes32 txHash,
        uint256 dateCreated
    );


    /// @dev stucture for patient reports
    ///@notice feature still in active development. 
    struct PatientMedicalReport {
        address patientWalletAddress;
        string testResult;
        bytes32 txHash;
        uint256 dateCreated;
    }

    ///@custom:event to keep track of patient reports
    event LogPatientMedicalReport(
        address patientWalletAddress,
        string testResult,
        bytes32 txHash,
        uint256 dateCreated
    );

    /***
    @dev: State variables. 
    @author: Simeon Udoh
    */ 

    uint256 public patientCount;

    PatientData [] public patients;
    PatientMedicalReport [] public patientReports;

    /***
    @dev: This is the state variable for the contract owner.
    @notice: See the constructor to see where this value is gotten. 
     */
    address public owner; 

    /// @dev keep track of addresses in the system. 
    ///@notice Mapping of address to boolean. 
    mapping(address => bool) public isExist;

    /***
    @dev: owner is defined automatically when the contract is deployed. 
    @notice: deployer of contract === owner. 
    */
    constructor(){
       owner = msg.sender;
    }

    ///@dev 
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier contractOwnerOrDataOwner(address dataOwner) {
        require(msg.sender == owner || msg.sender == dataOwner, "You are not the owner");
        _; 
    }

 

// Param: Patient wallet address, IPFS hash
     function addPatient( 
        address _patientWalletAddress,
        string memory _patientIPFSHash
        
        ) public onlyOwner  {
        require(isExist[_patientWalletAddress] != true, "Patient record already exist");
        require(bytes(_patientIPFSHash).length > 0, "IPFS Hash required");
        uint256 _id = patientId.current();

    
        // bytes32 getHash =  keccak256(abi.encode(_patientWalletAddress, _patientIPFSHash));

        string[] memory arr;
        bytes32 txHash = blockhash(block.number);
        uint256 dateCreated = block.timestamp;
        patients.push(PatientData(_id,_patientWalletAddress, _patientIPFSHash, arr, txHash, dateCreated));
        patientId.increment();
        isExist[_patientWalletAddress] = true;
        emit LogPatientData(patientCount, _patientWalletAddress, _patientIPFSHash, txHash, dateCreated);
    }

    function addHash(bytes32 hash) public {
        uint256 previousIndex = 1;
        uint256 currentCounter = patientId.current();
        require(currentCounter > 0, "No previous transaction exists");
        PatientData storage pd = patients[currentCounter - previousIndex];
        pd.txHash = hash;
    }

    function getAllpatients() public view returns(PatientData [] memory){
        return patients;
    }

    function getPatientData(uint256 _index, address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) 
        view returns(  
        uint256 id,
        address patientWalletAddress,
        string memory patientIPFSHash,
        string [] memory testResult,
        bytes32 txHash,
        uint256 dateCreated
        ){
            return (
                patients[_index].id,
                patients[_index].patientWalletAddress,
                patients[_index].patientIPFSHash,
                patients[_index].reports,
                patients[_index].txHash,
                patients[_index].dateCreated
            );
    }

    function addPatientMedicalReport(address _patientWalletAddress, string memory _testResult) public onlyOwner{
        require(bytes(_testResult).length > 0, "Enter a valid test result");
        bool patientExists = false;
        bytes32 txHash = blockhash(block.number);
        uint256 dateCreated = block.timestamp;
        for (uint256 i = 0; i < patients.length; i++) {
        if (patients[i].patientWalletAddress == _patientWalletAddress) {
            patientExists = true;
            patients[i].reports.push(_testResult);
            emit LogPatientMedicalReport(_patientWalletAddress, _testResult, txHash, dateCreated);
            }
        }
        require(patientExists, "Patient record does not exist");
        patientReports.push(PatientMedicalReport(_patientWalletAddress, _testResult, txHash, dateCreated));
    }

     function getPatientTestResults() public onlyOwner view returns(PatientMedicalReport [] memory){
        return patientReports;
    }

    function getPatientReport(uint256 _index, address _patientAddress) public contractOwnerOrDataOwner(_patientAddress) view returns(address patientWalletAddress, string[] memory testResult, bytes32 _txHash, uint256 _dateCreated) {
        return(
            patientReports[_index].patientWalletAddress,
            patients[_index].reports,
            patientReports[_index].txHash,
            patientReports[_index].dateCreated
        );
    }
}