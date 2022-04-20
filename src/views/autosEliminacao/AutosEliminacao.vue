<template>
  <v-card flat class="ma-3">
    <v-row>
          <v-col cols="3" align="center" justify="center">
            <Voltar />
          </v-col>
          <v-col cols="6" align="center" justify="center">
            <p class="clav-content-title-1">Autos de Eliminação</p>
          </v-col>
          <v-col cols="3"> </v-col>
        </v-row>
    <v-row>
      <v-col cols="12" align="center" justify="center">
        <Listagem
          v-bind:lista="autosEliminacao"
          v-bind:cabecalho="[
            'Identificação',
            'Fonte de Legitimação',
            'Diploma Legislativo',
            'Entidade Produtora',
            'Data'
          ]"
          v-bind:campos="['id', 'tipo', 'numero', 'entidade', 'data']"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Voltar from "@/components/generic/Voltar";

export default {
  data: () => ({
    autosEliminacao: [],
    campos: []
  }),
  components: {
    Listagem, Voltar
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/autosEliminacao");
      this.autosEliminacao = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaAutosEliminacao) {
      try {
        var myTree = [];
        for (var i = 0; i < listaAutosEliminacao.length; i++) {
          var obj = {
            id: listaAutosEliminacao[i].id.split("#")[1].replace("ae_", "").replace(/\_/g,"/"),
            tipo: listaAutosEliminacao[i].fonte || listaAutosEliminacao[i].autoTipo.replace(/\_/g,"/"),
            fonte: listaAutosEliminacao[i].tipo + " " + listaAutosEliminacao[i].numero,
            entidade: listaAutosEliminacao[i].entidade
              .split("#")[1]
              .replace("ent_", ""),
            data: listaAutosEliminacao[i].data
          };
          if(listaAutosEliminacao[i].referencialLabel) { 
            obj.fonte = listaAutosEliminacao[i].referencialLabel
          }
          else if(listaAutosEliminacao[i].referencialTitulo) {
            obj.fonte = listaAutosEliminacao[i].referencialTitulo
          }
          myTree.push(obj);
        }
        return myTree;
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
