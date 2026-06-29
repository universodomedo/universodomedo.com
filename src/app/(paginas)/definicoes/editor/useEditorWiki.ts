import { useState } from 'react';
import { ItemBlocoWiki, ItemConexaoWiki, PAYLOAD__SalvarPaginaWiki, SecaoWiki } from 'types-nora-api';

import { removerPaginaWiki, salvarPaginaWiki } from 'Uteis/ApiConsumer/ConsumerMiddleware';

type EstadoEnvio = { enviando: boolean; erro: string | null; sucesso: boolean };

export function useEditorWiki(inicial?: Partial<PAYLOAD__SalvarPaginaWiki>, secao: SecaoWiki = 'definicao') {
    const [chave, setChave] = useState(inicial?.chave ?? '');
    const [titulo, setTitulo] = useState(inicial?.titulo ?? '');
    const [subtitulo, setSubtitulo] = useState(inicial?.subtitulo ?? '');
    const [chavePai, setChavePai] = useState(inicial?.chavePai ?? '');
    const [ordem, setOrdem] = useState(inicial?.ordem ?? 0);
    const [blocos, setBlocos] = useState<ItemBlocoWiki[]>(inicial?.blocos ? [...inicial.blocos] : []);
    const [conexoes, setConexoes] = useState<ItemConexaoWiki[]>(inicial?.conexoes ? [...inicial.conexoes] : []);
    const [envio, setEnvio] = useState<EstadoEnvio>({ enviando: false, erro: null, sucesso: false });

    const adicionaBloco = () => setBlocos(atual => [...atual, { tipo: 'Paragrafo', conteudo: '' }]);
    const atualizaBloco = (indice: number, parcial: Partial<ItemBlocoWiki>) => setBlocos(atual => atual.map((bloco, i) => i === indice ? { ...bloco, ...parcial } : bloco));
    const removeBloco = (indice: number) => setBlocos(atual => atual.filter((_, i) => i !== indice));

    const adicionaConexao = () => setConexoes(atual => [...atual, { chaveParceira: '' }]);
    const atualizaConexao = (indice: number, parcial: Partial<ItemConexaoWiki>) => setConexoes(atual => atual.map((conexao, i) => i === indice ? { ...conexao, ...parcial } : conexao));
    const removeConexao = (indice: number) => setConexoes(atual => atual.filter((_, i) => i !== indice));

    const salvar = async () => {
        setEnvio({ enviando: true, erro: null, sucesso: false });
        try {
            const payload: PAYLOAD__SalvarPaginaWiki = {
                secao,
                chave: chave.trim(),
                titulo: titulo.trim(),
                subtitulo: subtitulo.trim() || undefined,
                chavePai: (chavePai ?? '').trim() || null,
                ordem: Number(ordem) || 0,
                blocos,
                conexoes,
            };
            await salvarPaginaWiki(payload);
            setEnvio({ enviando: false, erro: null, sucesso: true });
        } catch (erro) {
            setEnvio({ enviando: false, erro: erro instanceof Error ? erro.message : 'Erro ao salvar a página.', sucesso: false });
        }
    };

    const remover = async () => {
        setEnvio({ enviando: true, erro: null, sucesso: false });
        try {
            await removerPaginaWiki(chave.trim(), secao);
            setEnvio({ enviando: false, erro: null, sucesso: true });
        } catch (erro) {
            setEnvio({ enviando: false, erro: erro instanceof Error ? erro.message : 'Erro ao remover a página.', sucesso: false });
        }
    };

    return {
        campos: { chave, titulo, subtitulo, chavePai, ordem },
        setChave, setTitulo, setSubtitulo, setChavePai, setOrdem,
        blocos, adicionaBloco, atualizaBloco, removeBloco,
        conexoes, adicionaConexao, atualizaConexao, removeConexao,
        envio, salvar, remover,
    };
}