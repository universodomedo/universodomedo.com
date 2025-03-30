'use client';

import styles from './styles.module.css';
import { AventuraDto } from "types-nora-api";

import Image from "next/image";

export default function MinhaDisponibilidadeComDados({ dadosAventuras }: { dadosAventuras: AventuraDto[] }) {
    return (
        <>
            <h1>Aventuras</h1>
            <div id={styles.recipiente_aventuras}>
                {dadosAventuras.map((aventura, key) => (
                    <div key={key} className={styles.recipiente_geral_aventura}>
                        <div className={styles.recipiente_aventura}>
                            <div className={styles.recipiente_capa_aventura}>
                                <Image alt='' src={'/testeCapa1.png'} fill />
                                {/* <Image alt='' src={`https://cdn.universodomedo.com/assets/imagem${aventura.+1}.png`} fill /> */}
                            </div>
                            <div className={styles.recipiente_dados_aventura}>
                                <div className={styles.recipiente_dados_aventura_superior}>
                                    <h1>{aventura.titulo}</h1><span>{aventura.obtemEstadoAtual}</span>
                                </div>
                                <div className={styles.recipiente_dados_aventura_inferior}>
                                </div>
                            </div>
                        </div>
                        {aventura.gruposAventura.length > 0 && (
                            <div className={styles.recipiente_grupos}>
                                {aventura.gruposAventura.length <= 1 ? (
                                    <h1>{aventura.gruposAventura[0].obtemTextoInformacionalOcorrencia}</h1>
                                ) : (
                                    <>
                                        {aventura.gruposAventura.map((grupo, grupoIndex) => (
                                            <h1 key={grupoIndex}>{grupo.obtemTextoInformacionalOcorrencia}</h1>
                                        ))}
                                    </>
                                )}

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};