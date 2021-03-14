const UUIDService = require("./UUIDService");
const Player = require("../../slot/Player");

class PlayerService {
  constructor(dBclient) {
    this.dBclient = dBclient;
    this.UUIDService = new UUIDService();
  }
  async selectPlayerById({ id }) {
    const query = {
      text: `SELECT * FROM players WHERE id=$1`,
      values: [id],
    };
    const queryRes = await this.dBclient.query(query);

    return (queryRes.rows.length && new Player(queryRes.rows[0])) || {};
  }
  async createPlayer({ id, balance, total }) {
    id = this.UUIDService.uuidv4();
    const query = {
      text:
        "INSERT INTO players(id, balance, total) VALUES($1,$2,$3) RETURNING *",
      values: [id, balance, total],
    };
    const queryRes = await this.dBclient.query(query);
    return (queryRes.rows.length && new Player(queryRes.rows[0])) || {};
  }

  async updateBalance({ id, balance, total }) {
    const query = {
      text:
        "UPDATE players SET balance = $2, total = $3 WHERE id = $1 RETURNING *",
      values: [id, balance, total],
    };
    const queryRes = await this.dBclient.query(query);

    return (queryRes.rows.length && new Player(queryRes.rows[0])) || {};
  }
}

module.exports = PlayerService;
