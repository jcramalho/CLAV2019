<template>
  <div>
    <EntidadesProdutoras :newSerie="newSerie"/>
    <hr style="border: 3px solid indigo; border-radius: 2px;" />
    <Legislacao :newSerie="newSerie"/>
    <hr style="border: 3px solid indigo; border-radius: 2px;" />
    <!-- <RelacoesEntidades/> -->
    <!-- <v-row>
      <v-col md="12" sm="12" xs="12">
        <NovaEntidade />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Legislação:</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-autocomplete
          deletable-chips
          :rules="[v => !!v[0] || 'Campo obrigatório é obrigatório!']"
          v-model="newSerie.legislacao"
          :items="legislacao"
          placeholder="Selecione a Legislação"
          chips
          multiple
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12" sm="12" xs="12">
        <NovaLegislacao />
      </v-col>
    </v-row>
    <v-row v-if="newSerie.tipo != 'Subsérie'">
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.legislacao" label="Legislação"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.relacoes" label="Relações"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" sm="12" md="12">
        <v-text-field outlined v-model="newSerie.relacoes" label="Relações"></v-text-field>
      </v-col>
    </v-row>-->
  </div>
</template>

<script>
import EntidadesProdutoras from "./../../EntidadesProdutoras";
import Legislacao from "./../../Legislacao";
// import RelacoesEntidades from "./../../RelacoesEntidades";

export default {
  props: ["newSerie"],
  components: {
    EntidadesProdutoras,
    Legislacao,
    // RelacoesEntidades
  },
  data: () => {
    return {
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "estado" },
        { text: "Remover" }
      ]
    };
  }
};
</script>
