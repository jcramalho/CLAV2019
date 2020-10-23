<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>
      Portaria de Gestão de Documentos
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col xs="2" sm="2">
          <div class="info-label">
             Designação
          </div>
        </v-col>
        <v-col class="mt-3">{{ p.objeto.dados.designacao }}</v-col>
        <v-col xs="2" sm="2">
          <div class="info-label">
                     Data de Criação
          </div>
        </v-col>
        <v-col class="mt-3">{{ p.objeto.dados.dataCriacao }}</v-col>
      </v-row>
      <v-row>
          <v-col xs="2" sm="2" class="mt-1">
              <div class="info-label">
                      Entidades
              </div>
          </v-col>
          <v-col>
              <span>
                <v-chip
                  v-for="(e,i) in p.objeto.dados.entidades" :key="i"
                  class="ma-2"
                  color="indigo darken-4"
                  outlined
                  label
                >
                  <v-icon left>account_balance</v-icon>
                  {{ e }}
                </v-chip>
              </span>
          </v-col>
      </v-row>
      <v-row justify="space-between" class="info-label">
        <v-col class="mt-6" style="font-size: 20px;">Lista de Classes / Séries</v-col>
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Procura"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="p.objeto.dados.classes"
        class="elevation-1 ml-1"
        :footer-props="footerProps"
        :search="search"
      >
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Não existem classes / séries para mostrar...
          </v-alert>
        </template>

        <template v-slot:footer.page-text="props">
          {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.referencia }}</td>
            <td>{{ props.item.seriesDocumentais }}</td>
            <td>{{ props.item.pca }}</td>
            <td>
              <span v-if="props.item.df=='E'">Eliminação</span>
              <span v-else-if="props.item.df=='C'">Conservação</span>
              <span v-else>Conservação Parcial</span>
            </td>
          </tr>
        </template>

        <template v-slot:pageText="props">
          Processos {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>

      <!--div class="info-content">
        {{ JSON.stringify(p) }}
      </div-->
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"],

  data: () => ({
    headers: [
      { text: "Código", value: "codigo", class: "subtitle-1" },
      { text: "Referência", value: "referencia", class: "subtitle-1" },
      { text: "Séries Documentais", value: "seriesDocumentais", class: "subtitle-1" },
      { text: "PCA", value: "pca", class: "subtitle-1" },
      { text: "Destino Final", value: "df", class: "subtitle-1" }
    ],
    footerProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [5, 10, -1],
      "items-per-page-all-text": "Todos"
    }
  })
};
</script>

<style>
.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
