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
exports.update = exports.create = exports.getbyGroup = exports.get = exports.list = void 0;
const db_server_1 = require("../../utils/db.server");
const list = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.party.findMany({
        include: {
            user: {
                select: {
                    name: true
                }
            },
            partyCategory: {
                select: {
                    category: true
                }
            },
        }
    });
});
exports.list = list;
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.party.findUnique({
        where: {
            id,
        },
    });
});
exports.get = get;
const getbyGroup = (id, condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.party.findMany({
        where: {
            partyGroupId: id,
            isVerified: condition
        },
        include: {
            partyCategory: {
                select: {
                    category: true
                }
            },
            user: {
                select: {
                    name: true, // Original name
                },
                // Change 'name' to 'userName' in the result
                // You can map the result afterwards to create the desired structure.
            },
        }
    }).then(parties => {
        return parties.map(party => {
            var _a;
            return (Object.assign(Object.assign({}, party), { userName: (_a = party.user) === null || _a === void 0 ? void 0 : _a.name, user: undefined // Optionally remove the original user object if not needed
             }));
        });
    });
});
exports.getbyGroup = getbyGroup;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.party.create({
        data: data
    });
});
exports.create = create;
const update = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_server_1.db.party.update({
        where: id,
        data: data,
        include: {
            partyCategory: {
                select: {
                    category: true
                }
            }
        }
    });
});
exports.update = update;
