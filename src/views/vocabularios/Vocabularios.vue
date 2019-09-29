<template>
  <Listagem
    v-bind:lista="vocabulariosControlados"
    tipo="Vocabulários Controlados"
    v-bind:cabecalho="['Legenda', 'Descrição', 'Identificador']"
    v-bind:campos="['label', 'desc', 'id']"
  />
</template>

<script>
import Listagem from "@/components/vocabularios/Listagem"; // @ is an alias to /src

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
      var response = await this.$request("get", "/api/vocabularios");
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
            id: listaTermos[i].id.split("#")[1]
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
