<template>
  <v-card>
    <v-card-title class="expansion-panel-heading">Decomposição do SI - {{numeroSI}}</v-card-title>
    <v-card-text class="mt-4">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
          :value="numeroSI"
          solo
          dense
          readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de ref. da subdivisão do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="numeroSub"
            label="Indique o número de referência da subdivisão do SI"
            solo
            clearable
            >
          </v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Nome da subdivisão do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="nomeSub"
            label="Indique o nome da subdivisão do SI"
            solo
            clearable
            >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="space-around">
        <v-btn
        color="indigo darken-2"
        dark
        class="ma-2"
        rounded
        @click="guardarDecomp($event)"
        >
          Guardar
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  props: ["tabelaDecomposicao", "numeroSI"],

  components: {},

  data: () => {
    return {
      decompShow: "",
      numeroSub: "",
      nomeSub: ""
    }
  },

  methods: {

    guardarDecomp() {
      var decomposicao = {
        numeroSI: this.numeroSI,
        numeroSub: this.numeroSub,
        nomeSub: this.nomeSub,
      };
      this.$emit("guardarDecomp", decomposicao);
      this.numeroSub = "";
      this.nomeSub = "";
    },
  },

}

</script>
