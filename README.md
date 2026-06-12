# nuxt-chat

Node: v25.2.1
Nuxt: 3

npm i

npx shadcn-vue@latest add button



【やったこと】
・Shadcn導入
・Tailwind CSS
https://qiita.com/Hirohana/items/2a33c96cbdf494958a2e

【Tailwind ルール】
h2: text-xl pt-2 pb-2

【トラブル】
----------------------------------------------
・「npm run dev」でerr

    原因: typescriptが入っていないため
    対応: npm install -D typescript

----------------------------------------------
・「Cannot destructure property 'field' of 'undefined' as it is undefined.」
→ shadcnのfieldが原因っぽい

    対応:
        ・vee-validate, zodインストール
        ・nuxtconfigの修正