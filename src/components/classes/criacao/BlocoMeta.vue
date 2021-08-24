<template>
  <!-- BLOCO DE METAINFORMAÇÃO -->
  <div>
    <!-- Nível -->
    <Campo nome="Nível" color="neutralpurple">
      <template v-slot:conteudo>
        <v-radio-group v-model="c.nivel" row hide-details class="mt-1">
          <v-radio
            v-for="(n, i) in classeNiveis"
            :key="i"
            :label="n.label"
            :value="n.value"
            color="blue"
          ></v-radio>
        </v-radio-group>
      </template>
    </Campo>

    <!-- CLASSE PAI -->
    <Campo
      v-if="c.nivel > 1"
      nome="Classe pai"
      color="neutralpurple"
      infoHeader="Classe pai"
      :infoBody="myhelp.Classe.Campos.Pai"
    >
      <template v-slot:conteudo>
        <v-select
          class="mt-n5 px-3"
          item-text="label"
          item-value="value"
          v-model="c.pai.codigo"
          :items="classesPai"
          label="Selecione uma classe de nível superior"
          clearable
          hide-details
          single-line
        />
      </template>
    </Campo>

    <!-- CÓDIGO DA NOVA CLASSE -->
    <Campo
      v-if="c.nivel == 1 || c.pai.codigo"
      nome="Código"
      color="neutralpurple"
      infoHeader="Código da Classe"
      :infoBody="myhelp.Classe.Campos.Codigo"
    >
      <template v-slot:conteudo>
        <v-text-field
          class="mt-n4 px-3"
          v-model="c.codigo"
          label="Código"
          text
          hide-details
          single-line
          clearable
        ></v-text-field>
        <span
          v-if="mensValCodigo"
          style="color: var(--v-error-base); font-size: 13px"
          class="px-3"
        >
          {{ mensValCodigo }}
        </span>
      </template>
    </Campo>

    <!-- TÍTULO -->
    <Campo
      v-if="c.nivel == 1 || c.pai.codigo"
      nome="Título"
      color="neutralpurple"
      infoHeader="Título da Classe"
      :infoBody="myhelp.Classe.Campos.Titulo"
    >
      <template v-slot:conteudo>
        <v-text-field
          class="mt-n4 px-3"
          v-model="c.titulo"
          label="Título"
          text
          hide-details
          single-line
          clearable
        ></v-text-field>
      </template>
    </Campo>
  </div>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import Campo from "@/components/generic/Campo.vue";

export default {
  props: ["c"],

  components: {
    Campo,
  },

  data() {
    return {
      myhelp: help,
      classeNiveis: [
        { label: "Nível 1", value: "1" },
        { label: "Nível 2", value: "2" },
        { label: "Nível 3", value: "3" },
      ],
      classesPai: [],
      mensValCodigo: "",
    };
  },

  watch: {
    "c.pai.codigo": function () {
      // O código da classe depende da classe pai
      this.c.codigo = "";
      if (this.c.pai.codigo) this.c.codigo = this.c.pai.codigo + ".";
    },

    "c.nivel": function () {
      // A classe pai depende do nível
      this.c.pai.codigo = "";

      if (this.c.nivel > 1) {
        this.loadPais();
      }
    },

    "c.codigo": async function () {
      try {
        this.mensValCodigo = "";
        if (!this.codeFormats[this.c.nivel].test(this.c.codigo)) {
          this.mensValCodigo =
            "Formato de código inválido! Deve ser: " + this.formatoCodigo[this.c.nivel];
        } else if (!this.c.codigo.includes(this.c.pai.codigo)) {
          this.mensValCodigo = "Não pode alterar o código do pai selecionado em cima...";
        } else {
          var existe = await this.verificaExistenciaCodigo(this.c.codigo);
          if (existe) {
            this.mensValCodigo = "Código já existente na base de dados...";
          }
        }
      } catch (erro) {
        return erro;
      }
    },
  },

  methods: {
    // Carrega os potenciais pais da BD, quando alguém muda o nível para >1....................
    loadPais: async function () {
      try {
        var response = await this.$request("get", "/classes?nivel=" + (this.c.nivel - 1));
        this.classesPai = response.data
          .map(function (item) {
            return {
              label: item.codigo + " - " + item.titulo,
              value: item.id.split("#c")[1],
            };
          })
          .sort(function (a, b) {
            return a.label.localeCompare(b.label);
          });
      } catch (erro) {
        return erro;
      }
    },
  },
};
</script>

<style scoped></style>
