import Image from "next/image";
import { carregaImagem } from 'Uteis/ImagemLoader/ImagemLoader.ts';

export default function RecipienteImagem({ src, className }: { src: string | undefined; className?: string }) {
    return <Image alt='' src={carregaImagem({ src })} fill unoptimized className={className} />;
};