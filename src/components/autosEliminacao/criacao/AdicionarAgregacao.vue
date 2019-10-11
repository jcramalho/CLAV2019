<template>
  <div>
    <v-row justify="end" class="ma-4">
      <v-btn @click="addAG=true" style="color: #1a237e; background-color: #dee2f8;">Adicionar Agregação</v-btn>
    </v-row>
    <v-dialog v-model="addAG" max-width="80%">
      <v-card>
        <v-card-title class="expansion-panel-heading">Adicionar Agregação</v-card-title>

        <v-card-text class="mt-4">
          <v-row>
            <v-col :md="2">
              <div class="info-label">Código da Agregação:</div>
            </v-col>
            <v-col>
              <v-text-field
                hint="Exemplo: AS_DGLAB_1/2019"
                label="Insira um código para a agregação"
                v-model="codigo"
                solo
                clearable
              >Insira um codigo para a agregação</v-text-field>
            </v-col>
            <v-col :md="2">
              <div class="info-label">Titulo da Agregação:</div>
            </v-col>
            <v-col>
              <v-text-field
                hint="Exemplo: Auditoria à Entidade A"
                label="Insira um título para a agregação"
                v-model="titulo"
                solo
                clearable
              >Insira um codigo para a agregação</v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col :md="2">
              <div class="info-label">Data de Contagem do PCA:</div>
            </v-col>
            <v-col>
              <v-text-field
                hint="Exemplo: 2009"
                label="Insira o ano de contagem do PCA"
                v-model="dataContagem"
                solo
                clearable
              >Insira um codigo para a agregação</v-text-field>
            </v-col>
            <v-col :md="2">
              <div class="info-label">Natureza de Intervenção:</div>
            </v-col>
            <v-col>
              <v-select
                label="Selecione a Natureza de Intervenção"
                :items="natureza"
                v-model="ni"
                solo
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-btn color="red darken-4" dark text @click="limparAG">Limpar</v-btn>
            <v-btn color="green darken-4" dark text @click="adicionarAG">Adicionar</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro: Não foi possível adicionar Agregação</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      Agregação adicionada com sucesso
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  props: ["auto","index"],

  data: () => ({
    codigo: null,
    titulo: null,
    dataContagem: null,
    ni: "Dono",

    natureza: ["Dono", "Participante"],

    snackbar: false,
    erro: null,
    erroDialog: false,
    addAG: false,
  }),
  methods: {
    limparAG: function () {
      this.codigo = null
      this.titulo = null
      this.dataContagem = null,
      this.ni = "Dono"
    },
    adicionarAG: function () {
      const re = /\d{4}/;
      var currentTime = new Date();
      var result = this.auto.zonaControlo[this.index].agregacoes.filter(ag => ag.codigo == this.codigo)
      if(!this.codigo || !this.titulo || !this.dataContagem) {
        this.erro = " Verifique se os campos <strong>Código da Agregação," +
                    " Título da Agregação e Data de Contagem do PCA</strong> se encontram devidamente preenchidos.";
        this.erroDialog = true
      } else if(result.length>0) {
        this.erro =
          "O <strong>Código da Agregação</strong> que tentou inserir já existe. ";
        this.erroDialog = true;
      } else if(!re.test(this.dataContagem)) {
        this.erro =
          " Verifique se o campo <strong>" +
          "Data de Contagem do PCA</strong> se encontra devidamente preenchido.";
        this.erroDialog = true;
      } else {
        var res = parseInt(this.auto.zonaControlo[this.index].prazoConservacao) + parseInt(this.dataContagem)
        if(!(res<=currentTime.getFullYear())) {
          this.erro =
            "Note que a <strong>Prazo de Conservação Administrativa</strong> sumado com "+
            "<strong>Data de Contagem do PCA</strong> têm que ser <strong>inferior ou igual</strong> à data atual";
          this.erroDialog = true;
        } else {
          this.auto.zonaControlo[this.index].agregacoes.push({
            codigo: this.codigo,
            titulo: this.titulo,
            dataContagem: this.dataContagem,
            ni: this.ni
          })
          this.addAG = false
          this.snackbar = true
          this.limparAG()
        }
      }
    }
  }
};
</script>