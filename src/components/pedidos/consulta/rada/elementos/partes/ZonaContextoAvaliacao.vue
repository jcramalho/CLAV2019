<template>
  <div>
    <div v-if="classe.tipo != 'Subsérie'">
      <v-row v-if="classe.entProdutoras.length > 0">
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Entidades Produtoras</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-combobox v-model="classe.entProdutoras" :items="[]" readonly multiple chips></v-combobox>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Tipologias Produtoras</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-combobox v-model="classe.tipologiasProdutoras" :items="[]" readonly multiple chips></v-combobox>
        </v-col>
      </v-row>
      <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Legislação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-combobox
            item-text="legislacao"
            v-model="classe.legislacao"
            :items="[]"
            readonly
            multiple
            chips
          ></v-combobox>
        </v-col>
      </v-row>
      <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    </div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Relações com Séries/Subséries</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <!-- {{newSerie.relacoes}} -->

        <v-data-table
          v-if="!!classe.relacoes[0]"
          :headers="headers"
          :items="classe.relacoes"
          hide-default-footer
        >
          <template v-slot:item.relacao="props">
            {{
            props.item.relacao
            }}
          </template>
          <template v-slot:item.serieRelacionada="props">
            {{
            props.item.serieRelacionada.codigo + " - " + props.item.serieRelacionada.titulo
            }}
          </template>
        </v-data-table>
        <v-alert
          v-else
          border="left"
          dense
          icon="warning"
          color="amber accent-3"
        >Esta classe não possuí relações!</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["classe"],
  data: () => ({
    headers: [
      {
        text: "Relação",
        align: "center",
        value: "relacao",
        width: "35%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Série/Subsérie Relacionada",
        align: "center",
        value: "serieRelacionada",
        width: "65%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  })
};
</script>

<style>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
