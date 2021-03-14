const lodash = require("lodash");
const { shuffle } = require("lodash");

class Slot {
  constructor(slot) {
    this.id = slot.id;
    this.name = slot.name || `Mega Slot ${Date.now()}`;
    this.symbols = slot.symbols.map((s) => s.value);
    this.defaultReels = slot.reels.map((r) => r.map((ri) => ri.value));
    this.view = slot.start_view.map((sv) => sv.map((svi) => svi.value));

    this.lines = slot.lines.map((l) => l.map((li) => li.value));
    this.payTable = slot.paytable.map((pt) => pt.map((pti) => pti.cost));

    //this.bids = slot.bids;
    //this.defaultBid = 0.5;
    this.setUp();
  }

  async checkRTP() {
    this.setAllowCredit(true);
    this.setBalance(15000);
    console.log(`balance: ${this.balance}`);
    let middleRTP = 0;
    let numberOfGames = 10000;
    for (let g = 0; g < numberOfGames; g++) {
      let bid = this.bids[this.random(this.bids.length)];
      this.startGame(bid);
      middleRTP += this.totalWonMoney / this.looseMoney;
    }

    const totalRTP = 100 * (this.totalWonMoney / this.looseMoney);
    middleRTP = 100 * (middleRTP / numberOfGames);
    console.log(`Total RTP: ${totalRTP}%`);
    console.log(`balance: ${this.balance}`);
    console.log(`totalalLooseMoney: ${this.looseMoney}`);
    console.log(`totalalWonMoney: ${this.totalWonMoney}`);

    return {
      middleRTP,
      totalRTP,
    };
  }

  random(length) {
    return Math.floor(Math.random() * length);
  }

  setUp() {
    this.prepareBids();
    this.setBalance(0);

    this.wonMoney = 0;
    this.totalWonMoney = 0;
    this.looseMoney = 0;
    this.moneyFromDefaultGame = 0;
    this.hitRateOfDefaultGame = 0;
    this.allowCredit = false;

    this.winLines = [];
  }

  prepareBids() {
    this.oneLineBid = 0.5;
    this.bids = [
      0.5,
      1,
      2,
      2.5,
      4,
      5,
      8,
      10,
      12,
      15,
      16,
      20,
      30,
      40,
      50,
      75,
      80,
      100,
      150,
      250,
      300,
      500,
      1000,
    ];

    this.totalBids = this.lines.length;
  }

  getBids() {
    return this.bids;
  }

  getPayTable() {
    let obj = {};
    this.payTable.forEach((ptElem, ptElemIdx) => {
      ptElem.forEach((p, i) => {
        let key = this.symbols[i];
        if (!obj.hasOwnProperty(key)) {
          obj[key] = {};
        }
        if (!obj[key]["value"]) {
          obj[key]["value"] = {};
        }
        obj[key]["value"][`${ptElemIdx}x`] = p;
      });
    });
    return obj;
  }

  getMappedReels() {
    return this.defaultReels.map((r) => {
      return r.map((rs) => this.symbols.find((s) => s === rs));
    });
  }
  prepareView() {
    this.view = this.getStartView(false);
  }

  getStartView(mapped = false) {
    console.log(this.symbols);
    return mapped
      ? this.view.map((viewLine) =>
          viewLine.map((vs) => this.symbols.find((s) => s === vs))
        )
      : this.view;
  }

  getView() {
    return this.view.map((viewLine) =>
      viewLine.map((vs) => this.symbols.find((s) => s === vs))
    );
  }

  printView() {
    let viewLineLength = this.view[0].length;

    for (let i = 0; i < viewLineLength; i++) {
      for (let j = 0; j < this.view.length && i < this.view[j].length; j++) {
        console.log(this.symbols[this.view[i][j]] + "   ");
      }
      console.log("");
    }
  }

  getBalance() {
    return this.balance;
  }

  setBalance(balance) {
    this.balance = balance;
  }

  removeBidFromBalance(bid) {
    this.balance -= bid;
  }

  spin(reels) {
    for (let i = 0; i < this.view.length; i++) {
      let up = this.random(reels[i].length);
      this.view[i][0] = reels[i][up];

      for (let j = 1; j < this.view[i].length; j++) {
        let next = up + j;
        /*
         * This gives cyclic numbers over reel length, i.e. 11 % 11 = 0, 12 % 11 = 1,
         *   for case when `next` is greater than reel length.
         */
        next = next % reels[i].length;
        this.view[i][j] = reels[i][next];
      }
    }

    /*
    this.view[0][0] = 'B'

    this.view[1][0] = 'B'
    this.view[1][1] = 'B'
    this.view[1][2] = 'B'

    this.view[2][1] = 'B'
    */
  }

  checkLine(line) {
    line = line.filter((l) => !!l);
    console.log(line);
    if (!line.length) {
      return {
        numberOfSymbols: 0,
        lineWin: 0,
        symbol: null,
      };
    }

    let firstSymbol = line[0];
    let numberOfSymbols = 0;
    for (let i = 0; i < line.length; i++) {
      //console.log(line[i] === firstSymbol)
      if (line[i] === firstSymbol) {
        numberOfSymbols++;
      } else {
        break;
      }
    }

    return {
      numberOfSymbols: numberOfSymbols,
      lineWin: this.payTable[numberOfSymbols][
        this.symbols.findIndex((s) => s === firstSymbol)
      ],
      symbol: firstSymbol,
    };
  }

  checkLines(view) {
    let win = 0;
    let prevLines = [];
    for (let l = 0; l < this.lines.length; l++) {
      let line = new Array(view.length).fill(-1);
      let lineIndexes = new Array(view.length).fill(-1);
      for (let i = 0; i < line.length; i++) {
        let index = this.lines[l][i];
        //console.log(index)
        line[i] = view[i][index];
        lineIndexes[i] = index;
      }

      let { lineWin, numberOfSymbols, symbol } = this.checkLine(line);
      if (lineWin) {
        let filteredLine = line.slice(0, numberOfSymbols);
        prevLines.push({
          lineNum: l + 1,
          symbol: symbol,
          numberOfSymbols,
          lineWin: lineWin,
          line: line,
          filteredLine: filteredLine,
          lineIndexes: lineIndexes,
        });
      }
    }

    let acc = [...prevLines];
    prevLines.reduce(this.filterLines, acc).forEach((pl) => {
      win += pl.lineWin;
      this.winLines.push({
        lineNum: pl.lineNum,
        lineWin: pl.lineWin,
        lineIndexes: pl.lineIndexes.splice(0, pl.numberOfSymbols),
        symbols: pl.filteredLine,
      });
    });

    return win;
  }

  filterLines(acc, curr) {
    const currLineIndexes = curr.lineIndexes.slice(0, curr.numberOfSymbols);
    const greaterLines = acc.filter(
      (line) =>
        line.lineNum !== curr.lineNum &&
        line.symbol === curr.symbol &&
        line.lineWin >= curr.lineWin &&
        line.lineIndexes.slice(0, curr.numberOfSymbols).join("") ===
          currLineIndexes.join("")
    );

    if (greaterLines.length) {
      let currIndex = acc.findIndex(
        (accLine) => accLine.lineNum === curr.lineNum
      );
      if (currIndex !== -1) {
        acc.splice(currIndex, 1);
      }
    }

    return acc;
  }

  setAllowCredit(bool) {
    this.allowCredit = bool;
  }
  startGame(bid = this.oneLineBid) {
    if (this.balance - bid < 0 && !this.allowCredit) {
      return false;
    }

    this.winLines = [];
    this.removeBidFromBalance(bid);
    this.looseMoney += bid;

    this.spin(this.defaultReels);
    let win = bid * this.checkLines(this.view);

    this.moneyFromDefaultGame += win;
    this.wonMoney = win;

    if (win > 0) {
      this.balance += win;
      this.totalWonMoney += win;
      this.hitRateOfDefaultGame++;

      return win;
    }
  }
}

module.exports = Slot;
