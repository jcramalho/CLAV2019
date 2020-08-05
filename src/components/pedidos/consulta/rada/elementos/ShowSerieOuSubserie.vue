<template>
  <v-dialog v-model="dialogState" max-width="90%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>{{ treeview_object.tipo + ": " + treeview_object.titulo }}</b>
      </v-card-title>
      <v-card-text>
        <RADAEntry label="Código" :value="classe.codigo" />
        <RADAEntry label="Titulo" :value="classe.titulo" />
        <RADAEntry label="Descrição" :value="classe.descricao" />
        <RADAEntry label="Classe Pai" :value="this.treeview_object.eFilhoDe" />
        <RADAEntryDouble
          label_1="Data Inicial"
          :value_1="classe.dataInicial"
          label_2="Data Final"
          :value_2="classe.dataFinal"
        />
        <RADAEntry v-if="!!classe.UIs[0]" label="Unidades de Instalação">
          <template v-slot:valor>
            <ul>
              <li v-for="(ui, i) in classe.UIs" :key="i">{{ui}}</li>
            </ul>
          </template>
        </RADAEntry>
        <RADAEntryDouble
          v-if="classe.tipo != 'Subsérie'"
          label_1="Tipo de Unidade Arquivística"
          :value_1="classe.tUA"
          label_2="Tipo de Série"
          :value_2="classe.tSerie"
        />
        <v-card outlined v-if="classe.tipo != 'Subsérie'">
          <RADAEntryDouble
            v-for="(valores, i) in classe.suporte_e_medicao"
            :key="i"
            :label_1="'Suporte (' + (i + 1) + ')'"
            :value_1="valores.suporte"
            :label_2="'Medição (' + (i + 1) + ')'"
            :value_2="valores.medicao"
          />
        </v-card>
        <RADAEntry
          label="Localização"
          v-if="classe.tipo != 'Subsérie'"
          :value="classe.localizacao.join(', ')"
        />
        <v-expansion-panels>
          <v-expansion-panel class="ma-1">
            <v-expansion-panel-header
              class="pa-2 indigo darken-4 title white--text"
            >Zona de Contexto de Avaliação</v-expansion-panel-header>
            <v-expansion-panel-content>
              <RADAEntry
                label="Produtoras da Série"
                v-if="classe.tipo != 'Subsérie' && classe.entProdutoras.length > 0"
              >
                <template v-slot:valor>
                  <ul>
                    <li v-for="(produtora, i) in classe.entProdutoras" :key="i">{{ produtora }}</li>
                  </ul>
                </template>
              </RADAEntry>
              <RADAEntry
                v-else-if="classe.tipo != 'Subsérie' && classe.tipologiasProdutoras.length > 0"
                label="Produtoras da Série"
              >
                <template v-slot:valor>
                  <ul>
                    <li
                      v-for="(produtora, i) in classe.tipologiasProdutoras"
                      :key="i"
                    >{{ produtora }}</li>
                  </ul>
                </template>
              </RADAEntry>
              <RADAEntry
                label="Legislação"
                v-if=" classe.tipo != 'Subsérie' && !!classe.legislacao[0]"
              >
                <template v-slot:valor>
                  <ul>
                    <li
                      v-for="(legislacao, i) in classe.legislacao"
                      :key="i"
                    >{{ legislacao.legislacao }}</li>
                  </ul>
                </template>
              </RADAEntry>
              <RADAEntry label="Séries/Subséries Relacionadas" v-if="!!classe.relacoes[0]">
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
                        <li v-for="(rel, i) in props.item.classes" :key="i">{{rel}}</li>
                      </ul>
                    </template>
                  </v-data-table>
                </template>
              </RADAEntry>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="ma-1" v-if="!!classe.pca || !!classe.notaPCA">
            <v-expansion-panel-header
              class="pa-2 indigo darken-4 title white--text"
            >Zona de Decisões de Avaliação</v-expansion-panel-header>
            <v-expansion-panel-content>
              <br />
              <v-card outlined>
                <div class="info-label">Prazo de Conservação Administrativo</div>
                <v-card-text>
                  <RADAEntry v-if="!!classe.pca" label="PCA" :value="classe.pca" />
                  <RADAEntry
                    v-if="!!classe.notaPCA"
                    label="Nota sobre PCA"
                    :value="classe.notaPCA"
                  />
                  <RADAEntry v-if="!!forma" label="Forma de Contagem do PCA" :value="forma.label"></RADAEntry>
                  <RADAEntry
                    v-if="!!this.classe.formaContagem.subforma"
                    label="Subforma de Contagem do PCA"
                    :value="this.classe.formaContagem.subforma"
                  />
                  <RADAEntry label="Justificação do PCA" v-if="!!classe.justificacaoPCA[0]">
                    <template v-slot:valor>
                      <RADAEntry
                        v-for="(criterio, cindex) in classe.justificacaoPCA"
                        :key="cindex"
                        :label="criterio.tipo"
                      >
                        <template v-slot:valor>
                          {{ criterio.nota }}
                          <ul v-if="criterio.tipo == 'Critério de Utilidade Administrativa'">
                            <li
                              v-for="(rel, i) in criterio.relacoes"
                              :key="i"
                            >{{rel.codigo + " - " + rel.titulo}}</li>
                          </ul>
                          <ul v-else-if="criterio.tipo == 'Critério Legal'">
                            <li v-for="(rel, i) in criterio.relacoes" :key="i">{{rel }}</li>
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
                  <RADAEntry v-if="!!classe.df" label="DF" :value="classe.df" />
                  <RADAEntry v-if="!!classe.notaDF" label="Nota sobre o DF" :value="classe.notaDF" />
                  <RADAEntry label="Justificação do DF" v-if="!!classe.justificacaoDF[0]">
                    <template v-slot:valor>
                      <RADAEntry
                        v-for="(criterio, cindex) in classe.justificacaoDF"
                        :key="cindex"
                        :label="criterio.tipo"
                      >
                        <template v-slot:valor>
                          {{ criterio.nota }}
                          <div v-if="!!criterio.relacoes[0]">
                            <br />
                            <ul v-if="criterio.tipo != 'Critério Legal'">
                              <li
                                v-for="(rel, i) in criterio.relacoes"
                                :key="i"
                              >{{rel.codigo + " - " + rel.titulo}}</li>
                            </ul>
                            <ul v-else>
                              <li v-for="(rel, i) in criterio.relacoes" :key="i">{{rel }}</li>
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import RADAEntryDouble from "@/components/rada/consulta/elementos/campos/RadaEntryDouble.vue";

export default {
  props: [
    "treeview_object",
    "classes",
    "formaContagem",
    "show_a_partir_de_pedido",
    "dialog",
  ],
  data: () => ({
    forma: null,
    relacoes: [],
    classe: {},
    headers: [
      {
        text: "Relação",
        value: "rel",
        width: "30%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Série/Subsérie",
        value: "classes",
        width: "70%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
    ],
  }),
  components: {
    RADAEntry,
    RADAEntryDouble,
  },
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      },
    },
  },
  created() {
    this.classe = this.classes.find(
      (e) => e.codigo == this.treeview_object.codigo
    );

    if (this.show_a_partir_de_pedido == false) {
      // Buscar nome do pai para colocar no combobox;
      let classe_que_e_pai = this.classes.find(
        (e) => e.codigo == this.classe.eFilhoDe
      );

      if (classe_que_e_pai != undefined) {
        this.treeview_object.eFilhoDe =
          classe_que_e_pai.codigo + " - " + classe_que_e_pai.titulo;
      }

      // Fazer clone da classe para buscar titulos para relações e critérios
      this.classe = JSON.parse(JSON.stringify(this.classe));

      // Buscar titulos para as relações;
      this.classe.relacoes.map((rel) => {
        let classe_que_tem_relacao = this.classes.find(
          (e) => e.codigo == rel.serieRelacionada.codigo
        );

        rel.serieRelacionada["titulo"] = classe_que_tem_relacao.titulo;
      });

      //Buscar titulos para a justificação DF e ao mesmo tempo fazer deep clone;
      this.classe.justificacaoDF.map((criterio) => {
        if (criterio.tipo != "Critério Legal") {
          criterio.relacoes.map((rel) => {
            let relacao_criterio = this.classe.relacoes.find(
              (r) => r.serieRelacionada.codigo == rel.codigo
            );

            rel["titulo"] = relacao_criterio.serieRelacionada.titulo;
          });
        }
      });
      //Buscar titulos para a justificação PCA  e ao mesmo tempo fazer deep clone;
      this.classe.justificacaoPCA.map((criterio) => {
        if (criterio.tipo == "Critério de Utilidade Administrativa") {
          criterio.relacoes.map((rel) => {
            let relacao_criterio = this.classe.relacoes.find(
              (r) => r.serieRelacionada.codigo == rel.codigo
            );
            rel["titulo"] = relacao_criterio.serieRelacionada.titulo;
          });
        }
      });
    }

    for (let i = 0; i < this.classe.relacoes.length; i++) {
      let r = this.relacoes.find(
        (e) => e.rel == this.classe.relacoes[i].relacao
      );

      if (r != undefined) {
        r.classes.push(
          this.classe.relacoes[i].serieRelacionada.codigo +
            " - " +
            this.classe.relacoes[i].serieRelacionada.titulo
        );
      } else {
        this.relacoes.push({
          rel: this.classe.relacoes[i].relacao,
          classes: [
            this.classe.relacoes[i].serieRelacionada.codigo +
              " - " +
              this.classe.relacoes[i].serieRelacionada.titulo,
          ],
        });
      }
    }

    if (this.classe.formaContagem != undefined) {
      this.forma = this.formaContagem.formasContagem.find(
        (e) => e.value == this.classe.formaContagem.forma
      );
    }
  },
};
</script>

<style scoped>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}
</style>