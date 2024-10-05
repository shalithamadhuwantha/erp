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
exports.update = exports.create = exports.getbyRef = exports.get = exports.getByAccountAndDateRange = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.journalLine.findMany();
});
exports.list = list;
const getByAccountAndDateRange = (chartofAccountId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.journalLine.findMany({
        where: Object.assign(Object.assign({}, (chartofAccountId && { chartofAccountId })), { createdAt: {
                gte: startDate, // greater than or equal to the start date
                lte: endDate, // less than or equal to the end date
            } }),
        include: {
            account: {
                select: {
                    accountName: true, // This will retrieve the account name
                },
            },
        },
    });
});
exports.getByAccountAndDateRange = getByAccountAndDateRange;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.journalLine.findUnique({
        where: {
            id,
        },
    });
});
exports.get = get;
const getbyRef = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.journalLine.findMany({
        where: {
            ref: name,
        },
        include: {
            account: {
                select: {
                    accountName: true, // This will retrieve the account name
                },
            },
        },
    });
});
exports.getbyRef = getbyRef;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.journalLine.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.journalLine.update({
        where: id,
        data: data
    });
});
exports.update = update;
