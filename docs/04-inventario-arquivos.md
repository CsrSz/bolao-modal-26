# Bolão MODAL Web

## Inventário Oficial dos Arquivos e Dependências

**Projeto:** Bolão MODAL Web
**Etapa:** Revisão Geral 2030
**Documento:** Inventário oficial dos arquivos
**Versão:** 1.0
**Data:** 22 de julho de 2026
**Status:** Estrutura auditada antes da organização do repositório

---

## 1. Objetivo

Este documento registra os arquivos encontrados no repositório do Bolão MODAL Web.

Para cada arquivo ou conjunto de arquivos, são documentados:

* função atual;
* páginas ou recursos dependentes;
* classificação;
* riscos conhecidos;
* destino recomendado;
* possibilidade de remoção futura.

Nenhum arquivo classificado neste documento deve ser removido antes de uma Sprint específica de organização e dos testes correspondentes.

---

## 2. Estrutura real auditada

```text
@Bolao Copa - HTML (web)
│
├── admin.html
├── chaveamento.html
├── chaveamento.ORIGINAL
├── index.html
├── login.html
├── palpites.html
├── ranking.html
├── teste-engine.html
│
├── assets
│   ├── copa-2026.png
│   ├── logo_modal.png
│   ├── new-logo-2026-azul.png
│   └── escudos
│
├── css
│   └── style.css
│
├── dados
│   ├── participantes.json
│   └── resultados.json
│
├── docs
│   ├── 01-diagnostico-geral.md
│   ├── 02-regras-pontuacao.md
│   ├── 03-fluxo-do-sistema.md
│   └── 04-inventario-arquivos.md
│
└── js
    ├── admin.js
    ├── app.js
    ├── calcular.js
    ├── chaveamento-tela.js
    ├── login.js
    ├── palpites.js
    ├── ranking.js
    ├── supabase.js
    │
    └── engine
        ├── chaveamento.js
        ├── classificacao.js
        ├── competicao.js
        └── config.js
```

---

## 3. Classificações utilizadas

### Ativo

Arquivo utilizado diretamente pelo sistema em produção.

### Auxiliar

Arquivo necessário para apoiar um recurso ativo, mas que não representa uma página principal.

### Documentação

Arquivo usado para registrar regras, arquitetura, decisões ou histórico.

### Teste

Arquivo criado para testes técnicos e que não faz parte do fluxo normal de produção.

### Backup

Cópia de segurança ou versão anterior de outro arquivo.

### Antigo

Arquivo de uma implementação anterior que não participa mais do sistema atual.

### Sensível

Arquivo que contém dados que não deveriam estar publicamente disponíveis.

### Candidato à remoção

Arquivo que aparentemente pode ser removido no futuro, mas somente depois de validação e backup.

---

## 4. Resumo das classificações

| Categoria                         | Quantidade aproximada |
| --------------------------------- | --------------------: |
| Páginas HTML ativas               |                     6 |
| Página HTML de teste              |                     1 |
| Backup sem extensão HTML          |                     1 |
| JavaScripts ativos                |                     6 |
| JavaScripts antigos ou auxiliares |                     2 |
| Arquivos da Engine de teste       |                     4 |
| Arquivo CSS principal             |                     1 |
| Arquivos JSON antigos             |                     2 |
| Imagens principais                |                     3 |
| Escudos                           |                    48 |
| Documentos oficiais               |                     4 |

---

# 5. Páginas HTML

## 5.1 `index.html`

**Classificação:** Ativo
**Função:** Página inicial do sistema.

### Dependências

```text
css/style.css
js/app.js
js/login.js
assets
```

### Responsabilidades

* apresentar o Bolão;
* oferecer navegação para as páginas;
* servir como entrada pública do sistema.

### Observações

O arquivo carrega `app.js`, que atualmente possui apenas uma mensagem de console.

Também carrega `login.js`, embora o formulário principal de login esteja em `login.html`.

### Risco

Baixo.

### Destino recomendado

Manter.

Em Sprint futura, revisar se `app.js` e `login.js` precisam continuar carregados nesta página.

---

## 5.2 `login.html`

**Classificação:** Ativo
**Função:** Login dos participantes.

### Dependências

```text
css/style.css
Biblioteca externa do Supabase
js/supabase.js
js/login.js
```

### Recursos utilizados no banco

```text
participantes
```

### Responsabilidades

* receber nome e senha;
* consultar os participantes;
* validar as credenciais no navegador;
* salvar `usuarioLogado` e `usuarioId` no `localStorage`;
* encaminhar o participante para `palpites.html`.

### Risco

Crítico.

A página depende de uma autenticação feita inteiramente no navegador.

### Destino recomendado

Manter durante a migração.

Substituir futuramente por autenticação segura, sem interromper o sistema atual antes da nova solução estar validada.

---

## 5.3 `palpites.html`

**Classificação:** Ativo
**Função:** Registro e atualização de palpites.

### Dependências

```text
css/style.css
Biblioteca externa do Supabase
js/supabase.js
js/palpites.js
assets/escudos
```

### Recursos utilizados no banco

```text
jogos
palpites
participantes, indiretamente pelo usuarioId
```

### Responsabilidades

* identificar o participante;
* carregar os jogos;
* carregar os palpites existentes;
* exibir os jogos da fase liberada;
* salvar e atualizar palpites;
* bloquear os campos depois do horário dos jogos.

### Riscos

* identidade baseada em `localStorage`;
* bloqueio de horário realizado no navegador;
* fase atual definida diretamente no JavaScript;
* gravação sem proteção RLS.

### Destino recomendado

Manter.

Será um dos principais arquivos das futuras Sprints de segurança e controle de fase.

---

## 5.4 `ranking.html`

**Classificação:** Ativo
**Função:** Exibir classificação e resumo de pontos.

### Dependências

```text
css/style.css
Biblioteca externa do Supabase
js/supabase.js
js/ranking.js
assets
```

### Recursos utilizados no banco

```text
participantes
jogos
palpites
resultados
RPC ranking_mata_mata()
VIEW ranking ou RPC ranking()
```

### Responsabilidades

* exibir o ranking;
* apresentar os pontos;
* apresentar o resumo de 10, 6, 4, 2 e 0 pontos;
* aplicar desempates na interface.

### Risco

Alto.

Os pontos totais vêm corretamente do Supabase, mas o resumo e o desempate são recalculados por uma regra JavaScript divergente.

### Destino recomendado

Manter.

Corrigir somente após a criação de uma função oficial única de ranking e desempate.

---

## 5.5 `admin.html`

**Classificação:** Ativo
**Função:** Administração dos resultados oficiais.

### Dependências

```text
css/style.css
Biblioteca externa do Supabase
js/supabase.js
js/admin.js
assets/escudos
```

### Recursos utilizados no banco

```text
jogos
resultados
RPC reprocessar_chaveamento_mata_mata()
```

### Responsabilidades

* carregar jogos;
* carregar resultados;
* inserir e atualizar resultados;
* apagar resultados;
* indicar o vencedor em empates do mata-mata;
* reprocessar o chaveamento.

### Risco

Crítico.

O acesso depende de uma senha escrita diretamente em `admin.js`.

### Destino recomendado

Manter durante a migração.

A página deverá utilizar autenticação e permissão administrativa reais.

---

## 5.6 `chaveamento.html`

**Classificação:** Ativo
**Função:** Apresentação visual do mata-mata.

### Dependências

```text
CSS interno
Biblioteca externa do Supabase
js/supabase.js
js/chaveamento-tela.js
assets/escudos
assets/logo_modal.png
```

### Recursos utilizados no banco

```text
jogos
resultados
```

### Responsabilidades

* exibir os 32 jogos eliminatórios;
* apresentar confrontos;
* apresentar escudos;
* apresentar placares;
* mostrar o caminho até a Final.

### Observações

O arquivo possui grande quantidade de CSS interno.

Os placares de pênaltis foram escritos diretamente no HTML.

### Risco

Médio.

A página funciona, mas mistura estrutura, conteúdo especial e muito CSS no mesmo arquivo.

### Destino recomendado

Manter.

Em Sprint futura, extrair o CSS interno e decidir como armazenar informações de pênaltis.

---

## 5.7 `teste-engine.html`

**Classificação:** Teste
**Função:** Testar a Engine JavaScript.

### Dependências

```text
js/supabase.js
js/engine/config.js
js/engine/classificacao.js
js/engine/chaveamento.js
js/engine/competicao.js
```

### Problema encontrado

A página não carrega a biblioteca externa do Supabase antes de `js/supabase.js`.

Pode apresentar:

```text
supabase is not defined
```

### Relação com a produção

Nenhuma página ativa depende deste arquivo.

### Risco

Baixo para o sistema, médio para manutenção.

A presença de um teste quebrado pode gerar confusão sobre qual Engine está ativa.

### Destino recomendado

Manter temporariamente.

Depois, decidir entre:

```text
corrigir e documentar como teste
```

ou:

```text
mover para uma pasta de testes
```

ou:

```text
arquivar
```

---

## 5.8 `chaveamento.ORIGINAL`

**Classificação:** Backup
**Função:** Preservar uma versão anterior do chaveamento.

### Dependências

Nenhuma dependência encontrada.

### Relação com a produção

Não é carregado por nenhuma página ou JavaScript.

### Risco

Baixo.

Por estar dentro do repositório público, pode ser acessado diretamente dependendo da publicação da Vercel.

### Destino recomendado

Mover futuramente para:

```text
backups/
```

ou manter apenas no histórico do Git.

Depois da validação, poderá ser removido da raiz pública.

---

# 6. Arquivos JavaScript ativos

## 6.1 `js/supabase.js`

**Classificação:** Ativo e auxiliar
**Função:** Criar o cliente do Supabase.

### Utilizado por

```text
login.html
palpites.html
ranking.html
admin.html
chaveamento.html
teste-engine.html
```

### Responsabilidades

* armazenar a URL do Supabase;
* armazenar a chave pública;
* criar `supabaseClient`.

### Observação de segurança

A chave pública pode aparecer no navegador.

A proteção deve ser realizada por:

```text
autenticação
RLS
permissões
políticas
funções protegidas
```

### Risco

Crítico enquanto o RLS estiver desativado.

### Destino recomendado

Manter.

Será revisado junto da futura arquitetura de autenticação.

---

## 6.2 `js/login.js`

**Classificação:** Ativo
**Função:** Controlar o login.

### Utilizado por

```text
index.html
login.html
```

### Dependências

```text
supabaseClient
localStorage
tabela participantes
```

### Responsabilidades

* validar campos;
* consultar participantes;
* comparar nome e senha;
* gravar usuário no navegador;
* direcionar para palpites.

### Risco

Crítico.

### Destino recomendado

Manter durante a migração.

Será profundamente revisado na Sprint de autenticação.

---

## 6.3 `js/palpites.js`

**Classificação:** Ativo
**Função:** Controlar a tela de palpites.

### Utilizado por

```text
palpites.html
```

### Dependências

```text
supabaseClient
localStorage
jogos
palpites
```

### Responsabilidades

* carregar jogos;
* filtrar fases;
* ordenar jogos;
* carregar palpites;
* salvar e atualizar palpites;
* bloquear jogos iniciados.

### Risco

Crítico enquanto não houver RLS e validação do horário no banco.

### Destino recomendado

Manter.

Será revisado em etapas pequenas, sem reconstrução total de uma vez.

---

## 6.4 `js/ranking.js`

**Classificação:** Ativo
**Função:** Montar a classificação e o resumo de pontos.

### Utilizado por

```text
ranking.html
```

### Dependências

```text
supabaseClient
ranking()
ranking_mata_mata()
participantes
palpites
resultados
jogos
```

### Responsabilidades

* carregar ranking;
* recalcular pontos por categoria;
* ordenar participantes empatados;
* montar o painel de resumo;
* montar os tooltips.

### Problema conhecido

A implementação JavaScript não segue integralmente a regra oficial documentada.

### Risco

Alto.

### Destino recomendado

Manter até a Sprint de unificação da pontuação.

Depois, reduzir sua responsabilidade para apenas apresentar dados calculados pelo banco.

---

## 6.5 `js/admin.js`

**Classificação:** Ativo
**Função:** Controlar resultados e chaveamento.

### Utilizado por

```text
admin.html
```

### Dependências

```text
supabaseClient
jogos
resultados
reprocessar_chaveamento_mata_mata()
```

### Responsabilidades

* solicitar senha administrativa;
* carregar jogos;
* carregar resultados;
* salvar resultados;
* apagar resultados;
* selecionar vencedor;
* reprocessar chaveamento.

### Problema conhecido

Contém a senha administrativa em texto aberto.

### Risco

Crítico.

### Destino recomendado

Manter durante a transição.

A proteção por senha deve ser removida somente quando o novo acesso administrativo estiver funcionando.

---

## 6.6 `js/chaveamento-tela.js`

**Classificação:** Ativo
**Função:** Atualizar visualmente o chaveamento.

### Utilizado por

```text
chaveamento.html
```

### Dependências

```text
supabaseClient
jogos
resultados
estrutura de IDs do chaveamento.html
```

### Responsabilidades

* localizar cards dos jogos;
* preencher nomes;
* preencher escudos;
* preencher placares;
* preservar informações visuais específicas.

### Risco

Médio.

O arquivo depende diretamente da estrutura atual do HTML.

### Destino recomendado

Manter.

Deve ser revisado junto da futura refatoração visual do chaveamento.

---

# 7. Arquivos JavaScript antigos ou auxiliares

## 7.1 `js/app.js`

**Classificação:** Auxiliar e candidato à remoção
**Função atual:** Exibir uma mensagem no console.

### Utilizado por

```text
index.html
```

### Dependências

Nenhuma relevante.

### Relação com o sistema

Não executa regra de negócio.

### Risco

Baixo.

### Destino recomendado

Não remover agora.

Em Sprint de limpeza:

1. retirar a referência de `index.html`;
2. testar a página inicial;
3. remover o arquivo;
4. confirmar que nada foi afetado.

---

## 7.2 `js/calcular.js`

**Classificação:** Antigo e candidato à remoção
**Função:** Implementação antiga da pontuação.

### Utilizado por

Nenhuma página encontrada.

### Observação importante

A lógica presente neste arquivo está mais próxima da regra oficial do que parte da lógica atual do `ranking.js`.

Mesmo assim, não é a fonte oficial e não participa do funcionamento do sistema.

### Risco

Médio para manutenção.

A existência de várias implementações da regra pode levar alguém a editar o arquivo errado.

### Destino recomendado

Manter até a Sprint de unificação da pontuação.

Depois da criação da regra oficial única, poderá ser arquivado ou removido.

---

# 8. Engine JavaScript

## 8.1 `js/engine/config.js`

**Classificação:** Teste
**Função:** Configurar dados utilizados pela Engine JavaScript.

### Utilizado por

```text
teste-engine.html
outros arquivos da pasta js/engine
```

### Relação com a produção

Não participa da Engine SQL usada pelo Admin.

### Destino recomendado

Manter temporariamente e mover futuramente para uma pasta de testes ou legado.

---

## 8.2 `js/engine/classificacao.js`

**Classificação:** Teste
**Função:** Calcular ou organizar a classificação utilizada pela Engine JavaScript.

### Utilizado por

```text
teste-engine.html
js/engine/competicao.js
```

### Relação com a produção

Nenhuma dependência direta encontrada nas páginas ativas.

### Destino recomendado

Manter temporariamente.

---

## 8.3 `js/engine/chaveamento.js`

**Classificação:** Teste e antigo
**Função:** Gerar confrontos eliminatórios no JavaScript.

### Observação

Possui confrontos de 2026 escritos diretamente no código.

A função recebe dados de classificação, mas a implementação auditada utiliza confrontos fixos.

### Relação com a produção

O sistema ativo utiliza a função SQL:

```text
reprocessar_chaveamento_mata_mata()
```

### Risco

Médio para manutenção.

Pode causar confusão com a Engine SQL real.

### Destino recomendado

Manter temporariamente.

Depois, documentar como protótipo ou arquivar.

---

## 8.4 `js/engine/competicao.js`

**Classificação:** Teste
**Função:** Coordenar os componentes da Engine JavaScript.

### Utilizado por

```text
teste-engine.html
```

### Relação com a produção

Não é carregado pelas páginas ativas.

### Destino recomendado

Manter temporariamente.

---

## 8.5 `js/engine/utils.js`

**Classificação:** Inexistente
**Situação:** O arquivo não existe no repositório real.

Ele foi citado em momentos anteriores do desenvolvimento, mas não chegou a fazer parte da estrutura atual.

### Destino recomendado

Não criar automaticamente.

Somente criar no futuro caso uma necessidade real de funções utilitárias seja identificada durante a limpeza do código.

---

# 9. Arquivos JSON

## 9.1 `dados/participantes.json`

**Classificação:** Antigo, sensível e candidato urgente à remoção pública
**Função anterior:** Armazenar participantes antes da integração completa com o Supabase.

### Conteúdo

O arquivo contém:

```text
nomes
IDs
senhas em texto aberto
```

### Utilizado por

Nenhuma página ou JavaScript atual.

### Divergência

```text
Arquivo JSON: 18 participantes
Supabase: 19 participantes
```

### Risco

Crítico.

Caso publicado, pode permitir acesso direto às senhas antigas ou atuais.

### Destino recomendado

Na primeira Sprint de organização:

1. criar backup fora da pasta pública;
2. confirmar que nenhum arquivo depende dele;
3. removê-lo do repositório;
4. realizar commit;
5. validar a Vercel;
6. considerar a troca das senhas expostas.

---

## 9.2 `dados/resultados.json`

**Classificação:** Antigo e candidato à remoção
**Função anterior:** Armazenar resultados antes do uso integral do Supabase.

### Conteúdo

Possui apenas alguns resultados antigos.

### Utilizado por

Nenhuma página ou JavaScript atual.

### Risco

Baixo.

### Destino recomendado

Remover junto da organização dos arquivos antigos, depois de backup e teste.

---

# 10. CSS

## 10.1 `css/style.css`

**Classificação:** Ativo
**Função:** Estilização principal do sistema.

### Utilizado por

```text
index.html
login.html
palpites.html
ranking.html
admin.html
possivelmente outras páginas
```

### Características auditadas

```text
823 linhas
122 seletores diferentes
29 seletores repetidos
```

### Observações

Existem regras posteriores que sobrescrevem regras anteriores.

Esse padrão foi resultado de ajustes rápidos realizados durante a competição.

### Risco

Médio.

A alteração de um seletor pode afetar mais de uma página.

### Destino recomendado

Manter sem limpeza imediata.

Antes de refatorar:

1. mapear os seletores por página;
2. registrar capturas de tela;
3. criar teste visual;
4. limpar uma seção por vez.

---

## 10.2 CSS interno de `chaveamento.html`

**Classificação:** Ativo
**Função:** Estilizar exclusivamente o chaveamento.

### Observação

Existe uma grande quantidade de CSS diretamente no HTML.

### Risco

Médio.

A separação precipitada pode modificar o layout que atualmente funciona.

### Destino recomendado

Extrair somente durante a Sprint visual do chaveamento, com comparação antes e depois.

---

# 11. Imagens principais

## 11.1 `assets/copa-2026.png`

**Classificação:** Ativo ou auxiliar visual
**Função:** Identidade visual da competição de 2026.

### Risco

Baixo.

### Destino recomendado

Manter.

Na futura estrutura de múltiplas competições, poderá ser associada a uma edição específica.

---

## 11.2 `assets/logo_modal.png`

**Classificação:** Ativo
**Função:** Logotipo da Modal utilizado nas páginas.

### Risco

Baixo.

### Destino recomendado

Manter.

---

## 11.3 `assets/new-logo-2026-azul.png`

**Classificação:** Ativo ou auxiliar visual
**Função:** Identidade visual alternativa da competição.

### Risco

Baixo.

### Destino recomendado

Manter enquanto as páginas que o utilizam forem preservadas.

---

# 12. Escudos

## 12.1 Pasta `assets/escudos`

**Classificação:** Ativo
**Função:** Armazenar os escudos ou bandeiras das seleções.

### Quantidade auditada

```text
48 arquivos
```

### Formato de nomes

Exemplos:

```text
brasil.png
alemanha.png
costa-do-marfim.png
coreia-do-sul.png
republica-do-congo.png
```

### Dependências

```text
palpites.html
admin.html
chaveamento.html
jogos.escudo_mandante
jogos.escudo_visitante
```

### Risco

Baixo.

O principal risco é a diferença de nomenclatura entre o banco e os nomes dos arquivos.

### Destino recomendado

Manter.

Na futura gestão de competições, criar uma tabela ou cadastro oficial de seleções e escudos.

---

# 13. Documentação oficial

## 13.1 `docs/01-diagnostico-geral.md`

**Classificação:** Documentação
**Função:** Registrar o diagnóstico completo da Sprint 0.

### Destino recomendado

Manter permanentemente.

---

## 13.2 `docs/02-regras-pontuacao.md`

**Classificação:** Documentação e regra oficial
**Função:** Definir pontuação e desempate.

### Destino recomendado

Manter permanentemente.

Qualquer mudança de regra deverá atualizar este arquivo.

---

## 13.3 `docs/03-fluxo-do-sistema.md`

**Classificação:** Documentação
**Função:** Registrar o fluxo atual do sistema.

### Destino recomendado

Manter e atualizar sempre que houver mudança estrutural.

---

## 13.4 `docs/04-inventario-arquivos.md`

**Classificação:** Documentação
**Função:** Registrar o inventário do repositório.

### Destino recomendado

Manter atualizado durante as Sprints de organização.

---

# 14. Matriz de dependências das páginas

| Página              | CSS               | JavaScript principal  | Supabase      | Banco                          |
| ------------------- | ----------------- | --------------------- | ------------- | ------------------------------ |
| `index.html`        | `style.css`       | `app.js`, `login.js`  | Não essencial | Nenhum direto                  |
| `login.html`        | `style.css`       | `login.js`            | Sim           | `participantes`                |
| `palpites.html`     | `style.css`       | `palpites.js`         | Sim           | `jogos`, `palpites`            |
| `ranking.html`      | `style.css`       | `ranking.js`          | Sim           | ranking, palpites e resultados |
| `admin.html`        | `style.css`       | `admin.js`            | Sim           | `jogos`, `resultados`, RPC     |
| `chaveamento.html`  | CSS interno       | `chaveamento-tela.js` | Sim           | `jogos`, `resultados`          |
| `teste-engine.html` | Próprio ou básico | `js/engine/*`         | Incompleto    | Engine de teste                |

---

# 15. Matriz dos JavaScripts

| JavaScript                | Situação              | Página principal | Destino                 |
| ------------------------- | --------------------- | ---------------- | ----------------------- |
| `supabase.js`             | Ativo                 | Várias           | Manter                  |
| `login.js`                | Ativo                 | Login            | Refatorar futuramente   |
| `palpites.js`             | Ativo                 | Palpites         | Refatorar futuramente   |
| `ranking.js`              | Ativo com divergência | Ranking          | Corrigir                |
| `admin.js`                | Ativo e sensível      | Admin            | Proteger                |
| `chaveamento-tela.js`     | Ativo                 | Chaveamento      | Manter                  |
| `app.js`                  | Quase vazio           | Inicial          | Candidato à remoção     |
| `calcular.js`             | Órfão                 | Nenhuma          | Candidato à remoção     |
| `engine/config.js`        | Teste                 | Teste Engine     | Arquivar ou reorganizar |
| `engine/classificacao.js` | Teste                 | Teste Engine     | Arquivar ou reorganizar |
| `engine/chaveamento.js`   | Teste antigo          | Teste Engine     | Arquivar ou reorganizar |
| `engine/competicao.js`    | Teste                 | Teste Engine     | Arquivar ou reorganizar |

---

# 16. Arquivos que não devem ser alterados agora

Durante a Sprint 1, não devem ser alterados:

```text
admin.html
chaveamento.html
index.html
login.html
palpites.html
ranking.html
css/style.css
js/admin.js
js/login.js
js/palpites.js
js/ranking.js
js/supabase.js
js/chaveamento-tela.js
```

Esses arquivos fazem parte direta do sistema em funcionamento.

---

# 17. Arquivos candidatos à primeira organização

Os primeiros candidatos para uma futura Sprint controlada são:

```text
dados/participantes.json
dados/resultados.json
chaveamento.ORIGINAL
js/app.js
js/calcular.js
teste-engine.html
js/engine/*
```

Isso não significa que todos serão apagados.

Cada grupo deverá receber uma decisão específica:

```text
remover
arquivar
mover
corrigir
documentar
manter
```

---

# 18. Ordem recomendada de organização

## Etapa 1

Retirar o arquivo sensível:

```text
dados/participantes.json
```

## Etapa 2

Retirar ou arquivar:

```text
dados/resultados.json
chaveamento.ORIGINAL
```

## Etapa 3

Avaliar:

```text
js/app.js
js/calcular.js
```

## Etapa 4

Separar testes e legado:

```text
teste-engine.html
js/engine/*
```

## Etapa 5

Somente depois, revisar arquivos ativos.

---

# 19. Regras para remoção de arquivos

Antes de remover qualquer arquivo:

1. confirmar que o arquivo não é referenciado;
2. confirmar que não é carregado por HTML;
3. confirmar que não é utilizado por outro JavaScript;
4. manter uma cópia no backup externo;
5. remover apenas um grupo por vez;
6. executar o sistema localmente;
7. testar todas as páginas;
8. verificar o console do navegador;
9. executar `git diff`;
10. registrar um commit específico.

---

# 20. Teste mínimo depois de uma limpeza

Após qualquer remoção futura, testar:

```text
index.html
login.html
palpites.html
ranking.html
admin.html
chaveamento.html
```

Validar:

```text
página abre
CSS carrega
imagens carregam
JavaScript não apresenta erro
Supabase conecta
login funciona
palpites carregam
ranking carrega
Admin carrega
chaveamento carrega
```

---

# 21. Conclusão

O repositório contém uma base funcional, arquivos antigos, dados sensíveis e uma Engine JavaScript paralela à Engine SQL.

A organização deverá preservar os arquivos ativos e retirar gradualmente os elementos que geram:

```text
risco de segurança
confusão de manutenção
duplicidade de regras
exposição de backups
exposição de dados antigos
```

O primeiro arquivo com prioridade de retirada pública é:

```text
dados/participantes.json
```

Nenhum arquivo foi removido durante a criação deste inventário.
