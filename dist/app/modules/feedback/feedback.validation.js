"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string({
            required_error: 'Feedback is required',
        }),
    }),
});
exports.FeedbackValidation = {
    create,
};
