import type { AnexoEvidencia } from 'types-nora-api';

const LARGURA_MAXIMA = 1600;
const QUALIDADE = 0.8;

// Compressao OBRIGATORIA de evidencia antes do envio: redimensiona (max 1600px de largura) e reencoda em WebP.
// Um print de tela de 2-4MB vira ~100-300KB — e o backend rejeita acima de 600KB, entao nada passa sem vir por aqui.
export async function comprimeImagemEvidencia(arquivo: File | Blob): Promise<AnexoEvidencia> {
    const bitmap = await createImageBitmap(arquivo);
    const escala = Math.min(1, LARGURA_MAXIMA / bitmap.width);
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const contexto = canvas.getContext('2d');
    if (!contexto) throw new Error('Canvas indisponível para comprimir a evidência.');
    contexto.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close();

    const dataUrl = canvas.toDataURL('image/webp', QUALIDADE);
    const dadosBase64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
    return { mime: 'image/webp', dadosBase64 };
};
