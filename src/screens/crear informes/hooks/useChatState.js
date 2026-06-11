import { useState } from 'react';
import { EMPTY_REPORT_DATA } from '../../../constants/reportQuestions';

export function useChatState() {
    const [bubbleMessage,        setBubbleMessage]        = useState([]);
    const [pront,                setPront]                = useState('');
    const [etapaIndex,           setEtapaIndex]           = useState(0);
    const [datosInforme,         setDatosInforme]         = useState(EMPTY_REPORT_DATA);
    const [deleteTitle,          setDeleteTitle]          = useState(true);
    const [createChat,           setCreateChat]           = useState(false);
    const [deleteLoadingMessage, setDeleteLoadingMessage] = useState(false);
    const [lastAiResponse,       setLastAiResponse]       = useState('');

    const appendMessage = (msg) =>
        setBubbleMessage(prev => [...prev, msg]);

    const replaceLastMessage = (msg) =>
        setBubbleMessage(prev => [...prev.slice(0, -1), msg]);

    const appendLoadingThenReplace = (userMsg, loadingNode) => {
        setBubbleMessage(prev => [...prev, userMsg, { author: 'ai', value: loadingNode }]);
    };

    const updateReportField = (campo, valor) => {
        const next = { ...datosInforme, [campo]: valor };
        setDatosInforme(next);
        return next;
    };

    return {
        bubbleMessage, pront, etapaIndex, datosInforme,
        deleteTitle, createChat, deleteLoadingMessage, lastAiResponse,
        setBubbleMessage, setPront, setEtapaIndex, setDatosInforme,
        setDeleteTitle, setCreateChat, setDeleteLoadingMessage, setLastAiResponse,
        appendMessage, replaceLastMessage, appendLoadingThenReplace, updateReportField,
    };
}
