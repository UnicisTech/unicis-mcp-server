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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = getClient;
exports.apiGet = apiGet;
exports.apiPost = apiPost;
exports.apiPut = apiPut;
exports.apiPostMultipart = apiPostMultipart;
exports.apiDelete = apiDelete;
exports.stripHtml = stripHtml;
exports.formatDate = formatDate;
const axios_1 = __importStar(require("axios"));
let client = null;
function getClient() {
    if (!client) {
        const baseURL = process.env.API_BASE_URL;
        const token = process.env.API_BEARER_TOKEN;
        if (!baseURL)
            throw new Error("API_BASE_URL environment variable is required");
        if (!token)
            throw new Error("API_BEARER_TOKEN environment variable is required");
        client = axios_1.default.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            timeout: 15000,
        });
    }
    return client;
}
async function apiGet(path) {
    try {
        const res = await getClient().get(path);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.data;
    }
    catch (err) {
        throw formatError(err);
    }
}
async function apiPost(path, body) {
    try {
        const res = await getClient().post(path, body);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.data;
    }
    catch (err) {
        throw formatError(err);
    }
}
async function apiPut(path, body) {
    try {
        const res = await getClient().put(path, body);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.data;
    }
    catch (err) {
        throw formatError(err);
    }
}
async function apiPostMultipart(path, formData) {
    try {
        const res = await getClient().post(path, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.data;
    }
    catch (err) {
        throw formatError(err);
    }
}
async function apiDelete(path) {
    try {
        const res = await getClient().delete(path);
        if (res.data.error)
            throw new Error(res.data.error.message);
        return res.data.data;
    }
    catch (err) {
        throw formatError(err);
    }
}
function formatError(err) {
    if (err instanceof axios_1.AxiosError) {
        const status = err.response?.status;
        const message = err.response?.data?.error?.message || err.message;
        if (status === 401)
            return new Error("Unauthorized: Check your API_BEARER_TOKEN");
        if (status === 403)
            return new Error("Forbidden: Insufficient permissions for this action");
        if (status === 404)
            return new Error("Not found: The requested resource does not exist");
        return new Error(`API error ${status}: ${message}`);
    }
    if (err instanceof Error)
        return err;
    return new Error(String(err));
}
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}
function formatDate(dateStr) {
    if (!dateStr)
        return "No due date";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}
