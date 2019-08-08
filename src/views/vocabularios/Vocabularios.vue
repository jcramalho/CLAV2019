<template>
  <Listagem
    v-bind:lista="vocabulariosControlados"
    tipo="Vocabulários Controlados"
    v-bind:cabecalho="['Legenda', 'Descrição', 'Identificador']"
    v-bind:campos="['label', 'desc', 'id']"
  />
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    vocabulariosControlados: [],
    campos: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await axios.get(lhost + '/api/vocabularios');
      this.vocabulariosControlados = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaTermos) {
      try {
        var myTree = [];
        for (var i = 0; i < listaTermos.length; i++) {
          myTree.push({
            label: listaTermos[i].label,
            desc: listaTermos[i].desc,
            id: listaTermos[i].id.split('#')[1]
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
