"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherProductListRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const voucherProductService = __importStar(require("./voucherProduct.service"));
exports.VoucherProductListRouter = express_1.default.Router();
//GET LIST
exports.VoucherProductListRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield voucherProductService.list();
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Voucher could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.VoucherProductListRouter.get("/byvoucher/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const voucherProductlist = yield voucherProductService.getbyVoucherId(id);
        if (voucherProductlist) {
            return response.status(200).json({ data: voucherProductlist });
        }
        return response.status(404).json({ message: "Voucher Products could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.VoucherProductListRouter.get("/byProductCenter", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, centerId } = request.query; // Extract query parameters
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const data = {
            productId: productId,
            centerId: centerId
        };
        console.log(data);
        const voucherProductlist = yield voucherProductService.getbyProductIdCenterId(data);
        if (voucherProductlist && voucherProductlist.length > 0) {
            return response.status(200).json({ data: voucherProductlist });
        }
        return response.status(404).json({ message: "Voucher Products could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
