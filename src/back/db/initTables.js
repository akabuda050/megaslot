const db = require("./index");

// callback - checkout a client
const playersTableQuery = `
CREATE TABLE IF NOT EXISTS "players" (
    "id" uuid NOT NULL,
    "balance" numeric(18,8) NOT NULL
);
`;

// Create players table.
db.query(playersTableQuery, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log('Players table has been created!');
  }
});

const slotsTableQuery = `
CREATE TABLE IF NOT EXISTS "slots" (
    "id" uuid NOT NULL
);
`;

// Create slots table.
db.query(slotsTableQuery, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log('Slots table has been created!');
  }
});

db.end();
