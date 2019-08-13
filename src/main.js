const {Blockchain, Contract} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


let Insuchain = new Blockchain();

var vehicle_1 = {
    brand: "Opel",
    model: "Corsa C Diesel",
    version: "Corsa 1.3 CDTi Cosmo",
    cilindrada: 1248,
    hp: 70,
    n_doors: 5,
    n_seats: 5,
    license_plate: "10-10-XE",
    vin: "XXXXXXXX",
    type: "Hatchback",
    driver: "Gonçalo de Brito Miranda Nabais"
};

var ccidadao_1 = {
    id: "14743525",
    nif: "260381519",
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
    name: "Gonçalo de Brito Miranda Nabais",
    morada: "Rua Ferreira de Castro, n60, 3ESQ",
    dta_nasc: "29-12-1996",
    c_cidadao: ccidadao_1,
    c_conducao: cconducao_1
};

var insurer = {
    company: "Insurance Company",
    address: "Rua das Tulipas",
    phone: "900000000"
}

var beneficiary = {
    name: "Very Big Company",
    address: "Rua das Palmeiras",
    nif: "500",
    pubkey:""
}

let contract = new Contract(insurer, beneficiary);




//console.log(contract.getVehicleIndexByLP("a"));
//console.log(contract.getVehicleByIndex(contract.getVehicleIndexByLP("a")));
contract.addVehicle(vehicle_1);
//console.log(contract.vehicleHasDriver(vehicle_1));
//console.log(JSON.stringify(contract.vehicles, null, 4));
//console.log(contract.removeVehicle(contract.getVehicleIndexByLP("10-10-XE")));


contract.addDriver(driver_1);
//console.log(contract.getDriverIndex("Gonçalo de Brito Miranda Nabais", "260381519"));
//Insuchain.getLatestContractFromPending().addDriver(driver_1);


Insuchain.createContract(contract);


let contract2 = new Contract(insurer, beneficiary);
Insuchain.createContract(contract2);




Insuchain.minePendingContracts();
//Insuchain.createACTA();





console.log(Insuchain.chain[1]);
console.log(Insuchain.isChainValid());
//console.log(Insuchain.chain[1].hasValidContracts());

//console.log(Insuchain.getAllContractsFrom(beneficiary.name, beneficiary.nif));
//console.log(JSON.stringify(Insuchain.chain[1], null, 4));
/***************************************/
//data1 = "data1";
//data2 = "data2";
//Insuchain.addBlock(data1);
//Insuchain.addBlock(data2);

//console.log(JSON.stringify(Insuchain, null, 4));
//console.log(JSON.stringify(Insuchain.chain[1], null, 4));

//console.log("Is Insuchain valid? " + Insuchain.isChainValid());

//Insuchain.chain[2].data = [4, 5, "tes"];
//Insuchain.chain[1].hash = Insuchain.chain[1].calculateHash();
//console.log("Is Insuchain valid? " + Insuchain.isChainValid());

//console.log(JSON.stringify(Insuchain, null, 4));
//var array = new Array(3);

//console.log(array.length);
/***************************************/


