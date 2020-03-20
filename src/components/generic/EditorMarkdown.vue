<template>
  <v-col>
    <v-textarea
      auto-grow
      solo
      clearable
      color="indigo"
      counter="3000"
      v-model="value"
      maxlength="3000"
      ref="descricao"
      @click:clear="custom_clear()"
      @input="updateText"
    ></v-textarea>
    <v-toolbar dense short flat>
      <v-toolbar-title>Elementos de Texto</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addHeader" v-on="on"
            ><v-icon>title</v-icon></v-btn
          >
        </template>
        <span>Título</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addBold" v-on="on"
            ><v-icon>format_bold</v-icon></v-btn
          >
        </template>
        <span>Negrito</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addItalic" v-on="on"
            ><v-icon>format_italic</v-icon></v-btn
          >
        </template>
        <span>Itálico</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addChain" v-on="on"
            ><v-icon>strikethrough_s</v-icon></v-btn
          >
        </template>
        <span>Texto Tachado</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addLink" v-on="on"
            ><v-icon>insert_link</v-icon></v-btn
          >
        </template>
        <span>Hiperligação</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addLine" v-on="on"
            ><v-icon>minimize</v-icon></v-btn
          >
        </template>
        <span>Linha Horizontal</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addListItem" v-on="on"
            ><v-icon>format_list_bulleted</v-icon></v-btn
          >
        </template>
        <span>Item de Lista</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn small text @click="addTable" v-on="on"
            ><v-icon>table_chart</v-icon></v-btn
          >
        </template>
        <span>Tabela</span>
      </v-tooltip>
      <v-dialog v-model="dialog" width="50%">
        <template v-slot:activator="{ on }">
          <v-btn small dark rounded class="indigo darken-3" v-on="on"
            ><v-icon>visibility</v-icon>Pré-visualização</v-btn
          >
        </template>
        <v-card>
          <v-card-title>Pré-visualização</v-card-title>
          <v-card-text>
            <p class="text-justify" v-html="compiledMarkdown(this.value)" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-1" text @click="dialog = false"
              >Continuar o trabalho</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </v-col>
</template>

<script>
import marked from "marked";

export default {
  props: ["value"],
  data: nt => ({
    dialog: false,
    snackbar: false
  }),
  methods: {
    updateText(e) {
      //this.$refs.descricao.value
      this.$emit("input", this.value);
    },
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
    custom_clear() {
      this.value = "";
    },
    addHeader() {
      let textarea = this.$refs.descricao;
      let val = textarea.$refs.input;
      let start = val.selectionStart;
      let end = val.selectionEnd;
      let tmpStr = textarea.value;
      var insert = "";
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = "\n# Título  \n";
      } else {
        insert = "\n# " + tmpStr.substring(start, end) + "  \n";
      }
      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " __texto__ ";
      } else {
        insert = " __" + tmpStr.substring(start, end) + "__ ";
      }
      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " *texto* ";
      } else {
        insert = " *" + tmpStr.substring(start, end) + "* ";
      }
      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " ~~texto~~ ";
      } else {
        insert = " ~~" + tmpStr.substring(start, end) + "~~ ";
      }
      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = " [texto](http://ligação) ";
      } else {
        insert = " [" + tmpStr.substring(start, end) + "](http://ligação) ";
      }
      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = "\n___  \n  ";
        this.value =
          tmpStr.substring(0, start) +
          insert +
          tmpStr.substring(end, tmpStr.length);
      } else {
        insert = "\n___  \n  ";
        this.value =
          tmpStr.substring(0, end) +
          insert +
          tmpStr.substring(end, tmpStr.length);
      }

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }

      // insert:
      if (end == start) {
        insert = "* Item ";
      } else {
        insert = "* " + tmpStr.substring(start, end) + "  \n";
      }
      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

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
      if (!this.value) {
        this.value = "";
        tmpStr = "";
      }
      var insert =
        "\n|  X  |  Y  |  Z  |\n|:----:|:----:|:----:|\n|  1  |  2  |  3  | ";

      this.value =
        tmpStr.substring(0, start) +
        insert +
        tmpStr.substring(end, tmpStr.length);

      this.updateText();

      // move cursor:
      setTimeout(() => {
        start += insert.length;
        val.selectionStart = val.selectionEnd = start;
      }, 10);
    },
    compiledMarkdown: function(d) {
      return marked(d, { sanitize: true });
    }
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
