import cors from "cors";
import express from "express";
import { router as indexRoutes } from "./api/indexRoutes";
import { router as nodeRoutes } from "./api/nodeRoutes";
import { router as readingRoutes } from "./api/readingRoutes";
import { router as sensorRoutes } from "./api/sensorRoutes";
import { httpLogger } from "./middleware/httpLogger";
import { logger } from "./config/logger";

const app = express();

app.use("/admin", express.static("./src/public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(httpLogger);

app.use("/", indexRoutes);
app.use("/node", nodeRoutes);
app.use("/sensor", sensorRoutes);
app.use("/reading", readingRoutes);

app.listen(process.env.PORT || 5000, () => {
  logger.info(`Server is running on port ${process.env.PORT || 5000}`);
});
