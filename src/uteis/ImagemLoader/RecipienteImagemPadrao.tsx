import { carregaImagem } from 'Uteis/ImagemLoader/ImagemLoader.ts';

export default function RecipienteImagemPadrao({ src, className }: { src: string | undefined; className?: string }) {
    return <img alt='' src={carregaImagem({ src })} className={className} />;
};