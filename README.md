<div align="center">
<br />
    <a href="https://youtu.be/zA9r5zTllx4" target="_blank">
      <img src="https://github.com/user-attachments/assets/ab600f24-f4d9-4cef-8f1e-3fd9194afb30" alt="Project Banner">
    </a>
  <br />
</div>

# AWWARDS

Site experimental com animações scroll-triggered, transições geométricas via clip-path e narrativa em vídeo. O foco do projeto é exercitar UI/UX moderno — interações suaves, hover 3D e responsividade — usando React, GSAP e Tailwind CSS.

<div>
  <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
  <img src="https://img.shields.io/badge/-GSAP-black?style=for-the-badge&logoColor=white&logo=greensock&color=88CE02" alt="gsap" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
</div>

## Stack

- **React 19** — componentes, hooks, estado
- **GSAP + ScrollTrigger** — animações com scroll, timelines, easing customizado
- **Tailwind CSS v4** — utility-first, utilities customizadas via `@utility`
- **Vite** — bundler e dev server

## O que tem aqui

- **Animações por scroll** — seções que reagem à rolagem usando GSAP/ScrollTrigger.
- **Transições com clip-path** — formas geométricas que se transformam entre estados.
- **Hover 3D** — cards bento com tilt em perspectiva, calculado a partir da posição do cursor.
- **Vídeo como elemento de narrativa** — transições suaves entre clipes no hero e nos bento cards.
- **Layout responsivo** — grid bento adapta de coluna única (mobile) para 2 colunas / 3 linhas (desktop).
- **Loader animado** — spinner próprio enquanto os vídeos pré-carregam.

## Estrutura

```
src/
├── components/
│   ├── NavBar.jsx          # nav flutuante com animação de aparição
│   ├── Hero.jsx            # seção principal com vídeo + GSAP
│   ├── About.jsx           # AnimatedTitle + clip-path scroll
│   ├── AnimatedTitle.jsx   # título com palavras animadas individualmente
│   ├── Features.jsx        # bento grid (BentoTilt + BentoCard)
│   └── Button.jsx
├── tailwind.css            # entry — registra @utility customizadas
├── index.css               # @layer base + utilities + keyframes
└── main.jsx
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:5173](http://localhost:5173).

Para build de produção:

```bash
npm run build
npm run preview
```
