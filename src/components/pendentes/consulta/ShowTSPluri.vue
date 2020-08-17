<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Entidades</div>
      </v-col>
      <v-col>
        <div class="info-content">
          <span>
            <v-chip
              v-for="e in p.objeto.entidades"
              :key="e.sigla"
              class="ma-2"
              color="indigo darken-4"
              outlined
              label
            >
              <v-icon left>account_balance</v-icon>
              {{ e.label }}
            </v-chip>
          </span>
        </div>
      </v-col>
    </v-row>

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
        <tr v-if="props.item.edited">
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.titulo }}</td>
          <td>
            <span v-if="props.item.entidades.length > 0">
              <span v-for="(e, i) in props.item.entidades" :key="i">
                <v-chip
                  v-if="e.dono"
                  class="ml-1"
                  color="indigo darken-4"
                  outlined
                  label
                  x-small
                >
                  {{ e.sigla }}
                </v-chip>
              </span>
            </span>
          </td>
          <td>
            <span v-if="props.item.entidades.length > 0">
              <span v-for="(e, i) in props.item.entidades" :key="i">
                <v-chip
                  v-if="e.participante != 'NP'"
                  class="ml-1"
                  color="indigo darken-4"
                  outlined
                  label
                  x-small
                >
                  {{ e.sigla }}-{{ e.participante }}
                </v-chip>
              </span>
            </span>
          </td>
        </tr>
      </template>

      <template v-slot:pageText="props">
        Processos {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>

    <!--v-row class="mt-1">
        <v-col>
          <div class="info-content">{{ JSON.stringify(p.objeto.listaProcessos.procs[0]) }}</div>
        </v-col>
      </v-row-->
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

<style scoped>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
