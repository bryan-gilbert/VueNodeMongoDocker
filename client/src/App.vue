<template lang="pug">
  div(id="app")
    div(id="nav")
      router-link(to="/") Home
      router-link(to="/about") About
    router-view
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-left: 3rem;
}
#nav {
  padding: 30px 0 20px 0;
  a {
    padding-right: 1rem;
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
