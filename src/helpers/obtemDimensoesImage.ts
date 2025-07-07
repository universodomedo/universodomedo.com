import sizeOf from 'image-size';
import { promisify } from 'util';
import { readFile } from 'fs';
import { resolve } from 'path';

const readFileAsync = promisify(readFile);

const imageDimensionsCache: Record<string, { width: number; height: number }> = {};

export async function obtemDimensoesImage(imagePath: string) {
    if (imageDimensionsCache[imagePath]) return imageDimensionsCache[imagePath];

    // Verifica se a imagem é local (no diretório public) ou remota (URL)
    const isLocalImage = !imagePath.startsWith('http');

    let buffer: Buffer;

    if (isLocalImage) {
        const filePath = resolve(`./public${imagePath}`);
        buffer = await readFileAsync(filePath);
    } else {
        const response = await fetch(imagePath);
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    }

    const dimensions = sizeOf(buffer);

    if (!dimensions.width || !dimensions.height) {
        throw new Error(`Não foi possível obter as dimensões da imagem: ${imagePath}`);
    }

    imageDimensionsCache[imagePath] = {
        width: dimensions.width,
        height: dimensions.height,
    };

    return imageDimensionsCache[imagePath];
};