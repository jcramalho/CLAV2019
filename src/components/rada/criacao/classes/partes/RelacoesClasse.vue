<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Relação com Série/Subsérie</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-row>
          <!-- {{newSerie.relacoes}} -->
          <v-col sm="12" xs="12" v-if="newSerie.relacoes[0]">
            <v-data-table :headers="headers" :items="newSerie.relacoes" hide-default-footer>
              <template v-slot:item.relacao="props">
                {{
                props.item.relacao
                }}
              </template>
              <!-- <template v-slot:item.tipo="props">
                {{
                props.item.serieRelacionada.tipo
                }}
              </template>-->
              <template v-slot:item.edicao="props">
                <td>
                  <v-icon color="red darken-2" dark @click="remove(props.item)">remove_circle</v-icon>
                </td>
              </template>
              <template v-slot:item.serieRelacionada="props">
                {{
                props.item.serieRelacionada.codigo
                }}
              </template>
            </v-data-table>
            <hr style="border: 3px solid; border-radius: 2px;" />
          </v-col>
        </v-row>
        <v-card outlined>
          <div class="info-label">Adicionar relação com série/subsérie</div>

          <v-card-text>
            <!-- Novo form para adicionar relação -->
            <v-form ref="addRel" :lazy-validation="false">
              <v-row>
                <v-col sm="12" xs="12">
                  <v-combobox
                    :rules="[v => codigoIgual(v)]"
                    v-model="codrel"
                    :items="getCodigos"
                    label="Classe"
                    item-value="codigo"
                    item-text="searchField"
                    solo
                    clearable
                    :return-object="false"
                  ></v-combobox>
                </v-col>
              </v-row>

              <v-row>
                <v-col sm="6" xs="12">
                  <v-autocomplete
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="rel"
                    :items="filtrarRelacoes"
                    label="Relação"
                    solo
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col sm="5" xs="12">
                  <v-select
                    :disabled="iscodvalido"
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    label="Tipo de Classe"
                    v-model="tipoClasse"
                    :items="['Série', 'Subsérie']"
                    chips
                    solo
                    clearable
                  >
                    <template v-slot:selection="data">
                      <v-chip>
                        <v-avatar left color="amber accent-3">{{ data.item[0] }}</v-avatar>
                        {{ data.item }}
                      </v-chip>
                    </template>
                  </v-select>
                </v-col>
                <v-col sm="1" xs="12">
                  <v-btn icon text rounded @click="add()">
                    <v-icon color="green lighten-1">add_circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-if="!!alertOn">
                <v-col>
                  <v-alert
                    dismissible
                    dense
                    text
                    type="error"
                  >Impossível criar relação! Já existe ou classe já se encontra relacionada ou relação inválida!</v-alert>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const labels = require("@/config/labels").criterios;

export default {
  name: "RelacoesClasse",
  props: ["newSerie", "classes"],
  data() {
    return {
      tipoClasse: null,
      iscodvalido: false,
      alertOn: false,
      rel: "",
      codrel: null,
      listaRelacoes: [
        "Antecessora de",
        "Sucessora de",
        "Complementar de",
        "Sintetizado por",
        "Síntese de",
        "Suplemento de",
        "Suplemento para"
      ],
      headers: [
        {
          text: "Relação",
          align: "center",
          value: "relacao",
          width: "30%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Classe Relacionada",
          align: "center",
          value: "serieRelacionada",
          width: "65%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          value: "edicao",
          align: "center",
          sortable: false,
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ]
    };
  },
  computed: {
    filtrarRelacoes() {
      if (this.newSerie.relacoes.some(e => e.relacao == "Síntese de")) {
        return this.listaRelacoes.filter(e => e != "Sintetizado por");
      } else {
        if (this.newSerie.relacoes.some(e => e.relacao == "Sintetizado por")) {
          return this.listaRelacoes.filter(e => e != "Síntese de");
        } else {
          return this.listaRelacoes;
        }
      }
    },
    getCodigos() {
      return this.classes
        .filter(
          e =>
            e.codigo != this.newSerie.codigo &&
            (e.tipo == "Subsérie" || e.tipo == "Série")
        )
        .map(e => {
          return {
            codigo: e.codigo,
            searchField: e.codigo + " - " + e.titulo
          };
        });
    }
  },
  watch: {
    codrel: function(novo, old) {
      let c = this.classes.find(e => e.codigo == novo);
      if (c != undefined) {
        this.iscodvalido = true;
        this.tipoClasse = c.tipo;
      } else {
        this.iscodvalido = false;
      }
    }
  },
  methods: {
    alteraDF(tipo_criterio) {
      if (tipo_criterio == "Critério de Complementaridade Informacional") {
        if (this.newSerie.relacoes.some(e => e.relacao == "Síntese de")) {
          this.newSerie.df = "Conservação";
        } else {
          if (
            this.newSerie.relacoes.some(e => e.relacao == "Sintetizado por")
          ) {
            this.newSerie.df = "Eliminação";
          } else {
            this.newSerie.df = null;
          }
        }
      } else {
        if (this.newSerie.relacoes.some(e => e.relacao == "Complementar de")) {
          this.newSerie.df = "Conservação";
        } else {
          this.newSerie.df = null;
        }
      }
      // else {

      // }
    },
    remove_criterio(codigoClasse, tipo_criterio) {
      if (tipo_criterio == "Critério de Utilidade Administrativa") {
        let criterio = this.newSerie.justificacaoPCA.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio != undefined) {
          criterio.relacoes = criterio.relacoes.filter(e => e != codigoClasse);

          if (criterio.relacoes.length == 0) {
            this.newSerie.justificacaoPCA = this.newSerie.justificacaoPCA.filter(
              e => e.tipo != tipo_criterio
            );
          }
        }
      } else {
        let criterio = this.newSerie.justificacaoDF.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio != undefined) {
          criterio.relacoes = criterio.relacoes.filter(e => e != codigoClasse);

          if (criterio.relacoes.length == 0) {
            this.alteraDF(tipo_criterio);

            this.newSerie.justificacaoDF = this.newSerie.justificacaoDF.filter(
              e => e.tipo != tipo_criterio
            );
          }
        }
      }
    },
    remove: function(item) {
      if (item.relacao == "Suplemento para") {
        this.remove_criterio(
          item.serieRelacionada.codigo,
          "Critério de Utilidade Administrativa"
        );
      }

      if (item.relacao == "Complementar de") {
        this.remove_criterio(
          item.serieRelacionada.codigo,
          "Critério de Complementaridade Informacional"
        );
      }

      if (item.relacao == "Sintetizado por" || item.relacao == "Síntese de") {
        this.remove_criterio(
          item.serieRelacionada.codigo,
          "Critério de Densidade Informacional"
        );
      }

      this.newSerie.relacoes = this.newSerie.relacoes.filter(e => {
        return (
          e.relacao != item.relacao ||
          e.serieRelacionada.codigo != item.serieRelacionada.codigo
        );
      });
    },
    codigoIgual: function(v) {
      if (v == null || v == "") {
        return "Campo Obrigatório";
      } else {
        if (
          v == this.newSerie.codigo ||
          this.classes.some(
            e => e.codigo == v && e.tipo != "Série" && e.tipo != "Subsérie"
          )
        ) {
          return "Código Inválido";
        } else {
          return true;
        }
      }
    },
    add: async function() {
      this.alertOn = false;

      if (this.$refs.addRel.validate()) {
        if (!(await this.validateRelacao())) {
          // TRATAR DA JUSTIFICAÇÃO DO PCA
          if (this.rel == "Suplemento para") {
            this.adiciona_criterio(
              this.codrel,
              "Critério de Utilidade Administrativa",
              this.rel
            );
          }

          if (this.rel == "Complementar de") {
            this.adiciona_criterio(
              this.codrel,
              "Critério de Complementaridade Informacional",
              this.rel
            );
          }

          if (this.rel == "Sintetizado por" || this.rel == "Síntese de") {
            this.adiciona_criterio(
              this.codrel,
              "Critério de Densidade Informacional",
              this.rel
            );
          }

          this.newSerie.relacoes.push({
            relacao: this.rel,
            serieRelacionada: {
              codigo: this.codrel,
              tipo: this.tipoClasse
            }
          });

          this.$refs.addRel.reset();
          this.iscodvalido = false;
        } else {
          this.alertOn = true;
        }
      }
    },
    adiciona_criterio(codigoClasse, tipo_criterio, relacao) {
      if (tipo_criterio == "Critério de Utilidade Administrativa") {
        let criterio = this.newSerie.justificacaoPCA.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          this.newSerie.justificacaoPCA.push({
            tipo: tipo_criterio,
            nota: labels.textoCriterioUtilidadeAdministrativa,
            relacoes: [codigoClasse]
          });
        } else {
          criterio.relacoes.push(codigoClasse);
        }
      } else {
        let criterio = this.newSerie.justificacaoDF.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          let nota = "";

          switch (relacao) {
            case "Sintetizado por":
              if (
                !this.newSerie.justificacaoDF.some(
                  e => e.tipo == "Critério de Complementaridade Informacional"
                )
              ) {
                this.newSerie.df = "Eliminação";
              }
              nota = labels.textoCriterioDensidadeSinPor;
              break;
            case "Complementar de":
              this.newSerie.df = "Conservação";
              nota = labels.textoCriterioComplementaridade;
              break;
            case "Síntese de":
              this.newSerie.df = "Conservação";
              nota = labels.textoCriterioDensidadeSinDe;
              break;
          }

          this.newSerie.justificacaoDF.push({
            tipo: tipo_criterio,
            nota: nota,
            relacoes: [codigoClasse]
          });
        } else {
          criterio.relacoes.push(codigoClasse);
        }
      }
    },
    validateRelacao: function() {
      if (
        this.newSerie.relacoes.some(
          el => el.serieRelacionada.codigo == this.codrel
        )
      ) {
        return true;
      } else {
        if (this.rel == "Síntese de" || this.rel == "Sintetizado por") {
          let classe = this.classes.find(cl => cl.codigo == this.codrel);

          if (
            classe != undefined &&
            classe.relacoes.some(e => e.relacao == this.rel)
          ) {
            return true;
          }
        }
      }
      return false;
    }
  }
};
</script>
