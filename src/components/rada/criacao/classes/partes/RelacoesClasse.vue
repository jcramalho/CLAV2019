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
                <v-col sm="5" xs="12">
                  <v-autocomplete
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="rel"
                    :items="listaRelacoes"
                    label="Relação"
                    solo
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col sm="6" xs="12">
                  <v-combobox
                    :rules="[v => codigoIgual(v)]"
                    v-model="codrel"
                    :items="getCodigos"
                    label="Código"
                    solo
                    clearable
                  >
                    <!-- <template v-slot:item="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>
                    <template v-slot:selection="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>-->
                  </v-combobox>
                </v-col>
                <v-col sm="1" xs="12">
                  <v-btn icon text rounded @click="add()">
                    <v-icon color="green lighten-1">add_circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col sm="12" xs="12">
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
              </v-row>
              <v-row v-if="!!alertOn">
                <v-col>
                  <v-alert dismissible dense text type="error">Relação já existente!</v-alert>
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
    getCodigos() {
      return this.classes
        .filter(
          e =>
            e.codigo != this.newSerie.codigo &&
            (e.tipo == "Subsérie" || e.tipo == "Série")
        )
        .map(e => e.codigo);
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
    remove_crit_utilidade_adminstrativa(codigoClasse) {
      let criterio = this.newSerie.justificacaoPCA.find(
        crit => crit.tipo == "Critério de Utilidade Administrativa"
      );

      if (criterio != undefined) {
        criterio.relacoes = criterio.relacoes.filter(e => e != codigoClasse);

        if (criterio.relacoes.length == 0) {
          this.newSerie.justificacaoPCA = this.newSerie.justificacaoPCA.filter(
            e => e.tipo != "Critério de Utilidade Administrativa"
          );
        }
      }
    },
    remove: function(item) {
      if (item.relacao == "Suplemento para") {
        this.remove_crit_utilidade_adminstrativa(item.serieRelacionada.codigo);
      }

      if (item.relacao == "Complementar de") {
        this.remove_crit_complementaridade_informacional(
          item.serieRelacionada.codigo
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
            this.adiciona_crit_utilidade_adminstrativa(this.codrel);
          }

          if (this.rel == "Complementar de") {
            this.adiciona_crit_complementaridade_informacional(this.codrel);
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
          this.tipoClasse = null;
        } else {
          this.alertOn = true;
        }
      }
    },
    remove_crit_complementaridade_informacional(codigoClasse) {
      let criterio = this.newSerie.justificacaoDF.find(
        crit => crit.tipo == "Critério de Complementaridade Informacional"
      );

      if (criterio != undefined) {
        criterio.relacoes = criterio.relacoes.filter(e => e != codigoClasse);

        if (criterio.relacoes.length == 0) {
          this.newSerie.justificacaoDF = this.newSerie.justificacaoDF.filter(
            e => e.tipo != "Critério de Complementaridade Informacional"
          );
        }
      }
    },
    adiciona_crit_complementaridade_informacional(codigoClasse) {
      let criterio = this.newSerie.justificacaoDF.find(
        crit => crit.tipo == "Critério de Complementaridade Informacional"
      );

      if (criterio == undefined) {
        this.newSerie.justificacaoDF.push({
          tipo: "Critério de Complementaridade Informacional",
          nota: labels.textoCriterioComplementaridade,
          relacoes: [codigoClasse]
        });
      } else {
        criterio.relacoes.push(codigoClasse);
      }
    },
    adiciona_crit_utilidade_adminstrativa(codigoClasse) {
      let criterio = this.newSerie.justificacaoPCA.find(
        crit => crit.tipo == "Critério de Utilidade Administrativa"
      );

      if (criterio == undefined) {
        this.newSerie.justificacaoPCA.push({
          tipo: "Critério de Utilidade Administrativa",
          nota: labels.textoCriterioUtilidadeAdministrativa,
          relacoes: [codigoClasse]
        });
      } else {
        criterio.relacoes.push(codigoClasse);
      }
    },
    validateRelacao: function() {
      return this.newSerie.relacoes.some(el => {
        return (
          el.relacao == this.rel && el.serieRelacionada.codigo == this.codrel
        );
      });
    }
  }
};
</script>
