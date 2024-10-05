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
exports.updatechequeRemaning = exports.update = exports.create = exports.get = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chequeBook.findMany();
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chequeBook.findUnique({
        where: {
            id,
        }
    });
});
exports.get = get;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chequeBook.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.chequeBook.update({
        where: id,
        data: data
    });
});
exports.update = update;
const updatechequeRemaning = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const checkbook = yield db_server_1.db.chequeBook.findFirst({
        where: {
            id: id,
            remainingCheques: {
                gt: 0 // Ensure there are remaining cheques
            },
        }
    });
    if (!checkbook || checkbook.remainingCheques === undefined) {
        throw new Error("Cheque book not found or remaining cheques value is undefined.");
    }
    yield db_server_1.db.chequeBook.update({
        where: { id: checkbook.id },
        data: { remainingCheques: checkbook.remainingCheques - 1 }
    });
});
exports.updatechequeRemaning = updatechequeRemaning;
