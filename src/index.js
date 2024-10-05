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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = require("./components/user/user.router");
const center_router_1 = require("./components/center/center.router");
const party_router_1 = require("./components/party/party.router");
const brand_router_1 = require("./components/brand/brand.router");
const type_router_1 = require("./components/type/type.router");
const prouct_router_1 = require("./components/product/prouct.router");
const voucher_router_1 = require("./components/voucher/voucher.router");
const userCenter_router_1 = require("./components/userCenter/userCenter.router");
const inventory_router_1 = require("./components/inventory/inventory.router");
const voucherProduct_router_1 = require("./components/voucherProduct/voucherProduct.router");
const chartofaccount_router_1 = require("./components/ChartofAccount/chartofaccount.router");
const accountCategory_router_1 = require("./components/accountCategory/accountCategory.router");
const accountSubCategory_router_1 = require("./components/accountSubCategory/accountSubCategory.router");
const accountGroup_router_1 = require("./components/accountGroup/accountGroup.router");
const partyCategory_route_1 = require("./components/partyCategory/partyCategory.route");
const chequebook_router_1 = require("./components/ChequeBook/chequebook.router");
const cheque_router_1 = require("./components/Cheque/cheque.router");
const disscountLevel_router_1 = require("./components/discountLevel/disscountLevel.router");
const journalline_router_1 = require("./components/journalline/journalline.router");
const pettycashIOU_router_1 = require("./components/pettycashIOU/pettycashIOU.router");
const vouchergrp_router_1 = require("./components/voucherGroup/vouchergrp.router");
const prodcutDiscount_router_1 = require("./components/productDiscountLevel/prodcutDiscount.router");
const visitedCustomer_router_1 = require("./components/visitedCustomer/visitedCustomer.router");
const commissionRate_route_1 = require("./components/commissionRate/commissionRate.route");
const partyType_route_1 = require("./components/partyType/partyType.route");
const proofImage_router_1 = require("./components/proofImage/proofImage.router");
dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/users", user_router_1.userRouter);
app.use("/api/center", center_router_1.centerRouter);
app.use("/api/party", party_router_1.partyRouter);
app.use("/api/partyCategory", partyCategory_route_1.partyCategoryRouter);
app.use("/api/brand", brand_router_1.brandRouter);
app.use("/api/type", type_router_1.typeRouter);
app.use("/api/product", prouct_router_1.productRouter);
app.use("/api/voucher", voucher_router_1.voucherRouter);
app.use("/api/userCenter", userCenter_router_1.userCenterRoute);
app.use("/api/inventory", inventory_router_1.inventoryRouter);
app.use("/api/voucherProduct", voucherProduct_router_1.VoucherProductListRouter);
app.use("/api/chartofAcc", chartofaccount_router_1.chartofAccRouter);
app.use("/api/accSubCategory", accountSubCategory_router_1.accSubCategoryRouter);
app.use("/api/accGroup", accountGroup_router_1.accGroupRouter);
app.use("/api/accCategory", accountCategory_router_1.accCategoryRouter);
app.use("/api/chequebook", chequebook_router_1.chequebookRouter);
app.use("/api/cheque", cheque_router_1.chequeRouter);
app.use("/api/discountLevel", disscountLevel_router_1.discountLevelRouter);
app.use("/api/commission", commissionRate_route_1.commsissionRateRouter);
app.use("/api/productDiscount", prodcutDiscount_router_1.productDiscountRouter);
app.use("/api/jornalLine", journalline_router_1.journalLineRouter);
app.use("/api/pettyCashIOU", pettycashIOU_router_1.pettyCashIOURouter);
app.use("/api/voucherGrp", vouchergrp_router_1.VoucherGrpRouter);
app.use("/api/visitingCustomer", visitedCustomer_router_1.visitingCustomerRouter);
app.use("/api/partyType", partyType_route_1.partyTypeRouter);
app.use("/api/proofImage", proofImage_router_1.proofImageRouter);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
