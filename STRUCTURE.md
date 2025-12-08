# Structure du projet — MentorAI

```
MentorAI/
├── MentorAI.code-workspace           # Configuration VS Code pour le workspace
├── package.json                      # Dépendances & scripts (workspace client)
├── README.md                         # Documentation principale
├── STRUCTURE.md                      # (Ce fichier) arborescence du projet
├── server.ts                         # Point d'entrée pour le développement (tsx)
├── tsconfig.json                     # Configuration TypeScript
├── certs/                            # Certificats SSL (dev)
├── client/                           # Frontend (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── index.css
│       ├── main.jsx                  # Entrée React
│       ├── components/               # Composants UI
│       │   ├── ChatWindow.jsx
│       │   ├── Header.jsx
│       │   ├── HelperBar.jsx
│       │   ├── InputBar.jsx
│       │   ├── Login.jsx
│       │   ├── MessageBubble.jsx
│       │   ├── PrivateRoute.jsx
│       │   ├── QuickActions.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── TabBar.jsx
│       │   ├── TypingBubble.jsx
│       │   └── admin/
│       │       ├── AdminFreeModeSection.jsx
│       │       ├── AdminHeader.jsx
│       │       ├── AdminPromptsSection.jsx
│       │       ├── AdminSection.jsx
│       │       ├── AdminStatus.jsx
│       │       ├── ConfigForm.jsx
│       │       ├── ProgramEditor.jsx
│       │       ├── ProgramsList.jsx
│       │       ├── PromptEditor.jsx
│       │       └── PromptsList.jsx
│       ├── hooks/                    # Hooks React personnalisés
│       │   ├── useAdminAuth.js
│       │   ├── useAdminConfig.js
│       │   ├── useAdminSettings.js
│       │   ├── useBackendHealth.js
│       │   ├── useChatSession.js
│       │   ├── useModules.js
│       │   ├── useProgramEditor.js
│       │   ├── usePrograms.js
│       │   ├── usePromptEditor.js
│       │   └── usePrompts.js
│       ├── pages/
│       │   ├── App.jsx               # Router principal
│       │   ├── MentorChatApp.jsx      # Application chat principale
│       │   └── admin/
│       │       ├── AdminHome.jsx
│       │       ├── AdminProgramsSection.jsx
│       │       └── AdminPromptsSection.jsx
│       └── utils/
│           ├── api.js                # Appels API vers le backend
│           ├── messageFormatter.js   # Formatage des messages
│           └── storage.js            # LocalStorage / session

└── src/                              # Backend (TypeScript / Express)
    ├── app.ts                        # Configure l'app Express (DB, prompts, routes)
    ├── server.ts (à la racine)       # Script d'exécution en dev (tsx)
    ├── db/
    │   ├── config.ts                 # Récupération / gestion config en DB
    │   ├── db.ts                     # Initialisation et client MongoDB
    │   ├── programs.ts               # Gestion des programmes d'apprentissage
    │   ├── prompts.ts                # Accès et rendu des prompts stockés
    │   ├── summaries.ts              # Création / récupération des résumés étudiants
    │   └── usage.ts                  # Suivi des quotas / usage mensuel
    ├── middleware/
    │   ├── adminMiddleware.ts        # Vérification rôle admin
    │   └── authMiddleware.ts         # Vérification JWT + enrichissement req
    ├── routes/
    │   ├── auth.ts                   # Endpoints d'authentification
    │   ├── chat.ts                   # Endpoint `POST /chat` pour le mentor IA
    │   ├── health.ts                 # Endpoint de santé / quotas
    │   ├── index.ts                  # Assembleur des routes API
    │   ├── init.ts                   # Initialisation / session
    │   └── program.ts                # Endpoints liés aux programmes
    │   └── admin/
    │       ├── config.ts             # Routes admin config
    │       ├── programs.ts           # Routes admin programmes (CRUD)
    │       └── prompts.ts            # Routes admin prompts (CRUD)
    └── utils/
        ├── configs.ts                # Helpers pour config
        ├── env.ts                    # Gestion variables d'environnement
        ├── logger.ts                 # Logger (info / error)
        ├── programs.ts               # Utilitaires programmes
        ├── prompts.ts                # Rendu de templates de prompts
        └── shutdown.ts               # Arrêt propre de l'application

.env (non versionné)                   # Variables d'environnement attendues
```

Notes rapides :
- Le backend utilise le SDK `openai` pour générer réponses et résumés basés sur des prompts stockés en DB.
- L'authentification repose sur des JWT ; middlewares `authMiddleware.ts` et `adminMiddleware.ts` appliquent la sécurité.
- Frontend et backend sont gérés comme un monorepo Node (workspace `client`).
- Scripts utiles (racine) : `npm run dev` (backend), `npm run dev:client` (frontend), `npm run build`.