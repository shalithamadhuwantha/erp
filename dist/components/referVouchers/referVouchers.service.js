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
exports.create = exports.getbyvoucher = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.referVouchers.findMany({});
});
exports.list = list;
const getbyvoucher = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.referVouchers.findMany({
        where: {
            voucherId: id,
        }
    });
});
exports.getbyvoucher = getbyvoucher;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.referVouchers.create({
        data: data
    });
});
exports.create = create;
// export const updateVoucherGrp = async (Data: any, id: any) => {
//     return db.referVouchers.update();
// }
