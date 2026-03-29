# Guide de Déploiement - High Tech Training Center El Jadida

## 🚀 Option 1: Vercel (Recommandé)

### Étapes:

1. **Créer un compte sur [vercel.com](https://vercel.com)**

2. **Pousser le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/high-tech-training.git
   git push -u origin main
   ```

3. **Connecter à Vercel**
   - Aller sur vercel.com
   - Cliquer "Add New Project"
   - Sélectionner votre repo GitHub
   - Configurer:
     - Framework: Next.js
     - Build Command: `bun run build`
     - Output Directory: `.next`
   - Cliquer "Deploy"

4. **Variables d'environnement** (dans Vercel Dashboard)
   - `DATABASE_URL` = chemin vers la base SQLite

---

## 🖥️ Option 2: Serveur VPS (Vultr, DigitalOcean, OVH)

### 1. Prérequis serveur
```bash
# Sur le serveur (Ubuntu/Debian)
sudo apt update
sudo apt install -y curl

# Installer Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Installer Node.js (pour certains outils)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

### 2. Transférer le projet
```bash
# Depuis votre PC local
scp -r /chemin/vers/projet user@votre-serveur:/var/www/
```

### 3. Configurer sur le serveur
```bash
cd /var/www/projet

# Installer les dépendances
bun install

# Build production
bun run build

# Lancer avec PM2
pm2 start "bun run start" --name "high-tech-training"
pm2 save
pm2 startup
```

### 4. Configurer Nginx (Reverse Proxy)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/high-tech-training
```

Contenu du fichier:
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/high-tech-training /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL avec Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

---

## 🐳 Option 3: Docker

### Dockerfile
```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

### Déployer
```bash
docker-compose up -d
```

---

## 📱 Option 4: Railway (Simple)

1. Aller sur [railway.app](https://railway.app)
2. Connecter votre GitHub
3. Sélectionner le repo
4. Railway détecte automatiquement Next.js
5. Déployer !

---

## ⚠️ Important: Base de données

Pour SQLite en production, utilisez un volume persistant ou migrez vers:
- **PostgreSQL** (recommandé pour production)
- **MySQL**
- **Planetscale** (MySQL serverless)

### Migration vers PostgreSQL

1. Modifier `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Installer le client:
```bash
bun add pg
```

3. Configurer `DATABASE_URL`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/hightech"
```

---

## ✅ Checklist avant déploiement

- [ ] Changer les mots de passe par défaut
- [ ] Configurer les variables d'environnement
- [ ] Activer HTTPS
- [ ] Configurer les sauvegardes de la base de données
- [ ] Tester sur un environnement de staging
