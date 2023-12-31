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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = require("../../../shared/prisma");
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findMany();
    const users = result.map(user => {
        // eslint-disable-next-line no-unused-vars
        const { password } = user, userInfo = __rest(user, ["password"]);
        return userInfo;
    });
    return users;
});
const getDataById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    // eslint-disable-next-line no-unused-vars
    const { password } = result, userInfo = __rest(result, ["password"]);
    return userInfo;
});
const updateData = (userId, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist');
    }
    const updateData = {
        name: payload.name || isUserExist.name,
        phone: payload.phone || isUserExist.phone,
        address: payload.address || isUserExist.address,
    };
    yield prisma_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: updateData,
    });
    return updateData;
});
const deleteData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const result = yield prisma_1.prisma.user.delete({
        where: {
            id: userId,
        },
    });
    // eslint-disable-next-line no-unused-vars
    const { password } = result, deletedUserInfo = __rest(result, ["password"]);
    return deletedUserInfo;
});
const updateUserRole = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield prisma_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role: role,
        },
    });
});
const addNewAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.prisma.user.findFirst({
        where: {
            email: payload.email,
        },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
    }
    payload.role = client_1.UserRole.admin;
    payload.password = bcryptjs_1.default.hashSync(payload.password, 12);
    const result = yield prisma_1.prisma.user.create({
        data: payload,
    });
    // eslint-disable-next-line no-unused-vars
    const { password } = result, userInfo = __rest(result, ["password"]);
    return userInfo;
});
exports.AdminService = {
    getAllFromDB,
    getDataById,
    updateData,
    deleteData,
    updateUserRole,
    addNewAdmin,
};
