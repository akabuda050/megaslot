const dbClient = require("../db");
const SlotService = require("../app/services/SlotService");
const Slot = require("./Slot");

const slotService = new SlotService(dbClient);

class Player {
  constructor({ id, balance, total }) {
    this.id = id;
    this.balance = balance;
    this.total = total;
  }
  async initializeSlotMachine(slotId) {
    let slotData = null;
    if (slotId) {
      slotData = await slotService.selectSlotById({ id: slotId });
    } else {
      slotData = (await slotService.selectSlots())[0];
    }
    this.slot = new Slot(slotData);
    this.slot.setBalance(this.balance);
  }
}

module.exports = Player;
