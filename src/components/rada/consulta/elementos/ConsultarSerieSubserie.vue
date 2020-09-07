<template>
  <v-dialog v-model="dialogState" max-width="90%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text"
        >Consultar Classe {{ classe.tipo == "serie" ? "Série" : "Subsérie" }}:
        {{ classe.codigo }}</v-card-title
      >

      <v-card-text>
        <RADAEntry label="Código" :value="classe.codigo" />
        <RADAEntry label="Título" :value="classe.titulo" />
        <RADAEntry label="Descrição" :value="classe.descricao" />
        <RADAEntry v-if="!!classe.pai" label="Classe Pai" :value="classe.pai" />
        <RADAEntryDouble
          label_1="Data Inicial"
          :value_1="classe.dataInicial"
          label_2="Data Final"
          :value_2="classe.dataFinal"
        />
        <RADAEntry v-if="!!classe.UIs[0]" label="Unidades de Instalação">
          <template v-slot:valor>
            <ul>
              <li v-for="(ui, i) in classe.UIs" :key="i">
                {{ ui.codigo + " - " + ui.titulo }}
              </li>
            </ul>
          </template>
        </RADAEntry>
        <div v-if="classe.tipo != 'subserie'">
          <RADAEntryDouble
            label_1="Tipo de Unidade Arquivística"
            :value_1="classe.tipoUA"
            label_2="Tipo de Série"
            :value_2="classe.tipoSerie"
          />
          <v-card outlined>
            <RADAEntryDouble
              v-for="(valores, i) in classe.suporte_e_medicao"
              :key="i"
              :label_1="'Suporte (' + (i + 1) + ')'"
              :value_1="valores.suporte"
              :label_2="'Medição (' + (i + 1) + ')'"
              :value_2="valores.medicao"
            />
          </v-card>
          <RADAEntry label="Localização" :value="classe.localizacao" />
        </div>
        <v-expansion-panels>
          <v-expansion-panel class="ma-1">
            <v-expansion-panel-header
              class="pa-2 indigo darken-4 title white--text"
              >Zona de Contexto de Avaliação</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <RADAEntry
                label="Produtoras da Série"
                v-if="classe.tipo != 'subserie' && !!classe.produtoras[0]"
              >
                <template v-slot:valor>
                  <ul>
                    <li v-for="(produtora, i) in classe.produtoras" :key="i">
                      <a
                        v-if="
                          produtora.ent_or_tip.split('#')[1].split('_')[0] ==
                            'ent'
                        "
                        :href="'/entidades/ent_' + produtora.sigla"
                        >{{ produtora.sigla + " - " + produtora.designacao }}</a
                      >
                      <a v-else :href="'/tipologias/tip_' + produtora.sigla">{{
                        produtora.sigla + " - " + produtora.designacao
                      }}</a>
                    </li>
                  </ul>
                </template>
              </RADAEntry>
              <RADAEntry
                label="Legislação"
                v-if="classe.tipo != 'subserie' && !!classe.legislacao[0]"
              >
                <template v-slot:valor>
                  <ul>
                    <li v-for="(legislacao, i) in classe.legislacao" :key="i">
                      <a
                        :href="'/legislacao/' + legislacao.leg.split('#')[1]"
                        >{{
                          "[" +
                            legislacao.tipo +
                            " " +
                            legislacao.numero +
                            "] " +
                            legislacao.sumario
                        }}</a
                      >
                    </li>
                  </ul>
                </template>
              </RADAEntry>
              <RADAEntry
                label="Séries/Subséries Relacionadas"
                v-if="!!classe.relacoes[0]"
              >
                <template v-slot:valor>
                  <v-data-table
                    :items-per-page="relacoes.length"
                    locale="pt"
                    :headers="headers"
                    :items="relacoes"
                    class="elevation-1"
                    hide-default-footer
                  >
                    <template v-slot:item.classes="props">
                      <ul>
                        <li v-for="(rel, i) in props.item.classes" :key="i">
                          {{ rel }}
                        </li>
                      </ul>
                    </template>
                  </v-data-table>
                </template>
              </RADAEntry>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="ma-1" v-if="!!classe.pca">
            <v-expansion-panel-header
              class="pa-2 indigo darken-4 title white--text"
              >Zona de Decisões de Avaliação</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <br />
              <v-card outlined>
                <div class="info-label">
                  Prazo de Conservação Administrativo
                </div>
                <v-card-text>
                  <RADAEntry
                    v-if="!!classe.pca.pca"
                    label="PCA"
                    :value="classe.pca.pca"
                  />
                  <RADAEntry
                    v-if="!!classe.pca.notaPCA"
                    label="Nota sobre PCA"
                    :value="classe.pca.notaPCA"
                  />
                  <RADAEntry
                    label="Forma de Contagem do PCA"
                    :value="classe.pca.formaLabel"
                  ></RADAEntry>
                  <RADAEntry
                    v-if="!!classe.pca.subformaContagem"
                    label="Subforma de Contagem do PCA"
                    :value="classe.pca.subformaLabel"
                  />
                  <RADAEntry
                    label="Justificação do PCA"
                    v-if="!!classe.pca.justificacaoPCA[0]"
                  >
                    <template v-slot:valor>
                      <RADAEntry
                        v-for="(criterio, cindex) in classe.pca.justificacaoPCA"
                        :key="cindex"
                        :label="
                          criterio.tipo == 'CriterioJustificacaoGestionario'
                            ? 'Critério Gestionário'
                            : criterio.tipo == 'CriterioJustificacaoLegal'
                            ? 'Critério Legal'
                            : 'Critério de Utilidade Administrativa'
                        "
                      >
                        <template v-slot:valor>
                          {{ criterio.conteudo }}
                          <ul
                            v-if="
                              criterio.tipo ==
                                'CriterioJustificacaoUtilidadeAdministrativa'
                            "
                          >
                            <li v-for="(rel, i) in criterio.relacoes" :key="i">
                              {{ rel.codigo + " - " + rel.titulo }}
                            </li>
                          </ul>
                          <ul
                            v-else-if="
                              criterio.tipo == 'CriterioJustificacaoLegal'
                            "
                          >
                            <li v-for="(rel, i) in criterio.relacoes" :key="i">
                              <a
                                :href="
                                  '/legislacao/' + rel.legislacao.split('#')[1]
                                "
                                >{{
                                  "[" +
                                    rel.tipo +
                                    " " +
                                    rel.numero +
                                    "] " +
                                    rel.sumario
                                }}</a
                              >
                            </li>
                          </ul>
                        </template>
                      </RADAEntry>
                    </template>
                  </RADAEntry>
                </v-card-text>
              </v-card>
              <br />
              <v-card outlined>
                <div class="info-label">Destino Final</div>
                <v-card-text>
                  <RADAEntry
                    v-if="!!classe.df.df"
                    label="DF"
                    :value="classe.df.df"
                  />
                  <RADAEntry
                    v-if="!!classe.df.notadf"
                    label="Nota sobre o DF"
                    :value="classe.df.notadf"
                  />
                  <RADAEntry
                    label="Justificação do DF"
                    v-if="!!classe.df.justificacaoDF[0]"
                  >
                    <template v-slot:valor>
                      <RADAEntry
                        v-for="(criterio, cindex) in classe.df.justificacaoDF"
                        :key="cindex"
                        :label="
                          criterio.tipo ==
                          'CriterioJustificacaoComplementaridadeInfo'
                            ? 'Critério de Complementaridade Informacional'
                            : criterio.tipo == 'CriterioJustificacaoLegal'
                            ? 'Critério Legal'
                            : 'Critério de Densidade Informacional'
                        "
                      >
                        <template v-slot:valor>
                          {{ criterio.conteudo }}
                          <div v-if="!!criterio.relacoes[0]">
                            <br />
                            <ul
                              v-if="
                                criterio.tipo != 'CriterioJustificacaoLegal'
                              "
                            >
                              <li
                                v-for="(rel, i) in criterio.relacoes"
                                :key="i"
                              >
                                {{ rel.codigo + " - " + rel.titulo }}
                              </li>
                            </ul>
                            <ul v-else>
                              <li
                                v-for="(rel, i) in criterio.relacoes"
                                :key="i"
                              >
                                <a
                                  :href="
                                    '/legislacao/' +
                                      rel.legislacao.split('#')[1]
                                  "
                                  >{{
                                    "[" +
                                      rel.tipo +
                                      " " +
                                      rel.numero +
                                      "] " +
                                      rel.sumario
                                  }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </template>
                      </RADAEntry>
                    </template>
                  </RADAEntry>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- {{classe.pca}} -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="indigo darken-4" dark @click="dialogState = false"
          >Voltar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import RADAEntryDouble from "@/components/rada/consulta/elementos/campos/RadaEntryDouble.vue";

export default {
  props: ["dialog", "classe"],
  components: {
    RADAEntry,
    RADAEntryDouble
  },
  data: () => ({
    relacoes: [],
    headers: [
      {
        text: "Relação",
        value: "relacao",
        width: "30%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Série/Subsérie",
        value: "classes",
        width: "70%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  },
  created() {
    this.classe.relacoes.forEach(r => {
      let traducao = "";

      let relacao = this.relacoes.find(e => e.rel == r.rel);

      if (relacao != undefined) {
        relacao.classes.push(r.codigo + " - " + r.titulo);
      } else {
        switch (r.rel) {
          case "eAntecessorDe":
            traducao = "Antecessor de";
            break;
          case "eSucessorDe":
            traducao = "Sucessora de";
            break;
          case "eCruzadoCom":
            traducao = "Cruzado com";
            break;
          case "eComplementarDe":
            traducao = "Complementar de";
            break;
          case "eSintetizadoPor":
            traducao = "Sintetizado por";
            break;
          case "eSinteseDe":
            traducao = "Síntese de";
            break;
          case "eSuplementoDe":
            traducao = "Suplemento de";
            break;
          case "eSuplementoPara":
            traducao = "Suplemento para";
            break;
        }

        if (traducao != "") {
          this.relacoes.push({
            rel: r.rel,
            relacao: traducao,
            classes: [r.codigo + " - " + r.titulo]
          });
        }
      }
    });
  }
};
</script>

<style scoped>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
