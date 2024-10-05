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
exports.update = exports.create = exports.upsert = exports.filterInventory = exports.getbyProductId = exports.getbyCenter = exports.getlist = void 0;
const library_1 = require("@prisma/client/runtime/library");
const db_server_1 = require("../../utils/db.server");
const getlist = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.inventory.findMany();
});
exports.getlist = getlist;
const getbyCenter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.inventory.findMany({
        where: {
            centerId: id,
            status: true,
        },
        include: {
            product: true,
        },
    });
});
exports.getbyCenter = getbyCenter;
const getbyProductId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.inventory.findMany({
        where: {
            productId: id,
        }
    });
});
exports.getbyProductId = getbyProductId;
const filterInventory = (productId, centerId, date) => __awaiter(void 0, void 0, void 0, function* () {
    const filterConditions = {
        status: true,
    };
    // Filtering conditions based on productId and centerId
    if (productId) {
        filterConditions.productId = productId;
    }
    if (centerId) {
        filterConditions.centerId = centerId;
    }
    console.log("Filter Conditions:", filterConditions);
    // Fetch inventory list filtered by productId and/or centerId
    const inventories = yield db_server_1.db.inventory.findMany({
        where: filterConditions,
        include: {
            product: true,
            center: true,
        },
    });
    console.log("Inventories fetched:", inventories);
    // Calculate total quantity for the specified date
    const currentDate = new Date();
    const filterDate = date ? new Date(date) : currentDate;
    const dateStart = new Date(filterDate.setHours(0, 0, 0, 0));
    const dateEnd = new Date(filterDate.setHours(23, 59, 59, 999));
    const inventoriesOnDate = yield db_server_1.db.inventory.findMany({
        where: {
            status: true,
            updatedAt: {
                gte: dateStart,
                lt: dateEnd,
            },
        },
    });
    console.log("Inventories on date:", inventoriesOnDate);
    let totalQuantity = new library_1.Decimal(0);
    inventoriesOnDate.forEach((inventory) => {
        if (inventory.quantity) {
            totalQuantity = totalQuantity.plus(new library_1.Decimal(inventory.quantity));
        }
    });
    return {
        inventories,
        totalQuantity,
    };
});
exports.filterInventory = filterInventory;
const upsert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.cost) {
        const existingInventory = yield db_server_1.db.inventory.findUnique({
            where: {
                productId_centerId: {
                    productId: data.productId,
                    centerId: data.centerId,
                },
            },
        });
        const product = yield db_server_1.db.product.findFirst({
            where: {
                id: data.productId,
            }
        });
        const oldCost = (product === null || product === void 0 ? void 0 : product.cost) || new library_1.Decimal(0);
        const oldqty = (existingInventory === null || existingInventory === void 0 ? void 0 : existingInventory.quantity) || new library_1.Decimal(0);
        const newCost = new library_1.Decimal(data.cost);
        const newqty = new library_1.Decimal(data.quantity);
        const avgCost = (oldCost.times(oldqty).plus(newCost.times(newqty))).div(oldqty.plus(newqty));
        const updateCostproduct = yield db_server_1.db.product.update({
            where: {
                id: product === null || product === void 0 ? void 0 : product.id,
            },
            data: {
                cost: avgCost,
                minPrice: data.minPrice,
                MRP: data.MRP,
                sellingPrice: data.sellingPrice,
            }
        });
        let newQuantity;
        if (existingInventory && existingInventory.quantity !== null) {
            newQuantity = new library_1.Decimal(existingInventory.quantity).plus(new library_1.Decimal(data.quantity));
        }
        else {
            newQuantity = new library_1.Decimal(data.quantity);
        }
        return db_server_1.db.inventory.upsert({
            where: {
                productId_centerId: {
                    productId: data.productId,
                    centerId: data.centerId
                }
            },
            update: {
                quantity: newQuantity, // Update with the calculated new quantity
            },
            create: {
                productId: data.productId,
                centerId: data.centerId,
                quantity: newQuantity, // Insert the original quantity on creation
            },
        });
    }
    else {
        const existingInventory = yield db_server_1.db.inventory.findUnique({
            where: {
                productId_centerId: {
                    productId: data.productId,
                    centerId: data.centerId
                }
            },
        });
        let newQuantity;
        if (existingInventory && existingInventory.quantity !== null) {
            newQuantity = new library_1.Decimal(existingInventory.quantity).plus(new library_1.Decimal(data.quantity));
        }
        else {
            newQuantity = new library_1.Decimal(data.quantity);
        }
        return db_server_1.db.inventory.upsert({
            where: {
                productId_centerId: {
                    productId: data.productId,
                    centerId: data.centerId
                }
            },
            update: {
                quantity: newQuantity, // Update with the calculated new quantity
            },
            create: {
                productId: data.productId,
                centerId: data.centerId,
                quantity: newQuantity, // Insert the original quantity on creation
            },
        });
    }
    ;
});
exports.upsert = upsert;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.inventory.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.inventory.update({
        where: id,
        data: data
    });
});
exports.update = update;
