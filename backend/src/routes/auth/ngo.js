// NGO authentication routes
import express from "express";
import { ngoRegister, ngoLogin } from "../../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/ngo/register - NGO Registration
router.post("/register", ngoRegister);

// POST /api/auth/ngo/login - NGO Login
router.post("/login", ngoLogin);

export default router;
