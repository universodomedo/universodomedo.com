// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';

import DadosArma from 'Pages/Shop/PaginasSecundarias/DadosArma/page.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const { atualizaNomeCustomizado, adicionar, idBaseArmaSelecionada, mudarPaginaArma, caracteristicasDisponiveis, alternaCaracteristicaSelecionada, caracteristicasSelecionadas, pontosDeCaracteristicaTotais } = useContextoArma();
    const pontosCaracteristicasGastos = caracteristicasSelecionadas.reduce((acc, cur) => { return acc + (cur.dadosCaracteristicaNaBase?.custoCaracteristica || 0) }, 0);
    const pontosCaracteristicasRestantes = pontosDeCaracteristicaTotais - pontosCaracteristicasGastos;

    const PainelCaracteristicas = () => {
        return (
            <div className={style.painel_caracteristicas}>
                {caracteristicasDisponiveis.map((caracteristica, index) => {
                    const pontosSuficientes = pontosCaracteristicasRestantes >= caracteristica.dadosCaracteristicaNaBase!.custoCaracteristica;
                    const jaEstaSelecionada = caracteristicasSelecionadas.some(carac => carac.id === caracteristica.id);

                    return (
                        <div key={index} className={`${style.caracteristica_individual} ${jaEstaSelecionada && style.caracteristica_selecionada}`} onClick={(jaEstaSelecionada || pontosSuficientes) ? () => alternaCaracteristicaSelecionada(caracteristica.id) : undefined }>
                            <div className={style.nome_caracteristica}>
                                <h2>{caracteristica.nome}</h2>
                            </div>
                            <div className={style.corpo_caracteristica}>
                                <p>{caracteristica.descricao}</p>
                            </div>
                            <div className={`${style.corpo_caracteristica} ${!pontosSuficientes && !jaEstaSelecionada && style.pontos_insuficientes}`}>
                                <p className={style.custo_caracteristica}>{`Custa ${caracteristica.dadosCaracteristicaNaBase?.custoCaracteristica} Pontos de Característica`}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className={style.area_tipo_item}>
                <h2>Adicionar Características na Arma</h2>

                <div className={style.opcao_item}>
                    <InputComRotulo rotulo={'Nome Customizado Opcional'}>
                        <input type='text' placeholder='Insira um Nome Customizado..' onChange={(e => atualizaNomeCustomizado(e.target.value))} />
                    </InputComRotulo>
                </div>

                <DadosArma mostraCaracteristicas />

                <div>
                    <h2>
                        Pontos de Características: {pontosCaracteristicasGastos}/{pontosDeCaracteristicaTotais}
                    </h2>
                </div>

                <PainelCaracteristicas />
            </div>

            <div className={style.area_botao_tipo_item}>
                <button onClick={() => { mudarPaginaArma(0) }}>Mudar Arma</button>
                <button onClick={adicionar} disabled={idBaseArmaSelecionada <= 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
};

export default page;