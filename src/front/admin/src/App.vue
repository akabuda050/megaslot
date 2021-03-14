<template>
  <div id="app" ref="main">
    <MegaSlotAdmin />
  </div>
</template>

<script>
import MegaSlotAdmin from "./components/MegaSlotAdmin.vue";

export default {
  name: "App",
  components: {
    MegaSlotAdmin,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
