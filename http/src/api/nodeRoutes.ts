import { Request, Response, Router } from "express";
import "dotenv/config";
import { prisma } from "../config/prisma";
import { logger } from "../config/logger";

export const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id: nodeId } = req.params;
    const node = await prisma.node.findUnique({
      where: {
        id: nodeId,
      },
    });

    res.status(200).json(node);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/fetch/all", async (req: Request, res: Response) => {
  try {
    const nodes = await prisma.node.findMany();

    res.status(200).json(nodes);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { nodeName, nodeDevice, nodeLocation, nodeStatus } = req.body;
    const node = await prisma.node.create({
      data: {
        nodeName,
        nodeDevice,
        nodeLocation,
        nodeStatus,
      },
    });

    res.status(200).send(node.id);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id: nodeId } = req.params;
    const { nodeName, nodeDevice, nodeLocation, nodeStatus } = req.body;
    const node = await prisma.node.update({
      where: {
        id: nodeId,
      },
      data: {
        nodeName,
        nodeDevice,
        nodeLocation,
        nodeStatus,
      },
    });

    res.status(200).json(node);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id: nodeId } = req.params;
    const node = await prisma.node.delete({
      where: {
        id: nodeId,
      },
    });

    res.status(200).json(node);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
});
