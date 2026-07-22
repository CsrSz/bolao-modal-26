# Bolão MODAL Web

## Roadmap Oficial de Sprints

**Projeto:** Bolão MODAL Web
**Etapa:** Revisão Geral 2030
**Documento:** Roadmap oficial de evolução
**Versão:** 1.0
**Data:** 22 de julho de 2026
**Status:** Planejamento definido após auditoria e documentação do sistema atual

---

## 1. Objetivo

Este documento define a ordem oficial das próximas Sprints do Bolão MODAL Web.

O roadmap foi elaborado depois da auditoria completa do:

* repositório;
* banco Supabase;
* fluxo do sistema;
* ranking;
* chaveamento;
* segurança;
* integridade dos dados;
* arquivos antigos;
* dependências entre páginas e scripts.

A ordem das Sprints foi definida para reduzir riscos e preservar o sistema que já está funcionando.

---

## 2. Princípio central

O sistema atual funcionou durante toda a competição.

Portanto:

> Nenhuma refatoração deverá substituir ou remover um recurso funcional antes de existir backup, diagnóstico, plano de teste e possibilidade de retorno.

A revisão não será uma reconstrução descontrolada.

Ela será realizada em etapas pequenas, testáveis e reversíveis.

---

## 3. Método de trabalho

Cada Sprint deverá possuir:

```text
Um objetivo principal
Um escopo definido
Um conjunto limitado de arquivos
Um procedimento de backup
Um teste antes da alteração
Um teste depois da alteração
Um commit específico
Um critério claro de conclusão
```

Não deverão ser misturadas na mesma Sprint:

```text
Segurança
Pontuação
Visual
Limpeza de código
Banco de dados
Novas funcionalidades
```

Exceções somente poderão ocorrer quando uma dependência técnica tornar a separação impossível.

---

## 4. Estrutura de cada Sprint

Antes de iniciar qualquer Sprint, deverá ser informado:

### Objetivo

O problema único que será resolvido.

### Arquivos ou objetos afetados

Exemplos:

```text
HTML
CSS
JavaScript
Tabela
VIEW
Função SQL
Política RLS
Documentação
```

### Impacto esperado

O que deverá mudar para o usuário ou administrador.

### Fora do escopo

O que não será alterado naquela Sprint.

### Risco

Classificação sugerida:

```text
Baixo
Médio
Alto
Crítico
```

### Backup

Procedimento necessário antes da alteração.

### Teste

Como confirmar o funcionamento.

### Critério de conclusão

Condição objetiva para declarar a Sprint concluída.

---

# 5. Sprint 0: Diagnóstico Geral

**Status:** Concluída

## Objetivo

Mapear o estado real do projeto e do Supabase antes de realizar alterações.

## Entregas concluídas

* estrutura real do repositório;
* tabelas e colunas;
* VIEW e funções SQL;
* permissões;
* RLS;
* relacionamentos;
* dados existentes;
* integridade;
* cobertura dos palpites;
* pontuação;
* ranking;
* chaveamento;
* arquivos antigos;
* riscos de segurança;
* dependências entre páginas e scripts.

## Resultado

O sistema foi considerado funcional, com dados íntegros, mas com riscos críticos de segurança e duplicidade de regras.

---

# 6. Sprint 1: Backup e Documentação Oficial

**Status:** Concluída

## Objetivo

Preservar o estado atual e criar a documentação oficial do projeto.

## Entregas

```text
docs/01-diagnostico-geral.md
docs/02-regras-pontuacao.md
docs/03-fluxo-do-sistema.md
docs/04-inventario-arquivos.md
docs/05-roadmap-sprints.md
```

## Critério de conclusão

* todos os documentos versionados;
* backup externo preservado;
* repositório sincronizado;
* nenhuma alteração funcional aplicada;
* `git status` limpo.

---

# 7. Sprint 2: Retirada de Arquivos Sensíveis e Organização Inicial

**Status:** Concluída

## Objetivo

Retirar da publicação arquivos antigos ou sensíveis que não participavam do sistema ativo.

## Etapas concluídas

### Sprint 2.1

Backup externo dos arquivos antigos e sensíveis.

### Sprint 2.2

Remoção de:

```text
dados/participantes.json

---

# 8. Sprint 3: Unificação da Pontuação e do Desempate

## Objetivo

Criar uma única fonte oficial para:

```text
Pontos totais
Pontos por fase
Acertos de 10
Acertos de 6
Acertos de 4
Acertos de 2
Palpites de 0
Jogos sem palpite
Jogos pendentes
Critérios de desempate
```

## Problema atual

Os totais do Supabase estão corretos.

Porém, o `ranking.js` recalcula as categorias com uma regra divergente.

## Estratégia recomendada

Criar uma nova função SQL oficial que retorne todos os dados necessários para a tela.

Nome provisório:

```text
ranking_completo()
```

O nome definitivo deverá ser decidido durante a Sprint.

## Arquivos ou objetos prováveis

```text
Função SQL de ranking
js/ranking.js
ranking.html, somente se necessário
docs/02-regras-pontuacao.md
```

## Fora do escopo

* autenticação;
* RLS;
* cadastro de participantes;
* visual completo do ranking;
* múltiplas competições.

## Risco

Alto.

Uma regra incorreta pode alterar classificação e desempates.

## Teste obrigatório

Executar todos os cenários definidos em:

```text
docs/02-regras-pontuacao.md
```

Comparar também o ranking final auditado:

```text
1. Cesar
2. Rauany
3. Cadu
```

E os desempates:

```text
Márcio antes de Gabriela
Sandra antes de Christiana
Sabrina antes de Letícia
Rissiara antes de Grace
```

## Critério de conclusão

O navegador deixa de recalcular a regra de pontuação.

A tela apenas apresenta dados calculados pela fonte oficial.

---

# 9. Sprint 4: Planejamento da Autenticação Segura

## Objetivo

Definir a arquitetura do novo login antes de alterar o acesso atual.

## Decisões necessárias

* utilizar ou não Supabase Auth;
* vínculo entre usuário autenticado e participante;
* tratamento de participantes sem e-mail;
* recuperação de senha;
* perfil administrativo;
* sessões;
* logout;
* migração das contas atuais;
* política para troca de senhas;
* ambiente de testes.

## Entregas previstas

```text
Documento de arquitetura
Modelo de tabelas
Plano de migração
Plano de testes
Plano de retorno
```

## Fora do escopo

Nesta Sprint não deverá ocorrer:

```text
ativação de RLS
remoção do login atual
alteração das contas reais
mudança de senha dos participantes
```

## Risco

Baixo, pois será uma Sprint de planejamento.

## Critério de conclusão

A autenticação futura deverá estar completamente desenhada antes de qualquer migração.

---

# 10. Sprint 5: Implantação da Autenticação

## Objetivo

Implementar o novo login seguro sem interromper o sistema existente prematuramente.

## Estratégia recomendada

Criar o novo fluxo em paralelo.

Somente remover o login antigo depois que o novo estiver validado.

## Áreas prováveis

```text
login.html
js/login.js
js/palpites.js
Supabase Auth
participantes
nova tabela ou coluna de vínculo
```

## Fora do escopo

* visual completo;
* limpeza do CSS;
* nova gestão de competições;
* auditoria visual de pontos.

## Risco

Crítico.

Falhas podem impedir todos os participantes de acessar o sistema.

## Teste obrigatório

```text
Login correto
Senha incorreta
Usuário inexistente
Sessão mantida
Logout
Acesso direto a palpites.html
Manipulação do localStorage
Participante acessando somente a própria conta
```

## Critério de conclusão

A identidade do participante não depende mais de um número editável no `localStorage`.

---

# 11. Sprint 6: RLS e Proteção das Tabelas

## Objetivo

Ativar o Row Level Security de forma controlada.

## Tabelas

```text
participantes
jogos
palpites
resultados
```

## Estratégia obrigatória

O RLS não deverá ser ativado simultaneamente em todas as tabelas sem testes intermediários.

Sequência recomendada:

```text
1. Ambiente de teste
2. Políticas de leitura
3. Políticas de gravação
4. Teste com participante
5. Teste administrativo
6. Ativação gradual
```

## Regras esperadas

### Participante

Pode:

```text
ler jogos públicos
ler resultados públicos
ler ranking público
ler e alterar somente os próprios palpites
```

Não pode:

```text
ler senhas
alterar jogos
alterar resultados
alterar participante de outra pessoa
executar funções administrativas
```

### Administrador

Pode realizar operações administrativas depois de autenticação e autorização.

## Risco

Crítico.

Uma política incorreta pode bloquear o sistema ou deixá-lo aberto.

## Critério de conclusão

Um participante autenticado não consegue consultar ou alterar dados de outro participante.

---

# 12. Sprint 7: Restrição das Funções Administrativas

## Objetivo

Impedir execução pública das funções que alteram o chaveamento.

## Funções críticas

```text
reprocessar_chaveamento_mata_mata()
resolver_origem_mata_mata()
```

## Ações previstas

* remover `EXECUTE` de `PUBLIC`;
* remover `EXECUTE` de `anon`;
* avaliar acesso de `authenticated`;
* permitir somente ao fluxo administrativo autorizado;
* revisar `SECURITY DEFINER`;
* confirmar proprietário das funções;
* manter `search_path` seguro.

## Fora do escopo

* reconstruir o chaveamento;
* alterar os confrontos;
* mudar as regras esportivas;
* alterar resultados existentes.

## Risco

Alto.

Uma restrição incorreta pode impedir o Admin de atualizar as fases.

## Critério de conclusão

Visitantes e participantes comuns não conseguem executar funções administrativas.

---

# 13. Sprint 8: Gestão de Participantes

## Objetivo

Criar uma forma segura e simples de administrar participantes.

## Recursos desejados

```text
Cadastrar
Editar
Ativar
Inativar
Redefinir acesso
Consultar participação
Evitar exclusão perigosa
```

## Regra recomendada

Participantes com palpites não devem ser apagados fisicamente sem procedimento especial.

Preferência por:

```text
ativo = false
```

## Campos futuros possíveis

```text
ativo
data_criacao
data_atualizacao
usuario_auth_id
tipo_perfil
```

## Fora do escopo

* gestão de jogos;
* gestão visual completa da competição;
* ranking;
* chaveamento.

## Risco

Alto.

Alterações em participantes podem afetar palpites e rankings.

## Critério de conclusão

O cadastro não depende mais de SQL manual para operações comuns.

---

# 14. Sprint 9: Competições e Edições

## Objetivo

Preparar o sistema para mais de uma edição.

Exemplos:

```text
Copa 2026
Copa 2030
Competições de teste
```

## Estrutura futura possível

Nova tabela:

```text
competicoes
```

Possíveis campos:

```text
id
nome
ano
status
data_inicio
data_fim
fase_atual
logo
ativa
```

As tabelas relacionadas poderão receber:

```text
competicao_id
```

## Áreas afetadas

```text
jogos
palpites
resultados
ranking
participantes da edição
configurações
```

## Risco

Crítico.

Essa será uma mudança estrutural ampla e deverá possuir migrations, backup e ambiente de teste.

## Critério de conclusão

Dados de uma competição não aparecem no ranking ou nos palpites de outra competição.

---

# 15. Sprint 10: Controle da Fase Atual

## Objetivo

Remover do `palpites.js` a necessidade de alterar manualmente:

```javascript
const FASES_MATA_ATUAIS = [
    'TERCEIRO',
    'FINAL'
];
```

## Solução desejada

A fase atual deverá ser definida em:

```text
configuração da competição
```

ou por uma tela administrativa.

## Recursos possíveis

```text
Abrir fase
Fechar fase
Liberar duas fases simultaneamente
Ocultar confrontos indefinidos
Registrar data da alteração
```

## Fora do escopo

* alterar regras de pontuação;
* redesenhar a tela;
* alterar resultados históricos.

## Risco

Médio.

## Critério de conclusão

Mudar a fase visível não exige editar código, fazer commit ou publicar novamente.

---

# 16. Sprint 11: Auditoria Oficial de Pontuação

## Objetivo

Transformar os SQLs manuais de auditoria em uma funcionalidade oficial.

## Informações necessárias

```text
Participante
Jogo
Fase
Mandante
Visitante
Palpite
Resultado
Pontos
Regra aplicada
Situação
```

## Situações possíveis

```text
Placar exato
Vencedor e gols de um lado
Apenas vencedor
Empate não exato
Gols de um lado
Zero ponto
Sem palpite
Sem resultado
```

## Etapas possíveis

### Sprint 11.1

Função SQL oficial de auditoria.

### Sprint 11.2

Validação dos totais.

### Sprint 11.3

Tela administrativa de auditoria.

### Sprint 11.4

Filtros e exportação.

## Risco

Médio.

## Critério de conclusão

Toda pontuação do ranking pode ser explicada jogo por jogo sem SQL manual.

---

# 17. Sprint 12: Organização da Engine e do Legado

## Objetivo

Resolver definitivamente a existência de duas Engines:

```text
Engine JavaScript de teste
Engine SQL ativa
```

## Arquivos envolvidos

```text
teste-engine.html
js/engine/config.js
js/engine/classificacao.js
js/engine/chaveamento.js
js/engine/competicao.js
```

## Decisões possíveis

```text
Arquivar
Mover para legacy/
Mover para tests/
Reescrever como teste real
Remover depois de documentação
```

## Outros candidatos

```text
js/app.js
js/calcular.js
```

## Fora do escopo

Nenhum arquivo ativo deverá ser refatorado junto dessa limpeza.

## Risco

Baixo a médio.

## Critério de conclusão

O repositório deixa claro qual Engine é oficial e quais arquivos são apenas históricos ou testes.

---

# 18. Sprint 13: Limpeza dos Arquivos Ativos

## Objetivo

Organizar o código funcional sem mudar seu comportamento.

## Áreas possíveis

```text
js/login.js
js/palpites.js
js/ranking.js
js/admin.js
js/chaveamento-tela.js
css/style.css
```

## Regras

* um arquivo por vez;
* captura ou registro do comportamento anterior;
* código completo;
* teste local;
* comparação visual;
* commit independente;
* nenhuma alteração de regra junto da limpeza.

## Risco

Alto.

Arquivos antigos podem conter dependências pouco evidentes.

## Critério de conclusão

O código fica mais legível e organizado, sem diferença funcional.

---

# 19. Sprint 14: Chaveamento Reutilizável

## Objetivo

Retirar do HTML e do código os elementos exclusivos da competição de 2026.

## Problemas atuais

* cards escritos diretamente no HTML;
* CSS muito específico;
* pênaltis fixos no HTML;
* confrontos dependentes de IDs;
* estrutura pouco reaproveitável.

## Solução desejada

Gerar o chaveamento a partir dos dados da competição.

## Recursos futuros

```text
Fases dinâmicas
Cards gerados automaticamente
Escudos vindos do banco
Pênaltis armazenados corretamente
Responsividade
Caminho até a Final
```

## Risco

Alto.

## Critério de conclusão

Uma nova competição pode gerar o chaveamento sem copiar e editar manualmente dezenas de cards.

---

# 20. Sprint 15: Visual Premium

## Objetivo

Melhorar a experiência visual depois que segurança e arquitetura estiverem consolidadas.

## Áreas

```text
Página inicial
Login
Palpites
Ranking
Admin
Chaveamento
Página de regras
Auditoria
```

## Diretrizes

* identidade Modal;
* responsividade;
* acessibilidade;
* consistência entre páginas;
* menos CSS duplicado;
* feedback claro de carregamento e erro;
* bom funcionamento em desktop e celular.

## Fora do escopo

Nenhuma mudança de regra ou banco deverá ser escondida dentro da Sprint visual.

## Risco

Médio.

## Critério de conclusão

Melhoria visual sem regressão funcional.

---

# 21. Sprint 16: Página Pública de Regras

## Objetivo

Transformar as regras documentadas em uma página acessível aos participantes.

## Arquivo futuro possível

```text
regras.html
```

## Conteúdo

```text
Pontuação
Exemplos
Desempate
Fases
Mata-mata
Pênaltis
Prazo dos palpites
Jogos sem palpite
Ranking
```

## Fonte oficial

```text
docs/02-regras-pontuacao.md
```

## Risco

Baixo.

## Critério de conclusão

Os participantes conseguem consultar as regras sem depender de mensagens externas.

---

# 22. Sprint 17: Testes e Preparação para Nova Competição

## Objetivo

Validar o sistema completo antes da próxima utilização real.

## Testes necessários

```text
Cadastro
Login
Logout
Palpite
Alteração de palpite
Bloqueio de horário
Resultado
Empate
Vencedor por pênaltis
Reprocessamento
Ranking
Desempates
Auditoria
Troca de fase
Chaveamento
Permissões
RLS
Celular
Desktop
```

## Ambiente

Os testes deverão utilizar:

```text
competição de teste
participante de teste
jogos de teste
resultados controlados
```

Nunca utilizar dados reais sem backup.

## Critério de conclusão

Todos os fluxos críticos passam em um roteiro de validação documentado.

---

# 23. Ordem oficial de prioridade

A ordem geral será:

```text
1. Segurança dos arquivos públicos
2. Pontuação e desempate
3. Autenticação
4. RLS
5. Funções administrativas
6. Participantes
7. Competições
8. Fase atual
9. Auditoria
10. Legado
11. Limpeza
12. Chaveamento reutilizável
13. Visual
14. Regras públicas
15. Testes finais
```

Uma Sprint posterior não deverá ser antecipada se depender de uma anterior ainda não concluída.

---

# 24. Commits

Cada etapa deverá utilizar commits objetivos.

Exemplos:

```text
docs: registra roadmap oficial
security: remove arquivo antigo de participantes
fix: unifica regra de pontuacao do ranking
auth: adiciona nova autenticacao
security: ativa rls em palpites
refactor: organiza arquivo ranking
style: melhora layout do chaveamento
```

Não utilizar um único commit para várias mudanças sem relação.

---

# 25. Controle de mudanças

Depois de cada Sprint:

```text
git status
git diff
teste local
commit
push
teste publicado
```

Quando houver mudança no Supabase:

```text
registrar SQL executado
preservar versão anterior da função
registrar resultado
validar aplicação
documentar rollback
```

---

# 26. Procedimento de retorno

Toda mudança crítica deverá permitir retorno.

Exemplos:

### Arquivo

```text
git revert
```

### Função SQL

Restaurar a definição anterior preservada.

### Política RLS

Desativar ou substituir a política específica, conforme plano documentado.

### Migration

Criar migration de correção ou reversão.

Não realizar alterações irreversíveis sem backup.

---

# 27. Critério de conclusão de uma Sprint

Uma Sprint será considerada concluída somente quando:

```text
Objetivo atendido
Arquivos salvos
Testes realizados
Erros do console verificados
Git diff revisado
Commit criado
Push concluído
Produção validada, quando aplicável
Documentação atualizada
Git status limpo
```

Apenas criar ou alterar código não encerra uma Sprint.

---

# 28. Mudanças emergenciais

Caso seja necessário corrigir um problema urgente:

1. registrar o problema;
2. identificar o menor ajuste possível;
3. criar backup;
4. alterar apenas o necessário;
5. testar;
6. criar commit específico;
7. atualizar a documentação posteriormente.

Uma correção emergencial não deve se transformar em refatoração ampla.

---

# 29. Revisão do roadmap

Este roadmap pode ser atualizado quando:

* uma dependência nova for descoberta;
* uma Sprint revelar risco não conhecido;
* uma decisão de arquitetura for alterada;
* surgir necessidade real de uma nova funcionalidade;
* uma etapa deixar de ser necessária.

Toda mudança deverá ser registrada neste documento.

A estratégia não deverá ser alterada informalmente durante a execução de uma Sprint.

---

# 30. Próxima Sprint oficial

A próxima Sprint será:

```text
Sprint 3: Unificação da Pontuação e do Desempate
```

Primeiro alvo:

```text
dados/participantes.json
```

Nenhum arquivo será removido sem:

```text
backup
confirmação de dependências
teste
commit específico
validação da publicação
```

---

## Conclusão

O roadmap prioriza primeiro a redução dos riscos técnicos e de segurança.

As melhorias visuais e os recursos mais sofisticados serão realizados depois que:

```text
a pontuação estiver unificada
o login estiver seguro
o RLS estiver ativo
as funções administrativas estiverem protegidas
o sistema estiver preparado para novas competições
```

Este documento passa a orientar oficialmente a evolução do Bolão MODAL Web.
