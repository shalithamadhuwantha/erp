import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, ExpressRequest } from '../../middleware/auth'


import * as useruserCenterService from './userCenter.service'

export const userCenterRoute = express.Router();

//GET
userCenterRoute.get("/byuser", authenticate, async (request: ExpressRequest, response: Response) => {
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;

        const data = await useruserCenterService.getCentersByUserId(userId);
        return response.status(200).json({ data: data });
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
})

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
