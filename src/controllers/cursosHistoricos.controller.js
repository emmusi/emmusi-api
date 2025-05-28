import supabase from '../database/database.js';
import { Mensajes } from './messages.js'

export const getCursosHistoricos = async (req, res) => {
    try {
        // throw new Error("Simulación de fallo en el método");
        const { id } = req.params;
        // Se obtienen los registros desde la base de datos
        const { data: cursosHistoricos, error } = await supabase
            .from('CursosHistoricos')
            .select(`id, idEstudiante, curso, ciclo, nota, estado`).eq('idEstudiante', id);

        if (error) {
            // Si ocurre un error al llamar al servidor, devuelve el mensaje 4
            return res.status(500).json({ message: Mensajes(4) });
        }

        if (cursosHistoricos && cursosHistoricos.length > 0) {
            // Si hay registros, se retornan
            res.status(200).json(cursosHistoricos);
        } else {
            // Si no se encontraron registros, devuelve el mensaje 2
            res.status(404).json({ message: Mensajes(2, "Cursos historicos") });
        }

    } catch (error) {
        // Si el método falla devuelve el mensaje 5
        res.status(500).json({ message: Mensajes(5) });
    }
};


export const insertCursoHistorico = async (req, res) => {
    try {
        // throw new Error("Simulación de fallo en el método");
        // Crea el curso histrico
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: Mensajes(1) });
        }

        const { error } = await supabase.rpc('InsertarCursoHistorico', { _id: id });

        if (error) {
            if (error.code === '23502') {
                return res.status(400).json({ message: 'Este curso aun no tiene una nota asignada' });
            }
            // Si ocurre un error al llamar al servidor, devuelve el mensaje 4
            return res.status(400).json({ message: Mensajes(4) });
        }
        res.status(200).json({ message: Mensajes(3) });
    } catch (error) {


        res.status(500).json({ message: Mensajes(5) });
    }
};








