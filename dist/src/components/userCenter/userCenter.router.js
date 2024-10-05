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
exports.userCenterRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const useruserCenterService = __importStar(require("./userCenter.service"));
exports.userCenterRoute = express_1.default.Router();
//GET
exports.userCenterRoute.get("/byuser", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        const data = yield useruserCenterService.getCentersByUserId(userId);
        return response.status(200).json({ data: data });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//GET
// userCenterRoute.get("/:id", async (request: Request, response: Response) => {
//     const id: any = request.params.id;
//     try {
//         const data = await userCenterService.get(id)
//         if (data) {
//             return response.status(200).json({ data: data });
//         }
//         return response.status(404).json({ message: "Center could not be found" });
//     } catch (error: any) {
//         return response.status(500).json({message: error.message});
//     }
// })
//POST
// userCenterRoute.post("/", authenticate, async (request: ExpressRequest, response: Response) => {
//     var data: any = request.body;
//     try {
//         if (!request.user) {
//             return response.status(401).json({ message: "User not authorized" });
//         }
//         const createdBy = request.user.id;
//         var data = { ...data, createdBy };
//         const newCenter = await userCenterService.create(data)
//         if (data.mode === "PHYSICAL") {
//             const adminUsers = await userService.getbyRole("ADMIN")
//             const centerPromises = adminUsers.map(async (user: { id: string }) => {
//                 const userCenter = await useruserCenterService.create({
//                     userId: user.id,
//                     centerId: newCenter.id
//                 });
//                 if (!userCenter) {
//                     throw new Error("Failed to update center association");
//                 }
//             });
//             try {
//                 await Promise.all(centerPromises);
//             } catch (error: any) {
//                 return response.status(500).json({ message: {message: error.message} });
//             }
//         }
//         if (newCenter) {
//             return response.status(201).json({ data: data, message: "Center Created Successfully" });
//         }
//     } catch (error: any) {
//         return response.status(500).json({message: error.message});
//     }
// })
//UPDATE
// userCenterRoute.put("/:id", async (request: Request, response: Response) => {
//     const id: any = request.params;
//     const data: any = request.body;
//     try {
//         const updateparty = await userCenterService.update(data, id)
//         if (updateparty) {
//             return response.status(201).json({ message: "Customer Updated Successfully" });
//         }
//     } catch (error: any) {
//         return response.status(500).json({message: error.message});
//     }
// })
