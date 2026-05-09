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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const generate_1 = __importDefault(require("../../../helpers/generate"));
const md5_1 = __importDefault(require("md5"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.json({
                code: 400,
                message: "Vui lòng nhập đầy đủ email và mật khẩu",
            });
        }
        req.body.password = (0, md5_1.default)(req.body.password);
        const existEmail = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false,
        });
        if (existEmail) {
            return res.json({
                code: 400,
                message: "Email đã tồn tại",
            });
        }
        else {
            const user = new user_model_1.default({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                token: generate_1.default.generateRandomString(30),
            });
            yield user.save();
            const token = user.token;
            res.cookie("token", token);
            res.json({
                code: 200,
                message: "Đăng ký thành công",
                token: token,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.json({
                code: 400,
                message: "Vui lòng nhập đầy đủ email và mật khẩu",
            });
        }
        const email = req.body.email;
        const password = (0, md5_1.default)(req.body.password);
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: false,
        });
        if (!user) {
            return res.json({
                code: 400,
                message: "Email không tồn tại",
            });
        }
        if (password !== user.password) {
            return res.json({
                code: 400,
                message: "Mật khẩu không đúng",
            });
        }
        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Đăng nhập thành công",
            token: token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            code: 200,
            message: "Lấy thông tin người dùng thành công",
            info: req.user,
        });
    }
    catch (error) {
        res.json({
            code: 500,
            message: "Lỗi server",
        });
    }
});
exports.detail = detail;
