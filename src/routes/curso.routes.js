import { Router } from "express";
const router = Router();
import { getCursos, getCurso, insertCursos, updateCurso, deleteCurso } from "../controllers/cursos.controller";

router.get("/getCursos", getCursos);
router.get("/getCurso/:id", getCurso);
router.post("/insertCurso", insertCursos);
router.put("/updateCurso/:id", updateCurso);
router.delete("/deleteCurso/:id", deleteCurso);

module.exports.routes = router;