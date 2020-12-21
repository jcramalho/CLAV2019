<template>
  <v-card>
    <v-form ref="formAddClasse" :lazy-validation="false">
      <v-card-title class="expansion-panel-heading">Classe</v-card-title>
      <v-card-text class="mt-4">
        <v-row>
          <v-col :md="2">
              <div class="info-label">Classe
                <InfoBox header="Classe" :text="myhelp.Ppd.Avaliacao.pcaClasse"/>
              </div>
          </v-col>
          <v-col>
            <v-autocomplete
              :items="classesSI"
              item-text="info"
              v-model="classeSelecionada"
              placeholder="Selecione a classe"
              solo
              return-object
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="info-label">Forma de contagem dos prazos
              <InfoBox header="Forma de contagem dos prazos" :text="myhelp.Ppd.Avaliacao.contagemPrazos"/>
            </div>
          </v-col>
          <v-col>
            <v-text-field solo dense >

            </v-text-field>
          </v-col>
          <v-col>
            <div class="info-label">Destino final
              <InfoBox header="Destino final" :text="myhelp.Ppd.Avaliacao.destinoClasse"/>
            </div>
          </v-col>
          <v-col>
            <v-text-field solo dense >

            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">PCA da classe/série
              <InfoBox header="PCA da classe/série" :text="myhelp.Ppd.Avaliacao.pcaClasse"/>
            </div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-text-field solo dense :value="classeShow.pca">

            </v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" justify="space-around">
          <v-btn
          color="indigo darken-2"
          dark
          class="ma-2"
          rounded
          @click="guardarClasse($event,classeSelecionada)"
          >
            Guardar
          </v-btn>
        </v-row>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script>

import InfoBox from "@/components/generic/infoBox.vue";


export default {
  props: ["classesSI","classesDaFonteL","myhelp"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      classeSelecionada: "",
      classeShow: "",
    }
  },

  methods: {
    //funçao para ir bscar a info que falta para mostrar no dialog...
    consultaClasse:function(id){
      var index = this.classesDaFonteL.findIndex(c => c.classe === id)
      this.classeShow = this.classesDaFonteL[index];
    },
    guardarClasse() {
      //URGENTE --------------------------------ver qual é o id !!!!
      var indexAux = this.classesSI.findIndex(e => e.classe === this.classeSelecionada.classe);
      var index = this.classesDaFonteL.findIndex(e => e.classe === this.classeSelecionada.classe);
      var selectedClasse = JSON.parse(JSON.stringify(this.classesDaFonteL[index]));
      this.classesSI.splice(indexAux,1);
      this.classeSelecionada="";
      //this.$refs.formAddClasse.reset();
      this.$emit("guardarClasse", selectedClasse);
    },
  },

  watch:{
    "classeSelecionada": function() {
        if(this.classeSelecionada){
          this.consultaClasse(this.classeSelecionada.classe);
        }
    },
  },

}

</script>
