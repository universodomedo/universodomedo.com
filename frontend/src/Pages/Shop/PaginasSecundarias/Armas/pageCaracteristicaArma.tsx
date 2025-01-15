// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';

import DadosArma from 'Pages/Shop/PaginasSecundarias/DadosArma/page.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const { atualizaNomeCustomizado, adicionar, idBaseArmaSelecionada, mudarPaginaArma, caracteristicasDisponiveis, alternaCaracteristicaSelecionada, caracteristicasSelecionadas, pontosDeCaracteristicaTotais, requisitoCumprido } = useContextoArma();
    const pontosCaracteristicasGastos = caracteristicasSelecionadas.reduce((acc, cur) => { return acc + (cur.dadosCaracteristicaNaBase?.custoCaracteristica || 0) }, 0);
    const pontosCaracteristicasRestantes = pontosDeCaracteristicaTotais - pontosCaracteristicasGastos;

    const PainelCaracteristicas = () => {
        return (
            <div className={style.embrulho_painel_caracteristicas}>
                <div className={style.painel_caracteristicas}>
                    {!requisitoCumprido && (
                        <div className={`${style.grid_caracteristicas} ${style.linha_especial}`}>
                            {caracteristicasDisponiveis.filter(caracteristica => caracteristica.id === 1).map((caracteristica, index) => {
                                const pontosSuficientes = pontosCaracteristicasRestantes >= caracteristica.dadosCaracteristicaNaBase!.custoCaracteristica;
                                const jaEstaSelecionada = caracteristicasSelecionadas.some(carac => carac.id === caracteristica.id);

                                return (
                                    <div key={index} className={`${style.caracteristica_individual} ${jaEstaSelecionada ? style.caracteristica_selecionada : ''}`} onClick={(jaEstaSelecionada || pontosSuficientes) ? () => alternaCaracteristicaSelecionada(caracteristica.id) : undefined }>
                                        <h2>{caracteristica.nome}</h2>
                                        <p className={style.descricao_caracteristica}>{caracteristica.descricao}</p>
                                        <p className={` ${style.custo_caracteristica} ${(!pontosSuficientes && !jaEstaSelecionada) ? style.pontos_insuficientes : ''}`}>{`Custa ${caracteristica.dadosCaracteristicaNaBase?.custoCaracteristica} Pontos de Característica`}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div className={style.grid_caracteristicas}>
                        {caracteristicasDisponiveis.filter(caracteristica => caracteristica.id !== 1).sort((a, b) => { return a.nome.localeCompare(b.nome); }).map((caracteristica, index) => {
                            const pontosSuficientes = pontosCaracteristicasRestantes >= caracteristica.dadosCaracteristicaNaBase!.custoCaracteristica;
                            const jaEstaSelecionada = caracteristicasSelecionadas.some(carac => carac.id === caracteristica.id);

                            return (
                                <div key={index} className={`${style.caracteristica_individual} ${jaEstaSelecionada ? style.caracteristica_selecionada : ''}`} onClick={(jaEstaSelecionada || pontosSuficientes) ? () => alternaCaracteristicaSelecionada(caracteristica.id) : undefined }>
                                    <h2>{caracteristica.nome}</h2>
                                    <p className={style.descricao_caracteristica}>{caracteristica.descricao}</p>
                                    <p className={` ${style.custo_caracteristica} ${(!pontosSuficientes && !jaEstaSelecionada) ? style.pontos_insuficientes : ''}`}>{`Custa ${caracteristica.dadosCaracteristicaNaBase?.custoCaracteristica} Pontos de Característica`}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
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