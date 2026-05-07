import express, { Express, Request, Response, Router } from "express";
const router: Router = express.Router();
const app: Express = express();

import Task from "../../../models/task.model";

const controller = require("../controllers/task.controller");

router.get("/", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });

  res.json(tasks);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const tasks = await Task.findOne({
    _id: id,
    deleted: false,
  });

  console.log(tasks);

  res.json(tasks);
});

export const taskRoutes: Router = router;
