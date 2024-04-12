import { Request, Response, Router } from "express";
import "dotenv/config";
import { prisma } from "../config/prisma";
import { logger } from "../config/logger";

export const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id: readingId } = req.params;
    const reading = await prisma.reading.findUnique({
      where: {
        id: readingId,
      },
    });
    res.status(200).json(reading);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/fetch/all", async (req: Request, res: Response) => {
  const { sensorId, nodeId, size } = req.query;
  try {
    const readings = await prisma.reading.findMany({
      where: {
        sensorId: sensorId as string,
        nodeId: nodeId as string,
      },
      take: size ? parseInt(size.toString()) : 25,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(readings);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/fetch/plot", async (req: Request, res: Response) => {
  const { nodeId, size } = req.query;
  try {
    const readings = await prisma.reading.findMany({
      where: {
        nodeId: nodeId as string,
      },
      take: size ? parseInt(size.toString()) : 25,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(readings);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const reading = await prisma.reading.create({
      data: {
        ...req.body,
      },
    });
    res.status(200).json(reading);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id: readingId } = req.params;
    const reading = await prisma.reading.delete({
      where: {
        id: readingId,
      },
    });
    res.status(200).json(reading);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});
