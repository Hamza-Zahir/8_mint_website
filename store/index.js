import Web3 from "web3";
import plugins from "../plugins/index";


const state = {
  CurrentAccount: "",
  ChainId: "",
  userBlance: "",
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  ChainId: (state) => state.ChainId,
  userBlance: (state) => state.userBlance,
};
const actions = {
  async connectMetamask({ commit }) {
    const ethereum = window.ethereum;
    if (!ethereum) {
      window.open("https://metamask.io", "blank");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setCurrentAccount", accounts[0]);
      const _userBlance = await plugins.getUserBalance(accounts[0]);
      commit("setUserBlance", _userBlance);
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(97).toString(16)}` }],
        });
        await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
          commit("setChainId", Number(resalt));
        });
        const _userBlance = await plugins.getUserBalance(
          this.state.CurrentAccount
        );
        commit("setUserBlance", _userBlance);
      } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${Number(97).toString(16)}`,
                  chainName: "Binance Smart Chain Testnet",
                  nativeCurrency: {
                    name: "Binance Chain Native Token",
                    symbol: "BNB",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://data-seed-prebsc-1-s1.binance.org:8545",
                    "https://data-seed-prebsc-2-s1.binance.org:8545",
                    "https://data-seed-prebsc-1-s2.binance.org:8545",
                    "https://data-seed-prebsc-2-s2.binance.org:8545",
                    "https://data-seed-prebsc-1-s3.binance.org:8545",
                    "https://data-seed-prebsc-2-s3.binance.org:8545",
                  ],
                  blockExplorerUrls: ["https://testnet.bscscan.com"],
                },
              ],
            });

            await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
              commit("setChainId", Number(resalt));
            });
            const _userBlance = await plugins.getUserBalance(
              this.state.CurrentAccount
            );
            commit("setUserBlance", _userBlance);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
  async checkWalletIsConnected({ commit }) {
    const ethereum = await window.ethereum;
    let web3 = new Web3(Web3.givenProvider || ethereum);
    let accounts = await web3.eth.getAccounts();
    if (accounts.length) {
      commit("setCurrentAccount", accounts[0]);
      await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
        commit("setChainId", Number(resalt));
      });

      const _userBlance = await plugins.getUserBalance(accounts[0]);
      commit("setUserBlance", _userBlance);
    }
    async function handleAccountsChanged(accounts) {
      commit("setCurrentAccount", accounts[0]);
      const _userBlance = await plugins.getUserBalance(accounts[0]);
      commit("setUserBlance", _userBlance);
    }
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
    const handleDisconnect = () => {
      disconnect();
    };
    // ......................................
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("disconnect", handleDisconnect);
  },

};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setChainId: (state, chainId) => (state.ChainId = chainId),
  setUserBlance: (state, userBlance) => (state.userBlance = userBlance),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
