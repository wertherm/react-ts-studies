# React TS Studies

Projeto de estudos em React com TypeScript.

## Como foi configurado

O projeto foi criado com [Vite](https://vitejs.dev/) + React + TypeScript de forma manual, sem usar o `create-vite`. Isso deixa a estrutura enxuta e fácil de entender.

### Arquivos de configuração

- **`package.json`**: declara as dependências `react` e `react-dom`, e as devDependencies `@vitejs/plugin-react`, `vite`, `typescript` e os tipos do React.
- **`vite.config.ts`**: configura o plugin oficial do React para o Vite.
- **`tsconfig.json`**: configura o compilador TypeScript para trabalhar com JSX, módulos ESNext e resolução de imports compatível com bundlers.
- **`index.html`**: ponto de entrada do Vite. Referencia o script `/src/main.tsx`.
- **`src/vite-env.d.ts`**: tipos do ambiente Vite.

### Estrutura de arquivos

```
react-ts-studies/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── src/
│   ├── main.tsx      # monta o React na div #root
│   ├── App.tsx       # componente raiz da aplicação
│   └── vite-env.d.ts
└── react/
    └── estado-derivado/
        └── exercicio_estado-derivado.tsx
```

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

3. Abra o endereço exibido no terminal (geralmente `http://localhost:5173`) no navegador.

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento com hot reload.
- `npm run build`: compila o TypeScript e gera a versão de produção em `dist/`.
- `npm run preview`: serve a build de produção localmente.

## Trocando o exercício exibido

O `App.tsx` importa o componente do exercício atual. Para visualizar outro arquivo, altere a importação em `src/App.tsx`:

```tsx
import { GridOperacoes } from '../react/estado-derivado/exercicio_estado-derivado.tsx'
```
