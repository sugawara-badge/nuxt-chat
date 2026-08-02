npm run start:dev
docker compose up

npx prisma migrate dev --name init
npx prisma migrate reset

1. authリソース作成
   nest g resource auth

【トラブル】
・ReferenceError: exports is not defined in ES module scope

    → スキーマに以下を追記
    moduleFormat = "cjs"

・UnknownDependenciesException [Error]: Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument PrismaService at index [0] is available in the AuthModule module.

    → PrismaServiceのexport
