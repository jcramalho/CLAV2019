<template>
  <Loading v-if="!pubsReady" :message="'documentação científica'" />
  <v-expansion-panel v-else>
    <v-expansion-panel-header
      >Produção Técnica e Científica</v-expansion-panel-header
    >
    <v-expansion-panel-content>
      <v-card>
        <v-card-text>
          <div v-for="item in listaPubs" :key="item.classe" class="subtitle">
            {{ item.classe }}
            <v-list two-line subheader>
              <v-list-item
                v-for="documento in item.documentos"
                :key="documento.ano"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ documento.ano }}</v-list-item-title>
                  <ul>
                    <li
                      v-for="publicacao in documento.publicacoes"
                      :key="publicacao._id"
                    >
                      <b
                        ><a
                          v-if="publicacao.url !== 'FICHEIRO'"
                          :href="publicacao.url"
                          >{{ publicacao.titulo }}</a
                        >
                        <span 
                          class="fakea"
                          v-else
                          href="#"
                          @click="downloadFile(publicacao._id)"
                        >{{ publicacao.titulo }}</span></b
                      >, {{ publicacao.local }};
                      <span v-for="(a,index) in publicacao.autores" :key="`${a}${index}`"
                        >{{ nameWithComma(a, index, publicacao.autores.length) }}&nbsp;</span
                      >
                      <v-icon
                        v-for="(operacao, index) in operacoes"
                        @click="
                          switchOperacao(operacao.descricao, publicacao._id)
                        "
                        :color="operacao.cor"
                        :key="index"
                        >{{ operacao.icon }}</v-icon
                      >
                    </li>
                  </ul>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
    <v-dialog :value="eliminarId != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende eliminar o documento?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="eliminarId = ''">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="remover(eliminarId)">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      :top="true"
    >
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
    <div v-if="this.level >= this.min">
      <v-btn
        color="indigo accent-4"
        dark
        small
        class="ma-2"
        @click="go('/documentacaoApoio/importar/tecnico_cientifico')"
        >Importar</v-btn
      >
      <v-btn
        color="indigo accent-4"
        dark
        small
        class="ma-2"
        @click="exportarFicheiro()"
        >Exportar</v-btn
      >
    </div>
  </v-expansion-panel>
</template>

<script>
import Loading from "@/components/generic/Loading";
const lhost = require("@/config/global").host;
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  props: ["level"],
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      listaPubs: [],
      pubsReady: false,
      operacoes: [],
      dialog: false,
      snackbar: false,
      text: "",
      color: "",
      timeout: 4000,
      eliminarId: "",
      done: false,
      min: NIVEL_MINIMO_ALTERAR
    };
  },
  components: {
    Loading
  },
  methods: {
    nameWithComma(a, index, length){
      if(index !== length-1){
        return `${a}; `;
      }else{
        return a;
      }
    },
    groupBy: function(key, array) {
      var result = [];
      for (var i = 0; i < array.length; i++) {
        var added = false;
        for (var j = 0; j < result.length; j++) {
          if (result[j][key] == array[i][key]) {
            result[j].publicacoes.push(array[i]);
            added = true;
            break;
          }
        }
        if (!added) {
          var entry = { publicacoes: [] };
          entry[key] = array[i][key];
          entry.publicacoes.push(array[i]);
          result.push(entry);
        }
      }
      return result;
    },
    preparaConteudo: async function(conteudo) {
      try {
        var response = conteudo;
        // Remover da lista entradas nao visiveis consoante o nivel
        if (this.level < NIVEL_MINIMO_ALTERAR) {
          response = response.filter(item => item.visivel);
        }
        // Agrupar por classe
        var classes = response.reduce(
          (p, c) => (
            p[c.classe] ? p[c.classe].push(c) : (p[c.classe] = [c]), p
          ),
          {}
        );
        // Agrupar por ano em cada classe
        response = Object.keys(classes).map(k => ({
          classe: k,
          documentos: this.groupBy("ano", classes[k]).sort((a, b) =>
            a.ano < b.ano ? 1 : -1
          )
        }));
        return response;
      } catch (e) {
        return {};
      }
    },
    goEditar(id) {
      this.$router.push("/documentacaoApoio/editar/tecnico_cientifico/" + id);
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
    async downloadFile(id) {
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      var path = "/documentacaoCientifica/" + id + "/ficheiro";
      path = lhost + path + "?" + token;
      this.download(path, "");
    },
    async exportarFicheiro() {
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      var path = "/documentacaoCientifica/exportar";
      path = lhost + path + "?" + token;
      this.download(path, "");
    },
    remover(id) {
      this.$request("delete", "/documentacaoCientifica/" + id)
        .then(res => {
          this.text = res.data;
          this.color = "success";
          this.snackbar = true;
          this.eliminarId = "";
          this.done = true;
          this.getDocumentacao();
        })
        .catch(e => {
          this.text = e.response.data;
          this.color = "error";
          this.snackbar = true;
          this.eliminarId = "";
          this.done = false;
        });
    },
    async switchOperacao(op, id) {
      switch (op) {
        case "Alteração":
          this.goEditar(id);
          break;

        case "Remoção":
          this.eliminarId = id;
          break;

        default:
          break;
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getDocumentacao();
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async getDocumentacao() {
      try {
        let response = await this.$request("get", "/documentacaoCientifica");

        let conteudo = response.data;

        this.listaPubs = await this.preparaConteudo(conteudo);

        this.pubsReady = true;
      } catch (e) {
        return e;
      }
    },
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração", cor: "indigo darken-2" },
          { icon: "delete", descricao: "Remoção", cor: "red" }
        ];
      }
    }
  },
  created: async function() {
    let response = await this.$request("get", "/documentacaoCientifica");

    let conteudo = response.data; 

    this.preparaOperacoes(this.level);

    this.listaPubs = await this.preparaConteudo(conteudo);

    this.pubsReady = true;
  }
};
</script>

<style>
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}

.fakea {
  color: #1A76D2;
}
</style>
