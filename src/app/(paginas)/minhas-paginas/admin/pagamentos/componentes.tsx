'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';
import { PAGINAS, Eventos_Emite, type PagamentoAdminDto } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { useRecebeEmitWs } from 'Hooks/useEventoWs';
import { obterPagamentosAdmin } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { somPixGerado, somPagamentoConfirmado } from './sons';

function formataReais(valorCentavos: number): string {
    return (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formataDataHora(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function PaginaAdminPagamentos_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.pagamentos}>
            <PaginaAdminPagamentos_Slot />
        </ControladorSlot>
    );
};

// Carga inicial via REST + atualização ao vivo via WS: pixGerado (novo movimento "aguardando") e pagamentoConfirmado (o mesmo movimento vira "pago"). Ambos fazem upsert por idRegistroPix.
function useMovimentosAoVivo() {
    const [movimentos, setMovimentos] = useState<PagamentoAdminDto[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [recemAtualizado, setRecemAtualizado] = useState<number | null>(null);

    useEffect(() => {
        let ativo = true;
        obterPagamentosAdmin()
            .then(lista => { if (ativo) setMovimentos(lista); })
            .catch(() => { if (ativo) setMovimentos([]); })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, []);

    function aplica(movimento: PagamentoAdminDto) {
        setMovimentos(anteriores => {
            const indice = anteriores.findIndex(anterior => anterior.idRegistroPix === movimento.idRegistroPix);
            if (indice === -1) return [movimento, ...anteriores];
            const copia = [...anteriores];
            copia[indice] = movimento;
            return copia;
        });
        setRecemAtualizado(movimento.idRegistroPix);
    }

    useRecebeEmitWs(Eventos_Emite.PagamentosPix.eventos.pixGerado, movimento => { aplica(movimento); somPixGerado(); });
    useRecebeEmitWs(Eventos_Emite.PagamentosPix.eventos.pagamentoConfirmado, movimento => { aplica(movimento); somPagamentoConfirmado(); });

    return { movimentos, carregando, recemAtualizado };
};

function PaginaAdminPagamentos_Slot() {
    const { movimentos, carregando, recemAtualizado } = useMovimentosAoVivo();

    return (
        <div className={styles.recipiente}>
            <div className={styles.cabecalho}>
                <span className={styles.pulso} />
                <span className={styles.cabecalho_texto}>Ao vivo — {movimentos.length} movimento{movimentos.length === 1 ? '' : 's'}</span>
            </div>

            {carregando && <p className={styles.vazio}>Carregando…</p>}
            {!carregando && movimentos.length === 0 && <p className={styles.vazio}>Nenhum movimento ainda.</p>}

            {!carregando && movimentos.length > 0 && (
                <div className={styles.tabela_scroll}>
                    <table className={styles.tabela}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Data</th>
                                <th>Usuário</th>
                                <th>Produto</th>
                                <th>Tipo</th>
                                <th className={styles.col_valor}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentos.map(movimento => (
                                <tr key={movimento.idRegistroPix} className={movimento.idRegistroPix === recemAtualizado ? styles.linha_nova : ''}>
                                    <td><span className={`${styles.tag} ${movimento.status === 'pago' ? styles.status_pago : styles.status_aguardando}`}>{movimento.status === 'pago' ? 'Pago' : 'Aguardando'}</span></td>
                                    <td>{formataDataHora(movimento.dataGeracao)}</td>
                                    <td>{movimento.nomeUsuario}</td>
                                    <td>{movimento.nomeProduto}</td>
                                    <td><span className={`${styles.tag} ${movimento.tipo === 'assinatura' ? styles.tag_assinatura : styles.tag_doacao}`}>{movimento.tipo === 'assinatura' ? 'Assinatura' : 'Doação'}</span></td>
                                    <td className={styles.col_valor}>{formataReais(movimento.valorCentavos)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};