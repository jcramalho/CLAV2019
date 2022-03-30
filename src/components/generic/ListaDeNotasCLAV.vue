<template>
  <Campo :nome="nome" :infoHeader="infoHeader" :infoBody="infoBody" color="neutralpurple">
    <template v-slot:lateral>
      <v-row>
        <v-col align="right">
          <v-btn small color="success" rounded @click="insereNovaNota(lista)">
            {{ acrescentar[tipo] }}
            <v-icon right>add_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-slot:conteudo>
      <v-alert v-if="!lista.length" color="warning" border="left">{{
        aviso[tipo]
      }}</v-alert>

      <v-row v-else v-for="(nota, index) in lista" :key="index">
        <v-col>
          <v-textarea
            v-model="nota[campo]"
            auto-grow
            solo
            label="Este campo deve ser preenchido!"
            rows="1"
          ></v-textarea>
          <v-row>
            <v-spacer />
            <v-col align="right">
              <v-btn color="error" rounded @click="lista.splice(index, 1)">
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
import Campo from "@/components/generic/CampoCLAV";
const nanoid = require("nanoid");

export default {
  name: "ListaDeNotasCLAV",
  props: ["nome", "infoHeader", "infoBody", "objeto", "tipo"],
  components: {
    Campo,
  },
  created() {},
  data() {
    return {
      vaziaFlag: false,
      duplicadaFlag: false,
      mensagemNotaVazia:
        "A nota anterior encontra-se vazia. Queira preenchê-la antes de criar nova.",
      mensagemNotaDuplicada:
        "A última nota introduzida é um duplicado de outra já introduzida previamente!",
      acrescentar: {
        na: "Acrescentar nota",
        exna: "Acrescentar nota",
        ne: "Acrescentar nota",
        ti: "Acrescentar termo",
      },
      aviso: {
        na: "Sem Notas de Aplicação!",
        exna: "Sem Exemplos de Notas de Aplicação!",
        ne: "Sem Notas de Exclusão!",
        ti: "Sem Termos de Índice",
      },
    };
  },
  computed: {
    lista() {
      switch (this.tipo) {
        case "na":
          return this.objeto.notasAp;
        case "exna":
          return this.objeto.exemplosNotasAp;
        case "ne":
          return this.objeto.notasEx;
        case "ti":
          return this.objeto.termosInd;
        default:
          return [];
      }
    },
    campo() {
      switch (this.tipo) {
        case "na":
        case "ne":
          return "nota";
        case "exna":
          return "exemplo";
        case "ti":
          return "termo";
        default:
          return "";
      }
    },
  },
  methods: {
    notaDuplicada: function (notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1][this.campo];
        var semEspacos = lastNota.trim();
        var duplicados = notas.filter((n) => n[this.campo] == semEspacos);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovaNota: async function (notas) {
      if(notas.length > 0) 
        notas[notas.length - 1][this.campo] = (notas[notas.length - 1][this.campo]).trim()
        //console.log('['+ notas[notas.length - 1][this.campo] + ']')
      if (notas.length > 0 && notas[notas.length - 1][this.campo] == "") {
        this.vaziaFlag = true;
      } else if (this.notaDuplicada(notas)) {
        this.duplicadaFlag = true;
      } else {
        var n = { id: this.tipo + "_" + nanoid() };
        n[this.campo] = "";
        if (this.tipo === "ti") n.existe = false;
        notas.push(n);
      }
    },
  },
};
</script>

<style scoped></style>
