import styles from "./styles.module.css";

import Cabecalho from '../../componentes/secoes/secoes-pagina-aterrissagem/pagina-aterrissagem-cabecalho/pagina-aterrissagem-secao-cabecalho';
import Rodape from '../../componentes/secoes/secoes-pagina-aterrissagem/pagina-aterrissagem-rodape/pagina-aterrissagem-secao-rodape';

import CustomApiCall, { Atributo } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

export default async function Pagina() {
  const api = new CustomApiCall();
  const resposta = await api.obterAtributos();

  return (
    <div id={styles.corpo}>
      <h1>corpo</h1>

      {resposta.sucesso ? (
        resposta.dados.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th style={{ border: '3px black solid' }}>Id </th>
                <th style={{ border: '3px black solid' }}>Nome Atributo</th>
                <th style={{ border: '3px black solid' }}>Nome Atributo Abreviado</th>
                <th style={{ border: '3px black solid' }}>Descricao Atributo</th>
              </tr>
            </thead>
            <tbody>
              {resposta.dados.map((atributo, index) => (
                <tr key={index}>
                  <td style={{ border: '3px black solid' }}>{atributo.id}</td>
                  <td style={{ border: '3px black solid' }}>{atributo.nomeAbreviado}</td>
                  <td style={{ border: '3px black solid' }}>{atributo.nome}</td>
                  <td style={{ border: '3px black solid' }}>{atributo.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>🔍 Nenhum atributo encontrado.</p>
        )
      ) : (
        <div style={{
          padding: "20px",
          backgroundColor: "#ffdddd",
          color: "#a00",
          border: "1px solid red",
          borderRadius: "5px",
          textAlign: "center",
          fontWeight: "bold",
        }}>
          ❌ {resposta.erro}
        </div>
      )}
    </div>
  );
}