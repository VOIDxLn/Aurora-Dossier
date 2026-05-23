import { useState } from 'react';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export function useGeneratedFileIa() {

    const [generatedFile, setGeneratedFile] = useState('');

    const generatePdf = async (textToPdf) => {
        if (!textToPdf) {
            console.log("No hay contenido para generar el PDF");
            return;
        }

        const htmlContent = `
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Documento Generado por Aurora AI</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333; line-height: 1.6; }
                        h1 { color: #2456ee; border-bottom: 2px solid #2456ee; padding-bottom: 10px; }
                        p { font-size: 14px; white-space: pre-wrap; }
                        .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 11px; color: #777; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Reporte de Análisis Aurora AI</h1>
                    <p>${textToPdf}</p>
                    <div class="footer">
                        <p>Documento generado automáticamente el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}</p>
                    </div>
                </body>
            </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
            });

            console.log("PDF Generado con éxito en: ", uri);
            await Sharing.shareAsync(uri);
        } catch (err) {
            console.log("ERROR, no se ha podido generar el pdf", err);
        }
    };

    return {
        generatedFile,
        setGeneratedFile,
        generatePdf
    };
}