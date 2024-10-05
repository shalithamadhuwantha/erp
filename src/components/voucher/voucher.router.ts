import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, ExpressRequest } from '../../middleware/auth'
import { Prisma } from '@prisma/client';


import * as vocuherService from './voucher.service'
import * as voucherGrpService from '../voucherGroup/vouchergrp.service'
import * as voucherCenter from '../centerVoucher/centerVoucher.service'
import * as productVoucherService from '../voucherProduct/voucherProduct.service'
import * as inventoryService from '../inventory/inventory.service'
import * as productService from '../product/product.service'
import * as journalLineService from '../journalline/journalline.service'
import * as chartofaccService from '../ChartofAccount/chartofaccount.service'
import * as partyService from '../party/party.service'
import * as paymentService from '../payment/payment.service'
import * as paymentVoucherService from '../voucherPayment/voucherPayment.service'
import * as referVoucherService from '../referVouchers/referVouchers.service'
import * as chequebookService from '../ChequeBook/chequebook.service'
import * as chequeService from '../Cheque/cheque.service'
import * as pettyCashIOUService from '../pettycashIOU/pettycashIOU.service'

export const voucherRouter = express.Router();

//GET LIST
voucherRouter.get("/", async (request: Request, response: Response) => {
    try {
        const data = await vocuherService.list()
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Voucher could not be found" });
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
})

voucherRouter.get("/filter", async (request: Request, response: Response) => {
    try {
        const { VoucherGrpName, startDate, endDate, userId } = request.query;

        if (!VoucherGrpName) {
            return response.status(400).json({ message: "VoucherGrpname is required." });
        }
        const grpname = await voucherGrpService.getbyname(VoucherGrpName)

        // startDate format and if no end date set today's date
        const filterStartDate = startDate ? new Date(startDate as string) : new Date();
        filterStartDate.setHours(0, 0, 0, 0); // Set the time to midnight

        // if no endDate set end date as today's date
        const filterEndDate = endDate ? new Date(endDate as string) : new Date();
        filterEndDate.setHours(23, 59, 59, 999);


        console.log(`VoucherGrpName=${VoucherGrpName} between ${filterStartDate} and ${filterEndDate}`);
        if (isNaN(filterStartDate.getTime()) || isNaN(filterEndDate.getTime())) {
            return response.status(400).json({ message: "Invalid date format." });
        }

        const vouchers = await vocuherService.getVouchersByPartyByUserAndDateRange(grpname?.id as string, filterStartDate, filterEndDate, userId,);

        if (!vouchers || vouchers.length === 0) {
            return response.status(404).json({ message: "No vouchers found for the specified Voucher and date range." });
        }

        return response.status(200).json({ data: vouchers });
    } catch (error: any) {
        console.error("Error fetching vouchers:", error);
        return response.status(500).json({ message: "An error occurred while retrieving vouchers.", error: error.message });
    }
});

voucherRouter.get("/refVoucher", async (request: Request, response: Response) => {
    try {
        const { VoucherGrpName, partyId } = request.query;
        if (!VoucherGrpName) {
            return response.status(400).json({ message: "VoucherGrpname is required." });
        }
        const grpname = await voucherGrpService.getbyname(VoucherGrpName)

        const vouchers = await vocuherService.getRefVoucherbyVoucherGrpid({ voucherGroupId: grpname?.id, partyId: partyId });

        if (!vouchers || vouchers.length === 0) {
            return response.status(404).json({ message: "No vouchers found for the specified Voucher and date range." });
        }

        return response.status(200).json({ data: vouchers });
    } catch (error: any) {
        console.error("Error fetching vouchers:", error);
        return response.status(500).json({ message: "An error occurred while retrieving vouchers.", error: error.message });
    }
});

voucherRouter.get("/vouchersByAuthUser", async (req: Request, res: Response) => {
    try {
        let { month, year } = req.query;

        // Get current month and year if not provided
        if (!month || !year) {
            const currentDate = new Date();
            month = month || (currentDate.getMonth() + 1).toString(); // JavaScript months are 0-indexed, so add 1
            year = year || currentDate.getFullYear().toString();
        }

        const vouchersGroupedByAuthUser = await vocuherService.getVouchersGroupedByAuthUserWithVisits(parseInt(month as string), parseInt(year as string));

        return res.status(200).json({ data: vouchersGroupedByAuthUser });
    } catch (error: any) {
        console.error("Error fetching vouchers:", error);
        return res.status(500).json({ message: "An error occurred while retrieving vouchers.", error: error.message });
    }
});

//GET 
voucherRouter.get("/:id", async (request: Request, response: Response) => {
    const id: any = request.params.id;
    try {
        const data = await vocuherService.get(id)
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Voucher could not be found" });
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
})

voucherRouter.get("/voucherNumber/:vouchername", async (request: Request, response: Response) => {
    const vouchername: any = request.params.vouchername;
    try {
        const voucherGrpId = await voucherGrpService.getbyname(vouchername)
        const newVoucherNumber = await vocuherService.generateVoucherNumber(voucherGrpId?.id)
        if (newVoucherNumber) {
            return response.status(200).json({ data: newVoucherNumber });
        }
        return response.status(404).json({ message: "Voucher Number could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

voucherRouter.get("/group/:vouchername", async (request: Request, response: Response) => {
    const vouchername: any = request.params.vouchername;
    try {
        const voucherGrpId = await voucherGrpService.getbyname(vouchername)
        const vouchersbyGrp = await vocuherService.getVoucherbyGrp(voucherGrpId?.id)
        if (vouchersbyGrp) {
            return response.status(200).json({ data: vouchersbyGrp });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

voucherRouter.get("/party/:partyId", async (request: Request, response: Response) => {
    const partyId: any = request.params.partyId;
    try {
        const voucherbyParty = await vocuherService.getVoucherbyParty(partyId)
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

voucherRouter.post("/chartofAcc/condition/:chartofaccId", authenticate, async (request: ExpressRequest, response: Response) => {
    const chartofaccId: any = request.params.chartofaccId;
    const data: any = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }

        const voucherbyParty = await vocuherService.getVoucherbyChartofacc(chartofaccId, data.condition)
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

voucherRouter.post("/party/condition/:partyId", authenticate, async (request: ExpressRequest, response: Response) => {
    const partyId: any = request.params.partyId;
    const data: any = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }

        const voucherbyParty = await vocuherService.getVoucherbyPartytrue(partyId, data.condition)
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

voucherRouter.get("/party/false/:partyId", async (request: Request, response: Response) => {
    const partyId: any = request.params.partyId;
    try {
        const voucherbyParty = await vocuherService.getVoucherbyPartyfalse(partyId)
        if (voucherbyParty) {
            return response.status(200).json({ data: voucherbyParty });
        }
        return response.status(404).json({ message: "Voucher Group could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

//POST
voucherRouter.post("/", authenticate, async (request: ExpressRequest, response: Response) => {
    var data: any = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        const voucherGrpdetails = await voucherGrpService.getbyname(data.voucherGroupname)
        const newVoucherNumber = await vocuherService.generateVoucherNumber(voucherGrpdetails?.id)

        var totalCost = 0;
        var partyAcc: any;


        if (data?.partyId) {
            partyAcc = await partyService.get(data?.partyId)
        }
        if (data.productList) {
            totalCost = data.productList?.reduce((total: number, product: any) => {
                return total + (product.cost * product.quantity);
            }, 0);
        }
        const newVoucher = await vocuherService.create({
            ...data,
            authUser: data.authUser ? data.authUser : userId,
            voucherNumber: newVoucherNumber,
            voucherGroupId: voucherGrpdetails?.id,
            createdBy: userId
        })

        console.log(newVoucher)

        if (data.refVoucherNumber) {
            await vocuherService.updateVoucherNumber({ refVoucherNumber: data.refVoucherNumber, isRef: data.isRef, voucherId: newVoucher.voucherNumber })
        }

        if (voucherGrpdetails?.inventoryMode === "DOUBLE") {
            const centerPromises = data.productList.map(async (product: any) => {
                const voucherProduct = await productVoucherService.create({
                    cost: product.cost,
                    quantity: product.quantity,
                    discount: product.discount,
                    MRP: product.MRP,
                    minPrice: product.minPrice,
                    sellingPrice: product.sellingPrice,
                    amount: product.amount,
                    voucherId: newVoucher.id,
                    productId: product.productId,
                    centerId: product.toCenterId
                });
                if (!voucherProduct) {
                    throw new Error("Failed to update product to list association");
                }
                try {
                    await Promise.all(centerPromises);
                } catch (error: any) {
                    return response.status(500).json({ message: error.message });
                }
            });
            if (data.fromCenterId) {
                const newVoucherCenter = await voucherCenter.create({
                    centerId: data.fromCenterId,
                    voucherId: newVoucher.id,
                    centerStatus: "OUT"
                })
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Voucher Center to list association");
                }
                const inventoryPromise = data.productList.map(async (product: any) => {
                    const inventory = await inventoryService.upsert({
                        productId: product.productId,
                        centerId: data.fromCenterId,
                        quantity: -(product.quantity)
                    });
                    if (!inventory) {
                        throw new Error("Failed to update product to list association");
                    }
                });
                try {
                    await Promise.all(inventoryPromise);
                } catch (error: any) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if (data.toCenterId) {
                const newVoucherCenter = await voucherCenter.create({
                    centerId: data.toCenterId,
                    voucherId: newVoucher.id,
                    centerStatus: "IN"
                })
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Voucher Center to list association");
                }
                const inventoryPromise = data.productList.map(async (product: any) => {
                    const inventory = await inventoryService.upsert({
                        productId: product.productId,
                        centerId: data.toCenterId,
                        quantity: product.quantity
                    });
                    if (!inventory) {
                        throw new Error("Failed to update product to list association");
                    }
                });
                try {
                    await Promise.all(inventoryPromise);
                } catch (error: any) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if (newVoucher) {
                return response.status(201).json({ message: "Voucher Created Successfully" });
            }
        }

        else {
            console.log(data)
            if (data.payment) {
                const onlineTransfer = await paymentService.getbyname('Online Transfer');
                const cash = await paymentService.getbyname('Cash');
                const Cheque = await paymentService.getbyname('Cheque');
                const Credit = await paymentService.getbyname('Credit');

                // Prepare payment vouchers
                const paymentVouchers = [
                    { voucherId: newVoucher.id, paymentId: onlineTransfer?.id, paymentType: onlineTransfer?.type, amount: data.payment.onlineTransfer, refNumber: data.payment.refNumber },
                    { voucherId: newVoucher.id, paymentId: cash?.id, paymentType: cash?.type, amount: data.payment.cash },
                    { voucherId: newVoucher.id, paymentId: Cheque?.id, paymentType: Cheque?.type, amount: data.payment.cheque },
                    { voucherId: newVoucher.id, paymentId: Credit?.id, paymentType: Credit?.type, amount: data.payment.credit }
                ].filter(record => record.paymentId && record.amount > 0);

                let chequePaymentVoucher = null;

                // Loop to create each payment voucher and capture the cheque payment voucher
                for (const voucher of paymentVouchers) {
                    const createdVoucher = await paymentVoucherService.create(voucher);

                    // Check if this is the cheque voucher
                    if (voucher.paymentId === Cheque?.id) {
                        chequePaymentVoucher = createdVoucher;
                    }
                }
                // Now handle the cheque creation if applicable
                if (data.payment.cheque > 0 && chequePaymentVoucher) {
                    console.log(data.payment.chequeBookId);
                    const cheque = await chequeService.create({
                        chequeNumber: data.payment.chequenumber.toString(),
                        chequeBankName: data.payment.chequeBankName,
                        issueDate: data.date,
                        releaseDate: data.payment.releaseDate,
                        amount: data.payment.cheque,
                        chequeBookId: data.payment?.chequeBookId,
                        voucherId: newVoucher.id,
                        paymentVoucherId: chequePaymentVoucher.id,
                        creditDebit: data.payment.creditDebit,
                        createdBy: userId
                    });
                    if (data.payment?.chequeBookId !== undefined) {
                        await chequebookService.updatechequeRemaning(data.payment?.chequeBookId);
                    }
                }
            }

            if (data.voucherGroupname !== "DIRECT PAYMENT") {
                if (data.selectedVoucherIds && data.amount > 0) {
                    let remainingAmount = data.amount; // Amount to be paid
                    const selectedVouchers = await vocuherService.findManyByIds(data.selectedVoucherIds.map((v: any) => v.voucherId));

                    for (const voucher of selectedVouchers) {
                        // Safely handle the voucher.amount and voucher.paidValue as Decimal or number
                        const voucherAmount = voucher.amount instanceof Prisma.Decimal ? voucher.amount.toNumber() : (voucher.amount || 0);
                        const paidValue = voucher.paidValue instanceof Prisma.Decimal ? voucher.paidValue.toNumber() : (voucher.paidValue || 0);

                        const remainingVoucherAmount = voucherAmount - paidValue; // Remaining unpaid amount for this voucher

                        if (remainingAmount <= 0) {
                            break; // No remaining amount to distribute
                        }

                        // Calculate how much can be paid on this voucher
                        const payableAmount = Math.min(remainingVoucherAmount, remainingAmount);

                        if (payableAmount > 0) {
                            // Update the paidValue of the voucher
                            const updatedPaidValue = paidValue + payableAmount;

                            await vocuherService.updatepaidValue({
                                id: voucher.id,
                                paidValue: updatedPaidValue
                            });
                            var selectedVoucher = await vocuherService.getbyid(voucher.id)
                            await referVoucherService.create({
                                refVoucherNumber: selectedVoucher?.voucherNumber,
                                invoiceDate: selectedVoucher?.date,
                                invoiceAmount: selectedVoucher?.amount,
                                settledAmount: updatedPaidValue,
                                paidAmount: updatedPaidValue - paidValue,
                                voucherId: newVoucher.id,
                                createdBy: userId
                            });

                            // Decrease the remaining amount by the amount just paid
                            remainingAmount -= payableAmount;
                        }
                    }

                    if (remainingAmount > 0) {
                        // If there's still some remaining amount that couldn't be distributed
                        return response.status(400).json({ message: "Payment exceeds total due for selected vouchers." });
                    }
                }
            }

            if (data.journalEntries && data.journalEntries.length > 0) {
                const journalEntries = data.journalEntries;

                // Loop through each journal entry and create corresponding journalLine
                for (let entry of journalEntries) {
                    var chartofAccId = entry.accountId
                    if (entry.accountId === "CASH") {
                        var cashchartofaccid = await chartofaccService.getbyname('CASH BOOK')
                        chartofAccId = cashchartofaccid?.id
                    }
                    if (entry.accountId === "Check") {
                        var pendingCheque = await chartofaccService.getbyname('PENDING CHEQUE')
                        chartofAccId = pendingCheque?.id
                    }
                    if (entry.accountId === "Expencess") {
                        var expencessacc = await chartofaccService.getbyname('EXPENCESS ACCOUNT')
                        chartofAccId = expencessacc?.id
                    }
                    if (entry.accountId === "PettyCash") {
                        var expencessacc = await chartofaccService.getbyname('PETTY CASH')
                        chartofAccId = expencessacc?.id
                    }
                    if (entry.accountId === "UserExp") {
                        var expencessacc = await chartofaccService.getbyname('USER EXPENCESS ACCOUNT')
                        chartofAccId = expencessacc?.id
                    }
                    if (entry.accountId === "Sales") {
                        var expencessacc = await chartofaccService.getbyname('SALES ACCOUNT')
                        chartofAccId = expencessacc?.id
                    }
                    const journalLineData = {
                        voucherId: newVoucher.id, // Link to the created voucher
                        chartofAccountId: chartofAccId, // Account ID from the journal entry
                        debitAmount: entry.debit || 0, // Debit amount if present
                        creditAmount: entry.credit || 0, // Credit amount if present
                        ref: entry.ref, // Reference number from the voucher
                        createdBy: userId, // Assuming `req.user.id` contains the user ID
                    };

                    await journalLineService.create(journalLineData);
                }
            }

            if (data.iou && data.iou.length > 0) {
                const iou = data.iou;
                for (let entry of iou) {
                    const ioudata = {
                        voucherId: newVoucher.id,
                        userid: entry.userid,
                        amount: entry.amount,
                        createdBy: userId,
                    }
                    await pettyCashIOUService.create(ioudata);
                }
            }

            if (data.productList) {
                const centerPromises = data.productList?.map(async (product: any) => {
                    const voucherProduct = await productVoucherService.create({
                        cost: product.cost,
                        quantity: product.quantity,
                        remainingQty: product.quantity,
                        discount: product.discount,
                        MRP: product.MRP,
                        minPrice: product.minPrice,
                        sellingPrice: product.sellingPrice,
                        amount: product.amount,
                        voucherId: newVoucher.id,
                        productId: product.productId,
                        centerId: data.centerId
                    });

                    // if (data.voucherGroupname === 'GRN') {
                    //     const updateProductPrices = await productService.updatePricesbulk({
                    //         cost: product.cost,
                    //         minPrice: product.minPrice,
                    //         MRP: product.MRP,
                    //         sellingPrice: product.sellingPrice
                    //     }, product.productId)
                    //     if (!updateProductPrices) {
                    //         throw new Error("Failed to update product prices association");
                    //     }
                    // }
                    // if (!voucherProduct) {
                    //     throw new Error("Failed to update product to list association");
                    // }
                });
                try {
                    await Promise.all(centerPromises);
                } catch (error: any) {
                    return response.status(500).json({ message: error.message });
                }
            }

            if (voucherGrpdetails?.inventoryMode === "PLUS") {
                const newVoucherCenter = await voucherCenter.create({
                    centerId: data.centerId,
                    voucherId: newVoucher.id,
                    centerStatus: "IN"
                })
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Vo    ucher Center to list association");
                }
                if (voucherGrpdetails?.isAccount === true) {
                    const inventoryPromise = data.productList.map(async (product: any) => {
                        if (data.voucherGroupname === 'GRN') {
                            const inventory = await inventoryService.upsert({
                                productId: product.productId,
                                centerId: data.centerId,
                                quantity: product.quantity,
                                cost: product.cost,
                                minPrice: product.minPrice,
                                MRP: product.MRP,
                                sellingPrice: product.sellingPrice,
                            });
                            if (!inventory) {
                                throw new Error("Failed to update product to list association");
                            }
                        } else {
                            const inventory = await inventoryService.upsert({
                                productId: product.productId,
                                centerId: data.centerId,
                                quantity: product.quantity,
                            });
                            if (!inventory) {
                                throw new Error("Failed to update product to list association");
                            }
                        }

                    });

                    try {
                        await Promise.all(inventoryPromise);
                    } catch (error: any) {
                        return response.status(500).json({ message: error.message });
                    }
                }
            }

            if (voucherGrpdetails?.inventoryMode === "MINUS") {
                const newVoucherCenter = await voucherCenter.create({
                    centerId: data.centerId,
                    voucherId: newVoucher.id,
                    centerStatus: "OUT"
                })
                if (!newVoucherCenter) {
                    throw new Error("Failed to update Voucher Center to list association");
                }
                const inventoryPromise = data.productList.map(async (product: any) => {
                    const inventory = await inventoryService.upsert({
                        productId: product.productId,
                        centerId: data.centerId,
                        quantity: -(product.quantity)
                    });
                    if (!inventory) {
                        throw new Error("Failed to update product to list association");
                    }
                });
                try {
                    await Promise.all(inventoryPromise);
                } catch (error: any) {
                    return response.status(500).json({ message: error.message });
                }
            }
            if (newVoucher) {
                return response.status(201).json({ message: "Voucher Created Successfully", data: newVoucher });
            }
        }
    } catch (error: any) {
        console.error("Error creating voucher:", error);  // Add more detailed logging
        return response.status(500).json({ message: error.message });
    }
})

//PUT
voucherRouter.put("/:id", authenticate, async (request: ExpressRequest, response: Response) => {
    const id: any = request.params;
    const data: any = request.body;

    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateVoucher = await vocuherService.update(data, id)

        if (updateVoucher) {
            return response.status(201).json({ message: "Voucher Updated Successfully" });
        }
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
})

voucherRouter.put("/conform/:id", authenticate, async (request: ExpressRequest, response: Response) => {
    const id: any = request.params;
    const data: any = request.body;

    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateVoucher = await vocuherService.updateConform(data, id)

        if (updateVoucher) {
            return response.status(201).json({ message: "Voucher Conform Successfully" });
        }
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
})

