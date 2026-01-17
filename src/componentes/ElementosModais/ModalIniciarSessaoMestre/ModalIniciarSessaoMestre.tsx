'use client';

import styles from './styles.module.css';

import { Eventos_EnviaERecebe, SessaoDto } from 'types-nora-api';

import { useContextoSessoesMestreEmEspera } from 'Contextos/ContextoSessoesMestreEmEspera/contexto';
import { useContadorRegressivo } from 'Componentes/Elementos/ContadorRegressivo/ContadorRegressivo';
import { eventoWs } from "Hooks/useEventoWs";
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import RecipienteCapa from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RecipienteCapa/page';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';


const dezMinMs = 10 * 60 * 1000;
const trintaMinMs = 30 * 60 * 1000;

export default function ModalIniciarSessaoMestre({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
    const { sessaoSelecionada } = useContextoSessoesMestreEmEspera();

    const dataAlvo = sessaoSelecionada?.dataPrevisaoInicio ?? Date.now();
    const { tempoRestante, diferencaMs } = useContadorRegressivo({ dataAlvo });

    // const podeIniciar = !Number.isNaN(diferencaMs) && diferencaMs <= dezMinMs && diferencaMs >= -trintaMinMs;
    const podeIniciar = true;

    if (!sessaoSelecionada) return null;

    const executaRequisicaoDeAberturaDeSala = async () => {
        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeAberturaDeSala, { idSessao: sessaoSelecionada.id }, retorno => {
            
        });
    };

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Mestre: Iniciando Sessão', subtitulo: sessaoSelecionada.tituloInteligente.tituloCompleto }} botaoAcaoPrincipal={{ execucao: () => { executaRequisicaoDeAberturaDeSala(); }, desabilitado: !podeIniciar, texto: 'Iniciar Sessão' }}>
                <ConteudoModal sessao={sessaoSelecionada} diferencaMs={diferencaMs} tempoRestante={tempoRestante} />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal({ sessao, diferencaMs, tempoRestante }: { sessao: SessaoDto, diferencaMs: number, tempoRestante: string }) {
    return (
        <div id={styles.recipiente_dados_sessao}>
            <RecipienteCapa sessao={sessao} />
            <h3>Previsão: {formataData(sessao.dataPrevisaoInicio, 'dd/MM/yyyy HH:mm')}</h3>
            <DadosPrevisao diferencaMs={diferencaMs} tempoRestante={tempoRestante} />
        </div>
    );
};

function DadosPrevisao({ diferencaMs, tempoRestante }: { diferencaMs: number, tempoRestante: string }) {
    let mensagem = '';

    if (!Number.isNaN(diferencaMs)) {
        if (diferencaMs > dezMinMs) mensagem = `Você poderá iniciar essa sessão em ${tempoRestante}`;
        if (diferencaMs <= dezMinMs && diferencaMs >= -trintaMinMs) mensagem = 'Você pode iniciar essa sessão agora!';
        if (diferencaMs < -trintaMinMs) mensagem = 'Essa sessão atrasou e não pode mais ser iniciada';
    }

    return mensagem ? (<h3>{mensagem}</h3>) : (<></>);
};
