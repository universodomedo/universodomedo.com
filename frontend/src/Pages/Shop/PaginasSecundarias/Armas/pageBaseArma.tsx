// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useEffect, useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';
import { basesArma, classificacoesArma, patentesArma, tiposArma } from 'Types/classes/index.ts';

import DadosArma from 'Pages/Shop/PaginasSecundarias/DadosArma/page.tsx';
import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const { mudarPagina } = useContextoLoja();
    const { idBaseArmaSelecionada, mudarPaginaArma, selecionarBaseArma } = useContextoArma();

    const [tipoArma, setTipoArma] = useState(0);
    const [patenteArma, setPatenteArma] = useState(0);
    const [classificacaoArma, setClassificacaoArma] = useState(0);

    const tipoArmaSelecionado = (tiposArma[tipoArma - 1] ? tiposArma[tipoArma - 1].nome : '');
    const patenteArmaSelecionada = (patentesArma[patenteArma - 1] ? patentesArma[patenteArma - 1].nome : '');

    const classificacoesFiltradas = (tipoArma > 0 && patenteArma > 0)
        ? classificacoesArma.filter(c => c.idTipoArma === tipoArma && c.idsPatentesArma.includes(patenteArma))
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
    };

    useEffect(() => {
        if (tipoArma && patenteArma && classificacaoArma) selecionarBaseArma(
            basesArma.find(base => base.composicaoBaseArma.idTipo === tipoArma && base.composicaoBaseArma.idClassificacao === classificacaoArma && base.composicaoBaseArma.idPatente === patenteArma)!.id
        );
    }, [classificacaoArma])

    return (
        <>
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

                <DadosArma />

            </div>
            <div className={style.area_botao_tipo_item}>
                <button onClick={() => { mudarPagina(0) }}>Voltar</button>
                <button onClick={() => { mudarPaginaArma(1) }} disabled={idBaseArmaSelecionada <= 0} className={style.botao_adicionar}>Prosseguir</button>
            </div>
        </>
    );
}

export default page;