<template>
  <v-card flat>
    <!-- LISTAR CLASSES -->
    <v-data-table
      :headers="headers"
      :items="historico.classes.dados"
      :footer-props="footer_props"
      :items-per-page="5"
      item-key="dados.codigo.dados"
      show-expand
      single-expand
      @item-expanded="clicked"
    >
      <template v-slot:[`item.codigo`]="{ item }">{{
        item.dados.codigo.dados
      }}</template>

      <template v-slot:[`item.titulo`]="{ item }">{{
        item.dados.titulo.dados
      }}</template>

      <template
        v-if="tipo === 'TS Organizacional'"
        v-slot:[`item.dono`]="{ item }"
      >
        <v-icon v-if="item.dados.dono.dados"> done </v-icon>
      </template>
      <template v-else v-slot:[`item.dono`]="{ item }">
        <div v-for="e in item.dados.entidades.dados" :key="e.sigla">
          <v-chip
            v-if="e.dono"
            class="ma-2"
            color="indigo darken-4"
            outlined
            label
          >
            {{ e.sigla }}
          </v-chip>
        </div>
      </template>
      <template
        v-if="tipo === 'TS Organizacional'"
        v-slot:[`item.participante`]="{ item }"
      >
        {{ item.dados.participante.dados }}
      </template>

      <template v-else v-slot:[`item.participante`]="{ item }">
        <div v-for="e in item.dados.entidades.dados" :key="e.sigla">
          <v-chip
            v-if="e.participante != 'NP'"
            class="ma-2"
            color="indigo darken-4"
            outlined
            label
          >
            {{ e.sigla }} - {{ e.participante }}
          </v-chip>
        </div>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-card class="ma-1 elevation-0">
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel popout>
                  <!-- DESCRITIVO DA CLASSE -->
                  <v-expansion-panel-header
                    class="clav-linear-background white--text"
                  >
                    <div class="separador">
                      <font size="4"><b> Descritivo da Classe</b></font>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <VerHistoricoCampo
                      campoText="Notas de aplicação"
                      :historicoCampo="item.dados.notasAp"
                      :notas="expandedProc.notasAp"
                      tipo="notasAp"
                      arrayValue="nota"
                    />
                    <VerHistoricoCampo
                      campoText="Exemplos de Notas de aplicação"
                      :historicoCampo="item.dados.exemplosNotasAp"
                      :notas="expandedProc.exemplosNotasAp"
                      tipo="exemplosNotasAp"
                      arrayValue="exemplo"
                    />

                    <VerHistoricoCampo
                      campoText="Notas de Exclusão"
                      :historicoCampo="item.dados.notasEx"
                      :notas="expandedProc.notasEx"
                      tipo="notasEx"
                      arrayValue="nota"
                    />

                    <VerHistoricoCampo
                      campoText="Termos de Indice"
                      :historicoCampo="item.dados.termosInd"
                      :notas="expandedProc.termosInd"
                      tipo="termosInd"
                      arrayValue="termo"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/tabSel/generic/VerHistoricoCampo";

export default {
  props: ["historico", "tipo"],
  components: {
    VerHistoricoCampo,
  },
  data() {
    return {
      footer_props: {
        "items-per-page-options": [1, 5, 10, -1],
        "items-per-page-text": "Mostrar",
      },
      expandedProc: {},
      headers: [
        {
          text: "Código",
          sortable: false,
          align: "center",
          width: "15%",
          value: "codigo",
        },
        {
          text: "Título",
          sortable: false,
          value: "titulo",
          width: "35%",
        },
        {
          text: "Dono",
          value: "dono",
          width: "15%",
          align: "center",
        },
        {
          text: "Participante",
          value: "participante",
          width: "35%",
          align: "center",
        },
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
        },
      ],
    };
  },
  methods: {
    async clicked({ item }) {
      if (
        !this.expandedProc.codigo ||
        this.expandedProc.codigo != item.codigo
      ) {
        let response = await this.$request(
          "get",
          "/classes/c" + item.dados.codigo.dados
        );
        this.expandedProc = response.data;
      }
    },
  },
};
</script>
