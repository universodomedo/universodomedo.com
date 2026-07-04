'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useState } from 'react';
import { PAGINAS, type MinhasAssinaturasDto, type OfertaAssinaturaDto, type PixGeradoDto } from "types-nora-api";

import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { ControladorSlot } from "Layouts/ControladorSlot";
import { obterOfertaAssinatura, geraPixProduto, obterStatusPix, obterMinhasAssinaturas } from "Uteis/ApiConsumer/ConsumerMiddleware";

type StatusChecklist = 'pronto' | 'em_desenvolvimento' | 'em_breve' | 'futuro_proximo';

type ItemChecklist = { titulo: string; descricao: string; status: StatusChecklist; };

const ITENS_PASSE: ItemChecklist[] = [
    { titulo: 'Fichas Temporárias ilimitadas', descricao: 'Remoção do limite de Fichas Temporárias para a conta com Passe de Jogador ativo', status: 'pronto' },
    { titulo: 'Criação de Ficha Temporária', descricao: 'Crie a ficha que será levada ao jogo sem depender de longos livros de regras, com autonomia e velocidade', status: 'pronto' },
    { titulo: 'Criação de Personagem e História', descricao: 'Dê início a uma nova história. Uma nova face destinada a atravessar os mistérios do Universo do Medo', status: 'em_breve' },
    { titulo: 'Sala de Jogo', descricao: 'Mantenha acesso imediato à sua ficha e a uma base extensa de recursos durante a experiência de jogo', status: 'em_desenvolvimento' },
    { titulo: 'Sala de Jogo - Inventário e Habilidades', descricao: 'Desenvolva sua presença no Paranormal e coloque à prova os limites do seu poder', status: 'em_breve' },
    { titulo: 'Biblioteca de Desbloqueáveis', descricao: 'Registre e preserve sua experiência no Universo do Medo. Sua conta se torna mais forte e suas respostas, mais próximas', status: 'futuro_proximo' },
    { titulo: 'Criação 3D de Personagem', descricao: 'Controle a aparência do seu Personagem com profundidade, em tempo real e sem depender de ferramentas externas', status: 'em_breve' },
    { titulo: 'Impressão de Personagem', descricao: 'Eternize sua trajetória com a impressão do seu Personagem, integrada ao ecossistema e sem custos adicionais', status: 'futuro_proximo' },
    { titulo: 'Customização Visual de Ficha e Tela de Jogador', descricao: 'Escolha temas visuais inspirados em diferentes cenários e atmosferas da história do Universo do Medo', status: 'em_breve' },
];

function textoStatus(status: StatusChecklist): string {
    if (status === 'pronto') return 'Pronto';
    if (status === 'em_desenvolvimento') return 'Em desenvolvimento';
    if (status === 'em_breve') return 'Em breve';
    return 'Futuro próximo';
}

function ordemStatus(status: StatusChecklist): number {
    if (status === 'pronto') return 0;
    if (status === 'em_desenvolvimento') return 1;
    if (status === 'em_breve') return 2;
    return 3;
}

function formataReais(valorCentavos: number): string {
    return (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formataData(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function PaginaPasseDeJogador_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.minhasConfiguracoes.passeDeJogador}>
            <PaginaPasseDeJogador_Slot />
        </ControladorSlot>
    );
};

function PaginaPasseDeJogador_Slot() {
    const itensOrdenados = [...ITENS_PASSE].sort((a, b) => ordemStatus(a.status) - ordemStatus(b.status));

    const [minhas, setMinhas] = useState<MinhasAssinaturasDto | null>(null);
    const [carregandoMinhas, setCarregandoMinhas] = useState<boolean>(true);

    const carregarMinhas = useCallback(() => {
        setCarregandoMinhas(true);
        obterMinhasAssinaturas()
            .then(dados => { setMinhas(dados); })
            .catch(() => { setMinhas(null); })
            .finally(() => { setCarregandoMinhas(false); });
    }, []);

    useEffect(() => { carregarMinhas(); }, [carregarMinhas]);

    return (
        <div className={styles.recipiente_pagina_passe_de_jogador}>
            <div className={styles.hero}>
                <SecaoDeConteudo fit>
                    <div className={styles.hero_topo}>
                        <div className={styles.hero_badges}>
                            <span className={styles.badge}>Passe de Jogador</span>
                            <span className={styles.badge_secundario}>Duração: 30 dias</span>
                        </div>

                        <div className={styles.bloco_titulo}>
                            <h1 className={styles.titulo}>Passe de Jogador</h1>
                            <div className={styles.linha_titulo} />
                        </div>

                        <p className={styles.subtitulo}>Um ciclo de apoio ao Universo do Medo com benefícios de conveniência, expansão contínua de recursos e participação direta na evolução da plataforma</p>
                    </div>
                </SecaoDeConteudo>
            </div>

            <div className={styles.conteudo}>
                <BlocoSeuPasse minhas={minhas} carregando={carregandoMinhas} />

                <BlocoAssinar onPago={carregarMinhas} />

                <BlocoHistorico minhas={minhas} carregando={carregandoMinhas} />

                <section className={styles.bloco}>
                    <h2 className={styles.titulo_secao}>O que o Passe inclui</h2>
                    <p className={styles.texto_menor}>Entregas concluídas, sistemas em expansão e próximos marcos da experiência do jogador dentro do Universo do Medo</p>

                    <ul className={styles.lista_checklist}>
                        {itensOrdenados.map((item) => (
                            <li key={item.titulo} className={styles.item_checklist}>
                                <div className={styles.item_topo}>
                                    <span className={`${styles.ponto_status} ${styles[`status_${item.status}`]}`} />
                                    <div className={styles.item_titulo}>{item.titulo}</div>
                                    <span className={`${styles.tag_status} ${styles[`tag_${item.status}`]}`}>{textoStatus(item.status)}</span>
                                </div>
                                <div className={styles.item_descricao}>{item.descricao}</div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

function BlocoSeuPasse({ minhas, carregando }: { minhas: MinhasAssinaturasDto | null; carregando: boolean; }) {
    const passeAtivo = minhas?.passesAtivos?.[0] ?? null;

    return (
        <section className={styles.bloco_status}>
            <h2 className={styles.titulo_secao}>Seu Passe</h2>
            {carregando && <p className={styles.texto_menor}>Carregando…</p>}
            {!carregando && passeAtivo !== null && (
                <div className={`${styles.status_linha} ${styles.status_ativo}`}>
                    <span className={styles.status_ponto} />
                    <div>
                        <div className={styles.status_titulo}>{passeAtivo.nomePasse} — ativo</div>
                        <div className={styles.status_sub}>Válido até {formataData(passeAtivo.dataValidade)}</div>
                    </div>
                </div>
            )}
            {!carregando && passeAtivo === null && (
                <div className={`${styles.status_linha} ${styles.status_inativo}`}>
                    <span className={styles.status_ponto} />
                    <div>
                        <div className={styles.status_titulo}>Nenhum Passe ativo</div>
                        <div className={styles.status_sub}>Assine abaixo para ativar seus benefícios de Jogador</div>
                    </div>
                </div>
            )}
        </section>
    );
};

function BlocoHistorico({ minhas, carregando }: { minhas: MinhasAssinaturasDto | null; carregando: boolean; }) {
    const pagamentos = minhas?.pagamentos ?? [];

    return (
        <section className={styles.bloco}>
            <h2 className={styles.titulo_secao}>Histórico de pagamentos</h2>
            {carregando && <p className={styles.texto_menor}>Carregando…</p>}
            {!carregando && pagamentos.length === 0 && <p className={styles.historico_vazio}>Você ainda não tem pagamentos de assinatura.</p>}
            {!carregando && pagamentos.length > 0 && (
                <ul className={styles.historico_lista}>
                    {pagamentos.map((pagamento) => (
                        <li key={pagamento.idRegistroPix} className={styles.historico_item}>
                            <div className={styles.historico_produto}>{pagamento.nomeProduto}</div>
                            <div className={styles.historico_valor}>{formataReais(pagamento.valorCentavos)}</div>
                            <div className={styles.historico_data}>{formataData(pagamento.dataPagamento)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

type EstadoAssinatura = 'carregando' | 'pronto' | 'gerando' | 'aguardando' | 'pago' | 'indisponivel';

function BlocoAssinar({ onPago }: { onPago: () => void; }) {
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

    return (
        <section className={styles.bloco_cta}>
            <div className={styles.cta_conteudo}>
                <div className={styles.cta_textos}>
                    <div className={styles.cta_chamada}>{estado === 'pago' ? 'Passe ativado!' : 'Assine agora'}</div>
                    <div className={styles.cta_sub}>
                        {estado === 'carregando' && 'Carregando a oferta...'}
                        {estado === 'indisponivel' && (erro ?? 'Assinatura indisponível no momento.')}
                        {(estado === 'pronto' || estado === 'gerando') && oferta !== null && `${formataReais(oferta.valorCentavos)} — 30 dias de Passe de Jogador, pagamento via Pix.`}
                        {estado === 'aguardando' && 'Pague o Pix abaixo no seu banco. A confirmação é automática.'}
                        {estado === 'pago' && 'Pagamento confirmado. Seu Passe de Jogador já está ativo.'}
                    </div>
                    {erro !== null && estado === 'pronto' && <div className={styles.erro_pix}>{erro}</div>}
                </div>

                {(estado === 'carregando' || estado === 'pronto' || estado === 'gerando') && (
                    <button className={styles.botao_cta} onClick={assinar} disabled={estado !== 'pronto'}>
                        {estado === 'gerando' ? 'Gerando...' : estado === 'carregando' ? 'Aguarde...' : oferta !== null ? `Assinar — ${formataReais(oferta.valorCentavos)}` : 'Assinar'}
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