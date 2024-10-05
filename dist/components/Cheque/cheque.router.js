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
exports.chequeRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const chequeservice = __importStar(require("./cheque.service"));
const journalLineService = __importStar(require("../journalline/journalline.service"));
const chartofaccService = __importStar(require("../ChartofAccount/chartofaccount.service"));
exports.chequeRouter = express_1.default.Router();
//GET
exports.chequeRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield chequeservice.list();
        return response.status(200).json({ data: data });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.chequeRouter.get("/unusedCheque/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield chequeservice.getUnusedChequesByAccountId(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Cheques could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//GET
exports.chequeRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield chequeservice.get(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Cheque could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.chequeRouter.get('/chequeNumber/:chartOfAccountId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const chartOfAccountId = request.params.chartOfAccountId; // Get the account ID from query parameters
    try {
        if (!chartOfAccountId) {
            return response.status(400).json({ message: "Chart of Account ID is required." });
        }
        const chequeNumber = yield chequeservice.getNextChequeNumber(chartOfAccountId);
        response.status(200).json({ data: chequeNumber });
    }
    catch (error) {
        response.status(404).json({ message: error.message });
    }
}));
//POST
exports.chequeRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        data = Object.assign(Object.assign({}, data), { createdBy: userId });
        console.log(data);
        const newCheque = yield chequeservice.create(data);
        if (newCheque) {
            return response.status(201).json({ message: "Cheque Created Successfully", data: newCheque });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//UPDATE
exports.chequeRouter.put("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        const updateCheque = yield chequeservice.update(data, id);
        if (updateCheque) {
            return response.status(201).json({ message: "Cheque Updated Successfully", data: updateCheque });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.chequeRouter.put("/used/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id; // Correct extraction of the ID
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        const updateCheque = yield chequeservice.updateused({ used: data.used, month: data.month, year: data.year }, id); // Pass 'id' as a string
        // Handle journal entries if present
        if (data.journalEntries && data.journalEntries.length > 0) {
            const journalEntries = data.journalEntries;
            for (let entry of journalEntries) {
                var chartofAccId = entry.accountId;
                if (entry.accountId === "Cheque") {
                    const pendingCheque = yield chartofaccService.getbyname('PENDING CHEQUE');
                    chartofAccId = pendingCheque === null || pendingCheque === void 0 ? void 0 : pendingCheque.id;
                }
                const journalLineData = {
                    chartofAccountId: chartofAccId,
                    debitAmount: entry.debit || 0,
                    creditAmount: entry.credit || 0,
                    ref: entry.ref,
                    createdBy: userId,
                };
                yield journalLineService.create(journalLineData);
            }
        }
        if (updateCheque) {
            return response.status(201).json({ message: "Cheque Updated Successfully", data: updateCheque });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
