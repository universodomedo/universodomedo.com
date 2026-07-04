'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useState } from 'react';
import { PAGINAS, type MinhasAssinaturasDto, type MinhasDoacoesDto, type OfertaAssinaturaDto, type OfertaDoacaoDto, type PagamentoHistoricoDto, type PixGeradoDto } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import StatusPasse from 'Componentes/Passe/StatusPasse/StatusPasse';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import { obterMinhasAssinaturas, obterMinhasDoacoes, obterOfertaAssinatura, geraPixProduto, obterOfertaDoacao, geraPixDoacao, obterStatusPix } from 'Uteis/ApiConsumer/ConsumerMiddleware';

type Aba = 'assinaturas' | 'doacoes';

function formataReais(valorCentavos: number): string {
    return (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formataData(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function MinhaConta_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.minhasConfiguracoes.minhaConta}>
            <MinhaConta_Slot />
        </ControladorSlot>
    );
};

function MinhaConta_Slot() {
    const [aba, setAba] = useState<Aba>('assinaturas');

    return (
        <div className={styles.recipiente}>
            <div className={styles.abas}>
                <button className={`${styles.aba} ${aba === 'assinaturas' ? styles.aba_ativa : ''}`} onClick={() => setAba('assinaturas')}>Assinaturas</button>
                <button className={`${styles.aba} ${aba === 'doacoes' ? styles.aba_ativa : ''}`} onClick={() => setAba('doacoes')}>Doações</button>
            </div>

            {aba === 'assinaturas' && <AbaAssinaturas />}
            {aba === 'doacoes' && <AbaDoacoes />}
        </div>
    );
};

function AbaAssinaturas() {
    const [minhas, setMinhas] = useState<MinhasAssinaturasDto | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    const carregar = useCallback(() => {
        setCarregando(true);
        obterMinhasAssinaturas()
            .then(dados => { setMinhas(dados); })
            .catch(() => { setMinhas(null); })
            .finally(() => { setCarregando(false); });
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    const temPasseAtivo = (minhas?.passesAtivos?.length ?? 0) > 0;

    return (
        <div className={styles.conteudo_aba}>
            <section className={styles.bloco}>
                <h2 className={styles.titulo_secao}>Seu passe</h2>
                <StatusPasse variante="completo" dados={minhas} carregando={carregando} />
            </section>

            <BlocoAssinar onPago={carregar} temPasseAtivo={temPasseAtivo} />

            <section className={styles.bloco}>
                <h2 className={styles.titulo_secao}>Histórico de assinaturas</h2>
                <HistoricoPagamentos pagamentos={minhas?.pagamentos ?? []} carregando={carregando} vazio="Você ainda não tem pagamentos de assinatura." />
            </section>
        </div>
    );
};

function AbaDoacoes() {
    const [minhas, setMinhas] = useState<MinhasDoacoesDto | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    const carregar = useCallback(() => {
        setCarregando(true);
        obterMinhasDoacoes()
            .then(dados => { setMinhas(dados); })
            .catch(() => { setMinhas(null); })
            .finally(() => { setCarregando(false); });
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    return (
        <div className={styles.conteudo_aba}>
            <BlocoDoar onPago={carregar} />

            <section className={styles.bloco}>
                <h2 className={styles.titulo_secao}>Histórico de doações</h2>
                <HistoricoPagamentos pagamentos={minhas?.pagamentos ?? []} carregando={carregando} vazio="Você ainda não fez nenhuma doação." />
            </section>
        </div>
    );
};

function HistoricoPagamentos({ pagamentos, carregando, vazio }: { pagamentos: readonly PagamentoHistoricoDto[]; carregando: boolean; vazio: string; }) {
    if (carregando) return <p className={styles.texto_menor}>Carregando…</p>;
    if (pagamentos.length === 0) return <p className={styles.historico_vazio}>{vazio}</p>;
    return (
        <ul className={styles.historico_lista}>
            {pagamentos.map(pagamento => (
                <li key={pagamento.idRegistroPix} className={styles.historico_item}>
                    <div className={styles.historico_produto}>{pagamento.nomeProduto}</div>
                    <div className={styles.historico_valor}>{formataReais(pagamento.valorCentavos)}</div>
                    <div className={styles.historico_data}>{formataData(pagamento.dataPagamento)}</div>
                </li>
            ))}
        </ul>
    );
};

type EstadoAssinatura = 'carregando' | 'pronto' | 'gerando' | 'aguardando' | 'pago' | 'indisponivel';

function BlocoAssinar({ onPago, temPasseAtivo }: { onPago: () => void; temPasseAtivo: boolean; }) {
    const [oferta, setOferta] = useState<OfertaAssinaturaDto | null>(null);
    const [estado, setEstado] = useState<EstadoAssinatura>('carregando');
    const [pix, setPix] = useState<PixGeradoDto | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [copiado, setCopiado] = useState<boolean>(false);

    useEffect(() => {
        let ativo = true;
        obterOfertaAssinatura()
            .then(oferta => { if (!ativo) return; setOferta(oferta); setEstado(oferta ? 'pronto' : 'indisponivel'); })
            .catch(() => { if (ativo) { setEstado('indisponivel'); setErro('Não foi possível carregar a oferta.'); } });
        return () => { ativo = false; };
    }, []);

    useEffect(() => {
        if (estado !== 'aguardando' || pix === null) return;
        let ativo = true;
        const intervalo = setInterval(() => {
            obterStatusPix(pix.idRegistroPix).then(status => { if (ativo && status.pago) { setEstado('pago'); onPago(); } }).catch(() => { /* falha transitória de polling */ });
        }, 3000);
        return () => { ativo = false; clearInterval(intervalo); };
    }, [estado, pix, onPago]);

    async function assinar(): Promise<void> {
        if (oferta === null) return;
        setEstado('gerando');
        setErro(null);
        try {
            const gerado = await geraPixProduto({ idProduto: oferta.idProduto });
            setPix(gerado);
            setEstado('aguardando');
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível gerar o Pix.');
            setEstado('pronto');
        }
    }

    async function copiar(): Promise<void> {
        if (pix === null) return;
        try {
            await navigator.clipboard.writeText(pix.conteudoCopiaCola);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch { /* clipboard indisponível */ }
    }

    const chamada = estado === 'pago' ? 'Passe ativado!' : temPasseAtivo ? 'Renovar assinatura' : 'Assine agora';

    return (
        <section className={styles.bloco_cta}>
            <div className={styles.cta_conteudo}>
                <div className={styles.cta_textos}>
                    <div className={styles.cta_chamada}>{chamada}</div>
                    <div className={styles.cta_sub}>
                        {estado === 'carregando' && 'Carregando a oferta...'}
                        {estado === 'indisponivel' && (erro ?? 'Assinatura indisponível no momento.')}
                        {(estado === 'pronto' || estado === 'gerando') && oferta !== null && `${formataReais(oferta.valorCentavos)} — 30 dias de Passe, pagamento via Pix.`}
                        {estado === 'aguardando' && 'Pague o Pix abaixo no seu banco. A confirmação é automática.'}
                        {estado === 'pago' && 'Pagamento confirmado. Seu Passe já está ativo.'}
                    </div>
                    {erro !== null && estado === 'pronto' && <div className={styles.erro_pix}>{erro}</div>}
                </div>

                {(estado === 'carregando' || estado === 'pronto' || estado === 'gerando') && (
                    <button className={styles.botao_cta} onClick={assinar} disabled={estado !== 'pronto'}>
                        {estado === 'gerando' ? 'Gerando...' : estado === 'carregando' ? 'Aguarde...' : oferta !== null ? `${temPasseAtivo ? 'Renovar' : 'Assinar'} — ${formataReais(oferta.valorCentavos)}` : 'Assinar'}
                    </button>
                )}
            </div>

            {estado === 'aguardando' && pix !== null && (
                <div className={styles.caixa_pix}>
                    <div className={styles.caixa_pix_rotulo}>Pix copia e cola</div>
                    <div className={styles.copia_cola}>{pix.conteudoCopiaCola}</div>
                    <button className={styles.botao_copiar} onClick={copiar}>{copiado ? 'Copiado!' : 'Copiar código Pix'}</button>
                    <div className={styles.aguardando}>Aguardando confirmação do pagamento…</div>
                </div>
            )}
        </section>
    );
};

type EstadoDoacao = 'carregando' | 'pronto' | 'gerando' | 'aguardando' | 'pago' | 'indisponivel';

function BlocoDoar({ onPago }: { onPago: () => void; }) {
    const [oferta, setOferta] = useState<OfertaDoacaoDto | null>(null);
    const [estado, setEstado] = useState<EstadoDoacao>('carregando');
    const [valor, setValor] = useState<number>(0);
    const [pix, setPix] = useState<PixGeradoDto | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [copiado, setCopiado] = useState<boolean>(false);

    useEffect(() => {
        let ativo = true;
        obterOfertaDoacao()
            .then(oferta => { if (!ativo) return; setOferta(oferta); setEstado(oferta ? 'pronto' : 'indisponivel'); })
            .catch(() => { if (ativo) { setEstado('indisponivel'); setErro('Não foi possível carregar a doação.'); } });
        return () => { ativo = false; };
    }, []);

    useEffect(() => {
        if (estado !== 'aguardando' || pix === null) return;
        let ativo = true;
        const intervalo = setInterval(() => {
            obterStatusPix(pix.idRegistroPix).then(status => { if (ativo && status.pago) { setEstado('pago'); onPago(); } }).catch(() => { /* falha transitória de polling */ });
        }, 3000);
        return () => { ativo = false; clearInterval(intervalo); };
    }, [estado, pix, onPago]);

    function centavosDoValor(): number | null {
        if (!Number.isFinite(valor) || valor <= 0) return null;
        return Math.round(valor * 100);
    }

    async function doar(): Promise<void> {
        if (oferta === null) return;
        const centavos = centavosDoValor();
        if (centavos === null || centavos < 100) { setErro('Informe um valor de no mínimo R$ 1,00.'); return; }
        setEstado('gerando');
        setErro(null);
        try {
            const gerado = await geraPixDoacao({ idProduto: oferta.idProduto, valorCentavos: centavos });
            setPix(gerado);
            setEstado('aguardando');
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível gerar o Pix.');
            setEstado('pronto');
        }
    }

    async function copiar(): Promise<void> {
        if (pix === null) return;
        try {
            await navigator.clipboard.writeText(pix.conteudoCopiaCola);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch { /* clipboard indisponível */ }
    }

    return (
        <section className={styles.bloco_doar}>
            <h2 className={styles.titulo_secao}>Fazer uma doação</h2>
            {estado === 'carregando' && <p className={styles.texto_menor}>Carregando…</p>}
            {estado === 'indisponivel' && <p className={styles.texto_menor}>{erro ?? 'Doação indisponível no momento.'}</p>}

            {(estado === 'pronto' || estado === 'gerando') && oferta !== null && (
                <div className={styles.doar_form}>
                    <p className={styles.texto_menor}>{oferta.descricao ?? 'Contribua com o valor que quiser para apoiar o Universo do Medo.'}</p>
                    <div className={styles.doar_linha}>
                        <InputComRotulo rotulo="Valor da doação (R$)" classname={styles.doar_campo}>
                            <InputNumerico value={valor} onChange={setValor} min={1} step="0.01" disabled={estado === 'gerando'} />
                        </InputComRotulo>
                        <button className={styles.botao_doar} onClick={doar} disabled={estado === 'gerando'}>{estado === 'gerando' ? 'Gerando...' : 'Doar via Pix'}</button>
                    </div>
                    {erro !== null && <div className={styles.erro_pix}>{erro}</div>}
                </div>
            )}

            {estado === 'aguardando' && pix !== null && (
                <div className={styles.caixa_pix}>
                    <div className={styles.caixa_pix_rotulo}>Pix copia e cola — {formataReais(pix.valorCentavos)}</div>
                    <div className={styles.copia_cola}>{pix.conteudoCopiaCola}</div>
                    <button className={styles.botao_copiar} onClick={copiar}>{copiado ? 'Copiado!' : 'Copiar código Pix'}</button>
                    <div className={styles.aguardando}>Aguardando confirmação do pagamento…</div>
                </div>
            )}

            {estado === 'pago' && <div className={styles.doar_pago}>Doação confirmada. Muito obrigado pelo apoio!</div>}
        </section>
    );
};