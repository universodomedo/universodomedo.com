'use client';

import styles from './styles.module.css';

import { useState, type MouseEvent } from 'react';

import { ModalAreaInterativa3D } from '../modal/ModalAreaInterativa3D';
import { categoriasComandosAreaInterativa3D, obtemComandosAreaInterativa3DPorCategoria, obtemTextoComandosAreaInterativa3D } from './editor3D.comandos';

type StatusCopiaComandosAreaInterativa3D = 'INATIVO' | 'COPIADO' | 'ERRO';

function copiaTextoComandosComFallback(texto: string): boolean {
    const campo = document.createElement('textarea');

    campo.value = texto;
    campo.setAttribute('readonly', 'true');
    campo.style.position = 'fixed';
    campo.style.left = '-999em';
    campo.style.top = '0';
    document.body.appendChild(campo);
    campo.select();

    const copiado = document.execCommand('copy');

    document.body.removeChild(campo);

    return copiado;
};

function obtemTextoBotaoCopia(status: StatusCopiaComandosAreaInterativa3D): string {
    if (status === 'COPIADO') return 'Copiado';
    if (status === 'ERRO') return 'Falhou';

    return 'Copiar';
};

export function BotaoComandosAreaInterativa3D() {
    const [aberto, setAberto] = useState(false);
    const [statusCopia, setStatusCopia] = useState<StatusCopiaComandosAreaInterativa3D>('INATIVO');

    function bloqueiaMouse(event: MouseEvent<HTMLElement>): void { event.stopPropagation(); };

    function abreModal(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        event.stopPropagation();
        setStatusCopia('INATIVO');
        setAberto(true);
    };

    function fechaModal(): void { setAberto(false); };

    async function copiaComandos(): Promise<void> {
        const texto = obtemTextoComandosAreaInterativa3D();

        try {
            if (navigator.clipboard !== undefined) {
                await navigator.clipboard.writeText(texto);
                setStatusCopia('COPIADO');

                return;
            }

            setStatusCopia(copiaTextoComandosComFallback(texto) ? 'COPIADO' : 'ERRO');
        } catch {
            setStatusCopia(copiaTextoComandosComFallback(texto) ? 'COPIADO' : 'ERRO');
        }
    };

    return (
        <>
            <div className={styles.comandosAreaInterativa3D} data-editor3d-comandos="true" onMouseDown={bloqueiaMouse}>
                <button className={styles.botaoComandosAreaInterativa3D} type="button" onClick={abreModal} aria-label="Abrir comandos da area interativa" title="Comandos">
                    <span aria-hidden="true">CMD</span>
                </button>
            </div>

            {aberto && (
                <ModalAreaInterativa3D titulo="Comandos" subtitulo="Modos e atalhos da area interativa" ariaLabel="Comandos da area interativa 3D" fecha={fechaModal} acoes={<button type="button" onClick={copiaComandos}>{obtemTextoBotaoCopia(statusCopia)}</button>}>
                    <div className={styles.listaComandosAreaInterativa3D}>
                        {categoriasComandosAreaInterativa3D.map(categoria => (
                            <section key={categoria.key} className={styles.grupoComandosAreaInterativa3D}>
                                <h3>{categoria.titulo}</h3>

                                <div className={styles.itensComandosAreaInterativa3D}>
                                    {obtemComandosAreaInterativa3DPorCategoria(categoria.key).map(comando => (
                                        <article key={comando.id} className={styles.itemComandoAreaInterativa3D}>
                                            <span className={styles.iconeComandoAreaInterativa3D}>{comando.icone}</span>

                                            <div className={styles.textoComandoAreaInterativa3D}>
                                                <strong>{comando.nome}</strong>
                                                <span>{comando.descricao}</span>
                                            </div>

                                            {comando.atalho !== null && <kbd>{comando.atalho}</kbd>}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </ModalAreaInterativa3D>
            )}
        </>
    );
};
