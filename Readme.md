# Bordeaux Mapping Entreprises

## 📋 Description

**Bordeaux Mapping Entreprises** est une application web interactive qui cartographie et répertorie les entreprises technologiques de la région bordelaise. Elle permet de visualiser leur emplacement, les technologies qu'elles utilisent et les types de postes qu'elles proposent.



## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Environnement d'exécution
- **Express** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Zod** - Validation de schéma
- **Swagger** - Documentation des routes de l'api

## 📁 Structure du projet

```
├── src/
│   ├── db.ts           # Configuration de la base de données
│   ├── data/
│   │   └── script.sql  # Script de création des tables de la base de données
│   ├── types/
│   │   └──index.ts     # Configuration des objets
│   ├── index.ts        # Point d'entrée du serveur
│   ├── routes/         # Routes API
│   │   └── companies.ts # Routes pour les entreprises
│   └── swagger.ts      # Fichier de configuration du swagger        
├── package.json            # Dépendances et scripts
└── README.md               # Documentation
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js (v16+)
- PostgreSQL

### Installation

1. Cloner le dépôt
```bash
git clone https://github.com/BidaudA/mapping_entreprises_back.git
cd mapping_entreprises_back
```

2. Installer les dépendances
```bash
npm install
npm run build
```

3. Configurer les variables d'environnement

Pour le backend, créez un fichier `.env` dans le dossier `backend`:
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/mapping_entreprises
```

4. Démarrer l'application en mode développement
```bash
# Backend (dans un autre terminal)
npm start
```
