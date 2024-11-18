// #region Imports
import style from "./style.module.css";
import { useState, useEffect } from 'react';

import { GastaCustoProps, OpcoesExecucao, TooltipProps } from 'Types/classes/index.ts';

import PopoverComponente from 'Recursos/Componentes/Popover/page.tsx';
import { Tooltip } from 'Recursos/Componentes/Tooltip/page.tsx';
import Modal from "Recursos/Componentes/ModalDialog/page.tsx";
// #endregion


const page = ({ tooltipProps, desabilitado, textoBotaoConfirmar, opcoes, exec }: { tooltipProps: TooltipProps, textoBotaoConfirmar: string, desabilitado?: boolean, opcoes?: OpcoesExecucao[], exec: { executaEmModal: boolean, func: (...args: any[]) => any } }) => {
    const [openExec, setOpenExec] = useState(false);
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const icone = () => {
        return (
            <button className={style.icon_button}>
                <Tooltip content={tooltipProps.caixaInformacao.principal.titulo}>
                    <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${tooltipProps.iconeCustomizado?.svg})`, backgroundColor: tooltipProps.iconeCustomizado?.corDeFundo }}/>
                </Tooltip>
            </button>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{tooltipProps.caixaInformacao.principal.titulo}</h2>
                <div className={style.acoes}>
                    {!desabilitado && (
                        <>
                            {exec.executaEmModal ? (
                                <Modal open={openExec} onOpenChange={(isOpen) => {setOpenExec(isOpen); if (!isOpen) close();}}>
                                    <Modal.Button>
                                        {textoBotaoConfirmar}
                                    </Modal.Button>

                                    <Modal.Content title={`Executando ${tooltipProps.caixaInformacao.principal.titulo}`}>
                                        {/* <ConteudoExecucao props={opcoes} click={exec.func} /> */}
                                        <ConteudoExecucao props={opcoes} click={(valoresSelecionados) => {exec.func(valoresSelecionados); setOpenExec(false); close();}} />
                                    </Modal.Content>
                                </Modal>
                            ) : (
                                <button onClick={exec.func}>{textoBotaoConfirmar}</button>
                            )}
                        </>
                    )}
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => {setOpenDetalhes(isOpen); if (!isOpen) close();}}>
                    {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${tooltipProps.caixaInformacao.principal.titulo}`}>
                            <ConteudoDetalhes props={tooltipProps} />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }

    return (
        <PopoverComponente trigger={icone} content={conteudo}  />
    );
}

export default page;

const ConteudoExecucao = ({ props, click }: { props?: OpcoesExecucao[], click: (valoresSelecionados: GastaCustoProps) => void }) => {
    const [valoresSelecionados, setValoresSelecionados] = useState<GastaCustoProps>({});

    const handleSelectChange = (key: string, value: number) => {
        setValoresSelecionados((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    useEffect(() => {
        const valoresIniciais: GastaCustoProps = {};

        props!.forEach((opcoesExecucao) => {
            const opcoesDisponiveis = opcoesExecucao.opcoes;
            if (opcoesDisponiveis.length > 0) {
                valoresIniciais[opcoesExecucao.key] = opcoesDisponiveis[0].key;
            }
        });

        setValoresSelecionados(valoresIniciais);
    }, []);

    return (
        <>
            {props && props?.length > 0 && props.map((opcoesExecucao) => {
                const key = opcoesExecucao.key;

                return (
                    <div key={key} className={style.opcao_acao}>
                        <h2>{opcoesExecucao.displayName}</h2>
                        <select value={valoresSelecionados[key] || ''} onChange={(e) => handleSelectChange(key, Number(e.target.value))}>
                            {opcoesExecucao.opcoes.map(opcao => (
                                <option key={opcao.key} value={opcao.key}>{opcao.value}</option>
                            ))}
                        </select>
                    </div>
                );
            })}
            <button onClick={() => click(valoresSelecionados)}>Teste</button>
        </>
    )
}

const ConteudoDetalhes = ({ props }: { props: TooltipProps }) => {
    return (
        <div className={style.container_caixa_informacao}>
        {/* <div className={style.container_caixa_informacao} style={{ border: `2px ${props.corTooltip.corPrimaria} solid` }}> */}
            {props.caixaInformacao.detalhes.cabecalho && (
                <div className={style.cabecalho_caixa_informacao}>
                    {props.caixaInformacao.detalhes.cabecalho.map((item, index) => {
                        // if (item.tipo === 'titulo')
                        //     return (<span key={index} className={style.titulo} style={{ background: `linear-gradient(0deg, ${props.corTooltip.corSecundaria}, ${props.corTooltip.corPrimaria}, ${props.corTooltip.corSecundaria}) text`, WebkitTextFillColor: 'transparent', WebkitTextStroke: `.4px ${props.corTooltip.corTerciaria}` }}>{item.conteudo}</span>);
                        if (item.tipo === 'subtitulo')
                            return (<span key={index} className={style.subtitulo}>{item.conteudo}</span>);
                    })}
                </div>
            )}

            {props.caixaInformacao.detalhes.corpo && (
                <div className={style.corpo_caixa_informacao}>
                    {props.caixaInformacao.detalhes.corpo.map((item, index) => {
                        if (item.tipo === 'texto')
                            return (<p style={{color:item.cor}} key={index}>{item.conteudo}</p>);
                        if (item.tipo === 'separacao')
                            return (<p key={index} className={style.separador}>{item.conteudo}</p>);
                    })}
                </div>
            )}
        </div>
    );
}