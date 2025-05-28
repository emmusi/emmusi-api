import { Router } from "express";
const router = Router();
import { getCursosHistoricos, insertCursoHistorico } from "../controllers/cursosHistoricos.controller";

router.get("/getCursosHistoricos/:id", getCursosHistoricos);
router.post("/insertCursoHistorico/:id", insertCursoHistorico);


module.exports.routes = router;