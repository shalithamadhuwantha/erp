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
exports.centerRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const centerService = __importStar(require("./center.service"));
const userService = __importStar(require("../user/user.service"));
const userCenterService = __importStar(require("../userCenter/userCenter.service"));
const productService = __importStar(require("../product/product.service"));
const inventoryService = __importStar(require("../inventory/inventory.service"));
exports.centerRouter = express_1.default.Router();
//GET
exports.centerRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield centerService.getlist();
        return response.status(200).json({ data: data });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//GET
exports.centerRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield centerService.get(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Center could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//GET
exports.centerRouter.get("/centerMode/:mode", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const mode = request.params.mode;
    try {
        const data = yield centerService.getCenterMode(mode);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Center could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//POST
exports.centerRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const createdBy = request.user.id;
        var data = Object.assign(Object.assign({}, data), { createdBy });
        const newCenter = yield centerService.create(data);
        if (data.mode === "PHYSICAL") {
            const adminUsers = yield userService.getbyRole("ADMIN");
            const centerPromises = adminUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                const userCenter = yield userCenterService.create({
                    userId: user.id,
                    centerId: newCenter.id
                });
                if (!userCenter) {
                    throw new Error("Failed to update center association");
                }
            }));
            try {
                yield Promise.all(centerPromises);
            }
            catch (error) {
                return response.status(500).json({ message: error.message });
            }
        }
        if (newCenter) {
            const productList = yield productService.list();
            const centerPromises = productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                const inventory = yield inventoryService.upsert({
                    productId: product.id,
                    centerId: newCenter.id,
                    quantity: 0,
                });
                if (!inventory) {
                    throw new Error("Failed to update inventory association");
                }
            }));
            try {
                yield Promise.all(centerPromises);
            }
            catch (error) {
                return response.status(500).json({ message: error.message });
            }
            return response.status(201).json({ message: "Center Created Successfully", data: newCenter });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//UPDATE
exports.centerRouter.put("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        const updateCenter = yield centerService.update(data, id);
        if (updateCenter) {
            return response.status(201).json({ message: "Center Updated Successfully", data: updateCenter });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
