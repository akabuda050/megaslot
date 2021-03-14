<template>
  <div id="app" ref="main">
    <h3 v-if="!slotId">Mega Slot Games</h3>
    <div class="slots-container" v-if="!slotId">
      <div
        class="slot"
        v-for="(slot, slotIdx) in slots"
        :key="`slot-${slot.id}-${slotIdx}`"
      >
        <img :src="slotPreview" alt="slotPreview" />
        <div class="title">
          <strong>{{ `${slot.name}` }}</strong>

          <strong>{{ `${slot.lines} Lines` }}</strong>
        </div>
        <button
          @click="
            () => {
              slotId = slot.id;
            }
          "
        >
          Select
        </button>
      </div>
    </div>
    <MegaSlot v-if="slotId" :slotId="slotId" @exit="onExit" />
  </div>
</template>

<script>
import MegaSlot from "./components/MegaSlot.vue";
import MegaSlotService from "./services/MegaSlotService";
const slotPreview = require("./assets/img/slot_preview.png");
export default {
  name: "App",
  components: {
    MegaSlot,
  },
  data() {
    return {
      slots: [],
      slotId: null,
      slotPreview: slotPreview,
    };
  },
  computed: {},
  methods: {
    onExit() {
      this.slotId = null;
    },
    loadSlots() {
      MegaSlotService.getSlots({ playerId: null }).then((res) => {
        this.$set(this, "slots", res.data);
      });
    },
  },
  mounted() {
    this.loadSlots();
  },
};
</script>

<style>
body {
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0 auto;
  max-width: 720px;
  height: 320px;
  min-width: 285px;
  min-height: 80px;
  margin: 0 auto;
}

.slots-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
.slot {
  display: flex;
  flex-direction: column;

  margin: 5px auto;
  border: 1px solid;

  padding: 15px;
  position: relative;
  background: wheat;
}
.slot img {
  width: 285px;
  height: auto;
  object-fit: contain;
}
.slot .title {
  display: flex;
  flex-direction: column;
  position: relative;
  font-size: 15px;
  padding: 5px;
  margin: 0 auto;
}
.slot button {
  margin: 7px;
  padding: 8px 17px;
  font-size: 13px;
  font-weight: 900;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #000;
  background-color: rgba(124, 252, 0, 0.98);
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
  height: 37px;
}
</style>
