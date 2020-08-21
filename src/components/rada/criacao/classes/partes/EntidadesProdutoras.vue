/* eslint-disable prettier/prettier */
<template>
  <div v-if="RE.entidadesProd.length > 0">
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Entidades Produtoras</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-autocomplete
          v-model="newSerie.entProdutoras"
          :items="RE.entidadesProd"
          label="Selecione as Entidades Produtoras"
          multiple
          chips
          deletable-chips
          solo
          clearable
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                <strong>Entidade</strong> em questão não é produtora deste RADA!
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Tipologias das Entidades Produtoras</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-autocomplete
          v-model="newSerie.tipologiasProdutoras"
          :items="[RE.tipologiasProd]"
          label="Selecione as Tipologias da Entidades produtoras"
          multiple
          chips
          deletable-chips
          solo
          clearable
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                <strong>Tipologia</strong> em questão não é produtora deste
                RADA!
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "EntidadesProdutores",
  props: ["newSerie", "RE", "editar"],
  created() {
    if (
      !this.editar &&
      this.newSerie.entProdutoras.length == 0 &&
      this.newSerie.tipologiasProdutoras.length == 0
    ) {
      this.newSerie.entProdutoras = JSON.parse(
        JSON.stringify(this.RE.entidadesProd)
      );
      this.newSerie.tipologiasProdutoras = [this.RE.tipologiasProd];
    }
  },
  watch: {
    "RE.entidadesProd": function(newValue) {
      this.newSerie.entProdutoras = JSON.parse(JSON.stringify(newValue));
    },
    "RE.tipologiasProd": function(newValue) {
      this.newSerie.tipologiasProdutoras = [newValue];
    }
  }
};
</script>
