<script setup>
useHead({
  title: "Dosa",
});

useState("products", () => [
  {
    id: 0,
    name: "Mei",
    price: 12000,
    imgUrl: "/mei_4.jpg",
    imgUrl_2: "/mei_3.webp",
    desc: "終電、なくなっちゃったね、、、",
  },
  { id: 1, imgUrl: "/ume.jpg", name: "Daigo", price: 15000 },
  { id: 2, imgUrl: "/yumi.webp", name: "Yumi", price: 30000 },
  {
    id: 3,
    name: "Shingo",
    price: 12000,
    imgUrl: "/hori.png",
    imgUrl_2: "/hori_3.avif",
    desc: "48000です",
  },
]);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
