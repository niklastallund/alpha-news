# ================================
# 🧩 NEWS PROJECT - DATABASE SETUP
# ================================

# --------------------------------
# 1️⃣ Klona projektet och byt branch
# --------------------------------
git checkout dev
git pull

# --------------------------------
# 2️⃣ Installera dependencies
# --------------------------------
npm install

# --------------------------------
# 3️⃣ Starta PostgreSQL
# --------------------------------
# 🔹 Alternativ A – Docker (rekommenderas)
# Ersätt lösenordet (123456) om du vill ha eget.
# Postgres körs lokalt på port 5432.
docker run -d --name pg-news \
  -e POSTGRES_PASSWORD=123456 \        # <-- ändra till eget lösenord
  -e POSTGRES_USER=postgres \          # <-- ändra till eget användarnamn om du vill
  -e POSTGRES_DB=alfanewsdb \          # <-- ändra till eget DB-namn om du vill
  -p 5432:5432 postgres:15

# 🔹 Alternativ B – Lokalt installerad Postgres
# Skapa en databas manuellt (byt user och lösen vid behov)
createdb -h localhost -U postgres alfanewsdb

# --------------------------------
# 4️⃣ Skapa .env-fil i projektroten
# --------------------------------
# Skapa en ny fil som heter .env i rotmappen (bredvid package.json)
# Lägg in följande innehåll och ändra user/password/db om du inte kör Docker-exemplet ovan.
cat << 'EOF' > .env
# === DATABASE (ändra user, password, db om du inte kör Docker med standardvärden) ===
DATABASE_URL="postgresql://postgres:123456@localhost:5432/alfanewsdb?schema=public"

# === AUTH (unika för varje utvecklare) ===
BETTER_AUTH_SECRET="byt-ut-till-en-lång-slumpad-nyckel" 
BETTER_AUTH_URL="http://localhost:3000"

# === STRIPE (valfritt om betalningar ska aktiveras) ===
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
EOF

# Tips: Generera en slumpad nyckel för BETTER_AUTH_SECRET
# (kopiera resultatet och ersätt värdet ovan)
node -e "console.log(crypto.randomBytes(32).toString('hex'))"

# --------------------------------
# 5️⃣ Kör Prisma migrationer
# --------------------------------
npx prisma migrate dev

# --------------------------------
# 6️⃣ Kör seed (lägger in startdata)
# --------------------------------
# Detta skapar roller, admin-user, kategorier och prenumerationstyper
npx prisma db seed

# --------------------------------
# 7️⃣ Verifiera i Prisma Studio
# --------------------------------
# Kolla att tabellerna har data (User, Role, Category, SubscriptionType)
npx prisma studio

# --------------------------------
# 8️⃣ Starta projektet
# --------------------------------
npm run dev
# Öppna http://localhost:3000

# --------------------------------
# ✅ Sammanfattning
# --------------------------------
# 1. git checkout dev && git pull
# 2. npm install
# 3. Starta Postgres (Docker eller lokalt)
# 4. Skapa .env enligt exemplet
# 5. npx prisma migrate dev
# 6. npx prisma db seed
# 7. npm run dev

# Efter detta är databasen och projektet redo.
# Alla i teamet får samma setup, seed-data och fungerande lokalt schema.