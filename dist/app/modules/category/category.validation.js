"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategory = zod_1.z.object({
    category: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        information: zod_1.z.array(zod_1.z.string({
            required_error: 'Information is required',
        }), {
            required_error: 'Information are required',
        }),
    }),
});
const updateCategory = zod_1.z.object({
    category: zod_1.z.object({
        title: zod_1.z.string().optional(),
        information: zod_1.z
            .array(zod_1.z.string({
            required_error: 'Information is required',
        }))
            .optional(),
    }),
});
exports.CategoryValidation = {
    updateCategory,
    createCategory,
};
