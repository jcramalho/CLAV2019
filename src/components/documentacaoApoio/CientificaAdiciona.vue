<template>
  <v-card class="pa-3" flat>
    <!-- Header -->
    <v-card-title class="clav-content-title-1" dark>
      Nova Entrada na Documentação Técnica/Científica
    </v-card-title>
    <!-- Content -->
    <v-card-text>
      <Campo nome="Visível" color="neutralpurple">
        <template v-slot:conteudo>
          <v-radio-group v-model="documento.visivel" row hide-details>
            <v-radio label="Sim" :value="true"></v-radio>
            <v-radio label="Não" :value="false"></v-radio>
          </v-radio-group>
        </template>
      </Campo>

      <Campo nome="Subsecção" color="neutralpurple">
        <template v-slot:conteudo>
          <v-select
            v-model="documento.classe"
            searchable="true"
            filterable="true"
            close-on-select="true"
            dir="ltr"
            :items="tipos"
            dense
          >
          </v-select>
        </template>
      </Campo>

      <Campo nome="Título" color="neutralpurple">
        <template v-slot:conteudo>
          <v-text-field
            clearable
            color="indigo"
            counter="150"
            single-line
            v-model="documento.titulo"
            maxlength="150"
            dense
          ></v-text-field>
        </template>
      </Campo>

      <Campo nome="Formato" color="neutralpurple">
        <template v-slot:conteudo>
          <v-radio-group v-on:change="changeInfo" v-model="content" row hide-details>
            <v-radio label="URL" value="url"></v-radio>
            <v-radio label="Ficheiro" value="ficheiro"></v-radio>
          </v-radio-group>
        </template>
      </Campo>

      <Campo v-if="this.content == 'url'" nome="URL" color="neutralpurple">
        <template v-slot:conteudo>
          <v-text-field
            clearable
            color="indigo"
            counter="150"
            single-line
            v-model="documento.url"
            maxlength="150"
            dense
          ></v-text-field>
        </template>
      </Campo>

      <Campo v-if="this.content == 'ficheiro'" nome="Ficheiro" color="neutralpurple">
        <template v-slot:conteudo>
          <v-file-input
            v-model="documento.ficheiro"
            placeholder="Selecione o ficheiro a submeter"
            show-size
            clearable
            single-line
            accept="*"
            dense
          ></v-file-input>
        </template>
      </Campo>

      <Campo nome="Local" color="neutralpurple">
        <template v-slot:conteudo>
          <v-text-field
            dense
            clearable
            color="indigo"
            counter="150"
            single-line
            v-model="documento.local"
            maxlength="150"
          ></v-text-field>
        </template>
      </Campo>

      <Campo nome="Ano" color="neutralpurple">
        <template v-slot:conteudo>
          <v-select
            v-model="documento.ano"
            searchable="true"
            filterable="true"
            close-on-select="true"
            dir="ltr"
            :items="opcoes_ano"
            dense
          >
          </v-select>
        </template>
      </Campo>

      <Campo nome="Autor(es)" color="neutralpurple">
        <template v-slot:conteudo>
          <v-text-field
            v-for="(input, k) in documento.autores"
            :key="k"
            clearable
            color="indigo"
            counter="150"
            single-line
            v-model="input.nome"
            maxlength="150"
            auto
            dense
          >
            <template v-slot:append>
              <v-btn
                small
                text
                @click="remove(k)"
                v-show="k || (!k && documento.autores.length > 1)"
                ><v-icon>remove</v-icon></v-btn
              >
              <v-btn small text @click="add(k)" v-show="k == documento.autores.length - 1"
                ><v-icon>add</v-icon></v-btn
              >
            </template>
          </v-text-field>
        </template>
      </Campo>
    </v-card-text>
    <PainelOperacoesDocumentacaoCientifica :t="documento" :acao="'Criação'" />
  </v-card>
</template>

<script>
import PainelOperacoesDocumentacaoCientifica from "@/components/documentacaoApoio/PainelOperacoesDocumentacaoCientifica";
import Campo from "@/components/generic/CampoCLAV";

export default {
  components: {
    PainelOperacoesDocumentacaoCientifica,
    Campo,
  },
  data: (nt) => ({
    opcoes: [
      { key: "Sim", value: true },
      { key: "Não", value: false },
    ],
    documento: {
      classe: "",
      titulo: "",
      url: "",
      local: "",
      autores: [{ nome: "" }],
      ano: new Date().getFullYear(),
      visivel: false,
      ficheiro: null,
    },
    tipos: [],
    opcoes_ano: [],
    content: "empty",
  }),
  methods: {
    add(index) {
      this.documento.autores.push({ nome: "" });
    },
    remove(index) {
      this.documento.autores.splice(index, 1);
    },
    async changeInfo() {
      if (this.content == "ficheiro") {
        this.documento.url = "FICHEIRO";
        this.documento.ficheiro = null;
      }
      if (this.content == "url") {
        this.documento.url = "";
        this.documento.ficheiro = null;
      }
    },
  },
  created: async function () {
    /*
    let response = await this.$request(
      "get",
      "/documentacaoCientifica/classes"
    );

    this.tipos = response.data;
    */
    this.tipos = ["Comunicações e Artigos", "Provas Académicas"];
    try {
      for (var i = 2030; i >= 2010; i--) {
        this.opcoes_ano.push(i);
      }
    } catch (e) {
      return e;
    }
  },
};
</script>

<style scoped></style>
