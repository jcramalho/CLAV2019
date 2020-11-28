<template>
  <v-card>
    <v-sheet class="indigo lighten-2">
      <v-text-field
        v-model="search"
        label="Filtrar por número SI ou título"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <div>
        <v-treeview
          dense
          hoverable
          activatable
          :items="arvore"
          :search="search"
          :filter="filter"
          :open.sync="open"
        >
          <template slot="label" slot-scope="{ item }">
            <v-btn text depressed @click="showSI(item)">{{ item.id }}</v-btn>
            <br />
          </template>
        </v-treeview>
        <template>
          <div>
            <v-dialog
              :retain-focus="false"
              v-model="verSI"
            >
              <v-card>
                <v-card-title class="expansion-panel-heading">Sitema de informação</v-card-title>
                <div class="v-card__text mt-4">
                  <verBlocoIdentificacao
                    :siSpec="siSpec"
                  />
                  <verBlocoAvaliacao
                    :siSpec="siSpec"
                  />
                  <verBlocoCaracterizacao
                    :siSpec="siSpec"
                  />
                  <verBlocoEstrategia
                    :siSpec="siSpec"
                  />
                </div>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-row align="center" justify="space-around">
                    <v-btn
                    color="indigo darken-2"
                    dark
                    class="ma-2"
                    rounded
                    @click="verSI = false"
                    >
                      Fechar
                    </v-btn>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
        <br />
      </div>
    </v-card-text>
  </v-card>
</template>


<script>

import verBlocoIdentificacao from "@/components/ppd/criacao/verSI/verBlocoIdentificacao.vue"
import verBlocoAvaliacao from "@/components/ppd/criacao/verSI/verBlocoAvaliacao.vue"
import verBlocoCaracterizacao from "@/components/ppd/criacao/verSI/verBlocoCaracterizacao.vue"
import verBlocoEstrategia from "@/components/ppd/criacao/verSI/verBlocoEstrategia.vue"


export default {
  props: ["arvore","sistemasInfo"],

  components: {
    verBlocoIdentificacao,
    verBlocoAvaliacao,
    verBlocoCaracterizacao,
    verBlocoEstrategia
  },

  data: () => ({
    siSpec: "",
    items: [],
    open: [1, 2],
    search: null,
    verSI: false,
  }),

  methods: {
    showSI: function(item){
      this.verSI = true;
      var index = this.sistemasInfo.findIndex(e => e.numeroSI === item.id);
      if(index !=-1){
        this.item2Show(this.sistemasInfo[index]);
      }
    },

    item2Show: function(item){
      this.siSpec = item;
      if(item.visto){
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema.map(e => e.sigla).toString()
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propDados= item.identificacao.propDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico.map(e => e.sigla).toString(),
        this.siSpec.avaliacao.decomposicao= item.avaliacao.tabelaDecomposicao.map(e=> e.numeroSI+"."+e.numeroSub + " " + e.nomeSub).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionado= item.avaliacao.sistemasRelacionados.map(e=> e.numeroSI).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionadoRelacao= item.avaliacao.sistemasRelacionados.map(e=> e.relacao).toString().replaceAll(",","#")
        item.visto=false;
      }

    }

  },

  computed: {
      filter () {
          return (item, search, textKey) => item[textKey].indexOf(search) > -1
        },
    }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>