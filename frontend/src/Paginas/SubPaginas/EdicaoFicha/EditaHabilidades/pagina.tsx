// #region Imports
import style from './style.module.css';
import { useEffect } from 'react';

import { GanhoIndividualNexHabilidade } from 'Classes/ClassesTipos/index.ts';
import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';
// #endregion

const pagina = () => {
    const { ganhosNex, triggerSetState } = useContextoNexUp();

    useEffect(() => {
        const ganhoHabilidade = ganhosNex.etapa as GanhoIndividualNexHabilidade;
        if (ganhoHabilidade.dadosHabilidades.length < ganhoHabilidade.numeroHabilidadesEsperadoNoFim) ganhoHabilidade.dadosHabilidades.push({ props: { nome: 'Habilidade Especial', descricao: 'Essa habilidade não faz nada' } });
        triggerSetState();
    }, []);

    return (
        <>
            <div className={style.recipiente_habilidades}>
                <h1>Habilidade Especial</h1>
                <h2>Essa Habilidade Especial não faz nada</h2>
            </div>

            {/* <div className={style.recipiente_botao_salva_ritual}>
                <button onClick={adicionaRitual}>Adicionar Ritual</button>
            </div> */}
        </>
    );
}

export default pagina;