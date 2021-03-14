<template>
  <div
    :style="styles.symbol"
    :data-tooltip="isWin.map((e) => e.lineNum).join(',')"
  >
    <img
      :style="styles.symbolImage"
      :class="`${isWin.length ? 'isWin' : ''}`"
      :src="symbol"
    />
  </div>
</template>

<script>
export default {
  name: "ReelSymbol",
  props: {
    width: null,
    height: null,
    index: null,
    symbol: null,
    isWin: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    styles() {
      return {
        symbol: {
          //background: "orange",
          width: this.width - 5 + "px",
          height: this.height - 2 + "px",
          border: "1px solid",
          borderRadius: "5px",
          background: "rgb(226 255 198 / 80%)",
          margin: "0 auto",
          marginLeft: "1px",
          marginRight: "1px",
        },
        symbolImage: {
          // background: `#${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
          // color: "white",
          top: `2px`,
          position: `relative`,
          width: this.width - 20 + "px",
          height: this.height - 10 + "px",
          objectFit: "contain",
        },
      };
    },
  },
};
</script>

<style scoped>
@keyframes isWin {
  25% {
    transform: scale(0.6);
    z-index: 10000;
  }

  50% {
    transform: scale(1.6);
    z-index: 0;
  }
  100% {
    transform: scale(1);
    z-index: 0;
  }
}

.isWin {
  animation: isWin 3s infinite;
  position: relative;
}
/*.isWin::before {
  content: attr(data-tooltip);
  position: fixed;
  top: -15px;
  background: rebeccapurple;
  color: white;
  padding: 4px;
}*/
</style>
