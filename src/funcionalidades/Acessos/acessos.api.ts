import { NoraApi, NoraApiErro } from 'Api/NoraApi';
import { EventosApiRest, type CadastroAcessoResposta, type LoginAcessoResposta, type PAYLOAD__CadastrarAcesso, type PAYLOAD__LoginAcesso, type VerificacaoEmailAcessoResposta } from 'types-nora-api';

export function cadastrarAcesso(payload: PAYLOAD__CadastrarAcesso): Promise<CadastroAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.cadastrar, payload, { mensagemErro: 'Não foi possível concluir o cadastro.', exibirToastErro: false }); };

export function loginAcesso(payload: PAYLOAD__LoginAcesso): Promise<LoginAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.login, payload, { mensagemErro: 'Não foi possível entrar.', exibirToastErro: false }); };

export function verificarEmailAcesso(token: string): Promise<VerificacaoEmailAcessoResposta> { return NoraApi.RestPOST(EventosApiRest.POST.Acessos.verificarEmail, { token }, { mensagemErro: 'Não foi possível verificar o email.', exibirToastErro: false }); };

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