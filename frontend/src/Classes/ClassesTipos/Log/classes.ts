// #region Imports
// #endregion

export interface MensagemLog {
    titulo: string;
    mensagens: (string | MensagemLog)[];
}