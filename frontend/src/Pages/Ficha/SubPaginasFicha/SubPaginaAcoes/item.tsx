// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState, useEffect } from 'react';

import { Acao, GastaCustoProps } from 'Types/classes/index.ts';
import { useContextoAbaAcoes } from './contexto.tsx';

import PopoverComponente from 'Recursos/Componentes/Popover/page.tsx';
import Tooltip from 'Recursos/Componentes/Tooltip/page.tsx';
import Modal from "Recursos/Componentes/ModalDialog/page.tsx";
// #endregion

const page = ({ acao }: { acao: Acao }) => {
    const [openExec, setOpenExec] = useState(false);
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoAbaAcoes();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{acao.nomeAcao}</h3>)}
                <Tooltip content={acao.nomeAcao}>
                    <div
                        className={`${style.icone}`}
                        style={{
                            backgroundImage: `url(data:image/svg+xml;base64,${acao.svg})`,
                            backgroundColor: (acao.bloqueada ? '#BB0000' : '#FFFFFF'),
                        }}
                    />
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{acao.nomeAcao}</h2>
                <div className={style.acoes}>
                    {!acao.bloqueada && (
                        <>
                            <Modal open={openExec} onOpenChange={(isOpen) => {setOpenExec(isOpen); if (!isOpen) close();}}>
                                <Modal.Button>
                                    Executar
                                </Modal.Button>

                                <Modal.Content title={`Executando ${acao.nomeAcao}`}>
                                    <ConteudoExecucao fechaModal={close} />
                                </Modal.Content>
                            </Modal>
                        </>
                    )}
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => {setOpenDetalhes(isOpen); if (!isOpen) close();}}>
                    {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${acao.nomeAcao}`}>
                            <ConteudoDetalhes />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }

    const ConteudoExecucao = ({ fechaModal }: { fechaModal: () => void }) => {
        const [valoresSelecionados, setValoresSelecionados] = useState<GastaCustoProps>({});

        const handleSelectChange = (key: string, value: number) => {
            setValoresSelecionados((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        };
    
        useEffect(() => {
            const valoresIniciais: GastaCustoProps = {};
    
            acao.opcoesExecucoes.forEach((opcoesExecucao) => {
                const opcoesDisponiveis = opcoesExecucao.opcoes;
                if (opcoesDisponiveis.length > 0) {
                    valoresIniciais[opcoesExecucao.key] = opcoesDisponiveis[0].key;
                }
            });
    
            setValoresSelecionados(valoresIniciais);
        }, []);

        return (
            <>
                {acao.opcoesExecucoes.length > 0 && acao.opcoesExecucoes.map((opcoesExecucao) => {
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

                <button className={style.botao_principal} onClick={() => {acao.executaComOpcoes(valoresSelecionados); fechaModal();}}>Executar</button>
            </>
        );
    }

    const ConteudoDetalhes = () => {
        return (
            <>
                <BlocoTexto lista={acao.custos} titulo={'Custos'} corTexto={(custo) => !custo.podeSerPago ? '#FF0000' : ''} descricao={(custo) => custo.descricaoCusto} />
                <BlocoTexto lista={acao.requisitos} titulo={'Requisitos'} corTexto={(requisito) => !requisito.requisitoCumprido ? '#FF0000' : ''} descricao={(custo) => custo.descricaoRequisito} />
                <BlocoTexto lista={acao.dificuldades} titulo={'Dificuldades'} corTexto={(dificuldade) => false ? '#FF0000' : '#F49A34'} descricao={(custo) => custo.descricaoDificuldade} />
            </>
        );
    }
    
    return (
        <PopoverComponente trigger={icone} content={conteudo} />
    );
}

export default page;



const BlocoTexto = ({ lista, titulo, corTexto, descricao }: { lista: any[]; titulo: string; corTexto: (item: any) => string; descricao: (item: any) => string;}) => {
    if (lista.length === 0) return null;

    return (
        <div className={style.bloco_texto}>
            <p className={style.titulo}>{titulo}</p>
            {lista.map((item, index) => (
                <p key={index} style={{ color: corTexto(item) }} className={style.texto}>
                    {descricao(item)}
                </p>
            ))}
        </div>
    );
}