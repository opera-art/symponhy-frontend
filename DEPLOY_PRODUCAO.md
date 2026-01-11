# 🚀 Guia de Deployment em Produção - Symphony

Complete guide para colocar seu sistema em produção com domínio real.

---

## 📋 **O Que Você Precisa:**

1. **Domínio** (exemplo.com)
2. **Servidor** para Backend (Node.js)
3. **Servidor** para Frontend (Next.js)
4. **SSL/HTTPS** (certificado gratuito)

---

## 🎯 **Opções Recomendadas:**

### **Frontend (Next.js)** - Mais Fácil

**Opção 1: Vercel** ⭐ (RECOMENDADO)
- Deploy automático do GitHub
- Domínio customizado incluído
- SSL automático
- Grátis até 100GB/mês
- Basta conectar seu repo Git

**Opção 2: Netlify**
- Similar ao Vercel
- Excelente para Next.js

**Opção 3: AWS Amplify**
- Mais controle
- Paga conforme usa

---

### **Backend (Node.js)**

**Opção 1: Railway** ⭐ (RECOMENDADO)
- Deploy automático
- PostgreSQL incluído
- $5/mês grátis
- Simples demais

**Opção 2: Render**
- Parecido com Railway
- Grátis para testes

**Opção 3: Heroku**
- Pago ($7/mês mínimo)
- Mais maduro

**Opção 4: DigitalOcean**
- VPS própria ($5/mês)
- Mais controle

---

## 🏗️ **Arquitetura Recomendada:**

```
Seu Domínio: exemplo.com
│
├─ Frontend: https://exemplo.com
│  └─ Vercel (deploy automático)
│
└─ Backend: https://api.exemplo.com
   └─ Railway (deploy automático)

Banco de Dados: Supabase (já está lá!)
```

---

## 📝 **Passo a Passo - SUPER SIMPLES**

### **1. Deploy do Frontend (5 minutos)**

#### Usando Vercel:

1. **Criar conta**: https://vercel.com
2. **Conectar GitHub**:
   - Push seu código para GitHub
   - Vercel reconhece automaticamente `next.dev`
3. **Configurar variáveis**:
   ```
   NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
   ```
4. **Deploy automático**: Pronto! Qualquer push faz deploy

#### Conectar Domínio:
```
1. Vercel → Settings → Domains
2. Adicionar seu domínio
3. Apontar DNS no registrador do domínio
4. Pronto!
```

---

### **2. Deploy do Backend (5 minutos)**

#### Usando Railway:

1. **Criar conta**: https://railway.app
2. **Conectar GitHub**:
   - New Project → Import from GitHub
   - Selecionar repo symponhy-backend
3. **Configurar variáveis** (Railway → Variables):
   ```
   NODE_ENV=production
   PORT=3001
   API_URL=https://api.seu-dominio.com
   FRONTEND_URL=https://seu-dominio.com
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   JWT_SECRET=...
   ```
4. **Deploy**: Automático quando você faz push!

#### Conectar Domínio:
```
1. Railway → Project → Settings → Domains
2. Gerar domínio Railway ou adicionar customizado
3. Apontar DNS
4. Pronto!
```

---

## 🌐 **Configurar DNS (Registrador de Domínio)**

Depois de comprar domínio em Godaddy, Namecheap, etc:

```
Registros DNS a adicionar:

1. Para Frontend (Vercel):
   www.seu-dominio.com  →  CNAME  →  cname.vercel-dns.com
   seu-dominio.com      →  ALIAS →  seu-dominio.com.vercel-dns.com

2. Para Backend (Railway):
   api.seu-dominio.com  →  CNAME  →  seu-app.railway.app
```

---

## ✅ **Checklist de Configuração**

### **Antes de Deploy**

- [ ] Código no GitHub (público ou privado)
- [ ] `.env` com variáveis de produção
- [ ] Domínio comprado
- [ ] Contas criadas (Vercel + Railway)
- [ ] Supabase apontando para novo domínio

### **Durante Deploy**

- [ ] Frontend deployado na Vercel
- [ ] Backend deployado na Railway
- [ ] DNS apontando para os servidores
- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS/SSL automático

### **Após Deploy**

- [ ] Testar login em https://seu-dominio.com/login
- [ ] Verificar requisições do backend
- [ ] Configurar monitoramento
- [ ] Setup de backups automáticos

---

## 🔒 **Certificado SSL (Automático!)**

Boas notícias: **Vercel e Railway dão SSL grátis automaticamente!**

```
❌ Antes: http://localhost:3000
✅ Depois: https://seu-dominio.com
```

---

## 💰 **Custo Mensal Estimado:**

```
Frontend (Vercel):      GRÁTIS (até 100GB)
Backend (Railway):      $5/mês (inclui PostgreSQL)
Domínio:                $10-15/ano
Supabase:               GRÁTIS (até 500MB)
────────────────────────────────
TOTAL:                  ~$5/mês (domínio não-recorrente)
```

---

## 🚦 **Fluxo de Deploy Automático:**

```
1. Você faz commit no GitHub
   ↓
2. Vercel detecta mudança → Faz build → Deploy (2-3 min)
   ↓
3. Railway detecta mudança → Faz build → Deploy (2-3 min)
   ↓
4. Seu site em produção está atualizado!
```

---

## 📊 **Comparação Localhost vs Produção:**

| Aspecto | Localhost | Produção |
|---------|-----------|----------|
| URL | localhost:3000 | seu-dominio.com |
| Backend | localhost:3001 | api.seu-dominio.com |
| SSL | ❌ HTTP | ✅ HTTPS |
| Porta | ❌ Precisa lembrar | ✅ Padrão (443) |
| Deploy | Manual | Automático |
| Uptime | 0% (seu PC) | 99.9% |
| Performance | Local | CDN Global |
| Custo | R$0 | ~R$25/mês |

---

## 🎬 **Passo a Passo Rápido (15 minutos total)**

### **Vercel**
```bash
1. npm install -g vercel
2. vercel login
3. vercel --prod
4. Pronto! Deploy feito
```

### **Railway**
```bash
1. railway login
2. railway init
3. railway deploy
4. Pronto! Backend no ar
```

---

## 🔗 **Atualizar URLs em Produção**

### **Frontend (.env.production)**
```
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
```

### **Backend (.env em Railway)**
```
FRONTEND_URL=https://seu-dominio.com
API_URL=https://api.seu-dominio.com
```

---

## 🌟 **Vantagens de Produção:**

✅ Acesso de qualquer lugar (não só localhost)
✅ Domínio profissional (melhora credibilidade)
✅ HTTPS automático (mais seguro)
✅ Deploy automático (atualiza ao fazer push)
✅ Uptime 99.9% (sempre online)
✅ CDN global (rápido em qualquer lugar)
✅ Monitoramento e logs automáticos
✅ Backups automáticos

---

## 🆘 **Troubleshooting**

**"CORS error em produção"**
→ Verificar `FRONTEND_URL` e `API_URL` no backend

**"Domínio não conecta"**
→ Esperar 24h para DNS propagar

**"Build falha no deploy"**
→ Verificar logs no Vercel/Railway

**"Variáveis de ambiente não carregam"**
→ Adicionar em Vercel → Settings → Environment Variables

---

## 📞 **Links Úteis**

- Vercel: https://vercel.com/docs
- Railway: https://railway.app/docs
- Supabase: https://supabase.com/docs
- Domínios: Namecheap, Godaddy, Porkbun

---

## ⏭️ **Próximas Etapas (Você Escolhe)**

1. **Fácil**: Usar Vercel + Railway (recomendado)
2. **Meio**: Usar DigitalOcean droplet
3. **Difícil**: Configurar servidor próprio

---

**Qual você quer fazer? Posso te ajudar em qualquer um!** 🚀

---

Data: 2026-01-11
Versão: 1.0.0
Status: Pronto para Produção
