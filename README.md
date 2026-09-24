# ✨ Ateliê Estelar

Jogo de vestir e criar personagens no estilo gacha, feito em **HTML, CSS e JavaScript puros**. Não tem dependências nem etapa de build. Funciona no celular e no desktop, pode ser instalado como app (PWA) e roda offline.

> Pronto: **menu principal, editor completo de personagem e Estúdio de cenas**. Próximas fases: Gacha/Unidades, Batalhas e Minigames.
> O mapa das telas usado como referência está em [`referencias/gacha-club/MAPA.md`](referencias/gacha-club/MAPA.md).

## Como jogar

- **Local:** abra o `index.html` no navegador.
- **Online / celular:** publique a pasta em qualquer hospedagem estática. No GitHub Pages: *Settings › Pages › Deploy from branch › main / root*.

## O que já existe

**Menu principal**
- Cartão do jogador com título, nível e moedas
- 10 personagens principais
- Palco com fundo animado
- Tablet com 9 atalhos
- Barra de navegação

**Reservas:** 90 vagas para guardar personagens. Dá para trocar, clonar e copiar tudo, só as roupas, só o cabelo ou as cores.

**Fundos:** 22 cenários e padrões (com profundidade e animações) mais 15 sobreposições (chuva, neve, pétalas, cortina de palco...). Também é possível mover, mudar a escala, aplicar tom e trocar a cor.

**Editor**
- **Predefinidos:** 18 personagens prontos, organizados em clubes. Dá para copiar tudo, só as roupas ou só o cabelo, com ou sem as cores.
- **Corpo:** vista de lado (3/4) ou de frente, pele, tamanho do corpo e da cabeça, inclinação, rotação, virar, formato das mãos, sombra e **51 poses** em 11 categorias.
- **Cabeça:** 5 camadas de cabelo, com cor da base, degradê e contorno. Olhos, pupilas e sobrancelhas podem ser diferentes de cada lado. Também tem nariz, boca, corado, marcas no rosto e 16 expressões prontas.
- **Roupas:** chapéus, óculos, enfeites, acessórios de rosto, pescoço, estampa, camisa, jaqueta, mangas, saia, calças, meias, sapatos, luvas, capa, cauda e asas.
- **Outros:** itens nas duas mãos e escudo, efeitos atrás e na frente, animações, ocultar partes, balão de fala com emote e mascote (20 espécies).
- **Perfil:** nome, título, clube, aniversário, idade e biografia. Mostra o perfil completo e permite **exportar e importar personagens por código**, inclusive **códigos de exportação do Gacha Club** (importa nome, perfil e cores; as peças são aproximadas).
- **Ajustar:** move, muda a escala e gira qualquer peça da cabeça ou das roupas.
- **Cor livre** em cada peça (principal, secundária e contorno), com paleta, cores recentes e código hex.
- Botões para desfazer (Ctrl+Z), gerar visual aleatório, zoom e salvar em PNG.

**Estúdio de cenas**
- Coloque os 10 personagens na cena. A bolinha verde na lista mostra quem está nela.
- Arraste, vire, mude o tamanho (também com pinça ou roda do mouse) e mude a ordem das camadas.
- Pose e expressão podem ser trocadas direto na cena.
- Balões de fala com nome sobre a cabeça, e os mascotes também falam.
- 20 mascotes e 30 objetos por cena (32 tipos de objeto com cores editáveis).
- Narrador estilo visual novel: escolha quem narra, quando aparece (sempre ou só visualizando), posição, tamanho, fonte e cores.
- Fundos e sobreposições, modo visualizar, salvar/carregar 15 cenas e exportar PNG.
- Atalho "Editar" leva direto à aba certa do editor e volta para o Estúdio.
- Teclado: setas movem, +/− mudam o tamanho, F vira, Del remove.

**Opções:** som, qualidade das animações, tutorial, créditos, backup do progresso (código ou arquivo) e apagar dados.

**Responsivo:** no desktop e em paisagem segue o layout de referência; no celular os blocos ficam empilhados.

## Estrutura

| Pasta/arquivo | Conteúdo |
|---|---|
| `js/core/` | `core.js` (utilitários, cores, som, janelas) e `store.js` (salvamento e cópias) |
| `js/rig/` | Personagem articulado: `rig.js` monta as camadas; `parts-*.js` são as peças, mascotes e objetos de cena em SVG |
| `js/data/` | `poses.js`, `defaults.js` (slots, personagens, predefinidos, expressões) e `backgrounds.js` |
| `js/ui/` | Menu, editor, painéis, Estúdio, seletor de cor e janelas |
| `sw.js`, `manifest.webmanifest` | Instalação e modo offline |

### Adicionando uma peça

Cada lista em `PARTS` é um array cujo índice 0 significa "nenhum". Para criar uma peça nova, acrescente um objeto `{ n: 'Nome', d: k => '<svg...>' }` em `js/rig/parts-*.js`:

- Use `k.c[0]`, `k.c[1]` e `k.c[2]` para as cores principal, secundária e de contorno.
- Use `k.F` para o preenchimento com degradê (cabelo e pupila).
- Peças da cabeça e do tronco são desenhadas no espaço do personagem (viewBox 300×420, cabeça centrada em 150,128).
- Peças de braço e perna são desenhadas no espaço local do membro: a junta fica em (0,0) e o membro aponta para baixo.

### Adicionando uma pose

Acrescente em `POSES` (`js/data/poses.js`) os ângulos de ombro/cotovelo e quadril/joelho, usando positivo para fora do corpo.

Ao publicar uma versão nova, aumente `CACHE` em `sw.js`.
