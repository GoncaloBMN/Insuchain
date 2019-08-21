const sha256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Contract {
    /**
     * 
     * @param {object} insurer 
     * @param {object} beneficiary 
     */
    constructor(insurer, beneficiary) {
        this.policyID = 0;
        this.acta = false;
        this.insurer = insurer; //Insurance company
        this.beneficiary = beneficiary; //Beneficiary of the contract
        this.num_vehicles = 0;   //Number of vehicles to insure
        this.vehicles = []; //List of vehicles to cover in the policy
        this.drivers = [];  //List of drivers
        this.premium = 0;
        this.timestamp = new Date();
    }

    /** CALCULATE HASH
     * Creates a SHA256 hash of the contract
     * 
     * @returns {string}
     */
    calculateHash() {
        return sha256(this.policyID + this.acta + JSON.stringify(this.insurer) + JSON.stringify(this.beneficiary) + this.num_vehicles + 
        JSON.stringify(this.vehicles) + JSON.stringify(this.drivers) + this.premium + this.timestamp + this.latestPolicyID).toString();
    }

    /** VEHICLES[] EMPTY
     * Checks if vehicles array is empty
     * 
     * @param {boolean} log to display log onto the terminal
     * 
     * @returns {boolean}
     */
    vehiclesEmpty(log = false /*LOG false by default if parameter not specified*/) {
        //if(log) console.log("List of vehicles is empty.");
        return (this.vehicles.length === 0);
    }

    /** DRIVERS[] EMPTY
     * Checks if drivers array is empty
     * 
     * @param {boolean} log to display log onto the terminal if true
     * 
     * @returns {boolean}
     */
    driversEmpty(log = false /*LOG false by default if parameter not specified*/) {
        //if(log) console.log("List of drivers is empty.");
        return (this.drivers.length === 0);
    }

    /** ADD VEHICLE
     * Adds a new vehicle object to the vehicles array
     * 
     * @param {object} newVehicle 
     */
    addVehicle(newVehicle) {
        //Check if vehicle already exists
        for(const vehicle of this.vehicles) {
            if(vehicle.license_plate === newVehicle.license_plate || vehicle.vin === newVehicle.vin)
                throw new Error("Vehicle already exists.");
        }

        console.log("Adding vehicle...");
        this.vehicles.push(newVehicle);
        this.num_vehicles++;
        console.log("Vehicle added.");
    }

    /** ADD DRIVER
     * Adds a new driver object to the drivers array
     * 
     * @param {object} newDriver 
     */
    addDriver(newDriver) {
        //Check if driver already exists
        for(const driver of this.drivers) {
            if(driver.name === newDriver.name)
                throw new Error("Driver already exists.");
        }

        console.log("Adding driver...");
        this.drivers.push(newDriver);
        console.log("Driver added.");
    }

    /** VEHICLE HAS DRIVER
     * Checks if given vehicle has a driver
     * 
     * @param {object} vehicle 
     * 
     * @returns {boolean}
     */
    vehicleHasDriver(vehicle) {
        return (vehicle.driver !== null && vehicle.driver.length !== 0);
    }

    /** DRIVER UNDECLARED
     * Checks if vehicle has driver but it is undeclared in drivers array
     * 
     * @param {boolean} log to display log onto the terminal if true
     * 
     * @returns {boolean}
     */
    driverUndeclared(log = false /*LOG false by default if parameter not specified*/) {
        var check = false;

        if(!this.vehiclesEmpty() && this.driversEmpty()) {
            if(log) console.log("List of drivers is empty.");
            return true;
        }

        for(const vehicle of this.vehicles) {
            if(this.vehicleHasDriver(vehicle)) {
                for(const driver of this.drivers) {
                    if(vehicle.driver !== driver.name) {
                        check = true;
                        if(log) console.log("Driver " + vehicle.driver + " of " + vehicle.brand + ' ' + vehicle.version + " (license place: " + vehicle.license_place + ')' + " not declared.");
                    }
                }
            }
        }

        return check;
    }

    /** GET VEHICLE INDEX BY VIN
     * Returns index of vehicle in the vehicles array by given VIN
     * 
     * @param {string} vin 
     * 
     * @returns {number}
     */
    getVehicleIndexByVIN(vin) {
        var i = 0;

        for(const vehicle of this.vehicles) {
            if(vehicle.vin === vin) return i;
            i++;
        }

        console.log("Vehicle not found.");
        return -1;
    }

    /** GET VEHICLE INDEX BY LP
     * Returns index of vehicle in the vehicles array by given license plate
     * 
     * @param {string} license_plate 
     * 
     * @returns {number}
     */
    getVehicleIndexByLP(license_plate) {
        var i = 0;

        for(const vehicle of this.vehicles) {
            if(vehicle.license_plate === license_plate) return i;
            i++;
        }

        console.log("Vehicle not found.");
        return -1;
    }

    /** GET VEHICLE BY INDEX
     * Returns the vehicle in the vehicles array by given index
     * 
     * @param {number} index 
     * 
     * @returns {object} vehicle if found
     */
    getVehicleByIndex(index) {
        if(index < 0) {
            console.log("No vehicle to fetch.");
            return -1;
        }

        return this.vehicles[index];
    }

    /** GET VEHICLE BY VIN
     * Returns vehicle with given VIN number
     * 
     * @param {string} vin 
     * 
     * @returns {object} vehicle if found
     */
    getVehicleByVIN(vin) {
        return this.vehicles[getVehicleIndexByVIN(vin)];
    }

    /** GET VEHICLE BY LP
     * Returns vehicle with given license_plate
     * 
     * @param {string} license_plate
     * 
     * @returns {object} vehicle if found
     */
    getVehicleByLP(license_plate) {
        return this.vehicles[getVehicleIndexByLP(license_plate)];
    }

    /** GET DRIVER INDEX
     * Returns index of driver in the drivers array by given name and NIF
     * 
     * @param {string} name
     * @param {string} nif
     * 
     * @returns {number}
     */
    getDriverIndex(name, nif) {
        var i = 0;

        for(const driver of this.drivers) {
            if((driver.name === name && driver.c_cidadao.nif !== nif) || (driver.name !== name && driver.c_cidadao.nif === nif)) {
                console.log("Wrong credentials. Verify parameters.");
                return -1;
            }
            if(driver.name === name && driver.c_cidadao.nif === nif) return i;
            i++;
        }

        console.log("Driver not found.");
        return -1;
    }

    /** REMOVE VEHICLE
     * Removes a vehicle in the vehicles array in the given index
     * 
     * @param {number} index 
     * 
     * @returns {object} removed vehicle if found
     */
    removeVehicle(index) {
        if(index < 0) {
            console.log("Vehicle not found.");
            return -1;
        }

        this.num_vehicles--;

        return this.vehicles.splice(index, 1);
    }
    
    /** REMOVE DRIVER
     * Removes a driver in the drivers array in the given index
     * 
     * @param {number} index 
     * 
     * @returns {object} removed driver if found
     */
    removeDriver(index) {
        if(index < 0) {
            console.log("Driver not found.");
            return -1;
        }

        return this.drivers.splice(index, 1);
    }

    /** SET PREMIUM
     * Sets the premium of the contract
     * 
     * @param {number} premium
     * 
     */
    setPremium(premium) {
        this.premium = premium;
    }

    /** GET POLICY ID
     * Returns the policy ID of current contract
     * 
     * @returns {number}
     */
    getPolicyID(){
        return this.policyID;
    }

    /** SIGN CONTRACT
     * Signs a contract with the given signingKey (which is an Elliptic keypair
     * object that contains a private key). The signature is then stored inside the
     * contract object and later stored on the blockchain.
     *
     * @param {string} signingKey
     */
    signContract(signingKey) {
        // You can only send a contract from the wallet that is linked to your
        // key. So here we check if the beneficiary.pubkey matches your publicKey
        if(signingKey.getPublic('hex') !== this.beneficiary.pubkey) {
            throw new Error('You cannot sign contracts that aren\'t yours.');
        }

        // Calculate the hash of this contract, sign it with the key
        // and store it inside the contract obect
        const hashCt = this.calculateHash();
        const sig = signingKey.sign(hashCt, 'base64');
        this.signature = sig.toDER('hex');
    }

    /** IS VALID
     * Checks if the signature is valid (contract has not been tampered with).
     * It uses the beneficiary.publickey as the public key.
     *
     * @returns {boolean}
     */
    isValid() {
        if(!this.signature || this.signature.length === 0) throw new Error('No signature in this contract.');

        if(this.insurer === null || this.beneficiary === null) throw new Error('Invalid constructor parameters.');

        if(this.driversEmpty() || this.vehiclesEmpty()) throw new Error('Make sure there is at least one driver and one vehicle registered.');

        if(this.driverUndeclared()) throw new Error('There is at least an undeclared driver in the contract.');

        // Verify if is signed with correct key
        const publicKey = ec.keyFromPublic(this.beneficiary.pubkey, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    /**
     * 
     * @param {number} index 
     * @param {Contract[]} contracts 
     * @param {string} prevHash 
     */
    constructor(index, contracts, prevHash = '') {
        this.index = index;
        this.prevHash = prevHash;
        this.timestamp = new Date();
        this.nonce = 0;
        this.contracts = contracts;
        this.hash = this.calculateHash();
    }

    /** CALCULATE HASH
     * Returns the SHA256 of this block (by processing all the data stored
     * inside this block)
     *
     * @returns {string}
     */
    calculateHash() {
        return sha256(this.index + this.prevHash + this.timestamp + this.nonce + JSON.stringify(this.contracts)).toString();
    }

    /** MINE BLOCK
     * Starts the mining process on the block. It changes the 'nonce' until the hash
     * of the block starts with enough zeros (= difficulty)
     *
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        //console.log("Mining block " + this.index + "...");
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block successfully mined: " + this.hash);
    }

    /** HAS VALID CONTRACTS
     * Validates all the contracts inside this block (signature + hash) and
     * returns true if everything checks out. False if the block is invalid.
     *
     * @returns {boolean}
     */
    // Verify all contracts
    hasValidContracts() {
        // Iterate over all the contracts in the block
        for(const ct of this.contracts) {
            if(!ct.isValid()) return false;
        }

        return true;
    }
}

class Blockchain {
    constructor() {
        this.difficulty = 2;
        this.chain = [this.createGenesis()];
        this.pendingContracts = [];
        this.latestPolicyID = 0;
    }

    /** CREATE GENESIS
     * Creates the genesis block
     * 
     * @returns {Block}
     */
    createGenesis() {
        return new Block(0, [], "0");
    }

    /** GET LATEST BLOCK
     * Returns the latest block on the chain. Useful when you want to create a
     * new Block and you need the hash of the previous Block.
     *
     * @returns {Block[]}
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /** GET LATEST CONTRACT FROM PENDING CONTRACTS
     * Returns the latest contract on the pendingContracts list. 
     *
     * @returns {Contract[]}
     */
    getLatestContractFromPending() {
        if(this.pendingContracts.length === 0) throw new Error("Pending contracts array is empty.");

        return this.pendingContracts[this.pendingContracts.length - 1];
    }

    /** MINE PENDING CONTRACTS
     * Takes all the pending contracts, puts them in a Block and starts the
     * mining process. It also resets the pending contracts array
     *
     */
    minePendingContracts() {
        let block = new Block(
            this.getLatestBlock().index + 1,
            this.pendingContracts,
            this.getLatestBlock().hash
        )
        block.mineBlock(this.difficulty);

        //console.log("Block successfully mined.");
        this.chain.push(block);

        this.pendingContracts = [];
    }

    /** ADD CONTRACT
     * Adds a new contract to the list of pending contracts (to be added
     * next time the mining process starts). This verifies that the given
     * contract is properly signed.
     *
     * @param {Contract} contract
     */
    addContract(contract, signingKey) {
        // set policy id
        if(!contract.acta) {
            contract.policyID = ++this.latestPolicyID;
        }

        // sign contract
        contract.signContract(signingKey);

        if(!contract.isValid()) throw new Error('Cannot add invalid contract to the chain.');

        this.pendingContracts.push(contract);
    }

    /** GET CONTRACT
     * Returns the contract given by policy ID, beneficiary's name and NIF, if found
     * 
     * @param {number} policyID 
     * @param {string} name 
     * @param {string} nif 
     * 
     * @returns {Contract}
     */
    getContract(policyID, name, nif) {
        for(const block of this.chain) {
            for(const contract of block.contracts) {
                if(contract.policyID === policyID && contract.beneficiary.name === name && contract.beneficiary.nif === nif) return contract;
            }
        }

        console.log("Contract not found.");
        return -1;
    }

    /** PASS CONTRACT INFO
     * Passes relevant information from the former contract {contract} to the new amendment {newContract}
     * 
     * @param {Contract} contract 
     * @param {Contract} newContract 
     */
    passContractInfo(contract, newContract) {
        newContract.policyID = contract.policyID;
        newContract.num_vehicles = contract.num_vehicles;
        newContract.vehicles = [...contract.vehicles];  // Mesmo que .slice()
        newContract.drivers = [...contract.drivers];    // Mesmo que .slice()
        newContract.premium = contract.premium;
        newContract.latestPolicyID = contract.latestPolicyID;
        newContract.acta = true;
    }

    /** CREATE ACTA
     * Creates an amendment contract with the same policy ID as the former contract
     * 
     * @param {Contract} contract 
     * @param {number} policyID 
     * 
     * @returns {Contract}
     */
    createACTA(contract, policyID) {
        if(this.getContract(policyID, contract.beneficiary.name, contract.beneficiary.nif) === -1) return -1;

        this.pendingContracts.push(contract);
        
        return contract;
    }

    /** GET ALL CONTRACTS FROM
     * Returns a list of all the contracts registered under the beneficiary's name
     * 
     * @param {string} name 
     * @param {string} nif 
     * 
     * @returns {Contract[]}
     */
    // PROBLEMA DE SEGURANÇA SE A PESSOA NÃO FOR A PRÓPRIA
    getAllContractsFrom(pubkey) {
        var contracts = [];

        for(const block of this.chain) {
            if(block.index === 0) continue;
            for(const contract of block.contracts) {
                if(contract.beneficiary.pubkey === pubkey || contract.insurer.pubkey === pubkey)
                    contracts.push(contract);
            }
        }

        return contracts;
    }

    /** IS CHAIN VALID
     * Loops over all the blocks in the chain and verify if they are properly
     * linked together and nobody has tampered with the hashes. By checking
     * the blocks it also verifies the (signed) contracts inside of them.
     *
     * @returns {boolean}
     */
    isChainValid(){
        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesis with the first block on the chain
        const realGenesis = this.createGenesis();
        realGenesis.timestamp = this.chain[0].timestamp;
        realGenesis.calculateHash();

        if (JSON.stringify(realGenesis) !== JSON.stringify(this.chain[0])) return false;

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // Se o bloco foi alterado
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            // Se os restantes blocos foram alterados
            if (currentBlock.prevHash !== prevBlock.hash) return false;

            if(!currentBlock.hasValidContracts()) return false;
        }

        return true;
    }
}


module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Contract = Contract;
