import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   GNT SEO HUB — YouTube Optimization Platform
   501 vídeos analisados · Dados reais YouTube Studio mai/25-mai/26
   ═══════════════════════════════════════════════════════════════ */

const AI = {
  google: {
    name: "Google Gemini", icon: "◆", color: "#4285f4",
    call: async (s, u) => {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD37JoiuZNlKfOrRMau5IJzwHByqYwprRc", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_instruction: { parts: [{ text: s }] }, contents: [{ parts: [{ text: u }] }] })
      });
      const d = await r.json(); return d?.candidates?.[0]?.content?.parts?.[0]?.text || "Erro na resposta.";
    }
  },
  groq: {
    name: "Llama 3.3 (Groq)", icon: "⚡", color: "#f55036",
    call: async (s, u) => {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer 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" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: s }, { role: "user", content: u }], max_tokens: 2500 })
      });
      const d = await r.json(); return d?.choices?.[0]?.message?.content || "Erro na resposta.";
    }
  },
  kimi: {
    name: "Kimi (Moonshot)", icon: "☽", color: "#7c3aed",
    call: async (s, u) => {
      const r = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer sk-XTPRjA4hVjeZKIXhPCpaEuayL98dlmGp1loSmUwVhVoAsplw" },
        body: JSON.stringify({ model: "moonshot-v1-8k", messages: [{ role: "system", content: s }, { role: "user", content: u }], max_tokens: 2500 })
      });
      const d = await r.json(); return d?.choices?.[0]?.message?.content || "Erro na resposta.";
    }
  }
};

const SYS = `Você é um especialista sênior em SEO para YouTube, especializado no Canal GNT (@canalgnt, ~2,6M inscritos). Você tem acesso a dados reais de 501 vídeos analisados e usa esses dados para fundamentar TODAS as suas recomendações.

DADOS REAIS DO CANAL (501 vídeos, mai/2025 a mai/2026):

PANORAMA GERAL:
• Views diárias médias: caiu de 1.088.707 (mai-jul/2025) para 703.417 (mar-mai/2026) — QUEDA DE 35,4%
• Pico: novembro 2025 (34,1M views/mês) — coincidiu com estreia Angélica Ao Vivo
• Desde jan/2026, nunca mais ultrapassou 24M mensais
• CTR médio geral: 6,05% | Views médias por vídeo: 452.715
• Inscritos: ~2,6M | Inscritos/semana: ~2.800
• Média de 64 comentários por vídeo (alarmantemente baixo para 2,6M inscritos)
• ~2.800 likes médios nos últimos 50 vídeos

ERRO GRAVE — 85 VÍDEOS CLASSIFICADOS ERRADO:
• 85 vídeos têm #shorts no título mas duram MAIS de 60 segundos
• Esses vídeos estão num limbo: NÃO são Shorts (feed não pega), NÃO são long-form otimizado
• #shorts errado (>60s): 85 vídeos, 569.174 views, CTR 6,57%
• #shorts correto (≤60s): 76 vídeos, 766.430 views, CTR 5,09%
• Sem #shorts + ≤60s: 20 vídeos, 347.291 views, CTR 4,38%
• Sem #shorts + >60s (long-form): 320 vídeos, 376.508 views, CTR 6,37%
• AÇÃO: remover #shorts do título desses 85 vídeos IMEDIATAMENTE

PERFORMANCE POR PROGRAMA:
• Porchat: 300 vídeos (60%!), 344.314 views médias, 0,6 subs/1K views, 8,1 min watch time
• Saia Justa: 38 vídeos (7,6%), 724.132 views médias, 0,8 subs/1K views, 0,6 min WT
• Angélica: 54 vídeos (10,8%), 916.923 views médias (MELHOR!), 0,6 subs/1K, 0,6 min WT
• Papo de Segunda: 17 vídeos (3,4%), 445.920 views, 0,7 subs/1K, 0,6 min WT
• Conversa com Bial: 46 vídeos (9,2%), 379.444 views, 0,9 subs/1K (MELHOR conversão!), 1,4 min WT

DADOS DE TÍTULO:
• ≤50 chars: 4 vídeos, 594.592 views, CTR 6,74% — MELHOR
• 50-70 chars: 70 vídeos, 533.230 views, CTR 5,90%
• 70-90 chars: 218 vídeos, 450.359 views, CTR 6,31%
• 90+ chars: 208 vídeos (41%!), 427.535 views, CTR 5,81% — PIOR
• Títulos curtos = até 39% MAIS views
• Sem "GNT" no título: 141 vídeos, 510.879 views vs Com "GNT": 360 vídeos, 431.353 views (+18% sem GNT)
• 95% dos vídeos usam emoji (efeito positivo mas marginal)

DADOS DE DURAÇÃO:
• 1-5 min: 117 vídeos, 623.668 views, CTR 6,49%, retenção 40,6%
• 5-10 min (SWEET SPOT): 96 vídeos, 240.394 views, CTR 7,75%, retenção 72,4%
• 10-15 min: 113 vídeos, 325.616 views, CTR 6,07%, retenção 66,2%
• 15-30 min: 66 vídeos, 380.930 views, CTR 4,79%, retenção 59,6%

SHORTS vs LONG-FORM:
• Short real (≤60s): 96 vídeos (19%), 664.962 views, CTR 4,92%, 386 inscritos médios
• Long-form (>60s): views 403.401, CTR 6,32%, 276 inscritos
• Apenas 19% são Shorts reais — deveria ser 30-40%

PADRÃO DOS TOP 10 (mais inscritos): celebridade forte + gatilho emocional + formato curto/médio + majoritariamente Saia Justa e Angélica

BENCHMARKS/METAS:
• CTR: 6,05% atual → Meta 90d: 7,0% → Meta 180d: 8,0%
• Views/vídeo: 452.715 → 600.000 → 800.000
• Views diárias: 703.417 → 900.000 → 1.200.000
• Shorts/semana: ~2 → 10 → 15
• Inscritos/semana: ~2.800 → 5.000 → 8.000

REGRAS DE OURO (baseadas nos dados):
1. Título: máx 70 chars (ideal 50-60), keyword nas primeiras 5-7 palavras, sem "| GNT", CAPS seletivo 1-3 palavras, curiosity gap
2. Descrição: 3 primeiras linhas = conteúdo (NUNCA links/hashtags), timestamps obrigatórios (mín. 3), 150+ palavras descritivas, máx 3 hashtags no final, links só da 4ª linha
3. Tags: 8-15 por vídeo, do específico ao amplo, incluir long-tail, nunca repetir título
4. Thumbnail: rosto expressivo (40%+ da área), 1-3 palavras grandes que COMPLEMENTAM (não repetem) título, contraste alto, legível em mobile
5. Shorts: SEMPRE abaixo de 60s, hook em 0,5s, sem marca d'água TikTok, 9:16 nativo, legendas grandes

FÓRMULAS DE TÍTULO POR PROGRAMA:
• Porchat: [GANCHO EMOCIONAL EM CAPS] + contexto | Porchat
• Saia Justa: [TEMA PESQUISÁVEL] + opinião polêmica | Saia Justa
• Papo de Segunda: [PERGUNTA ou PROVOCAÇÃO] + contexto | Papo de Segunda
• Angélica: [NOME FAMOSO] + momento impactante | Angélica
• Bial: [REVELAÇÃO ou EMOÇÃO] + contexto | Conversa com Bial

PROBLEMAS ESTRUTURAIS IDENTIFICADOS:
1. Canal com identidade temática difusa (5+ universos temáticos — prejudica topical authority)
2. Títulos com estrutura de TV, não YouTube (Nome | Programa | GNT — pipes, marca, genérico)
3. Keywords do canal desatualizadas (apresentadores que já saíram, termos genéricos)
4. Provável ausência de capítulos/timestamps na maioria dos vídeos
5. Descrições padronizadas/template (links e hashtags nas primeiras linhas, zero conteúdo)
6. Conteúdo reaproveitado de TV sem adaptação para YouTube
7. Shorts tratados como subprodutos (sem estratégia nativa)
8. Engajamento baixo para o tamanho do canal (64 comentários/vídeo para 2,6M inscritos)

Sempre responda em português brasileiro. Seja direto, prático e fundamentado nos dados acima. Cite números específicos sempre que possível.`;

const PROGS = [
  { k: "porchat", l: "Que História é Essa, Porchat?" },
  { k: "saiaJusta", l: "Saia Justa" },
  { k: "papoDeSegunda", l: "Papo de Segunda" },
  { k: "angelica", l: "Angélica Ao Vivo" },
  { k: "bial", l: "Conversa com Bial" },
];

// ─── Course Modules ───
const MODS = [
  { id:0, n:"0", t:"Extração de Dados do YouTube Studio", i:"📊", tag:"PRÉ-REQUISITO",
    c:`Antes de qualquer análise profunda, exporte dados reais do YouTube Studio.

**A) Relatório de Conteúdo (mínimo 50 vídeos, ideal 100)**
YouTube Studio → Analytics → Conteúdo → Modo Avançado. Últimos 365 dias. Exporte CSV/Excel. Traz por vídeo: título, data, views, watch time, duração média, impressões, CTR, subscribers gained/lost.

**B) Relatório de Pesquisa (Search Terms)**
YouTube Studio → Analytics → Alcance → Fonte de tráfego: Pesquisa do YouTube. Mostra quais termos levam pessoas ao canal.

**C) Tags e Descrições (manual)**
O Studio não exporta tags em massa. Use vidIQ ou TubeBuddy (Chrome, grátis) para ver tags, score SEO e dados competitivos. Para cada vídeo copie: título, descrição completa (3 primeiras linhas são críticas), tags, categoria, legendas, capítulos, thumbnail.

**D) Relatório de Retenção**
Para os 20 vídeos mais recentes: Analytics → Engajamento → Retenção de audiência. Identifique: onde abandonam? Maior queda? Re-watch em algum trecho?

**E) Shorts vs. Long-form**
Separe em duas categorias. Compare CTR, views, retenção e crescimento de inscritos.

**Template de coleta por vídeo:**
URL | Título | Data | Duração | Views | Impressões | CTR | Retenção média | Tags | Descrição (3 linhas) | Capítulos? | Legendas? | Thumb texto? | Thumb rosto? | Tipo | Programa

**Alternativas sem PC:**
→ studio.youtube.com no Chrome mobile (versão desktop)
→ vidIQ/TubeBuddy no Chrome do PC
→ Coefficient (add-on Google Sheets) — conecta na API do YouTube Analytics
→ App YouTube Studio (prints das métricas dos 20-30 vídeos mais importantes)` },
  { id:1, n:"1", t:"Como o Algoritmo Funciona em 2026", i:"⚙️", tag:"FUNDAMENTOS",
    c:`**Não existe "um" algoritmo.** O YouTube opera com múltiplos sistemas independentes:

**Home Feed (Página Inicial)** — Personalização profunda. Usa clusters de histórico, horário do dia e dispositivo (celular vs TV). Precisa encaixar no padrão de consumo daquele viewer naquele momento.

**Search (Busca)** — Funciona como o Google. Título, descrição, legendas e tags são sinais primários. Mas pesa o comportamento pós-clique: se pesquisa "histórias engraçadas", clica e sai em 30s, é sinal negativo que derruba ranqueamento.

**Suggested (Sugeridos)** — Maior gerador de views. Recomenda baseado em: vídeos frequentemente assistidos juntos; clustering de tópicos; padrões do mesmo criador. Precisa de forte conexão temática.

**Shorts Feed** — Algoritmo completamente separado desde 2025. Avalia: taxa de conclusão, re-watch, padrão de swipe. Shorts com marca d'água TikTok/Reels são automaticamente despromovidos.

**Os 5 sinais mais valorizados em 2026:**

**1. CTR (Click-Through Rate)** — Abaixo de 4% é preocupante. Acima de 8% é excelente. GNT atual: 6,05%. Para 2,6M inscritos, cada 1% de CTR a mais = centenas de milhares de views.

**2. Retenção de audiência** — YouTube prefere 8 min com 50% de retenção do que 15 min com 20%. Dados GNT: sweet spot 5-10 min tem 72,4% de retenção.

**3. Satisfação do viewer** — Likes, comentários, shares, se assistiu mais vídeos depois. GNT tem apenas 64 comentários/vídeo para 2,6M inscritos — alarmante.

**4. Session time** — Se o viewer continua no YouTube após seu vídeo = positivo. Se fecha = negativo.

**5. Topical Authority** — Preferência a canais com expertise consistente em um tema. GNT publica sobre 5+ temas diferentes = compete com canais focados em 1.

**O que mudou em 2025-2026:**
→ Shorts separados do long-form (sistemas independentes)
→ Reused Content 2.0 (YouTube mais agressivo com cortes de TV sem valor agregado)
→ Personalização por dispositivo e horário
→ Legendas manuais ainda dão vantagem sobre automáticas
→ Rótulo obrigatório para conteúdo gerado por IA` },
  { id:2, n:"2", t:"Auditoria de SEO — Título", i:"✏️", tag:"SEO CORE",
    c:`**A regra de ouro:** O título serve a dois mestres — o algoritmo (keywords) e o humano (compulsão ao clique). Keyword principal nas primeiras 5-7 palavras.

**O que o GNT está fazendo errado (dados reais):**
Padrão atual: [Nome] [ação genérica] | [Programa] | GNT
Exemplo real: "Juliana Didone e Alejandro Claveaux: Vinho, Itália e DUENDES | Que História é essa, Porchat? | GNT" — 87 caracteres, truncado em mobile.

**Impacto comprovado por dados:**
→ ≤50 chars: 594.592 views, CTR 6,74% — MELHOR
→ 50-70 chars: 533.230 views, CTR 5,90%
→ 70-90 chars: 450.359 views, CTR 6,31%
→ 90+ chars: 427.535 views, CTR 5,81% — 208 vídeos (41% do canal!)
→ Títulos curtos = até 39% MAIS views
→ Sem "GNT" no título: 510.879 views vs Com "GNT": 431.353 (+18% sem)

**Fórmulas recomendadas:**
→ Porchat: [GANCHO EMOCIONAL EM CAPS] + contexto | Porchat
  Ex: "ELA ENCONTROU DUENDES NA ITÁLIA e quase não volta | Porchat" (58 chars)
→ Saia Justa: [TEMA PESQUISÁVEL] + opinião polêmica | Saia Justa
  Ex: "RACISMO no namoro: 'meu ex me diminuía por ser preta' | Saia Justa" (66 chars)
→ Papo de Segunda: [PERGUNTA ou PROVOCAÇÃO] + contexto | Papo de Segunda
  Ex: "Por que HOMENS TÊM MEDO de falar sobre sentimentos? | Papo de Segunda" (70 chars)

**7 Regras práticas:**
1. Máximo 60 caracteres (ideal: 50)
2. Keyword nas primeiras 5-7 palavras
3. CAPS seletivo: 1-3 palavras, NUNCA o título inteiro
4. Nunca termine com "| GNT" — use só nome do programa
5. Crie curiosity gap: viewer precisa clicar pra saber
6. Convidado famoso → nome no título. Desconhecido → foco no tema
7. Teste: leia em voz alta. Se não gera "preciso ver isso", reescreva

**Exemplo real corrigido:**
ANTES: "Paulo Vieira conta perrengue para acompanhar Porchat em viagem | Que História é essa, Porchat?" (CTR 2,7%, 1,59M views)
DEPOIS: "Paulo Vieira QUASE MORREU tentando acompanhar o Porchat" 
Se CTR subisse de 2,7% para 6% com mesmas impressões → ~3,3M views` },
  { id:3, n:"3", t:"Auditoria de SEO — Descrição", i:"📝", tag:"SEO CORE",
    c:`**As 3 primeiras linhas são TUDO.** Aparecem antes do "Mostrar mais". Precisam conter keyword principal, explicar o que o viewer vai ver e gerar interesse. NUNCA template genérico.

**O que está errado hoje (padrão provável):**
#SaiaJusta
Inscreva-se no canal GNT: http://bit.ly/canalGNT
Assista no Globoplay: http://bit.ly/GloboplayCanaisGNT
→ Zero informação sobre conteúdo. Hashtag genérica. Links institucionais. Nenhuma keyword. Nenhum timestamp.

**Estrutura correta:**

[LINHAS 1-3] Resumo rico em keywords
"Erika Januza revela no Saia Justa como sofreu racismo dentro do próprio relacionamento. As apresentadoras debatem como o racismo estrutural afeta relações amorosas e autoestima."

[TIMESTAMPS/CAPÍTULOS]
0:00 Introdução
1:23 Erika conta sua experiência
4:15 Debate: racismo no relacionamento
8:40 Como identificar red flags
12:00 Mensagem final

[PARÁGRAFO DESCRITIVO — 150+ palavras com keywords naturais]
"Neste episódio do Saia Justa, Erika Januza, Eliana, Sabrina Sato e Juliette conversam sobre racismo, relacionamentos abusivos e como reconhecer comportamentos tóxicos."

[LINKS E CTA — Só da 4ª linha em diante]
Inscreva-se: [link] | Globoplay: [link]

[HASHTAGS — Máximo 3]
#SaiaJusta #ErikaJanuza #Racismo

**7 Regras:**
1. 3 primeiras linhas NUNCA são links — são resumo do conteúdo
2. Sempre timestamps (mínimo 3, primeiro "0:00 [tema]")
3. Mínimo 150 palavras descritivas com keywords naturais
4. Links e CTAs só a partir da 4ª linha
5. Máximo 3 hashtags no final
6. Mencione nomes, temas e termos pesquisáveis
7. Cada vídeo = descrição ÚNICA (nunca template)` },
  { id:4, n:"4", t:"Auditoria de SEO — Tags", i:"🏷️", tag:"SEO CORE",
    c:`**Tags = 3º sinal de SEO** (depois de título e descrição). YouTube usa para desambiguação. Ainda importam em 2026.

**Regra geral:** 8-15 tags por vídeo. Do específico ao amplo.

**Exemplo Porchat:**
1. que historia é essa porchat (tag exata)
2. fabio porchat (apresentador)
3. juliana didone porchat (convidado + programa)
4. histórias engraçadas de famosos (keyword de busca)
5. histórias bizarras (keyword ampla)
6. porchat gnt (associação canal)
7. programa de entrevista (categoria)
8. famosos contando histórias (variação)
9. canal gnt (canal)
10. gnt porchat 2026 (temporal)

**Exemplo Saia Justa:**
1. saia justa gnt / 2. saia justa 2026 / 3. [apresentadoras] / 4. [tema] / 5. debate feminino / 6. [keywords do tema] / 7. talk show feminino / 8. gnt

**Exemplo Papo de Segunda:**
1. papo de segunda gnt / 2. papo de segunda 2026 / 3. gil do vigor / 4. rafael zulu / 5. joao vicente / 6. [tema] / 7. masculinidade / 8. debate masculino

**Erros comuns a evitar:**
→ Tags genéricas: "gnt", "tv", "programa" — inúteis
→ Repetir o título nas tags — YouTube já lê o título
→ Tags de uma palavra: "racismo" é genérica; "racismo no relacionamento" é útil
→ Sem long-tail: "como identificar racismo no namoro" é busca real
→ Mesmas tags em todos os vídeos — cada um precisa de tags únicas` },
  { id:5, n:"5", t:"Thumbnails que Geram Cliques", i:"🖼️", tag:"VISUAL",
    c:`**Thumbnail = 80% do CTR.** Se a thumbnail não gera curiosidade, ninguém clica.

**O que funciona:**
→ Rosto com expressão forte (surpresa, riso, indignação) — 40%+ da área
→ 1-3 palavras grandes e legíveis que COMPLEMENTAM o título (não repetem)
→ Contraste alto (fundo colorido vs texto branco)
→ Máximo 3 elementos visuais
→ Consistência de identidade por programa

**O que NÃO funciona:**
→ Frame genérico do vídeo (sem edição)
→ Texto pequeno (ilegível em mobile = 70%+ tráfego)
→ Logo do GNT ocupando espaço
→ Muitos elementos (faces + texto + logos + emojis)
→ Thumbnail sem relação com o título

**Templates por programa:**
→ Porchat: rosto do convidado expressão exagerada + 1-2 palavras ("DUENDES?!" ou "QUASE MORREU"). Fundo cores quentes.
→ Saia Justa: rosto da apresentadora + tema em texto ("RACISMO NO AMOR"). Fundo tons do programa.
→ Papo de Segunda: expressão reativa + provocação ("HOMENS CHORAM?"). Fundo escuro.

**Texto thumb × Título (formam um PAR):**
Título: ELA VIU DUENDES NA ITÁLIA | Porchat → Thumb: DUENDES?!
Título: RACISMO NO NAMORO: relato de Erika → Thumb: "MEU EX..."
Título: Paolla PERDEU A PACIÊNCIA → Thumb: NÃO AGUENTOU
Título: Porchat revela 10 ANOS do Papo → Thumb: 10 ANOS

**Use teste A/B nativo** do YouTube nos primeiros 10 vídeos. Compare CTR nos primeiros 7 dias.` },
  { id:6, n:"6", t:"Capítulos, Cold Opens e Retenção", i:"⏱️", tag:"ENGAJAMENTO",
    c:`**Capítulos fazem 3 coisas:** ajudam YouTube a entender a estrutura; geram "key moments" na busca; melhoram experiência do viewer.

**Estrutura recomendada — Porchat (15-25 min):**
0:00 Abertura | 0:30 [Nome] chega | 1:15 Primeira história: [tema] | 5:30 Reação do Porchat | 7:00 Segunda história | 12:00 Momento mais engraçado | 15:00 Despedida

**Saia Justa (10-20 min):**
0:00 Tema do dia | 0:45 [Apresentadora] abre debate | 3:00 [Convidada] compartilha | 6:30 Debate esquenta | 10:00 Reflexão final

**Engenharia de retenção: primeiros 30 segundos**
40-60% do público decide ficar ou sair nos primeiros 30s. Programas de TV não têm hooks rápidos.

**Solução: Cold Opens nativos para YouTube**
Em vez de vinheta, comece com o momento mais impactante (5-10s sem contexto), depois vinheta curta (máx 3s), depois vídeo normal.

**Script para editores:**
Passo 1: Identifique o momento mais forte (riso, emoção, choque)
Passo 2: Corte 5-10s e coloque no início
Passo 3: Texto na tela (opcional): "Espera até ouvir..."
Passo 4: Vinheta curta (máx 3s)
Passo 5: Vídeo segue normalmente

**Padrão "promessa→entrega→nova promessa":** Nunca entregue tudo de uma vez. Após cada revelação, faça nova promessa: "Mas espera, a segunda história é ainda pior."` },
  { id:7, n:"7", t:"Estratégia de Shorts", i:"📱", tag:"SHORTS",
    c:`**Shorts NÃO são sobras do long-form.** Algoritmo completamente independente. Avalia: taxa de conclusão, re-watch rate, engajamento nos primeiros 0,5s.

**PROBLEMA GRAVE DO CANAL: 85 vídeos com #shorts no título mas >60 segundos!**
Estão num limbo. Dados: #shorts errado (>60s): 569K views | #shorts correto (≤60s): 766K views
Canal tem apenas 96 Shorts reais em 501 vídeos (19%) — deveria ser 30-40%.

**5 tipos que funcionam para GNT:**

**Tipo 1: Corte de reação (5-15s)** — Momento exato de riso/choque. Sem contexto. Puro momento. Loop natural.

**Tipo 2: Hook de curiosidade (15-30s)** — "Vocês não vão acreditar..." Mostra 20s e corta antes da resolução. CTA: "vídeo completo no canal."

**Tipo 3: Opinião polêmica (15-45s)** — Trecho forte com texto na tela. Gera comentários = algoritmo adora.

**Tipo 4: Resumo (30-50s)** — Cortes rápidos com trilha trending. CTA final.

**Tipo 5: Nativo exclusivo (15-30s)** — Conteúdo que SÓ existe como Short. Bastidores, reações fora do ar. MAIS cresce canal.

**7 Regras:**
1. NUNCA marca d'água TikTok/Reels — penaliza
2. Hook em 0,5s: texto na tela ou fala impactante
3. Formato 9:16 nativo — nunca horizontal com barras pretas
4. Legendas grandes e centralizadas (80% assiste sem som)
5. CTA visual no final: "vídeo completo no canal"
6. 3-5 Shorts/semana mínimo
7. Título próprio otimizado para busca` },
  { id:8, n:"8", t:"Playlists e Topical Authority", i:"📋", tag:"ESTRATÉGIA",
    c:`**Playlists são ferramenta de SEO.** Funcionam como "séries" que YouTube recomenda em bloco.

**Estrutura recomendada:**

POR PROGRAMA:
→ Que História é Essa, Porchat? | Temporada 8 (2026)
→ Melhores Momentos Porchat | Saia Justa 2026 | Papo de Segunda 2026

TEMÁTICAS (SEO-oriented):
→ Histórias HILARIANTES de famosos | Debates sobre relacionamento | Masculinidade e sentimentos | Melhores momentos GNT 2026

DE DESCOBERTA:
→ Comece por aqui: o melhor do GNT | Pra rir sem parar | Debates que todo mundo precisa ver

**Topical Authority — conceito mais importante para 2026:**
Quando YouTube reconhece seu canal como referência em um assunto. Caminho: criar clusters de conteúdo. Em vez de 1 vídeo sobre "racismo", crie série: "Racismo no namoro", "Racismo no trabalho", "Racismo e autoestima" — conectados por playlist e links internos (cards + end screens). Sinaliza autoridade.` },
  { id:9, n:"9", t:"Legendas, Acessibilidade e SEO", i:"💬", tag:"SEO AVANÇADO",
    c:`**Legendas = turbo de SEO.** YouTube usa closed captions para entender o conteúdo em profundidade. Manuais > automáticas.

**Checklist:**
✅ Legendas em português revisadas (não apenas automáticas)
✅ Legendas em inglês (alcance internacional)
✅ Cards apontando para vídeos RELACIONADOS (não links externos)
✅ End screen nos últimos 20s: melhor vídeo + playlist + inscrição
✅ Pinned comment com CTA ou resumo do vídeo
✅ Múltiplas faixas de áudio (quando aplicável)` },
  { id:10, n:"10", t:"Calendário e Frequência", i:"📅", tag:"OPERAÇÃO",
    c:`**Consistência vence frequência.** Algoritmo favorece padrão previsível.

**Calendário semanal:**
SEGUNDA: Long-form Papo de Segunda + 1 Short reação
TERÇA: Long-form Porchat + 1 Short teaser
QUARTA: Long-form Saia Justa + 1 Short debate
QUINTA: Compilação "melhores momentos" + 1-2 Shorts virais
SEXTA: Conteúdo evergreen (atemporal) + 1 Short nativo
SÁB/DOM: 1-2 Shorts (reciclagem)

**Horários (público brasileiro):**
→ Long-form: 12h ou 18h
→ Shorts: 8h, 12h ou 21h

**Rebalanceamento (CRÍTICO):**
Hoje: 60% Porchat, 7,6% Saia Justa — desequilibrado
Meta: máx 50% Porchat, aumentar Saia Justa (38→60+/ano) e Angélica (54→80+/ano)
Razão: Saia Justa e Angélica geram 2x mais views por vídeo.

**Criar "eventos"** — episódios especiais, convidados surpresa, formatos novos — para recriar picos como novembro 2025.` },
  { id:11, n:"11", t:"Métricas e KPIs", i:"📈", tag:"MENSURAÇÃO",
    c:`**Dashboard semanal obrigatório:**

CTR médio → Meta: >6% | Vermelho: <4%
Retenção média → Meta: >40% | Vermelho: <25%
Views/vídeo (long-form) → Meta: >100K | Vermelho: <30K
Views/Short → Meta: >200K | Vermelho: <50K
Comentários/vídeo → Meta: >200 | Vermelho: <50
Inscritos/semana → Meta: >2.000 | Vermelho: <500
Impressões/vídeo → Meta: >500K | Vermelho: <100K

**Benchmarks GNT — Onde está vs Onde deveria:**
CTR: 6,05% → 7,0% (90d) → 8,0% (180d)
Views/vídeo: 452.715 → 600.000 → 800.000
Views diárias: 703.417 → 900.000 → 1.200.000
Shorts/semana: ~2 → 10 → 15
Inscritos/semana: ~2.800 → 5.000 → 8.000

**Mensal:** Exporte "Pesquisa do YouTube". Compare termos de busca. Existe termo com alto volume e nenhum vídeo?

**Concorrência:** Compare com Porta dos Fundos (humor), Astrid Fontenelle (debate). Use TubeBuddy/vidIQ.` },
  { id:12, n:"12", t:"Plano de Ação — Primeiros 30 Dias", i:"🚀", tag:"AÇÃO",
    c:`**Semana 1: Auditoria**
→ Exportar dados do YouTube Studio (Módulo 0)
→ Analisar 50 últimos vídeos com template
→ Identificar 10 melhores e 10 piores → documentar padrões

**Semana 2: Otimização retroativa**
→ Reescrever títulos dos 20 mais recentes
→ Reescrever descrições dos 20 mais recentes
→ Adicionar capítulos aos 20 mais recentes
→ Atualizar tags → trocar thumbnails dos 10 com pior CTR

**Semana 3: Implementação nova**
→ Criar templates de título e descrição por programa
→ Criar checklist de publicação
→ Publicar 5 vídeos com nova estratégia
→ Publicar 10 Shorts nativos

**Semana 4: Mensuração**
→ Comparar métricas novos vs antigos
→ Documentar aprendizados → ajustar para mês 2

**URGENTE (HOJE):**
🔴 Corrigir 85 vídeos com #shorts errado
🔴 Reescrever títulos dos 20 mais recentes (HOOK EMOCIONAL + contexto | Programa, máx 70 chars)
🔴 Adicionar capítulos nos 30 vídeos mais assistidos` },
  { id:13, n:"13", t:"Checklist Final de Publicação", i:"✅", tag:"OPERAÇÃO",
    c:`**TÍTULO**
□ Menos de 60 caracteres?
□ Keyword nas primeiras 5-7 palavras?
□ Gera curiosidade/vontade de clicar?
□ Sem "| GNT" no final?
□ CAPS seletivo (1-3 palavras)?

**DESCRIÇÃO**
□ 3 primeiras linhas = CONTEÚDO (não links)?
□ Timestamps incluídos (mínimo 3)?
□ Mínimo 150 palavras descritivas?
□ Keywords naturais no corpo?
□ Links só depois da 4ª linha?
□ Máximo 3 hashtags?

**TAGS**
□ 8-15 tags únicas?
□ Mix de específicas e amplas?
□ Nomes dos participantes?
□ Tema pesquisável?

**THUMBNAIL**
□ Editada (não frame genérico)?
□ Rosto com expressão forte?
□ Texto grande, legível em mobile?
□ Complementa o título (não repete)?

**EXTRAS**
□ Legendas ativadas?
□ Cards → vídeos relacionados?
□ End screen nos últimos 20s?
□ Pinned comment com CTA?
□ Playlist atribuída?
□ Horário otimizado (12h ou 18h)?

**PÓS-PUBLICAÇÃO (48h):**
□ Compartilhado nas redes?
□ Respondendo comentários (primeiras 2h)?
□ CTR nas 24h? Se <4%, trocar thumb?` }
];

const BOAS = [
  { t: "Títulos com máximo 70 caracteres (ideal 50-60)", d: "Dados: ≤50 chars = 594K views vs 90+ chars = 428K views. Até 39% mais views." },
  { t: "Keyword principal nas primeiras 5-7 palavras do título", d: "O algoritmo e o viewer precisam entender o assunto instantaneamente." },
  { t: "CAPS seletivo: 1-3 palavras por título", d: "Enfatiza o hook emocional sem parecer spam. Ex: 'ELA VIU DUENDES na Itália'." },
  { t: "Criar curiosity gap no título", d: "O viewer PRECISA clicar pra saber o desfecho. 'Quase pirou', 'se arrependeu', 'ninguém esperava'." },
  { t: "3 primeiras linhas da descrição = resumo com keywords", d: "Aparecem antes do 'Mostrar mais'. Nunca links ou hashtags aqui." },
  { t: "Timestamps/capítulos em TODOS os vídeos", d: "Mínimo 3 capítulos. Gera 'key moments' na busca do Google e YouTube." },
  { t: "Descrições únicas com 150+ palavras", d: "Keywords naturais, nomes dos participantes, termos pesquisáveis." },
  { t: "8-15 tags: específicas → amplas → long-tail", d: "Incluir variações e frases que as pessoas realmente pesquisam." },
  { t: "Thumbnail: rosto expressivo (40%+) + 1-3 palavras", d: "Complementa o título, não repete. Legível em mobile." },
  { t: "Cold opens: momento mais forte nos primeiros 5-10s", d: "40-60% abandona nos primeiros 30s. Cold open prende desde o segundo 1." },
  { t: "Shorts REAIS: sempre abaixo de 60 segundos", d: "Shorts reais = 665K views vs Long-form = 403K. Hook em 0,5s." },
  { t: "Sweet spot long-form: 5-10 minutos", d: "CTR 7,75% e retenção 72,4% — melhor combinação do canal." },
  { t: "Publicação nos mesmos horários", d: "Long-form: 12h/18h. Shorts: 8h/12h/21h. Consistência vence frequência." },
  { t: "Teste A/B de thumbnails (nativo YouTube)", d: "Obrigatório nos primeiros 10 vídeos após mudanças." },
  { t: "Playlists temáticas para Topical Authority", d: "Não genéricas ('Saia Justa') mas temáticas ('Debates sobre relacionamento')." },
  { t: "Legendas revisadas manualmente", d: "YouTube usa legendas para entender conteúdo. Manuais > automáticas." },
  { t: "End screen nos últimos 20s + cards para relacionados", d: "Aumenta session time e mantém viewer no canal." },
  { t: "Pinned comment com CTA nas primeiras 2h", d: "Estimula engajamento quando o algoritmo está avaliando o vídeo." },
  { t: "Rebalancear: mais Saia Justa e Angélica", d: "Geram 2x mais views por vídeo que Porchat. Crescem o canal." },
  { t: "Criar 'eventos' para picos de interesse", d: "Nov/2025 (estreia Angélica) = pico do canal. Recriar com especiais." },
  { t: "Top 10 inscritos: celebridade + gatilho emocional + curto", d: "Padrão comprovado pelos dados dos vídeos que mais convertem." },
];

const RUINS = [
  { t: "Colocar '| GNT' no final dos títulos", d: "Sem GNT = 510K views vs Com GNT = 431K. 18% mais views sem." },
  { t: "Títulos com 90+ caracteres", d: "208 vídeos (41%!) aparecem truncados em mobile (70%+ do tráfego)." },
  { t: "#shorts no título de vídeos >60 segundos", d: "85 VÍDEOS com esse erro! Confunde algoritmo. Ação urgente." },
  { t: "Descrições template com links na 1ª linha", d: "Zero informação sobre conteúdo. YouTube não valoriza para SEO." },
  { t: "Começar descrição com hashtag genérica", d: "#SaiaJusta sem contexto — não funciona como keyword." },
  { t: "Mais de 3 hashtags na descrição", d: "Parece spam. YouTube valoriza conteúdo descritivo, não tags." },
  { t: "Tags genéricas: 'gnt', 'tv', 'programa'", d: "Não ajudam em nada na desambiguação ou ranqueamento." },
  { t: "Repetir o título nas tags", d: "YouTube já lê o título automaticamente. Desperdício." },
  { t: "Tags de uma só palavra", d: "'racismo' é genérica; 'racismo no relacionamento' é útil." },
  { t: "Mesmas tags em todos os vídeos", d: "Cada vídeo precisa de tags únicas e específicas." },
  { t: "Frame genérico como thumbnail", d: "Sem edição = sem contraste = sem clique." },
  { t: "Logo GNT ocupando espaço na thumbnail", d: "Espaço valioso desperdiçado. YouTube já mostra o nome do canal." },
  { t: "Texto pequeno/ilegível em mobile na thumb", d: "70%+ do tráfego é mobile. Se não lê, não clica." },
  { t: "Repetir título inteiro na thumbnail", d: "Deve COMPLEMENTAR, não repetir. São um par." },
  { t: "Começar vídeo com vinheta longa", d: "40-60% abandona nos primeiros 30s. Use cold opens." },
  { t: "Shorts com marca d'água TikTok/Reels", d: "YouTube penaliza automaticamente." },
  { t: "Shorts em formato horizontal com barras pretas", d: "Deve ser 9:16 nativo. Barras = desprofissional." },
  { t: "60% do conteúdo de um só programa", d: "Porchat: 300 de 501 vídeos. Saia Justa/Angélica performam 2x melhor." },
  { t: "Formato de TV nos títulos: Nome | Programa | GNT", d: "Estética corporativa afasta cliques. YouTube não é grade de TV." },
  { t: "Keywords do canal com apresentadores que já saíram", d: "Desatualizado e confunde o algoritmo." },
  { t: "Data no título", d: "YouTube já tem data de publicação. Desperdiça caracteres." },
  { t: "Trocadilhos que confundem o algoritmo", d: "'Saia justa' (expressão) vs 'Saia Justa' (programa) = confusão." },
];

// ─── Scoring ───
const TITLE_CK = [
  { l:"Máximo 70 caracteres", fn:t=>t.length<=70, w:15 },
  { l:"Ideal: ≤60 caracteres", fn:t=>t.length<=60, w:5 },
  { l:"Sem '| GNT' no final", fn:t=>!/\|\s*GNT/i.test(t), w:12 },
  { l:"Sem #shorts/#Shorts", fn:t=>!/#shorts/i.test(t), w:12 },
  { l:"CAPS seletivo (1-3 palavras)", fn:t=>{const c=t.split(/\s+/).filter(w=>w.length>2&&w===w.toUpperCase()&&/[A-ZÀ-Ú]/.test(w));return c.length>=1&&c.length<=3;}, w:8 },
  { l:"Não começa com nome do programa", fn:t=>!/^(que história|saia justa|papo de segunda|angélica|conversa com)/i.test(t.trim()), w:8 },
  { l:"Máximo 1 pipe (|)", fn:t=>(t.match(/\|/g)||[]).length<=1, w:8 },
  { l:"Contém hook emocional", fn:null, w:10 },
  { l:"Cria curiosity gap", fn:null, w:10 },
  { l:"Keyword nas primeiras 5-7 palavras", fn:null, w:12 },
];
const DESC_CK = [
  { l:"Não começa com hashtag ou link", fn:d=>!/^[#h]/.test(d.trim()), w:15 },
  { l:"Contém timestamps (0:00)", fn:d=>/\d+:\d{2}/.test(d), w:15 },
  { l:"Mínimo 150 palavras", fn:d=>d.split(/\s+/).filter(Boolean).length>=150, w:12 },
  { l:"Máximo 3 hashtags", fn:d=>(d.match(/#\w+/g)||[]).length<=3, w:10 },
  { l:"Links só após 4ª linha", fn:d=>{const l=d.split("\n").slice(0,3).join(" ");return!/https?:|bit\.ly/i.test(l);}, w:12 },
  { l:"3 primeiras linhas descrevem conteúdo", fn:null, w:12 },
  { l:"Keywords naturais no corpo", fn:null, w:8 },
  { l:"Nomes dos participantes", fn:null, w:8 },
  { l:"Descrição ÚNICA (não template)", fn:null, w:8 },
];

function score(checks,txt){let tot=0,mx=0;const res=checks.map(c=>{mx+=c.w;const p=c.fn?c.fn(txt):null;if(p===true)tot+=c.w;else if(p===null)tot+=c.w*0.5;return{...c,p};});return{s:Math.round((tot/mx)*100),res};}

// ─── UI Primitives ───
const css = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a12}
::selection{background:#ff6b35;color:#fff}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0a12}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
select option{background:#14141f;color:#fff}
input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .5s ease both}
@media(max-width:800px){.desk-nav{display:none!important}.mob-btn{display:flex!important}}`;

const Gauge=({v})=>{const c=v>=80?"#22c55e":v>=60?"#eab308":v>=40?"#f97316":"#ef4444";const r=54,ci=2*Math.PI*r;
return <svg width="140" height="140" viewBox="0 0 140 140" style={{flexShrink:0}}>
  <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
  <circle cx="70" cy="70" r={r} fill="none" stroke={c} strokeWidth="10" strokeDasharray={ci} strokeDashoffset={ci-(v/100)*ci} strokeLinecap="round" style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"all 1.2s cubic-bezier(.4,0,.2,1)"}}/>
  <text x="70" y="64" textAnchor="middle" fill={c} fontSize="34" fontWeight="900" fontFamily="Outfit">{v}</text>
  <text x="70" y="84" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="600" fontFamily="Outfit" letterSpacing="1">{v>=80?"EXCELENTE":v>=60?"BOM":v>=40?"REGULAR":"CRÍTICO"}</text>
</svg>};

const Md=({text})=>{if(!text)return null;return<div style={{lineHeight:1.8,fontSize:14.5,color:"rgba(255,255,255,0.72)"}}>
  {text.split("\n").map((ln,i)=>{
    if(!ln.trim())return<div key={i} style={{height:10}}/>;
    if(/^\*\*[^*]+\*\*$/.test(ln.trim()))return<p key={i} style={{color:"#fff",fontWeight:700,margin:"18px 0 6px",fontSize:15.5}}>{ln.replace(/\*\*/g,"")}</p>;
    if(/\*\*/.test(ln)){const pts=ln.split(/(\*\*[^*]+\*\*)/g);return<p key={i} style={{margin:"4px 0"}}>{pts.map((p,j)=>/\*\*/.test(p)?<strong key={j} style={{color:"#fff",fontWeight:700}}>{p.replace(/\*\*/g,"")}</strong>:p)}</p>}
    if(/^[→•\-]\s/.test(ln))return<p key={i} style={{paddingLeft:18,margin:"4px 0",borderLeft:"2px solid rgba(255,107,53,0.25)"}}>{ln.replace(/^[→•\-]\s/,"")}</p>;
    if(/^[✅□🔴]/.test(ln))return<p key={i} style={{margin:"5px 0"}}>{ln}</p>;
    return<p key={i} style={{margin:"4px 0"}}>{ln}</p>;
  })}
</div>};

const Card=({children,style,...p})=><div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:26,marginBottom:16,...style}} {...p}>{children}</div>;

const Btn=({children,onClick,disabled,secondary,...p})=><button onClick={onClick} disabled={disabled} style={{
  padding:"14px 28px",borderRadius:14,border:secondary?"1.5px solid rgba(255,255,255,0.1)":"none",
  background:secondary?"transparent":"linear-gradient(135deg,#ff6b35 0%,#e63946 100%)",
  color:"#fff",fontSize:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:"Outfit",
  opacity:disabled?.45:1,transition:"all .2s",width:"100%",...(p.style||{})
}} {...p}>{children}</button>;

const Tag=({children,active,onClick,color="#ff6b35"})=><button onClick={onClick} style={{
  padding:"9px 18px",borderRadius:50,border:`1.5px solid ${active?color:"rgba(255,255,255,0.08)"}`,
  background:active?color+"12":"transparent",color:active?color:"rgba(255,255,255,0.4)",
  fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:"Outfit",whiteSpace:"nowrap",transition:"all .2s"
}}>{children}</button>;

const Field=({label,children})=><div style={{marginBottom:20}}>
  <label style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:8}}>{label}</label>
  {children}
</div>;

const inp={width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#fff",fontSize:15,outline:"none",fontFamily:"Outfit",boxSizing:"border-box"};
const sel={...inp,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"};

const Loading=()=><div style={{textAlign:"center",padding:48}}><div style={{fontSize:32,color:"#ff6b35",animation:"spin 1s linear infinite",display:"inline-block"}}>◐</div><p style={{color:"rgba(255,255,255,0.3)",marginTop:14,fontSize:13}}>Processando com IA...</p></div>;

const AiPick=({v,set})=><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(AI).map(([k,ai])=>
  <Tag key={k} active={v===k} onClick={()=>set(k)} color={ai.color}>{ai.icon} {ai.name}</Tag>
)}</div>;

const ProgSel=({v,set})=><select value={v} onChange={e=>set(e.target.value)} style={sel}>
  {PROGS.map(p=><option key={p.k} value={p.k}>{p.l}</option>)}
</select>;

// ─── Pages ───
function Dashboard(){
  const stats=[
    {v:"703K",l:"Views diárias",s:"↓ 35,4% vs pico",c:"#ef4444"},
    {v:"6,05%",l:"CTR médio",s:"Meta: 7-8%",c:"#eab308"},
    {v:"452K",l:"Views/vídeo",s:"Meta: 600K",c:"#eab308"},
    {v:"85",l:"Vídeos c/ erro",s:"#shorts errado",c:"#ef4444"},
    {v:"19%",l:"Shorts reais",s:"Meta: 30-40%",c:"#f97316"},
    {v:"2,6M",l:"Inscritos",s:"+2.800/sem",c:"#22c55e"},
  ];
  const progs=[
    {n:"Porchat",v:300,vw:"344K",s:"0,6",wt:"8,1 min",c:"#ff6b35",pct:60},
    {n:"Saia Justa",v:38,vw:"724K",s:"0,8",wt:"0,6 min",c:"#e63946",pct:7.6},
    {n:"Angélica",v:54,vw:"917K",s:"0,6",wt:"0,6 min",c:"#3b82f6",pct:10.8},
    {n:"Papo de Segunda",v:17,vw:"446K",s:"0,7",wt:"0,6 min",c:"#14b8a6",pct:3.4},
    {n:"Conversa com Bial",v:46,vw:"379K",s:"0,9",wt:"1,4 min",c:"#8b5cf6",pct:9.2},
  ];
  const bars=[
    {r:"≤50 chars",vw:594592,p:100,c:"#22c55e"},
    {r:"50-70",vw:533230,p:90,c:"#22c55e"},
    {r:"70-90",vw:450359,p:76,c:"#eab308"},
    {r:"90+ chars",vw:427535,p:72,c:"#f97316"},
  ];
  return <div className="fade-up">
    <div style={{textAlign:"center",padding:"48px 0 28px"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{width:48,height:48,background:"linear-gradient(135deg,#ff6b35,#e63946)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",fontWeight:900}}>▶</div>
        <h1 style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:900,color:"#fff",letterSpacing:-3,lineHeight:1}}>GNT <span style={{color:"#ff6b35"}}>SEO</span> Hub</h1>
      </div>
      <p style={{color:"rgba(255,255,255,0.35)",fontSize:15,maxWidth:500,margin:"0 auto"}}>Plataforma de otimização YouTube · 501 vídeos analisados · Dados reais YouTube Studio · Mai/2025 — Mai/2026</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:20}}>
      {stats.map((s,i)=><Card key={i} style={{textAlign:"center",padding:"20px 14px",animationDelay:i*60+"ms"}} className="fade-up">
        <div style={{fontSize:30,fontWeight:900,color:s.c,fontFamily:"Outfit",lineHeight:1}}>{s.v}</div>
        <div style={{color:"rgba(255,255,255,0.6)",fontSize:12.5,marginTop:6,fontWeight:500}}>{s.l}</div>
        <div style={{color:"rgba(255,255,255,0.25)",fontSize:11,marginTop:2}}>{s.s}</div>
      </Card>)}
    </div>

    <Card style={{background:"rgba(239,68,68,0.04)",borderColor:"rgba(239,68,68,0.15)"}}>
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <span style={{fontSize:26,flexShrink:0}}>🚨</span>
        <div>
          <div style={{color:"#ef4444",fontWeight:800,fontSize:15}}>URGENTE — 85 Vídeos com #shorts Errado</div>
          <div style={{color:"rgba(255,255,255,0.55)",fontSize:14,lineHeight:1.75,marginTop:6}}>
            85 vídeos têm <strong style={{color:"#fca5a5"}}>#shorts no título mas duram mais de 60 segundos</strong>. Estão num limbo: não são Shorts (feed não pega), não são long-form otimizado. O algoritmo não sabe pra quem recomendar.
            <br/>Shorts corretos (≤60s) têm <strong style={{color:"#fca5a5"}}>766K views</strong> vs errados (>60s) <strong style={{color:"#fca5a5"}}>569K</strong>. Remover #shorts desses 85 vídeos é a correção de maior impacto imediato.
          </div>
        </div>
      </div>
    </Card>

    <h2 style={{color:"#fff",fontSize:20,fontWeight:800,margin:"32px 0 14px",letterSpacing:-.5}}>Performance por Programa</h2>
    <Card>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13.5}}>
          <thead><tr>{["","Programa","Vídeos","Views médias","Subs/1K","Watch Time"].map((h,i)=><th key={i} style={{padding:"10px 12px",textAlign:"left",color:"rgba(255,255,255,0.3)",fontWeight:600,fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.05)",textTransform:"uppercase",letterSpacing:.6}}>{h}</th>)}</tr></thead>
          <tbody>{progs.map((p,i)=><tr key={i}>
            <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><div style={{width:10,height:10,borderRadius:3,background:p.c}}/></td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"#fff",fontWeight:600}}>{p.n} <span style={{color:"rgba(255,255,255,0.25)",fontSize:11}}>({p.pct}%)</span></td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.6)"}}>{p.v}</td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.8)",fontWeight:700}}>{p.vw}</td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.6)"}}>{p.s}</td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.6)"}}>{p.wt}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:12}}>💡 Saia Justa e Angélica geram 2x mais views por vídeo que Porchat. Bial tem melhor conversão de inscritos.</p>
    </Card>

    <h2 style={{color:"#fff",fontSize:20,fontWeight:800,margin:"32px 0 14px",letterSpacing:-.5}}>Impacto do Comprimento do Título</h2>
    <Card>
      {bars.map((b,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <span style={{width:70,textAlign:"right",color:"rgba(255,255,255,0.4)",fontSize:12.5,flexShrink:0,fontWeight:500}}>{b.r}</span>
        <div style={{flex:1,height:34,background:"rgba(255,255,255,0.03)",borderRadius:8,overflow:"hidden"}}>
          <div style={{width:b.p+"%",height:"100%",borderRadius:8,background:`linear-gradient(90deg,${b.c}dd,${b.c}88)`,transition:"width 1.5s cubic-bezier(.4,0,.2,1)",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:12}}>
            <span style={{color:"#fff",fontSize:12,fontWeight:800}}>{(b.vw/1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>)}
      <p style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:8}}>208 vídeos (41% do canal) têm 90+ chars e aparecem truncados em mobile.</p>
    </Card>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:24}}>
      <Card>
        <h3 style={{color:"#fff",fontSize:16,fontWeight:700,marginBottom:12}}>📊 Duração × Performance</h3>
        {[{d:"1-5 min",v:"624K views",ctr:"CTR 6,49%",ret:"Ret. 40,6%"},{d:"5-10 min ★",v:"240K views",ctr:"CTR 7,75%",ret:"Ret. 72,4%"},{d:"10-15 min",v:"326K views",ctr:"CTR 6,07%",ret:"Ret. 66,2%"},{d:"15-30 min",v:"381K views",ctr:"CTR 4,79%",ret:"Ret. 59,6%"}].map((r,i)=>
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",fontSize:13}}>
            <span style={{color:r.d.includes("★")?"#ff6b35":"rgba(255,255,255,0.7)",fontWeight:r.d.includes("★")?700:400}}>{r.d}</span>
            <span style={{color:"rgba(255,255,255,0.4)"}}>{r.v} · {r.ctr} · {r.ret}</span>
          </div>
        )}
        <p style={{color:"#ff6b35",fontSize:12,marginTop:10,fontWeight:600}}>★ Sweet spot: 5-10 min (melhor CTR + retenção)</p>
      </Card>
      <Card>
        <h3 style={{color:"#fff",fontSize:16,fontWeight:700,marginBottom:12}}>🎯 Metas — Benchmark</h3>
        {[{m:"CTR médio",a:"6,05%",g1:"7,0%",g2:"8,0%"},{m:"Views/vídeo",a:"452K",g1:"600K",g2:"800K"},{m:"Views diárias",a:"703K",g1:"900K",g2:"1,2M"},{m:"Shorts/semana",a:"~2",g1:"10",g2:"15"},{m:"Inscritos/sem",a:"~2.800",g1:"5.000",g2:"8.000"}].map((r,i)=>
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",fontSize:13}}>
            <span style={{color:"rgba(255,255,255,0.7)"}}>{r.m}</span>
            <div><span style={{color:"#ef4444",marginRight:12}}>{r.a}</span><span style={{color:"#eab308",marginRight:12}}>{r.g1}</span><span style={{color:"#22c55e"}}>{r.g2}</span></div>
          </div>
        )}
        <div style={{display:"flex",gap:16,marginTop:10,fontSize:11,color:"rgba(255,255,255,0.3)"}}>
          <span><span style={{color:"#ef4444"}}>●</span> Atual</span>
          <span><span style={{color:"#eab308"}}>●</span> 90 dias</span>
          <span><span style={{color:"#22c55e"}}>●</span> 180 dias</span>
        </div>
      </Card>
    </div>
  </div>;
}

function TitleEval(){
  const [t,sT]=useState("");const [pg,sPg]=useState("porchat");const [ai,sAi]=useState("google");
  const [res,sRes]=useState(null);const [out,sOut]=useState("");const [ld,sLd]=useState(false);
  const run=async()=>{if(!t.trim())return;const{s,res:r}=score(TITLE_CK,t);sRes({s,r});sLd(true);sOut("");
    const pn=PROGS.find(p=>p.k===pg)?.l;
    try{const o=await AI[ai].call(SYS+"\nVocê é avaliador de títulos YouTube. Analise e dê: 1) Problemas encontrados com base nos dados reais, 2) 3 sugestões de título otimizado (cada <60 chars), 3) Justificativa com dados. Seja prático.",
      `Título do programa "${pn}": "${t}"\nComprimento: ${t.length} chars\nTem "| GNT": ${/\|.*GNT/i.test(t)?"Sim":"Não"}\nTem #shorts: ${/#shorts/i.test(t)?"Sim":"Não"}\nPalavras CAPS: ${t.split(/\s+/).filter(w=>w.length>2&&w===w.toUpperCase()&&/[A-Z]/.test(w)).join(", ")||"Nenhuma"}\nPipes: ${(t.match(/\|/g)||[]).length}`
    );sOut(o);}catch(e){sOut("Erro: "+e.message);}sLd(false);};
  const cc=t.length<=50?"#22c55e":t.length<=60?"#22c55e":t.length<=70?"#eab308":t.length<=90?"#f97316":"#ef4444";
  return <div className="fade-up">
    <h1 style={{fontSize:"clamp(26px,5vw,40px)",fontWeight:900,color:"#fff",letterSpacing:-1.5}}>✏️ Avaliador de Títulos</h1>
    <p style={{color:"rgba(255,255,255,0.35)",marginBottom:28,fontSize:14.5}}>Avalie e otimize títulos com base em dados reais de 501 vídeos do Canal GNT.</p>
    <Card>
      <Field label="Programa"><ProgSel v={pg} set={sPg}/></Field>
      <Field label="Título do vídeo">
        <input value={t} onChange={e=>sT(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()} placeholder='Ex: "ELA VIU DUENDES NA ITÁLIA e quase pirou | Porchat"' style={inp}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <span style={{color:cc,fontSize:12.5,fontWeight:600}}>{t.length} caracteres {t.length<=50?"· Ideal ✓":t.length<=60?"· Bom ✓":t.length<=70?"· Aceitável":t.length<=90?"· Longo ⚠":"· Trunca em mobile ❌"}</span>
        </div>
      </Field>
      <Field label="Modelo de IA"><AiPick v={ai} set={sAi}/></Field>
      <Btn onClick={run} disabled={ld||!t.trim()}>{ld?"Analisando...":"Avaliar Título"}</Btn>
    </Card>
    {res&&<Card>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
        <Gauge v={res.s}/>
        <div style={{flex:1,minWidth:250}}>
          {res.r.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",padding:"7px 10px",marginBottom:3,borderRadius:8,background:r.p===true?"rgba(34,197,94,0.05)":r.p===false?"rgba(239,68,68,0.05)":"rgba(255,255,255,0.015)"}}>
            <span style={{marginRight:8,fontSize:14}}>{r.p===true?"✅":r.p===false?"❌":"◐"}</span>
            <span style={{flex:1,fontSize:13,color:"rgba(255,255,255,0.7)"}}>{r.l}</span>
            <span style={{color:"rgba(255,255,255,0.2)",fontSize:10.5,fontWeight:600}}>{r.w}pts</span>
          </div>)}
        </div>
      </div>
    </Card>}
    {ld&&<Loading/>}
    {out&&!ld&&<Card><h3 style={{color:"#ff6b35",marginBottom:14,fontSize:16,fontWeight:700}}>🤖 Análise da IA ({AI[ai].name})</h3><Md text={out}/></Card>}
  </div>;
}

function DescEval(){
  const [d,sD]=useState("");const [pg,sPg]=useState("porchat");const [ai,sAi]=useState("google");
  const [res,sRes]=useState(null);const [out,sOut]=useState("");const [ld,sLd]=useState(false);
  const run=async()=>{if(!d.trim())return;const{s,res:r}=score(DESC_CK,d);sRes({s,r});sLd(true);sOut("");
    const pn=PROGS.find(p=>p.k===pg)?.l;
    try{const o=await AI[ai].call(SYS+"\nVocê é avaliador de descrições YouTube. Analise e forneça: 1) Problemas, 2) Versão otimizada COMPLETA seguindo estrutura correta (3 linhas resumo + timestamps + parágrafo SEO + links + hashtags), 3) Keywords sugeridas. Formate a descrição otimizada entre ``` para fácil cópia.",
      `Descrição do programa "${pn}":\n\n"${d}"\n\nPalavras: ${d.split(/\s+/).filter(Boolean).length}\nTimestamps: ${/\d+:\d{2}/.test(d)?"Sim":"Não"}\nComeça com link/hashtag: ${/^[#h]/.test(d.trim())?"Sim":"Não"}\nHashtags: ${(d.match(/#\w+/g)||[]).length}`
    );sOut(o);}catch(e){sOut("Erro: "+e.message);}sLd(false);};
  const wc=d.split(/\s+/).filter(Boolean).length;
  return <div className="fade-up">
    <h1 style={{fontSize:"clamp(26px,5vw,40px)",fontWeight:900,color:"#fff",letterSpacing:-1.5}}>📝 Avaliador de Descrição</h1>
    <p style={{color:"rgba(255,255,255,0.35)",marginBottom:28,fontSize:14.5}}>Otimize descrições para ranqueamento na busca do YouTube.</p>
    <Card>
      <Field label="Programa"><ProgSel v={pg} set={sPg}/></Field>
      <Field label="Descrição do vídeo">
        <textarea value={d} onChange={e=>sD(e.target.value)} placeholder="Cole aqui a descrição atual do vídeo..." style={{...inp,minHeight:180,resize:"vertical"}}/>
        <span style={{color:wc>=150?"#22c55e":"rgba(255,255,255,0.3)",fontSize:12,marginTop:4,display:"block"}}>{wc} palavras {wc>=150?"✓":`(faltam ${150-wc} para o mínimo)`}</span>
      </Field>
      <Field label="Modelo de IA"><AiPick v={ai} set={sAi}/></Field>
      <Btn onClick={run} disabled={ld||!d.trim()}>{ld?"Analisando...":"Avaliar Descrição"}</Btn>
    </Card>
    {res&&<Card>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
        <Gauge v={res.s}/>
        <div style={{flex:1,minWidth:250}}>
          {res.r.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",padding:"7px 10px",marginBottom:3,borderRadius:8,background:r.p===true?"rgba(34,197,94,0.05)":r.p===false?"rgba(239,68,68,0.05)":"rgba(255,255,255,0.015)"}}>
            <span style={{marginRight:8,fontSize:14}}>{r.p===true?"✅":r.p===false?"❌":"◐"}</span>
            <span style={{flex:1,fontSize:13,color:"rgba(255,255,255,0.7)"}}>{r.l}</span>
            <span style={{color:"rgba(255,255,255,0.2)",fontSize:10.5,fontWeight:600}}>{r.w}pts</span>
          </div>)}
        </div>
      </div>
    </Card>}
    {ld&&<Loading/>}
    {out&&!ld&&<Card><h3 style={{color:"#ff6b35",marginBottom:14,fontSize:16,fontWeight:700}}>🤖 Análise da IA ({AI[ai].name})</h3><Md text={out}/></Card>}
  </div>;
}

function ThumbGen(){
  const [ctx,sCtx]=useState("");const [pg,sPg]=useState("porchat");const [ai,sAi]=useState("google");
  const [out,sOut]=useState("");const [ld,sLd]=useState(false);
  const run=async()=>{if(!ctx.trim())return;sLd(true);sOut("");
    const pn=PROGS.find(p=>p.k===pg)?.l;
    try{const o=await AI[ai].call(SYS+`\nVocê gera conceitos de thumbnail para YouTube. Para cada sugestão forneça:
1. TEXTO DA THUMBNAIL (5-7 palavras, em CAPS, que COMPLEMENTAM o título — não repetem)
2. TÍTULO OTIMIZADO correspondente (máximo 60 caracteres)
3. DIREÇÃO VISUAL: expressão facial, cores de fundo, posicionamento do texto
4. POR QUE FUNCIONA: justificativa baseada nos dados do canal

Gere exatamente 3 opções. Thumb e título formam um PAR. Texto grande e legível em mobile. Rosto com expressão forte 40%+ da área. Máximo 3 elementos visuais.`,
      `Programa: ${pn}\n\nContexto do vídeo:\n${ctx}\n\nGere 3 opções de thumbnail + título otimizado.`);sOut(o);}catch(e){sOut("Erro: "+e.message);}sLd(false);};
  return <div className="fade-up">
    <h1 style={{fontSize:"clamp(26px,5vw,40px)",fontWeight:900,color:"#fff",letterSpacing:-1.5}}>🖼️ Gerador de Thumbnails</h1>
    <p style={{color:"rgba(255,255,255,0.35)",marginBottom:28,fontSize:14.5}}>Gere textos (5-7 palavras) e direções visuais para thumbnails otimizadas.</p>
    <Card>
      <Field label="Programa"><ProgSel v={pg} set={sPg}/></Field>
      <Field label="Contexto do vídeo">
        <textarea value={ctx} onChange={e=>sCtx(e.target.value)} placeholder="Descreva: quem participa, o que acontece, momento mais forte, emoção principal..." style={{...inp,minHeight:140,resize:"vertical"}}/>
      </Field>
      <Field label="Modelo de IA"><AiPick v={ai} set={sAi}/></Field>
      <Btn onClick={run} disabled={ld||!ctx.trim()}>{ld?"Gerando...":"Gerar Thumbnails"}</Btn>
    </Card>
    {ld&&<Loading/>}
    {out&&!ld&&<Card><h3 style={{color:"#ff6b35",marginBottom:14,fontSize:16,fontWeight:700}}>🖼️ Sugestões de Thumbnail + Título</h3><Md text={out}/></Card>}
    <Card>
      <h3 style={{color:"#fff",fontSize:15,fontWeight:700,marginBottom:12}}>Referência — Texto Thumb × Título (formam um PAR)</h3>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><th style={{padding:"8px 12px",textAlign:"left",color:"rgba(255,255,255,0.3)",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:11}}>TÍTULO</th><th style={{padding:"8px 12px",textAlign:"left",color:"rgba(255,255,255,0.3)",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:11}}>THUMBNAIL</th></tr></thead>
          <tbody>{[["ELA VIU DUENDES NA ITÁLIA | Porchat","DUENDES?!"],["RACISMO NO NAMORO: relato de Erika | Saia Justa",'"MEU EX..."'],["Paolla PERDEU A PACIÊNCIA | Porchat","NÃO AGUENTOU"],["Porchat revela 10 ANOS do Papo de Segunda","10 ANOS"],["Ana Paula ESTREIA no Saia Justa","ESTREIA!"]].map(([t,th],i)=>
            <tr key={i}><td style={{padding:"8px 12px",color:"rgba(255,255,255,0.6)",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{t}</td><td style={{padding:"8px 12px",color:"#ff6b35",fontWeight:800,fontSize:16,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{th}</td></tr>
          )}</tbody>
        </table>
      </div>
    </Card>
  </div>;
}

function Course(){
  const [open,sOpen]=useState(null);
  return <div className="fade-up">
    <h1 style={{fontSize:"clamp(26px,5vw,40px)",fontWeight:900,color:"#fff",letterSpacing:-1.5}}>🎓 Curso SEO YouTube</h1>
    <p style={{color:"rgba(255,255,255,0.35)",marginBottom:28,fontSize:14.5}}>14 módulos completos (0-13). Clique para expandir.</p>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {MODS.map(m=><div key={m.id}>
        <button onClick={()=>sOpen(open===m.id?null:m.id)} style={{
          width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px 20px",
          background:open===m.id?"rgba(255,107,53,0.05)":"rgba(255,255,255,0.015)",
          border:`1px solid ${open===m.id?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.05)"}`,
          borderRadius:open===m.id?"14px 14px 0 0":14,cursor:"pointer",transition:"all .2s",textAlign:"left"
        }}>
          <span style={{fontSize:24,flexShrink:0}}>{m.i}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:2}}>
              <span style={{color:"rgba(255,255,255,0.3)",fontSize:11,fontWeight:700}}>MÓDULO {m.n}</span>
              <span style={{background:"rgba(255,107,53,0.1)",color:"#ff6b35",fontSize:9.5,padding:"2px 8px",borderRadius:20,fontWeight:700,letterSpacing:.5}}>{m.tag}</span>
            </div>
            <span style={{color:"#fff",fontSize:14.5,fontWeight:700,fontFamily:"Outfit"}}>{m.t}</span>
          </div>
          <span style={{color:"rgba(255,255,255,0.2)",fontSize:16,transform:open===m.id?"rotate(180deg)":"none",transition:"transform .3s"}}>▾</span>
        </button>
        {open===m.id&&<div style={{background:"rgba(255,255,255,0.01)",border:"1px solid rgba(255,255,255,0.05)",borderTop:"none",borderRadius:"0 0 14px 14px",padding:"22px 24px"}}><Md text={m.c}/></div>}
      </div>)}
    </div>
  </div>;
}

function Guide(){
  const [tab,sTab]=useState("do");
  const items=tab==="do"?BOAS:RUINS;
  const kpis=[
    {v:"+39%",l:"Views com títulos ≤50 chars",c:"#22c55e"},
    {v:"+18%",l:"Views sem 'GNT' no título",c:"#22c55e"},
    {v:"+65%",l:"Views em Shorts reais (≤60s)",c:"#22c55e"},
    {v:"7,75%",l:"CTR sweet spot (5-10 min)",c:"#ff6b35"},
    {v:"72,4%",l:"Melhor retenção (5-10 min)",c:"#22c55e"},
    {v:"85",l:"Vídeos #shorts errado",c:"#ef4444"},
    {v:"60%",l:"Dependência Porchat",c:"#eab308"},
    {v:"64",l:"Comentários/vídeo (2,6M inscritos)",c:"#ef4444"},
  ];
  return <div className="fade-up">
    <h1 style={{fontSize:"clamp(26px,5vw,40px)",fontWeight:900,color:"#fff",letterSpacing:-1.5}}>📖 Guia de Boas Práticas</h1>
    <p style={{color:"rgba(255,255,255,0.35)",marginBottom:28,fontSize:14.5}}>Baseado em 501 vídeos analisados — dados reais YouTube Studio.</p>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      <Tag active={tab==="do"} onClick={()=>sTab("do")} color="#22c55e">✅ O Que Fazer ({BOAS.length})</Tag>
      <Tag active={tab==="dont"} onClick={()=>sTab("dont")} color="#ef4444">❌ O Que NÃO Fazer ({RUINS.length})</Tag>
    </div>
    <Card>
      {items.map((it,i)=><div key={i} style={{padding:"14px 0",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,0.03)":"none"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{fontSize:15,flexShrink:0}}>{tab==="do"?"✅":"❌"}</span>
          <div>
            <div style={{color:"#fff",fontSize:14,fontWeight:600,lineHeight:1.5}}>{it.t}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginTop:3,lineHeight:1.6}}>{it.d}</div>
          </div>
        </div>
      </div>)}
    </Card>
    <h2 style={{color:"#fff",fontSize:20,fontWeight:800,margin:"32px 0 14px"}}>Dados que Sustentam as Regras</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
      {kpis.map((s,i)=><Card key={i} style={{textAlign:"center",padding:20}}>
        <div style={{fontSize:28,fontWeight:900,color:s.c,fontFamily:"Outfit",lineHeight:1}}>{s.v}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,marginTop:8,lineHeight:1.5}}>{s.l}</div>
      </Card>)}
    </div>
    <Card style={{marginTop:24}}>
      <h3 style={{color:"#fff",fontSize:16,fontWeight:700,marginBottom:14}}>📋 Exemplos Reais — Antes e Depois</h3>
      {[
        {b:"Paulo Vieira conta perrengue para acompanhar Porchat em viagem | Que História é essa, Porchat?",a:"Paulo Vieira QUASE MORREU tentando acompanhar o Porchat",p:"CTR 2,7% → potencial 6%. De ~1,5M para ~3,3M views com mesmas impressões."},
        {b:"Carol Marra encontrou um date em uma situação super INUSITADA! | Que História É Essa, Porchat? | GNT",a:"Ela encontrou o DATE na situação MAIS CONSTRANGEDORA possível | Porchat",p:"96→63 chars. CTR 12,2% mas poucas impressões. Hook universal amplia alcance."},
        {b:"Anitta PEDE CARONA junto com a mãe na volta do show! 😱 | Que História É Essa, Porchat? | GNT",a:"ANITTA e a mãe DESESPERADAS pedindo carona depois do show | Porchat",p:"Nome ENORME com apenas 156K views. 'ANITTA' em caps + 'DESESPERADAS' cria urgência."},
        {b:"Juliana Didone e Alejandro Claveaux: Vinho, Itália e DUENDES | Que História é essa, Porchat? | GNT",a:"ELA VIU DUENDES NA ITÁLIA e quase pirou | Porchat",p:"87→49 chars. Gancho (duendes) vai pro início. Curiosity gap."},
        {b:"Paolla Oliveira encarou uma SAIA JUSTA em nome da elegância 😂 | Que História É Essa, Porchat? | GNT",a:"Paolla Oliveira PERDEU A PACIÊNCIA com a roupa e se arrependeu | Porchat",p:"101→72 chars. Sem trocadilho confuso (saia justa expressão vs programa)."},
        {b:"Fábio Porchat volta ao Papo com boas memórias e risadas certas | Papo de Segunda | Papo Rápido | GNT",a:"Porchat revela os bastidores de 10 ANOS do Papo de Segunda",p:"101→59 chars. 'Bastidores' e '10 ANOS' = hooks reais vs 'boas memórias' = genérico."},
      ].map((ex,i)=><div key={i} style={{padding:"16px 0",borderBottom:i<5?"1px solid rgba(255,255,255,0.03)":"none"}}>
        <div style={{fontSize:13,marginBottom:6}}>
          <span style={{color:"#ef4444",fontWeight:600}}>ANTES: </span>
          <span style={{color:"rgba(255,255,255,0.5)"}}>{ex.b}</span>
        </div>
        <div style={{fontSize:13,marginBottom:6}}>
          <span style={{color:"#22c55e",fontWeight:600}}>DEPOIS: </span>
          <span style={{color:"rgba(255,255,255,0.8)",fontWeight:600}}>{ex.a}</span>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",fontStyle:"italic"}}>💡 {ex.p}</div>
      </div>)}
    </Card>
  </div>;
}

// ─── Main ───
const NAV=[
  {id:"dash",l:"Dashboard",i:"◉"},
  {id:"title",l:"Avaliador Títulos",i:"✏️"},
  {id:"desc",l:"Avaliador Descrição",i:"📝"},
  {id:"thumb",l:"Gerador Thumbnails",i:"🖼️"},
  {id:"course",l:"Curso SEO",i:"🎓"},
  {id:"guide",l:"Boas Práticas",i:"📖"},
];

export default function App(){
  const [pg,sPg]=useState("dash");
  const [mob,sMob]=useState(false);
  return <div style={{fontFamily:"'Outfit',system-ui,sans-serif",background:"#0a0a12",minHeight:"100vh",color:"rgba(255,255,255,0.75)"}}>
    <style>{css}</style>
    <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,18,0.88)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
      <div style={{maxWidth:1120,margin:"0 auto",padding:"0 18px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"relative"}}>
        <div onClick={()=>{sPg("dash");sMob(false)}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#ff6b35,#e63946)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:900}}>▶</div>
          <span style={{fontSize:16,fontWeight:800,color:"#fff",letterSpacing:-.5}}>GNT SEO</span>
        </div>
        <button className="mob-btn" onClick={()=>sMob(!mob)} style={{display:"none",alignItems:"center",justifyContent:"center",background:"none",border:"1px solid rgba(255,255,255,0.08)",color:"#fff",fontSize:18,padding:"5px 10px",borderRadius:8,cursor:"pointer"}}>{mob?"✕":"☰"}</button>
        <div className="desk-nav" style={{display:"flex",gap:1,alignItems:"center"}}>
          {NAV.map(n=><button key={n.id} onClick={()=>sPg(n.id)} style={{background:pg===n.id?"rgba(255,107,53,0.08)":"transparent",border:"none",color:pg===n.id?"#ff6b35":"rgba(255,255,255,0.35)",padding:"7px 13px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit",whiteSpace:"nowrap",transition:"all .2s"}}>{n.i} {n.l}</button>)}
        </div>
      </div>
      {mob&&<div style={{background:"rgba(10,10,18,0.97)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:8}}>
        {NAV.map(n=><button key={n.id} onClick={()=>{sPg(n.id);sMob(false)}} style={{display:"block",width:"100%",textAlign:"left",background:pg===n.id?"rgba(255,107,53,0.08)":"transparent",border:"none",color:pg===n.id?"#ff6b35":"rgba(255,255,255,0.5)",padding:"12px 16px",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"Outfit",marginBottom:2}}>{n.i} {n.l}</button>)}
      </div>}
    </nav>
    <main style={{maxWidth:1120,margin:"0 auto",padding:"24px 18px 80px"}}>
      {pg==="dash"&&<Dashboard/>}
      {pg==="title"&&<TitleEval/>}
      {pg==="desc"&&<DescEval/>}
      {pg==="thumb"&&<ThumbGen/>}
      {pg==="course"&&<Course/>}
      {pg==="guide"&&<Guide/>}
    </main>
    <footer style={{textAlign:"center",padding:"20px 16px",borderTop:"1px solid rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.15)",fontSize:11}}>
      GNT SEO Hub · 501 vídeos analisados · Dados reais YouTube Studio · Mai/2025 — Mai/2026
    </footer>
  </div>;
}
