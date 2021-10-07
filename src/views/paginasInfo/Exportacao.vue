<template>
  <v-card flat class="pa-3">
    <v-row>
      <v-col>
        <p class="clav-content-title-1">Exportação de Dados</p>
        <div class="clav-info-content mx-15">
          <v-tooltip top color="info" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-autocomplete
                :items="exportacoesDisponiveis"
                v-on="on"
                style="text-align: center !important"
                class="centered-input mt-n1 mb-2 px-8"
                :rules="regraTipo"
                v-model="tipo"
                label="Dados a exportar"
                text
                hide-details
                single-line
                required
                clearable
                color="primary"
                @change="
                  queriesSel = {};
                  id = '';
                "
                @click.clear="tipo = ''"
              ></v-autocomplete>
            </template>
            <span>
              Área destinada à exportação de dados das classes, entidades, tipologias,
              legislação e ontologia.
            </span>
          </v-tooltip>
        </div>
        <TogglePanelsCLAV
          :n="tipo ? (tipo.path.includes('/') ? 2 : 1) : 0"
          @alternar="panelsArr = $event"
        >
        </TogglePanelsCLAV>
        <v-expansion-panels v-if="tipo" v-model="panelsArr" multiple>
          <PainelCLAV
            v-if="tipo ? tipo.path.includes('/') : false"
            titulo="Parâmetros do pedido"
          >
            <template v-slot:icon>
              <v-icon color="secondary">{{ paramsIcon }}</v-icon>
            </template>
            <template v-slot:conteudo>
              <Campo nome="Identificador" color="neutralpurple">
                <template v-slot:conteudo>
                  <v-form ref="id">
                    <v-autocomplete
                      :items="[singToPlu(tipo.filename)]"
                      label="Identificador"
                      hide-details
                      dense
                      v-model="id"
                      :rules="regraId"
                      required
                    >
                    </v-autocomplete>
                  </v-form>
                </template>
              </Campo>
            </template>
          </PainelCLAV>

          <PainelCLAV titulo="Defina os parâmetros a usar na exportação">
            <template v-slot:icon>
              <v-icon color="secondary">{{ exportIcon }}</v-icon>
            </template>
            <template v-slot:conteudo>
              <Campo
                v-for="(querystring, key) in queryStrings[tipo.filename]"
                :key="key"
                :nome="querystring.label"
                :infoHeader="querystring.label"
                :infoBody="querystring.desc"
                color="neutralpurple"
              >
                <template v-slot:conteudo>
                  <span v-if="querystring.enum.length > 0">
                    <v-autocomplete
                      :items="querystring.enum"
                      :label="querystring.label"
                      v-model="queriesSel[key]"
                      :multiple="querystring.multiple"
                      hide-details
                      dense
                    >
                    </v-autocomplete>
                  </span>
                  <span v-else>
                    <v-text-field
                      :name="key"
                      v-model="queriesSel[key]"
                      :label="querystring.label"
                      type="text"
                      hide-details
                      dense
                    />
                  </span>
                </template>
              </Campo>
            </template>
          </PainelCLAV>
        </v-expansion-panels>
        <v-row>
          <v-spacer></v-spacer>
          <v-col v-if="tipo" align="center">
            <v-btn @click="executar" rounded class="white--text clav-linear-background">
              <v-icon dark>{{ exportIcon }}</v-icon>
              <span class="ml-3"> Exportar </span>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-alert :value="text != ''" :type="alertType">
          {{ text }}
        </v-alert>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PainelCLAV from "@/components/generic/PainelCLAV.vue";
import Campo from "@/components/generic/Campo";
import TogglePanelsCLAV from "@/components/generic/TogglePanelsCLAV";

const lhost = require("@/config/global").host;
var iconv = require("iconv-lite");
import { mdiTextBoxSearchOutline } from "@mdi/js";
import { mdiCloudPrintOutline } from "@mdi/js";

export default {
  name: "exportacao",

  components: {
    PainelCLAV,
    Campo,
    TogglePanelsCLAV,
  },
  data: () => {
    let fs = {
      label: "Formato de saída",
      desc: "Formato de saída do resultado",
      enum: [
        {
          text: "Por definir",
          value: "",
        },
        {
          text: "JSON",
          value: "application/json",
        },
        {
          text: "XML",
          value: "application/xml",
        },
        {
          text: "CSV",
          value: "text/csv",
        },
        {
          text: "CSV para Excel",
          value: "excel/csv",
        },
      ],
      multiple: false,
    };
    let enc = {
      label: "Encoding de saída",
      desc: "Encoding de saída do resultado",
      enum: [
        {
          text: "Por definir",
          value: "",
        },
        {
          text: "UTF-8",
          value: "utf-8",
        },
        {
          text: "UTF-16",
          value: "utf-16",
        },
        {
          text: "ISO-8859-1",
          value: "iso-8859-1",
        },
        {
          text: "windows-1252",
          value: "win1252",
        },
      ],
      multiple: false,
    };
    return {
      panelsArr: [],
      classes: [],
      entidades: [],
      tipologias: [],
      legislacoes: [],
      exportacoesDisponiveis: [
        {
          text: "Classes",
          value: {
            filename: "classes",
            path: "classes",
          },
        },
        {
          text: "Classe",
          value: {
            filename: "classe",
            path: "classes/",
          },
        },
        {
          text: "Entidades",
          value: {
            filename: "entidades",
            path: "entidades",
          },
        },
        {
          text: "Entidade",
          value: {
            filename: "entidade",
            path: "entidades/",
          },
        },
        {
          text: "Tipologias",
          value: {
            filename: "tipologias",
            path: "tipologias",
          },
        },
        {
          text: "Tipologia",
          value: {
            filename: "tipologia",
            path: "tipologias/",
          },
        },
        {
          text: "Legislações",
          value: {
            filename: "legislacoes",
            path: "legislacao",
          },
        },
        {
          text: "Legislação",
          value: {
            filename: "legislacao",
            path: "legislacao/",
          },
        },
        {
          text: "Ontologia",
          value: {
            filename: "ontologia",
            path: "ontologia",
          },
        },
      ],
      tipo: "",
      queriesSel: {},
      id: "",
      queryStrings: {
        classes: {
          estrutura: {
            label: "Estrutura",
            desc:
              "Estrutura. Pode ser em árvore ou em lista. A estrutura em arvore é a predefinida.",
            enum: ["Por definir", "arvore", "lista"],
            multiple: false,
          },
          tipo: {
            label: "Tipo",
            desc:
              "Devolve as classes (processos) filtrando pelo tipo de processo (comuns ou especificos).",
            enum: ["Por definir", "comum", "especifico"],
            multiple: false,
          },
          nivel: {
            label: "Nível",
            desc:
              "O nível dos processos devolvidos numa lista. Podem ser de 1º, 2º, 3º e 4º nível.",
            enum: ["Por definir", "1", "2", "3", "4"],
            multiple: false,
          },
          ents: {
            label: "Entidades",
            desc: "Obtém os processos destas entidades.",
            enum: [],
            multiple: true,
          },
          tips: {
            label: "Tipologias",
            desc: "Obtém os processos destas tipologias.",
            enum: [],
            multiple: true,
          },
          info: {
            label: "Informação completa? Esqueleto para criar uma TS? Outra forma?",
            desc:
              "Se esta query string não for definida devolve apenas o código, a descrição e o título das classes. Caso o valor seja 'completa' devolve toda a informação de cada classe. Caso o valor seja 'esqueleto' devolve numa estrutura pronta a ser preenchida para a criação de uma Tabela de Seleção, devolve os campos: código, título, descrição, PCA, DF, dono (a ser preenchido pelo utilizador) e participante (a ser preenchido pelo utilizador). Caso o valor seja 'pesquisa', devolve as classes num formato pronto a ser usado para a pesquisa avançada da interface CLAV. Caso o valor seja 'pre-selecionados' devolve os campos: código, título, descrição, PCA, DF, dono e participante. O 'pre-selecionados' no campo dono possui se as entidades e/ou as tipologias são donas. Já no campo participante possui se as entidades e/ou as tipologias são participantes e se forem o tipo de participação. Estes campos são listas, estando os seus valores ordenados primeiramente pelas entidades presentes na query string ents e de seguida pelas tipologias presentes na query string tips.",
            enum: [
              "Por definir",
              "completa",
              "esqueleto",
              "pre-selecionados",
              "pesquisa",
            ],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        entidades: {
          ents: {
            label: "Entidades",
            desc:
              "Devolve a informação destas entidades. Exemplo de input: 'ent_AAN,ent_SEF'",
            enum: [],
            multiple: true,
          },
          processos: {
            label: "Processos",
            desc:
              "No caso de ser escolhido 'com' é listado as entidades com PNs associados. Já no caso de ser escolhido 'sem' é listado as entidades sem PNs associados.",
            enum: ["Por definir", "com", "sem"],
            multiple: false,
          },
          sigla: {
            label: "Filtrar por sigla",
            desc:
              "Permite filtrar as entidades que contém a sigla igual a este valor. (ex: AR)",
            enum: [],
            multiple: false,
          },
          designacao: {
            label: "Filtrar por designação",
            desc:
              "Permite filtrar as entidades que contém a designacao igual a este valor. (ex: Assembleia da República)",
            enum: [],
            multiple: false,
          },
          internacional: {
            label: "Filtrar pelo campo internacional",
            desc:
              "Permite filtrar as entidades que contém internacional igual a este valor.",
            enum: ["Por definir"],
            multiple: false,
          },
          sioe: {
            label: "Filtrar por SIOE",
            desc:
              "Permite filtrar as entidades que contém sioe igual a este valor. (ex: 875780390)",
            enum: [],
            multiple: false,
          },
          estado: {
            label: "Filtrar por estado",
            desc: "Permite filtrar as entidades que contém o estado igual a este valor.",
            enum: ["Por definir"],
            multiple: false,
          },
          info: {
            label: "Informação completa?",
            desc:
              "Caso o valor desta query string não seja 'completa' devolve apenas parte da informação de cada entidade. Caso o valor seja 'completa' devolve toda a informação de cada entidade.",
            enum: ["Por definir", "completa"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        tipologias: {
          tips: {
            label: "Tipologias",
            desc: "Devolve a informação destas tipologias.",
            enum: [],
            multiple: true,
          },
          designacao: {
            label: "Filtrar por designação",
            desc:
              "Permite filtrar as tipologias que contém a designacao igual a este valor. (ex: Autoridades Administrativas Civis)",
            enum: [],
            multiple: false,
          },
          estado: {
            label: "Filtrar por estado",
            desc:
              "Filtra as tipologias pelo estado das mesmas. O estado pode ser Ativa, Inativa ou Harmonização.",
            enum: ["Por definir"],
            multiple: false,
          },
          info: {
            label: "Informação completa?",
            desc:
              "Caso o valor desta query string não seja 'completa' devolve apenas parte da informação de cada tipologia. Caso o valor seja 'completa' devolve toda a informação de cada tipologia.",
            enum: ["Por definir", "completa"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        legislacoes: {
          processos: {
            label: "Processos",
            desc:
              "No caso de ser escolhido 'com' é listado os documentos legislativos com PNs associados. Já no caso de ser escolhido 'sem' é listado os documentos legislativos sem PNs associados. Só funciona caso o parâmetro estado não seja definido.",
            enum: ["Por definir", "com", "sem"],
            multiple: false,
          },
          estado: {
            label: "Filtrar por estado",
            desc:
              "Os documentos legislativos tem dois estados possíveis, Ativo ou Revogado. Este parâmetro sobrepõe os seguintes, ou seja, caso este parâmetro seja definido os restantes são ignorados.",
            enum: ["Por definir"],
            multiple: false,
          },
          fonte: {
            label: "Filtrar por fonte",
            desc:
              "No caso de ser definido lista os documentos legislativos de acordo com a fonte especificada. Só funciona caso os parâmetros estado e processos não sejam definidos.",
            enum: ["Por definir"],
            multiple: false,
          },
          info: {
            label: "Informação completa?",
            desc:
              "Caso o valor desta query string não seja 'completa' devolve apenas parte da informação de cada documento legislativo. Caso o valor seja 'completa' devolve toda a informação de cada documento legislativo.",
            enum: ["Por definir", "completa"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        classe: {
          tipo: {
            label: "Tipo",
            desc:
              "Caso o valor deste campo seja 'subarvore' é devolvida a subarvore com raiz na classe com id igual ao do campo 'id'",
            enum: ["Por definir", "subarvore"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        entidade: {
          info: {
            label: "Informação completa?",
            desc:
              "Caso seja um valor que não 'completa' devolve apenas parte da informação da entidade. Caso o valor seja 'completa' devolve toda a informação da entidade.",
            enum: ["Por definir", "completa"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        tipologia: {
          info: {
            label: "Informação completa?",
            desc:
              "Caso seja um valor que não 'completa' devolve apenas parte da informação da tipologia. Caso o valor seja 'completa' devolve toda a informação da tipologia.",
            enum: ["Por definir", "completa"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        legislacao: {
          info: {
            label: "Informação completa?",
            desc:
              "Caso seja um valor que não 'completa' devolve apenas parte da informação do documento legislativo. Caso o valor seja 'completa' devolve toda a informação do documento legislativo.",
            enum: ["Por definir", "completa"],
            multiple: false,
          },
          fs: fs,
          encoding: enc,
        },
        ontologia: {
          inferencia: {
            label: "Ontologia com dados inferidos?",
            desc:
              "Caso 'true' devolve todos os triplos incluindo os inferidos. Caso 'false' não inclui os inferidos.",
            enum: [
              {
                text: "Por definir",
                value: "",
              },
              {
                text: "Não",
                value: "false",
              },
              {
                text: "Sim",
                value: "true",
              },
            ],
            multiple: false,
          },
          fs: {
            label: "Formato de saída do ficheiro",
            desc:
              "Formato em que é devolvido os triplos. Pode ser um dos seguintes valores: turtle (text/turtle), json-ld (application/ld+json) ou rdf-xml (application/rdf+xml). No caso de não ser passado nenhum formato ou o que é colocado não é suportado é devolvido turtle. O formato também pode ser indicado na header 'Accept' sofrendo das mesmas restrições que se for indicado por query. Caso seja definido das duas formas a fornecida pela query string é a que é usada.",
            enum: [
              {
                text: "Por definir",
                value: "",
              },
              {
                text: "Turtle",
                value: "text/turtle",
              },
              {
                text: "JSON-LD",
                value: "application/ld+json",
              },
              {
                text: "RDF-XML",
                value: "application/rdf+xml",
              },
            ],
            multiple: false,
          },
        },
      },
      regraTipo: [(v) => !!v || "Tipo de dados a exportar é obrigatório."],
      regraId: [(v) => !!v || "Identificador é obrigatório."],
      text: "",
      alertType: "success",
      paramsIcon: mdiTextBoxSearchOutline,
      exportIcon: mdiCloudPrintOutline,
    };
  },

  mounted: async function () {
    try {
      var response = await this.$request("get", "/classes?estrutura=lista");
      this.classes = response.data.map((c) => {
        return {
          text: c.codigo + " - " + c.titulo,
          value: "c" + c.codigo,
        };
      });

      response = await this.$request("get", "/entidades");
      this.entidades = response.data.map((e) => {
        return {
          text: e.sigla + " - " + e.designacao,
          value: e.id,
        };
      });
      this.queryStrings.classes.ents.enum = this.entidades;
      this.queryStrings.entidades.ents.enum = this.entidades;

      response = await this.$request("get", "/tipologias");
      this.tipologias = response.data.map((t) => {
        return {
          text: t.sigla + " - " + t.designacao,
          value: t.id,
        };
      });
      this.queryStrings.classes.tips.enum = this.tipologias;
      this.queryStrings.tipologias.tips.enum = this.tipologias;

      response = await this.$request("get", "/legislacao");
      this.legislacoes = response.data.map((l) => {
        return {
          text:
            l.tipo +
            " " +
            l.numero +
            " - " +
            l.sumario.substring(0, 100) +
            (l.sumario.length > 100 ? "..." : ""),
          value: l.id,
        };
      });

      //obtenção vocabulários necessários

      this.queryStrings.entidades.internacional.enum = this.queryStrings.entidades.internacional.enum.concat(
        await this.load("vc_internacional")
      );

      var status = await this.load("vc_status");
      this.queryStrings.entidades.estado.enum = this.queryStrings.entidades.estado.enum.concat(
        status
      );
      this.queryStrings.tipologias.estado.enum = this.queryStrings.tipologias.estado.enum.concat(
        status
      );

      this.queryStrings.legislacoes.estado.enum = this.queryStrings.legislacoes.estado.enum.concat(
        await this.load("vc_legStatus")
      );

      this.queryStrings.legislacoes.fonte.enum = this.queryStrings.legislacoes.fonte.enum.concat(
        await this.load("vc_legFonte")
      );
    } catch (erro) {
      if (erro.response && erro.response.data) {
        this.text = erro.response.data[0].msg || erro.response.data;
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
    downloadData(filename, content, format, encoding) {
      var blob = new Blob([content], {
        type: format + `;charset=${encoding};`,
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

      path = path.includes("?") ? lhost + path + "&" + token : lhost + path + "?" + token;

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
        var path = "/" + this.tipo.path + this.id;

        //criar query string
        if (Object.keys(this.queriesSel).length > 0) {
          var q = [];
          for (var key in this.queriesSel) {
            if (
              this.queriesSel[key] != "Por definir" &&
              this.queriesSel[key] != "" &&
              key != "encoding"
            ) {
              q.push(key + "=" + encodeURIComponent(this.queriesSel[key]));
            }
          }

          if (q.length > 0) {
            path += "?" + q.join("&");
          }
        }

        if (this.tipo.filename != "ontologia") {
          //obter dados
          try {
            var response = await this.$request("get", path);
          } catch (erro) {
            if (erro.response && erro.response.data) {
              this.text = erro.response.data[0].msg || erro.response.data;
            } else {
              this.text = erro;
            }
            this.alertType = "error";
            return;
          }

          //criar ficheiro e devolver ao user
          var fcf = this.defineParams(response.data);
          var encoding = "utf-8";
          if (this.queriesSel.encoding && this.queriesSel.encoding != "") {
            encoding = this.queriesSel.encoding;
            if (encoding != "utf-8") {
              fcf[1] = iconv.encode(fcf[1], encoding);
            }
          }
          this.downloadData(fcf[0], fcf[1], fcf[2], encoding);
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
    },
    load: async function (voc) {
      var response = await this.$request("get", "/vocabularios/" + voc);
      var list = response.data.map((e) => e.termo);

      if (list.length > 0 && typeof list[0] === "object") {
        list = list.sort((a, b) => a.text.localeCompare(b.text));
      } else {
        list = list.sort();
      }

      return list;
    },
  },
};
</script>

<style scoped>
#text-field {
  text-align: center !important;
}

.centered-input >>> input {
  text-align: center;
}

#advanced-search-card {
  padding: 8px;
  background: #dee2f8;
  color: #1a237e;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 0 20px 20px 0;
}

.separador {
  color: white;
  font-weight: 400;
  padding: 22px;
  margin-top: 20px;
  align-content: center;
  min-height: 55px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}

.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}

#dark-background-list {
  background-color: #0056b6 !important;
}

.v-btn__content {
  color: black !important;
}

.margin-mdUp {
  margin-right: 10% !important;
  margin-left: 10% !important;
}

.margin-smDown {
  margin-right: 2% !important;
  margin-left: 2% !important;
}

.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.3);
}

#treeview-card {
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.32);
  border-radius: 10px;
  background-color: #f4f5f7;
}
</style>
