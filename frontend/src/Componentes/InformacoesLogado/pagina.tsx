// #region Imports
import style from './style.module.css';
// #endregion

const page = () => {
    const logado: boolean = true;

    const InfoLogado = () => {
        return (
            <div id={style.logavel}>
                <div id={style.imagem_logavel} />
                <div id={style.info_logavel}>
                    <h2 className='noMargin'>Nome Logado</h2>
                    <h3 className='noMargin'>Informações Logado</h3>
                </div>
            </div>
        );
    }

    const InfoDeslogado = () => {
        return (
            <div id={style.logavel}>
                <div id={style.info_logavel}>
                    <h2 className='noMargin'>Acesse</h2>
                    <h3 className='noMargin'>Para criar um Personagem</h3>
                </div>
            </div>
        );
    }

    return (
        <>
            {logado ? (
                <InfoLogado/>
            ) : (
                <InfoDeslogado/>
            )}
        </>
    );
}

export default page;