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
exports.upserts = exports.update = exports.create = exports.get = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productcommissionRate.findMany({});
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productcommissionRate.findMany({
        where: {
            commissionRateId: id
        },
    });
});
exports.get = get;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productcommissionRate.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productcommissionRate.update({
        where: {
            productId_commissionRateId: {
                productId: id,
                commissionRateId: data.discountLevelId,
            }
        },
        data: data
    });
});
exports.update = update;
const upserts = (data, productId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productcommissionRate.upsert({
        where: { productId_commissionRateId: { productId: productId, commissionRateId: data.commissionRateId } },
        update: {
            commissionRate: data.commissionRate
        },
        create: {
            productId: productId,
            commissionRateId: data.commissionRateId,
            commissionRate: data.commissionRate,
            createdBy: data.createdBy
        }
    });
});
exports.upserts = upserts;
