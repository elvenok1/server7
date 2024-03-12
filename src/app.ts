import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from '@bot-whatsapp/bot';
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys';
import cors from 'cors';

const flowBienvenido = addKeyword('hola').addAnswer('soy el bot');

const main = async () => {
    const provider = createProvider(BaileysProvider);

    // Inicialización del servidor HTTP para el proveedor Baileys
    provider.initHttpServer(3002);

    // Manejador de la ruta '/send-message' para enviar mensajes
    provider.http?.server.post('/send-message', handleCtx(async (bot, req, res) => {
        const body = req.body
        const phone = req.body.phone;
        const message = req.body.message;
        const mediaUrl = req.body.mediaUrl;
       console.log(body)

        // Enviar el mensaje de WhatsApp con los datos recibidos
        await bot.sendMessage(phone, message, { media: mediaUrl });
        

        // Responder al cliente que la operación se realizó con éxito
        res.end('Mensaje enviado exitosamente');
    }));

    // Crear el bot con el flujo y proveedor especificado
    await createBot({
        flow: createFlow([flowBienvenido]),
        database: new MemoryDB(),
        provider
    });

    // Aplicar el middleware CORS al servidor HTTP
    provider.http?.server.use(cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Disposition'], // Aquí agregamos 'Content-Disposition' para permitir el envío de medios
        optionsSuccessStatus: 200
    }));

    console.log('Servidor iniciado en el puerto 3002');
}

// Llamar a la función principal para iniciar la aplicación
main();
