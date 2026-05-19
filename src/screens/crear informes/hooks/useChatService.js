import { useState, useEffect, useRef } from 'react';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export function useChatService() {

    const auroraIA = new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        temperature: 0.7,
    })

    // Pront message chat 
    const [pront, setPront] = useState("");
    const [bubbleMessage, setBubbleMessage] = useState([{ value: "" }]);
    const [deleteTitle, setDeleteTitle] = useState(true);
    const [createChat, setCreateChat] = useState(false);

    const send = async () => {

        if (pront.trim() === "") {
            return;
        }

        const message = { author: 'user', messageText: pront };

        setBubbleMessage(prevMessage => [
            ...prevMessage,
            { author: 'user', value: message.messageText }
        ]);

        setPront("");
        setDeleteTitle(false);
        setCreateChat(true);

        try {
            let answer = await auroraIA.invoke(message.messageText);
            let aiMessage = answer.content;
            const answerMessage = { author: 'ai', aiText: aiMessage }

            setBubbleMessage(prevMessage => [
                ...prevMessage,
                { author: 'ai', value: answerMessage.aiText }
            ]);

            console.log(answerMessage)
        } catch(err) {
            console.log("Error en la respuesta de Aurora AI", err);
        }

    }

    return {
        pront,
        bubbleMessage,
        deleteTitle,
        createChat,
        setPront,
        send
    }
}