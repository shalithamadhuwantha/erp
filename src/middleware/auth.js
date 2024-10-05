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
exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const db_server_1 = require("../utils/db.server");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return next(new Error('Unauthorized'));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return next(new Error("Token not Found"));
    }
    try {
        const decode = (0, jsonwebtoken_1.verify)(token, 'Skey');
        const user = yield db_server_1.db.user.findUnique({
            where: {
                id: decode.userId,
            }
        });
        req.user = user !== null && user !== void 0 ? user : undefined;
        next();
    }
    catch (err) {
        req.user = undefined;
        next();
    }
});
exports.authenticate = authenticate;
