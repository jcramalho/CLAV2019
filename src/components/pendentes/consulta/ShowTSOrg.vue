<template>
  <div>
      <v-row class="mt-1" v-if="p.objeto.idEntidade != ''">
        <v-col cols="2">
          <div class="info-label">Entidade</div>
        </v-col>
        <v-col>
          <div class="info-content">
              <span>
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    outlined
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ p.objeto.idEntidade + " - " + p.objeto.designacaoEntidade}}
                  </v-chip>
                </span>
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-1" v-else>
        <v-col cols="2">
          <div class="info-label">Tipologia</div>
        </v-col>
        <v-col>
          <div class="info-content">
              <span>
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    outlined
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ p.objeto.idTipologia + " - " + p.objeto.designacaoTipologia}}
                  </v-chip>
                </span>
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-1">
        <v-col cols="2">
          <div class="info-label">Lista de Processos</div>
        </v-col>
        <v-col>
      <v-data-table
        :headers="tsHeaders"
        :items="p.objeto.listaProcessos.procs"
        class="elevation-1"
        :footer-props="tsFooterProps"
      >
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Não existem processos para mostrar...
          </v-alert>
        </template>

        <template v-slot:footer.page-text="props">
          {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>{{ props.item.dono }}</td>
            <td>{{ props.item.participante }}</td>
          </tr>
        </template>

        <template v-slot:pageText="props">
          Processos {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
        </v-col>
      </v-row>
      
      <!--div class="info-content">
        {{ JSON.stringify(p) }}
      </div-->
  </div>
</template>

<script>
export default {
  props: ["p"],

  data: () => ({
    tsHeaders: [
      { text: "Código", value: "codigo", class: "subtitle-1" },
      { text: "Título", value: "titulo", class: "subtitle-1" },
      { text: "Dono", value: "dono", class: "subtitle-1" },
      { text: "Participante", value: "participante", class: "subtitle-1" }
    ],
    tsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todos"
    }
  })
};
</script>

<style>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>
