// #region Imports
import style from "./style.module.css";
import { useConsultaContext } from "Components/ConsultaFicha/page.tsx";
import { OpcaoFormatada, CategoriaFormatada } from "Types/classes.tsx";
// #endregion

const page = <T,>() => {
    const { valoresFiltrosSelecionados, filtroProps, handleFiltro } = useConsultaContext<T>();

    const handleRemoveValue = (key: string, valorSelecionado: string) => {
        const valoresAtualizados = valoresFiltrosSelecionados[key].filter(valor => valor !== valorSelecionado);
        handleFiltro(key, valoresAtualizados);
    };

    // Função para buscar o label pelo valor selecionado
    const getLabelByValue = (key: string, valorSelecionado: string) => {
        const filtroConfig = filtroProps.items.find(f => f.key === key);
        
        if (!filtroConfig || !filtroConfig.options) {
            return valorSelecionado; // Retorna o próprio valor se não houver label correspondente
        }

        // Procura o label correspondente ao valor
        const opcaoEncontrada = filtroConfig.temCategorias()
            ? (filtroConfig.options as CategoriaFormatada[]).flatMap(categoria => categoria.options)
                  .find(opcao => opcao.value === valorSelecionado)
            : (filtroConfig.options as OpcaoFormatada[]).find(opcao => opcao.value === valorSelecionado);

        return opcaoEncontrada ? opcaoEncontrada.label : valorSelecionado;
    };

    return (
        <div className={style.div_teste}>
            {/* {valoresFiltrosSelecionados.map((valorSelecionado: {key: string}, index:number) => (
                <ValorSelecionado key={index} valorSelecionado={valorSelecionado.key}/>
            ))} */}
            {Object.entries(valoresFiltrosSelecionados).map(([key, valoresSelecionados]) => (
                valoresSelecionados.map(valorSelecionado => (
                    <ValorSelecionado key={key} valorSelecionado={getLabelByValue(key, valorSelecionado)} handleRemoveValue={() => handleRemoveValue(key, valorSelecionado)}/>
                ))
            ))}
        </div>
    );
}

const ValorSelecionado = ({ valorSelecionado, handleRemoveValue }: { valorSelecionado:string, handleRemoveValue: () => void }) => {
    return (
        <div className={style.value_container}>
            <div className={style.value}>{valorSelecionado}</div>
            <BotaoFechar onClick={handleRemoveValue}/>
        </div>
    )
}

const BotaoFechar = ({ id, onClick }: { id?: string; onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
    const svg = "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z";

    return (
        <div className={style.button_x} id={id} onClick={onClick} ><svg width={14} height={14} viewBox="0 0 20 20"><path d={svg}></path></svg></div>
    );
}

export default page;