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
exports.inventoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const inventoryService = __importStar(require("./inventory.service"));
exports.inventoryRouter = express_1.default.Router();
//GET LIST
exports.inventoryRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const inventory = yield inventoryService.getbyCenter(id);
        if (inventory) {
            return response.status(200).json({ data: inventory });
        }
        return response.status(404).json({ message: "Inventory could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.inventoryRouter.get("/filter", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, centerId, date } = request.query;
    try {
        const inventoryData = yield inventoryService.filterInventory(productId, centerId, date);
        if (inventoryData) {
            return response.status(200).json({ data: inventoryData });
        }
        return response.status(404).json({ message: "No inventory found for the provided filters." });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
