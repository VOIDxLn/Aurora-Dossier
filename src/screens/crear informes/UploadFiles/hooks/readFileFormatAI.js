export function readFileFormatAI(pront, fileInfo) {

    const contentArray = [];

    if (!fileInfo || !fileInfo.base64) {
        return [
            {
                role: 'user',
                content: pront
            }
        ]
    };


    return [
        {
            role: 'user',
            content: [
                {
                    type: "media",
                    mimeType: fileInfo.mimeType,
                    data: fileInfo.base64,
                },
                {
                    type: "text",
                    text: pront && pront.trim() !== "" ? pront : "Analiza este documento de forma detallada."
                }

            ]
        }
    ]
}