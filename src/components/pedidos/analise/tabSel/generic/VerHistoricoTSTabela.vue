<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Comparação de duas etapas
    </v-card-title>

    <v-card-text class="ma-0">
      <v-stepper v-model="etapa" alt-labels>
        <v-stepper-header>
          <!-- Step 1 -->
          <v-stepper-step :complete="etapa > 1" step="1">
            Etapas a comparar
          </v-stepper-step>

          <v-divider />

          <!-- Step 2 -->
          <v-stepper-step :complete="etapa > 2" step="2">
            Comparação
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="form">
              <v-select
                v-model="etapasSelecionadas"
                :items="etapasHistorico"
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
                  <v-alert type="info" width="99%" class="m-auto " outlined>
                    Sem mais dados a mostrar.
                  </v-alert>
                </template>
              </v-select>
              <!-- SELECIONAR PARTE -->
              <v-select
                v-model="parteTS"
                :items="['Informação Geral', 'Tabela de Seleção']"
                label="Escolha a componente da TS a comparar"
                filled
                :rules="[v => !!v || 'Campo obrigatório!']"
                clearable
                chips
                hide-selected
                deletable-chips
                class="m-2 mt-4"
              >
                <template slot="no-data">
                  <v-alert type="info" width="99%" class="m-auto" outlined
                    >Sem mais dados a mostrar.</v-alert
                  >
                </template>
              </v-select>

              <v-card outlined v-if="parteTS == 'Tabela de Seleção'">
                <v-card-text>
                  <v-col cols="2">
                    <div class="info-descricao">Classe</div>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="classe"
                      :items="historico[0].ts.classes.dados"
                      placeholder="Se desejar comparar uma classe da tabela de seleção, selecione uma"
                      filled
                      item-value="dados.codigo.dados"
                      clearable
                      chips
                      hide-selected
                      deletable-chips
                    >
                      <template v-slot:item="{ item }">{{
                        item.dados.codigo.dados +
                          " - " +
                          item.dados.titulo.dados
                      }}</template>
                      <template v-slot:selection="{ item }">
                        <v-chip close @click:close="classe = null">{{
                          item.dados.codigo.dados +
                            " - " +
                            item.dados.titulo.dados
                        }}</v-chip>
                      </template>
                      <template slot="no-data">
                        <v-alert type="info" width="99%" class="m-auto" outlined
                          >Sem mais dados a mostrar.</v-alert
                        >
                      </template>
                    </v-select>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-form>

            <v-btn
              class="mt-9"
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="gerarTabela()"
            >
              Continuar
            </v-btn>
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
                <template v-slot:[`item.campo`]="{ item }">
                  <span class="font-weight-bold"> {{ item.campo }}</span>
                </template>

                <template v-slot:[`item.colunaA`]="{ item }">
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
                  >
                    Campo não preenchido
                  </v-alert>

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
                    >
                      A lista está vazia.
                    </v-chip>

                    <ul v-else class="ma-0">
                      <span v-for="(dado, i) in item.colunaA.dados" :key="i">
                        <li>
                          {{ dado }}
                        </li>
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
                  >
                    {{ item.colunaA.dados }}
                  </v-alert>
                </template>

                <template v-slot:[`item.colunaB`]="{ item }">
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
                  >
                    Campo não preenchido
                  </v-alert>

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
                    >
                      A lista está vazia.
                    </v-chip>

                    <ul v-else class="ma-0">
                      <span v-for="(dado, i) in item.colunaB.dados" :key="i">
                        <li>
                          {{ dado }}
                        </li>
                      </span>
                    </ul>
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaB.cor)"
                    :icon="icons(item.colunaB.cor)"
                  >
                    {{ item.colunaB.dados }}
                  </v-alert>
                </template>
              </v-data-table>
            </v-card>

            <v-btn
              class="mt-5"
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="voltar()"
            >
              Voltar
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" rounded dark @click="fechar()">
        Fechar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapKeys, identificaItemEmTabela } from "@/utils/utils";

export default {
  props: ["historico", "distribuicao", "tipoPedido"],

  data() {
    return {
      dadosTabela: [],
      etapa: 1,
      etapasHistorico: [],
      etapasSelecionadas: [],
      defaultHeaders: [],
      footerProps: {
        "items-per-page-options": [-1]
      },
      parteTS: null,
      classe: null
    };
  },

  computed: {
    etapas() {
      return this.distribuicao.map(d => {
        if (d.estado !== "Distribuído" && d.estado !== "Redistribuído")
          return d;
      });
    }
  },

  created() {
    this.etapasHistorico = this.distribuicao;
  },

  methods: {
    novoItemAdicionado(item, lista, siglaOuCodigo) {
      return identificaItemEmTabela(item, lista, siglaOuCodigo);
    },

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
      this.etapasSelecionadas = [];

      this.etapa = 1;
    },

    gerarTabela() {
      if (this.$refs.form.validate()) {
        this.defaultHeaders.push({
          text: "Campo",
          value: "campo",
          class: "title",
          width: "20%",
          sortable: false
        });

        let indexA = this.distribuicao.findIndex(
          dist => dist === this.etapasSelecionadas[0]
        );
        let indexB = this.distribuicao.findIndex(
          dist => dist === this.etapasSelecionadas[1]
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
              sortable: false
            },
            {
              text: this.etapasSelecionadas[0],
              value: "colunaB",
              class: "title",
              width: "40%",
              sortable: false
            }
          );
        } else {
          this.defaultHeaders.push(
            {
              text: this.etapasSelecionadas[0],
              value: "colunaA",
              class: "title",
              width: "40%",
              sortable: false
            },
            {
              text: this.etapasSelecionadas[1],
              value: "colunaB",
              class: "title",
              width: "40%",
              sortable: false
            }
          );
        }

        let campos = [];

        switch (this.parteTS) {
          case "Informação Geral":
            this.tabelaInformacaoGeral(indexA, indexB);
            break;
          case "Tabela de Seleção":
            this.tabelaTS(indexA, indexB);
            break;
        }

        /* Object.keys(this.historico[indexA]).forEach(item => {
          if (item !== "estado" && item !== "id") campos.push(item);
        });

        campos.forEach(campo => {
          this.dadosTabela.push({
            campo: mapKeys(campo),
            colunaA: this.historico[indexA][campo],
            colunaB: this.historico[indexB][campo]
          });
        });*/

        this.etapa = 2;
      }
    },
    tabelaInformacaoGeral(indexA, indexB) {
      this.dadosTabela.push({
        campo: "Entidade Produtora",
        colunaA: this.historico[indexA].entProd,
        colunaB: this.historico[indexB].entProd
      });

      this.dadosTabela.push({
        campo: "Data de Submissão",
        colunaA: this.historico[indexA].data,
        colunaB: this.historico[indexB].data
      });

      if (this.tipoPedido == "TS Organizacional") {
        this.dadosTabela.push({
          campo: "Designação",
          colunaA: this.historico[indexA].designacao,
          colunaB: this.historico[indexB].designacao
        });

        if (
          this.historico[indexA].ts.entidade.dados != "" &&
          this.historico[indexB].ts.entidade.dados != ""
        ) {
          this.dadosTabela.push({
            campo: "Entidade",
            colunaA: this.historico[indexA].ts.entidade,
            colunaB: this.historico[indexB].ts.entidade
          });
        } else {
          this.dadosTabela.push({
            campo: "Entidade",
            colunaA: this.historico[indexA].ts.tipologia,
            colunaB: this.historico[indexB].ts.tipologia
          });
        }
      } else {
        this.dadosTabela.push({
          campo: "Designação",
          colunaA: this.historico[indexA].ts.designacao,
          colunaB: this.historico[indexB].ts.designacao
        });

        this.dadosTabela.push({
          campo: "Entidades",
          colunaA: {
            cor: this.historico[indexA].ts.entidades.cor,
            dados: this.historico[indexA].ts.entidades.dados.map(e => e.label),
            nota: this.historico[indexA].ts.entidades.nota
          },
          colunaB: {
            cor: this.historico[indexB].ts.entidades.cor,
            dados: this.historico[indexB].ts.entidades.dados.map(e => e.label),
            nota: this.historico[indexB].ts.entidades.nota
          }
        });
      }
    },
    tabelaTS(indexA, indexB) {
      if (!!this.classe) {
        let classA = this.historico[indexA].ts.classes.dados.find(
          e => e.dados.codigo.dados == this.classe
        );
        let classB = this.historico[indexB].ts.classes.dados.find(
          e => e.dados.codigo.dados == this.classe
        );

        this.dadosTabela.push({
          campo: "Estado",
          colunaA: {
            cor: classA.dados.status.cor,
            dados:
              classA.dados.status.dados == "A"
                ? "Ativa"
                : classA.dados.status.dados == "H"
                ? "Em revisão..."
                : "Inativa",
            nota: classA.dados.status.nota
          },
          colunaB: {
            cor: classB.dados.status.cor,
            dados:
              classB.dados.status.dados == "A"
                ? "Ativa"
                : classB.dados.status.dados == "H"
                ? "Em revisão..."
                : "Inativa",
            nota: classB.dados.status.nota
          }
        });

        this.dadosTabela.push({
          campo: "Descrição",
          colunaA: classA.dados.descricao,
          colunaB: classB.dados.descricao
        });

        this.dadosTabela.push({
          campo: "Notas de Aplicação",
          colunaA: {
            cor: classA.dados.notasAp.cor,
            dados: classA.dados.notasAp.dados.map(n => n.nota),
            nota: classA.dados.notasAp.nota
          },
          colunaB: {
            cor: classB.dados.notasAp.cor,
            dados: classB.dados.notasAp.dados.map(n => n.nota),
            nota: classB.dados.notasAp.nota
          }
        });

        this.dadosTabela.push({
          campo: "Exemplos de Notas de Aplicação",
          colunaA: {
            cor: classA.dados.exemplosNotasAp.cor,
            dados: classA.dados.exemplosNotasAp.dados.map(n => n.exemplo),
            nota: classA.dados.exemplosNotasAp.nota
          },
          colunaB: {
            cor: classB.dados.exemplosNotasAp.cor,
            dados: classB.dados.exemplosNotasAp.dados.map(n => n.exemplo),
            nota: classB.dados.exemplosNotasAp.nota
          }
        });

        this.dadosTabela.push({
          campo: "Notas de Exclusão",
          colunaA: {
            cor: classA.dados.notasEx.cor,
            dados: classA.dados.notasEx.dados.map(n => n.nota),
            nota: classA.dados.notasEx.nota
          },
          colunaB: {
            cor: classB.dados.notasEx.cor,
            dados: classB.dados.notasEx.dados.map(n => n.nota),
            nota: classB.dados.notasEx.nota
          }
        });

        this.dadosTabela.push({
          campo: "Termos de indice",
          colunaA: {
            cor: classA.dados.termosInd.cor,
            dados: classA.dados.termosInd.dados.map(n => n.termo),
            nota: classA.dados.termosInd.nota
          },
          colunaB: {
            cor: classB.dados.termosInd.cor,
            dados: classB.dados.termosInd.dados.map(n => n.termo),
            nota: classB.dados.termosInd.nota
          }
        });

        this.dadosTabela.push({
          campo: "Tipo de Processo",
          colunaA: classA.dados.tipoProc,
          colunaB: classB.dados.tipoProc
        });

        this.dadosTabela.push({
          campo: "Processo Transversal",
          colunaA: {
            cor: classA.dados.procTrans.cor,
            dados: classA.dados.procTrans.dados == "S" ? "Sim" : "Não",
            nota: classA.dados.procTrans.nota
          },
          colunaB: {
            cor: classB.dados.procTrans.cor,
            dados: classB.dados.procTrans.dados == "S" ? "Sim" : "Não",
            nota: classB.dados.procTrans.nota
          }
        });

        this.dadosTabela.push({
          campo: "Donos do processo",
          colunaA: {
            cor: classA.dados.donos.cor,
            dados: classA.dados.donos.dados.map(
              d => d.sigla + " - " + d.designacao
            ),
            nota: classA.dados.donos.nota
          },
          colunaB: {
            cor: classB.dados.donos.cor,
            dados: classB.dados.donos.dados.map(
              d => d.sigla + " - " + d.designacao
            ),
            nota: classB.dados.donos.nota
          }
        });

        this.dadosTabela.push({
          campo: "Participantes no processo",
          colunaA: {
            cor: classA.dados.participantes.cor,
            dados: classA.dados.participantes.dados.map(
              p => p.sigla + " - " + p.designacao + " (" + p.participLabel + ")"
            ),
            nota: classA.dados.participantes.nota
          },
          colunaB: {
            cor: classB.dados.participantes.cor,
            dados: classB.dados.participantes.dados.map(
              p => p.sigla + " - " + p.designacao + " (" + p.participLabel + ")"
            ),
            nota: classB.dados.participantes.nota
          }
        });

        this.dadosTabela.push({
          campo: "Legislação",
          colunaA: {
            cor: classA.dados.legislacao.cor,
            dados: classA.dados.legislacao.dados.map(
              l => `[${l.tipo} - ${l.numero}] - ${l.sumario}`
            ),
            nota: classA.dados.legislacao.nota
          },
          colunaB: {
            cor: classB.dados.legislacao.cor,
            dados: classB.dados.legislacao.dados.map(
              l => `[${l.tipo} - ${l.numero}] - ${l.sumario}`
            ),
            nota: classB.dados.legislacao.nota
          }
        });

        this.dadosTabela.push({
          campo: "Prazo do PCA",
          colunaA: {
            cor: classA.dados.pca.dados.valores.cor,
            dados:
              classA.dados.pca.dados.valores.dados == 1
                ? classA.dados.pca.dados.valores.dados + " ano"
                : classA.dados.pca.dados.valores.dados > 0
                ? classA.dados.pca.dados.valores.dados + " anos"
                : "Não específicado",
            nota: classA.dados.pca.dados.valores.nota
          },
          colunaB: {
            cor: classB.dados.pca.dados.valores.cor,
            dados:
              classB.dados.pca.dados.valores.dados == 1
                ? classB.dados.pca.dados.valores.dados + " ano"
                : classB.dados.pca.dados.valores.dados > 0
                ? classB.dados.pca.dados.valores.dados + " anos"
                : "Não específicado",
            nota: classB.dados.pca.dados.valores.nota
          }
        });

        this.dadosTabela.push({
          campo: "Notas ao PCA",
          colunaA: classA.dados.pca.dados.notas,
          colunaB: classB.dados.pca.dados.notas
        });

        this.dadosTabela.push({
          campo: "Forma de Contagem",
          colunaA: classA.dados.pca.dados.formaContagem,
          colunaB: classB.dados.pca.dados.formaContagem
        });

        this.dadosTabela.push({
          campo: "Subforma de Contagem",
          colunaA: classA.dados.pca.dados.subFormaContagem,
          colunaB: classB.dados.pca.dados.subFormaContagem
        });

        this.dadosTabela.push({
          campo: "Justificação do PCA",
          colunaA: {
            cor: classA.dados.pca.dados.justificacao.cor,
            dados: classA.dados.pca.dados.justificacao.dados.map(
              j => `${j.tipoId} : ${j.conteudo}`
            ),
            nota: classA.dados.pca.dados.justificacao.nota
          },
          colunaB: {
            cor: classB.dados.pca.dados.justificacao.cor,
            dados: classB.dados.pca.dados.justificacao.dados.map(
              j => `${j.tipoId} : ${j.conteudo}`
            ),
            nota: classB.dados.pca.dados.justificacao.nota
          }
        });

        this.dadosTabela.push({
          campo: "Destino final",
          colunaA: {
            cor: classA.dados.df.dados.valor.cor,
            dados:
              classA.dados.df.dados.valor.dados == "E"
                ? "Eliminação"
                : classA.dados.df.dados.valor.dados == "C"
                ? "Conservação"
                : classA.dados.df.dados.valor.dados == "CP"
                ? "Conservação Parcial"
                : "Não específicado",
            nota: classA.dados.df.dados.valor.nota
          },
          colunaB: {
            cor: classB.dados.df.dados.valor.cor,
            dados:
              classB.dados.df.dados.valor.dados == "E"
                ? "Eliminação"
                : classB.dados.df.dados.valor.dados == "C"
                ? "Conservação"
                : classB.dados.df.dados.valor.dados == "CP"
                ? "Conservação Parcial"
                : "Não específicado",
            nota: classB.dados.df.dados.valor.nota
          }
        });

        this.dadosTabela.push({
          campo: "Notas ao DF",
          colunaA: classA.dados.df.dados.nota,
          colunaB: classB.dados.df.dados.nota
        });

        this.dadosTabela.push({
          campo: "Justificação do DF",
          colunaA: {
            cor: classA.dados.df.dados.justificacao.cor,
            dados: classA.dados.df.dados.justificacao.dados.map(
              j => `${j.tipoId} : ${j.conteudo}`
            ),
            nota: classA.dados.df.dados.justificacao.nota
          },
          colunaB: {
            cor: classB.dados.df.dados.justificacao.cor,
            dados: classB.dados.df.dados.justificacao.dados.map(
              j => `${j.tipoId} : ${j.conteudo}`
            ),
            nota: classB.dados.df.dados.justificacao.nota
          }
        });
      } else {
        this.dadosTabela.push({
          campo: "Classes selecionadas",
          colunaA: {
            cor: this.historico[indexA].ts.classes.cor,
            dados: this.historico[indexA].ts.classes.dados.map(
              c => c.dados.codigo.dados + " - " + c.dados.titulo.dados
            ),
            nota: this.historico[indexA].ts.classes.nota
          },
          colunaB: {
            cor: this.historico[indexB].ts.classes.cor,
            dados: this.historico[indexB].ts.classes.dados.map(
              c => c.dados.codigo.dados + " - " + c.dados.titulo.dados
            ),
            nota: this.historico[indexB].ts.classes.nota
          }
        });
        if (this.tipoPedido == "TS Organizacional") {
          this.dadosTabela.push({
            campo: "Classes selecionadas como Dono",
            colunaA: {
              cor: this.historico[indexA].ts.classes.cor,
              dados: this.historico[indexA].ts.classes.dados
                .filter(c => c.dados.dono.dados)
                .map(c => c.dados.codigo.dados + " - " + c.dados.titulo.dados),
              nota: this.historico[indexA].ts.classes.nota
            },
            colunaB: {
              cor: this.historico[indexB].ts.classes.cor,
              dados: this.historico[indexB].ts.classes.dados
                .filter(c => c.dados.dono.dados)
                .map(c => c.dados.codigo.dados + " - " + c.dados.titulo.dados),
              nota: this.historico[indexB].ts.classes.nota
            }
          });

          this.dadosTabela.push({
            campo: "Classes Participantes",
            colunaA: {
              cor: this.historico[indexA].ts.classes.cor,
              dados: this.historico[indexA].ts.classes.dados
                .filter(c => c.dados.participante.dados != "NP")
                .map(
                  c => c.dados.codigo.dados + " - " + c.dados.participante.dados
                ),
              nota: this.historico[indexA].ts.classes.nota
            },
            colunaB: {
              cor: this.historico[indexB].ts.classes.cor,
              dados: this.historico[indexB].ts.classes.dados
                .filter(c => c.dados.participante.dados != "NP")
                .map(
                  c => c.dados.codigo.dados + " - " + c.dados.participante.dados
                ),
              nota: this.historico[indexB].ts.classes.nota
            }
          });
        } else {
          this.dadosTabela.push({
            campo: "Classes selecionadas como Dono",
            colunaA: {
              cor: this.historico[indexA].ts.classes.cor,
              dados: this.historico[indexA].ts.classes.dados.map(
                c =>
                  c.dados.codigo.dados +
                  " - " +
                  c.dados.entidades.dados.filter(e => e.dono).map(e => e.sigla)
              ),

              nota: this.historico[indexA].ts.classes.nota
            },
            colunaB: {
              cor: this.historico[indexB].ts.classes.cor,
              dados: this.historico[indexB].ts.classes.dados.map(
                c =>
                  c.dados.codigo.dados +
                  " - " +
                  c.dados.entidades.dados.filter(e => e.dono).map(e => e.sigla)
              ),

              nota: this.historico[indexB].ts.classes.nota
            }
          });
          this.dadosTabela.push({
            campo: "Classes Participantes",
            colunaA: {
              cor: this.historico[indexA].ts.classes.cor,
              dados: this.historico[indexA].ts.classes.dados.map(
                c =>
                  c.dados.codigo.dados +
                  " - " +
                  c.dados.entidades.dados
                    .filter(e => e.participante != "NP")
                    .map(e => e.sigla + " (" + e.participante + ") ")
              ),

              nota: this.historico[indexA].ts.classes.nota
            },
            colunaB: {
              cor: this.historico[indexB].ts.classes.cor,
              dados: this.historico[indexB].ts.classes.dados.map(
                c =>
                  c.dados.codigo.dados +
                  " - " +
                  c.dados.entidades.dados
                    .filter(e => e.participante != "NP")
                    .map(e => e.sigla + " (" + e.participante + ") ")
              ),

              nota: this.historico[indexB].ts.classes.nota
            }
          });
        }
      }
    },

    fechar() {
      this.voltar();

      this.$emit("fecharDialog");
    }
  }
};
</script>
