// #region Imports
import { createContext, useContext, useState, useEffect, useRef } from "react";
import style from "./style.module.css";
import Select, { ActionMeta, components, MultiValue, PlaceholderProps, ValueContainerProps } from "react-select";
import { FiltroProps, OpcaoFormatada, CategoriaFormatada, FiltroPropsItems } from 'Types/classes/index.ts';
import ValoresFiltrosSelecionados from "Components/ValoresFiltrosSelecionados/page.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from 'Redux/store.ts';
import { setCacheFiltros, setUpdated } from "Redux/slices/abasHelperSlice.ts";
import InputLimpavel from "Components/SubComponents/InputLimpavel/page.tsx";
// #endregion

interface OpcoesSelecionadas { idFiltro: number, idOpcao: string[] }

interface ConsultaContextProps<T> {
    registros: T[][];
    registrosFiltrados: T[][];
    mostrarFiltro: boolean;
    filtroProps: FiltroProps<T>;
    valoresFiltrosSelecionados: OpcoesSelecionadas[];
    ordenacao: { key: string | number | symbol | ((item: T) => any), direction: 'asc' | 'desc' } | null;
    handleFiltro: (opcoesSelecionadas: OpcoesSelecionadas[]) => void;
    removeFiltro: (idFiltro: number, idOpcao: string) => void;
    handleOrdenacao: (key: string | number | symbol | ((item: T) => any), direction: 'asc' | 'desc') => void;
    tituloDivisoesConsulta: { usaSubtitulos: boolean, divisoes: string[] };
};

const ConsultaContext = createContext<ConsultaContextProps<any> | undefined>(undefined);

export const useConsultaContext = <T,>(): ConsultaContextProps<T> => {
    const context = useContext(ConsultaContext);

    if (!context) {
        throw new Error('useConsultaContext precisa estar dentro de um ConsultaProvider');
    }

    return context;
};

export const ConsultaProvider = <T,>({ abaId, children, registros, mostrarFiltro = true, filtroProps, onLoadComplete, tituloDivisoesConsulta }: { abaId: string; children: React.ReactNode; registros: T[][]; mostrarFiltro?: boolean; filtroProps: FiltroProps<T>; onLoadComplete: () => void; tituloDivisoesConsulta: { usaSubtitulos: boolean, divisoes: string[] }; }) => {
    const [registrosFiltrados, setRegistrosFiltrados] = useState<T[][]>(registros);
    const [ordenacao, setOrdenacao] = useState<{ key: string | number | symbol | ((item: T) => any), direction: 'asc' | 'desc' } | null>(null);
    const [valoresFiltrosSelecionados, setValoresFiltrosSelecionados] = useState<OpcoesSelecionadas[]>([]);

    const dispatch = useDispatch();
    const abaState = useSelector((state: RootState) => state.abasHelper[abaId]);

    const filtrosRef = useRef(valoresFiltrosSelecionados);

    const updateFilteredDataRedux = () => {
        dispatch(setCacheFiltros({ abaId, filtro: valoresFiltrosSelecionados }))
    }

    const getKeyValue = (item: T, key: keyof T | ((item: T) => any)) => {
        return typeof key === 'function' ? key(item) : item[key];
    };

    const handleFiltro = (opcoesSelecionadas: OpcoesSelecionadas[]) => {
        setValoresFiltrosSelecionados((prevState) => {
            const filtrosSemOAtualizado = prevState.filter(
                (filtro) => filtro.idFiltro !== opcoesSelecionadas[0].idFiltro
            );

            return [...filtrosSemOAtualizado, ...opcoesSelecionadas];
        });
    };

    const removeFiltro = (idFiltro: number, idOpcao: string) => {
        setValoresFiltrosSelecionados((prevValores) => {
            const novoEstado = prevValores.map((filtro) => {
                if (filtro.idFiltro === idFiltro) {
                    const novasOpcoes = filtro.idOpcao.filter((opcao) => opcao !== idOpcao);

                    return { ...filtro, idOpcao: novasOpcoes };
                }

                return filtro;
            }).filter(filtro => filtro.idOpcao.length > 0);

            return novoEstado;
        });
    };

    const handleOrdenacao = (key: string | number | symbol | ((item: T) => any), direction: 'asc' | 'desc') => {
        setOrdenacao({ key, direction });

        const sortedData = registros.map((registros) => {
            return [...registros].sort((a, b) => {
                const aValue = typeof key === "function" ? key(a) : (a[key as keyof T] as any);
                const bValue = typeof key === "function" ? key(b) : (b[key as keyof T] as any);
                if (aValue < bValue) return direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        });

        setRegistrosFiltrados(sortedData);
    };

    useEffect(() => {
        if (abaState) {
            setValoresFiltrosSelecionados(abaState.opcoesSelecionadas);
        }

        onLoadComplete();
    }, []);

    useEffect(() => {
        if (abaState && abaState.updateExterno) {
            setValoresFiltrosSelecionados(abaState.opcoesSelecionadas);
            dispatch(setUpdated({ abaId }));
        }
    }, [abaState])

    useEffect(() => {
        filtrosRef.current = valoresFiltrosSelecionados;

        const listaDeListaDeRegistros = registros.map((listaRegistros) => {
            return listaRegistros.filter((registros) => {
                return valoresFiltrosSelecionados.every((filtro) => {
                    const idFiltro = filtro.idFiltro;
                    const opcoesSelecionadas = filtro.idOpcao;

                    const filtroConfig = filtroProps.items[idFiltro];

                    if (!filtroConfig) return true;

                    const itemValor = String(getKeyValue(registros, filtroConfig.key)).toLowerCase();

                    if (filtroConfig.filterType === 'select')
                        return (opcoesSelecionadas.length === 0 || opcoesSelecionadas.some((opcaoId) => itemValor === opcaoId.toLowerCase()));
                    return (opcoesSelecionadas.length === 0 || opcoesSelecionadas.some((opcaoId) => itemValor.includes(opcaoId.toLowerCase())));
                })
            })
        })

        setRegistrosFiltrados(listaDeListaDeRegistros);

        return () => {
            updateFilteredDataRedux();
        };
    }, [registros, valoresFiltrosSelecionados]);

    return (
        <ConsultaContext.Provider value={{ registros, registrosFiltrados, mostrarFiltro, filtroProps, valoresFiltrosSelecionados, ordenacao, handleFiltro, removeFiltro, handleOrdenacao, tituloDivisoesConsulta }}>
            {children}
        </ConsultaContext.Provider>
    );
};

export const Consulta = <T,>({ renderItem }: { renderItem: (item: T, index: number) => React.ReactNode }) => {
    const { mostrarFiltro, filtroProps, registros, registrosFiltrados, tituloDivisoesConsulta } = useConsultaContext<T>();

    return (
        <div className={style.conteudo_consulta}>
            <h1>{filtroProps.titulo} [{registros.reduce((total, registros) => total + registros.length, 0)}]</h1>

            {mostrarFiltro && (
                <>
                    <Filtro />
                    <ValoresFiltrosSelecionados />
                </>
            )}
            
            {registrosFiltrados.length > 0 && (
                registrosFiltrados.map((registros, index) => (
                    registros.length > 0 && (
                        <div key={index} className={style.divisao_registros}>
                            {tituloDivisoesConsulta.usaSubtitulos && tituloDivisoesConsulta.divisoes[index] && (
                                <h2>{tituloDivisoesConsulta.divisoes[index]}</h2>
                            )}
                            <div className={style.registros}>
                                {registros.map((item, index) => renderItem(item, index))}
                            </div>
                        </div>
                    )
                ))
            )}

            <div className={style.total_exibidos}>
                <p>Registros exibidos: {registrosFiltrados.reduce((total, registrosFiltrados) => total + registrosFiltrados.length, 0)}</p>
            </div>
        </div>
    );
};

const Filtro = <T,>() => {
    const { filtroProps } = useConsultaContext<T>();

    return (
        <>
            {filtroProps.items.length > 0 && (
                <div className={style.div_filtros}>
                    {filtroProps.items.map((config, index) => (
                        <FiltroItem key={index} idFiltro={index} config={config as FiltroPropsItems<T>} />
                    ))}
                </div>
            )}
        </>
    );
};

const FiltroItem = <T,>({ idFiltro, config }: { idFiltro: number, config: FiltroPropsItems<T> }) => {
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

            <CaixaFiltroItem idFiltro={idFiltro} config={config} />
        </div>
    );
}

const CaixaFiltroItem = <T,>({ idFiltro, config }: { idFiltro: number, config: FiltroPropsItems<T> }) => {
    const { valoresFiltrosSelecionados, handleFiltro } = useConsultaContext<T>();

    const filtroAtual = valoresFiltrosSelecionados.find((filtro) => filtro.idFiltro === idFiltro);

    const opcoesSelecionadas = filtroAtual ? filtroAtual.idOpcao : [];

    const handleChangeMulti = (selectedOptions: MultiValue<{ value: string; label: string }>, actionMeta: ActionMeta<{ value: string; label: string }>) => {
        const opcoesMapeadas = selectedOptions.map((option) => option.value);

        const objetoFiltro = { idFiltro, idOpcao: opcoesMapeadas };

        handleFiltro([objetoFiltro]);
    };

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentText = event.target.value;

        handleFiltro([{ idFiltro, idOpcao: [currentText] }]);
    }

    return (
        <>
            {config.filterType === 'select' && config.options ? (
                <Select
                    isMulti
                    value={
                        config.temCategorias()
                            ? (config.options as CategoriaFormatada[])
                                .flatMap((categoria) => categoria.options)
                                .filter((option) => opcoesSelecionadas.includes(String(option.value)))
                                .map((option) => ({ value: option.value, label: option.label }))
                            : (config.options as OpcaoFormatada[])
                                .filter((option) => opcoesSelecionadas.includes(String(option.value)))
                                .map((option) => ({ value: option.value, label: option.label }))
                    }
                    options={
                        config.temCategorias()
                            ? (config.options as CategoriaFormatada[])
                            : (config.options as OpcaoFormatada[])
                    }
                    onChange={handleChangeMulti}
                    placeholder={config.placeholder}
                    controlShouldRenderValue={false}
                    components={{ Placeholder: CustomPlaceholder }}
                />
            ) : config.filterType === 'text' ? (
                <InputLimpavel type={config.filterType} placeholder={config.placeholder} value={opcoesSelecionadas[0]} onChange={handleChangeText} />
            ) : ''}
        </>
    );
};

const CustomPlaceholder = (props: PlaceholderProps<{ value: string, label: string }, true>) => {
    const selectedValues = props.getValue() as { value: string, label: string }[];
    const contador = selectedValues.length;

    const mensagem = `${contador} ${(contador === 1 ? 'Opção Selecionada' : 'Opções Selecionadas')}`;

    return (
        <components.Placeholder {...props}>
            {contador > 0 ? `${mensagem}` : props.children}
        </components.Placeholder>
    );
};