# ✨ Ateliê Estelar

Gacha de moda e cenários feito em **HTML, CSS e JavaScript puros** — sem dependências, sem build. Funciona no celular, pode ser instalado como app (PWA) e roda offline.

## Como jogar

- **Local:** abra o `index.html` no navegador.
- **No celular:** hospede a pasta em qualquer servidor estático (ex.: GitHub Pages → *Settings › Pages › Deploy from branch › main / root*) e abra o link. Pelo menu do navegador, "Adicionar à tela inicial" instala o jogo.

## Mecânicas

- **3 banners** — *Estrelas Eternas* (visuais de personagem, com **Desejo**), *Destaque* (tema rotativo a cada 2 dias, com 50/50) e *Mundos Oníricos* (fundos, objetos e climas).
- **5 raridades** — Comum, Raro, Épico, Lendário e Mítico.
- **Garantias** — Épico+ a cada 10 invocações, chance de Lendário aumentada a partir da 50ª e garantida na 70ª. A 1ª invocação ×10 garante um Lendário. 1 invocação grátis por dia.
- **Repetidos** — sobem estrelas de ★1 a ★5: ★3 libera a variante de cor e ★5 o **Prisma** animado. Acima de ★5 viram ✨ Poeira Estelar.
- **Estúdio** — monte personagens com 7 tipos de item. 3+ itens do mesmo tema ativam o bônus de **Conjunto**.
- **Cenário** — arraste objetos e personagens, use a pinça para mudar o tamanho, espelhe, mude a ordem, escolha fundo e clima. Exporta PNG.
- **Desfile diário** — 3 tentativas contra rivais; itens dos temas do dia pontuam mais.
- **Exposição** — cenários expostos rendem 🪙 por hora (até 10h).
- **Progressão** — missões diárias, presente de login (ciclo de 7 dias), marcos do álbum, conjuntos completos, loja com limite diário e níveis que liberam vagas.

## Persistência

O progresso é salvo automaticamente no `localStorage`. Em **⚙️ Ajustes** dá para exportar/importar o progresso (código ou arquivo `.json`) para levar a outro aparelho.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `js/data.js` | Raridades, temas, **itens**, banners, missões e loja — adicione itens aqui |
| `js/art-char.js` | Arte procedural (SVG) dos personagens |
| `js/art-scene.js` | Fundos, climas e renderização dos cenários |
| `js/store.js` | Estado, salvamento, economia e pontuação |
| `js/gacha.js` | Sorteio, garantias, 50/50, desejo, criação e loja |
| `js/ui-*.js` | Telas: invocar, estúdio, cenário, eventos e álbum |
| `sw.js`, `manifest.webmanifest` | Instalação e modo offline |

### Adicionando um item

Acrescente uma linha em `ITEM_TABLE` (`js/data.js`):

```js
['h_novo', 'hair', 'cosmos', 2, 'Cabelo Novo', 'buns', { a: '#ff9df2', c: '#6b4cff', fx: 'grad' }],
// [id, slot, tema, raridade 0-4, nome, template, cores]
```

Os templates disponíveis estão em `Art.HAIR`, `Art.EYES`, `Art.OUTFIT`, `Art.HAT`, `Art.FACE`, `Art.AURA`, `Art.PET` e `SceneArt.BG`. Para objetos de cenário, o template é um emoji.

Ao publicar uma nova versão, aumente `CACHE` em `sw.js` para que os jogadores recebam os arquivos novos.
