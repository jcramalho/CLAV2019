<template>
  <v-row>
    <v-col>
      <div class="ma-2">
        <v-dialog v-model="erroDialog" width="700" persistent>
          <v-card outlined>
            <v-card-title class="red darken-4 title white--text" dark>
              Não foi possível criar o pedido de criação de tabela de seleção
            </v-card-title>

            <v-card-text>
              <span
                class="subtitle-1"
                style="white-space: pre-wrap"
                v-html="erro"
              >
              </span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="red darken-4" text @click="erroDialog = false">
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="successDialog" width="700" persistent>
          <v-card outlined>
            <v-card-title class="teal darken-4 title white--text" dark>
              Pedido de criação de tabela de seleção criado com sucesso
            </v-card-title>

            <v-card-text>
              <span
                class="subtitle-1"
                style="white-space: pre-wrap"
                v-html="success"
              >
              </span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="red darken-4" text @click="$router.push('/')">
                Fechar
              </v-btn>
              <v-spacer />
              <v-btn color="green darken-4" text @click="seguirPedido">
                Seguir pedido
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card class="ma-2 mx-auto">
          <v-card-title class="indigo darken-4 white--text">
            Importar Tabela de Seleção
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                clearable
                v-model="designacao"
                label="Designação da Tabela de Seleção"
                :rules="[v => !!v || 'A designação não pode ser vazia']"
                color="indigo darken-4"
              ></v-text-field>
              <v-select
                :items="['Organizacional', 'Pluriorganizacional']"
                label="Tipo de Tabela de Seleção"
                v-model="tipo"
                @change="entidade_tipologia = null"
                color="indigo darken-4"
              >
              </v-select>
              <div v-if="tipo != null">
                <v-autocomplete
                  v-if="tipo == 'Organizacional'"
                  :items="entidades_tipologias"
                  label="Entidade/Tipologia"
                  v-model="entidade_tipologia"
                  prepend-icon="account_balance"
                  color="indigo darken-4"
                >
                </v-autocomplete>
                <span class="subtitle-2">Fonte de legitimação:</span>
                <v-radio-group
                  v-model="fonteLegitimacao"
                  :rules="[
                    v => !!v || 'Tem de escolher uma fonte de legitimação'
                  ]"
                  required
                  row
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
                <v-file-input
                  v-model="file"
                  label="Ficheiro CSV/Excel"
                  placeholder="Selecione o ficheiro CSV/Excel com a Tabela de Seleção"
                  show-size
                  accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  multiple
                  color="indigo darken-4"
                ></v-file-input>

                <v-alert v-if="tipo == 'Organizacional'" type="info">
                  Caso o ficheiro seja CSV deve respeitar o seguinte:

                  <ul>
                    <li>
                      Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'
                    </li>
                    <li>O quote e o escape são realizados através de "</li>
                    <li>O encoding do ficheiro tem de ser UTF-8</li>
                  </ul>

                  O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma sheet
                  em que tenha:

                  <ul>
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
                </v-alert>
                <v-alert v-if="tipo == 'Pluriorganizacional'" type="info">
                  Caso o ficheiro seja CSV deve respeitar o seguinte:

                  <ul>
                    <li>
                      Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'
                    </li>
                    <li>O quote e o escape são realizados através de "</li>
                    <li>O encoding do ficheiro tem de ser UTF-8</li>
                  </ul>

                  O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma sheet
                  em que tenha:

                  <ul>
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
                </v-alert>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="white--text ma-2"
              color="indigo darken-4"
              @click="cancelar()"
              :disabled="loading"
            >
              Voltar
            </v-btn>
            <v-spacer />
            <v-btn
              class="white--text ma-2"
              color="indigo darken-4"
              @click="enviarFicheiro()"
              :loading="loading"
              :disabled="
                designacao == '' ||
                  file.length == 0 ||
                  tipo == null ||
                  fonteLegitimacao == null ||
                  (tipo == 'Organizacional' && entidade_tipologia == null)
              "
            >
              Importar
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-col>
  </v-row>
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
    entidade_tipologia: null,
    tipo: null,
    designacao: "",
    codigo: "",
    fonteLegitimacao: null
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
    enviarFicheiro: async function() {
      try {
        if (this.$refs.form.validate()) {
          this.erro = "";
          this.erroDialog = false;
          this.successDialog = false;
          this.success = "";
          this.loading = true;
          var formData = new FormData();
          formData.append("file", this.file[0]);
          formData.append("designacao", this.designacao);
          formData.append("entidade_ts", this.entidade_tipologia);
          formData.append("tipo_ts", "TS " + this.tipo);
          formData.append("fonteL", this.fonteLegitimacao);

          var response = await this.$request(
            "post",
            "/tabelasSelecao/importar",
            formData
          );
          this.loading = false;

          var stats = "<ul>";
          for (var k in response.data.stats) {
            switch (k) {
              case "processos":
                stats +=
                  "<li>Número de Processos: " +
                  response.data.stats[k] +
                  "</li>";
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
          this.success = `Código do pedido: ${response.data.codigo}\nEstatísticas:\n${stats}`;
          this.codigo = response.data.codigo;

          this.successDialog = true;
        }
      } catch (e) {
        this.loading = false;
        this.erro = e.response.data[0].msg || e.response.data;
        this.erroDialog = true;
      }
    },
    cancelar: function() {
      this.$router.push("/");
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
      }
    }
  }
};
</script>
