import { useState } from 'react';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

import { readFileFormatAI } from '../UploadFiles/hooks/readFileFormatAI';
import { useGeneratedFileIa } from '../GeneratedFile/useGeneratedFileIa';

export function useChatService() {

    const auroraIA = new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        temperature: 0.7,
    })

    const { generatePdf } = useGeneratedFileIa();
    const [lastAiResponse, setLastAiResponse] = useState("");

    // Pront message chat 
    const [pront, setPront] = useState("");
    const [bubbleMessage, setBubbleMessage] = useState([{ value: "" }]);
    const [deleteTitle, setDeleteTitle] = useState(true);
    const [createChat, setCreateChat] = useState(false);

    const send = async (fileInfo, setFileInfo) => {


        if (pront.trim() === "" && !fileInfo) {
            return;
        }

        const message = { author: 'user', messageText: pront };

        const currentPront = message.messageText;

        setBubbleMessage(prevMessage => [
            ...prevMessage,
            { author: 'user', value: message.messageText }
        ]);

        try {
            console.log("🚀 Generando formato estructurado...");

            const formattedMessage = readFileFormatAI(currentPront, fileInfo);
            const weHadFile = !!fileInfo;

            setPront("");
            if (setFileInfo) setFileInfo(null);
            setDeleteTitle(false);
            setCreateChat(true);

            console.log("📤 Enviando payload a Aurora AI...");

            let answer = await auroraIA.invoke(formattedMessage);
            let aiMessage = answer.content;
            const answerMessage = { author: 'ai', aiText: aiMessage }

            setLastAiResponse(answerMessage.aiText); 

            setBubbleMessage(prevMessage => [
                ...prevMessage,
                { author: 'ai', value: answerMessage.aiText, isPdfReport: weHadFile }
            ]);

            console.log(answerMessage.aiText)

            if(weHadFile){
                console.log("Generando reporte PDF del documento Analizado...");
                await generatePdf(answerMessage.aiText);
            }
        } catch (err) {
            console.log("Error en la respuesta de Aurora AI", err);
        }

    }

    return {
        pront,
        bubbleMessage,
        deleteTitle,
        createChat,
        lastAiResponse,
        setPront,
        send,
        generatePdf
    }
}