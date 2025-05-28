import { Router } from "express";
const router = Router();
import { validarCredenciales, recordarCredenciales } from "../controllers/usuarios.controller";

router.post("/validarCredenciales", validarCredenciales);
router.get("/recordarCredenciales", recordarCredenciales);


module.exports.routes = router;