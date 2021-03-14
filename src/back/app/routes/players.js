const Router = require("express-promise-router");
const dbClient = require("../../db");
const PlayerService = require("../services/PlayerService");

/**
 * Define routes.
 */
const router = new Router();
const playerService = new PlayerService(dbClient);

router.post("/create-player", async (req, res) => {
    const player = await playerService.createPlayer({
      id: null,
      balance: 15000,
      total: 0
    });

    return res.json({
      playerId: player.id,
      balance: 15000,
      total: 0
    });
  }).post("/deposit", async (req, res) => {
    let playerId = req.body.playerId;
    let player = await playerService.selectPlayerById({id: playerId})

    let newBalance = +player.balance + 500;
    let total = +player.total - 500;
    player = await playerService.updateBalance({id: playerId, balance: newBalance, total: total})

    return res.json({
        playerId: player.id,
        balance: player.balance,
        total: player.total,
    });
}).post("/withdrawal", async (req, res) => {
    let playerId = req.body.playerId;
    let player = await playerService.selectPlayerById({id: playerId})

    if(+player.balance < 10){
        return res.status(400).json({
            status: "error",
            message: "Min withdrawal from $10",
        });
    }
    let toWithdrawal = +player.balance * 0.25;
    let newBalance = +player.balance - toWithdrawal;
    let total = +player.total + toWithdrawal;
    player = await playerService.updateBalance({id: playerId, balance: newBalance, total: total})

    return res.json({
        playerId: player.id,
        balance: player.balance,
        total: player.total,
    });
})


module.exports = router;
