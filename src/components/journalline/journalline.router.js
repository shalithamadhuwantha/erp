"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalLineRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const jornalLineService = __importStar(require("./journalline.service"));
exports.journalLineRouter = express_1.default.Router();
//GET LIST
exports.journalLineRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield jornalLineService.list();
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Jorual List could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.journalLineRouter.get("/ref/:name", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const name = request.params.name;
    try {
        const data = yield jornalLineService.getbyRef(name);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Jorual List could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//GET 
exports.journalLineRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield jornalLineService.get(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Jorunal Lines could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.journalLineRouter.get("/filter", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chartofAccountId, startDate, endDate } = request.query;
        // Parse the startDate, set it to midnight if provided, or use today's date
        const filterStartDate = startDate ? new Date(startDate) : new Date();
        filterStartDate.setHours(0, 0, 0, 0); // Set the time to the start of the day
        // Parse the endDate, set it to the end of the day if provided, or use today's date
        const filterEndDate = endDate ? new Date(endDate) : new Date();
        filterEndDate.setHours(23, 59, 59, 999); // Set the time to the end of the day
        // Log the parameters for debugging
        console.log(`Filtering journal lines for chartofAccountId=${chartofAccountId || "ALL"} between ${filterStartDate} and ${filterEndDate}`);
        // Validate the parsed dates
        if (isNaN(filterStartDate.getTime()) || isNaN(filterEndDate.getTime())) {
            return response.status(400).json({ message: "Invalid date format." });
        }
        // Fetch filtered journal lines from the service
        const journalLines = yield jornalLineService.getByAccountAndDateRange(chartofAccountId ? chartofAccountId : null, filterStartDate, filterEndDate);
        // If no journal lines are found, return a 404
        if (!journalLines || journalLines.length === 0) {
            return response.status(404).json({ message: "No journal lines found for the specified criteria." });
        }
        // Return the filtered journal lines
        return response.status(200).json({ data: journalLines });
    }
    catch (error) {
        console.error("Error fetching journal lines:", error);
        return response.status(500).json({ message: "An error occurred while retrieving journal lines.", error: error.message });
    }
}));
//POST
exports.journalLineRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        data = Object.assign(Object.assign({}, data), { createdBy: userId });
        const newbrand = yield jornalLineService.create(data);
        if (newbrand) {
            return response.status(201).json({ message: "Jorunal Line Created Successfully", data: newbrand });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.journalLineRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateBrand = yield jornalLineService.update(data, id);
        if (updateBrand) {
            return response.status(201).json({ message: "Jorunal Line Updated Successfully", data: updateBrand });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
