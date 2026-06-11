import * as Print   from 'expo-print';
import * as Sharing from 'expo-sharing';

const convertMarkdownToHtml = (text) =>
    text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g,     '<em>$1</em>')
        .replace(/^---+$/gm,       '<hr>')
        .replace(/^_+$/gm,         '')
        .replace(/\n\n/g,          '</p><p>')
        .replace(/\n/g,            '<br>');

const buildHtml = (content) => `
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; padding: 30px 40px; color: #333; line-height: 1.6; font-size: 13px; }
      .header { display: flex; align-items: center; border-bottom: 3px solid #2456ee; padding-bottom: 15px; margin-bottom: 25px; }
      .logo-circle { width: 60px; height: 60px; background-color: #2456ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
      .logo-text { color: white; font-size: 20px; font-weight: bold; }
      .company-name { font-size: 22px; font-weight: bold; color: #2456ee; }
      .company-subtitle { font-size: 12px; color: #666; }
      h1 { color: #2456ee; font-size: 16px; margin-top: 0; }
      p { font-size: 13px; margin: 0 0 10px 0; }
      strong { color: #1a1a2e; }
      hr { border: none; border-top: 1px solid #e5e7eb; margin: 15px 0; }
      .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 10px; color: #999; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo-circle"><span class="logo-text">AD</span></div>
      <div>
        <div class="company-name">Aurora Dossier</div>
        <div class="company-subtitle">Sistema de Gestión Empresarial</div>
      </div>
    </div>
    <p>${content}</p>
    <div class="footer">
      Documento generado por Aurora Dossier el ${new Date().toLocaleDateString('es-CO')}
      a las ${new Date().toLocaleTimeString('es-CO')}
    </div>
  </body>
</html>`;

export const pdfService = {
    async generateAndShare(text) {
        if (!text) throw new Error('No hay contenido para generar el PDF');

        const html       = buildHtml(convertMarkdownToHtml(text));
        const { uri }    = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
        return uri;
    },
};
