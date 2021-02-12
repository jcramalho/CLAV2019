<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
      <!-- HEADER -->
      <v-col class="py-0 my-0">
        <v-btn
          @click="goBack"
          rounded
          class="white--text mb-6"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="default-button"
        >
          <unicon
            name="arrow-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 37.261"
            fill="#ffffff"
          />
          <p class="ml-2">Voltar</p>
        </v-btn>
        <v-card flat style="border-radius: 10px !important;">
          <p
            class="content-title-1 pt-5"
            style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;"
          >
            Importar Tabela de Seleção
          </p>
          <!-- CONTENT -->
          <v-card-text class="mt-0">
            <p
              class="content-text px-8 py-2 mb-3"
              style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
            >
              Selecione a fonte de legitimação da Tabela de Seleção a importar:
            </p>
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <div
                  class="info-content pa-4 px-5 pb-6 mx-auto mb-12"
                  style="min-height: 50px; max-width:70%;"
                  v-on="on"
                >
                  <v-radio-group
                    v-model="fonteLegitimacao"
                    :rules="[
                      v => !!v || 'Tem de escolher uma fonte de legitimação'
                    ]"
                    required
                    row
                    @change="fonteL"
                  >
                    <v-radio
                      label="PGD/LC"
                      color="indigo darken-4"
                      value="PGD/LC"
                    ></v-radio>
                    <v-radio
                      label="PGD"
                      color="indigo darken-4"
                      value="PGD"
                    ></v-radio>
                    <v-radio
                      label="RADA"
                      color="indigo darken-4"
                      value="RADA"
                    ></v-radio>
                  </v-radio-group>
                </div>
              </template>
              <span> Fonte de legitimação</span>
            </v-tooltip>
            <p
              class="content-text px-8 py-2 mb-3"
              style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
            >
              Selecione o tipo de Tabela de Seleção:
            </p>
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <div
                  class="info-content pa-4 px-5 pb-6 mx-auto mb-12"
                  style="min-height: 50px; max-width:70%;"
                  v-on="on"
                >
                  <v-radio-group
                    :items="['Organizacional', 'Pluriorganizacional']"
                    required
                    v-model="tipo"
                    row
                    @change="
                      {
                        entidade_tipologia = [];
                        if (
                          tipo == 'Pluriorganizacional' &&
                          fonteLegitimacao != 'RADA'
                        ) {
                          designacao =
                            'Tabela de Seleção Pluriorganizacional...';
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
                      color="indigo darken-4"
                      value="Organizacional"
                    ></v-radio>
                    <v-radio
                      label="Pluriorganizacional"
                      color="indigo darken-4"
                      value="Pluriorganizacional"
                    ></v-radio>
                  </v-radio-group>
                </div>
              </template>

              <span> Tipo da Tabela de Seleção</span>
            </v-tooltip>

            <div v-if="tipo != null">
              <div class="pa-0 ma-0" v-if="tipo == 'Organizacional'">
                <p
                  class="content-text px-8 py-2 mb-3"
                  style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
                >
                  Identifique a entidade ou tipologia da Tabela de Seleção:
                </p>
                <v-tooltip top color="info" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <div
                      class="info-content pa-4 px-5 pb-6 mx-auto mb-12"
                      style="min-height: 50px; max-width:70%;"
                      v-on="on"
                    >
                      <v-autocomplete
                        class="mt-n5 px-3"
                        color="blue darken-3"
                        v-if="tipo == 'Organizacional'"
                        :items="entidades_tipologias"
                        label="Entidade/Tipologia"
                        v-model="entidade_tipologia"
                        hide-details
                        clearable
                        single-line
                        @change="
                          if (fonteLegitimacao != 'RADA')
                            designacao = `Tabela de Seleção de ${entidade_tipologia}`;
                          if (entidade_tipologia == undefined)
                            designacao = null;
                        "
                      >
                      </v-autocomplete>
                    </div>
                  </template>

                  <span> Entidade ou tipologia da Tabela de Seleção</span>
                </v-tooltip>
              </div>
              <div class="pa-0 ma-0" v-else>
                <p
                  class="content-text px-8 py-2 mb-3"
                  style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
                >
                  Identifique as entidades e tipologias da Tabela de Seleção:
                </p>
                <v-tooltip top color="info" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <div
                      class="info-content pa-4 px-5 pb-6 mx-auto mb-12"
                      style="min-height: 50px; max-width:70%;"
                      v-on="on"
                    >
                      <v-autocomplete
                        class="mt-n5 px-3"
                        color="blue darken-3"
                        :items="entidades_tipologias"
                        label="Entidades/Tipologias"
                        v-model="entidade_tipologia"
                        hide-details
                        clearable
                        single-line
                        multiple
                        :rules="[
                          v =>
                            (!!v && v.length > 1) ||
                            'Tem de escolher pelo menos duas entidades!'
                        ]"
                      >
                      </v-autocomplete>
                    </div>
                  </template>

                  <span> Entidades e tipologias da Tabela de Seleção</span>
                </v-tooltip>
              </div>
              <p
                class="content-text px-8 py-2 mb-3"
                style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
              >
                Insira a designação para a Tabela de Seleção:
              </p>
              <v-tooltip top color="info" open-delay="500">
                <template v-slot:activator="{ on }">
                  <div
                    class="info-content pa-4 px-5 pb-6 mx-auto mb-12"
                    style="min-height: 50px; max-width:70%;"
                    v-on="on"
                  >
                    <v-text-field
                      class="mt-n3 px-3"
                      color="blue darken-3"
                      clearable
                      single-line
                      hide-details
                      v-model="designacao"
                      label="Designação da Tabela de Seleção"
                    ></v-text-field>
                  </div>
                </template>

                <span> Designação da Tabela de Seleção</span>
              </v-tooltip>

              <p
                class="content-text px-8 py-2 mb-3"
                style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
              >
                Selecione o ficheiro com a Tabela de Seleção a importar:
              </p>
              <v-tooltip top color="info" open-delay="500">
                <template v-slot:activator="{ on }">
                  <div
                    class="info-content pa-4 px-5 pb-6 mx-auto mb-12"
                    style="min-height: 50px; max-width:70%;"
                    v-on="on"
                  >
                    <v-file-input
                      v-model="file"
                      placeholder="Selecione o ficheiro CSV/Excel com a Tabela de Seleção"
                      show-size
                      accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      multiple
                      truncate-length="100"
                      class="mt-n5 px-3"
                      color="blue darken-3"
                      hide-details
                      single-line
                    ></v-file-input>
                  </div>
                </template>
                <span> Ficheiro com a Tabela de Seleção a importar</span>
              </v-tooltip>
              <v-card
                id="info-import-file"
                class="mx-auto pa-4 content-text"
                style="max-width:60%;"
              >
                <div v-if="tipo == 'Organizacional'">
                  <b>Caso o ficheiro seja CSV deve respeitar o seguinte:</b>

                  <ul class="px-9 pt-3 pb-4">
                    <li>
                      Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'
                    </li>
                    <li>O quote e o escape são realizados através de "</li>
                    <li>O encoding do ficheiro tem de ser UTF-8</li>
                  </ul>

                  <b>
                    O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma
                    sheet em que tenha:</b
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
                    <li>
                      Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'
                    </li>
                    <li>O quote e o escape são realizados através de "</li>
                    <li>O encoding do ficheiro tem de ser UTF-8</li>
                  </ul>

                  <b
                    >O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma
                    sheet em que tenha:</b
                  >

                  <ul class="px-9 pt-3">
                    <li>Uma coluna 'Código' com os códigos dos processos</li>
                    <li>Uma coluna 'Título' com os títulos dos processos</li>
                    <li>
                      Uma coluna 'Dono' com as siglas das entidades/tipologias
                      que são donas separadas por '#'
                    </li>
                    <li>
                      Uma coluna 'Participante' com as siglas das
                      entidades/tipologias que são donas separadas por '#'
                    </li>
                    <li>
                      Uma coluna 'Tipo de participação' com os tipos de
                      participação das entidades/tipologias referidas na coluna
                      'Participante' separados por '#'
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
              <v-btn
                v-if="
                  (tipo == 'Organizacional' && designacao == '') ||
                    file.length == 0 ||
                    tipo == null ||
                    fonteLegitimacao == null ||
                    entidade_tipologia == null ||
                    !entidade_tipologia.length
                "
                disabled
                rounded
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown
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
                v-else-if="
                  (tipo == 'Pluriorganizacional' && designacao == '') ||
                    file.length == 0 ||
                    tipo == null ||
                    fonteLegitimacao == null ||
                    entidade_tipologia.length < 2
                "
                disabled
                rounded
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown
                }"
                class="mb-6"
                id="botao-shadow"
                ><unicon
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
                rounded
                class="white--text mb-6"
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown
                }"
                id="default-button"
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
          </v-card-text>
        </v-card>
        <v-dialog v-model="erroDialog" persistent max-width="60%">
          <v-card dark class="info-card">
            <v-card-title class="headline mb-2">
              Não foi possível criar o pedido de criação de tabela de
              seleção</v-card-title
            >

            <div class="info-content-card px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <p class="error--text">{{ erro }}</p>
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
          <v-card dark class="info-card">
            <v-card-title class="headline mb-2">
              Pedido de criação de tabela de seleção criado com sucesso
            </v-card-title>
            <div class="info-content-card px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <p v-html="success"></p>
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
                color="success darken-1"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="seguirPedido"
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
                dark
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
                dark
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
  </v-container>
</template>

<script>
export default {
  data: () => ({
    file: [],
    erro: "",
    erroDialog: false,
    success: "",
    successDialog: false,
    loading: false,
    entidades_tipologias: [],
    entidade_tipologia: [],
    tipo: "Organizacional",
    designacao: "",
    codigo: "",
    fonteLegitimacao: null,
    dialogConfirmacao: {
      visivel: false,
      mensagem: "",
      dados: null
    },
    entidadesFalta: [],
    acrescenta: null
  }),

  mounted: async function() {
    try {
      var response = await this.$request("get", "/entidades");
      var entidades = response.data.map(ent => {
        return {
          text: ent.sigla + " - " + ent.designacao,
          value: ent.sigla
        };
      });

      response = await this.$request("get", "/tipologias");
      var tipologias = response.data.map(tip => {
        return {
          text: tip.sigla + " - " + tip.designacao,
          value: tip.sigla
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
    enviarFicheiro: async function() {
      try {
        this.erro = "";
        this.erroDialog = false;
        this.successDialog = false;
        this.success = "";
        this.loading = true;
        var formData = new FormData();
        formData.append("file", this.file[0]);
        formData.append("designacao", this.designacao);
        formData.append(
          "entidades_ts",
          JSON.stringify(this.entidade_tipologia)
        );
        formData.append("tipo_ts", "TS " + this.tipo);
        formData.append("fonteL", this.fonteLegitimacao);

        var response = await this.$request(
          "post",
          "/tabelasSelecao/importar",
          formData
        );
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

        this.success = `Código do pedido: ${response.data.codigo}\n<p>Estatísticas:<\p>\n${stats}`;
        this.codigo = response.data.codigo;

        this.successDialog = true;
      } catch (e) {
        if (e.response.data.entidades) {
          this.loading = false;
          this.entidadesFalta = e.response.data.entidades;
          this.acrescenta = e.response.data.acrescenta;
          if (e.response.data.acrescenta) {
            this.dialogConfirmacao = {
              visivel: true,
              mensagem: e.response.data.message
            };
          } else {
            this.dialogConfirmacao = {
              visivel: true,
              mensagem: e.response.data.message
            };
          }
        } else {
          this.loading = false;
          this.erro = e.response.data[0].msg || e.response.data;
          this.erroDialog = true;
        }
      }
    },
    seguirPedido: function() {
      switch (this.fonteLegitimacao) {
        case "TS/LC":
          this.$router.push(`/pedidos/submissao/${this.codigo}`);
          break;
        case "PGD/LC":
          this.$router.push(`/pgd/${this.codigo}`);
          break;
        case "PGD":
          this.$router.push(`/pgd/${this.codigo}`);
          break;
        case "RADA":
          this.$router.push(`/pgd/${this.codigo}`);
          break;
      }
    },
    selecionar: function() {
      this.dialogConfirmacao.visivel = false;
      if (this.tipo == "Pluriorganizacional")
        this.entidade_tipologia = this.entidade_tipologia.concat(
          this.entidadesFalta.map(e => e.sigla)
        );
      else {
        this.entidade_tipologia = this.entidadesFalta.map(e => e.sigla)[0];
        this.designacao = `Tabela de Seleção de ${this.entidade_tipologia}`;
      }
      this.entidadesFalta = [];
      this.acrescenta = null;
    },
    desselecionar: function() {
      this.dialogConfirmacao.visivel = false;
      this.entidadesFalta.map(e =>
        this.entidade_tipologia.splice(
          this.entidade_tipologia[
            this.entidade_tipologia.findIndex(ent => e.sigla == ent)
          ],
          1
        )
      );

      this.entidadesFalta = [];
      this.acrescenta = null;
    },
    fonteL: function() {
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

    voltar: function() {
      this.$router.go();
    }
  }
};
</script>
<style scoped>
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.info-content-card {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
#info-import-file {
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.32);
  border-radius: 10px;
  background-color: #f4f5f7;
}
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
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
  top: -2.7rem;
  font-size: 4em;

  color: #4da0d0;
}
ul li > ul li::before {
  content: "\2218";
  position: absolute;
  left: -1.4rem;
  top: -1.3rem;
  font-size: 2.5em;
  color: #4da0d0;
}
</style>
