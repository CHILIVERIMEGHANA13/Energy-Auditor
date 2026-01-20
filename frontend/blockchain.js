import Web3 from "web3";
import Certificate from "../blockchain/Certificate.json"; // paste the ABI or import JSON

const web3 = new Web3(window.ethereum);
const contractAddress = "0x5E2BDB86922199d832303E2C443254F922BF00eb";
const contract = new web3.eth.Contract(Certificate.abi, contractAddress);
export{ web3, contract};