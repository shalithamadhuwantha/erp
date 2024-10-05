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
exports.deleteOEMNumbers = exports.update = exports.create = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.oEMNumber.findMany();
});
exports.list = list;
// export const get = async (id: any) => {
//     return db.oEMNumber.findUnique({
//         where: {
//             id,
//         },
//     });
// }
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.oEMNumber.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.oEMNumber.update({
        where: id,
        data: data
    });
});
exports.update = update;
const deleteOEMNumbers = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.oEMNumber.deleteMany({
        where: {
            productId: id
        }
    });
});
exports.deleteOEMNumbers = deleteOEMNumbers;
