import { db } from "../../utils/db.server";
import { hash } from "bcrypt"


export const getlist = async () => {
    return db.user.findMany({
    });
}

export const get = async (id: any) => {
    return db.user.findUnique({
        where: {
            id,
        }

    });
}

export const getbyRole = async (role: any) => {
    return db.user.findMany({
        where: {
            role: role,
        }
    });
}

export const login = async (username: any) => {
    return db.user.findUnique({
        where: {
            username,
        }
    });
}

export const create = async (userData: any) => {
    const hashedPassword = await hash(userData.password, 10);
    return db.user.create({
        data: { ...userData, password: hashedPassword }

    });
}

export const update = async (userData: any, id: any) => {
    return db.user.update({
        where: id,
        data: {
            name: userData.name,
            nic: userData.nic,
            phoneNumber: userData.phoneNumber,
            dateofbirth: userData.dateofbirth,
            target: userData.target,
            role: userData.role,
            address: userData.address,
        }
    });
}

export const getAllCompanyDetails = async () => {
    return db.companyDetails.findFirst({
        where: {
            companyName: 'HITECH (PVT) LTD'
        }
    });
};