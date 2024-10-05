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
exports.getVouchersGroupedByAuthUserWithVisits = exports.getRefVoucherbyVoucherGrpid = exports.getVouchersByUserAndDateRange = exports.getVouchersByPartyByUserAndDateRange = exports.updatepaidValue = exports.findManyByIds = exports.updateConform = exports.generateVoucherNumber = exports.updateVoucherNumber = exports.update = exports.create = exports.getVoucherbyPartyfalse = exports.getVoucherbyChartofacc = exports.getVoucherbyPartytrue = exports.getVoucherbyParty = exports.getVoucherbyGrp = exports.getbyid = exports.get = exports.list = void 0;
const client_1 = require("@prisma/client");
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany();
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findFirst({
        where: {
            id,
        },
        include: {
            party: true,
            user: {
                select: {
                    name: true,
                    phoneNumber: true,
                }
            },
            voucherProduct: {
                include: {
                    product: {
                        select: {
                            productName: true,
                            printName: true
                        }
                    },
                }
            },
            referVouchers: true,
            PaymentVoucher: true
        }
    });
});
exports.get = get;
const getbyid = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findFirst({
        where: {
            id: id
        },
        include: {
            user: {
                select: {
                    name: true,
                    phoneNumber: true,
                }
            },
        }
    });
});
exports.getbyid = getbyid;
const getVoucherbyGrp = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            voucherGroupId: id,
        },
        include: {
            party: true,
        }
    });
});
exports.getVoucherbyGrp = getVoucherbyGrp;
const getVoucherbyParty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            partyId: id,
        }
    });
});
exports.getVoucherbyParty = getVoucherbyParty;
const getVoucherbyPartytrue = (id, condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            partyId: id,
            isconform: condition,
            NOT: {
                paidValue: {
                    gte: db_server_1.db.voucher.fields.amount
                }
            },
            OR: [
                { voucherNumber: { startsWith: 'GRN' } },
                { voucherNumber: { startsWith: 'INV' } },
            ],
        }
    });
});
exports.getVoucherbyPartytrue = getVoucherbyPartytrue;
const getVoucherbyChartofacc = (id, condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            chartofAccountId: id,
            isconform: condition,
            NOT: {
                paidValue: {
                    gt: db_server_1.db.voucher.fields.amount
                }
            },
            OR: [
                { voucherNumber: { startsWith: 'UTILITY-BC' } },
            ],
        }
    });
});
exports.getVoucherbyChartofacc = getVoucherbyChartofacc;
const getVoucherbyPartyfalse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            partyId: id,
            isconform: false
        }
    });
});
exports.getVoucherbyPartyfalse = getVoucherbyPartyfalse;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.create({
        data: { voucherNumber: data.voucherNumber, date: data.date, totalDebit: data === null || data === void 0 ? void 0 : data.totalDebit, totalCredit: data === null || data === void 0 ? void 0 : data.totalCredit, amount: data.amount, paidValue: data.paidValue, location: data.location, partyId: data === null || data === void 0 ? void 0 : data.partyId, chartofAccountId: data === null || data === void 0 ? void 0 : data.chartofAccountId, note: data.note, dueDays: data === null || data === void 0 ? void 0 : data.dueDays, isconform: data === null || data === void 0 ? void 0 : data.isconform, refVoucherNumber: data === null || data === void 0 ? void 0 : data.refVoucherNumber, isRef: data === null || data === void 0 ? void 0 : data.isRef, refNumber: data === null || data === void 0 ? void 0 : data.refNumber, voucherGroupId: data.voucherGroupId, authUser: data === null || data === void 0 ? void 0 : data.authUser, createdBy: data.createdBy },
        include: {
            party: true,
            voucherProduct: {
                select: {
                    MRP: true,
                    amount: true,
                    centerId: true,
                    cost: true,
                    createdAt: true,
                    id: true,
                    isdisabale: true,
                    minPrice: true,
                    discount: true,
                    productId: true,
                    quantity: true,
                    remainingQty: true,
                    sellingPrice: true,
                    updatedAt: true,
                    voucherId: true,
                    product: {
                        select: {
                            productName: true,
                            printName: true
                        }
                    }
                }
            },
            referVouchers: true,
            PaymentVoucher: true,
            user: {
                select: {
                    name: true,
                    phoneNumber: true,
                }
            },
            VoucherCenter: true,
            voucherGroup: true,
        }
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.update({
        where: id,
        data: data
    });
});
exports.update = update;
const updateVoucherNumber = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const voucher = yield db_server_1.db.voucher.findFirst({
        where: {
            voucherNumber: data.refVoucherNumber,
        },
    });
    if (!voucher) {
        throw new Error("Voucher not found");
    }
    return db_server_1.db.voucher.update({
        where: {
            id: voucher.id,
        },
        data: {
            isRef: data.isRef,
            refVoucherNumber: data.voucherId,
        },
    });
});
exports.updateVoucherNumber = updateVoucherNumber;
const generateVoucherNumber = (voucherGroupId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the voucher group by ID to retrieve its name
    const voucherGroup = yield db_server_1.db.voucherGroup.findUnique({
        where: { id: voucherGroupId },
    });
    if (!voucherGroup) {
        throw new Error("Voucher Group not found");
    }
    const shortname = voucherGroup.shortname; // e.g., 'BILLING', 'RECEIPT'
    // Get the latest voucher for the specified group
    const lastVoucher = yield db_server_1.db.voucher.findFirst({
        where: { voucherGroupId },
        orderBy: { createdAt: 'desc' }, // Get the latest voucher
    });
    let newVoucherNumber;
    if (lastVoucher) {
        // Extract the numeric part from the last voucher number
        const lastVoucherNumber = lastVoucher.voucherNumber.split('-').pop();
        const lastNumber = parseInt(lastVoucherNumber || '0', 10);
        // Increment the number for the new voucher
        newVoucherNumber = `${shortname}-${String(lastNumber + 1).padStart(4, '0')}`;
    }
    else {
        // If no voucher exists for this group, start with '0001'
        newVoucherNumber = `${shortname}-0001`;
    }
    return newVoucherNumber;
});
exports.generateVoucherNumber = generateVoucherNumber;
const updateConform = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.update({
        where: id,
        data: { isconform: data.isconform }
    });
});
exports.updateConform = updateConform;
const findManyByIds = (voucherIds) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            id: { in: voucherIds }
        },
        orderBy: { createdAt: 'asc' } // Order by the oldest first (if needed)
    });
});
exports.findManyByIds = findManyByIds;
const updatepaidValue = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.update({
        where: {
            id: data.id,
        },
        data: {
            paidValue: data.paidValue,
        }
    });
});
exports.updatepaidValue = updatepaidValue;
const getVouchersByPartyByUserAndDateRange = (voucherGroupId, startDate, endDate, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: Object.assign(Object.assign({}, (userId && { user: userId })), { voucherGroupId: voucherGroupId, date: {
                gte: startDate,
                lte: endDate,
            } }),
        include: {
            party: true,
            chartofacc: {
                select: {
                    accountName: true,
                }
            },
            voucherProduct: {
                select: {
                    MRP: true,
                    amount: true,
                    centerId: true,
                    cost: true,
                    createdAt: true,
                    id: true,
                    isdisabale: true,
                    minPrice: true,
                    discount: true,
                    productId: true,
                    quantity: true,
                    remainingQty: true,
                    sellingPrice: true,
                    updatedAt: true,
                    voucherId: true,
                    product: {
                        select: {
                            productName: true,
                            printName: true
                        }
                    }
                }
            },
            referVouchers: true,
            PaymentVoucher: true,
            user: {
                select: {
                    name: true,
                    phoneNumber: true,
                }
            },
            VoucherCenter: {
                select: {
                    center: true,
                    centerStatus: true,
                }
            }
        }
    });
});
exports.getVouchersByPartyByUserAndDateRange = getVouchersByPartyByUserAndDateRange;
const getVouchersByUserAndDateRange = (userId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            createdBy: userId,
            date: {
                gte: startDate,
                lte: endDate,
            }
        },
        include: {
            chartofacc: {
                select: {
                    accountName: true,
                }
            },
            party: true,
            voucherProduct: {
                select: {
                    MRP: true,
                    amount: true,
                    centerId: true,
                    cost: true,
                    createdAt: true,
                    id: true,
                    isdisabale: true,
                    minPrice: true,
                    discount: true,
                    productId: true,
                    quantity: true,
                    remainingQty: true,
                    sellingPrice: true,
                    updatedAt: true,
                    voucherId: true,
                    product: {
                        select: {
                            productName: true,
                            printName: true
                        }
                    }
                }
            },
            referVouchers: true,
            PaymentVoucher: true,
            user: {
                select: {
                    name: true,
                    phoneNumber: true,
                }
            },
            VoucherCenter: {
                select: {
                    center: true,
                    centerStatus: true,
                }
            }
        }
    });
});
exports.getVouchersByUserAndDateRange = getVouchersByUserAndDateRange;
const getRefVoucherbyVoucherGrpid = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.voucher.findMany({
        where: {
            voucherGroupId: data.voucherGroupId,
            partyId: data.partyId,
            isRef: false
        },
        include: {
            voucherProduct: {
                select: {
                    MRP: true,
                    amount: true,
                    centerId: true,
                    cost: true,
                    createdAt: true,
                    id: true,
                    isdisabale: true,
                    minPrice: true,
                    discount: true,
                    productId: true,
                    quantity: true,
                    remainingQty: true,
                    sellingPrice: true,
                    updatedAt: true,
                    voucherId: true,
                    product: {
                        select: {
                            productName: true,
                            printName: true
                        }
                    }
                }
            }
        }
    });
});
exports.getRefVoucherbyVoucherGrpid = getRefVoucherbyVoucherGrpid;
const getVouchersGroupedByAuthUserWithVisits = (month, year) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const selectedMonth = month !== undefined ? month - 1 : currentDate.getMonth();
    const selectedYear = year !== undefined ? year : currentDate.getFullYear();
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    const todayStart = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of the current day
    const todayEnd = new Date(currentDate.setHours(23, 59, 59, 999)); // End of the current day
    // Fetch the voucherGroup IDs for SALES-RETURN and INVOICE
    const salesReturnGroup = yield db_server_1.db.voucherGroup.findFirst({
        where: { voucherName: 'SALES-RETURN' },
        select: { id: true }
    });
    const invoiceGroup = yield db_server_1.db.voucherGroup.findFirst({
        where: { voucherName: 'INVOICE' },
        select: { id: true }
    });
    if (!salesReturnGroup || !invoiceGroup) {
        throw new Error("Unable to find specified voucher groups");
    }
    // Group by authUser for monthly Sales-Return and Invoice
    const salesReturnVouchersMonthly = yield db_server_1.db.voucher.groupBy({
        by: ['authUser'],
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
            voucherGroupId: salesReturnGroup.id,
        },
        _sum: {
            amount: true,
        },
        _count: {
            id: true,
        },
    });
    const invoiceVouchersMonthly = yield db_server_1.db.voucher.groupBy({
        by: ['authUser'],
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
            voucherGroupId: invoiceGroup.id,
        },
        _sum: {
            amount: true,
        },
        _count: {
            id: true,
        },
    });
    // Group by authUser for daily Sales-Return and Invoice
    const salesReturnVouchersDaily = yield db_server_1.db.voucher.groupBy({
        by: ['authUser'],
        where: {
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
            voucherGroupId: salesReturnGroup.id,
        },
        _sum: {
            amount: true,
        },
        _count: {
            id: true,
        },
    });
    const invoiceVouchersDaily = yield db_server_1.db.voucher.groupBy({
        by: ['authUser'],
        where: {
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
            voucherGroupId: invoiceGroup.id,
        },
        _sum: {
            amount: true,
        },
        _count: {
            id: true,
        },
    });
    // Create a map to combine the data for all users
    const userVoucherMap = {};
    // Process monthly sales return vouchers
    salesReturnVouchersMonthly.forEach((voucher) => {
        if (voucher.authUser !== null) {
            if (!userVoucherMap[voucher.authUser]) {
                userVoucherMap[voucher.authUser] = {
                    totalSalesReturn: voucher._sum.amount || 0,
                    totalSalesReturnCount: voucher._count.id || 0,
                    totalInvoiceValue: 0,
                    totalInvoices: 0,
                    totalVisits: 0,
                    daily: {
                        totalSalesReturn: 0,
                        totalSalesReturnCount: 0,
                        totalInvoiceValue: 0,
                        totalInvoices: 0,
                        totalVisits: 0,
                    }
                };
            }
            else {
                userVoucherMap[voucher.authUser].totalSalesReturn += voucher._sum.amount || 0;
                userVoucherMap[voucher.authUser].totalSalesReturnCount += voucher._count.id || 0;
            }
        }
    });
    // Process monthly invoice vouchers
    invoiceVouchersMonthly.forEach((voucher) => {
        if (voucher.authUser !== null) {
            if (!userVoucherMap[voucher.authUser]) {
                userVoucherMap[voucher.authUser] = {
                    totalSalesReturn: 0,
                    totalSalesReturnCount: 0,
                    totalInvoiceValue: voucher._sum.amount || 0,
                    totalInvoices: voucher._count.id || 0,
                    totalVisits: 0,
                    daily: {
                        totalSalesReturn: 0,
                        totalSalesReturnCount: 0,
                        totalInvoiceValue: 0,
                        totalInvoices: 0,
                        totalVisits: 0,
                    }
                };
            }
            else {
                userVoucherMap[voucher.authUser].totalInvoiceValue += voucher._sum.amount || 0;
                userVoucherMap[voucher.authUser].totalInvoices += voucher._count.id || 0;
            }
        }
    });
    // Process daily sales return vouchers
    salesReturnVouchersDaily.forEach((voucher) => {
        if (voucher.authUser !== null) {
            if (userVoucherMap[voucher.authUser]) {
                userVoucherMap[voucher.authUser].daily.totalSalesReturn += voucher._sum.amount || 0;
                userVoucherMap[voucher.authUser].daily.totalSalesReturnCount += voucher._count.id || 0;
            }
        }
    });
    // Process daily invoice vouchers
    invoiceVouchersDaily.forEach((voucher) => {
        if (voucher.authUser !== null) {
            if (userVoucherMap[voucher.authUser]) {
                userVoucherMap[voucher.authUser].daily.totalInvoiceValue += voucher._sum.amount || 0;
                userVoucherMap[voucher.authUser].daily.totalInvoices += voucher._count.id || 0;
            }
        }
    });
    // Fetch visiting customer data for each authUser
    const visitCountsMonthly = yield db_server_1.db.vistingCustomer.groupBy({
        by: ['createdBy'],
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        _count: {
            id: true, // Count total visits for the month
        },
    });
    const visitCountsDaily = yield db_server_1.db.vistingCustomer.groupBy({
        by: ['createdBy'],
        where: {
            createdAt: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        _count: {
            id: true, // Count total visits for today
        },
    });
    // Map monthly visit counts to userVoucherMap
    visitCountsMonthly.forEach((visit) => {
        if (visit.createdBy && userVoucherMap[visit.createdBy]) {
            userVoucherMap[visit.createdBy].totalVisits += visit._count.id || 0;
        }
        else if (visit.createdBy) {
            userVoucherMap[visit.createdBy] = {
                totalVisits: visit._count.id || 0,
                daily: {
                    totalSalesReturn: 0,
                    totalSalesReturnCount: 0,
                    totalInvoiceValue: 0,
                    totalInvoices: 0,
                    totalVisits: 0,
                },
                totalSalesReturn: 0,
                totalSalesReturnCount: 0,
                totalInvoiceValue: 0,
                totalInvoices: 0,
            };
        }
    });
    // Map daily visit counts to userVoucherMap
    visitCountsDaily.forEach((visit) => {
        if (visit.createdBy && userVoucherMap[visit.createdBy]) {
            userVoucherMap[visit.createdBy].daily.totalVisits += visit._count.id || 0;
        }
    });
    // Convert the map into an array and fetch user names along with target, filtering for SALESMEN
    const userData = yield Promise.all(Object.keys(userVoucherMap).map((authUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (authUser) {
            const user = yield db_server_1.db.user.findFirst({
                where: {
                    id: authUser,
                    role: client_1.Role.SALESMEN, // Filter by role SALESMAN
                },
                select: { name: true, target: true },
            });
            if (user) {
                return {
                    username: (user === null || user === void 0 ? void 0 : user.name) || "Unknown User",
                    target: (user === null || user === void 0 ? void 0 : user.target) || 0,
                    totalVisits: userVoucherMap[authUser].totalVisits || 0,
                    totalInvoices: userVoucherMap[authUser].totalInvoices,
                    totalInvoiceValue: userVoucherMap[authUser].totalInvoiceValue,
                    totalSalesReturn: userVoucherMap[authUser].totalSalesReturn,
                    totalSalesReturnCount: userVoucherMap[authUser].totalSalesReturnCount,
                    daily: {
                        totalInvoices: userVoucherMap[authUser].daily.totalInvoices,
                        totalInvoiceValue: userVoucherMap[authUser].daily.totalInvoiceValue,
                        totalSalesReturn: userVoucherMap[authUser].daily.totalSalesReturn,
                        totalSalesReturnCount: userVoucherMap[authUser].daily.totalSalesReturnCount,
                        totalVisits: userVoucherMap[authUser].daily.totalVisits,
                    }
                };
            }
        }
        return null;
    })));
    // Filter out null values in case any authUser is missing or doesn't have the SALESMAN role
    return userData.filter(data => data !== null);
});
exports.getVouchersGroupedByAuthUserWithVisits = getVouchersGroupedByAuthUserWithVisits;
