import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { faker } from "@faker-js/faker";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";
import { logger } from "./utils/logger.js";
import cluster from "cluster";
import { cpus } from "os";
import { swaggerOptions } from "./utils/swaggerOptions.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"

configDotenv();

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(cookieParser());

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.get("/api/test/user", (req, res) => {
  let first_name = faker.person.firstName();
  let last_name = faker.person.lastName();
  let email = faker.internet.email();
  let password = faker.internet.password();

  res.send({ first_name, last_name, email, password });
});

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    logger.error(
      "exit process: " +
        worker.process.pid +
        " " +
        new Date().toLocaleDateString()
    );
    cluster.fork();
  });
}
if (cluster.isWorker) {
  app.listen(PORT, () =>
    logger.info(`Process ${process.pid} Listening on ${PORT}`)
  );
}
