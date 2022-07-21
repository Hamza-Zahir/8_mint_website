import Web3 from "web3";
import dataCcontract from "../build/contracts/RoboPunksNFT.json";
const AbiCcontract = dataCcontract.abi;
const contractAddres = "0x5066Dc8987C4D616657eb5b3738f870a2680F71b";

export default {
  async getUserBalance(_CurrentAccount) {
    try {
      const ethereum = await window.ethereum;
    const web3 = new Web3(Web3.givenProvider || ethereum);
    const RoboPunksNFTContract = new web3.eth.Contract(
      AbiCcontract,
      contractAddres
    );

      const _userBlance = await RoboPunksNFTContract.methods
        .balanceOf(_CurrentAccount)
        .call();
      return Number(_userBlance);
    } catch (error) {
      console.log(error);
    }
  },
  async mint( _quantity, _CurrentAccount) {
    try {
 const ethereum = await window.ethereum;
    const web3 = new Web3(Web3.givenProvider || ethereum);
    const RoboPunksNFTContract = new web3.eth.Contract(
      AbiCcontract,
      contractAddres
    );
    const _value = _quantity * 10000000000000000;
    await RoboPunksNFTContract.methods.mint(_quantity).send({
      from: _CurrentAccount,
      value: _value,
    });
    } catch (error) {
      console.log(error);
    }

  },
};
