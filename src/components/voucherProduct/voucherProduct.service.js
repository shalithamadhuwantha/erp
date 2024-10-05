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
exports.update = exports.create = exports.getbyProductIdCenterId = exports.getbyVoucherId = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucherProduct.findMany();
});
exports.list = list;
const getbyVoucherId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucherProduct.findMany({
        where: {
            voucherId: id,
        },
        include: {
            product: true
        }
    });
});
exports.getbyVoucherId = getbyVoucherId;
const getbyProductIdCenterId = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucherProduct.findMany({
        where: {
            centerId: data.centerId,
            productId: data.productId,
            remainingQty: {
                gt: 0,
            }
        },
        include: {
            product: true
        },
    });
});
exports.getbyProductIdCenterId = getbyProductIdCenterId;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucherProduct.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucherProduct.update({
        where: id,
        data: data
    });
});
exports.update = update;
