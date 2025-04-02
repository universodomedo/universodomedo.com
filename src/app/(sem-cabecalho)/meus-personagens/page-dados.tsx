import styles from './styles.module.css';
import { PersonagemDto } from "types-nora-api";

import Link from 'next/link';
import ElementoAvatar from 'Uteis/ImagemLoader/ElementoAvatar';

export default function PaginaPersonagensComDados({ dadosPersonagens }: { dadosPersonagens: PersonagemDto[] }) {
    return (
        <div id={styles.recipiente_pagina_personagens}>
            <h1>Meus Personagens</h1>
            {/* <div className={styles.recipiente_avisos_convite_pendentes}>
                <h1>Você tem um convite pendente!</h1>
                <h1>O Mestre Vigiani te convidou para jogar <Link href={'/aventuras'} target='_blank'>Profunda Herança</Link></h1>
                <div className={styles.recipiente_botoes_aviso_convite_pendente}>
                    <button>Aceitar</button>
                    <button>Rejeitar</button>
                </div>
            </div> */}
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
                        <ElementoAvatar src={personagem.imagemAvatar?.caminho} />
                    </div>
                    <div className={styles.recipiente_informacoes1_personagem}>
                        <div className={styles.recipiente_informacoes_personagem}>
                            <h1>{personagem.informacao?.nome}</h1>
                            <p>Ocultista NEX 20%</p>
                        </div>
                        <div className={styles.recipiente_pendencia}>
                            <p>{personagem.estadoPendencia}</p>
                        </div>
                    </div>
                    {personagem.tempoProximaSessaoPersonagem !== undefined && (
                        <div className={styles.recipiente_informacoes2_personagem}>
                            <h2>Próxima Sessão em</h2>
                            <h2>3 horas</h2>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}