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
exports.updateStatus = exports.updatePricesbulk = exports.updatePrices = exports.update = exports.create = exports.get = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.findMany({
        include: {
            OEMNumber: true,
            productDiscountLevel: true,
            productcommissionRate: true
        },
    });
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.findUnique({
        where: {
            id,
        },
    });
});
exports.get = get;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.update({
        where: { id },
        data: data
    });
});
exports.update = update;
const updatePrices = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.update({
        where: id,
        data: data
    });
});
exports.updatePrices = updatePrices;
const updatePricesbulk = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.update({
        where: { id },
        data: data
    });
});
exports.updatePricesbulk = updatePricesbulk;
const updateStatus = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.product.update({
        where: id,
        data: data
    });
});
exports.updateStatus = updateStatus;
