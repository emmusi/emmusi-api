require('dotenv').config();
import supabase from '../database/database.js';
import { Mensajes } from './messages'

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // o usa otro proveedor (Outlook, Mailtrap, etc.)
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD, // usa un token seguro si es Gmail
    },
});

export const recordarCredenciales = async (req, res) => {
    const mailOptions = {
        from: 'EMMUSI',
        to: 'emmusi25@gmail.com',
        subject: 'recuperación de credenciales',
        html: `usuario: ${process.env.DATABASE_USER} <br> contraseña: ${process.env.DATABASE_PASSWORD}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return res.status(200).json({ message: 'Los credenciales han sido enviados a su correo'});
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Error al enviar los credenciales al correo' });
    }
}


export const validarCredenciales = async (req, res) => {

    try {
        const { usuario, password } = req.body;

        // Consultamos la base de datos para encontrar el usuario
        const { data: user, error } = await supabase
            .from('Usuarios') // Asegúrate de que la tabla se llama 'Usuarios'
            .select('usuario, password') // Traer solo los campos relevantes
            .eq('usuario', usuario)
            .single();; // Esperamos solo un usuario único
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ message: 'El usuario no existe' });
            }
            return res.status(400).json({ message: Mensajes(4) });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' }); // Credenciales incorrectas
        }

        return res.status(200).json({ message: 'Credenciales correctas' }); // Usuario autenticado exitosamente
    } catch (error) {
        res.status(500).json({ message: Mensajes(5) });
    }
};









