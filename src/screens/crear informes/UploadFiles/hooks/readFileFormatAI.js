/**
 * Builds the LangChain message payload for a file-based AI request.
 * Pure function — no side effects.
 */
export function readFileFormatAI(prompt, fileInfo) {
    if (!fileInfo?.base64) {
        return [{ role: 'user', content: prompt }];
    }

    return [
        {
            role: 'user',
            content: [
                { type: 'media', mimeType: fileInfo.mimeType, data: fileInfo.base64 },
                { type: 'text',  text: prompt?.trim() || 'Analiza este documento de forma detallada.' },
            ],
        },
    ];
}
