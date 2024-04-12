import { Request, Response, Router } from "express";
import "dotenv/config";
import { prisma } from "../config/prisma";
import { Reading } from "@prisma/client";
import { time } from "console";
import fs from "fs";
import path from "path";

export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to smart node API!");
});

function calculateAverage(array: number[]) {
  if (array.length) {
    const sum = array.reduce((a, b) => a + b, 0);
    return sum / array.length;
  }
  return null;
}

// router.get("/data-dump", async (req: Request, res: Response) => {
//   try {
//     const nodes = await prisma.node.findMany({
//       include: {
//         Reading: {
//           include: {
//             sensor: true,
//           },
//         },
//       },
//     });

//     let mlData: any[] = [];

//     for (const node of nodes) {
//       let groupedReadings: any = {};

//       for (const reading of node.Reading) {
//         // const minute = reading.createdAt.getMinutes();
//         const timeOfDay = `${reading.createdAt.getHours()}:${reading.createdAt.getMinutes()}`;

//         if (!groupedReadings[timeOfDay]) {
//           groupedReadings[timeOfDay] = {
//             temperature: [],
//             humidity: [],
//             lightIntensity: [],
//           };
//         }

//         if (reading.sensor.sensorType === "TEMPERATURE") {
//           groupedReadings[timeOfDay].temperature.push(reading.temperature);
//         } else if (reading.sensor.sensorType === "HUMIDITY") {
//           groupedReadings[timeOfDay].humidity.push(reading.humidity);
//         } else if (reading.sensor.sensorType === "LIGHT_INTENSITY") {
//           groupedReadings[timeOfDay].lightIntensity.push(reading.lightIntensity);
//         }
//       }

//       for (const minute in groupedReadings) {
//         const dataPoint = {
//           timeOfDay: timeOfDay,
//           location: node.nodeLocation,
//           temperature: calculateAverage(groupedReadings[minute].temperature),
//           humidity: calculateAverage(groupedReadings[minute].humidity),
//           lightIntensity: calculateAverage(
//             groupedReadings[minute].lightIntensity
//           ),
//         };

//         if (
//           dataPoint.temperature !== null &&
//           dataPoint.humidity !== null &&
//           dataPoint.lightIntensity !== null
//         ) {
//           mlData.push(dataPoint);
//         }
//       }
//     }

//     res.status(200).json(mlData);
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// });

router.get("/data-dump", async (req: Request, res: Response) => {
  try {
    const nodes = await prisma.node.findMany({
      include: {
        Reading: {
          include: {
            sensor: true,
          },
        },
      },
    });

    let mlData: any[] = [];

    for (const node of nodes) {
      let groupedReadings: any = {};

      for (const reading of node.Reading) {
        const timeOfDay = `${reading.createdAt.getHours()}:${reading.createdAt.getMinutes()}`;

        if (!groupedReadings[timeOfDay]) {
          groupedReadings[timeOfDay] = {
            temperature: [],
            humidity: [],
            lightIntensity: [],
          };
        }

        if (reading.sensor.sensorType === "TEMPERATURE") {
          groupedReadings[timeOfDay].temperature.push(reading.temperature);
        } else if (reading.sensor.sensorType === "HUMIDITY") {
          groupedReadings[timeOfDay].humidity.push(reading.humidity);
        } else if (reading.sensor.sensorType === "LIGHT_INTENSITY") {
          groupedReadings[timeOfDay].lightIntensity.push(
            reading.lightIntensity
          );
        }
      }

      for (const timeOfDay in groupedReadings) {
        const dataPoint = {
          timeOfDay: timeOfDay,
          location: node.nodeLocation,
          temperature: calculateAverage(groupedReadings[timeOfDay].temperature),
          humidity: calculateAverage(groupedReadings[timeOfDay].humidity),
          lightIntensity: calculateAverage(
            groupedReadings[timeOfDay].lightIntensity
          ),
        };

        if (
          dataPoint.temperature !== null &&
          dataPoint.humidity !== null &&
          dataPoint.lightIntensity !== null
        ) {
          mlData.push(dataPoint);
        }
      }
    }

    const filePath = path.join(__dirname, "mlData.json");
    fs.writeFileSync(filePath, JSON.stringify(mlData));

    res.status(200).json(mlData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
