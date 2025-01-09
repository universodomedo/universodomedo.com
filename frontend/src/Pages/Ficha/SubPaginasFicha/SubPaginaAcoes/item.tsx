// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState, useRef, useEffect } from 'react';

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
                {mostrarEtiquetas && (<h3>{acao.nomeExibicao}</h3>)}
                <Tooltip content={acao.nomeExibicao}>
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
                <h2>{acao.nomeExibicao}</h2>
                <div className={style.acoes}>
                    {!acao.bloqueada && (
                        <>
                            <Modal open={openExec} onOpenChange={(isOpen) => { setOpenExec(isOpen); if (!isOpen) close(); }}>
                                <Modal.Button>
                                    Executar
                                </Modal.Button>

                                <Modal.Content title={`Executando ${acao.nomeExibicao}`}>
                                    <ConteudoExecucao fechaModal={close} />
                                </Modal.Content>
                            </Modal>
                        </>
                    )}
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => { setOpenDetalhes(isOpen); if (!isOpen) close(); }}>
                        {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${acao.nomeExibicao}`}>
                            <ConteudoDetalhes />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }

    const ConteudoExecucao = ({ fechaModal }: { fechaModal: () => void }) => {
        const [valoresSelecionados, setValoresSelecionados] = useState<GastaCustoProps>({});
        const firstSelectRef = useRef<HTMLSelectElement | null>(null);
        const buttonRef = useRef<HTMLButtonElement | null>(null);

        const handleSelectChange = (key: string, value: number) => {
            setValoresSelecionados((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        };

        useEffect(() => {
            if (firstSelectRef.current) firstSelectRef.current.focus();
        }, []);

        const handleKeyPress = (event: React.KeyboardEvent<HTMLSelectElement>) => {
            if (event.key === "Enter") {
                event.preventDefault();
                buttonRef.current?.click();
            }
        };

        return (
            <>
                {acao.opcoesExecucoes.length > 0 && acao.opcoesExecucoes.map((opcoesExecucao, index) => {
                    const key = opcoesExecucao.key;

                    return (
                        <div key={key} className={style.opcao_acao}>
                            <h2>{opcoesExecucao.displayName}</h2>
                            <select ref={index === 0 ? firstSelectRef : null} value={valoresSelecionados[key] || 0} onChange={(e) => handleSelectChange(key, Number(e.target.value))} onKeyDown={handleKeyPress}>
                                <option value="0" className={style.opcao_acao_padrao} disabled>Selecione a Opção...</option>
                                {opcoesExecucao.opcoes.map(opcao => (
                                    <option key={opcao.key} value={opcao.key} disabled={opcao.disabled}>{opcao.value}</option>
                                ))}
                            </select>
                        </div>
                    );
                })}

                <button
                    ref={buttonRef}
                    className={style.botao_principal}
                    onClick={() => { acao.executaComOpcoes(valoresSelecionados); setOpenExec(false); fechaModal(); }}
                    disabled={acao.opcoesExecucoes.length != Object.keys(valoresSelecionados).length}
                >
                    Executar
                </button>
            </>
        );
    }

    const ConteudoDetalhes = () => {
        const textoDano = acao.comportamentos.temComportamentoAcao
            ? `${acao.comportamentos.comportamentoAcao.valorMin} a ${acao.comportamentos.comportamentoAcao.valorMax} de ${acao.comportamentos.comportamentoAcao.tipo}`
            : '';

        const textoTestePericia = acao.comportamentos.temComportamentoAcao && acao.comportamentos.comportamentoAcao.precisaTestePericia
            ? `Depende de um Teste de ${acao.comportamentos.comportamentoAcao.refPericia?.nomeAbrev} com ${acao.comportamentos.comportamentoAcao.refAtributo?.nomeAbrev}`
            : '';

        return (
            <>
                {(textoDano || textoTestePericia) && (
                    <div className={style.bloco_texto}>
                        {textoDano && (<p className={style.texto}>{textoDano}</p>)}
                        {textoTestePericia && (<p className={style.texto}>{textoTestePericia}</p>)}
                    </div>
                )}
                <BlocoTexto lista={acao.custos} titulo={'Custos'} corTexto={(custo) => !custo.podeSerPago ? '#FF0000' : ''} descricao={(custo) => custo.descricaoCusto} />
                <BlocoTexto lista={acao.requisitos} titulo={'Requisitos'} corTexto={(requisito) => !requisito.requisitoCumprido ? '#FF0000' : ''} descricao={(custo) => custo.descricaoRequisito} />
                <BlocoTexto lista={acao.dificuldades} titulo={'Dificuldades'} corTexto={(dificuldade) => false ? '#FF0000' : '#F49A34'} descricao={(custo) => custo.descricaoDificuldade} />
                {acao.comportamentos.acaoTravada && (
                    <div className={style.bloco_texto}>
                    <p className={style.texto}>{acao.comportamentos.comportamentoTrava.descricaoTrava}</p>
                </div>
                )}
            </>
        );
    }

    return (
        <PopoverComponente trigger={icone} content={conteudo} />
    );
}

export default page;



const BlocoTexto = ({ lista, titulo, corTexto, descricao }: { lista: any[]; titulo: string; corTexto: (item: any) => string; descricao: (item: any) => string; }) => {
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