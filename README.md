# Academia Frontend

Plataforma web de gerenciamento de academia com suporte a treinos, anotações, pagamentos e painel administrativo.

## 📋 Sobre o Projeto

**Academia Frontend** é uma aplicação moderna construída com **Vue 3** e **TypeScript** que oferece uma experiência completa de gerenciamento de academia. O sistema inclui autenticação, gestão de planos de pagamento com integração MercadoPago, criação e acompanhamento de treinos, anotações, e um painel administrativo.

### Principais Funcionalidades

- ✅ **Autenticação e Perfil**: Login, cadastro e gerenciamento de perfil de usuário
- 📅 **Treinos**: Criação, edição, visualização e acompanhamento de treinos
- 📝 **Anotações**: Sistema de notas para rastreamento de progresso
- 💪 **Exercícios**: Biblioteca de exercícios com detalhes
- 💳 **Planos e Pagamento**: Integração com MercadoPago para gerenciamento de planos
- 📊 **Dashboard**: Visão geral de informações do usuário
- 👨‍💼 **Painel Admin**: Interface para administradores gerenciarem conteúdo
- 🔔 **Real-time Updates**: Notificações em tempo real via WebSocket (Pusher/Laravel Echo)

## 🛠 Stack Tecnológico

- **Vue 3** - Framework frontend progressivo
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápido e moderno
- **Vue Router** - Roteamento de aplicação
- **Pinia** - Gerenciamento de estado (com persistência)
- **Axios** - Cliente HTTP
- **Laravel Echo + Pusher** - WebSocket para atualizações em tempo real
- **Vue Toastification** - Notificações toast
- **MercadoPago** - Integração de pagamentos

## 🚀 Começando Rápido

### Pré-requisitos

- Node.js `^20.19.0` ou `>=22.12.0`
- npm ou yarn

### Instalação

```sh
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

### Desenvolvimento

```sh
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```sh
npm run build
```

### Preview da Build

```sh
npm run preview
```

### Type Check

```sh
npm run type-check
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes Vue reutilizáveis
│   ├── Navbar.vue
│   ├── ModalConfirmarExclusao.vue
│   ├── ModalCriarTreino.vue
│   ├── ModalDetalheTreino.vue
│   ├── ModalEditarTreino.vue
│   ├── ModalPlanos.vue
│   ├── NoteCard.vue
│   ├── NoteModal.vue
│   ├── LoadingOverlay.vue
│   └── PricingCard.vue
├── views/               # Páginas principais da aplicação
│   ├── Dashboard.vue
│   ├── Login.vue
│   ├── Cadastro.vue
│   ├── Planos.vue
│   ├── Pagamento.vue
│   ├── Treino.vue
│   ├── Exercicios.vue
│   ├── Anotacoes.vue
│   ├── Perfil.vue
│   ├── HistoricoPagamento.vue
│   ├── PainelAdmin.vue
│   └── NotFound.vue
├── router/             # Configuração de rotas
│   └── Index.ts
├── stores/             # Gerenciamento de estado Pinia
│   └── auth.js
├── controller/         # Serviços e chamadas de API
│   └── api.ts
├── lib/                # Utilities e bibliotecas
│   ├── echo.ts        # Configuração websocket
│   └── pagination.ts
├── types/              # Definições TypeScript
│   ├── mercadopago.d.ts
│   └── note.js
├── assets/             # Arquivos estáticos
│   └── styles/
│       ├── index.css
│       ├── reset.css
│       ├── responsive.css
│       └── variables.css
└── env.d.ts            # Definições de tipos de ambiente
```

## 🔐 Autenticação e Autorização

O projeto utiliza autenticação via **JWT (Bearer Token)**:

- Tokens são armazenados em `localStorage`
- Interceptadores Axios adicionam automaticamente o token em requisições
- Redirecionamento automático para login em caso de erro 401
- Sistema de níveis de acesso (`requiredLevel`) com padrão:
  - **Nível 0**: Acesso público
  - **Nível 1**: Acesso a treinos, exercícios e anotações
  - **Admin**: Acesso ao painel administrativo

### Rotas Protegidas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Dashboard |
| `/login` | Público | Login |
| `/cadastro` | Público | Registro |
| `/planos` | Público | Planos disponíveis |
| `/pagamento` | Autenticado | Processamento de pagamento |
| `/treinos` | Nível 1 | Gerenciamento de treinos |
| `/exercicios` | Nível 1 | Biblioteca de exercícios |
| `/notas` | Nível 1 | Anotações do usuário |
| `/perfil` | Autenticado | Perfil do usuário |
| `/historico` | Autenticado | Histórico de pagamentos |
| `/admin` | Admin | Painel administrativo |

## 🔄 Comunicação em Tempo Real

O sistema utiliza **Laravel Echo** com **Pusher** para atualizações em tempo real:

```typescript
// Canal de planos
echo.channel('plano')
  .listen('.plano.atualizado', (e) => {
    // Atualiza nível do usuário e redireciona se necessário
  });
```

## 💬 Notificações

Notificações toast automáticas via **Vue Toastification**:
- Posição: Superior direito
- Timeout padrão: 3 segundos

## 🎨 Configuração IDE

### VS Code (Recomendado)

1. Instale a extensão [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
2. Desabilite a extensão Vetur se instalada
3. Instale [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para melhor suporte

### DevTools para Browser

#### Chrome/Edge/Brave
- [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Ative "Custom Object Formatter" nas configurações

#### Firefox
- [Vue.js DevTools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- Ative "Custom Object Formatter" nas configurações

## 📚 Recursos Úteis

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)

## 📝 Configurações

Veja o arquivo [vite.config.ts](./vite.config.ts) para configurações específicas de build e desenvolvimento.

## ⚙️ Requisitos de Node

- Node.js: `^20.19.0` ou `>=22.12.0`
- npm: Versão recomendada 8 ou superior

## 📄 Licença

Este projeto é privado e pertence ao seu proprietário.
