"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("../config/logger");
const stream = {
    write: (message) => logger_1.logger.http(`${message}`),
};
exports.httpLogger = (0, morgan_1.default)(":remote-addr :method :url :status :res[content-length] - :response-time ms", { stream });