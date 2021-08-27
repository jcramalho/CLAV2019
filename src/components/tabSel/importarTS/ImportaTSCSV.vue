<template>
  <v-card flat class="pa-3">
    <v-row align="center" justify="center">
      <v-col cols="12" md="3" align="center"> <Voltar /> </v-col>
      <v-col cols="12" md="6" align="center">
        <p class="clav-content-title-1">Importar Tabela de Seleção</p>
      </v-col>
      <v-col cols="0" md="3"> </v-col>
    </v-row>

    <!-- CONTENT -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <p class="content-text">Pretende importar múltiplos ficheiros:</p>
        <v-row justify="center">
          <v-tooltip top color="info" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-checkbox
                class="py-5 mt-5"
                v-model="multImport"
                label="Importar em lote"
                v-on="on"
              ></v-checkbox>
            </template>
            <span> Fonte de legitimação</span>
          </v-tooltip>
        </v-row>
        <p class="content-text">
          Selecione a fonte de legitimação da Tabela de Seleção a importar:
        </p>
        <v-row justify="center">
          <v-tooltip top color="info" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-radio-group
                class="py-5 mt-5"
                v-model="fonteLegitimacao"
                :rules="[
                  (v) => !!v || 'Tem de escolher uma fonte de legitimação',
                ]"
                required
                row
                @change="fonteL"
                v-on="on"
              >
                <v-radio
                  label="PGD/LC"
                  color="primary"
                  value="PGD/LC"
                ></v-radio>
                <v-radio label="PGD" color="primary" value="PGD"></v-radio>
                <v-radio label="RADA" color="primary" value="RADA"></v-radio>
              </v-radio-group>
            </template>
            <span> Fonte de legitimação</span>
          </v-tooltip>
        </v-row>
        <p class="content-text">Selecione o tipo de Tabela de Seleção:</p>
        <v-row justify="center">
          <v-tooltip top color="info" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-radio-group
                :items="['Organizacional', 'Pluriorganizacional']"
                required
                v-model="tipo"
                row
                v-on="on"
                class="py-5 mt-5"
                @change="
                  {
                    entidade_tipologia = [];
                    if (
                      tipo == 'Pluriorganizacional' &&
                      fonteLegitimacao != 'RADA'
                    ) {
                      designacao = 'Tabela de Seleção Pluriorganizacional...';
                    } else if (
                      tipo == 'Organizacional' &&
                      fonteLegitimacao != 'RADA'
                    ) {
                      designacao = null;
                    }
                  }
                "
              >
                <v-radio
                  label="Organizacional"
                  color="primary"
                  value="Organizacional"
                ></v-radio>
                <v-radio
                  label="Pluriorganizacional"
                  color="primary"
                  value="Pluriorganizacional"
                ></v-radio>
              </v-radio-group>
            </template>

            <span> Tipo da Tabela de Seleção</span>
          </v-tooltip>
        </v-row>
        <div v-if="tipo != null">
          <div class="pa-0 ma-0" v-if="!multImport && tipo == 'Organizacional'">
            <p class="content-text">
              Identifique a entidade ou tipologia da Tabela de Seleção:
            </p>
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-autocomplete
                  v-on="on"
                  v-if="tipo == 'Organizacional'"
                  v-model="entidade_tipologia"
                  class="my-4 mx-15"
                  color="primary"
                  :items="entidades_tipologias"
                  label="Entidade/Tipologia"
                  hide-details
                  clearable
                  single-line
                  @change="
                    if (fonteLegitimacao != 'RADA')
                      designacao = `Tabela de Seleção de ${entidade_tipologia}`;
                    if (entidade_tipologia == undefined) designacao = null;
                  "
                >
                </v-autocomplete>
              </template>

              <span> Entidade ou tipologia da Tabela de Seleção</span>
            </v-tooltip>
          </div>
          <div class="pa-0 ma-0" v-else-if="!multImport">
            <p class="content-text">
              Identifique as entidades e tipologias da Tabela de Seleção:
            </p>
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-autocomplete
                  v-model="entidade_tipologia"
                  color="primary"
                  class="my-4 mx-15"
                  :items="entidades_tipologias"
                  label="Entidades/Tipologias"
                  hide-details
                  clearable
                  single-line
                  v-on="on"
                  multiple
                >
                </v-autocomplete>
              </template>

              <span> Entidades e tipologias da Tabela de Seleção</span>
            </v-tooltip>
          </div>
          <div v-if="!multImport">
            <p class="content-text">
              Insira a designação para a Tabela de Seleção:
            </p>
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="my-4 mx-15"
                  color="primary"
                  v-on="on"
                  clearable
                  single-line
                  hide-details
                  v-model="designacao"
                  label="Designação da Tabela de Seleção"
                ></v-text-field>
              </template>

              <span> Designação da Tabela de Seleção</span>
            </v-tooltip>
          </div>

          <p class="content-text">
            Selecione o ficheiro com a Tabela de Seleção a importar:
          </p>
          <v-tooltip top color="info" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-file-input
                v-model="file"
                class="my-4 mx-15"
                placeholder="Selecione o ficheiro CSV/Excel com a Tabela de Seleção"
                show-size
                accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :multiple="multImport ? true : false"
                v-on="on"
                truncate-length="100"
                color="primary"
                hide-details
                single-line
              ></v-file-input>
            </template>
            <span> Ficheiro com a Tabela de Seleção a importar</span>
          </v-tooltip>

          <v-card id="info-import-file" class="mx-auto pa-4 content-text">
            <div v-if="tipo == 'Organizacional'">
              <b>Caso o ficheiro seja CSV deve respeitar o seguinte:</b>

              <ul class="px-9 pt-3">
                <li>Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'</li>
                <li>O quote e o escape são realizados através de "</li>
                <li>O encoding do ficheiro tem de ser UTF-8</li>
              </ul>

              <b>
                O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma sheet em
                que tenha:</b
              >

              <ul class="px-9 pt-3">
                <li>Uma coluna 'Código' com os códigos dos processos</li>
                <li>Uma coluna 'Título' com os títulos dos processos</li>
                <li>
                  Uma coluna 'Dono' com:
                  <ul>
                    <li>x ou X nos processos selecionados</li>
                    <li>Nada para os processos não selecionados</li>
                  </ul>
                </li>
                <li>
                  Uma coluna 'Participante' com o tipo de participação:
                  <ul>
                    <li>Apreciador</li>
                    <li>Assessor</li>
                    <li>Comunicador</li>
                    <li>Decisor</li>
                    <li>Executor</li>
                    <li>Iniciador</li>
                    <li>Nada para os processos não selecionados</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div v-if="tipo == 'Pluriorganizacional'">
              <b>Caso o ficheiro seja CSV deve respeitar o seguinte:</b>

              <ul class="px-9 pt-3 pb-4">
                <li>Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'</li>
                <li>O quote e o escape são realizados através de "</li>
                <li>O encoding do ficheiro tem de ser UTF-8</li>
              </ul>

              <b
                >O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma sheet
                em que tenha:</b
              >

              <ul class="px-9 pt-3">
                <li>Uma coluna 'Código' com os códigos dos processos</li>
                <li>Uma coluna 'Título' com os títulos dos processos</li>
                <li>
                  Uma coluna 'Dono' com as siglas das entidades/tipologias que
                  são donas separadas por '#'
                </li>
                <li>
                  Uma coluna 'Participante' com as siglas das
                  entidades/tipologias que são donas separadas por '#'
                </li>
                <li>
                  Uma coluna 'Tipo de participação' com os tipos de participação
                  das entidades/tipologias referidas na coluna 'Participante'
                  separados por '#'
                </li>
                <li>
                  Os tipos de participação válidos são:
                  <ul>
                    <li>Apreciador</li>
                    <li>Assessor</li>
                    <li>Comunicador</li>
                    <li>Decisor</li>
                    <li>Executor</li>
                    <li>Iniciador</li>
                  </ul>
                </li>
              </ul>
            </div>
          </v-card>
        </div>
        <div class="text-center mt-6">
          <v-progress-linear
            class="my-2 white--text"
            v-if="loading && multImport"
            :value="(progresso * 100) / total"
            color="primary"
            height="25"
          >
            <template v-slot:default="{}">
              <strong>
                A Processar: {{ fileName }} - {{ progresso }}/{{
                  total
                }}
                Ficheiros</strong
              >
            </template>
          </v-progress-linear>
          <v-btn
            v-if="
              (multImport && (fonteLegitimacao == null || file.length < 2)) ||
              (tipo == 'Organizacional' &&
                !multImport &&
                (designacao == null ||
                  file.length == 0 ||
                  tipo == null ||
                  fonteLegitimacao == null ||
                  entidade_tipologia == null ||
                  !entidade_tipologia.length)) ||
              (tipo == 'Pluriorganizacional' &&
                !multImport &&
                (designacao == null ||
                  file.length == 0 ||
                  tipo == null ||
                  fonteLegitimacao == null))
            "
            disabled
            rounded
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            class="mb-6"
            id="botao-shadow"
          >
            <unicon
              name="importar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 18.121"
              fill="#b8b8b8"
            />
            <p class="ml-2">Importar</p>
          </v-btn>

          <v-btn
            v-else
            @click="enviarFicheiro()"
            :loading="loading"
            rounded
            class="white--text clav-linear-background"
          >
            <unicon
              name="importar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 18.121"
              fill="#ffffff"
            />
            <p class="ml-2">Importar</p>
          </v-btn>
        </div>

        <v-dialog v-model="erroDialog" persistent max-width="60%">
          <v-card class="info-card">
            <v-card-title class="headline mb-2 white--text">
              Não foi possível criar o pedido de criação de tabela de
              seleção</v-card-title
            >

            <div class="info-content-card px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <v-expansion-panels accordion>
                  <v-expansion-panel v-for="(item, i) in erro" :key="i">
                    <v-expansion-panel-header
                      class="clav-linear-background white--text"
                      >{{ item.file }}</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <ol>
                        <li v-for="(erro, j) in item.errors" :key="j">
                          <span class="red--text text--darken-5">{{
                            erro.msg
                          }}</span>
                        </li>
                      </ol>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-4"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="erroDialog = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="successDialog" persistent max-width="60%">
          <v-card class="info-card">
            <v-card-title class="headline mb-2 white--text">
              {{
                !multImport
                  ? "Pedido de criação de tabela de seleção criado com sucesso"
                  : "Resumo dos pedidos de criação de tabelas de seleção"
              }}
            </v-card-title>
            <div class="info-content-card px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <v-expansion-panels v-if="multImport" accordion>
                  <v-expansion-panel
                    v-for="(item, i) in multImportList"
                    :key="i"
                  >
                    <v-expansion-panel-header
                      :class="
                        item.errors
                          ? 'clav-linear-background red--text'
                          : 'clav-linear-background white--text'
                      "
                      >{{ item.file }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <ol v-if="item.errors">
                        <li v-for="(erro, j) in item.errors" :key="j">
                          <span class="red--text text--darken-5">{{
                            erro.msg
                          }}</span>
                        </li>
                      </ol>
                      <span v-else
                        >Código do pedido: {{ item.id }}
                        <p>Estatísticas:</p>
                        <ol>
                          <li>{{ loadStats(item.stats) }}</li>
                        </ol>
                        <v-btn
                          v-if="multImport"
                          color="success darken-1"
                          rounded
                          dark
                          elevation="0"
                          class="px-4"
                          @click="seguirPedido(item.id)"
                        >
                          Seguir Pedido
                        </v-btn></span
                      >
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <div v-else>
                  Código do pedido: {{ codigo }}
                  <p>Estatísticas:</p>
                  <ol>
                    <li>{{ loadStats(stats) }}</li>
                  </ol>
                </div>
              </v-card-text>
            </div>
            <v-card-actions>
              <v-btn
                color="red darken-4"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="goBack"
              >
                Voltar
              </v-btn>
              <v-btn
                color="primary darken-1"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="voltar"
              >
                Importar mais
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="!multImport"
                color="success darken-1"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="seguirPedido()"
              >
                Seguir Pedido
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogConfirmacao.visivel"
          persistent
          max-width="60%"
        >
          <v-card dark class="info-card">
            <v-card-title class="headline mb-2">
              Não foi possível criar o pedido de criação de tabela de
              seleção</v-card-title
            >
            <div class="info-content-card px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <p class="error--text">{{ dialogConfirmacao.mensagem }}</p>
                <p v-if="acrescenta" class="error--text title">
                  Pretende selecioná-las?
                </p>
                <p v-else class="error--text title">
                  Pretende desselecioná-las?
                </p>
                <ol v-if="entidadesFalta.length > 0">
                  <li v-for="(item, i) in entidadesFalta" v-bind:key="i">
                    {{ item.sigla }} - {{ item.designacao }}
                  </li>
                </ol>
              </v-card-text>
            </div>
            <v-card-actions>
              <v-btn
                v-if="acrescenta"
                color="green darken-2"
                rounded
                elevation="0"
                class="px-4"
                @click="selecionar"
              >
                Confirmar
              </v-btn>
              <v-btn
                v-else
                color="green darken-2"
                rounded
                elevation="0"
                class="px-4"
                @click="desselecionar"
              >
                Confirmar
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-4"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="
                  {
                    dialogConfirmacao.visivel = false;
                    entidadesFalta = [];
                    acrescenta = null;
                  }
                "
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Voltar from "@/components/generic/Voltar";
export default {
  data: () => ({
    file: [],
    erro: "",
    erroDialog: false,
    success: "",
    successDialog: false,
    loading: false,
    progresso: 0,
    total: 0,
    fileName: "",
    entidades_tipologias: [],
    entidade_tipologia: [],
    tipo: "Organizacional",
    designacao: "",
    codigo: "",
    fonteLegitimacao: null,
    multImport: false,
    multImportList: [],
    stats: [],
    dialogConfirmacao: {
      visivel: false,
      mensagem: "",
      dados: null,
    },
    entidadesFalta: [],
    acrescenta: null,
  }),
  components: {
    Voltar,
  },

  mounted: async function () {
    try {
      var response = await this.$request("get", "/entidades");
      var entidades = response.data.map((ent) => {
        return {
          text: ent.sigla + " - " + ent.designacao,
          value: ent.sigla,
        };
      });

      response = await this.$request("get", "/tipologias");
      var tipologias = response.data.map((tip) => {
        return {
          text: tip.sigla + " - " + tip.designacao,
          value: tip.sigla,
        };
      });

      this.entidades_tipologias = entidades.concat(tipologias);
      this.entidades_tipologias = this.entidades_tipologias.sort((a, b) => {
        return a.text.localeCompare(b.text);
      });
    } catch (e) {
      this.erro =
        "Não foi possível obter as entidades ou as tipologias... Realize reload da página.";
    }
  },

  methods: {
    goBack() {
      this.$router.push("/tsInfo");
    },
    loadStats(fstats) {
      for (var k in fstats) {
        switch (k) {
          case "processos":
            return "Número de Processos: " + fstats[k];
          case "donos":
            return "Número de Processos Donos: " + fstats[k];
          case "participantes":
            return "Número de Processos Participantes: " + fstats[k];
          /*
          default:
            stats += "<li>Entidade: " + k + "<ul>";
            for (var kb in fstats[k]) {
              switch (kb) {
                case "processos":
                  stats +=
                    "<li>Número de Processos: " +
                    response.data.stats[k][kb] +
                    "</li>";
                  break;
                case "donos":
                  stats +=
                    "<li>Número de Processos Donos: " +
                    response.data.stats[k][kb] +
                    "</li>";
                  break;
                case "participantes":
                  stats +=
                    "<li>Número de Processos Participantes: " +
                    response.data.stats[k][kb] +
                    "</li>";
                  break;
                default:
                  break;
              }
            }
            stats += "</ul>";
        }
      }
      stats += "</ul>";
      */
        }
      }
    },
    enviarFicheiro: async function () {
      this.erro = "";
      this.erroDialog = false;
      this.successDialog = false;
      this.success = "";
      this.total = this.file.length;
      this.loading = true;

      for (var index in this.file) {
        try {
          this.fileName = this.file[index].name;
          var formData = new FormData();
          formData.append("file", this.file[index]);

          if (!this.multImport) {
            formData.append("designacao", this.designacao);
            formData.append(
              "entidades_ts",
              JSON.stringify(this.entidade_tipologia)
            );
          }
          formData.append("multImport", this.multImport);
          formData.append("tipo_ts", "TS " + this.tipo);
          formData.append("fonteL", this.fonteLegitimacao);

          var response = await this.$request(
            "post",
            "/tabelasSelecao/importar",
            formData
          );

          if (response) {
            if (this.multImport) {
              this.multImportList.push({
                file: this.file[index].name,
                id: response.data.codigo,
                stats: response.data.stats,
              });
            } else {
              this.stats = response.data.stats;
              this.codigo = response.data.codigo;
            }
          }
        } catch (e) {
          if (e) {
            if (e.response.data.entidades) {
              this.loading = false;
              this.entidadesFalta = e.response.data.entidades;
              this.acrescenta = e.response.data.acrescenta;
              if (e.response.data.acrescenta) {
                this.dialogConfirmacao = {
                  visivel: true,
                  mensagem: e.response.data.message,
                };
              } else {
                this.dialogConfirmacao = {
                  visivel: true,
                  mensagem: e.response.data.message,
                };
              }
            } else if (e.response.data.some((err) => !!err.file)) {
              if (this.multImport) {
                this.multImportList = this.multImportList.concat(
                  e.response.data
                );
              } else {
                this.loading = false;
                this.erro = e.response.data;
                this.erroDialog = true;
              }
            } else {
              this.loading = false;
              this.erro = e.response.data[0].msg || e.response.data;
              this.erroDialog = true;
            }
          } else {
            this.loading = false;
            this.erro = "Erro interno";
            this.erroDialog = true;
          }
        }
        this.progresso += 1;
      }

      /*
        var response2 = await this.$request(
          "get",
          "/legislacao/" + response.data.codigo.split("pgd_")[1]
        );

        Object.defineProperty(
          response2.data,
          "entidadesSel",
          Object.getOwnPropertyDescriptor(response2.data, "entidades")
        );
        delete response2.data["entidades"];

        console.log(response2.data);
        response2.data.entidadesSel = response2.data.entidadesSel.concat(
          response.data.entidadesSel
        );

        var response3 = await this.$request(
          "put",
          "/legislacao/" + response2.data.id,
          response2.data
        );
        */
      /*
      var stats = "<ul>";
      for (var k in response.data.stats) {
        switch (k) {
          case "processos":
            stats +=
              "<li>Número de Processos: " + response.data.stats[k] + "</li>";
            break;
          case "donos":
            stats +=
              "<li>Número de Processos Donos: " +
              response.data.stats[k] +
              "</li>";
            break;
          case "participantes":
            stats +=
              "<li>Número de Processos Participantes: " +
              response.data.stats[k] +
              "</li>";
            break;
          default:
            stats += "<li>Entidade: " + k + "<ul>";
            for (var kb in response.data.stats[k]) {
              switch (kb) {
                case "processos":
                  stats +=
                    "<li>Número de Processos: " +
                    response.data.stats[k][kb] +
                    "</li>";
                  break;
                case "donos":
                  stats +=
                    "<li>Número de Processos Donos: " +
                    response.data.stats[k][kb] +
                    "</li>";
                  break;
                case "participantes":
                  stats +=
                    "<li>Número de Processos Participantes: " +
                    response.data.stats[k][kb] +
                    "</li>";
                  break;
                default:
                  break;
              }
            }
            stats += "</ul>";
        }
      }
      stats += "</ul>";
      */

      //this.success = `Código do pedido: ${response.data.codigo}\n<p>Estatísticas:<\p>\n${stats}`;
      //this.codigo = response.data.codigo;

      !this.dialogConfirmacao.visivel
        ? !this.erroDialog
          ? (this.successDialog = true)
          : ""
        : "";
    },
    seguirPedido: function (codigo = this.codigo) {
      switch (this.fonteLegitimacao) {
        case "TS/LC":
          this.$router.push(`/pedidos/submissao/${codigo}`);
          break;
        case "PGD/LC":
          this.$router.push(`/pgd/${codigo}`);
          break;
        case "PGD":
          this.$router.push(`/pgd/${codigo}`);
          break;
        case "RADA":
          this.$router.push(`/pgd/${codigo}`);
          break;
      }
    },
    selecionar: function () {
      this.dialogConfirmacao.visivel = false;
      if (this.tipo == "Pluriorganizacional")
        this.entidade_tipologia = this.entidade_tipologia.concat(
          this.entidadesFalta.map((e) => e.sigla)
        );
      else {
        this.entidade_tipologia = this.entidadesFalta.map((e) => e.sigla)[0];
        this.designacao = `Tabela de Seleção de ${this.entidade_tipologia}`;
      }
      this.entidadesFalta = [];
      this.acrescenta = null;
    },
    desselecionar: function () {
      this.dialogConfirmacao.visivel = false;
      this.entidadesFalta.map((e) =>
        this.entidade_tipologia.splice(
          this.entidade_tipologia.findIndex((ent) => e.sigla == ent),
          1
        )
      );

      this.entidadesFalta = [];
      this.acrescenta = null;
    },
    fonteL: function () {
      if (this.fonteLegitimacao == "RADA") {
        this.designacao =
          "Relatório de Avaliação de Documentação Acumulada de ...";
        this.tipo == "Pluriorganizacional"
          ? (this.entidade_tipologia = [])
          : "";
      } else if (
        this.tipo == "Pluriorganizacional" &&
        this.fonteLegitimacao != "RADA"
      )
        this.designacao = "Tabela de Seleção Pluriorganizacional...";
      else if (
        this.tipo == "Organizacional" &&
        this.fonteLegitimacao != "RADA" &&
        this.entidade_tipologia &&
        this.entidade_tipologia.length > 0
      )
        this.designacao = `Tabela de Seleção de ${this.entidade_tipologia}`;
      else this.designacao = null;
    },

    voltar: function () {
      this.$router.go();
    },
  },
};
</script>
<style scoped>
ul li {
  list-style: none;
  color: #606060;
  font-size: 0.9em;
  margin-bottom: 0.5em;
  position: relative;
}

ul li::before {
  content: "\2022";
  position: absolute;
  left: -2rem;
  top: -2.3rem;
  font-size: 4em;

  color: #4da0d0;
}
ul li > ul li::before {
  content: "\2218";
  position: absolute;
  left: -1.4rem;
  top: -1rem;
  font-size: 2.5em;
  color: #4da0d0;
}
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.info-content-card {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
