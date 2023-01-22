<template>
  <Loading v-if="!conteudoReady" :message="'documentação de apoio'" />
  <v-card v-else flat class="ma-4 pa-2">
    <TogglePanelsCLAV :n="panelsArrItems" @alternar="panelsArr = $event" />
    <v-expansion-panels v-model="panelsArr" multiple>
      <PainelCLAV
        v-for="documentacao in this.docapoio"
        :key="documentacao.classe"
        :titulo="documentacao.classe"
        :infoHeader="documentacao.classe"
        :icon="docsicon"
      >
        <template v-slot:conteudo>
          <v-expansion-panel-content>
            <v-card-text v-for="entrada in documentacao.entradas" :key="entrada._id">
              <p class="text-justify">
                <span v-html="compiledMarkdownOmmitParagraph(entrada.descricao)"></span>
                <v-tooltip
                  bottom
                  v-for="(operacao, index) in operacoes_entradas"
                  :key="index"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon
                      @click="
                        switchOperacaoEntrada(
                          operacao.descricao,
                          documentacao._id,
                          entrada._id
                        )
                      "
                      :color="operacao.cor"
                      v-on="on"
                      >{{ operacao.icon }}</v-icon
                    >
                  </template>
                  <span>{{ operacao.tooltip }}</span>
                </v-tooltip>
              </p>
              <ul>
                <div v-for="elemento in entrada.elementos" :key="elemento._id">
                  <!-- No caso de ser uma rota da API -->
                  <li v-if="elemento.texto.rota">
                    <p>
                      <span
                        v-html="compiledMarkdownOmmitParagraph(elemento.texto.pre)"
                      ></span>
                      <span
                        class="fakea"
                        @click="downloadFileRota(elemento.texto.rota)"
                        v-html="compiledMarkdownOmmitParagraph(elemento.texto.ligacao)"
                      ></span>
                      <span
                        v-html="compiledMarkdownOmmitParagraph(elemento.texto.pos)"
                      ></span>
                      <v-tooltip
                        bottom
                        v-for="(operacao, index) in operacoes_elementos"
                        :key="index"
                      >
                        <template v-slot:activator="{ on }">
                          <v-icon
                            @click="
                              switchOperacaoElemento(
                                operacao.descricao,
                                documentacao._id,
                                entrada._id,
                                elemento._id
                              )
                            "
                            :color="operacao.cor"
                            v-on="on"
                            >{{ operacao.icon }}</v-icon
                          >
                        </template>
                        <span>{{ operacao.tooltip }}</span>
                      </v-tooltip>
                    </p>
                  </li>
                  <!-- No caso de ser uma ligacao com ficheiro da API -->
                  <li v-else-if="elemento.texto.ligacao">
                    <p>
                      <span
                        v-html="compiledMarkdownOmmitParagraph(elemento.texto.pre)"
                      ></span>
                      <span
                        class="fakea"
                        @click="downloadFile(documentacao._id, entrada._id, elemento._id)"
                        v-html="compiledMarkdownOmmitParagraph(elemento.texto.ligacao)"
                      ></span>
                      <span
                        v-html="compiledMarkdownOmmitParagraph(elemento.texto.pos)"
                      ></span>
                      <v-tooltip
                        bottom
                        v-for="(operacao, index) in operacoes_elementos"
                        :key="index"
                      >
                        <template v-slot:activator="{ on }">
                          <v-icon
                            @click="
                              switchOperacaoElemento(
                                operacao.descricao,
                                documentacao._id,
                                entrada._id,
                                elemento._id
                              )
                            "
                            :color="operacao.cor"
                            v-on="on"
                            >{{ operacao.icon }}</v-icon
                          >
                        </template>
                        <span>{{ operacao.tooltip }}</span>
                      </v-tooltip>
                    </p>
                  </li>
                  <!-- No caso de ser apenas texto -->
                  <li v-else class="text-justify">
                    <span v-html="compiledMarkdownOmmitParagraph(elemento.texto)"></span>
                    <v-tooltip
                      bottom
                      v-for="(operacao, index) in operacoes_elementos"
                      :key="index"
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon
                          @click="
                            switchOperacaoElemento(
                              operacao.descricao,
                              documentacao._id,
                              entrada._id,
                              elemento._id
                            )
                          "
                          :color="operacao.cor"
                          v-on="on"
                          >{{ operacao.icon }}</v-icon
                        >
                      </template>
                      <span>{{ operacao.tooltip }}</span>
                    </v-tooltip>
                  </li>
                </div>
              </ul>
            </v-card-text>
            <div v-if="level >= min">
              <v-btn
                rounded
                class="white--text ma-1"
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown,
                }"
                color="success darken-1"
                id="botao-shadow"
                @click="go(`/documentacaoApoio/criar/entrada/${documentacao._id}`)"
              >
                <unicon
                  name="criar-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.714 20.71"
                  fill="#ffffff"
                />
                <span class="ml-2">Adicionar Entrada</span>
              </v-btn>
              <v-btn
                rounded
                class="white--text ma-1"
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown,
                }"
                color="neutral darken-2"
                id="botao-shadow"
                @click="go(`/documentacaoApoio/editar/classe/${documentacao._id}`)"
                ><unicon
                  name="alterar-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.714 20.71"
                  fill="#ffffff"
                />
                <span class="ml-2">Editar Secção</span>
              </v-btn>
              <v-btn
                rounded
                class="white--text ma-1"
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown,
                }"
                color="error"
                id="botao-shadow"
                @click="eliminaClasse(documentacao._id)"
              >
                <unicon
                  name="remove-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.714 20.71"
                  fill="#ffffff"
                />
                <span class="ml-2">Eliminar Secção</span>
              </v-btn>
            </div>
          </v-expansion-panel-content>
        </template>
      </PainelCLAV>
      <DocApoioProdTecCientifica :level="level" />
    </v-expansion-panels>

    <v-dialog :value="eliminarIdClasse != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende eliminar a secção? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="eliminarIdClasse = ''"> Cancelar </v-btn>
          <v-btn color="primary" text @click="remover('Classe')"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog :value="eliminarIdEntrada != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende eliminar a entrada? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="
              eliminarIdEntrada = '';
              eliminarIdClasse = '';
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="remover('Entrada')"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog :value="eliminarIdElemento != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende eliminar o elemento? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="
              eliminarIdElemento = '';
              eliminarIdEntrada = '';
              eliminarIdClasse = '';
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="remover('Elemento')"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import { marked } from "marked";
import Loading from "@/components/generic/Loading";
import DocApoioProdTecCientifica from "@/components/principal/DocApoio-ProdTecCientifica.vue";
import TogglePanelsCLAV from "@/components/generic/TogglePanelsCLAV";
import PainelCLAV from "@/components/generic/PainelCLAV";
const lhost = require("@/config/global").host;
import { NIVEL_MINIMO_DOC } from "@/utils/consts";
import { mdiFileDocumentMultipleOutline } from "@mdi/js";

export default {
  components: {
    Loading,
    DocApoioProdTecCientifica,
    TogglePanelsCLAV,
    PainelCLAV,
  },

  data() {
    return {
      level: "",
      docapoio: [],
      conteudoReady: false,
      dialog: false,
      snackbar: false,
      text: "",
      color: "",
      timeout: 4000,
      done: false,
      panelHeaderColor: "indigo darken-4",
      publicPath: process.env.BASE_URL,
      operacoes_entradas: [],
      operacoes_elementos: [],
      eliminarIdClasse: "",
      eliminarIdEntrada: "",
      eliminarIdElemento: "",
      min: NIVEL_MINIMO_DOC,
      panelsArr: [],
      panelsArrItems: 0,
      docsicon: mdiFileDocumentMultipleOutline,
    };
  },
  methods: {
    preparaConteudo: async function (conteudo) {
      try {
        var response = conteudo;
        // Remover elementos nao visiveis consoante o nivel
        if (this.level < NIVEL_MINIMO_DOC) {
          response = response.map((classe) => {
            classe.entradas.map((entrada) => {
              entrada.elementos.filter((elemento) => elemento.visivel);
            });
            return classe;
          });
        }

        var res = response;
        for (let i = 0; i < response.length; i++) {
          var entradas = response[i].entradas;
          for (let j = 0; j < entradas.length; j++) {
            var elementos = entradas[j].elementos;
            for (let k = 0; k < elementos.length; k++) {
              var texto = elementos[k].texto;
              var items = texto.match(/\[.*?\]\(FICHEIRO\)/gm);
              // Caso possua um link com ficheiro
              if (items && items[0]) {
                var lista = texto.split(items[0]);
                var pre_text = lista[0];
                var pos_text = lista[1];
                var link_text = items[0].match(/\[(.*?)\]/i)[1];
                var texto_novo = {
                  pre: pre_text,
                  ligacao: link_text,
                  pos: pos_text,
                };
                response[i].entradas[j].elementos[k].texto = texto_novo;
              }

              //Caso possua uma rota da API
              var itemsAPI = texto.match(/\[.*?\]\(CLAV_API\/[^\(\)]*\)/gm);
              if (itemsAPI && itemsAPI[0]) {
                var lista = texto.split(itemsAPI[0]);
                var pre_text = lista[0];
                var pos_text = lista[1];
                var link_text = itemsAPI[0].match(/\[(.*?)\]/i)[1];
                var route_text = itemsAPI[0]
                  .match(/\(CLAV_API.*(?=\))/gm)[0]
                  .split("(CLAV_API")[1];
                var texto_novo = {
                  pre: pre_text,
                  ligacao: link_text,
                  rota: route_text,
                  pos: pos_text,
                };
                response[i].entradas[j].elementos[k].texto = texto_novo;
              }
            }
          }
        }
        return response;
      } catch (e) {
        return {};
      }
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
    async downloadFile(classe, entrada, elemento) {
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      var path =
        "/documentacaoApoio/" +
        classe +
        "/entradas/" +
        entrada +
        "/elementos/" +
        elemento +
        "/ficheiro";
      path = lhost + path + "?" + token;
      this.download(path, "");
    },
    async downloadFileRota(path) {
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      path = lhost + path + "?" + token;
      this.download(path, "");
    },
    async switchOperacaoEntrada(op, id, entrada) {
      switch (op) {
        case "Adição":
          this.goAdicionarElemento(id, entrada);
          break;

        case "Alteração":
          this.goEditarEntrada(id, entrada);
          break;

        case "Remoção":
          this.eliminarIdClasse = id;
          this.eliminarIdEntrada = entrada;
          break;

        default:
          break;
      }
    },
    async switchOperacaoElemento(op, id, entrada, elemento) {
      switch (op) {
        case "Alteração":
          this.goEditarElemento(id, entrada, elemento);
          break;

        case "Remoção":
          this.eliminarIdClasse = id;
          this.eliminarIdEntrada = entrada;
          this.eliminarIdElemento = elemento;
          break;

        default:
          break;
      }
    },
    remover(type) {
      if (type == "Classe") {
        this.$request("delete", "/documentacaoApoio/" + this.eliminarIdClasse)
          .then((res) => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.eliminarIdClasse = "";
            this.done = true;
            this.getDocumentacao();
          })
          .catch((e) => {
            this.text = e.response.data;
            this.color = "error";
            this.snackbar = true;
            this.eliminarIdClasse = "";
            this.done = false;
          });
      }
      if (type == "Entrada") {
        this.$request(
          "delete",
          "/documentacaoApoio/" +
            this.eliminarIdClasse +
            "/entradas/" +
            this.eliminarIdEntrada
        )
          .then((res) => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.eliminarIdClasse = "";
            this.eliminarIdEntrada = "";
            this.done = true;
            this.getDocumentacao();
          })
          .catch((e) => {
            this.text = e.response.data;
            this.color = "error";
            this.snackbar = true;
            this.eliminarIdEntrada = "";
            this.done = false;
          });
      }
      if (type == "Elemento") {
        this.$request(
          "delete",
          "/documentacaoApoio/" +
            this.eliminarIdClasse +
            "/entradas/" +
            this.eliminarIdEntrada +
            "/elementos/" +
            this.eliminarIdElemento
        )
          .then((res) => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.eliminarIdClasse = "";
            this.eliminarIdEntrada = "";
            this.eliminarIdElemento = "";
            this.done = true;
            this.getDocumentacao();
          })
          .catch((e) => {
            this.text = e.response.data;
            this.color = "error";
            this.snackbar = true;
            this.eliminarIdClasse = "";
            this.eliminarIdEntrada = "";
            this.eliminarIdElemento = "";
            this.done = false;
          });
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getDocumentacao();
    },
    async getDocumentacao() {
      try {
        let response = await this.$request("get", "/documentacaoApoio");

        this.docapoio = await this.preparaConteudo(response.data);

        this.conteudoReady = true;
      } catch (e) {
        return e;
      }
    },
    eliminaClasse(id) {
      this.eliminarIdClasse = id;
    },
    goAdicionarElemento(id, entrada) {
      this.$router.push("/documentacaoApoio/criar/elemento/" + id + "/" + entrada);
    },
    goEditarClasse(id) {
      this.$router.push("/documentacaoApoio/editar/classe/" + id);
    },
    goEditarEntrada(id, entrada) {
      this.$router.push("/documentacaoApoio/editar/entrada/" + id + "/" + entrada);
    },
    goEditarElemento(id, entrada, elemento) {
      this.$router.push(
        "/documentacaoApoio/editar/elemento/" + id + "/" + entrada + "/" + elemento
      );
    },
    preparaOperacoesEntradaElemento(level) {
      if (level >= NIVEL_MINIMO_DOC) {
        this.operacoes_entradas = [
          {
            icon: "edit",
            descricao: "Alteração",
            cor: "indigo darken-2",
            tooltip: "Editar Entrada",
          },
          {
            icon: "delete",
            descricao: "Remoção",
            cor: "red",
            tooltip: "Remover Entrada",
          },
          {
            icon: "add",
            descricao: "Adição",
            cor: "indigo darken-2",
            tooltip: "Adicionar Elemento",
          },
        ];
        this.operacoes_elementos = [
          {
            icon: "edit",
            descricao: "Alteração",
            cor: "indigo darken-2",
            tooltip: "Editar Elemento",
          },
          {
            icon: "delete",
            descricao: "Remoção",
            cor: "red",
            tooltip: "Remover Elemento",
          },
        ];
      }
    },
    go: function (url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    compiledMarkdown: function (d) {
      return marked(d || "");
    },
    compiledMarkdownOmmitParagraph: function (d) {
      return new marked.inlineLexer(d || "", []);
    },
  },

  created: async function () {
    let response = await this.$request("get", "/documentacaoApoio");
    this.docapoio = await this.preparaConteudo(response.data);
    console.log(this.docapoio);
    this.level = await this.$userLevel();
    await this.preparaOperacoesEntradaElemento(this.level);
    this.conteudoReady = true;
    this.panelsArrItems = this.docapoio.length;
  },
};
</script>
<style>
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}

.fakea {
  color: #1a76d2;
}

.separador {
  color: white;
  padding: 5px;
  margin: 5px;
  font-weight: 400;
  width: 100%;
  min-height: 50px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
#expanded-content {
  margin-right: 12px !important;
  margin-left: 17px !important;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
