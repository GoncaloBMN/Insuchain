const {Blockchain, Contract} = require('./blockchain');
const EC = require('elliptic').ec;


const b_ec = new EC('secp256k1');
const b_key = b_ec.genKeyPair();
const b_pubKey = b_key.getPublic('hex');
const b_privateKey = b_key.getPrivate('hex');

const i_ec = new EC('secp256k1');
const i_key = i_ec.genKeyPair();
const i_pubKey = i_key.getPublic('hex');
const i_privateKey = i_key.getPrivate('hex');

var vehicle_1 = {
    brand: "Opel",
    model: "Corsa C Diesel",
    version: "1.3 CDTi Cosmo",
    cilinder: 1248,
    hp: 70,
    n_doors: 5,
    n_seats: 5,
    license_plate: "10-10-XE",
    vin: "XXXXXXXX",
    driver: "Gonçalo Nabais"
};

var vehicle_2 = {
    brand: "test",
    model: "Corsa C Diesel",
    version: "1.3 CDTi Cosmo",
    cilinder: 1200,
    hp: 20,
    n_doors: 5,
    n_seats: 3,
    license_plate: "10-10-XA",
    vin: "vin",
    driver: "Gonçalo Nabais"
};

var ccidadao_1 = {
    id: "100",
    nif: "200",
    dta_emissao: "01-01-2000",
    dta_validade: "01-01-2020"
};

var cconducao_1 = {
    num: "L-11111111",
    dta_emissao: "01-06-2016",
    dta_validade: "0",
    entidade_emissora: "IMT-Lisboa"
};

var driver_1 = {
    name: "Gonçalo Nabais",
    address: "Rua das Túlipas",
    bdate: "01-01-2000",
    c_cidadao: ccidadao_1,
    c_conducao: cconducao_1
};

var insurer = {
    name: "Insurance Company",
    address: "Rua das Tulipas",
    nif: "500",
    pubkey: i_pubKey
};

var beneficiary = {
    name: "Very Big Company",
    address: "Rua das Palmeiras",
    nif: "501",
    pubkey: b_pubKey
};

// CREATE CONTRACT
let Insuchain = new Blockchain();
let contract = new Contract(insurer, beneficiary);

contract.addVehicle(vehicle_1);
contract.addDriver(driver_1);
Insuchain.addContract(contract, i_key);
Insuchain.minePendingContracts();

// CREATE ACTA
let contract_2 = new Contract(insurer, beneficiary);

contract_info = Insuchain.getContract(1, beneficiary.name, beneficiary.nif);
Insuchain.passContractInfo(contract_info, contract_2);

contract_2.addVehicle(vehicle_2);
contract_2.signContract(i_key);
Insuchain.createACTA(contract_2, contract_2.policyID);
Insuchain.minePendingContracts();

// ADD ANOTHER CONTRACT,
// CAN COMMENT LAST minePendingContracts AND PUT BOTH IN THE SAME BLOCK
let contract_3 = new Contract(insurer, beneficiary);
contract_3.addVehicle(vehicle_2);
contract_3.addDriver(driver_1);
Insuchain.addContract(contract_3, i_key);
Insuchain.minePendingContracts();

// GET ALL CONTRACTS FROM
let contract_from = Insuchain.getAllContractsFrom(b_pubKey);
//console.log(contract_from);

let peer_info_b = Insuchain.getPeerInfo(contract_from, b_pubKey);
//console.log(peer_info_b);

console.log(Insuchain.chain);
