npm run start:dev
docker compose up

npx prisma migrate dev --name init
npx prisma migrate reset
