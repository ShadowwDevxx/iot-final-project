"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const httpLogger_1 = require("./middleware/httpLogger");
const logger_1 = require("./config/logger");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(httpLogger_1.httpLogger);
app.listen(process.env.PORT || 5000, () => {
    logger_1.logger.info(`Server is running on port ${process.env.PORT || 5000}`);
});
