import { useEffect, useState }  from 'react';
import LottieView               from 'lottie-react-native';

import { authService }   from '../../../services/authService';
import { aiService }     from '../../../services/aiService';
import { pdfService }    from '../../../services/pdfService';
import { reportService } from '../../../services/reportService';

import { REPORT_QUESTIONS, REPORT_FIELDS } from '../../../constants/reportQuestions';
import { useChatState }  from './useChatState';

const LOADING_NODE = (
    <LottieView
        source={require('../../../../assets/loading-message.json')}
        autoPlay
        loop
        style={{ width: 40, height: 20, transform: [{ scale: 3 }] }}
        renderMode=""
    />
);

export function useChatService() {
    const [userId, setUserId] = useState(null);
    const state = useChatState();

    useEffect(() => {
        authService.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id);
        });
        state.setCreateChat(true);
    }, []);

    const generateAndSavePdf = async (texto, uid, titulo) => {
        await reportService.save(uid, titulo, texto);
        await pdfService.generateAndShare(texto);
    };

    const sendWithFile = async (fileInfo, setFileInfo) => {
        const currentPront = state.pront;
        state.appendLoadingThenReplace({ author: 'user', value: currentPront }, LOADING_NODE);
        state.setPront('');
        if (setFileInfo) setFileInfo(null);

        try {
            const answer    = await aiService.invokeWithFile(currentPront, fileInfo);
            const aiMessage = answer.content;
            state.setLastAiResponse(aiMessage);
            state.replaceLastMessage({ author: 'ai', value: aiMessage, isPdfReport: true });

            const { data: { user } } = await authService.getUser();
            const uid = user?.id || userId;
            await generateAndSavePdf(aiMessage, uid, 'Informe ' + new Date().toLocaleDateString());
        } catch (err) {
            console.error('useChatService.sendWithFile:', err);
            state.replaceLastMessage({ author: 'ai', value: 'Ocurrio un error. Intenta de nuevo.', isPdfReport: false });
        }
    };

    const sendConversational = async () => {
        const respuestaUsuario = state.pront.trim();
        const campoActual      = REPORT_FIELDS[state.etapaIndex];

        state.appendLoadingThenReplace({ author: 'user', value: respuestaUsuario }, LOADING_NODE);
        state.setPront('');
        state.setDeleteTitle(false);
        state.setCreateChat(true);

        const nuevosDatos     = state.updateReportField(campoActual, respuestaUsuario);
        const siguienteIndex  = state.etapaIndex + 1;

        if (siguienteIndex < REPORT_QUESTIONS.length) {
            state.setEtapaIndex(siguienteIndex);
            setTimeout(() => {
                const esFecha = REPORT_FIELDS[siguienteIndex] === 'fecha';
                state.replaceLastMessage({
                    author: 'ai',
                    value:  REPORT_QUESTIONS[siguienteIndex].pregunta,
                    isPdfReport: false,
                    isPicker: esFecha,
                });
            }, 500);
            return;
        }

        setTimeout(() => {
            state.replaceLastMessage({ author: 'ai', value: 'Generando tu informe...', isPdfReport: false });
        }, 500);

        try {
            const iaResponse = await aiService.generateReport(nuevosDatos);
            const texto      = iaResponse.content;

            state.setLastAiResponse(texto);
            state.appendMessage({ author: 'ai', value: texto, isPdfReport: true });

            const { data: { user } } = await authService.getUser();
            const uid = user?.id || userId;
            await generateAndSavePdf(texto, uid, nuevosDatos.titulo);
        } catch (err) {
            console.error('useChatService.sendConversational:', err);
            state.appendMessage({ author: 'ai', value: 'Ocurrio un error generando el informe. Intenta de nuevo.', isPdfReport: false });
        }
    };

    const send = async (fileInfo, setFileInfo) => {
        if (state.pront.trim() === '' && !fileInfo) return;
        if (fileInfo) return sendWithFile(fileInfo, setFileInfo);
        return sendConversational();
    };

    const seleccionarFecha = (fecha) => {
        state.updateReportField('fecha', fecha);
        state.appendMessage({ author: 'user', value: fecha });
        state.setEtapaIndex(4);
        setTimeout(() => {
            state.appendMessage({ author: 'ai', value: REPORT_QUESTIONS[4].pregunta, isPdfReport: false });
        }, 500);
    };

    return {
        pront:                state.pront,
        bubbleMessage:        state.bubbleMessage,
        deleteTitle:          state.deleteTitle,
        createChat:           state.createChat,
        lastAiResponse:       state.lastAiResponse,
        deleteLoadingMessage: state.deleteLoadingMessage,
        setDeleteLoadingMessage: state.setDeleteLoadingMessage,
        setPront:             state.setPront,
        send,
        seleccionarFecha,
        generatePdf:          (text) => pdfService.generateAndShare(text),
    };
}
