import { Request, Response, Router } from "express";
import "dotenv/config";
import { prisma } from "../config/prisma";
import { logger } from "../config/logger";

export const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id: sensorId } = req.params;
    const sensor = await prisma.sensor.findUnique({
      where: {
        id: sensorId,
      },
    });
    res.status(200).json(sensor);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const sensors = await prisma.sensor.findMany();
    res.status(200).json(sensors);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { sensorName, sensorType, sensorStatus, sensorUnit, nodeId } =
      req.body;
    const sensor = await prisma.sensor.create({
      data: {
        sensorUnit,
        sensorName,
        sensorType,
        sensorStatus,
        nodeId,
      },
    });
    res.status(200).send(sensor.id);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id: sensorId } = req.params;
    const { sensorName, sensorType, sensorStatus, sensorUnit, nodeId } =
      req.body;
    const sensor = await prisma.sensor.update({
      where: {
        id: sensorId,
      },
      data: {
        sensorUnit,
        sensorName,
        sensorType,
        sensorStatus,
        nodeId,
      },
    });
    res.status(200).json(sensor);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id: sensorId } = req.params;
    const sensor = await prisma.sensor.delete({
      where: {
        id: sensorId,
      },
    });
    res.status(200).json(sensor);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});
