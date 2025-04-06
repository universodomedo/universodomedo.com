import Image from "next/image";
import carregaImagem from 'Uteis/ImagemLoader/ImagemLoader.ts';

export default function RecipienteImagem({ src }: { src: string | undefined }) {
    return <Image alt='' src={carregaImagem({ src })} fill />
};