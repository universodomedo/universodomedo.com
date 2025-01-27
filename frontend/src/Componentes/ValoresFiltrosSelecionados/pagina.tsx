// #region Imports
import style from "./style.module.css";

import { OpcaoFormatada, CategoriaFormatada } from 'Classes/ClassesTipos/index';
import { useConsultaContext } from 'Componentes/ConsultaGenerica/pagina';
// #endregion

const page = <T,>() => {
    const { filtroProps, valoresFiltrosSelecionados, removeFiltro } = useConsultaContext<T>();

    const handleRemoveValue = (idFiltro: number, idOpcao: string) => {
        removeFiltro(idFiltro, idOpcao);
    };

    const obtemOpcoesSelecionadas = (): { valorSelecionado: string, idFiltro: number, idOpcao: string }[] => {
        return valoresFiltrosSelecionados.flatMap((valorSelecionado) => {
            const props = filtroProps.items.filter(op => op.temOpcoes)[valorSelecionado.idFiltro];

            if (props.temCategorias()) {
                const opcoesCategoriasFiltro = props.options as CategoriaFormatada[] | undefined;

                if (!opcoesCategoriasFiltro) return [];

                return valorSelecionado.idOpcao.flatMap((opcaoSelecionada) => {
                    return opcoesCategoriasFiltro.flatMap(categoria => {
                        const opcao = categoria.options.find(op => op.value === opcaoSelecionada);
                        return opcao ? [{
                            valorSelecionado: opcao.label || opcao.value,
                            idFiltro: valorSelecionado.idFiltro,
                            idOpcao: opcaoSelecionada
                        }] : [];
                    });
                });

            } else {
                const opcoesFiltro = props.options as OpcaoFormatada[] | undefined;

                if (!opcoesFiltro) return [];

                return valorSelecionado.idOpcao.flatMap((opcaoSelecionada) => {
                    const opcao = opcoesFiltro.find(op => op.value === opcaoSelecionada);
                    return opcao ? [{
                        valorSelecionado: opcao.label || opcao.value,
                        idFiltro: valorSelecionado.idFiltro,
                        idOpcao: opcaoSelecionada
                    }] : [];
                });
            }
        });
    };

    const opcoesSelecionadas = obtemOpcoesSelecionadas();

    return (
        <>
            {opcoesSelecionadas.length > 0 && (
                <div className={style.valores_filtrados}>
                    {opcoesSelecionadas.map(({ valorSelecionado, idFiltro, idOpcao }, index) => (
                        <ValorSelecionado key={index} valorSelecionado={valorSelecionado} idFiltro={idFiltro} idOpcao={idOpcao} handleRemoveValue={handleRemoveValue} />
                    ))}
                </div>
            )}
        </>
    );
};

const ValorSelecionado = ({ valorSelecionado, idFiltro, idOpcao, handleRemoveValue }: { valorSelecionado: string, idFiltro: number, idOpcao: string, handleRemoveValue: (idFiltro: number, idOpcao: string) => void }) => {
    return (
        <div className={style.value_container}>
            <div className={style.value}>{valorSelecionado}</div>
            <BotaoFechar onClick={() => handleRemoveValue(idFiltro, idOpcao)} />
        </div>
    );
};

const BotaoFechar = ({ onClick }: { onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
    const svg = "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z";

    return (
        <div className={style.button_x} onClick={onClick} ><svg width={14} height={14} viewBox="0 0 20 20"><path d={svg}></path></svg></div>
    );
}

export default page;