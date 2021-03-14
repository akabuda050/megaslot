const db = require("./index");

const playersFieldsQuery = `
ALTER TABLE "players"
    ADD IF NOT EXISTS "total" numeric(18,8) NOT NULL;
COMMENT ON TABLE "players" IS '';
`;

db.query(playersFieldsQuery, (err, res) => {
    if (err) {
        console.log(err.stack);
    } else {
        console.log('playersFieldsQuery has been successful!');
    }
});

db.end()