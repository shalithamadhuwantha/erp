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
exports.chartofAccRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const chartofaccService = __importStar(require("./chartofaccount.service"));
const accountGrpservice = __importStar(require("../accountGroup/accountGroup.service"));
exports.chartofAccRouter = express_1.default.Router();
//GET LIST
exports.chartofAccRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield chartofaccService.list();
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Chart of Account could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.chartofAccRouter.get("/chartofaccSum/:name", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const name = request.params.name;
    try {
        const chartofacc = yield chartofaccService.getbyname(name);
        const data = yield chartofaccService.sumbalance(chartofacc === null || chartofacc === void 0 ? void 0 : chartofacc.id);
        console.log(data);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Chart of Account could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//GET 
exports.chartofAccRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield chartofaccService.get(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Chart of Account could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//GET 
exports.chartofAccRouter.get("/getbyGroup/:name", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const name = request.params.name;
    try {
        const accGrp = yield accountGrpservice.getbyname(name);
        if (!accGrp) {
            return response.status(404).json({ message: "Account Group not found" });
        }
        const data = yield chartofaccService.getbygroup(accGrp === null || accGrp === void 0 ? void 0 : accGrp.id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Chart of Account could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//POST
exports.chartofAccRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        data = Object.assign(Object.assign({}, data), { createdBy: userId });
        const newChartOfAcc = yield chartofaccService.create(data);
        if (newChartOfAcc) {
            return response.status(201).json({ message: "Chart of Account Created Successfully", data: newChartOfAcc });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.chartofAccRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        console.log(data);
        const updateChartofAcc = yield chartofaccService.update(data, id);
        if (updateChartofAcc) {
            return response.status(201).json({ message: "Chart of Account Updated Successfully", data: updateChartofAcc });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
