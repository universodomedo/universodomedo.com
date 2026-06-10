import styles from './PalcoTutorial.module.css';

import { useContexto__PaginaAdminTutoriais__Editor } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/contexto';
import { RAZAO_ALTURA_CONTEUDO_TUTORIAL } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/geometriaTutorial';
import { botoesVisiveisDoPasso } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/botoesPassoTutorial';
import BlocoCanvas from './BlocoCanvas';

export default function PalcoTutorial() {
    const editor = useContexto__PaginaAdminTutoriais__Editor();
    const passo = editor.passoAtivo;
    const indicePasso = passo ? editor.acoes.passos.findIndex(item => item.idLocal === passo.idLocal) : -1;
    const botoes = botoesVisiveisDoPasso(indicePasso, editor.acoes.passos.length);

    return (
        <div className={styles.palco}>
            <div className={styles.tutorial} style={{ width: `${editor.larguraPercentual}%` }}>
                <div className={styles.conteudoScroll}>
                    <div ref={editor.canvasRef} className={styles.canvas} style={{ aspectRatio: `1 / ${RAZAO_ALTURA_CONTEUDO_TUTORIAL}` }}>
                        {passo?.blocos.map(bloco => (
                            <BlocoCanvas key={bloco.idLocal} passoId={passo.idLocal} bloco={bloco} caminhoImagem={bloco.idImagem !== null ? editor.artes.get(bloco.idImagem) ?? null : null} selecionado={editor.selecao.blocoSelecionadoId === bloco.idLocal} aoSelecionar={() => editor.selecao.selecionaBloco(bloco.idLocal)} iniciaDrag={editor.drag.iniciaDrag} iniciaResize={editor.resize.iniciaResize} />
                        ))}
                    </div>
                </div>
                <div className={styles.botoes}>
                    {botoes.voltar && <span>{passo?.textoBotaoVoltar?.trim() || 'Voltar'}</span>}
                    {botoes.avancar && <span>{passo?.textoBotaoAvancar?.trim() || 'Avançar'}</span>}
                    {botoes.concluir && <span>{passo?.textoBotaoConcluir?.trim() || 'Entendi'}</span>}
                    {botoes.fechar && <span>{passo?.textoBotaoFechar?.trim() || 'Fechar'}</span>}
                </div>
            </div>
        </div>
    );
};
