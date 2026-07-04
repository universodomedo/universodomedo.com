'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';
import { PAGINAS, type PixGeradoDto } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import redirecionarInterno from 'Funcionalidades/redirecionarInterno';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputMoeda from 'Componentes/Elementos/Inputs/InputMoeda/InputMoeda';
import { geraDoacaoPublica, obterStatusDoacaoPublica } from 'Uteis/ApiConsumer/ConsumerMiddleware';

const VALOR_MINIMO_CENTAVOS = 100;
const VALOR_MAXIMO_CENTAVOS = 100_000;
// Doação pública é anônima (sem conta), então o Pix pendente fica guardado no navegador para sobreviver a um refresh.
const CHAVE_PIX_PENDENTE = 'udm_doacao_publica_pix';

function formataReais(valorCentavos: number): string {
    return (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function Doar_Client() {
    const { estaAutenticado } = useContextoAutenticacao();

    // Quem está logado doa vinculado à conta (Minha Conta). A página pública é só para quem não tem conta.
    if (estaAutenticado) return <RedirecionadorInterno pagina={PAGINAS.minhasPaginas.minhasConfiguracoes.minhaConta} />;

    return (
        <ControladorSlot pagina={PAGINAS.doar}>
            <FormularioDoacaoPublica />
        </ControladorSlot>
    );
};

type EstadoDoacao = 'pronto' | 'gerando' | 'aguardando' | 'pago';

function FormularioDoacaoPublica() {
    const [estado, setEstado] = useState<EstadoDoacao>('pronto');
    const [valorCentavos, setValorCentavos] = useState<number>(0);
    const [pix, setPix] = useState<PixGeradoDto | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [copiado, setCopiado] = useState<boolean>(false);
    const [campoArmadilha, setCampoArmadilha] = useState<string>('');

    // Ao abrir, retoma um Pix pendente guardado no navegador — se ainda estiver válido e não pago.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const bruto = window.localStorage.getItem(CHAVE_PIX_PENDENTE);
        if (!bruto) return;
        let pixSalvo: PixGeradoDto;
        try { pixSalvo = JSON.parse(bruto) as PixGeradoDto; } catch { window.localStorage.removeItem(CHAVE_PIX_PENDENTE); return; }
        let ativo = true;
        obterStatusDoacaoPublica(pixSalvo.idRegistroPix)
            .then(status => {
                if (!ativo) return;
                if (status.pago || status.segundosRestantes <= 0) { window.localStorage.removeItem(CHAVE_PIX_PENDENTE); return; }
                setPix(pixSalvo);
                setEstado('aguardando');
            })
            .catch(() => { /* sem rede: mantém o formulário limpo */ });
        return () => { ativo = false; };
    }, []);

    useEffect(() => {
        if (estado !== 'aguardando' || pix === null) return;
        let ativo = true;
        const intervalo = setInterval(() => {
            obterStatusDoacaoPublica(pix.idRegistroPix).then(status => { if (ativo && status.pago) { window.localStorage.removeItem(CHAVE_PIX_PENDENTE); setEstado('pago'); } }).catch(() => { /* falha transitória de polling */ });
        }, 3000);
        return () => { ativo = false; clearInterval(intervalo); };
    }, [estado, pix]);

    async function doar(): Promise<void> {
        if (valorCentavos < VALOR_MINIMO_CENTAVOS) { setErro('Informe um valor de no mínimo R$ 1,00.'); return; }
        if (valorCentavos > VALOR_MAXIMO_CENTAVOS) { setErro(`O valor máximo por doação é ${formataReais(VALOR_MAXIMO_CENTAVOS)}.`); return; }
        setEstado('gerando');
        setErro(null);
        try {
            const gerado = await geraDoacaoPublica({ valorCentavos, campoArmadilha });
            setPix(gerado);
            setEstado('aguardando');
            if (typeof window !== 'undefined') window.localStorage.setItem(CHAVE_PIX_PENDENTE, JSON.stringify(gerado));
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

    function novaDoacao(): void {
        if (typeof window !== 'undefined') window.localStorage.removeItem(CHAVE_PIX_PENDENTE);
        setEstado('pronto');
        setValorCentavos(0);
        setPix(null);
        setErro(null);
        setCopiado(false);
    }

    return (
        <div className={styles.tela}>
            <section className={styles.cartao}>
                <div className={styles.cabecalho}>
                    <h1 className={styles.titulo}>Apoie o Universo do Medo</h1>
                    <p className={styles.subtitulo}>Sua doação via Pix ajuda a manter e expandir o Universo do Medo. Contribua com o valor que quiser.</p>
                </div>

                <div className={styles.aviso_anonimo}>
                    <strong className={styles.aviso_titulo}>Doação anônima</strong>
                    <span>Feita <strong>sem vínculo com nenhuma conta</strong> — não aparece em histórico e não gera benefícios de assinatura. Para registrar no seu perfil, <button type="button" className={styles.link_acessar} onClick={() => redirecionarInterno(PAGINAS.acessar)}>entre na sua conta</button> antes de doar.</span>
                </div>

                {(estado === 'pronto' || estado === 'gerando') && (
                    <div className={styles.form}>
                        <InputComRotulo rotulo="Valor da doação">
                            <InputMoeda valorCentavos={valorCentavos} onChange={setValorCentavos} disabled={estado === 'gerando'} />
                        </InputComRotulo>
                        <p className={styles.texto_apoio}>Mínimo {formataReais(VALOR_MINIMO_CENTAVOS)} — máximo {formataReais(VALOR_MAXIMO_CENTAVOS)}.</p>
                        {/* Honeypot anti-abuso: invisível para humanos; se vier preenchido, o backend recusa. */}
                        <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.campo_armadilha} value={campoArmadilha} onChange={e => setCampoArmadilha(e.target.value)} />
                        {erro !== null && <div className={styles.erro}>{erro}</div>}
                        <button className={styles.botao_doar} onClick={doar} disabled={estado === 'gerando'}>{estado === 'gerando' ? 'Gerando...' : 'Doar via Pix'}</button>
                    </div>
                )}

                {estado === 'aguardando' && pix !== null && (
                    <div className={styles.caixa_pix}>
                        <div className={styles.caixa_pix_rotulo}>Pix copia e cola — {formataReais(pix.valorCentavos)}</div>
                        <div className={styles.copia_cola}>{pix.conteudoCopiaCola}</div>
                        <button className={styles.botao_copiar} onClick={copiar}>{copiado ? 'Copiado!' : 'Copiar código Pix'}</button>
                        <div className={styles.aguardando}>Pague o Pix no seu banco. A confirmação é automática.</div>
                    </div>
                )}

                {estado === 'pago' && (
                    <div className={styles.pago}>
                        <div className={styles.pago_texto}>Doação de {pix !== null ? formataReais(pix.valorCentavos) : ''} confirmada. Muito obrigado pelo apoio!</div>
                        <button className={styles.botao_doar} onClick={novaDoacao}>Fazer outra doação</button>
                    </div>
                )}
            </section>
        </div>
    );
};
