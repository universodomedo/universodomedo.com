import { NoraApi, NoraApiErro } from 'Api/NoraApi';
import { EventosApiRest, type CadastroAcessoResposta, type DisponibilidadeApelidoResposta, type LoginAcessoResposta, type PAYLOAD__CadastrarAcesso, type PAYLOAD__LoginAcesso, type PerfilCompletoResposta, type RedefinicaoSenhaAcessoResposta, type SolicitacaoAcessoResposta, type VerificacaoEmailAcessoResposta, type VinculoAcessoResposta } from 'types-nora-api';

export function cadastrarAcesso(payload: PAYLOAD__CadastrarAcesso): Promise<CadastroAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.cadastrar, payload, { mensagemErro: 'Não foi possível concluir o cadastro.', exibirToastErro: false }); };

export function loginAcesso(payload: PAYLOAD__LoginAcesso): Promise<LoginAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.login, payload, { mensagemErro: 'Não foi possível entrar.', exibirToastErro: false }); };

export function verificarEmailAcesso(token: string): Promise<VerificacaoEmailAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.verificarEmail, { token }, { mensagemErro: 'Não foi possível verificar o email.', exibirToastErro: false }); };

export function reenviarVerificacaoAcesso(identificador: string): Promise<SolicitacaoAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.reenviarVerificacao, { identificador }, { mensagemErro: 'Não foi possível reenviar a verificação.', exibirToastErro: false }); };

export function solicitarRecuperacaoAcesso(identificador: string): Promise<SolicitacaoAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.solicitarRecuperacao, { identificador }, { mensagemErro: 'Não foi possível solicitar a recuperação.', exibirToastErro: false }); };

export function redefinirSenhaAcesso(token: string, novaSenha: string): Promise<RedefinicaoSenhaAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.redefinirSenha, { token, novaSenha }, { mensagemErro: 'Não foi possível redefinir a senha.', exibirToastErro: false }); };

export function verificaDisponibilidadeApelido(apelido: string): Promise<DisponibilidadeApelidoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.apelidoDisponivel, { apelido }, { mensagemErro: 'Não foi possível verificar o apelido.', exibirToastErro: false }); };

export function completarPerfil(apelido: string, aceitouTermos: boolean): Promise<PerfilCompletoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.completarPerfil, { apelido, aceitouTermos }, { mensagemErro: 'Não foi possível concluir seu perfil.', exibirToastErro: false }); };

export function criarAcessoParaMinhaConta(email: string, senha: string): Promise<VinculoAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.criarParaMinhaConta, { email, senha }, { mensagemErro: 'Não foi possível criar o acesso.', exibirToastErro: false }); };

export function reenviarMinhaVerificacao(): Promise<SolicitacaoAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.reenviarMinhaVerificacao, {}, { mensagemErro: 'Não foi possível reenviar a verificação.', exibirToastErro: false }); };

export function corrigirEmailAcessoPendente(email: string): Promise<VinculoAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.corrigirEmailAcessoPendente, { email }, { mensagemErro: 'Não foi possível corrigir o email.', exibirToastErro: false }); };

/** Erros de domínio do backend chegam como `{ erro }` stringificado dentro de `message`; extrai o motivo legível para exibição inline nos formulários de acesso. */
export function extraiMotivoErroAcesso(erroCapturado: Error | null, mensagemPadrao: string): string {
    if (erroCapturado instanceof NoraApiErro && erroCapturado.mensagemServidor !== null) {
        try {
            const corpo = JSON.parse(erroCapturado.mensagemServidor) as { message?: string };
            if (typeof corpo.message === 'string') {
                const interno = JSON.parse(corpo.message) as { erro?: string };
                if (typeof interno.erro === 'string') return interno.erro;
            }
        } catch { return mensagemPadrao; }
    }
    return mensagemPadrao;
};