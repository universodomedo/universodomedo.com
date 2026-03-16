'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../JogoRouteGuard';
import Conteiner_EmJogo from 'Conteineres/EmJogo/conteiner';

export default function PaginaEmJogo_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.emJogo} embrulho={JogoRouteGuard}>
            <Conteiner_EmJogo />
        </ControladorSlot>
    );
};

// function PaginaEmJogo_Narrador() {
//     const executaRequisicaoDeFechamentoDeSala = async () => {
//         const confirmou = window.confirm(`Deseja finalizar a sessao?`);

//         if (!confirmou) return;

//         eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeFechamentoDeSalaAberta, {}, {
//             onSuccess: retorno => { toast.sucesso('Sala Fechada', `Sala fechada com sucesso`, { recarregaPagina: true }); },
//             onError: err => { toast.erro('Falha ao fechar sala', err.mensagem); }
//         });
//     };

//     const executaTesteSimples = async () => {
//         eventoWs(Eventos_Envia.Jogo.eventos.executaTestePericia_PROTOTIPO, { tipo: 'TESTE_NARRADOR' });
//     };

//     return (
//         <>
//             <div className={styles.recipiente_pagina_de_jogo_conteudo}>
//                 <div className={styles.recipiente_em_sala_de_jogo_janela_mensagens_de_jogo}>
//                     <JanelaDeMensagensDeJogo />
//                 </div>
//                 <div className={styles.recipente_pagina_de_jogo_botoes}>
//                     <button onClick={executaTesteSimples}>Teste Simples</button>
//                     <button onClick={executaRequisicaoDeFechamentoDeSala}>Finalizar</button>
//                 </div>
//             </div>
//         </>
//     );
// };

// function PaginaEmJogo_Jogador() {
//     const { objetoEmJogo } = useContextoEMJOGO();

//     if (objetoEmJogo.tipoParticipante === SalaDeJogo_TipoParticipante.SALA__NARRADOR) return;

//     return (
//         <>
//             <div className={styles.recipiente_pagina_de_jogo_conteudo}>
//                 <div className={styles.recipiente_em_sala_de_jogo_janela_mensagens_de_jogo}>
//                     <JanelaDeMensagensDeJogo />
//                 </div>
//             </div>
//             {/* {objetoEmJogo.ficha && <RecipienteFichaPersonagem ficha={objetoEmJogo.ficha} />} to do */}
//         </>
//     );
// };