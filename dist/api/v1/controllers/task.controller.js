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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = __importDefault(require("../../../helpers/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
        };
        if (req.query.status) {
            find.status = req.query.status.toString();
        }
        const objectSearch = (0, search_1.default)(req.query);
        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }
        let initPagination = {
            currentPage: 1,
            limitItems: 2,
        };
        const countTasks = yield task_model_1.default.countDocuments(find);
        const objectPagination = (0, pagination_1.default)(initPagination, req.query, countTasks);
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toString();
            sort[sortKey] = req.query.sortValue;
        }
        const tasks = yield task_model_1.default.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip || 0);
        res.json(tasks);
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Có lỗi xảy ra",
        });
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tasks = yield task_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!tasks) {
            return res.status(404).json({ message: "Không tìm thấy công việc này" });
        }
        res.json(tasks);
    }
    catch (error) {
        res.json({
            code: 400,
            message: "ID không hợp lệ hoặc có lỗi xảy ra",
        });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({
            _id: id,
        }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công",
        });
    }
    catch (error) {
        console.error("Lỗi changeStatus:", error);
        res.json({
            code: 400,
            message: "ID không hợp lệ hoặc có lỗi xảy ra",
        });
    }
});
exports.changeStatus = changeStatus;
var changeMultiTask;
(function (changeMultiTask) {
    changeMultiTask["STATUS"] = "status";
    changeMultiTask["DELETE"] = "delete";
})(changeMultiTask || (changeMultiTask = {}));
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case changeMultiTask.STATUS:
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công",
                });
                break;
            case changeMultiTask.DELETE:
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
                res.json({
                    code: 200,
                    message: "Xóa công việc thành công",
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại trường cần cập nhật",
                });
                break;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Có lỗi xảy ra",
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 200,
            message: "Thêm mới thành công",
            data: data,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Có lỗi xảy ra",
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id,
        }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật công việc thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Có lỗi xảy ra",
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id,
        }, {
            deleted: true,
            deletedAt: new Date(),
        });
        res.json({
            code: 200,
            message: "Xóa công việc thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy công việc này hoặc có lỗi xảy ra",
        });
    }
});
exports.deleteTask = deleteTask;
