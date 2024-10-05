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
exports.partyRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const partyService = __importStar(require("./party.service"));
const partyGroupService = __importStar(require("../partyGroup/partyGroup.service"));
const chartOfAccService = __importStar(require("../ChartofAccount/chartofaccount.service"));
const accSubCategory = __importStar(require("../accountSubCategory/accountSubCategory.service"));
const accGrp = __importStar(require("../accountGroup/accountGroup.service"));
const partyCategoryService = __importStar(require("../partyCategory/partyCategory.service"));
const visitingCustomerService = __importStar(require("../visitedCustomer/visitedCustomer.service"));
exports.partyRouter = express_1.default.Router();
//GET LIST
exports.partyRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const party = yield partyService.list();
        if (party) {
            return response.status(200).json({ data: party });
        }
        return response.status(404).json({ message: "Party could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//GET 
exports.partyRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const party = yield partyService.get(id);
        if (party) {
            return response.status(200).json({ data: party });
        }
        return response.status(404).json({ message: "Party could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
exports.partyRouter.get("/partygroup/:name", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const name = request.params.name;
    const condition = request.query.condition === 'true';
    console.log(condition);
    try {
        const partyGroup = yield partyGroupService.getbyname(name);
        const party = yield partyService.getbyGroup(partyGroup === null || partyGroup === void 0 ? void 0 : partyGroup.id, condition);
        if (party) {
            return response.status(200).json({ data: party });
        }
        return response.status(404).json({ message: "Party could not be found" });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//POST
exports.partyRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        if (!data.partyGroup) {
            return response.status(401).json({ message: "Party Group Undefined" });
        }
        var subAcc;
        var accGroup;
        var isverified = false;
        var partycategory;
        var partyCateId;
        if (data.partyGroup === "SUPPLIER") {
            isverified = true;
            subAcc = yield accSubCategory.getbyname("CURRENT LIABILITIES");
            accGroup = yield accGrp.getbyname("Payable");
            partycategory = yield partyCategoryService.getbyname('COMMON SUPPLIER');
            partyCateId = partycategory === null || partycategory === void 0 ? void 0 : partycategory.id;
        }
        else {
            subAcc = yield accSubCategory.getbyname("CURRENT ASSETS");
            accGroup = yield accGrp.getbyname("Receivable");
            partyCateId = data.partyCategoryId;
            // if (data.visitingCustomer) {
            //     partycategory = await partyCategoryService.getbyname('VISITING CUSTOMER')
            //     partyCateId = partycategory?.id;
            // } else {
            // }
        }
        const partyGroup = yield partyGroupService.getbyname(data.partyGroup);
        if (!partyGroup) {
            return response.status(401).json({ message: "Party Group Invalid" });
        }
        const chartofacc = yield chartOfAccService.create({ accountName: data.name, accountSubCategoryId: subAcc === null || subAcc === void 0 ? void 0 : subAcc.id, accountGroupId: accGroup === null || accGroup === void 0 ? void 0 : accGroup.id, Opening_Balance: data.Opening_Balance, createdBy: userId });
        const newParty = yield partyService.create({ name: data === null || data === void 0 ? void 0 : data.name, nic: data === null || data === void 0 ? void 0 : data.nic, phoneNumber: data === null || data === void 0 ? void 0 : data.phoneNumber, creditPeriod: data === null || data === void 0 ? void 0 : data.creditPeriod, creditValue: data === null || data === void 0 ? void 0 : data.creditValue, address1: data === null || data === void 0 ? void 0 : data.address1, city: data === null || data === void 0 ? void 0 : data.city, address2: data === null || data === void 0 ? void 0 : data.address2, email: data === null || data === void 0 ? void 0 : data.email, chartofAccountId: chartofacc.id, isVerified: isverified, partyCategoryId: partyCateId, partyTypeId: data === null || data === void 0 ? void 0 : data.partyTypeId, partyGroupId: partyGroup === null || partyGroup === void 0 ? void 0 : partyGroup.id, createdBy: userId });
        if (data.visitingCustomer) {
            var visitingdata = {
                partyId: newParty.id,
                note: data.visitingCustomer.note,
                status: data.visitingCustomer.status,
                createdBy: userId
            };
            yield visitingCustomerService.create(visitingdata);
        }
        if (newParty) {
            return response.status(201).json({ message: data.partyGroup + " Created Successfully", data: newParty });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.partyRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        var partyCateId;
        var partycategory;
        if (data.partyGroup === "SUPPLIER") {
            partycategory = yield partyCategoryService.getbyname('COMMON SUPPLIER');
            partyCateId = partycategory === null || partycategory === void 0 ? void 0 : partycategory.id;
        }
        else {
            partyCateId = data.partyCategoryId;
        }
        const updateparty = yield partyService.update({ name: data.name, nic: data.nic, phoneNumber: data.phoneNumber, creditPeriod: data.creditPeriod, creditValue: data.creditValue, address1: data.address1, city: data === null || data === void 0 ? void 0 : data.city, address2: data.address2, isVerified: data === null || data === void 0 ? void 0 : data.isVerified, email: data.email, partyCategoryId: partyCateId }, id);
        const partyGroup = yield partyGroupService.getbyid(updateparty.partyGroupId);
        const updatechartofAcc = yield chartOfAccService.updates({ accountName: data.name }, updateparty.chartofAccountId);
        if (updateparty && updatechartofAcc) {
            return response.status(201).json({ message: (partyGroup === null || partyGroup === void 0 ? void 0 : partyGroup.partyGroupName) + " Updated Successfully", data: updateparty });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
