<template>
  <div id="app">
    <ul>
      <router-link tag="li" to="/" active-class="activeClass">home</router-link>
      <router-link tag="li" to="/about" active-class="activeClass"
        >about</router-link
      >
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.activeClass {
  background: #f40;
  font-size: 30px;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
</style>
