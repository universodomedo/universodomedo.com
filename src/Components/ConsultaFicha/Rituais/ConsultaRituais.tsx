// #region Imports
import React from 'react';
import { Ritual } from "Types/classes";
import ConsultaGenerica from "Components/ConsultaFicha/Generica/ConsultaGenerica.tsx";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

interface ConsultaRituaisProps {
    abaId: string;
    rituais: Ritual[];
    onLoadComplete: () => void;
}

const ConsultaRituais: React.FC<ConsultaRituaisProps> = ({ abaId, rituais, onLoadComplete }) => {
    const dispatch = useDispatch();

    const clickIcone = () => {
        // abrirAbaAcao();

        dispatch(setCacheFiltros({ abaId: 'aba7', filtros: { ['(acao:Acao) => acao.refPai.nome']: ['Aprimorar Acrobacia2'] } }));
    }

    const renderRitualItem = (ritual: Ritual, index: number) => (
        <ReferenciaTooltip key={index} objeto={ritual.tooltipProps}>
            <IconeCustomizado onClick={clickIcone} props={ritual.tooltipProps.iconeCustomizado} />
        </ReferenciaTooltip>
    );

    // return (
    //     <ConsultaGenerica
    //         abaId={abaId}
    //         data={rituais}
    //         filtroProps={Ritual.filtroProps}
    //         renderItem={renderRitualItem}
    //         onLoadComplete={onLoadComplete}
    //     />
    // );

    return (
        <ConsultaProvider<Ritual> registros={rituais} filtroProps={Ritual.filtroProps}>
            <Consulta renderItem={renderRitualItem} />
        </ConsultaProvider>
    );
};

export default ConsultaRituais;