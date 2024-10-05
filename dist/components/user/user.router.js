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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const UserService = __importStar(require("./user.service"));
const centerService = __importStar(require("../center/center.service"));
const userCenterService = __importStar(require("../userCenter/userCenter.service"));
const genarateJwt = (user) => {
    return (0, jsonwebtoken_1.sign)({ userId: user.id, name: user.name, role: user.role }, "Skey");
};
exports.userRouter = express_1.default.Router();
//GET LIST
exports.userRouter.get("/", (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService.getlist();
        return res.status(200).json({ data: users });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
//GET 
exports.userRouter.get("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        if (!request.user) {
            return response.status(401);
        }
        const user = yield UserService.get(id);
        if (user) {
            return response.status(200).json(user);
        }
        return response.status(404).json("User could not be found");
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//POST
exports.userRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = request.body;
    if (!request.user) {
        return response.status(401).json({ message: "User not authorized" });
    }
    const createdBy = request.user.id;
    try {
        // Create user
        const newUser = yield UserService.create({
            name: data.name,
            nic: data.nic,
            phoneNumber: data.phoneNumber,
            address: data.address,
            dateofbirth: data.dateofbirth,
            target: data.target,
            username: data.username,
            password: data.password,
            role: data.role,
        });
        if (!newUser) {
            return response.status(500).json({ message: "Failed to create user" });
        }
        // Handle role-based logic
        yield handleRoleBasedLogic(data, newUser.id, createdBy);
        return response.status(201).json({ message: "User created successfully", data: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return response.status(500).json({ message: error.message });
    }
}));
// Helper function to handle role-based center associations
function handleRoleBasedLogic(data, userId, createdBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const { role, centers } = data;
        if (role === "MANAGER" && centers) {
            yield associateCentersWithManager(centers, userId);
        }
        else if (role === "ADMIN") {
            yield associateCentersWithAdmin(userId);
        }
        else if (role === "SALESMEN") {
            yield createAndAssociateCenterForSalesmen(data.name, userId, createdBy);
        }
    });
}
// Function to associate centers with a manager
function associateCentersWithManager(centers, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const centerPromises = centers.map((center) => __awaiter(this, void 0, void 0, function* () {
            const userCenter = yield userCenterService.create({
                userId,
                centerId: center.centerId
            });
            if (!userCenter) {
                throw new Error("Failed to update center association");
            }
        }));
        yield Promise.all(centerPromises);
    });
}
// Function to associate centers with an admin
function associateCentersWithAdmin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const centerList = yield centerService.getCenterMode("PHYSICAL");
        const centerPromises = centerList.map((center) => __awaiter(this, void 0, void 0, function* () {
            const userCenter = yield userCenterService.create({
                userId,
                centerId: center.id
            });
            if (!userCenter) {
                throw new Error("Failed to update center association");
            }
        }));
        yield Promise.all(centerPromises);
    });
}
// Function to create and associate a center for salesmen
function createAndAssociateCenterForSalesmen(centerName, userId, createdBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCenter = yield centerService.create({ centerName, createdBy });
        if (!newCenter) {
            throw new Error("Failed to create center");
        }
        const userCenter = yield userCenterService.create({ userId, centerId: newCenter.id });
        if (!userCenter) {
            throw new Error("Failed to update center association");
        }
    });
}
//LOGIN
exports.userRouter.post("/login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = request.body;
    try {
        const user = yield UserService.login(userData.username);
        if (!user) {
            return response.status(404).json({ message: "Username or Password Incorrect!" });
        }
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(userData.password, user.password);
        if (!isPasswordCorrect) {
            return response.status(404).json({ message: "Username or Password Incorrect!" });
        }
        const companyDetails = yield UserService.getAllCompanyDetails();
        const data = {
            token: genarateJwt(user),
            name: user.name,
            role: user.role,
            companyDetails: companyDetails
        };
        return response.status(201).json({ message: 'Login Successfully', data: data });
    }
    catch (error) {
        return response.status(500).json(error.message);
    }
}));
//UPDATE
exports.userRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const userData = request.body;
    try {
        if (!request.user) {
            return response.status(401);
        }
        const updateUser = yield UserService.update(userData, id);
        if (updateUser) {
            return response.status(201).json({ data: updateUser });
        }
    }
    catch (error) {
        return response.status(500).json({ data: error.message });
    }
}));
