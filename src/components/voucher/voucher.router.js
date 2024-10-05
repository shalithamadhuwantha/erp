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
exports.voucherRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const client_1 = require("@prisma/client");
const vocuherService = __importStar(require("./voucher.service"));
const voucherGrpService = __importStar(require("../voucherGroup/vouchergrp.service"));
const voucherCenter = __importStar(require("../centerVoucher/centerVoucher.service"));
const productVoucherService = __importStar(require("../voucherProduct/voucherProduct.service"));
const inventoryService = __importStar(require("../inventory/inventory.service"));
const journalLineService = __importStar(require("../journalline/journalline.service"));
const chartofaccService = __importStar(require("../ChartofAccount/chartofaccount.service"));
const partyService = __importStar(require("../party/party.service"));
const paymentService = __importStar(require("../payment/payment.service"));
const paymentVoucherService = __importStar(require("../voucherPayment/voucherPayment.service"));
const referVoucherService = __importStar(require("../referVouchers/referVouchers.service"));
const chequebookService = __importStar(require("../ChequeBook/chequebook.service"));
const chequeService = __importStar(require("../Cheque/cheque.service"));
const pettyCashIOUService = __importStar(require("../pettycashIOU/pettycashIOU.service"));
exports.voucherRouter = express_1.default.Router();
//GET LIST
exports.voucherRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield vocuherService.list();
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Voucher could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.voucherRouter.get("/filter", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { VoucherGrpName, startDate, endDate, userId } = request.query;
        if (!VoucherGrpName) {
            return response.status(400).json({ message: "VoucherGrpname is required." });
        }
        const grpname = yield voucherGrpService.getbyname(VoucherGrpName);
        // startDate format and if no end date set today's date
        const filterStartDate = startDate ? new Date(startDate) : new Date();
        filterStartDate.setHours(0, 0, 0, 0); // Set the time to midnight
        // if no endDate set end date as today's date
        const filterEndDate = endDate ? new Date(endDate) : new Date();
        filterEndDate.setHours(23, 59, 59, 999);
        console.log(`VoucherGrpName=${VoucherGrpName} between ${filterStartDate} and ${filterEndDate}`);
        if (isNaN(filterStartDate.getTime()) || isNaN(filterEndDate.getTime())) {
            return response.status(400).json({ message: "Invalid date format." });
        }
        const vouchers = yield vocuherService.getVouchersByPartyByUserAndDateRange(grpname === null || grpname === void 0 ? void 0 : grpname.id, filterStartDate, filterEndDate, userId);
        if (!vouchers || vouchers.length === 0) {
            return response.status(404).json({ message: "No vouchers found for the specified Voucher and date range." });
        }
        return response.status(200).json({ data: vouchers });
    }
    catch (error) {
        console.error("Error fetching vouchers:", error);
        return response.status(500).json({ message: "An error occurred while retrieving vouchers.", error: error.message });
    }
}));
exports.voucherRouter.get("/refVoucher", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { VoucherGrpName, partyId } = request.query;
        if (!VoucherGrpName) {
            return response.status(400).json({ message: "VoucherGrpname is required." });
        }
        const grpname = yield voucherGrpService.getbyname(VoucherGrpName);
        const vouchers = yield vocuherService.getRefVoucherbyVoucherGrpid({ voucherGroupId: grpname === null || grpname === void 0 ? void 0 : grpname.id, partyId: partyId });
        if (!vouchers || vouchers.length === 0) {
            return response.status(404).json({ message: "No vouchers found for the specified Voucher and date range." });
        }
        return response.status(200).json({ data: vouchers });
    }
    catch (error) {
        console.error("Error fetching vouchers:", error);
        return response.status(500).json({ message: "An error occurred while retrieving vouchers.", error: error.message });
    }
}));
exports.voucherRouter.get("/vouchersByAuthUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { month, year } = req.query;
        // Get current month and year if not provided
        if (!month || !year) {
            const currentDate = new Date();
            month = month || (currentDate.getMonth() + 1).toString(); // JavaScript months are 0-indexed, so add 1
            year = year || currentDate.getFullYear().toString();
        }
        const vouchersGroupedByAuthUser = yield vocuherService.getVouchersGroupedByAuthUserWithVisits(parseInt(month), parseInt(year));
        return res.status(200).json({ data: vouchersGroupedByAuthUser });
    }
    catch (error) {
        console.error("Error fetching vouchers:", error);
        return res.status(500).json({ message: "An error occurred while retrieving vouchers.", error: error.message });
    }
}));
//GET 
exports.voucherRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield vocuherService.get(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Voucher could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.voucherRouter.get("/voucherNumber/:vouchername", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const vouchername = request.params.vouchername;
    try {
        const voucherGrpId = yield voucherGrpService.getbyname(vouchername);
        const newVoucherNumber = yield vocuherService.generateVoucherNumber(voucherGrpId === null || voucherGrpId === void 0 ? void 0 : voucherGrpId.id);
        if (newVoucherNumber) {
            return response.status(200).json({ data: newVoucherNumber });
        }
        return response.status(404).json({ message: "Voucher Number could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.voucherRouter.get("/group/:vouchername", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const vouchername = request.params.vouchername;
    try {
        const voucherGrpId = yield voucherGrpService.getbyname(vouchername);
        const vouchersbyGrp = yield vocuherService.getVoucherbyGrp(voucherGrpId === null || voucherGrpId === void 0 ? void 0 : voucherGrpId.id);
        if (vouchersbyGrp) {
            return response.status(200).json({ data: vouchersbyGrp });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.voucherRouter.get("/party/:partyId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = request.params.partyId;
    try {
        const voucherbyParty = yield vocuherService.getVoucherbyParty(partyId);
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.voucherRouter.post("/chartofAcc/condition/:chartofaccId", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const chartofaccId = request.params.chartofaccId;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const voucherbyParty = yield vocuherService.getVoucherbyChartofacc(chartofaccId, data.condition);
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.voucherRouter.post("/party/condition/:partyId", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = request.params.partyId;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const voucherbyParty = yield vocuherService.getVoucherbyPartytrue(partyId, data.condition);
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.voucherRouter.get("/party/false/:partyId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = request.params.partyId;
    try {
        const voucherbyParty = yield vocuherService.getVoucherbyPartyfalse(partyId);
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//POST
exports.voucherRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        const voucherGrpdetails = yield voucherGrpService.getbyname(data.voucherGroupname);
        const newVoucherNumber = yield vocuherService.generateVoucherNumber(voucherGrpdetails === null || voucherGrpdetails === void 0 ? void 0 : voucherGrpdetails.id);
        var totalCost = 0;
        var partyAcc;
        if (data === null || data === void 0 ? void 0 : data.partyId) {
            partyAcc = yield partyService.get(data === null || data === void 0 ? void 0 : data.partyId);
        }
        if (data.productList) {
            totalCost = (_a = data.productList) === null || _a === void 0 ? void 0 : _a.reduce((total, product) => {
                return total + (product.cost * product.quantity);
            }, 0);
        }
        const newVoucher = yield vocuherService.create(Object.assign(Object.assign({}, data), { authUser: data.authUser ? data.authUser : userId, voucherNumber: newVoucherNumber, voucherGroupId: voucherGrpdetails === null || voucherGrpdetails === void 0 ? void 0 : voucherGrpdetails.id, createdBy: userId }));
        console.log(newVoucher);
        if (data.refVoucherNumber) {
            yield vocuherService.updateVoucherNumber({ refVoucherNumber: data.refVoucherNumber, isRef: data.isRef, voucherId: newVoucher.voucherNumber });
        }
        if ((voucherGrpdetails === null || voucherGrpdetails === void 0 ? void 0 : voucherGrpdetails.inventoryMode) === "DOUBLE") {
            const centerPromises = data.productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                const voucherProduct = yield productVoucherService.create({
                    cost: product.cost,
                    quantity: product.quantity,
                    discount: product.discount,
                    MRP: product.MRP,
                    minPrice: product.minPrice,
                    sellingPrice: product.sellingPrice,
                    amount: product.amount,
                    voucherId: newVoucher.id,
                    productId: product.productId,
                    centerId: product.toCenterId
                });
                if (!voucherProduct) {
                    throw new Error("Failed to update product to list association");
                }
                try {
                    yield Promise.all(centerPromises);
                }
                catch (error) {
                    return response.status(500).json({ message: error.message });
                }
            }));
            if (data.fromCenterId) {
                const newVoucherCenter = yield voucherCenter.create({
                    centerId: data.fromCenterId,
                    voucherId: newVoucher.id,
                    centerStatus: "OUT"
                });
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Voucher Center to list association");
                }
                const inventoryPromise = data.productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                    const inventory = yield inventoryService.upsert({
                        productId: product.productId,
                        centerId: data.fromCenterId,
                        quantity: -(product.quantity)
                    });
                    if (!inventory) {
                        throw new Error("Failed to update product to list association");
                    }
                }));
                try {
                    yield Promise.all(inventoryPromise);
                }
                catch (error) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if (data.toCenterId) {
                const newVoucherCenter = yield voucherCenter.create({
                    centerId: data.toCenterId,
                    voucherId: newVoucher.id,
                    centerStatus: "IN"
                });
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Voucher Center to list association");
                }
                const inventoryPromise = data.productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                    const inventory = yield inventoryService.upsert({
                        productId: product.productId,
                        centerId: data.toCenterId,
                        quantity: product.quantity
                    });
                    if (!inventory) {
                        throw new Error("Failed to update product to list association");
                    }
                }));
                try {
                    yield Promise.all(inventoryPromise);
                }
                catch (error) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if (newVoucher) {
                return response.status(201).json({ message: "Voucher Created Successfully" });
            }
        }
        else {
            console.log(data);
            if (data.payment) {
                const onlineTransfer = yield paymentService.getbyname('Online Transfer');
                const cash = yield paymentService.getbyname('Cash');
                const Cheque = yield paymentService.getbyname('Cheque');
                const Credit = yield paymentService.getbyname('Credit');
                // Prepare payment vouchers
                const paymentVouchers = [
                    { voucherId: newVoucher.id, paymentId: onlineTransfer === null || onlineTransfer === void 0 ? void 0 : onlineTransfer.id, paymentType: onlineTransfer === null || onlineTransfer === void 0 ? void 0 : onlineTransfer.type, amount: data.payment.onlineTransfer, refNumber: data.payment.refNumber },
                    { voucherId: newVoucher.id, paymentId: cash === null || cash === void 0 ? void 0 : cash.id, paymentType: cash === null || cash === void 0 ? void 0 : cash.type, amount: data.payment.cash },
                    { voucherId: newVoucher.id, paymentId: Cheque === null || Cheque === void 0 ? void 0 : Cheque.id, paymentType: Cheque === null || Cheque === void 0 ? void 0 : Cheque.type, amount: data.payment.cheque },
                    { voucherId: newVoucher.id, paymentId: Credit === null || Credit === void 0 ? void 0 : Credit.id, paymentType: Credit === null || Credit === void 0 ? void 0 : Credit.type, amount: data.payment.credit }
                ].filter(record => record.paymentId && record.amount > 0);
                let chequePaymentVoucher = null;
                // Loop to create each payment voucher and capture the cheque payment voucher
                for (const voucher of paymentVouchers) {
                    const createdVoucher = yield paymentVoucherService.create(voucher);
                    // Check if this is the cheque voucher
                    if (voucher.paymentId === (Cheque === null || Cheque === void 0 ? void 0 : Cheque.id)) {
                        chequePaymentVoucher = createdVoucher;
                    }
                }
                // Now handle the cheque creation if applicable
                if (data.payment.cheque > 0 && chequePaymentVoucher) {
                    console.log(data.payment.chequeBookId);
                    const cheque = yield chequeService.create({
                        chequeNumber: data.payment.chequenumber.toString(),
                        chequeBankName: data.payment.chequeBankName,
                        issueDate: data.date,
                        releaseDate: data.payment.releaseDate,
                        amount: data.payment.cheque,
                        chequeBookId: (_b = data.payment) === null || _b === void 0 ? void 0 : _b.chequeBookId,
                        voucherId: newVoucher.id,
                        paymentVoucherId: chequePaymentVoucher.id,
                        creditDebit: data.payment.creditDebit,
                        createdBy: userId
                    });
                    if (((_c = data.payment) === null || _c === void 0 ? void 0 : _c.chequeBookId) !== undefined) {
                        yield chequebookService.updatechequeRemaning((_d = data.payment) === null || _d === void 0 ? void 0 : _d.chequeBookId);
                    }
                }
            }
            if (data.voucherGroupname !== "DIRECT PAYMENT") {
                if (data.selectedVoucherIds && data.amount > 0) {
                    let remainingAmount = data.amount; // Amount to be paid
                    const selectedVouchers = yield vocuherService.findManyByIds(data.selectedVoucherIds.map((v) => v.voucherId));
                    for (const voucher of selectedVouchers) {
                        // Safely handle the voucher.amount and voucher.paidValue as Decimal or number
                        const voucherAmount = voucher.amount instanceof client_1.Prisma.Decimal ? voucher.amount.toNumber() : (voucher.amount || 0);
                        const paidValue = voucher.paidValue instanceof client_1.Prisma.Decimal ? voucher.paidValue.toNumber() : (voucher.paidValue || 0);
                        const remainingVoucherAmount = voucherAmount - paidValue; // Remaining unpaid amount for this voucher
                        if (remainingAmount <= 0) {
                            break; // No remaining amount to distribute
                        }
                        // Calculate how much can be paid on this voucher
                        const payableAmount = Math.min(remainingVoucherAmount, remainingAmount);
                        if (payableAmount > 0) {
                            // Update the paidValue of the voucher
                            const updatedPaidValue = paidValue + payableAmount;
                            yield vocuherService.updatepaidValue({
                                id: voucher.id,
                                paidValue: updatedPaidValue
                            });
                            var selectedVoucher = yield vocuherService.getbyid(voucher.id);
                            yield referVoucherService.create({
                                refVoucherNumber: selectedVoucher === null || selectedVoucher === void 0 ? void 0 : selectedVoucher.voucherNumber,
                                invoiceDate: selectedVoucher === null || selectedVoucher === void 0 ? void 0 : selectedVoucher.date,
                                invoiceAmount: selectedVoucher === null || selectedVoucher === void 0 ? void 0 : selectedVoucher.amount,
                                settledAmount: updatedPaidValue,
                                paidAmount: updatedPaidValue - paidValue,
                                voucherId: newVoucher.id,
                                createdBy: userId
                            });
                            // Decrease the remaining amount by the amount just paid
                            remainingAmount -= payableAmount;
                        }
                    }
                    if (remainingAmount > 0) {
                        // If there's still some remaining amount that couldn't be distributed
                        return response.status(400).json({ message: "Payment exceeds total due for selected vouchers." });
                    }
                }
            }
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
                        voucherId: newVoucher.id, // Link to the created voucher
                        chartofAccountId: chartofAccId, // Account ID from the journal entry
                        debitAmount: entry.debit || 0, // Debit amount if present
                        creditAmount: entry.credit || 0, // Credit amount if present
                        ref: entry.ref, // Reference number from the voucher
                        createdBy: userId, // Assuming `req.user.id` contains the user ID
                    };
                    yield journalLineService.create(journalLineData);
                }
            }
            if (data.iou && data.iou.length > 0) {
                const iou = data.iou;
                for (let entry of iou) {
                    const ioudata = {
                        voucherId: newVoucher.id,
                        userid: entry.userid,
                        amount: entry.amount,
                        createdBy: userId,
                    };
                    yield pettyCashIOUService.create(ioudata);
                }
            }
            if (data.productList) {
                const centerPromises = (_e = data.productList) === null || _e === void 0 ? void 0 : _e.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                    const voucherProduct = yield productVoucherService.create({
                        cost: product.cost,
                        quantity: product.quantity,
                        remainingQty: product.quantity,
                        discount: product.discount,
                        MRP: product.MRP,
                        minPrice: product.minPrice,
                        sellingPrice: product.sellingPrice,
                        amount: product.amount,
                        voucherId: newVoucher.id,
                        productId: product.productId,
                        centerId: data.centerId
                    });
                    // if (data.voucherGroupname === 'GRN') {
                    //     const updateProductPrices = await productService.updatePricesbulk({
                    //         cost: product.cost,
                    //         minPrice: product.minPrice,
                    //         MRP: product.MRP,
                    //         sellingPrice: product.sellingPrice
                    //     }, product.productId)
                    //     if (!updateProductPrices) {
                    //         throw new Error("Failed to update product prices association");
                    //     }
                    // }
                    // if (!voucherProduct) {
                    //     throw new Error("Failed to update product to list association");
                    // }
                }));
                try {
                    yield Promise.all(centerPromises);
                }
                catch (error) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if ((voucherGrpdetails === null || voucherGrpdetails === void 0 ? void 0 : voucherGrpdetails.inventoryMode) === "PLUS") {
                const newVoucherCenter = yield voucherCenter.create({
                    centerId: data.centerId,
                    voucherId: newVoucher.id,
                    centerStatus: "IN"
                });
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Vo    ucher Center to list association");
                }
                if ((voucherGrpdetails === null || voucherGrpdetails === void 0 ? void 0 : voucherGrpdetails.isAccount) === true) {
                    const inventoryPromise = data.productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                        if (data.voucherGroupname === 'GRN') {
                            const inventory = yield inventoryService.upsert({
                                productId: product.productId,
                                centerId: data.centerId,
                                quantity: product.quantity,
                                cost: product.cost,
                                minPrice: product.minPrice,
                                MRP: product.MRP,
                                sellingPrice: product.sellingPrice,
                            });
                            if (!inventory) {
                                throw new Error("Failed to update product to list association");
                            }
                        }
                        else {
                            const inventory = yield inventoryService.upsert({
                                productId: product.productId,
                                centerId: data.centerId,
                                quantity: product.quantity,
                            });
                            if (!inventory) {
                                throw new Error("Failed to update product to list association");
                            }
                        }
                    }));
                    try {
                        yield Promise.all(inventoryPromise);
                    }
                    catch (error) {
                        return response.status(500).json({ message: error.message });
                    }
                }
            }
            if ((voucherGrpdetails === null || voucherGrpdetails === void 0 ? void 0 : voucherGrpdetails.inventoryMode) === "MINUS") {
                const newVoucherCenter = yield voucherCenter.create({
                    centerId: data.centerId,
                    voucherId: newVoucher.id,
                    centerStatus: "OUT"
                });
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Voucher Center to list association");
                }
                const inventoryPromise = data.productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                    const inventory = yield inventoryService.upsert({
                        productId: product.productId,
                        centerId: data.centerId,
                        quantity: -(product.quantity)
                    });
                    if (!inventory) {
                        throw new Error("Failed to update product to list association");
                    }
                }));
                try {
                    yield Promise.all(inventoryPromise);
                }
                catch (error) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if (newVoucher) {
                return response.status(201).json({ message: "Voucher Created Successfully", data: newVoucher });
            }
        }
    }
    catch (error) {
        console.error("Error creating voucher:", error); // Add more detailed logging
        return response.status(500).json({ message: error.message });
    }
}));
//PUT
exports.voucherRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateVoucher = yield vocuherService.update(data, id);
        if (updateVoucher) {
            return response.status(201).json({ message: "Voucher Updated Successfully" });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.voucherRouter.put("/conform/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateVoucher = yield vocuherService.updateConform(data, id);
        if (updateVoucher) {
            return response.status(201).json({ message: "Voucher Conform Successfully" });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
