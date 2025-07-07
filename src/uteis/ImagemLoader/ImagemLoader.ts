export default function carregaImagem({ src, onError }: { src: string | undefined; onError?: (error: Error) => void; }): string {
    return getImageUrl(src);
};

function getImageUrl(path: string | undefined): string {
    return `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${path}`;
};