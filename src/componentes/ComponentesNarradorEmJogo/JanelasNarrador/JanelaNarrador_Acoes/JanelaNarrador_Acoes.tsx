import { Eventos_EnviaERecebe } from 'types-nora-api';

import { useContextoSalaDeJogo__Narrador } from 'Contextos/ContextoSalaDeJogo__Narrador/contexto';
import { eventoWs } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

export default function JanelaNarrador_Acoes() {
    const { dadosSalaDeJogo__Narrador } = useContextoSalaDeJogo__Narrador();
    
    const executaRequisicaoDeFechamentoDeSala = async () => {
        const confirmou = window.confirm('Deseja finalizar a sessao?');

        if (!confirmou) return;

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeFechamentoDeSalaAberta, { codigoSalaDeJogo: dadosSalaDeJogo__Narrador.codigoSalaDeJogo }, {
            onSuccess: () => { toast.sucesso('Sala Fechada', 'Sala fechada com sucesso', { recarregaPagina: true }); },
            onError: (err) => { toast.erro('Falha ao fechar sala', err.mensagem); },
        });
    };

    return (
        <>
            <button onClick={executaRequisicaoDeFechamentoDeSala}>Finalizar</button>
        </>
    );
};