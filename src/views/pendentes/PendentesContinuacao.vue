<template>
  <div>
    <ContinuaClasse v-if="objLoaded && tipoClasse" :obj="objeto" />
    <ContinuaTSOrg v-else-if="objLoaded && tipoTSOrg" :obj="objeto" />
    <ContinuaTSPluri v-else-if="objLoaded && tipoTSPluri" :obj="objeto" />
    <ContinuaAutoEliminacao v-else-if="objLoaded && tipoAE" :obj="objeto" />
    <ContinuaRADA v-else-if="objLoaded && tipoRADA" :obj="objeto" />
    <ContinuaPendente v-else-if="objLoaded" :obj="objeto" />
    <v-alert v-else type="warning">
      Por algum motivo não foi possível carregar o trabalho pretendido. Contacte
      o administrador.
    </v-alert>
  </div>
</template>

<script>
import ContinuaClasse from "@/components/classes/criacao/ContinuaClasse"; // @ is an alias to /src
import ContinuaPendente from "@/components/pendentes/ContinuaPendente";
import ContinuaTSOrg from "@/components/tabSel/criacaoTSOrg/ContCriaTabSelOrg";
import ContinuaTSPluri from "@/components/tabSel/criacaoTSPluri/ContCriaTabSelPluri";
import ContinuaAutoEliminacao from "@/components/autosEliminacao/criacao/ContinuarAutoEliminacao";
import ContinuaRADA from "@/components/rada/pendenteRada";

export default {
  components: {
    ContinuaPendente,
    ContinuaClasse,
    ContinuaTSOrg,
    ContinuaTSPluri,
    ContinuaAutoEliminacao,
    ContinuaRADA
  },

  data: () => ({
    objeto: {},
    objLoaded: false,
    tipoClasse: false,
    tipoTSOrg: false,
    tipoTSPluri: false,
    tipoAE: false,
    tipoRADA: false
  }),

  created: function() {
    this.$request("get", "/pendentes/" + this.$route.params.idPendente)
      .then(response => {
        this.objeto = response.data;
        switch (this.objeto.tipo) {
          case "Classe":
            this.tipoClasse = true;
            break;
          case "TS Organizacional":
            this.tipoTSOrg = true;
            break;
          case "TS Pluriorganizacional":
            this.tipoTSPluri = true;
            break;
          case "Auto de Eliminação":
            this.tipoAE = true;
            break;
          case "RADA":
            this.tipoRADA = true;
            break;
          case "PGD":
            this.tipoPGD = true;
            break;
        }
        this.objLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>
