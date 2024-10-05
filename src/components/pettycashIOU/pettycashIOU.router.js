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
exports.pettyCashIOURouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const pettycashIOUService = __importStar(require("./pettycashIOU.service"));
const IOUDetailService = __importStar(require("../pettycashIOUDetails/pettycashIOUDetails.service"));
const chartofaccService = __importStar(require("../ChartofAccount/chartofaccount.service"));
const journalLineService = __importStar(require("../journalline/journalline.service"));
exports.pettyCashIOURouter = express_1.default.Router();
//GET LIST
exports.pettyCashIOURouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pettyCashIOU = yield pettycashIOUService.list();
        if (pettyCashIOU) {
            return response.status(200).json({ data: pettyCashIOU });
        }
        return response.status(404).json({ message: "Petty Cash IOU could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//POST
exports.pettyCashIOURouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        data = Object.assign(Object.assign({}, data), { createdBy: userId });
        const newpettyCashIOU = yield pettycashIOUService.create(data);
        if (newpettyCashIOU) {
            return response.status(201).json({ message: "Petty Cash IOU Successfully", data: newpettyCashIOU });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.pettyCashIOURouter.put("/pettyCashDetail/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        console.log(data);
        const userId = request.user.id;
        const updateioudetails = {
            spent: data.spent,
            returnDate: data === null || data === void 0 ? void 0 : data.returnDate,
            returnAmount: data.returnAmount,
            isReturn: data.isReturn
        };
        yield IOUDetailService.deletebyIOUId(id);
        const updateIOUdetails = yield pettycashIOUService.update(updateioudetails, id);
        if (data.journalEntries && data.journalEntries.length > 0) {
            const journalEntries = data.journalEntries;
            // Loop through each journal entry and create corresponding journalLine
            for (let entry of journalEntries) {
                var chartofAccId = entry.accountId;
                if (entry.accountId === "CASH") {
                    var cashchartofaccid = yield chartofaccService.getbyname('CASH BOOK');
                    chartofAccId = cashchartofaccid === null || cashchartofaccid === void 0 ? void 0 : cashchartofaccid.id;
                }
                if (entry.accountId === "Check") {
                    var pendingCheque = yield chartofaccService.getbyname('PENDING CHEQUE');
                    chartofAccId = pendingCheque === null || pendingCheque === void 0 ? void 0 : pendingCheque.id;
                }
                if (entry.accountId === "Expencess") {
                    var expencessacc = yield chartofaccService.getbyname('EXPENCESS ACCOUNT');
                    chartofAccId = expencessacc === null || expencessacc === void 0 ? void 0 : expencessacc.id;
                }
                if (entry.accountId === "PettyCash") {
                    var expencessacc = yield chartofaccService.getbyname('PETTY CASH');
                    chartofAccId = expencessacc === null || expencessacc === void 0 ? void 0 : expencessacc.id;
                }
                if (entry.accountId === "UserExp") {
                    var expencessacc = yield chartofaccService.getbyname('USER EXPENCESS ACCOUNT');
                    chartofAccId = expencessacc === null || expencessacc === void 0 ? void 0 : expencessacc.id;
                }
                if (entry.accountId === "Sales") {
                    var expencessacc = yield chartofaccService.getbyname('SALES ACCOUNT');
                    chartofAccId = expencessacc === null || expencessacc === void 0 ? void 0 : expencessacc.id;
                }
                const journalLineData = {
                    voucherId: updateIOUdetails.voucherId, // Link to the created voucher
                    chartofAccountId: chartofAccId, // Account ID from the journal entry
                    debitAmount: entry.debit || 0, // Debit amount if present
                    creditAmount: entry.credit || 0, // Credit amount if present
                    ref: entry.ref, // Reference number from the voucher
                    createdBy: userId, // Assuming `req.user.id` contains the user ID
                };
                yield journalLineService.create(journalLineData);
            }
        }
        const IOUDetailsPromises = data.pettyCashIOUDetails.map((detail) => __awaiter(void 0, void 0, void 0, function* () {
            const IOUdetail = yield IOUDetailService.create({
                refnumber: detail.refnumber,
                description: detail.description,
                amount: detail.amount,
                pettycashIOUId: id,
                createdBy: userId
            });
            if (!IOUdetail) {
                throw new Error("Failed to update OEM Numbers");
            }
            return IOUdetail;
        }));
        try {
            // Wait for all promises
            const [IOUDetails] = yield Promise.all([
                Promise.all(IOUDetailsPromises),
            ]);
            // Combine product and OEM numbers into a single data object
            const combinedData = Object.assign(Object.assign({}, updateIOUdetails), { pettyCashIOUDetails: IOUDetails });
            // Return the response including the combined data
            return response.status(201).json({
                message: "IOU Updated Successfully",
                data: combinedData
            });
        }
        catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.pettyCashIOURouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const UpdatepettyCashIOU = yield pettycashIOUService.update(data, id);
        if (UpdatepettyCashIOU) {
            return response.status(201).json({ message: "Petty Cash IOU Updated Successfully", data: UpdatepettyCashIOU });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
