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
    return db_server_1.db.productDiscountLevel.findMany({});
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productDiscountLevel.findMany({
        where: {
            discountLevelId: id
        },
    });
});
exports.get = get;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productDiscountLevel.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productDiscountLevel.update({
        where: {
            productId_discountLevelId: {
                productId: id,
                discountLevelId: data.discountLevelId,
            }
        },
        data: data
    });
});
exports.update = update;
const upserts = (data, productId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.productDiscountLevel.upsert({
        where: { productId_discountLevelId: { productId: productId, discountLevelId: data.discountLevelId } },
        update: {
            discountRate: data.discountRate
        },
        create: {
            productId: productId,
            discountLevelId: data.discountLevelId,
            discountRate: data.discountRate,
            createdBy: data.createdBy
        }
    });
});
exports.upserts = upserts;
