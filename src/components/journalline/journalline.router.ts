import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, ExpressRequest } from '../../middleware/auth'

import * as jornalLineService from './journalline.service'

export const journalLineRouter = express.Router();

//GET LIST
journalLineRouter.get("/", async (request: Request, response: Response) => {
    try {
        const data = await jornalLineService.list()
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Jorual List could not be found" });
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
})

journalLineRouter.get("/ref/:name", async (request: Request, response: Response) => {
    const name: any = request.params.name;
    try {
        const data = await jornalLineService.getbyRef(name)
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Jorual List could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

//GET 
journalLineRouter.get("/:id", async (request: Request, response: Response) => {
    const id: any = request.params.id;
    try {
        const data = await jornalLineService.get(id)
        if (data) {
            return response.status(200).json({ data: data });
        }
        return response.status(404).json({ message: "Jorunal Lines could not be found" });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

journalLineRouter.get("/filter", async (request: Request, response: Response) => {
    try {
        const { chartofAccountId, startDate, endDate } = request.query;

        // Parse the startDate, set it to midnight if provided, or use today's date
        const filterStartDate = startDate ? new Date(startDate as string) : new Date();
        filterStartDate.setHours(0, 0, 0, 0); // Set the time to the start of the day

        // Parse the endDate, set it to the end of the day if provided, or use today's date
        const filterEndDate = endDate ? new Date(endDate as string) : new Date();
        filterEndDate.setHours(23, 59, 59, 999); // Set the time to the end of the day

        // Log the parameters for debugging
        console.log(`Filtering journal lines for chartofAccountId=${chartofAccountId || "ALL"} between ${filterStartDate} and ${filterEndDate}`);

        // Validate the parsed dates
        if (isNaN(filterStartDate.getTime()) || isNaN(filterEndDate.getTime())) {
            return response.status(400).json({ message: "Invalid date format." });
        }

        // Fetch filtered journal lines from the service
        const journalLines = await jornalLineService.getByAccountAndDateRange(
            chartofAccountId ? (chartofAccountId as string) : null, 
            filterStartDate, 
            filterEndDate
        );

        // If no journal lines are found, return a 404
        if (!journalLines || journalLines.length === 0) {
            return response.status(404).json({ message: "No journal lines found for the specified criteria." });
        }

        // Return the filtered journal lines
        return response.status(200).json({ data: journalLines });
    } catch (error: any) {
        console.error("Error fetching journal lines:", error);
        return response.status(500).json({ message: "An error occurred while retrieving journal lines.", error: error.message });
    }
});

//POST
journalLineRouter.post("/", authenticate, async (request: ExpressRequest, response: Response) => {
    var data: any = request.body;
    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const userId = request.user.id;
        data = {
            ...data,
            createdBy: userId
        }
        const newbrand = await jornalLineService.create(data)

        if (newbrand) {
            return response.status(201).json({ message: "Jorunal Line Created Successfully", data: newbrand });
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

journalLineRouter.put("/:id", authenticate, async (request: ExpressRequest, response: Response) => {
    const id: any = request.params;
    const data: any = request.body;

    try {
        if (!request.user) {
            return response.status(401).json({ message: "User not authorized" });
        }
        const updateBrand = await jornalLineService.update(data, id)

        if (updateBrand) {
            return response.status(201).json({ message: "Jorunal Line Updated Successfully", data: updateBrand });
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

