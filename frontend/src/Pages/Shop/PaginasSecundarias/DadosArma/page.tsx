// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';
// #endregion

const page = ({ mostraCaracteristicas = false }: { mostraCaracteristicas?: boolean }) => {
    const { idBaseArmaSelecionada, listaDadosArma, caracteristicasSelecionadas } = useContextoArma();

    return (
        <div className={style.visualizador_arma}>
            {idBaseArmaSelecionada > 0 && (
                <div className={style.dados_arma}>
                    {listaDadosArma.map((dadosArma, index) => (
                        <div key={index} className={style.linha_dado_arma}>
                            <span className={style.nome_dado_arma}>{dadosArma.nome}</span>
                            {dadosArma.valor !== undefined && (
                                <span className={style.valor_dado_arma}>{dadosArma.valor}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {mostraCaracteristicas && (
                <div className={style.dados_arma}>
                    {caracteristicasSelecionadas.length === 0 ? (
                        <>
                            <h2>Nenhuma Característica Selecionada</h2>
                            <h2>Selecione do painel abaixo</h2>
                        </>
                    ) : (
                        caracteristicasSelecionadas.map((caracteristicaSelecionada, index) => (
                            <div key={index} className={style.lista_caracteristicas_selecionadas}>
                                <div className={style.linha_dado_arma}>
                                    <h2 className={style.nome_dado_arma}>{`+ ${caracteristicaSelecionada.nome}`}</h2>
                                    {caracteristicaSelecionada.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas && (
                                        <div className={style.detalhes_dados}>
                                            {Object.entries(caracteristicaSelecionada.dadosCaracteristicaNaBase.dadosCaracteristicasArmas)
                                                .filter(([_, value]) => value !== undefined) // Exibe apenas valores definidos
                                                .map(([key, value]) => (
                                                    <h2 key={key}>
                                                        {`${formatarNomePropriedade(key)}: ${value}`}
                                                    </h2>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* {mostraCaracteristicas && (
                <div className={style.dados_arma}>
                    {caracteristicasSelecionadas.length === 0 ? (
                        <>
                            <h2>Nenhuma Característica Selecionada</h2>
                            <h2>Selecione do painel abaixo</h2>
                        </>
                    ) : (
                        caracteristicasSelecionadas.map((caracteristicaSelecionada, index) => (
                            <div className={style.lista_caracteristicas_selecionadas}>
                                <div key={index} className={style.linha_dado_arma}>
                                    <h2 className={style.nome_dado_arma}>{`+ ${caracteristicaSelecionada.nome}`}</h2>
                                    {caracteristicaSelecionada.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadorPeso && (
                                        <h2>Peso: {caracteristicaSelecionada.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadorPeso}</h2>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )} */}
        </div>
    );

    function formatarNomePropriedade(nome: string): string {
        return nome
            .replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de letras maiúsculas
            .replace(/^./, (str) => str.toUpperCase()) // Capitaliza a primeira letra
            .replace('Modificador ', ''); // Remove "Modificador" para simplificação (opcional)
    }
};

export default page;