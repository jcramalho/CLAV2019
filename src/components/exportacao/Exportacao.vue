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
                <v-btn color="indigo darken-4" dark @click="cancelar">
                  Cancelar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="indigo darken-4" dark @click="executar">
                  Exportar
                </v-btn>
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
  data: () => ({
    classes: [],
    entidades: [],
    tipologias: [],
    legislacoes: [],
    exportacoesDisponiveis: [
      { text: "Classes", value: { filename: "classes", path: "classes" } },
      { text: "Classe", value: { filename: "classe", path: "classes/c" } },
      {
        text: "Entidades",
        value: { filename: "entidades", path: "entidades" }
      },
      {
        text: "Entidade",
        value: { filename: "entidade", path: "entidades/ent_" }
      },
      {
        text: "Tipologias",
        value: { filename: "tipologias", path: "tipologias" }
      },
      {
        text: "Tipologia",
        value: { filename: "tipologia", path: "tipologias/tip_" }
      },
      {
        text: "Legislações",
        value: { filename: "legislacoes", path: "legislacao" }
      },
      {
        text: "Legislação",
        value: { filename: "legislacao", path: "legislacao/leg_" }
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
        formato: {
          label: "Formato",
          desc:
            "Formato da estrutura de saída. Pode ser em árvore ou em lista. Quanto nenhum parâmetro é definido (formato, tipo e nivel) o formato de saída em arvore é o predefinido.",
          enum: ["Por definir", "arvore", "lista"]
        },
        tipo: {
          label: "Tipo",
          desc:
            "Que tipo de processos são devolvidos numa lista. Podem ser comuns ou especificos.",
          enum: ["Por definir", "comum", "especifico"]
        },
        nivel: {
          label: "Nível",
          desc:
            "O nível dos processos devolvidos numa lista. Podem ser de 1º, 2º, 3º e 4º nível.",
          enum: ["Por definir", "1", "2", "3", "4"]
        },
        ents: {
          label: "Entidades",
          desc:
            "Obtém os processos especificos destas entidades. Este parâmetro só deve ser usado quando o tipo é especifico. Exemplo de input: 'ent_AAN,ent_SEF'",
          enum: []
        },
        tips: {
          label: "Tipologias",
          desc:
            "Obtém os processos especificos destas tipologias. Este parâmetro só deve ser usado quando o tipo é especifico. Exemplo de input: 'tip_AAC,tip_AF'",
          enum: []
        },
        info: {
          label: "Informação completa?",
          desc:
            "Pretende toda a informação das classes? Caso o valor desta query string não seja 'completa' devolve apenas o código, a descrição e o título das classes. Caso o valor seja 'completa' devolve toda a informação de cada classe.",
          enum: ["Por definir", "completa"]
        },
        OF: {
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
          ]
        }
      },
      entidades: {
        processos: {
          label: "Processos",
          desc:
            "No caso de ser escolhido 'com' é listado as entidades com PNs associados. Já no caso de ser escolhido 'sem' é listado as entidades sem PNs associados. Este parâmetro sobrepõe os seguintes, ou seja, caso este parâmetro seja definido os restantes são ignorados.",
          enum: ["Por definir", "com", "sem"]
        },
        sigla: {
          label: "Filtrar por sigla",
          desc:
            "Permite filtrar as entidades que contém a sigla igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: AR)",
          enum: []
        },
        designacao: {
          label: "Filtrar por designação",
          desc:
            "Permite filtrar as entidades que contém a designacao igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: Assembleia     da República)",
          enum: []
        },
        internacional: {
          label: "Filtrar pelo campo internacional",
          desc:
            "Permite filtrar as entidades que contém internacional igual a este valor. Só funciona caso o parâmetro processos não seja definido.",
          enum: ["Sim", "Não"]
        },
        sioe: {
          label: "Filtrar por SIOE",
          desc:
            "Permite filtrar as entidades que contém sioe igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: 875780390)",
          enum: []
        },
        estado: {
          label: "Filtrar por estado",
          desc:
            "Permite filtrar as entidades que contém o estado igual a este valor. Só funciona caso o parâmetro processos não seja definido.",
          enum: ["Por definir", "Ativa", "Inativa", "Harmonização"]
        },
        OF: {
          label: "Formato de saída",
          desc:
            "Formato de saída do resultado. O resultado no formato CSV possui toda a informação das entidades",
          enum: [
            "Por definir",
            "application/json",
            "json",
            "application/xml",
            "xml",
            "text/csv",
            "csv",
            "excel/csv"
          ]
        }
      },
      tipologias: {
        designacao: {
          label: "Filtrar por designação",
          desc:
            "Permite filtrar as tipologias que contém a designacao igual a este valor. Só funciona caso o parâmetro processos não seja definido. (ex: Assembleia     da República)",
          enum: []
        },
        estado: {
          label: "Filtrar por estado",
          desc:
            "Permite filtrar as tipologias que contém o estado igual a este valor. Só funciona caso o parâmetro processos não seja definido.",
          enum: ["Por definir", "Ativa", "Inativa", "Harmonização"]
        },
        OF: {
          label: "Formato de saída",
          desc:
            "Formato de saída do resultado. O resultado no formato CSV possui toda a informação das tipologias",
          enum: [
            "Por definir",
            "application/json",
            "json",
            "application/xml",
            "xml",
            "text/csv",
            "csv",
            "excel/csv"
          ]
        }
      },
      legislacoes: {
        processos: {
          label: "Processos",
          desc:
            "No caso de ser escolhido 'com' é listado os documentos legislativos com PNs associados. Já no caso de ser escolhido 'sem' é listado os documentos legislativos sem PNs associados. Só funciona caso o parâmetro estado não seja definido.",
          enum: ["Por definir", "com", "sem"]
        },
        estado: {
          label: "Filtrar por estado",
          desc:
            "No caso de ser definido lista os documentos legislativos no estado A. Este parâmetro sobrepõe os seguintes, ou seja, caso este parâmetro seja definido os restantes são ignorados.",
          enum: ["Por definir", "A"]
        },
        fonte: {
          label: "Filtrar por fonte",
          desc:
            "No caso de ser definido lista os documentos legislativos de acordo com a fonte especificada. Só funciona caso os parâmetros estado e processos não sejam definidos.",
          enum: ["Por definir", "PGD", "PGD/LC", "RADA"]
        },
        OF: {
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
          ]
        }
      },
      classe: {
        tipo: {
          label: "Tipo",
          desc:
            "Caso o valor deste campo seja 'subarvore' é devolvida a subarvore com raiz na classe com id igual ao do campo 'id'",
          enum: ["Por definir", "subarvore"]
        },
        OF: {
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
          ]
        }
      },
      entidade: {
        OF: {
          label: "Formato de saída",
          desc:
            "Formato de saída do resultado. O resultado no formato CSV possui toda a informação da entidade",
          enum: [
            "Por definir",
            "application/json",
            "json",
            "application/xml",
            "xml",
            "text/csv",
            "csv",
            "excel/csv"
          ]
        }
      },
      tipologia: {
        OF: {
          label: "Formato de saída",
          desc:
            "Formato de saída do resultado. O resultado no formato CSV possui toda a informação da tipologia",
          enum: [
            "Por definir",
            "application/json",
            "json",
            "application/xml",
            "xml",
            "text/csv",
            "csv",
            "excel/csv"
          ]
        }
      },
      legislacao: {
        OF: {
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
          ]
        }
      },
      ontologia: {
        inferir: {
          label: "Ontologia com dados inferidos?",
          desc:
            "Caso 'true' devolve todos os triplos incluindo os inferidos. Caso 'false' não inclui os inferidos.",
          enum: ["false", "true"]
        },
        formato: {
          label: "Formato de saída do ficheiro",
          desc:
            "Formato em que é devolvido os triplos. Pode ser um dos seguintes valores: turtle (text/turtle), json-ld (application/ld+json) ou rdf-xml (application/rdf+xml). No caso de não ser passado nenhum formato ou o que é colocado não é suportado é devolvido turtle. O formato também pode ser indicado na header 'Accept' sofrendo das mesmas restrições que se for indicado por query. Caso seja definido das duas formas a fornecida pela query string é a que é usada.",
          enum: [
            "turtle",
            "text/turtle",
            "json-ld",
            "application/ld+json",
            "rdf-xml",
            "application/rdf+xml"
          ]
        }
      }
    },
    regraTipo: [v => !!v || "Tipo de dados a exportar é obrigatório."],
    regraId: [v => !!v || "Identificador é obrigatório."],
    text: "",
    alertType: "success"
  }),

  components: {
    InfoBox
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/classes?formato=lista");
      this.classes = response.data.map(c => c.codigo);

      response = await this.$request("get", "/api/entidades");
      this.entidades = response.data.map(e => e.sigla);

      response = await this.$request("get", "/api/tipologias");
      this.tipologias = response.data.map(t => t.sigla);

      response = await this.$request("get", "/api/legislacao");
      this.legislacoes = response.data.map(l => {
        return { text: l.tipo + " " + l.numero, value: l.id.split("leg_")[1] };
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
    click(element) {
      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    download(filename, content, format) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:" + format + ";charset=utf-8," + encodeURIComponent(content)
      );
      element.setAttribute("download", filename);
      this.click(element);
    },
    async downloadOntologia(path) {
      var element = document.createElement("a");
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      path = path.includes("?")
        ? lhost + path + "&" + token
        : lhost + path + "?" + token;

      element.setAttribute("href", path);
      element.setAttribute("download", "");
      this.click(element);
    },
    defineParams(content) {
      var filename = this.tipo.filename + ".";
      var format;

      if (!this.queriesSel.OF || this.queriesSel.OF == "Por definir") {
        filename += "json";
        content = JSON.stringify(content, null, 4);
        format = "application/json";
      } else {
        switch (this.queriesSel.OF) {
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
            filename += this.queriesSel.OF;
            break;
        }

        switch (this.queriesSel.OF) {
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
            format = this.queriesSel.OF;
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
              q.push(key + "=" + encodeURIComponent(this.queriesSel[key]));
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
          this.download(fcf[0], fcf[1], fcf[2]);
        } else {
          await this.downloadOntologia(path);
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
