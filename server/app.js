const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");
const cors = require("cors");
const initDatabase = require("./startApp/initDatabase");
const routes = require("./routes");

const PORT = config.get("port") ?? 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// /api
app.use("/api", routes);
app.use(cors());

process.env.NODE_ENV === "production" &&
  console.log(chalk.blue("Production environment"));
process.env.NODE_ENV === "development" &&
  console.log(chalk.blue("Development environment"));

async function start() {
  try {
    mongoose.connection.once("open", () => {
      initDatabase();
    });
    await mongoose.connect(config.get("mongoUri"));
    console.log(chalk.green("MongoDB is connected..."));
    app.listen(PORT, () =>
      console.log(chalk.green(`Server has been started on port ${PORT}...`))
    );
  } catch (err) {
    console.log(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

start();
