import styles from './styles.module.css';
import { PersonagemDto } from "types-nora-api";

import Link from 'next/link';
import Image from "next/image";

export default function PaginaPersonagensComDados({ dadosPersonagens }: { dadosPersonagens: PersonagemDto[] }) {
    return (
        <div id={styles.recipiente_pagina_personagens}>
            <h1>Meus Personagens</h1>
            <ListaPersonagens dadosPersonagens={dadosPersonagens} />
        </div>
    );
};

export function ListaPersonagens({ dadosPersonagens }: { dadosPersonagens: PersonagemDto[] }) {
    if (dadosPersonagens.length < 1) return (
        <div>
            <h2>Nenhum Personagem foi encontrado</h2>
            <Link href={'/dicas/criando-um-novo-personagem'} target='_blank'><h2>Maiores informações sobre o Cadastro de Personagens</h2></Link>
        </div>
    );

    return (
        <div id={styles.recipiente_lista_personagens}>
            {dadosPersonagens.map((personagem, index) => (
                <div key={index} className={styles.recipiente_personagem}>
                    <div className={styles.recipiente_avatar_personagem}>
                        <Image alt='' src={`/teste.png`} fill />
                        {/* <Image alt='' src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${personagem.imagemAvatar?.caminho}`} fill /> */}
                    </div>
                    <div className={styles.recipiente_informacoes1_personagem}>
                        <div className={styles.recipiente_nome_personagem}>
                            <h1>{personagem.informacao?.nome}</h1>
                        </div>
                        <h3>Ocultista NEX 20%</h3>
                        {/* <h3>[Implementar Classe] - [Implementar NEX]</h3> */}
                        {/* <h3>{personagem.mensagemEstadoOcupacao}</h3> */}
                    </div>
                </div>
            ))}
        </div>
    );
}