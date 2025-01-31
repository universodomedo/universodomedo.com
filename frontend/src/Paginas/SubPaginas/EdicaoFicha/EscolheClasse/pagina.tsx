// #region Imports
import style from './style.module.css';

import CarrosselClasses from 'Componentes/Carrosseis/CarrosselClasses/pagina.tsx';
// #endregion

const page = () => {
    return (
        <>
            <CarrosselClasses />

            <div className={style.recipiente_descricao_classe}>
                <h3>Combatentes tem os melhores Ganhos de Estatísticas, além de receber Pontos de Atributos Bônus durante seu crescimento</h3>
            </div>
        </>
    );
};

export default page;