<template>
  <div id="app">
    <!-- <div>
        {{countPlusLocalState}}
    </div> -->
    {{test}}
    <div>{{count}}</div>
    <div>
      <button @click="increase()">+</button>
      <button @click="decrease()">-</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "App",
  data() {
    return {
        localCount: -1
    };
  },
  computed: {
      test() {return 'wuhonlgei'},
      ...mapState(['count'])
  },
  methods: {
    increase() {
      this.$store.commit("increment");
    },
    decrease() {
      this.$store.commit("decrease");
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
