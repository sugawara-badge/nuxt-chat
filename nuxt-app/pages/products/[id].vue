<script setup>
const products = useState("products");
const route = useRoute();
const id = Number(route.params.id);
const product = products.value.find((element) => {
  return element.id === id;
});
</script>

<template>
  <section class="product">
    <img :src="product.imgUrl_2" />
    <div class="desc">
      <h2>{{ product.name }}</h2>
      <h3>{{ product.desc }}</h3>
      <!-- <p>12,000円 (税込)</p> -->
      <!-- <button>購入する</button> -->
    </div>
  </section>
</template>

<style scoped>
/* product */

/* .product {
  display: flex;
  gap: 32px;
  margin-top: 32px;
}

.product img {
  width: 100%;
  height: auto;
}

.product div {
  flex: 1;
}

.product p {
  margin-top: 16px;
}

.product button {
  margin-top: 16px;
  padding: 8px 16px;
  cursor: pointer;
} */
.product img {
  width: 100%;
  margin-top: 20px;
}

.product h2 {
  padding: 20px;
}
</style>
