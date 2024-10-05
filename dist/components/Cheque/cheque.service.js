"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnusedChequesByAccountId = exports.getNextChequeNumber = exports.updateused = exports.update = exports.create = exports.get = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.cheque.findMany();
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.cheque.findUnique({
        where: {
            id,
        }
    });
});
exports.get = get;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.cheque.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.cheque.update({
        where: id,
        data: data
    });
});
exports.update = update;
const updateused = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.cheque.update({
        where: { id: id }, // Pass id as a string, not an object
        data: { used: data.used } // Use the 'used' field from data
    });
});
exports.updateused = updateused;
const getNextChequeNumber = (chartOfAccountId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find a ChequeBook with remaining cheques and matching chartOfAccountId
    let chequeBook = yield db_server_1.db.chequeBook.findFirst({
        where: {
            remainingCheques: {
                gt: 0 // Ensure there are remaining cheques
            },
            chartofAccountId: chartOfAccountId // Filter by chart of account ID
        },
        include: {
            Cheque: true // Include associated Cheque records
        }
    });
    // If no cheque book found with remaining cheques, return an error
    if (!chequeBook) {
        throw new Error("No cheque books available with remaining cheques for the specified account.");
    }
    // Step 2: Get all used cheque numbers
    const usedChequeNumbers = chequeBook.Cheque.map(cheque => cheque.chequeNumber);
    // Step 3: Determine the next cheque number
    const startNumber = parseInt(chequeBook.startNumber, 10);
    let nextChequeNumber = startNumber;
    // Check for used cheques and find the next available number
    while (usedChequeNumbers.includes(nextChequeNumber.toString())) {
        nextChequeNumber++;
    }
    // Optionally, update the remaining cheques count if necessary
    // await db.chequeBook.update({
    //     where: { id: chequeBook.id },
    //     data: { remainingCheques: chequeBook.remainingCheques - 1 }
    // });
    return { nextNumber: nextChequeNumber, chequeBookId: chequeBook.id };
});
exports.getNextChequeNumber = getNextChequeNumber;
const getUnusedChequesByAccountId = (chartofAccountId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_server_1.db.cheque.findMany({
        where: {
            OR: [
                {
                    chequeBook: {
                        chartofAccountId: chartofAccountId,
                    },
                },
                {
                    chequeBookId: null, // Include cheques where chequeBookId is null
                },
            ],
            used: false,
        },
        orderBy: {
            creditDebit: 'asc', // Sort by creditDebit, ascending ('Credit' before 'Debit')
        },
    });
});
exports.getUnusedChequesByAccountId = getUnusedChequesByAccountId;
