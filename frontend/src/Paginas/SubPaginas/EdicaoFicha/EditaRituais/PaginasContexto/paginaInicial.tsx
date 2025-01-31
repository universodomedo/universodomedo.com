// #region Imports
import style from '../style.module.css';
import { GanhoIndividualNexRitual, Ritual } from 'Classes/ClassesTipos/index.ts';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx'
import { useContextoCriaRitual } from 'Contextos/ContextoCriacaoRitual/contexto.tsx';
// #endregion

const pagina = () => {
    const { mudarPaginaRitual } = useContextoCriaRitual();
    
    const { ganhosNex } = useContextoNexUp();

    const ganhoRitual = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexRitual)!;

    return (
        <>
            <div className={style.rituais_pendentes}>
                <h1>Rituais Pendentes: {ganhoRitual.numeroRituais - ganhoRitual.dadosRituais.length}</h1>
                <button onClick={() => { mudarPaginaRitual(1) }} disabled={ganhoRitual.finalizado}>Criar Ritual</button>
            </div>

            <div className={style.rituais_existentes}>
                <h1>Rituais Criados</h1>
                <div className={style.recipiente_ritual_existente}>
                    {ganhosNex.personagem.dadosFicha.rituais?.map((dadosRitual, index) => {
                        const ritual = new Ritual({ dadosGenericosRitual: dadosRitual.args, dadosComportamentos: dadosRitual.dadosComportamentos });
                        console.log(ritual);

                        return (
                            <div key={index} className={style.ritual_existente} style={{borderColor: ritual.comportamentos.comportamentoRitual.refElemento.cores.corPrimaria}}>
                                <h2>{ritual.nomeExibicao}</h2>
                                <div className={style.detalhes_ritual_existente}>
                                    <p>Conhecimento</p>
                                    <p>1º Círculo Fraco</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default pagina;