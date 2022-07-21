<template>
  <div>
    <div class="moveng-bg"></div>
    <div class="text-light p-2 d-flex justify-content-center">
      <div
        class="btn btn_danger text-light"
        :class="CurrentAccount && ChainId != 97 ? 'btn-warning' : ''"
        @click="
          () => {
            connectMetamask();
          }
        "
      >
        {{
          CurrentAccount && ChainId == 97
            ? `${CurrentAccount.slice(0, 5)}...${CurrentAccount.slice(
                CurrentAccount.length - 4
              )}`
            : CurrentAccount && ChainId != 97
            ? "network erore"
            : " Conect Wallet"
        }}
      </div>
    </div>
    <div
      class="content d-flex flex-column justify-content-center align-items-center"
    >
      <h2 class="">RoboPunks</h2>
      <div class="text text-center">
        it's 2078. Can the RoboPunks NFT save humans from destructive rampant
        NFT speculation? Mint Robopunks to find out.
      </div>
      <div v-if="CurrentAccount" class="">
        You Currently Have: {{ userBlance }} RP
      </div>
      <div class="d-flex mx-0 my-3 bg-light rounded">
        <div
          class="btn btn_danger text-light"
          @click="
            () => {
              if (quantity > 1) {
                quantity--;
              }
            }
          "
        >
          -
        </div>
        <div
          class="quantity text-dark d-flex justify-content-center align-items-center"
        >
          {{ quantity }}
        </div>
        <div
          class="btn btn_danger text-light"
          @click="
            () => {
              if (quantity < 10) {
                quantity++;
              }
            }
          "
        >
          +
        </div>
      </div>
      <div class="mint btn btn_danger my-2 text-light"
      @click="()=>{
        Mint()
      }"
      >MINT NOW</div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import plugins from "../plugins/index";

export default {
  data() {
    return {
      quantity: 1,
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["ChainId"]),
    ...mapGetters(["userBlance"]),
  },
  mounted() {
    this.checkWalletIsConnected();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
    ...mapMutations(["setUserBlance"]),

    async Mint() {
      if((this.quantity + this.userBlance) > 10){
        alert("you can not mint more than 10 RP")
      }else{
        await plugins.mint(this.quantity, this.CurrentAccount).then(async () => {
        await plugins.getUserBalance(this.CurrentAccount).then((Blance) => {
          this.setUserBlance(Blance);
        });
      });
      }

    },
  },
};
</script>
<style scoped></style>
