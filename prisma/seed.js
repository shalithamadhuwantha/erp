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
const client_1 = require("@prisma/client");
const db_server_1 = require("../src/utils/db.server");
const bcrypt_1 = require("bcrypt");
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDateTime = new Date();
        const timezone = 'Asia/Colombo';
        // const utcDateTime = format(toZonedTime(currentDateTime, timezone), 'yyyy-MM-dd HH:mm:ss.SSSXXX', { timeZone: 'UTC' });
        const hashedPassword = yield (0, bcrypt_1.hash)("1234", 10);
        const user = yield db_server_1.db.user.create({
            data: {
                name: "Admin",
                phoneNumber: "0000000000", // Example phone number
                username: "admin",
                password: hashedPassword,
                role: client_1.Role.ADMIN, // Using the Role enum
                isconform: true
            }
        });
        const userid = user.id;
        const CompanyDetails = yield db_server_1.db.companyDetails.create({
            data: {
                companyName: "HITECH (PVT) LTD",
                address1: "Colombo",
                address2: "Sri Lanka",
                telPhone1: "0764533003",
                telPhone2: "0729451231",
                email: 'info@hitechlanka.lk',
            }
        });
        const customer = yield db_server_1.db.partyGroup.create({
            data: { partyGroupName: "CUSTOMER" }
        });
        const supplier = yield db_server_1.db.partyGroup.create({
            data: { partyGroupName: "SUPPLIER" }
        });
        yield db_server_1.db.partyCategory.createMany({
            data: [
                { category: "WALKING CUSTOMER", partyGroupId: customer.id, createdBy: userid },
                { category: "VISITING CUSTOMER", partyGroupId: customer.id, isEditable: false, createdBy: userid },
                { category: "COMMON SUPPLIER", partyGroupId: supplier.id, createdBy: userid }
            ]
        });
        yield db_server_1.db.discountLevel.create({
            data: { level: 'Cash Discount', createdBy: userid }
        });
        // await db.brand.createMany({
        //     data: [
        //         { brandName: "BMW", createdBy: userid },
        //         { brandName: "TATA", createdBy: userid },
        //         { brandName: "TOYOTA", createdBy: userid },
        //     ]
        // });
        // await db.type.createMany({
        //     data: [
        //         { typeName: "OIL FILTER", createdBy: userid },
        //         { typeName: "RIM", createdBy: userid },
        //         { typeName: "BUFFER", createdBy: userid },
        //     ]
        // });
        yield db_server_1.db.payment.createMany({
            data: [
                { type: "Cash" },
                { type: "Online Transfer" },
                { type: "Cheque" },
                { type: "Credit" },
                { type: "Petty Cash" },
            ]
        });
        const assets = yield db_server_1.db.accountCategory.create({
            data: { accCategory: "ASSETS" },
        });
        const liabilities = yield db_server_1.db.accountCategory.create({
            data: { accCategory: "LIABILITIES" },
        });
        const equity = yield db_server_1.db.accountCategory.create({
            data: { accCategory: "EQUITY" },
        });
        const income = yield db_server_1.db.accountCategory.create({
            data: { accCategory: "INCOME" },
        });
        const expencess = yield db_server_1.db.accountCategory.create({
            data: { accCategory: "EXPENCESS" },
        });
        const fixassets = yield db_server_1.db.accountSubCategory.create({
            data: { accountSubName: "FIX ASSETS", accountCategoryId: assets.id, createdBy: userid },
        });
        const currentassets = yield db_server_1.db.accountSubCategory.create({
            data: { accountSubName: "CURRENT ASSETS", accountCategoryId: assets.id, createdBy: userid }
        });
        const fixliabilities = yield db_server_1.db.accountSubCategory.create({
            data: { accountSubName: "FIX LIABILITIES", accountCategoryId: liabilities.id, createdBy: userid },
        });
        const currentLiabilites = yield db_server_1.db.accountSubCategory.create({
            data: { accountSubName: "CURRENT LIABILITIES", accountCategoryId: liabilities.id, createdBy: userid },
        });
        const Expencess = yield db_server_1.db.accountSubCategory.create({
            data: { accountSubName: "Expencess", accountCategoryId: expencess.id, createdBy: userid },
        });
        const Incomes = yield db_server_1.db.accountSubCategory.create({
            data: { accountSubName: "Income", accountCategoryId: income.id, createdBy: userid },
        });
        const cash = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Cash & Cash Equivalents', createdBy: userid }
        });
        const bank = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Bank', createdBy: userid }
        });
        const receivable = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Receivable', createdBy: userid }
        });
        const payable = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Payable', createdBy: userid }
        });
        const acexpencess = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Expencess', createdBy: userid }
        });
        const incomes = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Income', createdBy: userid }
        });
        const inventory = yield db_server_1.db.accountGroup.create({
            data: { accountGroupName: 'Inventory', createdBy: userid }
        });
        const inventorys = yield db_server_1.db.chartofAccount.create({
            data: { accountName: "INVENTORY ACCOUNT", accountSubCategoryId: currentassets.id, accountGroupId: inventory.id, Opening_Balance: 0, createdBy: userid },
        });
        yield db_server_1.db.chartofAccount.createMany({
            data: [
                { accountName: "EXPENCESS ACCOUNT", accountSubCategoryId: Expencess.id, accountGroupId: acexpencess.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "PURCHASE EXPENCESS", accountSubCategoryId: Expencess.id, accountGroupId: acexpencess.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "SALES ACCOUNT", accountSubCategoryId: Incomes.id, accountGroupId: incomes.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "USER EXPENCESS ACCOUNT", accountSubCategoryId: Expencess.id, accountGroupId: acexpencess.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "CASH BOOK", accountSubCategoryId: currentassets.id, accountGroupId: cash.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "PETTY CASH", accountSubCategoryId: currentassets.id, accountGroupId: cash.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "BANK BOOK", accountSubCategoryId: currentassets.id, accountGroupId: bank.id, Opening_Balance: 0, createdBy: userid },
                { accountName: "PENDING CHEQUE", accountSubCategoryId: currentassets.id, accountGroupId: cash.id, Opening_Balance: 0, createdBy: userid },
            ]
        });
        yield db_server_1.db.voucherGroup.createMany({
            data: [
                { voucherName: "INVOICE", shortname: "INV", inventoryMode: client_1.InventoryMode.MINUS, isAccount: true, isSidemenu: true, category: "Sales", label: "Invoice" },
                { voucherName: "SALES-RETURN", shortname: "SRET", inventoryMode: client_1.InventoryMode.PLUS, isAccount: true, isSidemenu: true, category: "Sales", label: "Sales Return" },
                { voucherName: "SALES-ORDER", shortname: "SO", inventoryMode: client_1.InventoryMode.NONE, isAccount: false, isSidemenu: true, category: "Sales", label: "Sales Order" },
                { voucherName: "GRN", shortname: "GRN", inventoryMode: client_1.InventoryMode.PLUS, isAccount: true, isSidemenu: true, category: "Inventory", label: "GRN" },
                { voucherName: "PURCHASE-RETURN", shortname: "PRT", inventoryMode: client_1.InventoryMode.MINUS, isAccount: true, isSidemenu: true, category: "Inventory", label: "Purchase Return" },
                { voucherName: "STOCK-TRANSFER", shortname: "ST", inventoryMode: client_1.InventoryMode.DOUBLE, isAccount: false, isSidemenu: true, category: "Inventory", label: "Stock Transfer" },
                { voucherName: "PURCHASE-ORDER", shortname: "PO", inventoryMode: client_1.InventoryMode.NONE, isAccount: false, isSidemenu: true, category: "Inventory", label: "Purchase Order" },
                { voucherName: "PAYMENT", shortname: "PAYMENT", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Payment" },
                { voucherName: "DIRECT PAYMENT", shortname: "PAYMENT-D", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Direct Payment" },
                { voucherName: "RECEIPT", shortname: "RECEIPT", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Recipt" },
                { voucherName: "UTILITY-BILL-CREATE", shortname: "UTILITY-BC", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Utility Bill Create" },
                { voucherName: "UTILITY-BILL-PAYMENT", shortname: "UTILITY-BPAY", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Utility Bill Payment" },
                { voucherName: "PETTY-CASH", shortname: "PC", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Petty Cash" },
                { voucherName: "PETTY-CASH-IOU", shortname: "PC-IOU", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Petty Cash IOU" },
                { voucherName: "SUPPLIER-BILL", shortname: "SUPPLIER-BC", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Supplier Bill" },
                { voucherName: "JOURNAL-ENTRY", shortname: "JE", inventoryMode: client_1.InventoryMode.NONE, isAccount: true, isSidemenu: true, category: "Account", label: "Journal Entry" },
            ]
        });
        yield db_server_1.db.proofimage.createMany({
            data: [
                { name: 'BR Image' },
                { name: 'NIC Image' },
                { name: 'Shop Imge' },
            ]
        });
    });
}
seed().catch((error) => {
    console.error("Error seeding data:", error);
}).finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_server_1.db.$disconnect();
}));
