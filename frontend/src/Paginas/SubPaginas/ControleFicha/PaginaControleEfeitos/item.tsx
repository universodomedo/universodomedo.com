// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { ValoresLinhaEfeito } from 'Classes/ClassesTipos/index.ts'
import { useContextoControleEfeitos } from 'Contextos/ContextoControleEfeitos/contexto.tsx';

import Modal from 'Componentes/ModalDialog/pagina.tsx';
// #endregion

const page = ({ valoresLinhaEfeito }: { valoresLinhaEfeito: ValoresLinhaEfeito }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoControleEfeitos();

    {/* <p className={style.texto}>{`+${efeito.valor} ${efeito.refBuff.nome}`}</p>
                <p className={style.texto}>{`${efeito.refTipoBuff.nomeExibirTooltip}`}</p>
                <p className={style.texto}>{`${efeito.textoDuracao}`}</p> */}
    
    return (
        <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}>
            <Modal.Button>
                <Icone valoresLinhaEfeito={valoresLinhaEfeito} mostrarEtiquetas={mostrarEtiquetas} />
            </Modal.Button>

            <Modal.Content title={`${valoresLinhaEfeito.refLinhaEfeito.nome}`}>
                <ConteudoDetalhes valoresLinhaEfeito={valoresLinhaEfeito} />
            </Modal.Content>
        </Modal>
    );
}

const Icone = ({ valoresLinhaEfeito, mostrarEtiquetas }: { valoresLinhaEfeito: ValoresLinhaEfeito, mostrarEtiquetas: boolean }) => {
    return (
        <div className={style.embrulho_icone}>
            {mostrarEtiquetas && (<h3>{valoresLinhaEfeito.refLinhaEfeito.nome}</h3>)}
            <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+)`, backgroundColor: '#FFFFFF', }} />
            {/* <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${valoresLinhaEfeito.refLinhaEfeito.svg})`, backgroundColor: '#FFFFFF', }} /> */}
        </div>
    );
}

const ConteudoDetalhes = ({ valoresLinhaEfeito }: { valoresLinhaEfeito: ValoresLinhaEfeito }) => {
    return (
        <>
            <div className={style.bloco_texto}>
                {valoresLinhaEfeito.valoresEfeitos.valorBaseAdicionalPresente && (
                    <details>
                        <summary><span className={style.bold}>{valoresLinhaEfeito.refLinhaEfeito.nome} Base</span> está sendo aumentando em {valoresLinhaEfeito.valoresEfeitos.valorBaseAdicional}</summary>
                        {valoresLinhaEfeito.valoresEfeitos.listaValorBaseAdicional.map((valor, index) => (
                            <p key={index} className={style.texto_details}>{valor.tipoValor} em {valor.valor} pela {valor.tipoPai} {valor.nomeRegistro}</p>
                        ))}
                    </details>
                )}
                {valoresLinhaEfeito.valoresEfeitos.valorPorcentagemAdicionalPresente && (
                    <details>
                        <summary><span className={style.bold}>{valoresLinhaEfeito.refLinhaEfeito.nome}</span> está sendo aumentando em {valoresLinhaEfeito.valoresEfeitos.valorPorcentagemAdicional}%</summary>
                        {valoresLinhaEfeito.valoresEfeitos.listaPorcentagemAdicional.map((valor, index) => (
                            <p key={index} className={style.texto_details}>{valor.tipoValor} em {valor.valor}% pela {valor.tipoPai} {valor.nomeRegistro}</p>
                        ))}
                    </details>
                )}
                {valoresLinhaEfeito.valoresEfeitos.valorBonusAdicionalPresente && (
                    <details>
                        <summary><span className={style.bold}>{valoresLinhaEfeito.refLinhaEfeito.nome} Adicional</span> está sendo aumentando em {valoresLinhaEfeito.valoresEfeitos.valorBonusAdicional}</summary>
                        {valoresLinhaEfeito.valoresEfeitos.listaValorBonusAdicional.map((valor, index) => (
                            <p key={index} className={style.texto_details}>{valor.tipoValor} em {valor.valor} pela {valor.tipoPai} {valor.nomeRegistro}</p>
                        ))}
                    </details>
                )}
            </div>
        </>
    );
}

export default page;