<template>
  <div :style="styles.reel">
    <div
      :style="styles.symbolWrapper"
      v-if="symbols.length"
      ref="symbolWrapper"
    >
      <ReelSymbol
        v-for="(symbol, symbolIndex) in reelSymbols"
        :key="`symbol-${symbolIndex}`"
        :index="symbolIndex"
        :symbol="symbolsMap[symbol].image"
        :isWin="
          winLines.filter((wl, wlIndex) => {
            return symbolIndex === positions[wl.lineIndex];
          })
        "
        :width="width"
        :height="symbolHeight"
      >
      </ReelSymbol>
    </div>
  </div>
</template>

<script>
import ReelSymbol from "./ReelSymbol.vue";
import { gsap } from "gsap";
import { payTableMap } from "../constants";

export default {
  name: "Reel",
  components: {
    ReelSymbol,
  },
  props: {
    width: null,
    height: null,
    index: {
      required: true,
    },
    symbols: {
      type: Array,
      required: true,
    },
    view: {
      type: Array,
      required: false,
    },
    winLines: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      symbolsMap: payTableMap,
      position: null,
      currentPosition: 0,
      scrollPos: 0,
      gsap: gsap,
      tween: null,
      spinAudio: new Audio(require("../assets/sound/spin_end.mp3")),
      positions: [],
    };
  },
  computed: {
    reelSymbols() {
      let reelSymbols = this.symbols
        .join("")
        .repeat(10)
        .split("")
        .map((s) => {
          return s;
        });

      let viewReel = this.view[this.index];
      let up = this.position;
      reelSymbols[up] = viewReel[0];
      for (let i = 1; i < viewReel.length; i++) {
        let mid = up + i;
        mid = mid % reelSymbols.length;
        reelSymbols[mid] = viewReel[i];
      }

      return reelSymbols;
    },
    symbolHeight() {
      return this.height / this.view[this.index].length;
    },
    styles() {
      return {
        reel: {
          //background: "red",
          width: this.width + "px",
          height: this.height + "px",
        },
        symbolWrapper: {
          width: this.width + "px",
          height: this.symbols.length * this.symbolHeight + "px",
          transform: `translateY(${this.scrollPos}px)`,
        },
      };
    },
  },
  watch: {
    position(pos) {
      this.positions = [];
      let viewReel = this.view[this.index];
      let up = pos;
      this.positions.push(up);
      for (let i = 1; i < viewReel.length; i++) {
        let mid = up + i;
        mid = mid % this.reelSymbols.length;
        this.positions.push(mid);
      }
    },
  },
  methods: {
    scroll() {
      this.tween = this.gsap.to(this.$refs.symbolWrapper, {
        //ease: "elastic",
        duration: 0.7 + this.index * 0.3,
        y: this.currentPosition,
        repeat: -1,
        onComplete: () => {
          this.position =
            (10 - 2) * this.symbols.length +
            (this.position % this.symbols.length);

          this.currentPosition = this.position * this.symbolHeight * -1;
          this.scrollPos = this.currentPosition;
          this.gsap.set(this.$refs.symbolWrapper, {
            y: this.scrollPos,
          });

          this.spinAudio.currentTime = 0;
          this.spinAudio.play();

          this.$emit("animationCompleted", this.position);
        },
        onUpdate: () => {},
        onStart: () => {},
      });
      return this.tween;
    },
    stop() {
      //this.gsap.set(this.$refs.symbolWrapper, { y: this.currentPosition });
      //this.tween.duration(5);
    },
    isScrolling() {
      return this.gsap.isTweening(this.$refs.symbolWrapper);
    },
    scrollByOffset(offset) {
      this.positions = [];
      this.currentPosition = this.currentPosition + this.symbolHeight * offset;
      this.position = this.position - offset;
      console.log(this.position);
      return this.scroll();
    },
  },
  mounted() {
    this.position = this.reelSymbols.length - this.view[this.index].length; // 39 - 3 = 36
    this.currentPosition =
      (this.reelSymbols.length - this.view[this.index].length) *
      this.symbolHeight *
      -1;
    this.scrollPos = this.currentPosition;

    console.log({
      positionOnMount: this.position,
      currentPositionOnMount: this.currentPosition,
      scrollPosOnMount: this.scrollPos,
    });
  },
};
</script>

<style scoped></style>
