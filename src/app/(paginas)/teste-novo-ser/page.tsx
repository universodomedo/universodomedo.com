'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventosApiRest, PAGINAS, type SerNaSalaDeTeste, type SerExecucaoNaSalaSolo } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';

// Harness local do novo_ser (sem clone — o clone do legado foi aposentado): recebe o id de um Ser AUTORADO
// (cadastro-novo-ser + estrutura) e exercita montar na Sala / executar na Sala Solo / jogar ao vivo.
export default function Page() {
    const router = useRouter();

    const [idNovoSer, setIdNovoSer] = useState('');
    const [naSala, setNaSala] = useState<SerNaSalaDeTeste | null>(null);
    const [montando, setMontando] = useState(false);
    const [erroSala, setErroSala] = useState<string | null>(null);

    const [idPartida, setIdPartida] = useState('1');
    const [execucao, setExecucao] = useState<SerExecucaoNaSalaSolo | null>(null);
    const [executando, setExecutando] = useState(false);
    const [erroExec, setErroExec] = useState<string | null>(null);

    const [entrando, setEntrando] = useState(false);
    const [erroVivo, setErroVivo] = useState<string | null>(null);

    async function montarNaSala(): Promise<void> {
        const id = Number(idNovoSer);
        if (!Number.isInteger(id) || id <= 0) { setErroSala('Informe o id de um Ser de novo_ser autorado (cadastro-novo-ser).'); return; }
        setMontando(true);
        setErroSala(null);
        setNaSala(null);
        try {
            const resultado = await NoraApi.RestPOST(EventosApiRest.POST.SerRegistro.montarNaSalaDeTeste, { idSer: id }, { mensagemErro: 'Não foi possível montar o Ser na Sala.' });
            setNaSala(resultado);
        } catch {
            setErroSala('Não foi possível montar o Ser na Sala (o Ser existe? a estrutura tem membros? a ficha do vínculo de teste existe?).');
        } finally {
            setMontando(false);
        }
    };

    async function executar(): Promise<void> {
        const id = Number(idNovoSer);
        const partida = Number(idPartida);
        if (!Number.isInteger(id) || id <= 0) { setErroExec('Informe o id de um Ser de novo_ser autorado.'); return; }
        if (!Number.isInteger(partida) || partida <= 0) { setErroExec('Informe o id de uma Partida configurada (empresta cenário + manequim).'); return; }
        setExecutando(true);
        setErroExec(null);
        setExecucao(null);
        try {
            const resultado = await NoraApi.RestPOST(EventosApiRest.POST.SerRegistro.executarNaSalaSolo, { idSer: id, idPartida: partida }, { mensagemErro: 'Não foi possível executar na Sala Solo.' });
            setExecucao(resultado);
        } catch {
            setErroExec('Não foi possível executar (a Partida está configurada e tem manequim? o Ser tem ação de dano?).');
        } finally {
            setExecutando(false);
        }
    };

    async function jogarAoVivo(): Promise<void> {
        const id = Number(idNovoSer);
        const partida = Number(idPartida);
        if (!Number.isInteger(id) || id <= 0) { setErroVivo('Informe o id de um Ser de novo_ser autorado.'); return; }
        if (!Number.isInteger(partida) || partida <= 0) { setErroVivo('Informe o id de uma Partida configurada.'); return; }
        setEntrando(true);
        setErroVivo(null);
        try {
            await NoraApi.RestPOST(EventosApiRest.POST.SerRegistro.iniciarAoVivo, { idSer: id, idPartida: partida }, { mensagemErro: 'Não foi possível iniciar a Partida ao vivo.' });
            router.push(PAGINAS.jogo.emJogo.href);
        } catch {
            setErroVivo('Não foi possível jogar ao vivo (já há uma sala aberta? feche a partida atual; a Partida tem config?).');
            setEntrando(false);
        }
    };

    return (
        <main style={{ padding: '2.5em', color: '#D9D9D9', fontFamily: 'system-ui', maxWidth: '46em', margin: '0 auto' }}>
            <span style={{ fontSize: '0.7em', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B79051', fontWeight: 700 }}>Teste local · novo_ser</span>
            <h1 style={{ color: '#EBE0C9', margin: '0.3em 0 0.2em' }}>novo_ser → runtime (Ser autorado)</h1>
            <p style={{ color: '#aba9a1', lineHeight: 1.5, fontSize: '0.92em' }}>Autore um Ser em <code>cadastro-novo-ser</code> (e a estrutura em <code>estrutura-ser-humano</code>), informe o id abaixo e exercite o runtime.</p>

            <div style={{ marginTop: '1em', display: 'flex', alignItems: 'center', gap: '0.6em', flexWrap: 'wrap' }}>
                <label style={{ color: '#aba9a1', fontSize: '0.9em' }}>Id do novo_ser:</label>
                <input type="number" min={1} value={idNovoSer} onChange={e => setIdNovoSer(e.target.value)} placeholder="autorado" style={inputStyle} />
                <label style={{ color: '#aba9a1', fontSize: '0.9em' }}>Id da Partida:</label>
                <input type="number" min={1} value={idPartida} onChange={e => setIdPartida(e.target.value)} style={inputStyle} />
                <button type="button" onClick={jogarAoVivo} disabled={entrando} style={{ ...botaoStyle(entrando), background: entrando ? '#1A1725' : '#7CC576', color: '#0B0A10', fontWeight: 700 }}>{entrando ? 'Entrando...' : 'Jogar ao vivo ▶'}</button>
            </div>
            {erroVivo && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroVivo}</p>}

            <section style={{ marginTop: '1.5em', borderTop: '1px solid #322F2F', paddingTop: '1.2em' }}>
                <h2 style={{ color: '#B79051', fontSize: '1em', letterSpacing: '0.06em' }}>1 · Montar na Sala</h2>
                <p style={{ color: '#aba9a1', lineHeight: 1.5, fontSize: '0.92em' }}>Carrega o Ser autorado no runtime da Sala e lista as <strong>ações disponíveis</strong>.</p>
                <button type="button" onClick={montarNaSala} disabled={montando} style={botaoStyle(montando)}>{montando ? 'Montando...' : 'Montar na Sala'}</button>
                {erroSala && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroSala}</p>}
                {naSala && (
                    <div style={{ marginTop: '1em', border: '1px solid #352E4C', borderRadius: '0.6em', padding: '1em', background: '#12101A' }}>
                        <div style={{ color: '#EBE0C9', fontWeight: 600 }}>{naSala.nome} <span style={{ color: '#6f6a7a', fontFamily: 'monospace', fontWeight: 400 }}>· id {naSala.id}</span></div>
                        <div style={{ color: naSala.acoes.length > 0 ? '#7CC576' : '#DB4747', fontSize: '0.85em', marginTop: '0.3em' }}>{naSala.acoes.length} ação(ões) disponível(is)</div>
                        <ul style={{ marginTop: '0.5em' }}>{naSala.acoes.map(acao => <li key={acao.key} style={{ fontFamily: 'monospace', fontSize: '0.85em', color: '#c787ff' }}>{acao.nome}</li>)}</ul>
                    </div>
                )}
            </section>

            <section style={{ marginTop: '1.5em', borderTop: '1px solid #322F2F', paddingTop: '1.2em' }}>
                <h2 style={{ color: '#B79051', fontSize: '1em', letterSpacing: '0.06em' }}>2 · Executar na Sala Solo (dano no alvo)</h2>
                <p style={{ color: '#aba9a1', lineHeight: 1.5, fontSize: '0.92em' }}>Monta a <strong>Sala Solo real</strong> com o Ser autorado + cenário de uma Partida configurada e executa <strong>1 ação de dano</strong> no alvo danificável.</p>
                <button type="button" onClick={executar} disabled={executando} style={botaoStyle(executando)}>{executando ? 'Executando...' : 'Executar ação'}</button>
                {erroExec && <p style={{ color: '#DB4747', marginTop: '0.6em' }}>{erroExec}</p>}
                {execucao && (
                    <div style={{ marginTop: '1em', border: '1px solid #352E4C', borderRadius: '0.6em', padding: '1em', background: '#12101A' }}>
                        <div style={{ color: '#EBE0C9', fontWeight: 600 }}>{execucao.nomeSer} <span style={{ color: '#6f6a7a', fontWeight: 400 }}>· {execucao.nomeMissao}</span></div>
                        <div style={{ color: '#c787ff', fontFamily: 'monospace', fontSize: '0.85em', marginTop: '0.4em' }}>{execucao.nomeAcao} → {execucao.nomeAlvo}</div>
                        <div style={{ color: '#EBE0C9', fontSize: '0.85em', marginTop: '0.3em' }}>Durabilidade do alvo: {execucao.durabilidadeAntes} → {execucao.durabilidadeDepois} <span style={{ color: '#DB8A47' }}>(dano {execucao.danoAplicado})</span></div>
                        <div style={{ color: execucao.missaoVenceu ? '#7CC576' : '#DB8A47', fontSize: '0.9em', marginTop: '0.5em', fontWeight: 600 }}>{execucao.missaoVenceu ? 'Concluída: VITÓRIA ✓ — o Ser autorado chegou e agiu na Partida' : 'Ação aplicada (condição não concluída)'}</div>
                    </div>
                )}
            </section>
        </main>
    );
};

const inputStyle = { width: '6em', padding: '0.4em 0.6em', borderRadius: '0.4em', border: '1px solid #322F2F', background: '#07060B', color: '#EBE0C9' };

function botaoStyle(desabilitado: boolean) {
    return { padding: '0.55em 1em', borderRadius: '0.5em', border: '1px solid #B79051', background: desabilitado ? '#1A1725' : '#23202f', color: '#EBE0C9', cursor: desabilitado ? 'default' : 'pointer', fontSize: '0.9em' };
};
