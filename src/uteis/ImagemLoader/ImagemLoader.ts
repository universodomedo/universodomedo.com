const DEFAULT_IMAGE_PATH = '/imagem-perfil-vazia.png'; // Altere para o caminho da sua imagem padrão

export default function carregaImagem({ src, onError }: { src: string | undefined; onError?: (error: Error) => void; }): string {
    try {
        if (!src) return DEFAULT_IMAGE_PATH;

        const imageUrl = getImageUrl(src);

        return imageUrl;
    } catch (error) {
        onError?.(error as Error);
        return DEFAULT_IMAGE_PATH;
    }
};

function getImageUrl(path: string | undefined): string {
    if (!path) return DEFAULT_IMAGE_PATH;

    return `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${path}`;
};