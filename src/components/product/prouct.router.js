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
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const productService = __importStar(require("./product.service"));
const inventoryService = __importStar(require("../inventory/inventory.service"));
const centerService = __importStar(require("../center/center.service"));
const OENumberService = __importStar(require("../OEMNumber/oemnumber.service"));
const productdiscountlevelService = __importStar(require("../productDiscountLevel/productDiscount.service"));
const productcommissionRateService = __importStar(require("../productcommsionRate/productCommissionRate.service"));
exports.productRouter = express_1.default.Router();
//GET LIST
exports.productRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield productService.list();
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Products could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//GET 
exports.productRouter.get("/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const data = yield productService.get(id);
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Product could not be found" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
//POST
exports.productRouter.post("/", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        var productData = {
            barcode: data.barcode,
            brandId: data.brandId,
            criticalLevel: data.criticalLevel,
            image: data.image,
            itemCode: data.itemCode,
            printName: data.printName,
            productName: data.productName,
            typeId: data.typeId,
            cost: 0,
            minPrice: 0,
            MRP: 0,
            sellingPrice: 0,
            createdBy: userId
        };
        const newProduct = yield productService.create(productData);
        if (newProduct) {
            // Handle inventory
            const centerList = yield centerService.getlist();
            const centerPromises = centerList.map((center) => __awaiter(void 0, void 0, void 0, function* () {
                const inventory = yield inventoryService.upsert({
                    productId: newProduct.id,
                    centerId: center.id,
                    quantity: 0,
                });
                if (!inventory) {
                    throw new Error("Failed to update inventory association");
                }
            }));
            // Handle OEM Numbers
            const OEMnumberPromises = data.OEMnumberList.map((oem) => __awaiter(void 0, void 0, void 0, function* () {
                const oenum = yield OENumberService.create({
                    productId: newProduct.id,
                    OEMnumber: oem.OEMnumber
                });
                if (!oenum) {
                    throw new Error("Failed to update OEM Numbers");
                }
                return oenum; // Return the created OEM number
            }));
            const discountLevelsPromises = data.discountLevels.map((discount) => __awaiter(void 0, void 0, void 0, function* () {
                const dis = yield productdiscountlevelService.create({
                    productId: newProduct.id,
                    discountLevelId: discount.discountLevelId,
                    discountRate: discount.discountRate,
                    createdBy: userId
                });
                if (!dis) {
                    throw new Error("Failed to update Discount Rates");
                }
                return dis; // Return the created OEM number
            }));
            // const commissionLevelsPromises = data.commissionLevels.map(async (com: any) => {
            //     const dis = await productcommissionRateService.create({
            //         productId: newProduct.id,
            //         commissionRateId: com.commissionRateId,
            //         commissionRate: com.commissionRate,
            //         createdBy: userId
            //     });
            //     if (!dis) {
            //         throw new Error("Failed to update Discount Rates");
            //     }
            //     return dis; // Return the created OEM number
            // });
            try {
                // Wait for all promises
                const [inventoryResults, oemNumbers, discountList] = yield Promise.all([
                    Promise.all(centerPromises), // Wait for all inventory updates
                    Promise.all(OEMnumberPromises), // Wait for all OEM numbers to be created
                    Promise.all(discountLevelsPromises),
                ]);
                // Combine product and OEM numbers into a single data object
                const combinedData = Object.assign(Object.assign({}, newProduct), { OEMNumber: oemNumbers, productDiscountLevel: discountList });
                // Return the response including the combined data
                return response.status(201).json({
                    message: "Product Created Successfully",
                    data: combinedData
                });
            }
            catch (error) {
                return response.status(500).json({ message: error.message });
            }
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.productRouter.put("/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id; // Ensure this is a string
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        const productData = {
            barcode: data.barcode,
            brandId: data.brandId,
            criticalLevel: data.criticalLevel,
            image: data.image,
            itemCode: data.itemCode,
            printName: data.printName,
            productName: data.productName,
            typeId: data.typeId,
        };
        // Delete existing OEM numbers
        yield OENumberService.deleteOEMNumbers(id);
        // Update product
        const updateProduct = yield productService.update(productData, id);
        // Handle new OEM numbers
        const OEMnumberPromises = data.OEMnumberList.map((oem) => __awaiter(void 0, void 0, void 0, function* () {
            const oenum = yield OENumberService.create({
                productId: id,
                OEMnumber: oem.OEMnumber
            });
            if (!oenum) {
                throw new Error("Failed to update OEM Numbers");
            }
            return oenum;
        }));
        const discountLevelsPromises = data.discountLevels.map((discount) => __awaiter(void 0, void 0, void 0, function* () {
            const dis = yield productdiscountlevelService.upserts({
                discountLevelId: discount.discountLevelId,
                discountRate: discount.discountRate,
                createdBy: userId
            }, id);
            if (!dis) {
                throw new Error("Failed to update Discount Rates");
            }
            return dis; // Return the created OEM number
        }));
        const commissionLevelsPromises = data.commissionLevels.map((com) => __awaiter(void 0, void 0, void 0, function* () {
            const comm = yield productcommissionRateService.upserts({
                commissionRateId: com.commissionRateId,
                commissionRate: com.commissionRate,
                createdBy: userId
            }, id);
            if (!comm) {
                throw new Error("Failed to update Commission Rates");
            }
            return comm; // Return the created OEM number
        }));
        try {
            // Wait for all promises
            const [oemNumbers, discountList, commissionLevel] = yield Promise.all([
                Promise.all(OEMnumberPromises),
                Promise.all(discountLevelsPromises),
                Promise.all(commissionLevelsPromises),
            ]);
            // Combine product and OEM numbers into a single data object
            const combinedData = Object.assign(Object.assign({}, updateProduct), { OEMNumber: oemNumbers, productDiscountLevel: discountList, productcommissionRate: commissionLevel });
            // Return the response including the combined data
            return response.status(201).json({
                message: "Product Updated Successfully",
                data: combinedData
            });
        }
        catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.productRouter.put("/productStatus/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        console.log(data);
        const updateProductStatus = yield productService.updateStatus(data, id);
        if (updateProductStatus) {
            return response.status(201).json({ message: "Product Status Updated Successfully", data: updateProductStatus });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.productRouter.put("/productPriceUpdate/:id", auth_1.authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params;
    const data = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateProduct = yield productService.updatePrices(data, id);
        if (updateProduct) {
            return response.status(201).json({ message: "Product Price Updated Successfully", data: updateProduct });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
