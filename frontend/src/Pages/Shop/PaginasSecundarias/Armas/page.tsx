// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { basesArma, caracteristicasArmas, classificacoesArma, patentesArma, tiposArma, dadosItem } from 'Types/classes/index.ts';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const { mudarPagina, adicionarItem } = useContextoLoja();

    const [tipoArma, setTipoArma] = useState(0);
    const [patenteArma, setPatenteArma] = useState(0);
    const [classificacaoArma, setClassificacaoArma] = useState(0);

    // temporario
    const [caracteristica, setCaracteristica] = useState(0);

    const tipoArmaSelecionado = (tiposArma[tipoArma-1] ? tiposArma[tipoArma-1].nome : '');
    const patenteArmaSelecionada = (patentesArma[patenteArma-1] ? patentesArma[patenteArma-1].nome : '');
    const classificacaoArmaSelecionada = (classificacoesArma[classificacaoArma-1] ? classificacoesArma[classificacaoArma-1].nome : '');
    const baseArmaSelecionada = basesArma.find(base => base.composicaoBaseArma.idTipo === tipoArma && base.composicaoBaseArma.idClassificacao === classificacaoArma && base.composicaoBaseArma.idPatente === patenteArma)!;

    const classificacoesFiltradas = (tipoArma > 0 && patenteArma > 0)
        ? classificacoesArma.filter(c => c.idTipoArma === tipoArma && c.idsPatentesArma.includes(patenteArma))
        : [];

    const caracteristicasDisponiveis = patenteArma > 0
        ? caracteristicasArmas.filter(caracteristica => caracteristica.basesArmaPermitidas.some(
            base => base.idTipo === tipoArma && base.idClassificacao === classificacaoArma && base.idPatente === patenteArma
        ))
        : [];


    const handleTipoArmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoArma(Number(e.target.value));
        setClassificacaoArma(0);
        setPatenteArma(0);
    };

    const handlePatenteArmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPatenteArma(Number(e.target.value));
        setClassificacaoArma(0);
    };

    const handleClassificacaoArmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClassificacaoArma(Number(e.target.value));

        console.log('handleClassificacaoArmaChange');

        const teste = basesArma.find(base => base.composicaoBaseArma.idTipo === tipoArma && base.composicaoBaseArma.idPatente === patenteArma && base.composicaoBaseArma.idClassificacao === Number(e.target.value))?.id;
        console.log(`A Base selecionada foi a ${teste}`);
    };

    const handleCaracteristicasArmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCaracteristica(Number(e.target.value));
    };

    const adicionar = () => {
        const dadosItem: dadosItem = {
            idTipoItem: 1,
            nomeItem: { nomePadrao: `${tipoArmaSelecionado} ${classificacaoArmaSelecionada} ${patenteArmaSelecionada}` },
            peso: baseArmaSelecionada.peso,
            categoria: baseArmaSelecionada.categoria,
            detalhesItem: { precisaEstarEmpunhado: true },
            detalhesArma: {
                danoMin: baseArmaSelecionada.danoMin,
                danoMax: baseArmaSelecionada.danoMax,
                numeroExtremidadesUtilizadas: baseArmaSelecionada.numeroExtremidadesUtilizadas,
                idAtributoUtilizado: baseArmaSelecionada.idAtributoUtilizado,
                idPericiaUtilizada: baseArmaSelecionada.idPericiaUtilizada,
            },
            dadosAcoes: [ {
                nomeAcao: 'Realizar Ataque',
                idTipoAcao: 2,
                idCategoriaAcao: 1,
                idMecanica: 6,
                custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] },
                requisitos: [2],
            } ],
        };

        adicionarItem(dadosItem);
    }

    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Arma</h2>

                <div className={style.opcao_item}>
                    <InputComRotulo rotulo={'Tipo de Arma'}>
                        <select value={tipoArma} onChange={handleTipoArmaChange}> <option value="0" disabled>Selecione o Tipo de Arma</option> {tiposArma.map(tipo => (<option key={tipo.id} value={tipo.id}>{tipo.nome}</option>))}</select>
                    </InputComRotulo>
                </div>

                <div className={style.opcao_item}>
                    <InputComRotulo rotulo={'Patente da Arma'}>
                        <select value={patenteArma} onChange={handlePatenteArmaChange} disabled={tipoArma === 0}> <option value="0" disabled>Selecione a Patente da Arma</option> {patentesArma.map(patente => patente && (<option key={patente.id} value={patente.id}>{`${tipoArmaSelecionado} ${patente.nome}`}</option>))}</select>
                    </InputComRotulo>
                </div>

                <div className={style.opcao_item}>
                    <InputComRotulo rotulo={'Classificação da Arma'}>
                        <select value={classificacaoArma} onChange={handleClassificacaoArmaChange} disabled={patenteArma === 0}> <option value="0" disabled>Selecione a Classificação da Arma</option> {classificacoesFiltradas.map(classificacao => (<option key={classificacao.id} value={classificacao.id}>{`${tipoArmaSelecionado} ${classificacao.nome} ${patenteArmaSelecionada}`}</option>))}</select>
                    </InputComRotulo>
                </div>

                {classificacaoArma > 0 && (
                    <>
                        <div className={style.opcao_arma}>
                            <InputComRotulo rotulo={'Características da Arma'}>
                                <select value={caracteristica} onChange={handleCaracteristicasArmaChange} disabled={!(classificacaoArma > 0)}> <option value="0" disabled>Selecione Caracteristicas</option> {caracteristicasDisponiveis.map((caracteristica, index) => (<option key={index} value={index}>{caracteristica.nome}</option>))}</select>
                            </InputComRotulo>
                        </div>
                        
                        <div className={style.info_arma}>
                            <span>Peso: {baseArmaSelecionada.peso}</span>
                            <span>Categoria: {baseArmaSelecionada.categoria}</span>
                            <span>Dano Mínimo: {baseArmaSelecionada.danoMin}</span>
                            <span>Dano Máximo: {baseArmaSelecionada.danoMax}</span>
                            <span>Extremidades: {baseArmaSelecionada.numeroExtremidadesUtilizadas}</span>
                            <span>Id Atributo: {baseArmaSelecionada.idAtributoUtilizado}</span>
                            <span>Id Perícia: {baseArmaSelecionada.idPericiaUtilizada}</span>
                        </div>
                    </>
                )}

                <div className={style.area_botao_tipo_item}>
                    <button onClick={() => {mudarPagina(0)}}>Voltar</button>
                    <button onClick={adicionar} disabled={classificacaoArma === 0} className={style.botao_adicionar}>Adicionar</button>
                </div>
        </div>
    );
}

export default page;