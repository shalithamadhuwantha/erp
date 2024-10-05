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
exports.getAllCompanyDetails = exports.update = exports.create = exports.login = exports.getbyRole = exports.get = exports.getlist = void 0;
const db_server_1 = require("../../utils/db.server");
const bcrypt_1 = require("bcrypt");
const getlist = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findMany({});
});
exports.getlist = getlist;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findUnique({
        where: {
            id,
        }
    });
});
exports.get = get;
const getbyRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findMany({
        where: {
            role: role,
        }
    });
});
exports.getbyRole = getbyRole;
const login = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.findUnique({
        where: {
            username,
        }
    });
});
exports.login = login;
const create = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, bcrypt_1.hash)(userData.password, 10);
    return db_server_1.db.user.create({
        data: Object.assign(Object.assign({}, userData), { password: hashedPassword })
    });
});
exports.create = create;
const update = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.user.update({
        where: id,
        data: {
            name: userData.name,
            nic: userData.nic,
            phoneNumber: userData.phoneNumber,
            dateofbirth: userData.dateofbirth,
            target: userData.target,
            role: userData.role,
            address: userData.address,
        }
    });
});
exports.update = update;
const getAllCompanyDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.companyDetails.findFirst({
        where: {
            companyName: 'HITECH (PVT) LTD'
        }
    });
});
exports.getAllCompanyDetails = getAllCompanyDetails;
