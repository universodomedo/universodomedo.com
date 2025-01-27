// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { ValoresLinhaEfeito } from 'Classes/ClassesTipos/index.ts'
import { useContextoControleEfeitos } from 'Contextos/ContextoControleEfeitos/contexto.tsx';

import PopoverComponente from 'Componentes/Popover/pagina.tsx';
import Tooltip from 'Componentes/Tooltip/pagina.tsx';
import Modal from 'Componentes/ModalDialog/pagina.tsx';
// #endregion

const page = ({ valoresLinhaEfeito }: { valoresLinhaEfeito: ValoresLinhaEfeito }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoControleEfeitos();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{valoresLinhaEfeito.refLinhaEfeito.nome}</h3>)}
                <Tooltip>
                    <Tooltip.Trigger>
                        <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${valoresLinhaEfeito.refLinhaEfeito.svg})`, backgroundColor: '#FFFFFF', }} />
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h3>{valoresLinhaEfeito.refLinhaEfeito.nome}</h3>
                    </Tooltip.Content>
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{valoresLinhaEfeito.refLinhaEfeito.nome}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => { setOpenDetalhes(isOpen); if (!isOpen) close(); }}>
                        {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${valoresLinhaEfeito.refLinhaEfeito.nome}`}>
                            <ConteudoDetalhes />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }

    const ConteudoDetalhes = () => {
        return (
            <>
                <div className={style.bloco_texto}>
                    {valoresLinhaEfeito.valoresEfeitos.valorBaseAdicionalPresente && (
                        <details>
                            <summary>Seu <span className={style.bold}>{valoresLinhaEfeito.refLinhaEfeito.nome} Base</span> está sendo aumentando em {valoresLinhaEfeito.valoresEfeitos.valorBaseAdicional}</summary>
                            {valoresLinhaEfeito.valoresEfeitos.listaValorBaseAdicional.map((valor, index) => (
                                <p key={index} className={style.texto_details}>{valor.tipoValor} em {valor.valor} pela {valor.tipoPai} {valor.nomeRegistro}</p>
                            ))}
                        </details>
                    )}
                    {valoresLinhaEfeito.valoresEfeitos.valorPorcentagemAdicionalPresente && (
                        <details>
                            <summary>Seu <span className={style.bold}>{valoresLinhaEfeito.refLinhaEfeito.nome}</span> está sendo aumentando em {valoresLinhaEfeito.valoresEfeitos.valorPorcentagemAdicional}%</summary>
                            {valoresLinhaEfeito.valoresEfeitos.listaPorcentagemAdicional.map((valor, index) => (
                                <p key={index} className={style.texto_details}>{valor.tipoValor} em {valor.valor}% pela {valor.tipoPai} {valor.nomeRegistro}</p>
                            ))}
                        </details>
                    )}
                    {valoresLinhaEfeito.valoresEfeitos.valorBonusAdicionalPresente && (
                        <details>
                            <summary>Seu <span className={style.bold}>{valoresLinhaEfeito.refLinhaEfeito.nome} Adicional</span> está sendo aumentando em {valoresLinhaEfeito.valoresEfeitos.valorBonusAdicional}</summary>
                            {valoresLinhaEfeito.valoresEfeitos.listaValorBonusAdicional.map((valor, index) => (
                                <p key={index} className={style.texto_details}>{valor.tipoValor} em {valor.valor} pela {valor.tipoPai} {valor.nomeRegistro}</p>
                            ))}
                        </details>
                    )}
                    <p>Efeito finaliza em 2 turnos</p>
                </div>
            </>
        );
    }

    {/* <p className={style.texto}>{`+${efeito.valor} ${efeito.refBuff.nome}`}</p>
                <p className={style.texto}>{`${efeito.refTipoBuff.nomeExibirTooltip}`}</p>
                <p className={style.texto}>{`${efeito.textoDuracao}`}</p> */}

    return (
        <PopoverComponente trigger={icone} content={conteudo} />
    );
}

export default page;