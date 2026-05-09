"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (objectPagination, query, countRecord) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        objectPagination.limitItems = parseInt(query.limit);
    }
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;
    const totalPage = Math.ceil(countRecord / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.default = paginationHelper;
