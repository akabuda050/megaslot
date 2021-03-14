<template>
  <div class="container">
    <div class="form-group">
      <h3>Slots</h3>
      <div class="form-item">
        <select v-model="slotId">
          <option
            v-for="(slot, sIndex) in slots"
            :id="`slot-${sIndex}`"
            :key="`slot-${sIndex}`"
            :value="`${slot.id}`"
          >
            {{ slot.name }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <button @click="createNew">Create</button>
      <button @click="deleteSlot">Delete</button>
    </div>
    <hr />
    <div>
      <button @click="loadSlot">Load</button>
      <button @click="saveSlot(false)">Save</button>
      <button @click="checkRTP">Check RTP</button>
    </div>

    <hr />
    <div class="form" v-if="isSlotLoaded">
      <div class="form-group">
        <div class="form-item">
          <h3>Slot name</h3>
          <input v-model="name" />
        </div>
        <div class="form-item">
          <h3>RTP</h3>
          <strong :class="`${rtpInProgress ? 'rtp-in-progress' : ''}`"
            >{{ parseFloat(RTP.totalRTP).toFixed(2) }}%</strong
          >
        </div>
      </div>
      <hr />

      <!-- SYMBOLS -->
      <h3>Symbols</h3>
      <div class="form-group-column">
        <div
          class="form-item-row"
          v-for="(symbol, sIndex) in symbols"
          :key="`symbol-${sIndex}`"
        >
          <label :for="`symbol-value-${sIndex}`"
            >Symbol
            <input
              :id="`symbol-value-${sIndex}`"
              v-model="symbol.value"/></label
          ><br />
          <label :for="`symbol-image-${sIndex}`"
            >Symbol Image
            <input :id="`symbol-image-${sIndex}`" v-model="symbol.image" />
          </label>
          <button @click="removeSymbol(sIndex)">X</button>
        </div>
      </div>
      <button @click="addSymbol">Add Symbol</button>
      <hr />

      <!-- COLUMNS -->
      <div class="form-group">
        <div class="form-item">
          <h3>Number of columns</h3>
          <input
            type="number"
            v-model.number="numberOfColumns"
            min="1"
            max="10"
          />
        </div>
        <!-- ROWS -->
        <div class="form-item">
          <h3>Number of rows</h3>
          <input
            type="number"
            v-model.number="numberOfRows"
            min="1"
            :max="numberOfColumns"
          />
        </div>
      </div>
      <hr />

      <!-- START VIEW -->
      <h3>View</h3>
      <div class="form-group">
        <div
          class="form-item"
          v-for="(view, vIndex) in startView"
          :key="`column-${vIndex}`"
        >
          <span
            v-for="(vItem, vItemIndex) in view"
            :id="`row-${vIndex}-item-${vItemIndex}`"
            :key="`row-${vIndex}-item-${vItemIndex}`"
            >{{ vItem.value }}</span
          >
        </div>
      </div>
      <hr />

      <!-- LINES -->
      <h3>Lines</h3>
      <div class="form-group-column">
        <div
          class="form-item-row line"
          v-for="(line, lIndex) in lines"
          :key="`line-${lIndex}`"
        >
          <input
            v-for="(lineItem, lItemIndex) in line"
            :id="`line-${lIndex}-item-${lItemIndex}`"
            :key="`line-${lIndex}-item-${lItemIndex}`"
            v-model.number="lineItem.value"
          />
          <button @click="removeLine(lIndex)">X</button>
        </div>
      </div>
      <button @click="addLine">Add Line</button>
      <hr />

      <!-- REELS -->
      <h3>Reels</h3>
      <div class="form-group">
        <div
          class="form-item"
          v-for="(reel, rIndex) in reels"
          :key="`reel-${rIndex}`"
        >
          <select
            v-for="(reelItem, rItemIndex) in reel"
            :id="`reel-${rIndex}-item-${rItemIndex}`"
            :key="`reel-${rIndex}-item-${rItemIndex}`"
            v-model="reelItem.value"
          >
            <option
              v-for="(symbol, sIndex) in symbols"
              :id="`reel-${rIndex}-item-${rItemIndex}-symbol-${sIndex}`"
              :key="`reel-${rIndex}-item-${rItemIndex}-symbol-${sIndex}`"
              :value="symbol.value"
              >{{ symbol.value }}
            </option></select
          >
          <button @click="addRow(rIndex)">Add Reel Row</button>
          <button @click="removeRow(rIndex)">
            Remove reel row
          </button>
        </div>
      </div>

      <hr />

      <h3>PayTable</h3>
      <div class="form-group-row">
        <div
          class="form-item-row"
          v-for="(ptItem, ptIndex) in paytable"
          :key="`paytable-${ptIndex}`"
        >
          <label
            v-for="(ptItem, ptItemIndex) in ptItem"
            :for="`paytable-${ptIndex}-item-${ptItemIndex}`"
            :id="`paytable-${ptIndex}-item-${ptItemIndex}-label`"
            :key="`paytable-${ptIndex}-item-${ptItemIndex}-label`"
            >{{ ptItem.symbolsCount }} of {{ ptItem.symbol.value }}

            <input
              :id="`paytable-${ptIndex}-item-${ptItemIndex}`"
              :key="`paytable-${ptIndex}-item-${ptItemIndex}`"
              v-model.number="ptItem.cost"
            />
          </label>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>

<script>
import MegaSlotService from "../services/MegaSlotService";
export default {
  name: "MegaSlotAdmin",
  components: {},
  data() {
    return {
      slots: [],
      slotId: "",
      name: `Draft ${Date.now()}`,
      isSlotLoaded: false,
      numberOfColumns: 1,
      numberOfRows: 1,
      symbols: [],
      reels: [],
      lines: [],
      startView: [],
      bids: [],
      paytable: [],
      rtpInProgress: false,
      RTP: {
        totalRTP: 0,
        middleRTP: 0,
      },
    };
  },
  watch: {
    symbols: {
      handler() {
        this.setup(this.numberOfColumns, this.numberOfRows);
      },
      deep: true,
    },
    numberOfColumns(numberOfColumns) {
      if (numberOfColumns < this.numberOfRows) {
        this.numberOfRows += numberOfColumns - this.numberOfRows;
      }
      this.setup(numberOfColumns, this.numberOfRows);
    },
    numberOfRows(numberOfRows) {
      if (numberOfRows > this.numberOfColumns) {
        this.numberOfColumns += numberOfRows - this.numberOfColumns;
      }
      this.setup(this.numberOfColumns, numberOfRows);
    },
  },
  computed: {},
  methods: {
    random(length) {
      return Math.floor(Math.random() * length);
    },
    randomSymbol() {
      return this.symbols[this.random(this.symbols.length)];
    },
    symbolByIdx(idx) {
      return this.symbols[idx] || this.symbols[0];
    },
    addSymbol() {
      let symbols = this.symbols.map((s) => s);
      symbols.push({
        value: -1,
        image: -1,
      });
      this.$set(this, "symbols", symbols);
    },
    removeSymbol(sIndex) {
      let symbols = this.symbols.map((s) => s);
      symbols.splice(sIndex, 1);
      this.$set(this, "symbols", symbols);
    },
    addLine() {
      let lines = this.lines.map((l) => l);

      let lastIndex = lines.length;
      for (let i = 0; i < this.numberOfColumns; i++) {
        if (!lines[lastIndex]) {
          lines[lastIndex] = [];
        }
        lines[lastIndex][i] = {
          value: 0,
        };
      }

      this.$set(this, "lines", lines);
    },
    removeLine(lIndex) {
      let lines = this.lines.map((l) => l);
      if (lines.length > 1) {
        lines.splice(lIndex, 1);
      }
      this.$set(this, "lines", lines);
    },
    addRow(reelIndex) {
      let reels = this.reels.map((r) => r);
      console.log(reels[reelIndex].length % this.symbols.length);
      let r = reels[reelIndex];
      r.push({
        value: this.symbolByIdx(r.length % this.symbols.length).value,
      });

      this.$set(this, "reels", reels);
    },
    removeRow(reelIndex) {
      let reels = this.reels.map((r) => r);
      let r = reels[reelIndex];
      if (r.length > 1) {
        r.splice(r.length - 1, 1);
      }
      this.$set(this, "reels", reels);
    },
    removeColumn() {
      this.numberOfColumns--;
      this.numberOfColumns =
        this.numberOfColumns <= 0 ? 1 : this.numberOfColumns;
    },
    addColumn() {
      this.numberOfColumns++;
    },
    setReels({ rIndex, rItemIndex, value }) {
      console.log({ rIndex, rItemIndex, value });
      let reels = this.reels.map((r) => r);
      reels[rIndex][rItemIndex] = value;
      this.$set(this, "reels", reels);
    },
    setup(numberOfColumns, numberOfRows) {
      // Set reels
      let reels = this.reels.map((reel) => {
        let r = reel.map((ri) => ri);

        return r;
      });
      if (numberOfColumns > reels.length) {
        reels.push([]);
        for (let i = 0; i < reels[0].length; i++) {
          if (!reels[reels.length - 1][i]) {
            reels[reels.length - 1][i] = {
              value: this.randomSymbol().value,
            };
          }
        }
      } else {
        reels.splice(-reels.length, reels.length - numberOfColumns);
      }

      this.$set(this, "reels", reels);

      // Set views
      let startView = [];
      for (let i = 0; i < numberOfColumns; i++) {
        if (!startView[i]) {
          startView[i] = [];
        }

        for (let j = 0; j < numberOfRows; j++) {
          const rndmSymbol = this.randomSymbol();
          console.log(startView[i][j] && startView[i][j].value);
          startView[i][j] = {
            value:
              (startView[i][j] && startView[i][j].value) ||
              (rndmSymbol && rndmSymbol.image) ||
              -1,
          };
        }
        startView[i].splice(
          -startView[i].length,
          startView[i].length - numberOfRows
        );
      }
      startView.splice(-startView.length, startView.length - numberOfColumns);
      this.$set(this, "startView", startView);

      // Set lines.
      let lines = this.lines.map((line) => {
        let l = line.map((li) => li);
        if (numberOfColumns > l.length) {
          for (let i = 0; i < numberOfColumns; i++) {
            if (!l[i]) {
              l[i] = {
                value: -1,
              };
            }
          }
        } else {
          l.splice(-l.length, l.length - numberOfColumns);
        }

        return l;
      });

      //lines.splice(-lines.length, lines.length - numberOfRows);

      this.$set(this, "lines", lines);

      let paytable = [];
      for (let i = 0; i < numberOfColumns + 1; i++) {
        if (!paytable[i]) {
          paytable[i] = [];
        }
        this.symbols.forEach((s, si) => {
          if (!paytable[i][si]) {
            paytable[i][si] = {
              symbol: s,
              symbolsCount: i,
              cost:
                (this.paytable[i] &&
                  this.paytable[i][si] &&
                  this.paytable[i][si].cost) ||
                0,
            };
          }
        });
      }

      this.$set(this, "paytable", paytable);
    },
    checkRTP() {
      this.$set(this, "RTP", { totalRTP: 0, middleRTP: 0 });
      this.$set(this, "rtpInProgress", true);
      MegaSlotService.checkSlotRTP({
        playerId: localStorage.getItem("playerId"),
        slotId: this.slotId,
      }).then((res) => {
        this.$set(this, "rtpInProgress", false);
        this.$set(this, "RTP", res.data.rtp);
      });
    },
    createNew() {
      this.$set(this, "name", `Draft ${Date.now()}`);
      this.saveSlot(true);
    },
    deleteSlot() {
      if (!this.slotId) {
        return false;
      }
      let playerId = localStorage.getItem("playerId");
      MegaSlotService.deleteSlot({
        playerId,
        slotId: this.slotId,
      }).then(() => {
        this.$set(this, "slotId", "");
        this.$set(this, "name", "");
        this.$set(this, "numberOfColumns", 0);
        this.$set(this, "numberOfRows", 0);
        this.$set(this, "symbols", []);
        this.$set(this, "startView", []);
        this.$set(this, "reels", []);
        this.$set(this, "lines", []);
        this.$set(this, "paytable", []);
        this.$set(this, "isSlotLoaded", false);
        this.loadSlots();
      });
    },
    saveSlot(isNew) {
      console.log(isNew);
      let playerId = localStorage.getItem("playerId");
      MegaSlotService.saveSlot({
        playerId,
        slotId: isNew ? null : this.slotId,
        data: {
          name: this.name || `Draft ${Date.now()}`,
          number_of_columns: this.numberOfColumns,
          number_of_rows: this.numberOfRows,
          symbols: this.symbols,
          start_view: this.startView,
          reels: this.reels,
          lines: this.lines,
          paytable: this.paytable,
          bids: this.bids,
        },
      }).then((res) => {
        this.$set(this, "slotId", res.data.id);
        this.$set(this, "name", res.data.name);
        this.$set(this, "isSlotLoaded", true);

        this.loadSlots();
      });
    },
    loadSlot() {
      let playerId = localStorage.getItem("playerId");
      MegaSlotService.getSlot({
        playerId,
        slotId: this.slotId,
      }).then((res) => {
        this.$set(this, "slotId", res.data.id);
        this.$set(this, "name", res.data.name || `Draft ${Date.now()}`);
        this.$set(this, "numberOfColumns", res.data.number_of_columns);
        this.$set(this, "numberOfRows", res.data.number_of_rows);
        this.$set(this, "symbols", res.data.symbols);
        this.$set(this, "startView", res.data.start_view);
        this.$set(this, "reels", res.data.reels);
        this.$set(this, "lines", res.data.lines);
        this.$set(this, "paytable", res.data.paytable);
        this.$set(this, "isSlotLoaded", true);
      });
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

<style scoped>
.container {
  padding: 5px;
  margin: 5px;
}
.form-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.form-item {
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.form-group-column {
  display: flex;
  flex-direction: column;
}
.form-item-row {
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 5px;
}
.form-item select {
  margin: 10px;
}
.form-item-row input {
  margin: 5px;
  width: 85%;
}
.line input {
  width: 10%;
}
.form-item-row label {
  display: flex;
  flex-direction: column;
}

@keyframes rtpInProgress {
  0% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.rtp-in-progress {
  animation: rtpInProgress 0.5s infinite;
}
</style>
