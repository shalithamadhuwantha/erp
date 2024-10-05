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
exports.partyCategoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const partyCategoryService = __importStar(require("./partyCategory.service"));
const partyGroupService = __importStar(require("../partyGroup/partyGroup.service"));
exports.partyCategoryRouter = express_1.default.Router();
//GET LIST
exports.partyCategoryRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partyCategory = yield partyCategoryService.getlist();
        if (partyCategory) {
            return response.status(200).json({ data: partyCategory });
        }
        return response.status(404).json({ message: "Party Category could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//POST
exports.partyCategoryRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const cutomer = yield partyGroupService.getbyname('CUSTOMER');
        const userId = request.user.id;
        data = Object.assign(Object.assign({}, data), { partyGroupId: cutomer === null || cutomer === void 0 ? void 0 : cutomer.id, createdBy: userId });
        const newbrand = yield partyCategoryService.create(data);
        if (newbrand) {
            return response.status(201).json({ message: "Party Category Successfully", data: newbrand });
        }
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.partyCategoryRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const category = yield partyCategoryService.getbyid(id);
        if ((category === null || category === void 0 ? void 0 : category.isEditable) === false) {
            return response.status(403).json({ message: "Category not Editable" });
        }
        const updatepartyCategory = yield partyCategoryService.update(data, id);
        if (updatepartyCategory) {
            return response.status(201).json({ message: "Party Category Updated Successfully", data: updatepartyCategory });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
