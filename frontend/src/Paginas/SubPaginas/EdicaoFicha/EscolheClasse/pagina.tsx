// #region Imports
import style from './style.module.css';

import { GanhoIndividualNexEscolhaClasse } from 'Classes/ClassesTipos/index.ts';
import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto';

import CarrosselClasses from 'Componentes/Carrosseis/CarrosselClasses/pagina.tsx';
// #endregion

const page = () => {
    const { ganhosNex } = useContextoNexUp();
    
    const ganhoClasse = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexEscolhaClasse)!;

    return (
        <>
            <CarrosselClasses />

            <div className={style.recipiente_descricao_classe}>
                <h3>{ganhoClasse.refClasseEscolhida?.descricao}</h3>
            </div>
        </>
    );
};

export default page;