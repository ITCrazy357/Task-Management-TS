import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.headers.authorization) {
    res.json({
      code: 400,
      message: "Vui lòng gửi token trong header Authorization",
    });
    return;
  } else {
    const token = req.headers.authorization.split(" ")[1];

    const user = await User.findOne({
      token: token,
      deleted: false,
    }).select("-password -__v -deleted -token  ");

    if (!user) {
      res.json({
        code: 400,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
      return;
    }
    req.user = user;
  }
  next();
};
