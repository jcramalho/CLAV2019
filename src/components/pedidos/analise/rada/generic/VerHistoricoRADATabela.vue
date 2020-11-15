<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>Comparação de duas etapas</v-card-title>

    <v-card-text class="ma-0">
      <v-stepper v-model="etapa" alt-labels>
        <v-stepper-header>
          <!-- Step 1 -->
          <v-stepper-step :complete="etapa > 1" step="1">Etapas a comparar</v-stepper-step>

          <v-divider />

          <!-- Step 2 -->
          <v-stepper-step :complete="etapa > 2" step="2">Comparação</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="form">
              <!-- SELECIONAR ETAPAS -->
              <v-select
                v-model="etapasSelecionadas"
                :items="etapasHistorico"
                :rules="[v => !!v[0] && v.length == 2 || 'Campo obrigatório! Tem que selecionar duas etapas.']"
                label="Escolha duas etapas a comparar"
                filled
                clearable
                multiple
                chips
                hide-selected
                deletable-chips
                class="m-2 mt-4"
              >
                <template slot="no-data">
                  <v-alert type="info" width="99%" class="m-auto" outlined>Sem mais dados a mostrar.</v-alert>
                </template>
              </v-select>

              <!-- SELECIONAR PARTE -->
              <v-select
                v-model="parteRADA"
                :items="['Informação Geral', 'Relatório Expositivo', 'Tabela de Seleção']"
                label="Escolha a componente do RADA a comparar"
                filled
                :rules="[v => !!v || 'Campo obrigatório!']"
                clearable
                chips
                hide-selected
                deletable-chips
                class="m-2 mt-4"
              >
                <template slot="no-data">
                  <v-alert type="info" width="99%" class="m-auto" outlined>Sem mais dados a mostrar.</v-alert>
                </template>
              </v-select>
              <!-- {{ historico[0].tsRada.classes.dados }} -->
              <v-card outlined v-if="parteRADA == 'Tabela de Seleção'">
                <!-- SELECIONAR CLASSE -->

                <v-card-text>
                  <v-row v-if="parteRADA == 'Tabela de Seleção' && !Boolean(ui)">
                    <v-col cols="2">
                      <div class="info-descricao">Classe</div>
                    </v-col>
                    <v-col>
                      <v-select
                        v-model="classe"
                        :items="historico[0].tsRada.classes.dados"
                        placeholder="Se desejar comparar uma classe da tabela de seleção, selecione uma"
                        filled
                        item-value="dados.codigo.dados"
                        clearable
                        chips
                        hide-selected
                        deletable-chips
                      >
                        <template
                          v-slot:item="{ item }"
                        >{{ item.dados.codigo.dados + " - " + item.dados.titulo.dados }}</template>
                        <template v-slot:selection="{ item }">
                          <v-chip
                            close
                            @click:close="classe = null"
                          >{{ item.dados.codigo.dados + " - " + item.dados.titulo.dados }}</v-chip>
                        </template>
                        <template slot="no-data">
                          <v-alert
                            type="info"
                            width="99%"
                            class="m-auto"
                            outlined
                          >Sem mais dados a mostrar.</v-alert>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                  <!-- SELECIONAR UI -->
                  <v-row v-if="parteRADA == 'Tabela de Seleção' && !Boolean(classe)">
                    <v-col cols="2">
                      <div class="info-descricao">Unidade de Instalação</div>
                    </v-col>
                    <v-col>
                      <v-select
                        v-model="ui"
                        :items="historico[0].tsRada.UIs.dados"
                        placeholder="Se desejar comparar uma unidade de instalação da tabela de seleção, selecione uma"
                        filled
                        item-value="dados.codigo.dados"
                        clearable
                        chips
                        hide-selected
                        deletable-chips
                      >
                        <template
                          v-slot:item="{ item }"
                        >{{ item.dados.codigo.dados + " - " + item.dados.titulo.dados }}</template>
                        <template v-slot:selection="{ item }">
                          <v-chip
                            close
                            @click:close="ui = null"
                          >{{ item.dados.codigo.dados + " - " + item.dados.titulo.dados }}</v-chip>
                        </template>
                        <template slot="no-data">
                          <v-alert
                            type="info"
                            width="99%"
                            class="m-auto"
                            outlined
                          >Sem mais dados a mostrar.</v-alert>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-form>

            <v-btn class="mt-9" color="primary" @click="gerarTabela()">Continuar</v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card class="ma-1">
              <v-data-table
                v-if="defaultHeaders.length !== 0"
                :headers="defaultHeaders"
                :items="dadosTabela"
                hide-default-footer
                calculate-widths
                class="elevation-1"
                :footer-props="footerProps"
              >
                <template v-slot:item.campo="{ item }">
                  <span class="font-weight-bold">{{ item.campo }}</span>
                </template>

                <template v-slot:item.colunaA="{ item }">
                  <v-alert
                    v-if="
                      item.colunaA === undefined ||
                        item.colunaA.dados === '' ||
                        item.colunaA.dados === null
                    "
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    color="grey"
                    icon="not_interested"
                  >Campo não preenchido</v-alert>

                  <v-alert
                    v-else-if="item.colunaA.dados instanceof Array"
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaA.cor)"
                    :icon="icons(item.colunaA.cor)"
                  >
                    <v-chip
                      v-if="item.colunaA.dados.length === 0"
                      color="grey"
                      label
                      outlined
                    >A lista está vazia.</v-chip>

                    <ul v-else class="ma-0">
                      <span v-for="(dado, i) in item.colunaA.dados" :key="i">
                        <li>{{ dado }}</li>
                      </span>
                    </ul>
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaA.cor)"
                    :icon="icons(item.colunaA.cor)"
                  >{{ item.colunaA.dados }}</v-alert>
                </template>

                <template v-slot:item.colunaB="{ item }">
                  <v-alert
                    v-if="
                      item.colunaB === undefined ||
                        item.colunaB.dados === '' ||
                        item.colunaB.dados === null
                    "
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    color="grey"
                    icon="not_interested"
                  >Campo não preenchido</v-alert>

                  <v-alert
                    v-else-if="item.colunaB.dados instanceof Array"
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaB.cor)"
                    :icon="icons(item.colunaB.cor)"
                  >
                    <v-chip
                      v-if="item.colunaB.dados.length === 0"
                      color="grey"
                      label
                      outlined
                    >A lista está vazia.</v-chip>

                    <ul v-else class="ma-0">
                      <li v-for="(dado, i) in item.colunaB.dados" :key="i">{{ dado }}</li>
                    </ul>
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaB.cor)"
                    :icon="icons(item.colunaB.cor)"
                  >{{ item.colunaB.dados }}</v-alert>
                </template>
              </v-data-table>
            </v-card>

            <v-btn
              class="mt-5"
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="voltar()"
            >Voltar</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" rounded dark @click="fechar()">Fechar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapKeysRADA } from "@/utils/utils";

export default {
  props: ["historico", "distribuicao", "tipoPedido"],

  data() {
    return {
      dadosTabela: [],
      etapa: 1,
      etapasHistorico: [],
      classe: null,
      ui: null,
      parteRADA: null,
      etapasSelecionadas: [],
      defaultHeaders: [],
      footerProps: {
        "items-per-page-options": [-1],
      },
      formaContagem: [],
    };
  },

  computed: {
    etapas() {
      return this.distribuicao.map((d) => {
        if (d.estado !== "Distribuído" && d.estado !== "Redistribuído")
          return d;
      });
    },
  },

  async created() {
    this.etapasHistorico = this.distribuicao.filter(e => e != 'Validado');

    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem = responseFC.data.map((item) => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1],
      };
    });
  },

  methods: {
    cores(cor) {
      let retornaCor;

      switch (cor) {
        case "verde":
          retornaCor = "green";
          break;

        case "amarelo":
          retornaCor = "orange";
          break;

        case "vermelho":
          retornaCor = "red";
          break;

        default:
          break;
      }

      return retornaCor;
    },

    icons(cor) {
      let retornaIcon;

      switch (cor) {
        case "verde":
          retornaIcon = "done";
          break;

        case "amarelo":
          retornaIcon = "create";
          break;

        case "vermelho":
          retornaIcon = "clear";
          break;

        default:
          break;
      }

      return retornaIcon;
    },

    voltar() {
      this.defaultHeaders = [];
      this.dadosTabela = [];
      this.etapa = 1;
    },

    gerarTabela() {
      if (this.$refs.form.validate()) {
        this.defaultHeaders.push({
          text: "Campo",
          value: "campo",
          class: "title",
          width: "20%",
          sortable: false,
        });

        let indexA = this.distribuicao.findIndex(
          (dist) => dist === this.etapasSelecionadas[0]
        );
        let indexB = this.distribuicao.findIndex(
          (dist) => dist === this.etapasSelecionadas[1]
        );

        if (indexA > indexB) {
          let temporario = indexA;
          indexA = indexB;
          indexB = temporario;

          this.defaultHeaders.push(
            {
              text: this.etapasSelecionadas[1],
              value: "colunaA",
              class: "title",
              width: "40%",
              sortable: false,
            },
            {
              text: this.etapasSelecionadas[0],
              value: "colunaB",
              class: "title",
              width: "40%",
              sortable: false,
            }
          );
        } else {
          this.defaultHeaders.push(
            {
              text: this.etapasSelecionadas[0],
              value: "colunaA",
              class: "title",
              width: "40%",
              sortable: false,
            },
            {
              text: this.etapasSelecionadas[1],
              value: "colunaB",
              class: "title",
              width: "40%",
              sortable: false,
            }
          );
        }

        switch (this.parteRADA) {
          case "Informação Geral":
            this.tabelaInformacaoGeral(indexA, indexB);
            break;
          case "Relatório Expositivo":
            this.tabelaRE(indexA, indexB);
            break;
          case "Tabela de Seleção":
            this.tabelaTS(indexA, indexB);
            break;
        }
        this.etapa = 2;
      }
    },
    tabelaInformacaoGeral(indexA, indexB) {
      this.dadosTabela.push({
        campo: "Título",
        colunaA: this.historico[indexA].titulo,
        colunaB: this.historico[indexB].titulo,
      });

      this.dadosTabela.push({
        campo: "Entidades Responsáveis",
        colunaA: this.historico[indexA].entRes,
        colunaB: this.historico[indexB].entRes,
      });
    },
    tabelaRE(indexA, indexB) {
      let campos = [];
      Object.keys(this.historico[indexA].RE).forEach((item) => {
        campos.push(item);
      });

      campos.forEach((campo) => {
        this.dadosTabela.push({
          campo: mapKeysRADA(campo),
          colunaA: this.historico[indexA].RE[campo],
          colunaB: this.historico[indexB].RE[campo],
        });
      });
    },
    tabelaTS(indexA, indexB) {
      // PROCESSAR A TABELA PARA UMA CLASSE
      if (!!this.classe) {
        let findA = this.historico[indexA].tsRada.classes.dados.find(
          (e) => e.dados.codigo.dados == this.classe
        );
        let findB = this.historico[indexB].tsRada.classes.dados.find(
          (e) => e.dados.codigo.dados == this.classe
        );

        let campos = [];
        Object.keys(findA.dados).forEach((item) => {
          switch (item) {
            case "suporte_e_medicao":
              this.dadosTabela.push({
                campo: mapKeysRADA(item),
                colunaA: {
                  cor: findA.dados[item].cor,
                  dados: findA.dados[item].dados.map(
                    (e) => e.suporte + " -  " + e.medicao
                  ),
                  nota: findA.dados[item].nota,
                },
                colunaB: {
                  cor: findB.dados[item].cor,
                  dados: findB.dados[item].dados.map(
                    (e) => e.suporte + " -  " + e.medicao
                  ),
                  nota: findB.dados[item].nota,
                },
              });
              break;
            case "relacoes":
              this.dadosTabela.push({
                campo: mapKeysRADA(item),
                colunaA: {
                  cor: findA.dados[item].cor,
                  dados: findA.dados[item].dados.map(
                    (e) => e.relacao + " " + e.serieRelacionada.codigo + ";"
                  ),
                  nota: findA.dados[item].nota,
                },
                colunaB: {
                  cor: findB.dados[item].cor,
                  dados: findB.dados[item].dados.map(
                    (e) => e.relacao + " " + e.serieRelacionada.codigo + ";"
                  ),
                  nota: findB.dados[item].nota,
                },
              });
              break;
            case "legislacao":
              this.dadosTabela.push({
                campo: mapKeysRADA(item),
                colunaA: {
                  cor: findA.dados[item].cor,
                  dados: findA.dados[item].dados.map((e) => e.legislacao),
                  nota: findA.dados[item].nota,
                },
                colunaB: {
                  cor: findB.dados[item].cor,
                  dados: findB.dados[item].dados.map((e) => e.legislacao),
                  nota: findB.dados[item].nota,
                },
              });
              break;
            case "formaContagem":
              this.dadosTabela.push({
                campo: "Forma de Contagem",
                colunaA: {
                  cor: findA.dados[item].forma.cor,
                  dados: this.formaContagem.find(
                    (e) => e.value == findA.dados[item].forma.dados
                  ).label,
                  nota: findA.dados[item].forma.nota,
                },
                colunaB: {
                  cor: findB.dados[item].forma.cor,
                  dados: this.formaContagem.find(
                    (e) => e.value == findB.dados[item].forma.dados
                  ).label,
                  nota: findB.dados[item].forma.nota,
                },
              });

              this.dadosTabela.push({
                campo: "Subforma de Contagem",
                colunaA: {
                  cor: findA.dados[item].subforma.cor,
                  dados: findA.dados[item].subforma.dados,
                  nota: findA.dados[item].subforma.nota,
                },
                colunaB: {
                  cor: findB.dados[item].subforma.cor,
                  dados: findB.dados[item].subforma.dados,
                  nota: findB.dados[item].subforma.nota,
                },
              });
              break;
            case "justificacaoDF":
            case "justificacaoPCA":
              this.dadosTabela.push({
                campo: mapKeysRADA(item),
                colunaA: {
                  cor: findA.dados[item].cor,
                  dados: findA.dados[item].dados.map(
                    (e) =>
                      `${e.tipo}: ${
                        !!e.nota ? e.nota : "[Nota não preenchida]"
                      }\n ${
                        !!e.relacoes
                          ? e.relacoes
                              .map((f) => (!!f.codigo ? f.codigo : f))
                              .toString()
                          : ""
                      }`
                  ),
                  nota: findA.dados[item].nota,
                },
                colunaB: {
                  cor: findB.dados[item].cor,
                  dados: findB.dados[item].dados.map(
                    (e) =>
                      `${e.tipo}: ${
                        !!e.nota ? e.nota : "[Nota não preenchida]"
                      }\n ${
                        !!e.relacoes
                          ? e.relacoes
                              .map((f) => (!!f.codigo ? f.codigo : f))
                              .toString()
                          : ""
                      }`
                  ),
                  nota: findB.dados[item].nota,
                },
              });
              break;
            default:
              if (item !== "id") {
                campos.push(item);
              }
              break;
          }
        });

        campos.forEach((campo) => {
          this.dadosTabela.push({
            campo: mapKeysRADA(campo),
            colunaA: findA.dados[campo],
            colunaB: findB.dados[campo],
          });
        });

        // PROCESSAR A TABELA PARA UMA UI
      } else if (!!this.ui) {
        let findA = this.historico[indexA].tsRada.UIs.dados.find(
          (e) => e.dados.codigo.dados == this.ui
        );
        let findB = this.historico[indexB].tsRada.UIs.dados.find(
          (e) => e.dados.codigo.dados == this.ui
        );

        let campos = [];
        Object.keys(findA.dados).forEach((item) => {
          switch (item) {
            case "produtor":
              if (findA.dados[item].dados.entProdutoras.length > 0) {
                this.dadosTabela.push({
                  campo: "Entidades Produtoras",
                  colunaA: {
                    cor: findA.dados[item].cor,
                    dados: findA.dados[item].dados.entProdutoras,
                    nota: findA.dados[item].nota,
                  },
                  colunaB: {
                    cor: findB.dados[item].cor,
                    dados: findB.dados[item].dados.entProdutoras,
                    nota: findB.dados[item].nota,
                  },
                });
              } else {
                this.dadosTabela.push({
                  campo: "Tipologia Produtora",
                  colunaA: {
                    cor: findA.dados[item].cor,
                    dados: findA.dados[item].dados.tipologiasProdutoras,
                    nota: findA.dados[item].nota,
                  },
                  colunaB: {
                    cor: findB.dados[item].cor,
                    dados: findB.dados[item].dados.tipologiasProdutoras,
                    nota: findB.dados[item].nota,
                  },
                });
              }
              break;
            case "classesAssociadas":
              this.dadosTabela.push({
                campo: "Classes Associadas",
                colunaA: {
                  cor: findA.dados[item].cor,
                  dados: findA.dados[item].dados.map((e) => e.codigo),
                  nota: findA.dados[item].nota,
                },
                colunaB: {
                  cor: findB.dados[item].cor,
                  dados: findB.dados[item].dados.map((e) => e.codigo),
                  nota: findB.dados[item].nota,
                },
              });
              break;
            default:
              if (item !== "id") {
                campos.push(item);
              }
              break;
          }
        });

        campos.forEach((campo) => {
          this.dadosTabela.push({
            campo: mapKeysRADA(campo),
            colunaA: findA.dados[campo],
            colunaB: findB.dados[campo],
          });
        });
        // PROCESSAR A TABELA PARA APENAS O TITULO DA TS
      } else {
        this.dadosTabela.push({
          campo: "Título Tabela de Seleção",
          colunaA: this.historico[indexA].tsRada.titulo,
          colunaB: this.historico[indexB].tsRada.titulo,
        });
      }
    },
    fechar() {
      this.voltar();

      this.$emit("fecharDialog");
    },
  },
};
</script>
