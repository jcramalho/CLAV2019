<template>
  <v-container fluid>
    <v-row row wrap justify-center>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Exportação de Dados</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-autocomplete
              :items="exportacoesDisponiveis"
              label="Dados a exportar"
              v-model="tipo"
              :rules="regraTipo"
              required
              @change="
                queriesSel = {};
                id = '';
              "
            >
            </v-autocomplete>

            <v-card v-if="tipo != '' && tipo.path.includes('/')" class="mb-4">
              <v-card-title class="indigo darken-4 white--text subtitle-1">
                Parâmetros do pedido
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-form ref="id">
                      <v-autocomplete
                        :items="this[singToPlu(tipo.filename)]"
                        label="Identificador"
                        v-model="id"
                        :rules="regraId"
                        required
                      >
                      </v-autocomplete>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card v-if="tipo != ''">
              <v-card-title class="indigo darken-4 white--text subtitle-1">
                Defina as query strings a usar na exportação
              </v-card-title>
              <v-card-text>
                <div
                  v-for="(querystring, key) in queryStrings[tipo.filename]"
                  :key="key"
                >
                  <v-row>
                    <v-col cols="1" class="d-flex justify-center">
                      <InfoBox
                        :header="querystring.label"
                        :text="querystring.desc"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </v-col>
                    <v-col cols="11">
                      <span v-if="querystring.enum.length > 0">
                        <v-autocomplete
                          :items="querystring.enum"
                          :label="querystring.label"
                          v-model="queriesSel[key]"
                          :multiple="querystring.multiple"
                        >
                        </v-autocomplete>
                      </span>
                      <span v-else>
                        <v-text-field
                          :name="key"
                          v-model="queriesSel[key]"
                          :label="querystring.label"
                          type="text"
                        />
                      </span>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="indigo darken-4" dark @click="cancelar">
                  Cancelar
                </v-btn>
                <v-btn color="indigo darken-4" dark @click="executar">
                  Exportar
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-alert :value="text != ''" :type="alertType">
          {{ text }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const lhost = require("@/config/global").host;

export default {
  data: () => {
    let fs = {
      label: "Formato de saída",
      desc: "Formato de saída do resultado",
      enum: [
        "Por definir",
        "application/json",
        "json",
        "application/xml",
        "xml",
        "text/csv",
        "csv",
        "excel/csv"
      ],
      multiple: false
    };
    return {
      classes: [],
      entidades: [],
      tipologias: [],
      legislacoes: [],
      exportacoesDisponiveis: [
        { text: "Classes", value: { filename: "classes", path: "classes" } },
        { text: "Classe", value: { filename: "classe", path: "classes/" } },
        {
          text: "Entidades",
          value: { filename: "entidades", path: "entidades" }
        },
        {
          text: "Entidade",
          value: { filename: "entidade", path: "entidades/" }
        },
        {
          text: "Tipologias",
          value: { filename: "tipologias", path: "tipologias" }
        },
        {
          text: "Tipologia",
          value: { filename: "tipologia", path: "tipologias/" }
        },
        {
          text: "Legislações",
          value: { filename: "legislacoes", path: "legislacao" }
        },
        {
          text: "Legislação",
          value: { filename: "legislacao", path: "legislacao/" }
        },
        {
          text: "Ontologia",
          value: { filename: "ontologia", path: "ontologia" }
        }
      ],
      tipo: "",
      queriesSel: {},
      id: "",
      queryStrings: {
        classes: {
          estrutura: {
            label: "Estrutura",
            desc:
              "Estrutura. Pode ser em árvore ou em lista. Quanto nenhum parâmetro é definido (formato, tipo e nivel) o formato de saída em arvore é o predefinido.",
            enum: ["Por definir", "arvore", "lista"],
            multiple: false
          },
          tipo: {
            label: "Tipo",
            desc:
              "Devolve as classes de nível 3 (processos) filtrando pelo tipo de processo (comuns ou especificos).",
            enum: ["Por definir", "comum", "especifico"],
            multiple: false
          },
          nivel: {
            label: "Nível",
            desc:
              "O nível dos processos devolvidos numa lista. Podem ser de 1º, 2º, 3º e 4º nível.",
            enum: ["Por definir", "1", "2", "3", "4"],
            multiple: false
          },
          ents: {
            label: "Entidades",
            desc:
              "Obtém os processos especificos destas entidades. Este parâmetro só deve ser usado quando o tipo é especifico.",
            enum: [],
            multiple: true
          },
          tips: {
            label: "Tipologias",
            desc:
              "Obtém os processos especificos destas tipologias. Este parâmetro só deve ser usado quando o tipo é especifico.",
            enum: [],
            multiple: true
          },
          info: {
            label:
              "Informação completa? Ou pretende apenas o esqueleto para criar uma TS?",
            desc:
              "Caso seja um valor que não 'completa' e 'esqueleto' devolve apenas o código, a descrição e o título das classes. Caso o valor seja 'completa' devolve toda a informação de cada classe. Caso o valor seja 'esqueleto' devolve numa estrutura pronta a ser preenchida para a criação de uma Tabela de Seleção, devolve os campos: código, título, descrição, PCA, DF dono (a ser preenchido pelo utilizador) e participante (a ser preenchido pelo utilizador).",
            enum: ["Por definir", "completa", "esqueleto"],
            multiple: false
          },
          fs: fs
        },
        entidades: {
          processos: {
            label: "Processos",
            desc:
              "No caso de ser escolhido 'com' é listado as entidades com PNs associados. Já no caso de ser escolhido 'sem' é listado as entidades sem PNs associados. Este parâmetro sobrepõe os seguintes, ou seja, caso este parâmetro seja definido os restantes são ignorados.",
            enum: ["Por definir", "com", "sem"],
            multiple: false
          },
          sigla: {
            label: "Filtrar por sigla",
            desc:
              "Permite filtrar as entidades que contém a sigla igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: AR)",
            enum: [],
            multiple: false
          },
          designacao: {
            label: "Filtrar por designação",
            desc:
              "Permite filtrar as entidades que contém a designacao igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: Assembleia da República)",
            enum: [],
            multiple: false
          },
          internacional: {
            label: "Filtrar pelo campo internacional",
            desc:
              "Permite filtrar as entidades que contém internacional igual a este valor. Só funciona caso o parâmetro processos não seja definido.",
            enum: ["Sim", "Não"],
            multiple: false
          },
          sioe: {
            label: "Filtrar por SIOE",
            desc:
              "Permite filtrar as entidades que contém sioe igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: 875780390)",
            enum: [],
            multiple: false
          },
          estado: {
            label: "Filtrar por estado",
            desc:
              "Permite filtrar as entidades que contém o estado igual a este valor. Só funciona caso o parâmetro processos não seja definido.",
            enum: ["Por definir", "Ativa", "Inativa", "Harmonização"],
            multiple: false
          },
          info: {
            label: "Informação completa?",
            desc:
              "Caso o valor desta query string não seja 'completa' devolve apenas parte da informação de cada entidade. Caso o valor seja 'completa' devolve toda a informação de cada entidade.",
            enum: ["Por definir", "completa"],
            multiple: false
          },
          fs: fs
        },
        tipologias: {
          designacao: {
            label: "Filtrar por designação",
            desc:
              "Permite filtrar as tipologias que contém a designacao igual a este valor. (ex: Autoridades Administrativas Civis)",
            enum: [],
            multiple: false
          },
          estado: {
            label: "Filtrar por estado",
            desc:
              "Filtra as tipologias pelo estado das mesmas. O estado pode ser Ativa, Inativa ou Harmonização.",
            enum: ["Por definir", "Ativa", "Inativa", "Harmonização"],
            multiple: false
          },
          info: {
            label: "Informação completa?",
            desc:
              "Caso o valor desta query string não seja 'completa' devolve apenas parte da informação de cada tipologia. Caso o valor seja 'completa' devolve toda a informação de cada tipologia.",
            enum: ["Por definir", "completa"],
            multiple: false
          },
          fs: fs
        },
        legislacoes: {
          processos: {
            label: "Processos",
            desc:
              "No caso de ser escolhido 'com' é listado os documentos legislativos com PNs associados. Já no caso de ser escolhido 'sem' é listado os documentos legislativos sem PNs associados. Só funciona caso o parâmetro estado não seja definido.",
            enum: ["Por definir", "com", "sem"],
            multiple: false
          },
          estado: {
            label: "Filtrar por estado",
            desc:
              "Os documentos legislativos tem dois estados possíveis, Ativo ou Revogado. Este parâmetro sobrepõe os seguintes, ou seja, caso este parâmetro seja definido os restantes são ignorados.",
            enum: ["Por definir", "Ativo", "Revogado"],
            multiple: false
          },
          fonte: {
            label: "Filtrar por fonte",
            desc:
              "No caso de ser definido lista os documentos legislativos de acordo com a fonte especificada. Só funciona caso os parâmetros estado e processos não sejam definidos.",
            enum: ["Por definir", "PGD", "PGD/LC", "RADA"],
            multiple: false
          },
          info: {
            label: "Informação completa?",
            desc:
              "Caso o valor desta query string não seja 'completa' devolve apenas parte da informação de cada documento legislativo. Caso o valor seja 'completa' devolve toda a informação de cada documento legislativo.",
            enum: ["Por definir", "completa"],
            multiple: false
          },
          fs: fs
        },
        classe: {
          tipo: {
            label: "Tipo",
            desc:
              "Caso o valor deste campo seja 'subarvore' é devolvida a subarvore com raiz na classe com id igual ao do campo 'id'",
            enum: ["Por definir", "subarvore"],
            multiple: false
          },
          fs: fs
        },
        entidade: {
          info: {
            label: "Informação completa?",
            desc:
              "Caso seja um valor que não 'completa' devolve apenas parte da informação da entidade. Caso o valor seja 'completa' devolve toda a informação da entidade.",
            enum: ["Por definir", "completa"],
            multiple: false
          },
          fs: fs
        },
        tipologia: {
          info: {
            label: "Informação completa?",
            desc:
              "Caso seja um valor que não 'completa' devolve apenas parte da informação da tipologia. Caso o valor seja 'completa' devolve toda a informação da tipologia.",
            enum: ["Por definir", "completa"],
            multiple: false
          },
          fs: fs
        },
        legislacao: {
          info: {
            label: "Informação completa?",
            desc:
              "Caso seja um valor que não 'completa' devolve apenas parte da informação do documento legislativo. Caso o valor seja 'completa' devolve toda a informação do documento legislativo.",
            enum: ["Por definir", "completa"],
            multiple: false
          },
          fs: fs
        },
        ontologia: {
          inferencia: {
            label: "Ontologia com dados inferidos?",
            desc:
              "Caso 'true' devolve todos os triplos incluindo os inferidos. Caso 'false' não inclui os inferidos.",
            enum: [
              { text: "Por definir", value: "" },
              { text: "Não", value: "false" },
              { text: "Sim", value: "true" }
            ],
            multiple: false
          },
          fs: {
            label: "Formato de saída do ficheiro",
            desc:
              "Formato em que é devolvido os triplos. Pode ser um dos seguintes valores: turtle (text/turtle), json-ld (application/ld+json) ou rdf-xml (application/rdf+xml). No caso de não ser passado nenhum formato ou o que é colocado não é suportado é devolvido turtle. O formato também pode ser indicado na header 'Accept' sofrendo das mesmas restrições que se for indicado por query. Caso seja definido das duas formas a fornecida pela query string é a que é usada.",
            enum: [
              "Por definir",
              "turtle",
              "text/turtle",
              "json-ld",
              "application/ld+json",
              "rdf-xml",
              "application/rdf+xml"
            ],
            multiple: false
          }
        }
      },
      regraTipo: [v => !!v || "Tipo de dados a exportar é obrigatório."],
      regraId: [v => !!v || "Identificador é obrigatório."],
      text: "",
      alertType: "success"
    };
  },

  components: {
    InfoBox
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/classes?estrutura=lista");
      this.classes = response.data.map(c => {
        return { text: c.codigo + " - " + c.titulo, value: "c" + c.codigo };
      });

      response = await this.$request("get", "/api/entidades");
      this.entidades = response.data.map(e => {
        return {
          text: e.sigla + " - " + e.designacao,
          value: e.id
        };
      });
      this.queryStrings.classes.ents.enum = this.entidades;

      response = await this.$request("get", "/api/tipologias");
      this.tipologias = response.data.map(t => {
        return {
          text: t.sigla + " - " + t.designacao,
          value: t.id
        };
      });
      this.queryStrings.classes.tips.enum = this.tipologias;

      response = await this.$request("get", "/api/legislacao");
      this.legislacoes = response.data.map(l => {
        return {
          text:
            l.tipo +
            " " +
            l.numero +
            " - " +
            l.sumario.substring(0, 100) +
            (l.sumario.length > 100 ? "..." : ""),
          value: l.id
        };
      });
    } catch (erro) {
      if (erro.response && erro.response.data) {
        this.text = erro.response.data;
      } else {
        this.text = erro;
      }
      this.alertType = "error";
    }
  },

  methods: {
    cancelar() {
      this.$router.push("/");
    },
    download(path, filename) {
      var element = document.createElement("a");

      element.setAttribute("href", path);
      element.setAttribute("download", filename);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    downloadData(filename, content, format) {
      var blob = new Blob([content], {
        type: format + ";charset=utf-8;"
      });

      if (window.navigator.msSaveBlob) {
        // FOR IE BROWSER
        navigator.msSaveBlob(blob, filename);
      } else {
        // FOR OTHER BROWSERS
        var url = URL.createObjectURL(blob);
        this.download(url, filename);
      }
    },
    async downloadFile(path) {
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      path = path.includes("?")
        ? lhost + path + "&" + token
        : lhost + path + "?" + token;

      this.download(path, "");
    },
    defineParams(content) {
      var filename = this.tipo.filename + ".";
      var format;

      if (!this.queriesSel.fs || this.queriesSel.fs == "Por definir") {
        filename += "json";
        content = JSON.stringify(content, null, 4);
        format = "application/json";
      } else {
        switch (this.queriesSel.fs) {
          case "application/json":
            filename += "json";
            content = JSON.stringify(content, null, 4);
            break;
          case "application/xml":
            filename += "xml";
            break;
          case "text/csv":
          case "excel/csv":
            filename += "csv";
            break;
          default:
            filename += this.queriesSel.fs;
            break;
        }

        switch (this.queriesSel.fs) {
          case "json":
            content = JSON.stringify(content, null, 4);
            format = "application/json";
            break;
          case "xml":
            format = "application/xml";
            break;
          case "excel/csv":
          case "csv":
            format = "text/csv";
            break;
          default:
            format = this.queriesSel.fs;
            break;
        }
      }

      return [filename, content, format];
    },
    async executar() {
      this.text = "";

      if (!this.$refs.id || this.$refs.id.validate()) {
        var path = "/api/" + this.tipo.path + this.id;

        //criar query string
        if (Object.keys(this.queriesSel).length > 0) {
          path += "?";

          var q = [];
          for (var key in this.queriesSel) {
            if (
              this.queriesSel[key] != "Por definir" &&
              this.queriesSel[key] != ""
            ) {
              if (
                this.tipo.filename == "entidades" &&
                key == "internacional" &&
                this.queriesSel[key] == "Não"
              ) {
                q.push(key + "=" + encodeURIComponent(""));
              } else {
                q.push(key + "=" + encodeURIComponent(this.queriesSel[key]));
              }
            }
          }

          path += q.join("&");
        }

        if (this.tipo.filename != "ontologia") {
          //obter dados
          try {
            var response = await this.$request("get", path);
          } catch (erro) {
            if (erro.response && erro.response.data) {
              this.text = erro.response.data;
            } else {
              this.text = erro;
            }
            this.alertType = "error";
            return;
          }

          //criar ficheiro e devolver ao user
          var fcf = this.defineParams(response.data);
          this.downloadData(fcf[0], fcf[1], fcf[2]);
        } else {
          await this.downloadFile(path);
        }

        this.text = "Exportação realizada com sucesso!";
        this.alertType = "success";
      }
    },
    singToPlu(word) {
      var ret = "";

      switch (word) {
        case "legislacao":
          ret = "legislacoes";
          break;
        default:
          ret = word + "s";
          break;
      }

      return ret;
    }
  }
};
</script>
