<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>
      Tabela de Seleção Pluriorganizacional
    </v-card-title>
    <v-card-text>
        <v-row v-if="p.objeto.dados.ts.entidades">
            <v-col xs="2" sm="2">
                <div class="info-label">
                        Entidades
                </div>
            </v-col>
            <v-col>
                <span>
                  <v-chip
                    v-for="(e,i) in p.objeto.dados.ts.entidades" :key="i"
                    class="ma-2"
                    color="indigo darken-4"
                    outlined
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ e.searchField }}
                  </v-chip>
                </span>
            </v-col>
        </v-row>
        
      <v-data-table
        :headers="tsHeaders"
        :items="p.objeto.dados.ts.processos"
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
            <td>
                <span v-if="props.item.entidades.length > 0">
                    <span v-for="(e,i) in props.item.entidades" :key="i">
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
                    <span v-for="(e,i) in props.item.entidades" :key="i">
                        <v-chip
                            v-if="e.participante"
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
    tsHeaders: [
      { text: "Código", value: "codigo", class: "subtitle-1" },
      { text: "Título", value: "titulo", class: "subtitle-1" },
      { text: "Dono", value: "dono", class: "subtitle-1" },
      { text: "Participante", value: "participante", class: "subtitle-1" }
    ],
    tsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [5, 10, -1],
      "items-per-page-all-text": "Todos"
    }
  })
};
</script>

<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>
