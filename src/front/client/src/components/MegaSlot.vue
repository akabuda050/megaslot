<template>
  <div class="main">
    <h3 class="slot-name">{{ slotName }} - Mega Slot (^_^)</h3>
    <div id="slot-name">
      <span>{{ linesNum }} Lines</span>
      <div class="slot-name-buttons">
        <div>
          <button
            class="playerId-button-login"
            @click="isLoginOpen = !isLoginOpen"
          >
            Login
          </button>
          <template v-if="!playerId || infoblockMsg === 'Player not found.'">
            <button class="playerId-button-login" @click="createNewPlayer">
              Start New Game
            </button>
          </template>
          <button class="playerId-button-exit" @click="exit">
            Exit
          </button>
        </div>
        <div>
          <template v-if="playerId && infoblockMsg !== 'Player not found.'">
            <button class="playerId-button-login" @click="deposit">
              Deposit
            </button>
          </template>

          <template v-if="playerId && infoblockMsg !== 'Player not found.'">
            <button class="playerId-button-login" @click="withdrawal">
              Withdrawal
            </button>
          </template>
        </div>
      </div>
    </div>
    <div id="winDiv" v-if="showPaytable">
      <strong id="paytable-title">PayTable</strong>
      <div id="rewards">
        <span
          v-for="(symbol, index) in Object.keys(payTableMap)"
          :key="`reward-symbol-${symbol}-${index}`"
        >
          <div
            v-for="(symbolsCount, scIndex) in Object.keys(
              payTableMap[symbol].value
            )"
            :key="`reward-symbol-${symbolsCount}-${scIndex}`"
            :class="`reward-symbols-block`"
          >
            <img :src="`${payTableMap[symbol].image}`" />
            <strong>{{ symbolsCount }}</strong>
            <strong
              >FUN {{
                selectedBid * payTableMap[symbol].value[symbolsCount]
              }}</strong
            >
          </div>
        </span>
      </div>
      <div style="background: wheat;font-size: 23px;">
        -----
      </div>
      <div id="winLine" v-if="linesImage">
        <img :src="`${linesImage}`" />
      </div>
    </div>
    <BonusGame class="lines" v-else-if="isBonusGameActive" />
    <ReelSet
      v-else-if="reels"
      :reelSet="reels"
      :symbols="symbols"
      :view="view"
      :winLines="winLines"
      @animationCompleted="onAnimationCompleted"
      @animationStarted="onAnimationStarted"
      class="lines"
      ref="reelSet"
    />
    <div id="balance">
      <template v-if="showBalance">
        <span
          style="margin:10px; cursor: pointer;"
          @click.self="showBalance = false"
          >Balance: FUN {{ animatedBalance }}</span
        >
      </template>
      <template v-else-if="!showBalance">
        <span
          style="margin:10px; cursor: pointer;"
          @click.self="showBalance = true"
          >Total: FUN {{ parseFloat(total).toFixed(2) }}</span
        >
      </template>
      <span style="margin:10px;">Last Win: FUN {{ lastWon }}</span>
    </div>
    <div id="infoblock">{{ (won && `Win: FUN {won}`) || infoblockMsg }}</div>
    <div id="playerId" v-if="isLoginOpen">
      <input class="playerId-field" v-model="playerId" />
      <button class="playerId-button" @click="prepareGame">
        Load player
      </button>
    </div>
    <div class="spinblock" @click.self="openFullscreen">
      <select id="bid" v-model="selectedBid" @change="onChangeBid">
        <option v-for="bid in bids" :value="bid" :key="`bid-${bid}`">
          FUN {{ bid }}
        </option>
      </select>
      <button
        :disabled="!!isSpinbuttonDisabled"
        id="spinButton"
        @click="startGame"
      >
        {{ spinText }}
      </button>
      <button id="bonusGame" disabled onclick="bonusGame()">Bonus</button>
      <button id="takeWin" disabled onclick="takeWin()">Take Win</button>
      <button
        id="showPaytable"
        :disabled="
          ($refs.reelSet && $refs.reelSet.animations.length) ||
            this.isSpinbuttonDisabled
        "
        @click="tooglePaytable"
      >
        Show PayTable
      </button>
    </div>
    <div class="footer">
      <section class="author-info">
        <span>Built by <a href="mailto:ftsys1992@gmail.com">JsonBaby</a></span>
      </section>
    </div>
  </div>
</template>

<script>
import MegaSlotService from "@/services/MegaSlotService";
import PlayerService from "@/services/PlayerService";
import ReelSet from "./ReelSet";
import BonusGame from "./BonusGame";
import { gsap } from "gsap";
import { payTableMap } from "../constants";
export default {
  name: "MegaSlot",
  components: {
    ReelSet,
    BonusGame,
  },
  props: {
    slotId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      slotName: "MegaSlot",
      linesImage: null,
      linesNum: 0,
      isBonusGameActive: false,
      showPaytable: false,
      payTableMap: {},
      infoblockMsg: "Welcome!",
      bids: [],
      selectedBid: 1,
      balance: 0,
      total: 0,
      showBalance: true,
      tweenedBalance: 0,
      won: 0,
      lastWon: 0,
      reels: [],
      view: [],
      winLines: [],
      playerId: null,
      isSpinning: false,
      isSpinbuttonDisabled: false,
      shufflingInterval: null,
      shufflingTime: 8,
      gsapDuration: 0.5,
      isLoginOpen: false,
      changeBidAudio: new Audio(
        require("../assets/sound/276091_5123851-lq.mp3")
      ),
      winAudio: new Audio(require("../assets/sound/387232_1474204-lq.mp3")),
      bigwinAudio: new Audio(require("../assets/sound/270319_5123851-lq.mp3")),
      superWinAudio: new Audio(require("../assets/sound/coinwin.wav")),
      spinAudio: new Audio(require("../assets/sound/spin1.mp3")),
      symbols: []
    };
  },
  watch: {
    balance: function(newValue) {
      gsap.to(this.$data, {
        duration: this.gsapDuration,
        tweenedBalance: newValue,
      });
    },
  },
  computed: {
    spinText() {
      return this.isSpinning ? `Stop` : `Spin`;
    },
    animatedBalance() {
      return this.tweenedBalance.toFixed(2);
    },
  },
  methods: {
    tooglePaytable() {
      this.$set(this, "showPaytable", !this.showPaytable);
    },
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    },
    openFullscreen() {
      let elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    exit() {
      this.stopAllAudion();
      this.$emit("exit");
    },
    onChangeBid() {},
    parseUrl() {
      let uri = window.location.search.substring(1);
      let params = new URLSearchParams(uri);
      return params;
    },

    shuffleView: function() {},
    getBalance() {},
    stopShuffling() {
      clearInterval(this.shufflingInterval);
    },
    congrats(won) {
      this.isSpinbuttonDisabled = true;
      this.stopAllAudion();
      if (won > 0 && won <= 150) {
        this.winAudio.play();
      } else if (won > 150 && won <= 1000) {
        this.bigwinAudio.play();
      } else {
        this.superWinAudio.play();
      }

      this.won = won;
      this.lastWon = won;
      this.balance += won;

      this.$nextTick(() => {
        this.gsapDuration = 0.5;
        setTimeout(() => {
          this.isSpinbuttonDisabled = false;
          this.won = 0;
        }, 2000);
      });
    },
    onAnimationStarted() {},
    onAnimationCompleted() {
      this.stopAllAudion();
      this.isSpinning = false;
    },
    stopAllAudion() {
      this.changeBidAudio.pause();
      this.winAudio.pause();
      this.bigwinAudio.pause();
      this.superWinAudio.pause();
      this.spinAudio.pause();

      this.changeBidAudio.currentTime = 0;
      this.winAudio.currentTime = 0;
      this.bigwinAudio.currentTime = 0;
      this.superWinAudio.currentTime = 0;
      this.spinAudio.currentTime = 0;
    },
    spin() {
      this.balance -= this.selectedBid;
      this.winLines = [];
      MegaSlotService.spin({
        playerId: this.playerId,
        bid: this.selectedBid,
        slotId: this.slotId,
      }).then((res) => {
        //this.isSpinbuttonDisabled = true;
        if (res.data) {
          let won = res.data.wonMoney;
          this.view = res.data.view;
          this.reels = res.data.reels;
          this.linesImage =
            (res.data.linesImage && res.data.linesImage) || null;
          this.linesNum = res.data.linesNum;
          this.slotName = res.data.name;
          this.total = res.data.total;

          // Map PayTable
          Object.keys(res.data.paytable).forEach((element) => {
            if (!this.payTableMap[element]) {
              this.payTableMap[element] = {};
            }
            this.payTableMap[element]["value"] = {};
            this.payTableMap[element]["image"] = payTableMap[element].image;
            let value = res.data.paytable[element].value;
            Object.keys(value).forEach((ev) => {
              if (value[ev] > 0) {
                this.payTableMap[element]["value"][ev] = value[ev];
              }
            });
          });

          this.winLines = res.data.winLines;
          if (won) {
            this.congrats(won);
          }
        }
        console.log(res.data);
      });
    },
    startGame() {
      if (this.showPaytable) {
        return false;
      }

      if (this.isBonusGameActive) {
        return false;
      }

      this.infoblockMsg = "Good Luck :)";
      if (this.balance - this.selectedBid < 0) {
        this.infoblockMsg = "No Cash!";
        return false;
      }

      if (!this.$refs.reelSet.animations.length && !this.isSpinbuttonDisabled) {
        this.isSpinning = true;
        this.spin();
        this.$refs.reelSet.spin();
        this.spinAudio.play();
      } else if (!this.isSpinbuttonDisabled) {
        this.$refs.reelSet.stop();
      }
      //this.spinAudio.play();
    },
    createNewPlayer() {
      let playerId = localStorage.getItem("playerId");
      PlayerService.createPlayer({ playerId }).then((res) => {
        this.playerId = res.data.playerId;
        localStorage.setItem("playerId", res.data.playerId);
        this.prepareGame();
      });
    },
    deposit() {
      let playerId = localStorage.getItem("playerId");
      PlayerService.deposit({ playerId }).then((res) => {
        this.playerId = res.data.playerId;
        localStorage.setItem("playerId", res.data.playerId);
        this.balance = res.data.balance;
        this.total = res.data.total;
      });
    },
    withdrawal() {
      let playerId = localStorage.getItem("playerId");
      PlayerService.withdrawal({ playerId })
        .then((res) => {
          this.playerId = res.data.playerId;
          localStorage.setItem("playerId", res.data.playerId);
          this.balance = res.data.balance;
          this.total = res.data.total;
        })
        .catch((e) => {
          this.infoblockMsg = e.response.data.message;
        });
    },
    prepareGame() {
      MegaSlotService.prepareGame({
        playerId: this.playerId,
        slotId: this.slotId,
      })
        .then((res) => {
          if (res.data) {
            //this.isLoginOpen = !this.isLoginOpen;
            this.bids = res.data.bids;
            this.balance = res.data.balance;
            this.total = res.data.total;
            this.view = res.data.view;
            this.reels = res.data.reels;
            this.symbols = res.data.symbols;
            this.playerId = res.data.playerId;
            this.linesImage =
              (res.data.linesImage && res.data.linesImage) || null;
            this.linesNum = res.data.linesNum;
            this.slotName = res.data.name;

            // Map PayTable
            Object.keys(res.data.paytable).forEach((element) => {
              if (!this.payTableMap[element]) {
                this.payTableMap[element] = {};
              }
              this.payTableMap[element]["value"] = {};
              this.payTableMap[element]["image"] = payTableMap[element].image;
              let value = res.data.paytable[element].value;
              Object.keys(value).forEach((ev) => {
                if (value[ev] > 0) {
                  this.payTableMap[element]["value"][ev] = value[ev];
                }
              });
            });

            if (localStorage.getItem("playerId") != res.data.playerId) {
              localStorage.setItem("playerId", res.data.playerId);
            }
          }
          this.infoblockMsg = "Good Luck :)";
        })
        .catch((e) => {
          console.log(e);
          this.infoblockMsg = e.response.data.message;
        });
    },
    keyup(event) {
      if (event.which === 32) {
        this.startGame();
      }
    },
  },
  mounted() {
    this.playerId = localStorage.getItem("playerId");
    if (this.playerId) {
      this.prepareGame();
    }
  },
  created: function() {
    window.addEventListener("keyup", this.keyup);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  min-width: 285px;
  margin: 0 auto;
  border: 5px solid;
  border-radius: 11px;
  box-shadow: 0 0 26px rgba(0, 0, 0, 0.5);
  background: #000000;
}

@media (min-width: 720px) {
  .main {
    top: 20%;
    position: relative;
  }
}

.footer {
  background: #f2ece1;
  border-radius: 5px;
  margin: 5px;
  padding: 8px;
  font-size: 11px;
  font-weight: 900;
}

ul {
  padding-inline-start: 0px;
  margin-block-end: 0px;
  margin-block-start: 0px;
}

li {
  list-style: none;
}

#balance,
#slot-name {
  background: white;
  color: #0c7d0c;
  border: 1px solid;
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  word-break: break-word;
}

#balance {
  font-size: 16px;
  font-weight: 900;
  display: flex;
  justify-content: space-between;
}

#slot-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  font-weight: 900;
}

.slot-name-buttons {
}

.slot-name {
  color: #76c676;
  margin: 10px;
  text-align: center;
  word-break: break-word;
}

.lines {
  display: flex;
  width: 95%;
  height: auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #6de9e6;
  border-radius: 10px;
  margin: 0 auto;
}

.blur {
  filter: blur(3px);
}

.line {
  /*  */
  border: 2px solid;
  border-radius: 5px;
  margin: 3px;
  background: #e96de861;
  margin-top: 0;
  margin-bottom: 0;
}

.line div div {
  width: 80px;
  height: 85px;
  margin: 5px;
  font-size: 58px;
  font-weight: 800;
  border: 2px solid;
  border-radius: 20px;
  box-shadow: -2px 1px 0px 0px rgb(143 46 46 / 73%);
  position: relative;
}

@keyframes winLine {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1.2);
  }
}

.win-line {
  animation: winLine 1.2s ease-in-out infinite;
}

.spinblock {
  font-size: xx-large;
  margin: 10px;
}

.spinblock {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr;
  align-items: stretch;
  /* padding: 5px; */
  /* font-size: x-large; */
}

.spinblock button {
  margin: 3px;
}

#spinButton,
#bonusGame,
#takeWin,
#showPaytable {
  margin: 7px;
  padding: 15px 25px;
  font-size: 17px;
  font-weight: 900;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #000;
  background-color: #7cfc00fa;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
  height: 54px;
}

#showPaytable {
  padding: 0;
}

#takeWin {
  background-color: yellow;
}

#takeWin:hover {
  background-color: lightyellow;
}

#takeWin:active {
  background-color: yellow;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

#spinButton:hover,
#bonusGame:hover {
  background-color: #3e8e41;
}

#takeWin:disabled {
  background-color: gray;
}

#spinButton:hover,
#bonusGame:hover {
  background-color: #3e8e41;
}

#spinButton:disabled {
  background-color: gray;
}

#spinButton:active,
#bonusGame:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

#bonusGame {
  background: #fc0000b5;
}

#bonusGame:disabled {
  background: gray;
}

#bid {
  margin: 8px;
  padding: 10px 25px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #000;
  background-color: #7cfc00b5;
  border: none;
  border-radius: 14px;
  box-shadow: 0 9px #999;
}

#infoblock {
  display: block;
  background: white;
  margin: 10px;
  padding: 5px;
  border: 1px solid;
  border-radius: 9px;
  height: auto;
  text-align: center;
  min-height: 40px;
  font-size: 25px;
  font-weight: 900;
  color: #0c7d0c;
}

#playerId {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}

.playerId-field {
  display: block;
  background: #fff;
  margin: 5px;
  padding: 5px;
  border: 1px solid;
  border-radius: 9px;
  height: auto;
  /* text-align: center; */
  /* min-height: 40px; */
  font-size: 15px;
  font-weight: 900;
  width: 75%;
}

.playerId-button,
.playerId-button-login,
.playerId-button-exit {
  font-size: 10px;
  font-weight: 800;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #000;
  background-color: rgba(124, 252, 0, 0.98);
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px #999;
  margin: 5px;
  width: 105px;
  height: 20px;
}

#winDiv {
}

#paytable-title {
  color: white;
  font-size: 20px;
  font-weight: 900;
}

div#rewards span {
  padding: 5px;
  margin: 2px;
  border: 1px solid;
  text-align: center;
}

div#rewards {
  font-size: smaler;
  display: grid;
  background: wheat;
  grid-template-columns: 1.5fr 1.5fr 1.5fr;
  display: inline-grid;
  align-items: stretch;
  width: 100%;
}
div#rewards span img {
  width: 25px;
  height: 25px;
}
.reward-symbols-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#winLine img {
  width: 100%;
  object-fit: cover;
}
</style>
