import { useContexto__PaginaAssinaturaArtista__Edicao } from 'Contextos/Contexto__PaginaAssinaturaArtista__Edicao/contexto';
import { FONTES_ASSINATURA, FONTES_ASSINATURA_LISTA, HREF_GOOGLE_FONTS_ASSINATURA } from 'Funcionalidades/AssinaturaArtista/assinaturaArtista.api';
import type { FonteAssinaturaArtista } from 'types-nora-api';

import styles from './styles.module.css';

export default function SPA__PaginaAssinaturaArtista__Edicao() {
    const { formularioAssinatura, carregando } = useContexto__PaginaAssinaturaArtista__Edicao();

    if (carregando) return <p className={styles.carregando}>Carregando sua assinatura…</p>;

    const fonteAtual = (formularioAssinatura.valores.fonte ?? 'GREAT_VIBES') as FonteAssinaturaArtista;
    const textoPreview = formularioAssinatura.valores.texto.trim().length > 0 ? formularioAssinatura.valores.texto : 'Sua assinatura';

    return (
        <section className={styles.pagina}>
            {/* Carrega as fontes script (Google Fonts) usadas na pré-visualização e no select. */}
            <link rel="stylesheet" href={HREF_GOOGLE_FONTS_ASSINATURA} />

            <div className={styles.formulario}>
                <label className={styles.campo}>
                    <span>Texto da assinatura</span>
                    <input type="text" {...formularioAssinatura.input('texto')} />
                    {formularioAssinatura.erro('texto') && <small className={styles.erro}>{formularioAssinatura.erro('texto')}</small>}
                </label>

                <label className={styles.campo}>
                    <span>Fonte</span>
                    <select value={fonteAtual} onChange={evento => formularioAssinatura.setCampo('fonte', evento.target.value as FonteAssinaturaArtista)}>
                        {FONTES_ASSINATURA_LISTA.map(fonte => <option key={fonte} value={fonte} style={{ fontFamily: FONTES_ASSINATURA[fonte].familia }}>{FONTES_ASSINATURA[fonte].rotulo}</option>)}
                    </select>
                </label>

                <button type="button" className={styles.botaoSalvar} onClick={formularioAssinatura.salvar} disabled={!formularioAssinatura.podeSalvar}>
                    {formularioAssinatura.salvando ? 'Salvando…' : 'Salvar assinatura'}
                </button>
            </div>

            <div className={styles.areaPreview}>
                <span className={styles.rotuloPreview}>Pré-visualização na capa</span>
                <div className={styles.previewCapa}>
                    <div className={styles.assinaturaPreview}>
                        <span className={styles.textoAssinatura} style={{ fontFamily: FONTES_ASSINATURA[fonteAtual].familia }}>{textoPreview}</span>
                    </div>
                </div>
                <small className={styles.notaPreview}>Exibida sempre no canto inferior esquerdo, sobre um sombreamento para legibilidade — tamanho e cor padronizados.</small>
            </div>
        </section>
    );
};
