<template>
  <Listagem />
</template>

<script>
import Listagem from "@/components/invariantes/Listagem.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
  }),
  components: {
    Listagem
  },

  mounted: async function() {
  },

  methods: {
  }
};
</script>
