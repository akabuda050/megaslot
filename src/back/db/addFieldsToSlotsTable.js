const db = require("./index");

const slotsFieldsQuery = `
ALTER TABLE "slots"
    ADD IF NOT EXISTS "name" varchar(64) DEFAULT 'MegaSlot',
    ADD IF NOT EXISTS "number_of_columns" int NOT NULL,
    ADD IF NOT EXISTS "number_of_rows" int NOT NULL,
    
    ADD IF NOT EXISTS "symbols" JSONB  NOT NULL,
    ADD IF NOT EXISTS "reels" JSONB  NOT NULL,
    ADD IF NOT EXISTS "lines" JSONB  NOT NULL,
    ADD IF NOT EXISTS "start_view" JSONB  NOT NULL,
    ADD IF NOT EXISTS "bids" JSONB  NOT NULL,
    ADD IF NOT EXISTS "paytable" JSONB  NOT NULL;
COMMENT ON TABLE "slots" IS '';
`;

db.query(slotsFieldsQuery, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log('slotsFieldsQuery has been successful!');
  }
});

db.end();
