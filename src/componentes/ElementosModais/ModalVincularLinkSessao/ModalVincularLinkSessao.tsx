'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { vinculaLinkDeSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { LinkDto, TipoLinkDto } from 'types-nora-api';

export function ModalVincularLinkSessao({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={ { titulo: 'Vinculando Link Sessão' } }>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { listaTiposLink, detalheSessao, idTipoLink, descricao } = useContextoCadastroNovoLinkSessao();
    const [sufixo, setSufixo] = useState('');
    const [erroValidacao, setErroValidacao] = useState('');

    const tipoLinkSelecionado = listaTiposLink.find(tipo => tipo.id === idTipoLink);

    const validarSufixo = (valor: string) => {
        if (!tipoLinkSelecionado) {
            setErroValidacao('Tipo de link não encontrado');
            return false;
        }

        if (!valor.startsWith(tipoLinkSelecionado.prefixo)) {
            setErroValidacao(`O link deve começar com: ${tipoLinkSelecionado.prefixo}`);
            return false;
        }

        setErroValidacao('');
        return true;
    };

    const extrairSufixo = (urlCompleta: string): string => {
        if (!tipoLinkSelecionado) return urlCompleta;
        return urlCompleta.replace(tipoLinkSelecionado.prefixo, '');
    };

    const handleSufixoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setSufixo(valor);
        validarSufixo(valor);
    };

    const vincularLinkComSessao = async () => {
        if (!sufixo) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (!validarSufixo(sufixo)) {
            alert('Por favor, corrija os erros no formulário');
            return;
        }

        const sufixoParaEnvio = extrairSufixo(sufixo);

        await vinculaLinkDeSessao(detalheSessao.sessao.id, {
            sufixo: sufixoParaEnvio,
            tipoLink: { id: idTipoLink } as TipoLinkDto,
            descricao: descricao,
        } as LinkDto);

        window.location.reload();
    }

    if (!idTipoLink) return <p>Houve um problema em definir o Tipo de Link</p>;

    return (
        <div id={styles.recipiente_corpo_modal_vincula_link}>
            <div className={styles.recipiente_label_input_modal_vincula_link}>
                <label htmlFor="sufixo">Link Completo</label>
                <input id="sufixo" type="text" value={sufixo} onChange={handleSufixoChange} placeholder={`${tipoLinkSelecionado?.prefixo}...`} autoComplete={'off'} />
                {erroValidacao && <p className={styles.erro_validacao}>{erroValidacao}</p>}
            </div>

            <div className={styles.recipiente_label_input_modal_vincula_link}>
                <label htmlFor="descricao">Descrição Automática</label>
                <input id="descricao" type="text" value={descricao} disabled />
            </div>

            <button onClick={() => vincularLinkComSessao()}>Vincular Link</button>
        </div>
    );
};