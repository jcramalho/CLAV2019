<template>
  <v-card>
    <v-card-title class="expansion-panel-heading">Classe</v-card-title>
    <v-card-text class="mt-4">
      <v-row>
        <v-col :md="2">
            <div class="info-label">Classe</div>
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
          <div class="info-label">Forma de contagem dos prazos</div>
        </v-col>
        <v-col>
          <v-text-field solo dense >

          </v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Destino final</div>
        </v-col>
        <v-col>
          <v-text-field solo dense >

          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="info-label">PCA da classe/série</div>
        </v-col>
        <v-col>
          <v-text-field solo dense >

          </v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">PCA do sistema de informação</div>
        </v-col>
        <v-col>
          <v-text-field solo dense >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :md="2">
          <div class="info-label">Destino final do sistema de informação</div>
        </v-col>
        <v-col>
          <v-text-field solo dense >

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
  </v-card>
</template>

<script>

export default {
  props: ["classesSI","classesDaFonteL"],

  components: {},

  data: () => {
    return {
      classeSelecionada: "",
      classeShow: "",
    }
  },

  methods: {
    //funçao para ir bscar a info que falta para mostrar no dialog...
    consultaClasse:function(id){
      var index = this.classesDaFonteL.findIndex(c => c.idPGD === id)
      this.classeShow = this.classesDaFonteL[index];
    },
    guardarClasse() {
      //URGENTE --------------------------------ver qual é o id !!!!
      var index = this.classesSI.findIndex(e => e.id === this.classeSelecionada.id);
      //var selectedClasse = JSON.parse(JSON.stringify(this.classesDaFonteL[index]));
      //trocar o classesSI pelo classesDaFonteL para levar a info toda... para ja leva a info basic (fase teste!!)
      var selectedClasse = JSON.parse(JSON.stringify(this.classesSI[index]));
      this.classesSI.splice(index,1);
      this.classeSelecionada="";
      this.$emit("guardarClasse", selectedClasse);
    },
  },

  watch:{
    "classeSelecionada": function() {
        this.consultaClasse(this.classeSelecionada.id);
    },
  },

}

</script>
