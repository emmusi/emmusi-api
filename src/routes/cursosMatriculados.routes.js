import { Router } from "express";
const router = Router();
import { getCursosMatriculados, insertCursoMatriculado, deleteCursoMatriculado, getAusencias, agregarNota, updateAusencias } from "../controllers/cursosMatriculados.controller";

router.get("/getCursosMatriculados/:id", getCursosMatriculados);
router.post("/insertCursoMatriculado", insertCursoMatriculado);
router.delete("/deleteCursoMatriculado/:id", deleteCursoMatriculado);
router.get("/getAusencias/:id", getAusencias);
router.put("/agregarNota/:id", agregarNota);
router.put("/updateAusencias/:id", updateAusencias);


module.exports.routes = router;