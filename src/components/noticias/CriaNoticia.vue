<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading">Nova Noticia</v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Título:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="noticia.titulo"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Data</div>
            </v-col>
            <v-col>
              <v-menu
                ref="open"
                v-model="open"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    solo
                    v-model="noticia.data"
                    hint="AAAA-MM-DD"
                    persistent-hint
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                    :rules="regraData"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="open = false"
                  :max="dateCurrent"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Descrição:</div>
            </v-col>
            <v-col>
              <v-textarea
                auto-grow
                solo
                clearable
                color="indigo"
                counter="3000"
                v-model="noticia.desc"
                maxlength="3000"
                ref="descricao"
                @click:clear="custom_clear()"
              ></v-textarea>
              <v-toolbar dense short flat>
                <v-toolbar-title>Elementos de Texto</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn flat small text @click="addHeader"
                  ><v-icon>title</v-icon></v-btn
                >
                <v-btn flat small text @click="addBold"
                  ><v-icon>format_bold</v-icon></v-btn
                >
                <v-btn flat small text @click="addItalic"
                  ><v-icon>format_italic</v-icon></v-btn
                >
                <v-btn flat small text @click="addChain"
                  ><v-icon>strikethrough_s</v-icon></v-btn
                >
                <v-btn flat small text @click="addLink"
                  ><v-icon>insert_link</v-icon></v-btn
                >
                <v-btn flat small text @click="addLine"
                  ><v-icon>minimize</v-icon></v-btn
                >
                <v-btn flat small text @click="addListItem"
                  ><v-icon>format_list_bulleted</v-icon></v-btn
                >
                <v-btn flat small text @click="addTable"
                  ><v-icon>table_chart</v-icon></v-btn
                >
                <v-dialog v-model="dialog" width="50%">
                  <template v-slot:activator="{ on }">
                    <v-btn small dark rounded class="indigo darken-3" v-on="on"
                      ><v-icon>visibility</v-icon>Pré-visualização</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>Pré-visualização</v-card-title>
                    <v-card-text>
                      <p
                        class="text-justify"
                        v-html="compiledMarkdown(this.noticia.desc)"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="indigo darken-1"
                        text
                        @click="dialog = false"
                        >Continuar o trabalho</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Painel Operações -->
        <PainelOpsNot :t="noticia" :acao="'Criação'" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import marked from "marked";
import PainelOpsNot from "@/components/noticias/PainelOperacoesNoticias.vue";

export default {
  data: nt => ({
    noticia: {
      titulo: "",
      data: "",
      desc: ""
    },
    dialog: false,
    dateCurrent: new Date().toISOString().substr(0, 10),
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: nt.formatDate(new Date().toISOString().substr(0, 10)),
    open: false,

    regraData: [
      v =>
        /[0-9]+\-[0-9]+\-[0-9]+/.test(v) || "Este campo está no formato errado."
    ],

    snackbar: false,
    text: ""
  }),

  components: {
    PainelOpsNot
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date(val) {
      this.noticia.data = this.formatDate(this.date);
    }
  },

  methods: {
    // vuetify datepicker
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}-${month}-${day}`;
    },

    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
    custom_clear() {
      this.noticia.desc = "";
    },
    addHeader() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = "\n# Título  \n";
      } else {
        insert = "\n# " + tmpStr.substring(start, end) + "  \n";
      }
      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addBold() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " __texto__ ";
      } else {
        insert = " __" + tmpStr.substring(start, end) + "__ ";
      }
      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addItalic() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " *texto* ";
      } else {
        insert = " *" + tmpStr.substring(start, end) + "* ";
      }
      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addChain() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " ~~texto~~ ";
      } else {
        insert = " ~~" + tmpStr.substring(start, end) + "~~ ";
      }
      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addLink() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " [texto](http://ligação) ";
      } else {
        insert = " [" + tmpStr.substring(start, end) + "](http://ligação) ";
      }
      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addLine() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = "\n___  \n  ";
        this.noticia.desc =
          tmpStr.substring(0, start) +
          insert +
          tmpStr.substring(end, tmpStr.length);
      } else {
        insert = "\n___  \n  ";
        this.noticia.desc =
          tmpStr.substring(0, end) +
          insert +
          tmpStr.substring(end, tmpStr.length);
      }
      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addListItem() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = "* Item ";
      } else {
        insert = "* " + tmpStr.substring(start, end) + "  \n";
      }
      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    addTable() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      if (!this.noticia.desc) {
        this.noticia.desc = "";
        tmpStr = "";
      }
      var insert =
        "\n|  X  |  Y  |  Z  |\n|:----:|:----:|:----:|\n|  1  |  2  |  3  | ";

      this.noticia.desc =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    compiledMarkdown: function(d) {
      return marked(d, { sanitize: true });
    }
  },
  created: function() {
    this.noticia.data = this.dateFormatted;
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
