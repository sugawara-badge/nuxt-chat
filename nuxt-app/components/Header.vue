<template>
  <header>
    <h1>チャ。</h1>
    <p><span>ー</span>地球の運動と腸内環境、及び発毛について<span>ー</span></p>
    <!-- <img src="/sakana.avif" alt="トップ画像" /> -->
  </header>
</template>

<style scoped>
header {
  text-align: center;
  font-family: serif;
  padding-top: 30px;
}
header h1 {
  font-size: 150px;
  padding-left: 120px;
  letter-spacing: -10px;
}
header p {
  letter-spacing: 1px;
}
header img {
  margin: auto;
  max-width: 500px;
  margin-top: 50px;
}

header span {
  font-family: sans-serif;
}

@media screen and (max-width: 768px) {
  header h1 {
    font-size: 100px;
    padding-left: 50px;
  }
  header img {
    max-width: 100%;
  }
}
header p {
  font-size: 10px;
}
</style>
