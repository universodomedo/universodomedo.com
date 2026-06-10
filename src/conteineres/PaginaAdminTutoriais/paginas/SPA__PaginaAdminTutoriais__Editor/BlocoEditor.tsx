import styles from './BlocoEditor.module.css';

import type { AreaPercentual } from 'types-nora-api';
import { useContexto__PaginaAdminTutoriais__Editor } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/contexto';
import { Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider } from 'Contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';

const CAMPOS_AREA: readonly (keyof AreaPercentual)[] = ['x', 'y', 'largura', 'altura'];

export default function BlocoEditor() {
    const editor = useContexto__PaginaAdminTutoriais__Editor();
    const passo = editor.passoAtivo;
    const bloco = passo?.blocos.find(blocoAtual => blocoAtual.idLocal === editor.selecao.blocoSelecionadoId);

    if (!passo || !bloco) return <p className={styles.vazio}>Selecione um bloco no canvas para editar conteúdo e dimensões.</p>;

    return (
        <div className={styles.editor}>
            <header className={styles.cabecalho}>
                <strong>{bloco.tipo === 'texto' ? 'Bloco de texto' : 'Bloco de imagem'}</strong>
                <div className={styles.acoes}>
                    <button type="button" onClick={() => editor.acoes.reordenaBloco(passo.idLocal, bloco.idLocal, 'cima')}>↑</button>
                    <button type="button" onClick={() => editor.acoes.reordenaBloco(passo.idLocal, bloco.idLocal, 'baixo')}>↓</button>
                    <button type="button" onClick={() => { editor.acoes.removeBloco(passo.idLocal, bloco.idLocal); editor.selecao.selecionaBloco(null); }}>Remover</button>
                </div>
            </header>

            {bloco.tipo === 'texto' && <textarea className={styles.markdown} value={bloco.markdown} placeholder="Markdown (sem HTML livre)" onChange={evento => editor.acoes.atualizaMarkdownBloco(passo.idLocal, bloco.idLocal, evento.target.value)} />}

            {bloco.tipo === 'imagem' && (
                <div className={styles.imagem}>
                    <span>{bloco.idImagem === null ? 'Nenhuma imagem selecionada' : `Imagem #${bloco.idImagem}`}</span>
                    <Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider configArteCapa={{ tituloOperacao: 'Selecionar Imagem', subtituloOperacao: 'Escolha uma arte cadastrada', callback: idArteCapa => editor.acoes.defineImagemBloco(passo.idLocal, bloco.idLocal, idArteCapa) }} />
                </div>
            )}

            <div className={styles.area}>
                {CAMPOS_AREA.map(campo => (
                    <label key={campo} className={styles.campo_area}>
                        <span>{campo}</span>
                        <input type="number" min={0} max={100} step="any" value={bloco.area[campo]} onChange={evento => editor.acoes.aplicaArea(passo.idLocal, bloco.idLocal, { ...bloco.area, [campo]: Number(evento.target.value) }, false)} />
                    </label>
                ))}
            </div>
        </div>
    );
};
