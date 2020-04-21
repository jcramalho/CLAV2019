/* eslint-disable prettier/prettier */
<template>
  <div v-if="RE.entidadesProd.length > 0">
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Entidades Produtoras</div>
      </v-col>
      <v-col xs="12" sm="9">
        <!-- :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']" -->
        <v-autocomplete
          v-model="newSerie.entProdutoras"
          :items="RE.entidadesProd"
          placeholder="Selecione as Entidades Produtoras."
          multiple
          chips
          deletable-chips
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
          :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
          v-model="newSerie.tipologiasProdutoras"
          :items="RE.tipologiasProd"
          placeholder="Selecione as Tipologias da Entidades produtoras."
          multiple
          chips
          deletable-chips
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                <strong>Tipologia</strong> em questão não é produtora deste RADA!
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
  props: ["newSerie", "RE"]
};
</script>
