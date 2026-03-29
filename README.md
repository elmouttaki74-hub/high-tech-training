# High Tech Training Center El Jadida

Système de gestion complet pour centre de formation.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)

## 🚀 Fonctionnalités

- 📊 **Tableau de bord** - Vue d'ensemble des statistiques
- 👨‍🎓 **Gestion des apprenants** - Inscription, suivi, profils
- 👨‍🏫 **Gestion des formateurs** - Planning, disponibilités
- 📚 **Gestion des formations** - Cours, niveaux, langues
- 📅 **Planning** - Emploi du temps, salles
- 💰 **Paiements** - Facturation, suivi (en DH)
- 📋 **Présences** - Pointage, statistiques
- 🏆 **Certificats** - Génération, suivi

## 🛠️ Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **UI**: shadcn/ui, Lucide Icons
- **Base de données**: SQLite (Prisma ORM)
- **Auth**: NextAuth.js (prêt pour activation)

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/VOTRE-USERNAME/high-tech-training.git
cd high-tech-training

# Installer les dépendances
bun install

# Configurer la base de données
bun run db:push
bun run db:seed

# Lancer en développement
bun run dev
```

## 🔐 Identifiants par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | admin@hightech-eljadida.ma | Admin123! |
| Secrétaire | secretaire@hightech-eljadida.ma | Secret123! |
| Formateur | formateur@hightech-eljadida.ma | Formateur123! |

> ⚠️ **Important**: Changez ces mots de passe en production !

## 🌐 Déploiement

### Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE-USERNAME/high-tech-training)

1. Fork ce repository
2. Aller sur [vercel.com](https://vercel.com)
3. Importer le repository
4. Déployer !

### Docker

```bash
docker-compose up -d
```

## 📁 Structure

```
high-tech-training/
├── prisma/           # Schéma base de données
├── public/           # Assets statiques
├── src/
│   ├── app/          # Pages Next.js
│   ├── components/   # Composants React
│   └── lib/          # Utilitaires
├── Dockerfile
└── docker-compose.yml
```

## 🇲🇦 À propos

Application développée pour **High Tech Training Center El Jadida**, centre de formation professionnelle à El Jadida, Maroc.

## 📄 Licence

MIT License
