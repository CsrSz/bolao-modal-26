# Bolão MODAL Web

## Fechamento da Sprint 2

**Projeto:** Bolão MODAL Web
**Etapa:** Revisão Geral 2030
**Sprint:** 2 - Retirada de Arquivos Sensíveis e Organização Inicial
**Data de conclusão:** 22 de julho de 2026
**Status:** Concluída

---

## 1. Objetivo da Sprint

A Sprint 2 teve como objetivo retirar da publicação arquivos antigos, sensíveis ou desnecessários que não participavam do funcionamento atual do Bolão MODAL Web.

As alterações foram realizadas de forma gradual, com:

* backup externo;
* verificação de dependências;
* remoção de um arquivo por vez;
* teste local;
* commit específico;
* publicação na Vercel;
* validação da URL pública;
* teste das páginas principais.

---

## 2. Backup externo

Antes de qualquer remoção, foi criado o backup:

```text
T:\Bolao-Modal-Backups\Sprint-2.1-Legado-2026-07-22
```

Também foi criado o arquivo compactado:

```text
T:\Bolao-Modal-Backups\Sprint-2.1-Legado-2026-07-22.zip
```

O backup contém:

```text
dados/participantes.json
dados/resultados.json
chaveamento.ORIGINAL
js/app.js
js/calcular.js
teste-engine.html
js/engine/config.js
js/engine/classificacao.js
js/engine/chaveamento.js
js/engine/competicao.js
```

A integridade do arquivo sensível `participantes.json` foi confirmada por comparação de hash SHA256 entre o original e a cópia.

---

## 3. Sprint 2.1 - Backup dos arquivos antigos

**Status:** Concluída

Foram preservados externamente os arquivos antigos, sensíveis e de teste antes das futuras operações de organização.

Nenhum arquivo do projeto foi alterado nessa etapa.

O repositório permaneceu limpo.

---

## 4. Sprint 2.2 - Remoção de `dados/participantes.json`

**Status:** Concluída

Arquivo removido:

```text
dados/participantes.json
```

O arquivo continha nomes e senhas de participantes em texto aberto.

Antes da remoção, foi confirmado que nenhum HTML, JavaScript ou CSS ativo dependia desse arquivo.

Commit utilizado:

```text
71c0d27
security: remove arquivo antigo com senhas
```

Depois da publicação, a URL:

```text
https://bolao-modal-26.vercel.app/dados/participantes.json
```

passou a retornar:

```text
404
Not Found
```

O login permaneceu funcionando porque utiliza diretamente a tabela `participantes` no Supabase.

---

## 5. Decisão sobre as senhas antigas

As senhas presentes no arquivo removido devem ser consideradas comprometidas.

Entretanto, a troca emergencial foi adiada porque:

* a competição de 2026 já terminou;
* o acesso dos participantes não será reutilizado imediatamente;
* a autenticação atual será substituída em uma Sprint futura;
* o banco ainda depende de uma arquitetura aberta sem RLS;
* trocar somente as senhas não resolveria a fragilidade estrutural.

As senhas antigas não poderão ser reutilizadas quando o Bolão for reaberto.

A migração ou troca das credenciais será obrigatória antes da próxima competição.

---

## 6. Sprint 2.3 - Validação após a remoção do arquivo sensível

**Status:** Concluída

Foram validados:

```text
Arquivo removido retornando 404
Página inicial
Login
Palpites
Ranking
Admin
Chaveamento
Console do navegador
Git status
```

Nenhuma regressão foi encontrada.

O sistema continuou funcionando normalmente.

---

## 7. Sprint 2.4 - Remoção de `dados/resultados.json`

**Status:** Concluída

Arquivo removido:

```text
dados/resultados.json
```

O arquivo continha apenas alguns resultados antigos e não era utilizado pelo sistema atual.

Os resultados oficiais continuam sendo carregados da tabela:

```text
resultados
```

no Supabase.

Depois da publicação, a URL pública do arquivo passou a retornar `404`.

As páginas principais continuaram funcionando normalmente.

---

## 8. Sprint 2.5 - Remoção de `chaveamento.ORIGINAL`

**Status:** Concluída

Arquivo removido:

```text
chaveamento.ORIGINAL
```

O arquivo era um backup antigo do chaveamento e não possuía dependências funcionais.

As referências encontradas estavam apenas na documentação histórica.

O backup externo foi confirmado antes da remoção.

Depois da publicação, a URL:

```text
https://bolao-modal-26.vercel.app/chaveamento.ORIGINAL
```

passou a retornar:

```text
404
Not Found
```

O arquivo ativo:

```text
chaveamento.html
```

continuou funcionando normalmente.

---

## 9. Arquivos removidos na Sprint 2

```text
dados/participantes.json
dados/resultados.json
chaveamento.ORIGINAL
```

Esses arquivos permanecem preservados no backup externo e no histórico anterior do Git.

---

## 10. Arquivos preservados para análise futura

Os seguintes arquivos não foram removidos:

```text
js/app.js
js/calcular.js
teste-engine.html
js/engine/config.js
js/engine/classificacao.js
js/engine/chaveamento.js
js/engine/competicao.js
```

Eles serão tratados em uma Sprint específica de organização da Engine e do legado.

A permanência temporária desses arquivos não interfere no funcionamento atual.

---

## 11. Testes realizados

Depois das remoções, foram testados:

```text
index.html
login.html
palpites.html
ranking.html
admin.html
chaveamento.html
```

Foram confirmados:

* carregamento das páginas;
* funcionamento do login;
* identificação do participante;
* carregamento dos palpites;
* carregamento do ranking;
* carregamento dos resultados no Admin;
* carregamento dos confrontos e placares;
* funcionamento visual do chaveamento;
* ausência de erros novos no console;
* URLs dos arquivos removidos retornando `404`;
* repositório sincronizado e limpo.

Nenhum palpite ou resultado real foi modificado durante os testes.

---

## 12. Impacto final

A Sprint 2 reduziu a exposição pública do projeto sem alterar o funcionamento do sistema.

Resultados:

```text
Lista antiga de participantes retirada da publicação
Senhas antigas retiradas da versão atual do site
Resultados JSON antigos retirados
Backup antigo do chaveamento retirado da raiz pública
Backups externos preservados
Sistema validado após cada remoção
```

---

## 13. Limitações ainda existentes

A conclusão da Sprint 2 não resolve os demais riscos de segurança já documentados.

Ainda permanecem:

```text
Senhas em texto aberto na tabela participantes
Login validado no navegador
Identidade baseada em localStorage
RLS desativado
Permissões amplas para anon
Senha do Admin no JavaScript
Funções administrativas publicamente executáveis
```

Esses pontos serão tratados nas Sprints específicas previstas no roadmap.

---

## 14. Estado do repositório

Ao final da Sprint 2:

```text
Arquivos antigos removidos
Documentação atualizada
Commits enviados ao GitHub
Deploys concluídos
Produção validada
Git status limpo
```

---

## 15. Próxima Sprint

A próxima Sprint oficial será:

```text
Sprint 3 - Unificação da Pontuação e do Desempate
```

Objetivo principal:

```text
Criar uma única fonte oficial para pontos, resumo e critérios de desempate.
```

A Sprint 3 deverá eliminar a divergência entre:

```text
Pontuação calculada no Supabase
Resumo recalculado pelo ranking.js
Critérios de desempate aplicados no navegador
```

---

## 16. Conclusão

A Sprint 2 foi concluída com sucesso.

Três arquivos antigos foram retirados da publicação sem causar regressões.

O sistema continua funcional e o repositório está mais limpo, menos confuso e com menor exposição de dados legados.
