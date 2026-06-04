import { useEffect, useState } from 'react';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { supabase } from '../../../lib/supabase';

import { readFileFormatAI } from '../UploadFiles/hooks/readFileFormatAI';
import { useGeneratedFileIa } from '../GeneratedFile/useGeneratedFileIa';

const PREGUNTAS = [
    { campo: 'titulo',       pregunta: 'Para comenzar, dame un titulo para este informe.' },
    { campo: 'actividad',    pregunta: 'Describe brevemente la actividad o evento a documentar.' },
    { campo: 'responsable',  pregunta: 'Quien realizo la actividad? (nombre o cargo)' },
    { campo: 'fecha',        pregunta: 'Selecciona la fecha del evento:', esFecha: true },
    { campo: 'detalles',     pregunta: 'Agrega los detalles, observaciones o resultados importantes.' },
];

const CAMPOS = ['titulo', 'actividad', 'responsable', 'fecha', 'detalles'];

export function useChatService() {

    const auroraIA = new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        temperature: 0.7,
    });

    const { generatePdf } = useGeneratedFileIa();
    const [lastAiResponse, setLastAiResponse] = useState('');
    const [userId, setUserId] = useState(null);

    const [etapa, setEtapa] = useState('inicio');
    const [etapaIndex, setEtapaIndex] = useState(0);
    const [datosInforme, setDatosInforme] = useState({
        titulo: '',
        actividad: '',
        responsable: '',
        fecha: '',
        detalles: '',
    });

    const [pront, setPront] = useState('');
    const [bubbleMessage, setBubbleMessage] = useState([{ value: '' }]);
    const [deleteTitle, setDeleteTitle] = useState(true);
    const [createChat, setCreateChat] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        getUser();

        setBubbleMessage([{
            author: 'ai',
            value: PREGUNTAS[0].pregunta,
            isPdfReport: false,
        }]);
        setDeleteTitle(false);
        setCreateChat(true);
    }, []);

    const send = async (fileInfo, setFileInfo) => {
        if (pront.trim() === '' && !fileInfo) return;

        if (fileInfo) {
            const currentPront = pront;
            setBubbleMessage(prev => [...prev, { author: 'user', value: currentPront }]);
            setPront('');
            if (setFileInfo) setFileInfo(null);

            try {
                console.log('📤 Enviando archivo a Aurora AI...');
                const formattedMessage = readFileFormatAI(currentPront, fileInfo);
                let answer = await auroraIA.invoke(formattedMessage);
                let aiMessage = answer.content;

                setLastAiResponse(aiMessage);
                setBubbleMessage(prev => [...prev, { author: 'ai', value: aiMessage, isPdfReport: true }]);

                const { data: { user } } = await supabase.auth.getUser();
                const currentUserId = user?.id || userId;
                if (currentUserId) {
                    await supabase.from('informes').insert({
                        user_id: currentUserId,
                        titulo: 'Informe ' + new Date().toLocaleDateString(),
                        informe_generado: aiMessage,
                        estado: 'completado',
                        created_at: new Date().toISOString(),
                    });
                }
                await generatePdf(aiMessage, currentUserId);
            } catch (err) {
                console.log('Error en la respuesta de Aurora AI', err);
            }
            return;
        }

        const respuestaUsuario = pront.trim();
        const campoActual = CAMPOS[etapaIndex];

        setBubbleMessage(prev => [...prev, { author: 'user', value: respuestaUsuario }]);
        setPront('');
        setDeleteTitle(false);
        setCreateChat(true);

        const nuevosDatos = { ...datosInforme, [campoActual]: respuestaUsuario };
        setDatosInforme(nuevosDatos);

        const siguienteIndex = etapaIndex + 1;

        if (siguienteIndex < PREGUNTAS.length) {
            setEtapaIndex(siguienteIndex);
            setTimeout(() => {
                const esFecha = CAMPOS[siguienteIndex] === 'fecha';
                setBubbleMessage(prev => [...prev, {
                    author: 'ai',
                    value: PREGUNTAS[siguienteIndex].pregunta,
                    isPdfReport: false,
                    isPicker: esFecha,
                }]);
            }, 500);
        } else {
            setBubbleMessage(prev => [...prev, {
                author: 'ai',
                value: 'Generando tu informe...',
                isPdfReport: false,
            }]);

            try {
                const prompt = `Genera un informe profesional estructurado con esta informacion.
NO incluyas frases introductorias como "Aqui tienes" o "A continuacion" o similares.
Comienza directamente con el informe.

Titulo: ${nuevosDatos.titulo}
Actividad: ${nuevosDatos.actividad}
Responsable: ${nuevosDatos.responsable}
Fecha: ${nuevosDatos.fecha}
Detalles: ${nuevosDatos.detalles}

El informe debe tener: encabezado, introduccion, desarrollo, observaciones y conclusion.
Usa un tono formal y profesional.
Comienza directamente con el encabezado del informe sin ningun texto previo.`;

                const respuesta = await auroraIA.invoke([{ role: 'user', content: prompt }]);
                const textoInforme = respuesta.content;

                setLastAiResponse(textoInforme);
                setBubbleMessage(prev => [...prev, {
                    author: 'ai',
                    value: textoInforme,
                    isPdfReport: true,
                }]);

                const { data: { user } } = await supabase.auth.getUser();
                const currentUserId = user?.id || userId;

                if (currentUserId) {
                    await supabase.from('informes').insert({
                        user_id: currentUserId,
                        titulo: nuevosDatos.titulo,
                        informe_generado: textoInforme,
                        estado: 'completado',
                        created_at: new Date().toISOString(),
                    });
                }

                await generatePdf(textoInforme, currentUserId);

            } catch (err) {
                console.log('Error generando informe:', err);
                setBubbleMessage(prev => [...prev, {
                    author: 'ai',
                    value: 'Ocurrio un error generando el informe. Intenta de nuevo.',
                    isPdfReport: false,
                }]);
            }
        }
    };

    const seleccionarFecha = (fecha) => {
        const nuevosDatos = { ...datosInforme, fecha };
        setDatosInforme(nuevosDatos);
        setBubbleMessage(prev => [...prev, { author: 'user', value: fecha }]);
        setEtapaIndex(4);
        setTimeout(() => {
            setBubbleMessage(prev => [...prev, {
                author: 'ai',
                value: PREGUNTAS[4].pregunta,
                isPdfReport: false,
            }]);
        }, 500);
    };

    return {
        pront,
        bubbleMessage,
        deleteTitle,
        createChat,
        lastAiResponse,
        setPront,
        send,
        seleccionarFecha,
        generatePdf: (text) => generatePdf(text, userId),
    };
}
