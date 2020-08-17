<template>
  <div>
    <br />
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step step="1" editable>Zona Descrita</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="2" editable>Zona de Contexto de Avaliação</v-stepper-step>

        <v-divider v-if="!classes.some(e => e.eFilhoDe == classe.codigo)"></v-divider>

        <v-stepper-step
          step="3"
          editable
          v-if="!classes.some(e => e.eFilhoDe == classe.codigo)"
        >Zona de Decisões de Avaliação</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <!-- zona descritiva -->
        <v-stepper-content :step="1" flat>
          <v-card flat>
            <v-card-text>
              <RADAEntry v-if="!!classe.descricao" label="Descrição" :value="classe.descricao" />
              <RADAEntry v-if="!!classe.eFilhoDe" label="Classe Pai" :value="classe.eFilhoDe" />
              <RADAEntry
                v-if="classe.tipo"
                label="Nível"
                :value="!!classe.tipo ? classe.tipo : 'N1'"
              />
              <RADAEntryDouble
                v-if="!!classe.dataInicial && !!classe.dataFinal"
                label_1="Data Inicial"
                label_2="Data Final"
                :value_1="classe.dataInicial"
                :value_2="classe.dataFinal"
              />
              <RADAEntry v-if="!!classe.UIs[0]" label="Unidades de Instalação">
                <template v-slot:valor>
                  <ul>
                    <li v-for="(ui, i) in classe.UIs" :key="i">{{ui}}</li>
                  </ul>
                </template>
              </RADAEntry>
              <div v-if="classe.tipo == 'Série'">
                <RADAEntryDouble
                  v-if="!!classe.tUA && !!classe.tSerie"
                  label_1="Tipo de Unidade Arquivística"
                  :value_1="classe.tUA"
                  label_2="Tipo de Série"
                  :value_2="classe.tSerie"
                />
                <v-card
                  outlined
                  v-if="!!classe.suporte_e_medicao.suporte && !!classe.suporte_e_medicao.medicao"
                >
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
                  v-if="classe.localizacao.length > 0"
                  label="Localização"
                  :value="classe.localizacao.join('; ')"
                />
              </div>
            </v-card-text>
            <br />
          </v-card>
        </v-stepper-content>
        <!-- zona contexto de avaliação -->
        <v-stepper-content :step="2" flat>
          <v-card flat>
            <v-card-text>
              <div v-if="classe.tipo == 'Série'">
                <RADAEntry
                  label="Produtoras"
                  v-if="!!classe.entProdutoras[0] || !!classe.tipologiasProdutoras[0]"
                >
                  <template v-slot:valor>
                    <ul>
                      <li v-for="(ent, i) in classe.entProdutoras" :key="i">{{ent}}</li>
                    </ul>
                    <ul>
                      <li v-for="(tip, i) in classe.tipologiasProdutoras" :key="i">{{tip}}</li>
                    </ul>
                  </template>
                </RADAEntry>
                <RADAEntry label="Legislação" v-if="!!classe.legislacao[0]">
                  <template v-slot:valor>
                    <ul>
                      <li v-for="(leg, i) in classe.legislacao" :key="i">{{leg.legislacao}}</li>
                    </ul>
                  </template>
                </RADAEntry>
              </div>
              <RADAEntry label="Séries/Subséries Relacionadas" v-if="!!classe.relacoes[0]">
                <template v-slot:valor>
                  <v-data-table
                    :items-per-page="classe.relacoes.length"
                    locale="pt"
                    :headers="headers"
                    :items="classe.relacoes"
                    class="elevation-1"
                    hide-default-footer
                  >
                    <template v-slot:item.rel="props">{{props.item.relacao}}</template>
                    <template v-slot:item.classe="props">{{props.item.serieRelacionada.codigo}}</template>
                  </v-data-table>
                </template>
              </RADAEntry>
            </v-card-text>
            <br />
          </v-card>
        </v-stepper-content>
        <!-- zona decisões de avaliação -->
        <v-stepper-content :step="3" flat>
          <v-card flat>
            <v-card outlined>
              <div class="info-label">Prazo de Conservação Administrativo</div>
              <v-card-text>
                <RADAEntry v-if="!!classe.pca" label="PCA" :value="classe.pca" />
                <RADAEntry v-if="!!classe.notaPCA" label="Nota sobre PCA" :value="classe.notaPCA" />
                <div v-if="!!classe.formaContagem">
                  <RADAEntry
                    v-if="!!classe.formaContagem.forma"
                    label="Forma de Contagem do PCA"
                    :value="forma(classe.formaContagem.forma)"
                  />
                  <RADAEntry
                    v-if="!!classe.formaContagem.subforma"
                    label="Subforma de Contagem do PCA"
                    :value="subforma(classe.formaContagem.subforma)"
                  />
                </div>
                <RADAEntry
                  label="Justificação do PCA"
                  v-if="!!classe.justificacaoPCA && classe.justificacaoPCA.length > 0"
                >
                  <template v-slot:valor>
                    <RADAEntry
                      v-for="(criterio, cindex) in classe.justificacaoPCA"
                      :key="cindex"
                      :label="criterio.tipo"
                    >
                      <template v-slot:valor>
                        {{ criterio.nota }}
                        <ul v-if="criterio.tipo == 'Critério de Utilidade Administrativa'">
                          <li v-for="(rel, i) in criterio.relacoes" :key="i">{{rel.codigo}}</li>
                        </ul>
                        <ul v-else-if="criterio.tipo == 'Critério Legal'">
                          <li v-for="(rel, i) in criterio.relacoes" :key="i">{{rel }}</li>
                        </ul>
                      </template>
                    </RADAEntry>
                  </template>
                </RADAEntry>
              </v-card-text>
              <br />
            </v-card>
            <br />
            <v-card outlined>
              <div class="info-label">Destino Final</div>
              <v-card-text>
                <RADAEntry v-if="!!classe.df" label="DF" :value="classe.df" />
                <RADAEntry v-if="!!classe.notaDF" label="Nota sobre o DF" :value="classe.notaDF" />
                <RADAEntry
                  label="Justificação do DF"
                  v-if="!!classe.justificacaoDF && classe.justificacaoDF.length > 0"
                >
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
                            <li v-for="(rel, i) in criterio.relacoes" :key="i">{{rel.codigo}}</li>
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
            <br />
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <br />
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import RADAEntryDouble from "@/components/rada/consulta/elementos/campos/RadaEntryDouble.vue";

export default {
  props: ["classe", "formaContagem", "classes"],
  components: {
    RADAEntry,
    RADAEntryDouble
  },
  data: () => ({
    headers: [
      {
        text: "Relação",
        value: "rel",
        width: "30%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Série/Subsérie",
        value: "classe",
        width: "70%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  methods: {
    forma(v) {
      let forma = this.formaContagem.formasContagem.find(e => (e.value = v));

      return forma.label;
    },
    subforma(v) {
      let subforma = this.formaContagem.subFormasContagem.find(
        e => (e.value = v)
      );

      return subforma.label;
    }
  }
};
</script>