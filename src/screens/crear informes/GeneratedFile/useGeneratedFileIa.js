import { pdfService }    from '../../../services/pdfService';
import { reportService } from '../../../services/reportService';

/**
 * Thin adapter kept for backwards compatibility with CrearInformeScreen.
 * All PDF/report logic lives in pdfService and reportService.
 */
export function useGeneratedFileIa() {
    const generatePdf = async (text, userId) => {
        if (!text) return;
        try {
            await reportService.save(userId, 'Informe ' + new Date().toLocaleDateString(), text);
            await pdfService.generateAndShare(text);
        } catch (err) {
            console.error('useGeneratedFileIa.generatePdf:', err);
        }
    };

    return { generatePdf };
}
