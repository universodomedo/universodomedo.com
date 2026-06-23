# Contrato de manifesto de skills do universodomedo.com

Este documento define o contrato canônico de descoberta determinística das skills versionadas em `.agents/skills`. Ele espelha o contrato equivalente da Nora-Api, garantindo o mesmo protocolo entre backend e frontend.

## Versão suportada

A versão inicial e atualmente suportada é:

```yaml
schema_version: 1
```

Um manifesto com `schema_version` ausente ou diferente de `1` é inválido.

## Localização e estrutura

Cada skill deve possuir um manifesto encontrado por `.agents/skills/**/skill.yaml` e um `SKILL.md` no mesmo diretório. Subpastas sem manifesto são apenas diretórios classificadores e devem ser ignoradas.

Campos obrigatórios do manifesto:

```yaml
schema_version: 1
name: "nome-da-skill"
description: "Descrição idêntica à declarada no frontmatter do SKILL.md."
selection:
    requirement: "required"
    rules: []
```

Regras estruturais:

* a descoberta deve percorrer `.agents/skills` recursivamente sem seguir symlinks ou junctions;
* os caminhos relativos dos manifestos devem ser normalizados com `/` e ordenados lexicograficamente antes da validação;
* `SKILL.md` deve existir na mesma pasta de `skill.yaml`;
* `name` deve ser uma string não vazia e corresponder exatamente ao nome da pasta final da skill;
* `name` e `description` devem corresponder exatamente aos valores do frontmatter do `SKILL.md`;
* `selection.requirement` aceita somente `required` em `schema_version: 1`;
* `selection.rules` deve ser uma lista não vazia;
* cada regra deve possuir um `id` não vazio e único dentro do manifesto;
* cada regra deve possuir exatamente uma propriedade `match`;
* uma expressão `match` deve possuir exatamente um operador ou combinador suportado;
* campos estruturais, operadores ou combinadores desconhecidos invalidam o manifesto;
* listas vazias são inválidas;
* duas skills com o mesmo `name`, mesmo em categorias diferentes, invalidam a descoberta;
* uma pasta com `skill.yaml` não pode conter outra skill descendente; a skill aninhada invalida a descoberta.

## Entrada da seleção

A seleção recebe duas entradas explícitas:

* texto da tarefa: solicitação atual do usuário, incluindo restrições e caminhos citados;
* caminhos da tarefa: caminhos citados pelo usuário ou identificados como alvos diretos durante a inspeção inicial anterior ao planejamento.

O conteúdo de arquivos do repositório não integra automaticamente o texto da tarefa. Um arquivo somente contribui com seu caminho, salvo quando o usuário incluiu conteúdo dele na solicitação.

Se a inspeção inicial identificar novos caminhos ou evidências diretamente relacionados ao escopo, todos os manifestos devem ser reavaliados antes da conclusão do plano.

## Avaliação das regras

As regras em `selection.rules` são avaliadas como OR lógico. Uma skill com `selection.requirement: "required"` deve ser selecionada quando ao menos uma regra corresponder.

Todas as regras devem ser avaliadas, mesmo depois da primeira correspondência, para que todas as evidências sejam registradas. Se múltiplas skills corresponderem, todas devem ser selecionadas. Não existe ranking, pontuação, desempate semântico ou escolha da melhor skill.

## Operadores suportados

Cada operador recebe uma lista não vazia de strings.

### `path_glob`

Corresponde quando ao menos um padrão glob casar integralmente com ao menos um caminho normalizado da tarefa.

O glob suporta somente:

* `*` para zero ou mais caracteres dentro de um segmento;
* `**` para zero ou mais segmentos de diretório;
* `?` para exatamente um caractere dentro de um segmento.

Outras construções de glob são inválidas em `schema_version: 1`.

### `identifier`

Corresponde quando ao menos um valor aparecer literalmente no texto original da tarefa.

A comparação diferencia maiúsculas de minúsculas e exige limites de token: o caractere anterior e o posterior, quando existirem, não podem ser letra, número, `_` ou `$`. O próprio valor não é normalizado.

### `phrase`

Corresponde quando ao menos uma frase normalizada aparecer como sequência contígua no texto normalizado da tarefa.

A correspondência exige limites de token no início e no fim da frase. Pontuação e separadores internos declarados na frase continuam significativos depois da normalização.

### `terms_any`

Corresponde quando ao menos um valor normalizado estiver presente no texto normalizado da tarefa.

Cada valor pode conter uma ou mais palavras e deve corresponder como sequência contígua com limites de token.

Para este operador, letras e números compõem tokens; `_`, `$`, pontuação, espaços e demais caracteres são separadores. Portanto, o termo `fk` corresponde em `fk_ser_id` e `fk__usuarios__id`, mas não em uma sequência alfanumérica como `fks`.

### `terms_all`

Corresponde somente quando todos os valores normalizados estiverem presentes no texto normalizado da tarefa.

Cada valor é avaliado independentemente como sequência contígua com limites de token. A ordem entre os valores da lista é irrelevante.

## Combinador `all`

`all` é um combinador lógico AND e recebe uma lista não vazia de expressões `match`.

Exemplo estrutural:

```yaml
match:
    all:
        - terms_any:
            - "criar"
            - "alterar"
        - terms_any:
            - "entidade"
            - "tabela"
```

Cada expressão interna deve possuir exatamente um dos operadores suportados ou o combinador `not`. `all` aninhado não é suportado em `schema_version: 1`.

O combinador corresponde somente quando todas as expressões internas corresponderem. Cada expressão interna correspondente deve registrar suas próprias evidências. Uma lista vazia ou uma expressão interna inválida torna o manifesto inválido.

## Combinador `not`

`not` é um combinador lógico de negação suportado somente como expressão interna de `all`. Ele recebe exatamente uma expressão `match`:

```yaml
match:
    all:
        - terms_any:
            - "alterar"
            - "editar"
        - not:
            phrase:
                - "sem alterar entidade"
                - "sem editar entidade"
```

A expressão interna de `not` deve usar exatamente um dos operadores `path_glob`, `identifier`, `phrase`, `terms_any` ou `terms_all`.

`not` corresponde somente quando sua expressão interna não corresponde. Quando a expressão interna corresponde, `not` falha e faz o `all` correspondente falhar.

`not` não gera evidência positiva de seleção. Ele apenas permite que uma regra positiva deixe de corresponder.

Expressão ausente, vazia, com mais de um operador ou com operador desconhecido invalida o manifesto. `all` e `not` dentro de `not` não são suportados em `schema_version: 1`.

Não existe combinador `any` em `schema_version: 1`. O OR entre regras e a semântica dos operadores que aceitam múltiplos valores cobrem esse comportamento sem combinador implícito.

## Normalização

Para `phrase`, `terms_any` e `terms_all`, texto e valores devem passar, nesta ordem, por:

1. normalização Unicode NFKC;
2. conversão para minúsculas;
3. remoção de diacríticos;
4. conversão de quebras de linha e tabulações em espaço;
5. redução de espaços consecutivos para um único espaço;
6. remoção de espaços no início e no fim.

Para `path_glob`, os caminhos devem:

1. substituir `\` por `/`;
2. remover segmentos `.` redundantes;
3. comparar sem diferença entre maiúsculas e minúsculas;
4. permanecer relativos à raiz do universodomedo.com quando estiverem dentro do repositório.

O operador `identifier` não usa normalização.

## Evidências

Cada correspondência deve registrar, no mínimo:

```yaml
skill: "nome-da-skill"
rule_id: "id-da-regra"
operator: "operador-utilizado"
expected: "valor ou padrão declarado"
source: "task_text ou task_path"
matched: "trecho ou caminho correspondente"
```

Operadores com múltiplos valores devem registrar cada valor que efetivamente correspondeu. Para `terms_all`, todos os valores devem gerar evidência. Para `all`, cada expressão positiva interna que contribuiu para a correspondência deve gerar suas próprias evidências. `not` nunca gera evidência.

## Protocolo operacional do seletor

O seletor canônico é `.agents/skill-system/selector/select-skills.mjs` e deve ser executado a partir da raiz do universodomedo.com por:

```powershell
npm run --silent skills:select
```

O seletor recebe um objeto JSON pela entrada padrão ou por `--input <arquivo>`. `--pretty` formata a saída e `--root <diretório>` define uma raiz alternativa para validações isoladas.

### Entrada

```json
{
    "protocol_version": 1,
    "task_text": "Texto integral da tarefa",
    "task_paths": [],
    "loaded_skills": []
}
```

Regras da entrada:

* `protocol_version` deve ser `1`;
* `task_text` deve ser uma string e pode estar vazia quando a seleção depender apenas de caminhos;
* `task_paths` deve conter strings não vazias, sem duplicatas, com os caminhos citados ou descobertos;
* `loaded_skills` deve conter strings não vazias, sem duplicatas, com as skills já carregadas integralmente na tarefa atual;
* campos desconhecidos ou tipos inválidos tornam a entrada inválida.

### Saída

```json
{
    "protocol_version": 1,
    "discovery_complete": true,
    "skills_found": [],
    "skills_selected": [],
    "skills_to_load": [],
    "skills_already_loaded": [],
    "invalid_manifests": []
}
```

Semântica da saída:

* `skills_found` lista os nomes encontrados na ordem lexicográfica dos caminhos relativos dos respectivos manifestos;
* `skills_selected` lista todas as skills correspondentes, seus caminhos, regras e evidências;
* `skills_to_load` lista somente skills selecionadas ainda ausentes de `loaded_skills`;
* `skills_already_loaded` lista skills selecionadas já carregadas na tarefa;
* `invalid_manifests` lista caminho e erros de cada manifesto inválido;
* `discovery_complete` é `false` quando qualquer manifesto não pôde ser validado.

O seletor deve ler no máximo `16384` bytes de cada `SKILL.md` e interromper a leitura assim que encontrar o fechamento do frontmatter. O corpo completo não pode ser carregado durante a descoberta.

Códigos de saída:

* `0`: descoberta concluída, com ou sem skills selecionadas;
* `2`: entrada ou argumentos inválidos;
* `3`: descoberta incompleta por manifesto inválido, duplicidade, skill aninhada ou falha de acesso.

Depois da descoberta, o agente deve carregar integralmente cada `SKILL.md` indicado por `skills_to_load`. Se novos caminhos forem descobertos antes da conclusão do plano, deve executar novamente o seletor com `task_paths` acumulado e `loaded_skills` atualizado.

No Windows PowerShell, quando a tarefa contiver acentos, usar `npm run --silent skills:select -- --input-base64 <BASE64_UTF8_DO_JSON>` para preservar UTF-8.

## Validação e bloqueio

Antes da seleção, todos os manifestos encontrados devem ser validados contra este contrato e contra o frontmatter do respectivo `SKILL.md`. A leitura do frontmatter para validação não autoriza carregar o corpo do arquivo.

Manifestos inválidos devem ser reportados antes do planejamento, com caminho e motivo. Uma skill com manifesto inválido não pode ser selecionada nem ter o corpo do `SKILL.md` carregado.

Um manifesto inválido, um nome duplicado ou uma falha de acesso torna a descoberta incompleta e deve bloquear o planejamento.

Quando uma skill for selecionada, o conteúdo completo do seu `SKILL.md` deve ser carregado antes do planejamento ou da implementação.

## Evolução futura

Quando a validação for automatizada por script, este contrato deve ganhar uma representação equivalente em `skill-manifest.schema.json`. O arquivo JSON não substitui este documento sem uma migração explícita da versão do contrato.
