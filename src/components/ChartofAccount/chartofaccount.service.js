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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumbalance = exports.update = exports.updates = exports.create = exports.getbygroup = exports.getbyname = exports.get = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const decimal_js_1 = __importDefault(require("decimal.js"));
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chartofAccount.findMany({
        include: {
            accGroup: true,
            AccountSubCategory: true
        }
    });
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chartofAccount.findUnique({
        where: {
            id,
        },
    });
});
exports.get = get;
const getbyname = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chartofAccount.findFirst({
        where: {
            accountName: name
        }
    });
});
exports.getbyname = getbyname;
const getbygroup = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chartofAccount.findMany({
        where: {
            accountGroupId: id,
            NOT: {
                accountName: { in: ['EXPENCESS ACCOUNT', 'USER EXPENCESS ACCOUNT'] }
            }
        }
    });
});
exports.getbygroup = getbygroup;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chartofAccount.create({
        data: data,
        include: {
            accGroup: true,
            AccountSubCategory: true
        }
    });
});
exports.create = create;
const updates = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chartofAccount.update({
        where: { id },
        data: data,
        include: {
            accGroup: true,
            AccountSubCategory: true
        }
    });
});
exports.updates = updates;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    return db_server_1.db.chartofAccount.update({
        where: id,
        data: data,
        include: {
            accGroup: true,
            AccountSubCategory: true
        }
    });
});
exports.update = update;
const sumbalance = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the account's opening balance
    const account = yield db_server_1.db.chartofAccount.findUnique({
        where: { id: id },
        select: { Opening_Balance: true }
    });
    // Get the sum of debits and credits
    const { _sum } = yield db_server_1.db.journalLine.aggregate({
        where: { chartofAccountId: id },
        _sum: {
            debitAmount: true,
            creditAmount: true
        }
    });
    // Convert Opening_Balance to Decimal
    const openingBalance = new decimal_js_1.default((account === null || account === void 0 ? void 0 : account.Opening_Balance) || 0);
    const totalDebits = new decimal_js_1.default(_sum.debitAmount || 0);
    const totalCredits = new decimal_js_1.default(_sum.creditAmount || 0);
    // Calculate balance using Decimal arithmetic
    const balance = openingBalance.plus(totalDebits).minus(totalCredits);
    return balance.toNumber(); // Convert back to a regular number if needed
});
exports.sumbalance = sumbalance;
