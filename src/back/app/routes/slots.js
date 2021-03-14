const Router = require("express-promise-router");
const PlayerService = require("../services/PlayerService");
const SlotService = require("../services/SlotService");
const dbClient = require("../../db");
const Slot = require("../../slot/Slot");

/**
 * Define routes.
 */
const router = new Router();
const playerService = new PlayerService(dbClient);
const slotService = new SlotService(dbClient);

router
  .post("/all", async (req, res) => {
    let slots = await slotService.selectSlots();

    return res.json(slots);
  })
  .post("/get", async (req, res) => {
    let playerId = req.body.playerId;
    let slotId = req.body.slotId;

    if (!slotId) {
      return res.status(404).json({
        status: "not-found",
        message: "Slot not found.",
      });
    }

    let slot = await slotService.selectSlotById({ id: slotId });

    return res.json(slot);
  })
  .post("/check-rtp", async (req, res) => {
    let playerId = req.body.playerId;
    let slotId = req.body.slotId;

    if (!slotId) {
      return res.status(404).json({
        status: "not-found",
        message: "Slot not found.",
      });
    }

    let slot = await slotService.selectSlotById({ id: slotId });
    const __slot = new Slot(slot);
    const rtp = await __slot.checkRTP();
    return res.json({ status: "success", rtp: rtp });
  })
  .post("/delete", async (req, res) => {
    let playerId = req.body.playerId;
    let slotId = req.body.slotId;

    await slotService.deleteSlot({ id: slotId });

    return res.json({ status: "success", message: "deleted" });
  })
  .post("/save", async (req, res) => {
    let playerId = req.body.playerId;
    let slotId = req.body.slotId;
    let data = req.body.data;
    let slot = await slotService.updateSlot({ id: slotId, data: data });

    return res.json(slot);
  })
  .post("/prepareGame", async (req, res) => {
    let playerId = req.body.playerId;
    let slotId = req.body.slotId;

    let player = {};

    if (playerId) {
      player = await playerService.selectPlayerById({ id: playerId });
    }

    if (!playerId || !player.id) {
      return res.status(404).json({
        status: "not-found",
        message: "Player not found.",
      });
    }

    await player.initializeSlotMachine(slotId);
    const slot = player.slot;
    if (!slot.id) {
      return res.status(404).json({
        status: "not-found",
        message: "Slot not found.",
      });
    }

    return res.json({
      playerId: player.id,
      view: slot.getStartView(true),
      wonMoney: slot.wonMoney,
      balance: slot.getBalance(),
      total: player.total,
      bids: slot.getBids(),
      hitRate: slot.hitRateOfDefaultGame,
      reels: slot.getMappedReels(),
      symbols: slot.symbols,
      paytable: slot.getPayTable(),
      linesNum: slot.lines.length,
      name: slot.name,
    });
  })
  .post("/spin", async (req, res) => {
    let playerId = req.body.playerId;
    let slotId = req.body.slotId;
    let player = {};
    if (playerId) {
      player = await playerService.selectPlayerById({ id: playerId });
    }
    if (!playerId || !player.id) {
      res.status(400).send("No needs to see that!");
    }

    let bid = req.body.bid;
    if (!bid) {
      res.status(400).send("Choose bid!");
    }

    await player.initializeSlotMachine(slotId);
    const slot = player.slot;
    if (!slot.id) {
      return res.status(404).json({
        status: "not-found",
        message: "Slot not found.",
      });
    }

    slot.startGame(bid);
    player = await playerService.updateBalance({
      id: player.id,
      balance: slot.balance,
      total: +player.total,
    });

    const result = res.json({
      view: slot.getView(),
      winLines: slot.winLines,
      wonMoney: slot.wonMoney,
      balance: player.balance,
      total: player.total,
      hitRate: slot.hitRateOfDefaultGame,
      reels: slot.getMappedReels(),
      paytable: slot.getPayTable(),
      linesNum: slot.lines.length,
      name: slot.name,
    });

    return result;
  });

module.exports = router;
