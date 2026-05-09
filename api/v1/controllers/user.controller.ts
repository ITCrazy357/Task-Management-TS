import User from "../models/user.model";
import { Request, Response } from "express";
import generateHelper from "../../../helpers/generate";
import md5 from "md5";

//[POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
  try {
    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (existEmail) {
      return res.json({
        code: 400,
        message: "Email đã tồn tại",
      });
    } else {
      const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        token: generateHelper.generateRandomString(30),
      });
      await user.save();

      const token = user.token;
      res.cookie("token", token);

      res.json({
        code: 200,
        message: "Đăng ký thành công",
        token: token,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

//[POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

//[GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: "Lấy thông tin người dùng thành công",
      info: req.user,
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
