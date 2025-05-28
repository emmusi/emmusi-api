import supabase from '../database/database.js';
import { Mensajes } from './messages.js'

export const getCursosMatriculados = async (req, res) => {
    try {
        // throw new Error("Simulación de fallo en el método");
        const { id } = req.params;
        // Se obtienen los registros desde la base de datos
        const { data: cursosMatriculados, error } = await supabase
            .from('CursosMatriculados')
            .select(`id, Cursos ( nombre ), Horarios (dia, horaInicio, horaFin, Profesores ( nombre )), ciclo, nota`).eq('idEstudiante', id);

        if (error) {
            // Si ocurre un error al llamar al servidor, devuelve el mensaje 4
            return res.status(500).json({ message: Mensajes(4) });
        }

        if (cursosMatriculados && cursosMatriculados.length > 0) {
            const datosFormateados = cursosMatriculados.map(cm => {
                const tieneNotaEspecial = cm.nota && cm.nota.trim() !== "";

                return {
                    id: cm.id,
                    curso: cm.Cursos.nombre,
                    horario: tieneNotaEspecial
                        ? cm.nota
                        : `${cm.Horarios.dia} ${cm.Horarios.horaInicio}-${cm.Horarios.horaFin}`,
                    profesor: tieneNotaEspecial
                        ? ""
                        : cm.Horarios.Profesores.nombre,
                    ciclo: cm.ciclo,
                };
            });

            // Si hay registros, se retornan
            res.status(200).json(datosFormateados);
        } else {
            // Si no se encontraron registros, devuelve el mensaje 2
             res.status(404).json({ message: Mensajes(2, "cursos matriculados") });
        }

    } catch (error) {
        // Si el método falla devuelve el mensaje 5
        res.status(500).json({ message: Mensajes(5) });
    }
};

export const insertCursoMatriculado = async (req, res) => {
    try {
        // throw new Error("Simulación de fallo en el método");
        // Crea el curso matriculado
        const { idEstudiante, idCurso, idHorario, ciclo, nota } = req.body;
        const cursoMatriculado = { idEstudiante, idCurso, idHorario, ciclo, nota, estado: "", justificadas: 0, injustificadas: 0 };

        if (nota === "Retiro Justificado" || nota === "No Oferta") {
            cursoMatriculado.estado = "Reprobado";
        } else {
            cursoMatriculado.nota = null;
        }

        // Validación de campos requeridos
        if (!cursoMatriculado.idEstudiante || !cursoMatriculado.idCurso || !cursoMatriculado.idHorario || !cursoMatriculado.ciclo) {
            return res.status(400).json({ message: Mensajes(1) });
        }

        // Se registra el curso matriculado en la base de datos
        const { data, error } = await supabase.from('CursosMatriculados').insert([cursoMatriculado]);

        if (error) {
            res.status(400).json({ message: Mensajes(4) });
        } else {
            // Si el registro es exitoso, devuelve el mensaje 3
            res.status(201).json({ message: Mensajes(3) });
        }
    } catch (error) {
        res.status(500).json({ message: Mensajes(5) });
    }
};



export const deleteCursoMatriculado = async (req, res) => {
    try {
        // throw new Error("Simulación de fallo en el método");
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: Mensajes(1) });
        }

        // Se elimina el registro de la base de datos
        const { data, error } = await supabase
            .from('CursosMatriculados')
            .delete()
            .eq('id', id).select(); // Eliminar basado en el id

        if (error) {
            return res.status(500).json({ message: Mensajes(4) });
        }

        if (data.length > 0) {
            return res.status(200).json({ message: Mensajes(3) });
        } else {
            return res.status(404).json({ message: Mensajes(8, "curso matriculado") });
        }

    } catch (error) {
        res.status(500).json({ message: Mensajes(5) });
    }
};



export const getAusencias = async (req, res) => {
    try {
        const { id } = req.params;

        // Se obtienen los registros de ausencias de un estudiante
        const { data: ausencias, error } = await supabase
            .from('CursosMatriculados')
            .select(`id, Cursos ( nombre ), ciclo, nota, justificadas, injustificadas`).eq('idEstudiante', id);

        if (error) {
            return res.status(400).json({ message: Mensajes(4) });
        }

        if (ausencias && ausencias.length > 0) {

            // Se formatean los datos para mostrarlos al usuario
            const datosFormateados = ausencias.map(cal => ({
                id: cal.id,
                curso: cal.Cursos.nombre,
                ciclo: cal.ciclo,
                nota: cal.nota,
                justificadas: cal.justificadas,
                injustificadas: cal.injustificadas
            }));
            // Se devuelven los datos formateados
             res.status(200).json(datosFormateados);
        } else {
            // Si no se encontraron registros, se devuelve el mensaje 2
            res.status(404).json({ message: Mensajes(2) });
        }
    } catch (error) {
        res.status(500).json({ message: Mensajes(5) });
    }
};

export const agregarNota = async (req, res) => {
    try {
        // throw new Error("Simulación de fallo en el método");
        const { id } = req.params;
        const { nota } = req.body;
        let estado = "Reprobado";

        // Validación básica
        if (!id || !nota) {
            return res.status(400).json({ message: Mensajes(1) });
        }

        if (!isNaN(nota) && Number(nota) >= 70 && Number(nota) <= 100) {
            estado = "Aprobado";
        } else if (["Retiro Justificado", "No Oferta"].includes(nota.trim())) {
            estado = "Reprobado";
        }

        // Se actualiza solo la nota en la base de datos
        const { data, error } = await supabase.from('CursosMatriculados')
            .update({ nota, estado })
            .eq('id', id)
            .select(); // Agregamos .select() para obtener los registros afectados

        if (error) {
            return res.status(400).json({ message: Mensajes(4) });
        }

        if (data.length > 0) {
            return res.status(200).json({ message: Mensajes(3) });
        } else {
            return res.status(404).json({ message: Mensajes(7, "curso matriculado") });
        }

    } catch (error) {
        res.status(500).json({ message: Mensajes(5) });
    }
};

export const updateAusencias = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { justificadas, injustificadas } = req.body;

        if (!id || isNaN(justificadas) || isNaN(injustificadas)) {
            return res.status(400).json({ message: Mensajes(1) });
        }

        // Se actualiza el registro en la base de datos
        const { data, error } = await supabase
            .from('CursosMatriculados')
            .update({ justificadas, injustificadas })
            .eq('id', id)
            .select(); // Agregamos .select() para obtener los registros afectados

        if (error) {
            return res.status(400).json({ message: Mensajes(4) });
        }

        if (data.length > 0) {
            return res.status(200).json({ message: Mensajes(3) });
        } else {
            return res.status(404).json({ message: Mensajes(7, "curso matriculado") });
        }

    } catch (error) {

        res.status(500).json({ message: Mensajes(5) });
    }
};







