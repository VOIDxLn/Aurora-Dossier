import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const createClient = () =>
    new ChatGoogleGenerativeAI({
        model:       'gemini-2.5-flash',
        apiKey:      process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        temperature: 0.7,
    });

export const aiService = {
    invokeWithFile(prompt, fileInfo) {
        const client = createClient();
        const content = [
            { type: 'media', mimeType: fileInfo.mimeType, data: fileInfo.base64 },
            { type: 'text',  text: prompt?.trim() || 'Analiza este documento de forma detallada.' },
        ];
        return client.invoke([{ role: 'user', content }]);
    },

    generateReport(reportData) {
        const client = createClient();
        const prompt = `Genera un informe profesional estructurado con esta informacion.
NO incluyas frases introductorias como "Aqui tienes" o "A continuacion" o similares.
Comienza directamente con el informe.

Titulo: ${reportData.titulo}
Actividad: ${reportData.actividad}
Responsable: ${reportData.responsable}
Fecha: ${reportData.fecha}
Detalles: ${reportData.detalles}

El informe debe tener: encabezado, introduccion, desarrollo, observaciones y conclusion.
Usa un tono formal y profesional.
Comienza directamente con el encabezado del informe sin ningun texto previo.`;

        return client.invoke([{ role: 'user', content: prompt }]);
    },
};
