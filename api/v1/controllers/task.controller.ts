import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index = async (req: Request, res: Response) => {
  try {
    //Find
    interface Find {
      deleted: boolean;
      status?: string;
      title?: RegExp;
    }

    const find: Find = {
      deleted: false,
    };

    if (req.query.status) {
      find.status = req.query.status.toString();
    }

    //Search
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    //pagination
    let initPagination = {
      currentPage: 1,
      limitItems: 2,
    };

    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countTasks,
    );

    //Sort
    const sort: any = {};

    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      sort[sortKey] = req.query.sortValue;
    }

    const tasks = await Task.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip || 0);

    res.json(tasks);
  } catch (error) {
    res.json({
      code: 400,
      message: "Có lỗi xảy ra",
    });
  }
};

//[GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const tasks = await Task.findOne({
      _id: id,
      deleted: false,
    });

    if (!tasks) {
      return res.status(404).json({ message: "Không tìm thấy công việc này" });
    }
    res.json(tasks);
  } catch (error) {
    res.json({
      code: 400,
      message: "ID không hợp lệ hoặc có lỗi xảy ra",
    });
  }
};

//[PATCH] /api/v1/tasks/status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id as string;
    const status: string = req.body.status;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      },
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    console.error("Lỗi changeStatus:", error);
    res.json({
      code: 400,
      message: "ID không hợp lệ hoặc có lỗi xảy ra",
    });
  }
};
