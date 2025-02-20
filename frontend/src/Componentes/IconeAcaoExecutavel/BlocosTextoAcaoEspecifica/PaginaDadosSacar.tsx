import React from 'react';
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';

import { Item, pluralize } from 'Classes/ClassesTipos/index.ts';
import { useClasseContextualPersonagemEstatisticasBuffaveis } from 'Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis';

export const PaginaDadosPreviosSacar = () => {
    const { extremidades } = useClasseContextualPersonagemEstatisticasBuffaveis();

    if (extremidades.filter(extremidade => extremidade.estaOcupada).length <= 0) return <></>;

    return (
        <>
            <div className={style.bloco_texto}>
                {extremidades.filter(extremidade => extremidade.estaOcupada).map((extremidade, index) => (
                    <React.Fragment key={index}>
                        <p className={style.titulo}>Extremidade {index+1}</p>
                        <p className={style.texto}>Empunhando {extremidade.refItem?.nome.nomeExibicao}</p>
                    </React.Fragment>
                ))}
            </div>
            <hr />
        </>
    );
};

export const PaginaDadosDinamicosSacar = ({ item }: { item: Item }) => {
    const empunhavel = item.comportamentoEmpunhavel!;

    return (
        <div className={style.bloco_texto}>
            <p className={`${style.texto} ${!empunhavel.custoEmpunhar.podeSerPago ? 'cor_mensagem_erro' : ''}`}>Custos para Sacar: {empunhavel.custoEmpunhar.descricaoListaPreco}</p>
            <p className={`${style.texto} ${!empunhavel.extremidadeLivresSuficiente ? 'cor_mensagem_erro' : ''}`}>{`${pluralize(empunhavel.extremidadesNecessarias, 'Extremidade')} para Empunhar: ${empunhavel.extremidadesNecessarias}`}</p>
            {empunhavel.custoEmpunhar.podeSerPago && (
                <p className={style.texto}>{`Vai gastar ${empunhavel.custoEmpunhar.resumoPagamento}`}</p>
            )}
        </div>
    );
};