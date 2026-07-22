# Bolão MODAL Web

## Fluxo Oficial do Sistema

**Projeto:** Bolão MODAL Web
**Etapa:** Revisão Geral 2030
**Documento:** Fluxo oficial do sistema
**Versão:** 1.0
**Data:** 22 de julho de 2026
**Status:** Fluxo atual documentado antes das alterações estruturais

---

## 1. Objetivo

Este documento registra o funcionamento atual do Bolão MODAL Web.

O fluxo principal do sistema é:

```text
Acesso
→ Login
→ Identificação do participante
→ Carregamento dos jogos
→ Registro dos palpites
→ Lançamento dos resultados
→ Cálculo da pontuação
→ Exibição do ranking
→ Atualização do chaveamento
```

Este documento deve servir como referência para:

* manutenção do sistema;
* correção de erros;
* criação de novas funcionalidades;
* implantação de segurança;
* organização das próximas competições;
* testes de ponta a ponta;
* futura reconstrução do sistema.

---

## 2. Perfis que utilizam o sistema

O sistema possui atualmente dois perfis funcionais.

### Participante

O participante pode:

* acessar a tela de login;
* informar nome e senha;
* entrar na tela de palpites;
* visualizar os jogos disponíveis;
* inserir palpites;
* atualizar palpites antes do bloqueio;
* visualizar o ranking;
* visualizar o chaveamento.

### Administrador

O administrador pode:

* acessar o `admin.html`;
* informar a senha administrativa;
* visualizar os jogos;
* lançar resultados;
* corrigir resultados;
* apagar resultados;
* indicar o vencedor de um jogo empatado no mata-mata;
* disparar a atualização automática do chaveamento.

O sistema atual não possui um perfil administrativo real no banco.

A diferenciação entre participante e administrador ocorre somente pelas páginas utilizadas e pela senha escrita no JavaScript do Admin.

---

## 3. Páginas do fluxo

As páginas principais são:

```text
index.html
login.html
palpites.html
ranking.html
admin.html
chaveamento.html
```

Página auxiliar:

```text
teste-engine.html
```

O `teste-engine.html` não participa do fluxo normal de produção.

---

## 4. Fluxo inicial

### 4.1 Acesso ao site

O participante acessa:

```text
index.html
```

A página inicial apresenta as opções principais de navegação.

A partir dela, o participante pode seguir para:

```text
login.html
ranking.html
chaveamento.html
```

A tela de palpites deve ser acessada depois da identificação do participante.

---

## 5. Fluxo de login

### 5.1 Abertura da página

O participante acessa:

```text
login.html
```

A página carrega:

```text
Biblioteca JavaScript do Supabase
js/supabase.js
js/login.js
```

---

### 5.2 Dados informados

O participante informa:

```text
Nome
Senha
```

O formulário chama a função de login do arquivo:

```text
js/login.js
```

---

### 5.3 Consulta ao Supabase

O navegador consulta a tabela:

```text
participantes
```

O fluxo atual solicita os dados dos participantes e procura uma correspondência entre:

```text
nome informado
senha informada
```

A verificação ocorre no navegador.

---

### 5.4 Login aceito

Quando o nome e a senha coincidem, o sistema grava no `localStorage`:

```text
usuarioLogado
usuarioId
```

Exemplo conceitual:

```javascript
localStorage.setItem(
    'usuarioLogado',
    participante.nome
);

localStorage.setItem(
    'usuarioId',
    participante.id
);
```

Depois disso, o participante é direcionado para:

```text
palpites.html
```

---

### 5.5 Login recusado

Quando o nome ou a senha não coincidem, o sistema apresenta uma mensagem de erro.

O participante permanece na tela de login.

---

### 5.6 Fragilidade atual

A identidade do participante depende de dados armazenados no navegador.

Atualmente:

* não existe sessão segura;
* não existe Supabase Auth;
* não existe token individual de participante;
* o ID pode ser alterado pelo console do navegador;
* a tabela de participantes está acessível sem RLS.

Esse fluxo deverá ser substituído durante a revisão de segurança.

---

## 6. Fluxo da tela de palpites

### 6.1 Abertura

A página:

```text
palpites.html
```

carrega:

```text
Biblioteca JavaScript do Supabase
js/supabase.js
js/palpites.js
```

---

### 6.2 Identificação do participante

O arquivo `palpites.js` consulta o `localStorage`.

Dados utilizados:

```text
usuarioLogado
usuarioId
```

Caso esses dados não existam, o sistema deve impedir o uso normal da tela ou direcionar o visitante para o login.

---

### 6.3 Carregamento dos jogos

O navegador consulta a tabela:

```text
jogos
```

Os jogos são organizados de acordo com informações como:

```text
grupo
rodada
fase
ordem
data
hora
```

---

### 6.4 Fase de grupos

Os jogos da fase de grupos utilizam:

```text
fase = GRUPO
```

A estrutura possui:

```text
72 jogos
```

Os jogos são exibidos conforme grupo e rodada.

---

### 6.5 Mata-mata

Os jogos do mata-mata utilizam:

```text
grupo = MATA
```

Fases disponíveis:

```text
16AVOS
OITAVAS
QUARTAS
SEMIFINAL
TERCEIRO
FINAL
```

O sistema mostra somente os jogos cujos confrontos já estão definidos.

Jogos que ainda possuem:

```text
A definir
```

não devem ser disponibilizados para palpites.

---

### 6.6 Controle da fase atual

A fase visível do mata-mata é controlada manualmente no arquivo:

```text
js/palpites.js
```

Exemplo de fase única:

```javascript
const FASE_MATA_ATUAL = 'QUARTAS';
```

Exemplo de duas fases simultâneas:

```javascript
const FASES_MATA_ATUAIS = [
    'TERCEIRO',
    'FINAL'
];
```

Esse controle exige:

1. alteração manual no código;
2. novo commit;
3. novo push;
4. nova publicação na Vercel.

A versão futura deverá armazenar a fase atual no banco ou em uma configuração administrativa.

---

## 7. Carregamento dos palpites existentes

Depois de carregar os jogos, o sistema consulta:

```text
palpites
```

A consulta utiliza:

```text
participante_id
```

O objetivo é localizar os palpites já registrados pelo participante.

Quando um palpite existe, os campos são preenchidos com:

```text
mandante
visitante
```

Quando não existe, os campos permanecem vazios.

---

## 8. Registro dos palpites

### 8.1 Dados gravados

Cada palpite registra:

```text
participante_id
jogo_id
mandante
visitante
```

---

### 8.2 Primeiro salvamento

Quando ainda não existe palpite para aquele participante e jogo, o sistema realiza uma inclusão.

Operação conceitual:

```text
INSERT em palpites
```

---

### 8.3 Atualização

Quando já existe um palpite para aquele participante e jogo, o sistema atualiza o registro existente.

Operação conceitual:

```text
UPDATE em palpites
```

---

### 8.4 Prevenção de duplicidade

A tabela `palpites` possui uma restrição única:

```text
participante_id + jogo_id
```

Essa regra impede que o mesmo participante tenha dois registros para o mesmo jogo.

---

## 9. Bloqueio dos palpites

O sistema compara a data e o horário do jogo com a data e o horário do computador do participante.

Quando o jogo já começou, os campos devem ficar bloqueados.

Fluxo conceitual:

```text
Data atual menor que data do jogo
→ Palpite liberado

Data atual igual ou maior que data do jogo
→ Palpite bloqueado
```

### Fragilidade atual

O bloqueio ocorre no navegador.

Uma pessoa pode tentar:

* alterar o relógio do computador;
* remover o atributo de bloqueio pelo console;
* chamar diretamente a API do Supabase.

Sem RLS ou validação no banco, o horário de bloqueio não representa uma proteção real.

---

## 10. Fluxo administrativo

### 10.1 Abertura

O administrador acessa:

```text
admin.html
```

A página carrega:

```text
Biblioteca JavaScript do Supabase
js/supabase.js
js/admin.js
```

---

### 10.2 Proteção atual

O arquivo `admin.js` solicita uma senha por meio de uma janela do navegador.

A senha atual está escrita diretamente no JavaScript.

O objetivo dessa proteção é apenas impedir o acesso casual à interface.

Ela não protege o banco.

---

### 10.3 Carregamento dos jogos

O Admin consulta:

```text
jogos
```

Cada jogo é apresentado com campos para:

```text
placar do mandante
placar do visitante
vencedor do empate
```

O campo de vencedor é utilizado apenas quando necessário.

---

### 10.4 Carregamento dos resultados existentes

O Admin consulta:

```text
resultados
```

Quando um jogo já possui resultado, os campos são preenchidos.

Dados utilizados:

```text
jogo_id
mandante
visitante
vencedor
```

---

## 11. Salvamento dos resultados

### 11.1 Resultado normal

Quando o jogo não termina empatado, o Admin informa:

```text
placar do mandante
placar do visitante
```

O campo `vencedor` permanece vazio.

Exemplo:

```text
Brasil 2 x 1 Argentina
vencedor = NULL
```

---

### 11.2 Empate na fase de grupos

Quando um jogo da fase de grupos termina empatado:

```text
mandante = visitante
```

O campo `vencedor` permanece vazio.

---

### 11.3 Empate no mata-mata

Quando um jogo do mata-mata termina empatado, o Admin também escolhe:

```text
MANDANTE
```

ou:

```text
VISITANTE
```

Esse valor indica quem avançou.

Exemplo:

```text
Brasil 1 x 1 Argentina
vencedor = MANDANTE
```

A pontuação considera somente:

```text
1 x 1
```

O campo `vencedor` serve apenas para o chaveamento.

---

### 11.4 Inclusão ou atualização

O sistema salva o resultado na tabela:

```text
resultados
```

Como `jogo_id` é a chave primária, existe apenas um resultado por jogo.

O salvamento pode inserir um novo registro ou atualizar o registro existente.

---

### 11.5 Apagamento

Quando os dois campos do placar ficam vazios, o sistema remove o resultado daquele jogo.

Operação conceitual:

```text
DELETE em resultados
```

Depois disso, o jogo volta a ficar sem resultado oficial.

---

## 12. Reprocessamento do chaveamento

Depois de salvar ou apagar um resultado, o Admin chama a função:

```text
reprocessar_chaveamento_mata_mata()
```

Essa função atualiza os confrontos futuros.

Ela utiliza as origens armazenadas em:

```text
origem_mandante
origem_visitante
```

Exemplos:

```text
V73
V74
P101
```

Significados:

```text
V = vencedor
P = perdedor
```

---

## 13. Resolução das origens

A função auxiliar:

```text
resolver_origem_mata_mata()
```

recebe uma origem e descobre qual seleção deve ocupar a vaga.

Exemplo:

```text
V73
```

Fluxo:

```text
Localizar jogo 73
→ Ler resultado
→ Descobrir vencedor
→ Retornar nome e escudo
```

Exemplo:

```text
P101
```

Fluxo:

```text
Localizar jogo 101
→ Ler resultado
→ Descobrir perdedor
→ Retornar nome e escudo
```

---

## 14. Atualização das fases

O chaveamento segue esta sequência:

```text
16AVOS
→ OITAVAS
→ QUARTAS
→ SEMIFINAL
→ TERCEIRO
→ FINAL
```

Os jogos de `16AVOS` possuem confrontos definidos diretamente.

As demais fases recebem as seleções por meio das origens.

---

## 15. Fluxo das Oitavas

```text
89: V73 x V74
90: V75 x V76
91: V77 x V78
92: V79 x V80
93: V81 x V82
94: V83 x V84
95: V85 x V86
96: V87 x V88
```

Quando os resultados dos jogos `73` a `88` são registrados, os jogos `89` a `96` recebem seus participantes.

---

## 16. Fluxo das Quartas

```text
97: V89 x V90
98: V93 x V94
99: V91 x V92
100: V95 x V96
```

---

## 17. Fluxo das Semifinais

```text
101: V97 x V99
102: V98 x V100
```

---

## 18. Fluxo do Terceiro Lugar

```text
103: P101 x P102
```

A disputa recebe os perdedores das duas semifinais.

---

## 19. Fluxo da Final

```text
104: V101 x V102
```

A Final recebe os vencedores das duas semifinais.

---

## 20. Risco de alteração retroativa

Existe um cenário que exige atenção.

Exemplo:

1. O jogo `89` possui um vencedor.
2. Esse vencedor é enviado para o jogo `97`.
3. O jogo `97` recebe palpites e resultado.
4. Depois, o resultado do jogo `89` é corrigido.
5. A seleção presente no jogo `97` é substituída.
6. Os palpites e o resultado antigo do jogo `97` continuam gravados.

O sistema atual não invalida automaticamente:

* palpites da fase seguinte;
* resultados da fase seguinte;
* avanços posteriores.

A versão futura deverá impedir ou controlar alterações retroativas.

---

## 21. Fluxo de cálculo da pontuação

A pontuação é calculada comparando:

```text
palpites
resultados
```

Campos comparados:

```text
palpite mandante
palpite visitante
resultado mandante
resultado visitante
```

Valores possíveis:

```text
10
6
4
2
0
```

A regra oficial está documentada em:

```text
docs/02-regras-pontuacao.md
```

---

## 22. Ranking geral

O ranking geral pode ser obtido por:

```text
VIEW ranking
```

ou:

```text
RPC ranking()
```

Durante a auditoria, os dois resultados foram idênticos.

O ranking geral considera todos os jogos válidos da competição.

---

## 23. Ranking do mata-mata

O ranking do mata-mata é obtido por:

```text
RPC ranking_mata_mata()
```

Ele considera apenas jogos do mata-mata.

A função inclui participantes que fizeram zero ponto nessa etapa.

---

## 24. Resumo de pontos

O arquivo:

```text
js/ranking.js
```

consulta os dados necessários e recalcula as quantidades de:

```text
10 pontos
6 pontos
4 pontos
2 pontos
0 pontos
```

Essa lógica é utilizada para:

* exibir o resumo;
* montar o tooltip;
* aplicar critérios de desempate.

Durante a auditoria, foi encontrada divergência entre essa regra JavaScript e a regra SQL oficial.

Os totais vindos do banco estão corretos.

O resumo e a ordem dos participantes empatados podem estar incorretos.

---

## 25. Tela do ranking

A página:

```text
ranking.html
```

apresenta:

```text
Classificação
Resumo de Pontos
```

O ranking utiliza os pontos recebidos do Supabase.

O painel de resumo utiliza as contagens calculadas no navegador.

A futura implementação deverá receber todas essas informações de uma única função oficial.

---

## 26. Fluxo da tela de chaveamento

A página:

```text
chaveamento.html
```

carrega:

```text
js/chaveamento-tela.js
```

O JavaScript consulta os jogos do mata-mata no Supabase.

Cada card possui um identificador relacionado ao jogo.

Exemplo:

```text
jogo 89
jogo 97
jogo 104
```

O sistema atualiza:

```text
nome do mandante
nome do visitante
escudo do mandante
escudo do visitante
placar
```

---

## 27. Pênaltis no chaveamento

Os placares de pênaltis exibidos atualmente não estão armazenados em uma coluna específica do Supabase.

Eles foram escritos diretamente no HTML.

O JavaScript preserva esses valores ao atualizar os cards.

A versão futura deverá decidir entre:

```text
manter pênaltis somente como informação visual
```

ou:

```text
criar campos próprios no banco
```

---

## 28. Arquivos e responsabilidades

| Arquivo                  | Responsabilidade atual            |
| ------------------------ | --------------------------------- |
| `index.html`             | Página inicial                    |
| `login.html`             | Formulário de login               |
| `palpites.html`          | Tela de palpites                  |
| `ranking.html`           | Ranking e resumo                  |
| `admin.html`             | Lançamento de resultados          |
| `chaveamento.html`       | Visualização do mata-mata         |
| `js/supabase.js`         | Cliente do Supabase               |
| `js/login.js`            | Login dos participantes           |
| `js/palpites.js`         | Jogos e palpites                  |
| `js/ranking.js`          | Ranking e desempates              |
| `js/admin.js`            | Resultados e reprocessamento      |
| `js/chaveamento-tela.js` | Atualização visual do chaveamento |
| `js/calcular.js`         | Cálculo antigo não utilizado      |
| `js/app.js`              | Mensagem de console               |
| `js/engine/*`            | Engine JavaScript de teste        |

---

## 29. Tabelas e responsabilidades

| Tabela          | Responsabilidade                         |
| --------------- | ---------------------------------------- |
| `participantes` | Nomes e senhas dos participantes         |
| `jogos`         | Calendário, confrontos, fases e origens  |
| `palpites`      | Palpites registrados                     |
| `resultados`    | Resultados oficiais e vencedor em empate |

---

## 30. Funções e responsabilidades

| Objeto                                    | Responsabilidade               |
| ----------------------------------------- | ------------------------------ |
| VIEW `ranking`                            | Ranking geral                  |
| RPC `ranking()`                           | Ranking geral                  |
| RPC `ranking_mata_mata()`                 | Ranking do mata-mata           |
| RPC `resolver_origem_mata_mata()`         | Descobrir vencedor ou perdedor |
| RPC `reprocessar_chaveamento_mata_mata()` | Atualizar confrontos futuros   |

---

## 31. Fluxo completo do participante

```text
Participante acessa o site
→ Abre o login
→ Informa nome e senha
→ Sistema consulta participantes
→ Login é validado no navegador
→ ID e nome são gravados no localStorage
→ Participante abre a tela de palpites
→ Sistema carrega jogos
→ Sistema carrega palpites existentes
→ Participante preenche os placares
→ Sistema salva na tabela palpites
→ Participante consulta o ranking
→ Participante consulta o chaveamento
```

---

## 32. Fluxo completo do administrador

```text
Administrador acessa admin.html
→ Sistema solicita senha
→ Admin carrega jogos e resultados
→ Administrador informa o resultado
→ Em empate eliminatório, escolhe o vencedor
→ Resultado é salvo
→ Função de reprocessamento é chamada
→ Próximas fases são atualizadas
→ Ranking passa a considerar o resultado
→ Chaveamento visual exibe os novos confrontos
```

---

## 33. Fluxo completo dos dados

```text
participantes
→ identifica quem está palpando

jogos
→ define quais partidas existem

palpites
→ guarda as previsões dos participantes

resultados
→ guarda os placares oficiais

funções SQL
→ calculam pontos e atualizam o chaveamento

ranking.js
→ apresenta classificação e resumo

chaveamento-tela.js
→ apresenta o caminho até a Final
```

---

## 34. Dependências entre recursos

### Login depende de

```text
participantes
supabase.js
login.js
localStorage
```

### Palpites dependem de

```text
jogos
palpites
participante identificado
data e hora do navegador
fase definida no código
```

### Admin depende de

```text
jogos
resultados
senha escrita no JavaScript
função reprocessar_chaveamento_mata_mata()
```

### Ranking depende de

```text
participantes
jogos
palpites
resultados
funções SQL
regra JavaScript de desempate
```

### Chaveamento depende de

```text
jogos
resultados
origens do mata-mata
função de reprocessamento
chaveamento-tela.js
```

---

## 35. Pontos únicos de falha

### Supabase indisponível

Impacto:

```text
login não funciona
palpites não carregam
ranking não carrega
Admin não carrega
chaveamento não atualiza
```

### Função de reprocessamento com erro

Impacto:

```text
próximas fases não são atualizadas corretamente
```

### Resultado incorreto

Impacto:

```text
pontuação incorreta
classificação incorreta
chaveamento incorreto
```

### Regra de pontuação divergente

Impacto:

```text
totais e resumo podem apresentar histórias diferentes
```

### Fase atual configurada incorretamente

Impacto:

```text
jogos errados podem aparecer ou ficar escondidos
```

---

## 36. Teste de ponta a ponta

O teste completo deve utilizar um participante e um jogo de teste.

Fluxo mínimo:

```text
1. Cadastrar ou selecionar participante de teste
2. Realizar login
3. Abrir tela de palpites
4. Registrar um palpite
5. Confirmar o registro no Supabase
6. Abrir Admin
7. Registrar o resultado
8. Confirmar o resultado no Supabase
9. Conferir a pontuação
10. Conferir o ranking
11. Conferir o resumo de pontos
12. Conferir o chaveamento, quando aplicável
13. Apagar os dados de teste
14. Confirmar que o sistema voltou ao estado anterior
```

Esse teste não deve ser realizado com um participante real sem backup e planejamento.

---

## 37. Regras para futuras alterações

Antes de alterar qualquer fluxo, deve ser informado:

```text
objetivo
arquivo afetado
tabela ou função afetada
impacto esperado
risco
procedimento de backup
teste necessário
resultado esperado
```

Uma alteração não deve misturar:

```text
segurança
visual
regra de negócio
limpeza de código
```

Cada Sprint deve possuir um objetivo principal.

---

## 38. Fluxo futuro recomendado

O fluxo desejado para a versão revisada é:

```text
Participante autenticado
→ Sessão segura
→ Banco identifica o usuário
→ RLS limita os dados acessíveis
→ Servidor ou banco valida o horário
→ Palpite é salvo somente para o próprio usuário
→ Resultado é lançado por administrador autenticado
→ Regra única calcula pontos e desempates
→ Auditoria registra cada pontuação
→ Configuração no banco controla a fase atual
```

---

## 39. Prioridades de revisão do fluxo

### Prioridade 1

Remover arquivos públicos com dados sensíveis.

### Prioridade 2

Unificar a regra de pontuação.

### Prioridade 3

Criar autenticação segura.

### Prioridade 4

Ativar RLS com políticas controladas.

### Prioridade 5

Restringir funções administrativas.

### Prioridade 6

Mover a fase atual para uma configuração do banco.

### Prioridade 7

Criar auditoria oficial de pontuação.

### Prioridade 8

Organizar o visual e o código.

---

## 40. Estado documentado

O fluxo atual funcionou durante a competição de 2026.

Os dados estão íntegros e a pontuação total calculada no Supabase está correta.

As principais fragilidades do fluxo estão em:

```text
autenticação no navegador
localStorage como identidade
RLS desativado
senha administrativa no JavaScript
controle de fase no código
regra de pontuação duplicada
funções administrativas públicas
```

Este documento registra o caminho atual antes das futuras alterações.
