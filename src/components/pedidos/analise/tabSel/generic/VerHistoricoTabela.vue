<template>
  <div>
    <!-- LISTAR CLASSES -->
    <v-row>
      <v-data-table
        flat
        :headers="headers"
        :items="historico.classes.dados"
        :footer-props="footer_props"
        :items-per-page="5"
        item-key="dados.codigo.dados"
        show-expand
        single-expand
        :expanded="expanded"
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
          <v-icon v-if="item.dados.dono.dados">
            done
          </v-icon>
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
                      class="white--text"
                      color="indigo darken-4"
                    >
                      <div class="separador">
                        <font size="4"><b> Descritivo da Classe</b></font>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <VerHistoricoCampo
                        campoText="Estado"
                        :historicoCampo="item.dados.status"
                        tipo="estado"
                      />
                      <VerHistoricoCampo
                        campoText="Descrição"
                        :historicoCampo="item.dados.descricao"
                      />
                      <VerHistoricoCampo
                        v-if="item.dados.notasAp.dados.length > 0"
                        campoText="Notas de aplicação"
                        :historicoCampo="item.dados.notasAp"
                        tipo="array"
                        arrayValue="nota"
                      />
                      <VerHistoricoCampo
                        v-if="item.dados.exemplosNotasAp.dados.length > 0"
                        campoText="Exemplos de Notas de aplicação"
                        :historicoCampo="item.dados.exemplosNotasAp"
                        tipo="array"
                        arrayValue="exemplo"
                      />
                      <VerHistoricoCampo
                        v-if="item.dados.termosInd.dados.length > 0"
                        campoText="Termos de Indice"
                        :historicoCampo="item.dados.termosInd"
                        tipo="array"
                        arrayValue="termo"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel popout v-if="item.dados.nivel.dados == 3">
                    <!-- CONTEXTO DA CLASSE -->
                    <v-expansion-panel-header
                      class="white--text"
                      color="indigo darken-4"
                    >
                      <div class="separador">
                        <font size="4"><b>Contexto de Avaliação</b></font>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <VerHistoricoCampo
                        campoText="Tipo de Processo"
                        :historicoCampo="item.dados.tipoProc"
                      />

                      <VerHistoricoCampo
                        campoText="Processo Transversal"
                        :historicoCampo="item.dados.procTrans"
                        tipo="procTrans"
                      />

                      <VerHistoricoCampo
                        v-if="item.dados.donos.dados.length > 0"
                        campoText="Donos"
                        :historicoCampo="item.dados.donos"
                        tipo="donos"
                      />
                      <VerHistoricoCampo
                        v-if="item.dados.participantes.dados.length > 0"
                        campoText="Participantes"
                        :historicoCampo="item.dados.participantes"
                        tipo="participantes"
                      />

                      <VerHistoricoCampo
                        v-if="item.dados.processosRelacionados.dados.length > 0"
                        campoText="Processos Relacionados"
                        :historicoCampo="item.dados.processosRelacionados"
                        tipo="procRel"
                      />
                      <VerHistoricoCampo
                        v-if="item.dados.legislacao.dados.length > 0"
                        campoText="Legislação"
                        :historicoCampo="item.dados.legislacao"
                        tipo="legs"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel
                    v-if="
                      (item.dados.nivel.dados == 3 &&
                        !item.dados.temSubclasses4Nivel.dados) ||
                        item.dados.nivel.dados == 4
                    "
                  >
                    <v-expansion-panel-header
                      class="white--text"
                      color="indigo darken-4"
                    >
                      <div class="separador">
                        <font size="4"> <b>Decisões de Avaliação</b></font>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col xs="12" sm="12">
                          <v-toolbar
                            color="indigo darken-4"
                            class="caption font-weight-regular"
                            dark
                            height="25"
                          >
                            <v-toolbar-title
                              >Prazo de Conservação
                              Administrativa</v-toolbar-title
                            >
                          </v-toolbar>
                        </v-col>
                      </v-row>

                      <VerHistoricoCampo
                        campoText="Prazo"
                        :historicoCampo="item.dados.pca.dados.valores"
                        tipo="prazo"
                      />
                      <VerHistoricoCampo
                        v-if="item.dados.pca.dados.notas.dados != ''"
                        campoText="Notas"
                        :historicoCampo="item.dados.pca.dados.notas"
                      />

                      <VerHistoricoCampo
                        v-if="item.dados.pca.dados.formaContagem.dados != ''"
                        campoText="Forma de contagem"
                        :historicoCampo="item.dados.pca.dados.formaContagem"
                      />

                      <VerHistoricoCampo
                        v-if="item.dados.pca.dados.subFormaContagem"
                        campoText="Subforma de contagem"
                        :historicoCampo="item.dados.pca.dados.subFormaContagem"
                      />

                      <VerHistoricoCampo
                        v-if="!!item.dados.pca.dados.justificacao"
                        campoText="Justificação"
                        :historicoCampo="item.dados.pca.dados.justificacao"
                        tipo="justPCA"
                      />

                      <!-- DESTINO FINAL -->

                      <v-row>
                        <v-col xs="12" sm="12">
                          <v-toolbar
                            color="indigo darken-4"
                            class="caption font-weight-regular"
                            dark
                            height="25"
                          >
                            <v-toolbar-title>Destino Final</v-toolbar-title>
                          </v-toolbar>
                        </v-col>
                      </v-row>
                      <VerHistoricoCampo
                        campoText="Destino final"
                        :historicoCampo="item.dados.df.dados.valor"
                        tipo="df"
                      />

                      <VerHistoricoCampo
                        v-if="item.dados.df.dados.nota"
                        campoText="Nota"
                        :historicoCampo="item.dados.df.dados.nota"
                      />

                      <VerHistoricoCampo
                        v-if="!!item.dados.df.dados.justificacao"
                        campoText="Justificação"
                        :historicoCampo="item.dados.df.dados.justificacao"
                        tipo="justDF"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/tabSel/generic/VerHistoricoCampo";

export default {
  props: ["historico", "tipo"],
  components: {
    VerHistoricoCampo
  },
  data() {
    return {
      footer_props: {
        "items-per-page-options": [1, 5, 10, -1],
        "items-per-page-text": "Mostrar"
      },
      expanded: [],
      headers: [
        {
          text: "Código",
          sortable: false,
          align: "center",
          width: "15%",
          value: "codigo",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Título",
          sortable: false,
          value: "titulo",
          width: "35%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Dono",
          value: "dono",
          width: "15%",
          align: "center",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Participante",
          value: "participante",
          width: "35%",
          align: "center",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ]
    };
  }
};
</script>
