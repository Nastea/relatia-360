# 🚀 Ghid de Deployment - Relația 360

Acest ghid te ajută să încarci proiectul online pe Vercel (recomandat pentru Next.js).

## 📋 Pași pentru Deployment

### 1. Pregătirea Codului

Asigură-te că ai făcut toate modificările și că totul funcționează local:

```bash
cd /Users/anastasiaionas/Apps/psyche-course/app
pnpm run build
```

Dacă build-ul reușește, poți continua.

### 2. Inițializare Git (dacă nu e deja făcut)

```bash
cd /Users/anastasiaionas/Apps/psyche-course/app
git add .
git commit -m "Initial commit - Relatia 360 landing page"
```

### 3. Creare Repository pe GitHub

1. Mergi pe [github.com](https://github.com) și creează un repository nou
2. Numează-l (ex: `relatia-360` sau `psyche-course`)
3. **NU** adăuga README, .gitignore sau licență (le avem deja)
4. Copiază URL-ul repository-ului

### 4. Conectare cu GitHub

```bash
git remote add origin https://github.com/TU_USERNAME/TU_REPO.git
git branch -M main
git push -u origin main
```

### 5. Deployment pe Vercel

#### Opțiunea 1: Via Vercel Dashboard (Recomandat)

1. Mergi pe [vercel.com](https://vercel.com) și loghează-te (sau creează cont)
2. Click pe **"Add New Project"**
3. Importă repository-ul tău de pe GitHub
4. Vercel va detecta automat că e un proiect Next.js
5. **Settings importante:**
   - **Framework Preset:** Next.js (auto-detectat)
   - **Root Directory:** `app` (dacă repository-ul e în root, lasă gol)
   - **Build Command:** `pnpm run build` (sau `npm run build`)
   - **Output Directory:** `.next` (auto)
   - **Install Command:** `pnpm install` (sau `npm install`)

6. Click **"Deploy"**

#### Opțiunea 2: Via Vercel CLI

```bash
# Instalează Vercel CLI global
npm i -g vercel

# În folderul proiectului
cd /Users/anastasiaionas/Apps/psyche-course/app
vercel

# Urmează instrucțiunile:
# - Login cu contul tău Vercel
# - Link cu proiect existent sau creează unul nou
# - Confirmă setările
```

### 6. Variabile de Mediu (dacă sunt necesare)

Dacă proiectul folosește variabile de mediu (ex: API keys, database URLs):

1. Mergi la proiectul tău pe Vercel
2. **Settings** → **Environment Variables**
3. Adaugă variabilele necesare:
   - **Key:** numele variabilei (ex: `OPENAI_API_KEY`)
   - **Value:** valoarea
   - **Environment:** Production, Preview, Development (sau doar Production)
4. Click **"Save"**
5. **Redeploy** proiectul pentru a aplica schimbările

### 7. Verificare după Deployment

După ce deployment-ul e gata:

1. ✅ Verifică că site-ul se încarcă
2. ✅ Testează pagina principală: `/relatia-360`
3. ✅ Verifică pe mobile că hero-ul arată corect
4. ✅ Testează toate link-urile și butoanele
5. ✅ Verifică că imaginile se încarcă corect

### 8. Domeniu Custom (Opțional)

Dacă vrei să folosești un domeniu propriu:

1. Mergi la proiectul tău pe Vercel
2. **Settings** → **Domains**
3. Adaugă domeniul tău
4. Urmează instrucțiunile pentru configurarea DNS

## 🔧 Troubleshooting

### Build Fails

- Verifică că toate dependențele sunt în `package.json`
- Verifică că nu există erori TypeScript: `pnpm run build`
- Verifică log-urile de build pe Vercel

### Images Not Loading

- Asigură-te că toate imaginile sunt în `/public/images/`
- Verifică că path-urile sunt corecte (ex: `/images/hero.jpg`)

### Styling Issues

- Verifică că Tailwind CSS este configurat corect
- Verifică că `globals.css` este importat în `layout.tsx`

## 📝 Note Importante

- **NU** comite fișiere `.env` în git (sunt deja în `.gitignore`)
- **DOAR** adaugă variabilele de mediu în Vercel Dashboard
- După fiecare modificare, push pe GitHub și Vercel va redeploy automat
- Vercel oferă preview deployments pentru fiecare pull request

## 🔧 Variabile de Mediu (dacă sunt necesare)

Dacă proiectul folosește servicii externe, adaugă următoarele variabile în Vercel:

- `OPENAI_API_KEY` - pentru funcționalitățile de chat/AI
- `PINECONE_API_KEY` - pentru vector database (dacă folosești)
- `PINECONE_INDEX` - numele index-ului Pinecone
- `PINECONE_NAMESPACE` - namespace-ul (opțional, default: "prod")
- `DATABASE_URL` - pentru Prisma (dacă folosești database)

**Notă:** Pentru pagina `/relatia-360`, nu sunt necesare variabile de mediu - funcționează standalone!

## ✅ Verificare Build

Build-ul a fost testat și funcționează corect:
```bash
✓ Compiled successfully
✓ All pages generated
✓ Build completed
```

## 🎉 Gata!

După ce ai urmat pașii de mai sus, site-ul tău va fi live pe un URL de tipul:
`https://your-project.vercel.app`

**Pagina principală de curs:**
`https://your-project.vercel.app/relatia-360`

**Alte pagini disponibile:**
- `/` - Homepage
- `/chat` - Chat interface (dacă ai configurat API keys)
- `/lesson/[id]` - Lecții individuale

