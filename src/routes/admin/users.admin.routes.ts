import express from "express";
import {
  getAllUsers,
  impersonateUser,
} from "../../controller/admin/users.admin.controller";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/impersonate/:userId", impersonateUser);

export default router;
