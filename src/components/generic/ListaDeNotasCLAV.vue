<template>
  <Campo :nome="nome" :infoHeader="infoHeader" :infoBody="infoBody" color="neutralpurple">
    <template v-slot:lateral>
      <v-btn small color="success" rounded @click="insereNovaNota(objeto.notasAp, 'na')">
        Nota de aplicação
        <v-icon right>add_circle_outline</v-icon>
      </v-btn>
    </template>
    <template v-slot:conteudo>
      <v-row v-for="(nota, index) in objeto.notasAp" :key="index">
        <v-col>
          <v-textarea
            v-model="nota.nota"
            auto-grow
            solo
            label="Nota de Aplicação"
            rows="1"
          ></v-textarea>
          <v-row>
            <v-spacer />
            <v-col align="right">
              <v-btn color="error" rounded @click="objeto.notasAp.splice(index, 1)">
                Remover
                <v-icon dark right>remove_circle_outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-snackbar v-model="vaziaFlag" color="warning" :timeout="60000">
        <v-row>
          <v-col cols="10">
            <div>{{ mensagemNotaVazia }}</div>
          </v-col>
          <v-col cols="2" align="center">
            <v-btn text @click="vaziaFlag = false">Fechar</v-btn>
          </v-col>
        </v-row>
      </v-snackbar>

      <v-snackbar v-model="duplicadaFlag" color="error" :timeout="60000">
        <v-row>
          <v-col cols="10">
            <div>{{ mensagemNotaDuplicada }}</div>
          </v-col>
          <v-col cols="2" align="center">
            <v-btn text @click="duplicadaFlag = false">Fechar</v-btn>
          </v-col>
        </v-row>
      </v-snackbar>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/Campo";
const nanoid = require("nanoid");
const help = require("@/config/help").help;

export default {
  name: "ListaDeNotasCLAV",
  props: ["nome", "infoHeader", "infoBody", "objeto"],
  components: {
    Campo,
  },
  created() {},
  data() {
    return {
      myhelp: help,
      vaziaFlag: false,
      duplicadaFlag: false,
      mensagemNotaVazia:
        "A nota anterior encontra-se vazia. Queira preenchê-la antes de criar nova.",
      mensagemNotaDuplicada:
        "A última nota introduzida é um duplicado de outra já introduzida previamente!",
    };
  },
  methods: {
    notaDuplicada: function (notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1].nota;
        var duplicados = notas.filter((n) => n.nota == lastNota);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovaNota: async function (notas, tipo) {
      if (notas.length > 0 && notas[notas.length - 1].nota == "") {
        this.vaziaFlag = true;
      } else if (this.notaDuplicada(notas)) {
        this.duplicadaFlag = true;
      } else {
        var n = { id: tipo + "_" + nanoid(), nota: "" };
        notas.push(n);
      }
    },
  },
};
</script>

<style scoped></style>
