const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const config = require("./config/config");
const router = require("./app/routes");

/** App starts. */
const app = express()
  .use(morgan("combined"))
  .use(bodyParser.json())
  .use(cors());

app.use("/", express.static(path.join(__dirname, "../front/dist/client")));
app.use("/admin", express.static(path.join(__dirname, "../front/dist/admin")));

// Slot routes.
app.use("/api/v1/slots", router.slots);
app.use("/api/v1/players", router.players);
/**
 * Setup database.
 */
app.listen(process.env.PORT || config.port, () =>
  console.log(`Server start on port ${config.port} ...`)
);
