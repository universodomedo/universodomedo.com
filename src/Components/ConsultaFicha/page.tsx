// #region Imports
import { createContext, useContext, useState, useEffect, useRef } from "react";
import style from "./style.module.css";
import Select from "react-select";
import { FiltroProps, OpcaoFormatada, CategoriaFormatada, FiltroPropsItems } from "Types/classes.tsx";
import ValoresFiltrosSelecionados from "Components/ValoresFiltrosSelecionados/page.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from 'Redux/store.ts';
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

interface ConsultaContextProps<T> {
    registros: T[];
    registrosFiltrados: T[];
    filtroProps: FiltroProps<T>;
    ordenacao: { key: string | number | symbol | ((item: T) => any); direction: 'asc' | 'desc' } | null;
    valoresFiltrosSelecionados: { [key: string]: string[] };
    handleFiltro: (key: string | number | symbol | ((item: any) => any), values: string[]) => void;
    handleOrdenacao: (key: string | number | symbol | ((item: T) => any), direction: 'asc' | 'desc') => void;
};

const ConsultaContext = createContext<ConsultaContextProps<any> | undefined>(undefined);

export const useConsultaContext = <T,>(): ConsultaContextProps<T> => {
    const context = useContext(ConsultaContext);

    if (!context) {
        throw new Error('useConsultaContext precisa estar dentro de um ConsultaProvider');
    }

    return context;
};

export const ConsultaProvider = <T,>({ abaId, children, registros, filtroProps, onLoadComplete }: { abaId:string; children: React.ReactNode; registros: T[]; filtroProps: FiltroProps<T>; onLoadComplete: () => void; }) => {
    const [registrosFiltrados, setRegistrosFiltrados] = useState<T[]>(registros);
    const [ordenacao, setOrdenacao] = useState<{ key: string | number | symbol | ((item: T) => any); direction: 'asc' | 'desc' } | null>(null);
    const [valoresFiltrosSelecionados, setValoresFiltrosSelecionados] = useState<{ [key: string]: string[] }>({});
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<{ label: string; idFiltro: string; idOpcao: string }[]>([]);

    const dispatch = useDispatch();
    const abaState = useSelector((state: RootState) => state.abasHelper[abaId]);

    const filtrosRef = useRef(valoresFiltrosSelecionados);

    const getKeyValue = (item: T, key: keyof T | ((item: T) => any)) => {
        return typeof key === 'function' ? key(item) : item[key];
    };

    const handleFiltro = (key: string | number | symbol | ((item: any) => any), values: string[]) => {
        setValoresFiltrosSelecionados((prev) => ({ ...prev, [key as string]: values }));
    };

    const handleOrdenacao = (key: string | number | symbol | ((item: T) => any), direction: 'asc' | 'desc') => {
        setOrdenacao({ key, direction });

        const sortedData = [...registrosFiltrados].sort((a, b) => {
            const aValue = typeof key === "function" ? key(a) : (a[key as keyof T] as any);
            const bValue = typeof key === "function" ? key(b) : (b[key as keyof T] as any);

            if (aValue < bValue) return direction === "asc" ? -1 : 1;
            if (aValue > bValue) return direction === "asc" ? 1 : -1;
            
            return 0;
        });

        setRegistrosFiltrados(sortedData);
    };

    const atualizarOpcoesSelecionadas = () => {
        const opcoesAtualizadas = Object.entries(valoresFiltrosSelecionados).flatMap(([key, valoresSelecionados]) => {
            const filtroConfig = filtroProps.items.find(f => f.key === key);
            if (!filtroConfig || !filtroConfig.options) {
                return [];
            }

            return valoresSelecionados.map(valorSelecionado => {
                const opcao = filtroConfig.temCategorias()
                    ? (filtroConfig.options as CategoriaFormatada[]).flatMap(categoria => categoria.options).find(opcao => opcao.value === valorSelecionado)
                    : (filtroConfig.options as OpcaoFormatada[]).find(opcao => opcao.value === valorSelecionado);

                return {
                    label: opcao?.label || valorSelecionado,
                    idFiltro: key,
                    idOpcao: valorSelecionado
                };
            });
        });

        setOpcoesSelecionadas(opcoesAtualizadas);
    };

    useEffect(() => {
        if (abaState && abaState.filtros) {
            setValoresFiltrosSelecionados(abaState.filtros);
        }

        onLoadComplete();
    }, []);

    useEffect(() => {
        filtrosRef.current = valoresFiltrosSelecionados;

        const dadosFiltrados = registros.filter((item) => {
            return filtroProps.items.every((config) => {
                const filtroValores = valoresFiltrosSelecionados[config.key as string] || [];
                const itemValor = String(getKeyValue(item, config.key)).toLowerCase();

                return (filtroValores.length === 0 || filtroValores.some((filtro) => itemValor.includes(filtro.toLowerCase())));
            });
        });

        setRegistrosFiltrados(dadosFiltrados);

        return () => {
            dispatch(setCacheFiltros({ abaId, filtros: valoresFiltrosSelecionados }));
        };
    }, [valoresFiltrosSelecionados]);

    return (
        <ConsultaContext.Provider value={{ registros, registrosFiltrados, filtroProps, ordenacao, valoresFiltrosSelecionados, handleFiltro, handleOrdenacao }}>
            {children}
        </ConsultaContext.Provider>
    );
};

export const Consulta = <T,>({ renderItem }: { renderItem: (item: T, index: number) => React.ReactNode }) => {
    const { filtroProps, registros, registrosFiltrados } = useConsultaContext<T>();

    return (
        <div className={style.conteudo_consulta}>
            <h1>{filtroProps.titulo} [{registros.length}]</h1>

            <Filtro />

            <ValoresFiltrosSelecionados />

            <div className={style.registros}>
                {registrosFiltrados.map((item, index) => renderItem(item, index))}
            </div>

            <div className={style.total_exibidos}>
                <p>Registros exibidos: {registrosFiltrados.length}</p>
            </div>
        </div>
    );
};

const Filtro = <T,>() => {
    const { filtroProps } = useConsultaContext<T>();

    return (
        <div className={style.div_filtros}>
            {filtroProps.items.map((config, index) => (
                <FiltroItem key={index} config={config as FiltroPropsItems<T>} />
            ))}
        </div>
    );
};

const FiltroItem = <T,>({ config } : { config: FiltroPropsItems<T> }) => {
    const { ordenacao, handleOrdenacao } = useConsultaContext<T>();

    const handleClickOrdenacao = (key: keyof T | ((item: T) => any)) => {
        if (ordenacao?.key === key) {
            handleOrdenacao(key, ordenacao.direction === 'asc' ? 'desc' : 'asc');
        } else {
            handleOrdenacao(key, 'asc');
        }
    };

    return (
        <div className={style.div_filtro}>
            <span onClick={() => config.sortEnabled && handleClickOrdenacao(config.key)}>
                {config.label}
                {ordenacao?.key === config.key && (
                    <span>{ordenacao!.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
            </span>

            <CaixaFiltroItem config={config} />
        </div>
    );
}

const CaixaFiltroItem = <T,>({ config } : { config: FiltroPropsItems<T> }) => {
    const { valoresFiltrosSelecionados, handleFiltro } = useConsultaContext<T>();

    return (
        <>
            {config.filterType === 'select' && config.options ? (
                <Select
                    isMulti
                    value={
                        config.temCategorias()
                            ? (config.options as CategoriaFormatada[])
                                .flatMap(categoria => categoria.options)
                                .filter(option => valoresFiltrosSelecionados[config.key as string]?.includes(option.value))
                                .map(option => ({ value: option.value, label: option.label }))
                            : (config.options as OpcaoFormatada[])
                                .filter((option) => valoresFiltrosSelecionados[config.key as string]?.includes(option.value))
                                .map((option) => ({ value: option.value, label: option.label }))
                    }
                    options={config.options}
                    onChange={(selectedOptions) => handleFiltro(config.key, selectedOptions.map((option) => option.value))}
                    placeholder={`Selecione`}
                    styles={{
                        control: (provided) => ({ ...provided, flexGrow: 1, minWidth: 0, maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }),
                        multiValue: (provided) => ({ ...provided, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }),
                        valueContainer: (provided) => ({ ...provided, display: 'flex', flexWrap: 'nowrap', overflow: 'hidden', whiteSpace: 'nowrap' }),
                        multiValueLabel: (provided) => ({ ...provided, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                    }}
                    controlShouldRenderValue={false}
                />
            ) : (
                <input
                    type={config.filterType}
                    placeholder={`Filtrar por ${config.label}`}
                    value={valoresFiltrosSelecionados[config.key as string]?.[0] || ""}
                    onChange={(e) => handleFiltro(config.key, [e.target.value])}
                />
            )}
        </>
    );
}