<template>
  <div :style="styles.bonusGameWrapper">
    <span class="bonus-game-info" :style="styles.startText">{{ msg }}</span>
  </div>
</template>

<script>
export default {
  name: "BonusGame",
  data() {
    return {
      msg: `Are you ready? Click "Spin" to start.`,
    };
  },
  computed: {
    styles() {
      return {
        bonusGameWrapper: {
          height: "250px",
          width: "320px",
          background: "#accbcd",
        },
        startText: {
          fontSize: "26.65px",
          fontWeight: 800,
          color: "#393a99",
          padding: "10px",
        },
      };
    },
  },
};
</script>

<style></style>
