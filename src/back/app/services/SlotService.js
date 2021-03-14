const UUIDService = require("./UUIDService");

class SlotService {
  constructor(dBclient) {
    this.dBclient = dBclient;
    this.UUIDService = new UUIDService();
  }
  async selectSlotById({ id }) {
    const query = {
      text: `SELECT * FROM slots WHERE id=$1`,
      values: [id],
    };
    const queryRes = await this.dBclient.query(query);

    return queryRes.rows[0];
  }
  async selectSlots() {
    const query = {
      text: `SELECT * FROM slots`,
    };
    const queryRes = await this.dBclient.query(query);

    return queryRes.rows.map((s) => {
      return {
        id: s.id,
        name: s.name,
        number_of_columns: s.number_of_columns,
        number_of_rows: s.number_of_rows,
        lines: s.lines.length,
      };
    });
  }
  async createSlot({ id, data }) {
    id = id || this.UUIDService.uuidv4();
    const query = {
      text:
        "INSERT INTO slots(id, name, number_of_columns, number_of_rows, symbols, reels, lines, start_view, bids, paytable) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING *",
      values: [
        id,
        data.name,
        JSON.stringify(data.number_of_columns),
        JSON.stringify(data.number_of_rows),
        JSON.stringify(data.symbols),
        JSON.stringify(data.reels),
        JSON.stringify(data.lines),
        JSON.stringify(data.start_view),
        JSON.stringify(data.bids),
        JSON.stringify(data.paytable),
      ],
    };
    const queryRes = await this.dBclient.query(query);
    console.log(queryRes);
    return queryRes.rows[0];
  }

  async updateSlot({ id, data }) {
    if (!id || !(await this.selectSlotById({ id }))) {
      return await this.createSlot({ id: null, data: data });
    } else {
      const query = {
        text:
          "UPDATE slots SET name = $2, number_of_columns = $3, number_of_rows = $4, symbols = $5,  reels = $6, lines = $7, start_view = $8, bids = $9, paytable = $10 WHERE id = $1 RETURNING *",
        values: [
          id,
          data.name,
          JSON.stringify(data.number_of_columns),
          JSON.stringify(data.number_of_rows),
          JSON.stringify(data.symbols),
          JSON.stringify(data.reels),
          JSON.stringify(data.lines),
          JSON.stringify(data.start_view),
          JSON.stringify(data.bids),
          JSON.stringify(data.paytable),
        ],
      };
      const queryRes = await this.dBclient.query(query);

      return queryRes.rows[0];
    }
  }
  async deleteSlot({ id }) {
    const query = {
      text: `DELETE FROM slots WHERE id=$1`,
      values: [id],
    };
    const queryRes = await this.dBclient.query(query);
    return queryRes;
  }
}

module.exports = SlotService;
