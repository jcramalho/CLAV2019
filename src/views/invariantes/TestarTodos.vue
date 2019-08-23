<template>
  <TestarTodos />
</template>

<script>
import TestarTodos from "@/components/invariantes/TestarTodos.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  components: {
    TestarTodos
  }
};
</script>
