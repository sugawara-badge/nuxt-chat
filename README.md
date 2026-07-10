# nuxt-chat

Node: v25.2.1
Nuxt: 3

npm i
npm run dev

npx shadcn-vue@latest add button

【やったこと】
・Shadcn導入
・Tailwind CSS
https://qiita.com/Hirohana/items/2a33c96cbdf494958a2e
・Pinia
https://qiita.com/tatsuki-tsuchiyama/items/b4ef100777954ea58821
・pinia-plugin-persistedstate
https://qiita.com/salt1998/items/c14d64aa1c8275436a46

【Tailwind ルール】
h2: text-xl pt-2 pb-2

## 【トラブル】

・「npm run dev」でerr

    原因: typescriptが入っていないため
    対応: npm install -D typescript

---

・「Cannot destructure property 'field' of 'undefined' as it is undefined.」
→ shadcnのfieldが原因っぽい

    対応:
        ・vee-validate, zodインストール
        ・nuxtconfigの修正

---

・Failed to resolve component: GalleryVerticalEnd
対応: default.vueで「'@lucide/vue'」をimpoert

---

・middlewareを書いた時、以下のエラー
Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app).

## NestJS

https://qiita.com/skcyb/items/1123cf26301a77ef6c75#-api%E3%83%AB%E3%83%BC%E3%83%88%E3%82%92%E8%BF%BD%E5%8A%A0
