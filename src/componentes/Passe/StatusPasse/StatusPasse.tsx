'use client';

import { useEffect, useState } from 'react';
import type { MinhasAssinaturasDto } from 'types-nora-api';

import { obterMinhasAssinaturas } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import styles from './StatusPasse.module.css';

function formataData(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Status do passe do usuário logado. 'compacto' = badge discreto pro hub (some se não houver passe); 'completo' = card pra página de conta.
// Modo controlado: passe `dados` + `carregando` (a página já busca). Modo autônomo: sem `dados`, o componente busca sozinho.
type StatusPasseProps = { variante: 'compacto' | 'completo'; dados?: MinhasAssinaturasDto | null; carregando?: boolean; };

export default function StatusPasse({ variante, dados, carregando }: StatusPasseProps) {
    const controlado = dados !== undefined;
    const [interno, setInterno] = useState<MinhasAssinaturasDto | null>(null);
    const [carregandoInterno, setCarregandoInterno] = useState<boolean>(true);

    useEffect(() => {
        if (controlado) return;
        let ativo = true;
        obterMinhasAssinaturas()
            .then(dados => { if (ativo) setInterno(dados); })
            .catch(() => { if (ativo) setInterno(null); })
            .finally(() => { if (ativo) setCarregandoInterno(false); });
        return () => { ativo = false; };
    }, [controlado]);

    const efetivo = controlado ? (dados ?? null) : interno;
    const estaCarregando = controlado ? (carregando ?? false) : carregandoInterno;
    const passeAtivo = efetivo?.passesAtivos?.[0] ?? null;

    if (variante === 'compacto') {
        if (estaCarregando || passeAtivo === null) return null;
        return (
            <div className={styles.compacto}>
                <span className={styles.compacto_ponto} />
                <div className={styles.compacto_textos}>
                    <span className={styles.compacto_nome}>{passeAtivo.nomePasse}</span>
                    <span className={styles.compacto_validade}>ativo até {formataData(passeAtivo.dataValidade)}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.completo}>
            {estaCarregando && <p className={styles.completo_carregando}>Carregando…</p>}
            {!estaCarregando && passeAtivo !== null && (
                <div className={`${styles.completo_linha} ${styles.completo_ativo}`}>
                    <span className={styles.completo_ponto} />
                    <div>
                        <div className={styles.completo_titulo}>{passeAtivo.nomePasse} — ativo</div>
                        <div className={styles.completo_sub}>Válido até {formataData(passeAtivo.dataValidade)}</div>
                    </div>
                </div>
            )}
            {!estaCarregando && passeAtivo === null && (
                <div className={`${styles.completo_linha} ${styles.completo_inativo}`}>
                    <span className={styles.completo_ponto} />
                    <div>
                        <div className={styles.completo_titulo}>Nenhum passe ativo</div>
                        <div className={styles.completo_sub}>Assine o Passe de Fundador para ativar seus benefícios</div>
                    </div>
                </div>
            )}
        </div>
    );
};