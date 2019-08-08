<template>
  <div v-if="idRel != '' && idInv != ''">
    <ConsultaInvariante :idRel="idRel" :idInv="idInv" />
  </div>
  <div v-else>
    <Listagem />
  </div>
</template>

<script>
import Listagem from "@/components/invariantes/Listagem.vue"; // @ is an alias to /src
import ConsultaInvariante from "@/components/invariantes/ConsultaInvariante.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    idRel: "",
    idInv: ""
  }),
  components: {
    Listagem,
    ConsultaInvariante
  },

  mounted: async function() {
    if (this.$route.query.idRel != null) this.idRel = this.$route.query.idRel;
    if (this.$route.query.idInv != null) this.idInv = this.$route.query.idInv;
  },

  //reload page when query string changes
  watch: {
    $route(to, from) {
      if (from.query != to.query) {
        this.$router.go();
      }
    }
  }
};
</script>
