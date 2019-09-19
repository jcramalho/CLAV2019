<template>
    <v-card class="mt-4">
        <v-card-title class="info-label title" dark>
            Tabela de Seleção para a entidade {{ p.objeto.dados.ts.entidade }}
        </v-card-title>
        <v-card-text>
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
                    {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                </template>

                <template v-slot:item="props">
                    <tr>
                      <td>{{ props.item.codigo }}</td>
                      <td>{{ props.item.titulo }}</td>
                      <td v-if="props.item.dono">X</td>
                      <td v-if="props.item.participante">X</td>
                    </tr>
                </template>

                <template v-slot:pageText="props">
                    Processos {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: ["p"],

  data: () => ({
    tsHeaders: [
      {text: "Código", value: "codigo", class:"subtitle-1"},
      {text: "Título", value: "titulo", class:"subtitle-1"},
      {text: "Dono", value: "dono", class:"subtitle-1"},
      {text: "Participante", value: "participante", class:"subtitle-1"}
    ],
    tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      }
  })
}
</script>