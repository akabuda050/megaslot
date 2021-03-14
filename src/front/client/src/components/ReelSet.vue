<template>
  <div :style="styles.reelSet" v-if="width && height">
    <Reel
      class="line"
      @animationCompleted="onAnimationCompleted"
      @animationStarted="onAnimationStarted"
      v-for="(reel, reelIndex) in reelSet"
      :ref="`reel-${reelIndex}`"
      :key="reelIndex"
      :index="reelIndex"
      :width="reelWidth"
      :height="height"
      :symbols="symbols"
      :view="view"
      :winLines="
        winLines.map((wl) => ({
          lineNum: wl.lineNum,
          lineIndex: wl.lineIndexes[reelIndex],
        }))
      "
    >
    </Reel>
  </div>
</template>

<script>
import Reel from "./Reel.vue";
import { uniq } from "lodash";

export default {
  name: "ReelSet",
  components: {
    Reel,
  },
  props: {
    reelSet: {
      type: Array,
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
      width: null,
      height: null,
      isRun: 0,
      animations: [],
      canStop: false,
    };
  },
  computed: {
    reels() {
      return this.reelSet.map((r, i) => {
        return this.$refs[`reel-${i}`][0];
      });
    },
    reelWidth() {
      return this.width / this.reelSet.length;
    },
    styles() {
      return {
        reelSet: {
          display: "flex",
          flexDirection: "row",
          background: "#accbcd",
          width: this.width + "px",
          height: this.height + "px",
        },
      };
    },
  },
  watch: {
    view(view) {
      this.height = 80 * view[0].length;
      this.canStop = true;
      this.animations.forEach((element) => {
        element.repeat(0);
      });
    },
  },
  methods: {
    uniq: uniq,
    onAnimationStarted(pos) {
      this.$emit("animationStarted", pos);
    },
    onAnimationCompleted(pos) {
      this.animations.shift();
      if (!this.animations.length) {
        this.$emit("animationCompleted", pos);
      }
    },
    randomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    stop() {
      //let animation = this.animations.find(x=>x!==undefined);
      if (this.canStop) {
        this.animations.forEach((a) => {
          a.duration(0);
          a.repeat(0);
        });
      }
    },
    spin() {
      this.canStop = false;
      if (!this.animations.length) {
        this.reels.forEach((reel) => {
          let animation = reel.scrollByOffset(
            this.randomBetween(
              (10 - 6) * reel.symbols.length,
              (10 - 5) * reel.symbols.length
            )
          );
          this.animations.push(animation);
        });
      }
    },
  },
  mounted() {
    let length = (this.view && this.view[0] && this.view[0].length) || 1;
    this.width = this.$parent.$el.clientWidth - 20;
    this.height = 80 * length;
  },
};
</script>

<style scoped></style>
