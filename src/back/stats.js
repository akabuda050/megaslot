(async () => {
  const Player = require("./slot/Player");
  /** Statistic start. */
  let ___player = new Player({ id: 1, balance: 15000 });
  await ___player.initializeSlotMachine();
  let ___slot = ___player.slot;
  ___slot.setAllowCredit(true);

  console.log(`balance: ${___slot.balance}`);
  let middleRTP = 0;
  let numberOfGames = 1000000;
  for (let g = 0; g < numberOfGames; g++) {
    let bid = ___slot.bids[___slot.random(___slot.bids.length)];
    if (___slot.balance - bid <= 0) {
      //console.log(g, ___slot.balance);
      // break;
    }
    ___slot.startGame(bid);
    middleRTP += ___slot.totalWonMoney / ___slot.loooseMoney;
  }
  console.log(`Middle RTP: ${100 * (middleRTP / numberOfGames)}%`);
  console.log(
    `Total RTP: ${100 * (___slot.totalWonMoney / ___slot.loooseMoney)}%`
  );
  console.log(`balance: ${___slot.balance}`);
  console.log(`totalalLooseMoney: ${___slot.loooseMoney}`);
  console.log(`totalalWonMoney: ${___slot.totalWonMoney}`);
  /** Statistic start. */
})();
