<template>
  <v-card>
    <v-card-title class="mt-2 expansion-panel-heading"
      >Adicionar Agregação</v-card-title
    >

        <v-card-text class="mt-2">
          <v-row>
            <v-col :md="2">
              <div class="info-label">Código da Agregação</div>
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
            <v-col>
              <div class="info-label">Titulo da Agregação</div>
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
              <div class="info-label">Data de início de contagem do PCA</div>
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
            <v-col>
              <div class="info-label">Natureza de intervenção</div>
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
            <v-btn v-if="!this.agregacao" color="green darken-4" dark text @click="adicionarAG">Adicionar</v-btn>
            <v-btn v-else color="green darken-4" dark text @click="editarAG">Editar</v-btn>
          </v-row>
        </v-card-text>
        <v-dialog v-model="erroDialog" width="700" persistent>
          <v-card outlined>
            <v-card-title
              class="red darken-4 title white--text"
              dark
            >Erro: Não foi possível adicionar Agregação</v-card-title>

        <v-card-text>
          <span
            class="subtitle-1"
            style="white-space: pre-wrap"
            v-html="erro"
          ></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
const help = require("@/config/help").help;

export default {
  props: ["auto", "index", "agregacao", "indexAg", "closeAg"],

  data: () => ({
    codigo: null,
    titulo: null,
    dataContagem: null,
    ni: "Dono",

    natureza: ["Dono", "Participante"],

    erro: null,
    erroDialog: false
  }),
  created: function() {
    if (this.agregacao) {
      this.codigo = this.agregacao.codigo;
      this.titulo = this.agregacao.titulo;
      this.dataContagem = this.agregacao.dataContagem;
      this.ni = this.agregacao.ni;
    }
  },
  methods: {
    limparAG: function() {
      this.codigo = null;
      this.titulo = null;
      this.dataContagem = null;
      this.ni = "Dono";
    },
    adicionarAG: function() {
      const re = /\d{4}/;
      var currentTime = new Date();
      var result = this.auto.zonaControlo[this.index].agregacoes.filter(
        ag => ag.codigo == this.codigo
      );
      if (!this.codigo || !this.titulo || !this.dataContagem) {
        this.erro = help.AutoEliminacao.Erros.FaltaCamposAg;
        this.erroDialog = true;
      } else if (result.length > 0) {
        this.erro = help.AutoEliminacao.Erros.CodigoAg;
        this.erroDialog = true;
      } else if (!re.test(this.dataContagem)) {
        this.erro = help.AutoEliminacao.Erros.DataContagemP;
        this.erroDialog = true;
      } else {
        var res =
          parseInt(this.auto.zonaControlo[this.index].prazoConservacao) +
          parseInt(this.dataContagem);
        //var res2 = parseInt(this.dataContagem) - parseInt(this.auto.zonaControlo[this.index].dataFim)
        var res2 = parseInt(this.dataContagem) - parseInt(this.auto.zonaControlo[this.index].dataInicio)
        if(this.auto.zonaControlo[this.index].prazoConservacao && res>=currentTime.getFullYear()) {
          this.erro = help.AutoEliminacao.Erros.DataContagem;
          this.erroDialog = true;
        } else if (res2 < 0) {
          this.erro = help.AutoEliminacao.Erros.DataContagem;
          this.erroDialog = true;
        } else {
          this.auto.zonaControlo[this.index].agregacoes.push({
            codigo: this.codigo,
            titulo: this.titulo,
            dataContagem: this.dataContagem,
            ni: this.ni
          });
          this.closeAg();
          this.limparAG();
        }
      }
    },
    editarAG: function() {
      var backup = this.auto.zonaControlo[this.index].agregacoes[this.indexAg];
      this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = {};
      const re = /\d{4}/;
      var currentTime = new Date();
      var result = this.auto.zonaControlo[this.index].agregacoes.filter(
        ag => ag.codigo == this.codigo
      );
      if (!this.codigo || !this.titulo || !this.dataContagem) {
        this.erro = help.AutoEliminacao.Erros.FaltaCamposAg;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = backup;
      } else if (result.length > 0) {
        this.erro = help.AutoEliminacao.Erros.CodigoAg;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = backup;
      } else if (!re.test(this.dataContagem)) {
        this.erro = help.AutoEliminacao.Erros.DataContagemP;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = backup;
      } else {
        var res =
          parseInt(this.auto.zonaControlo[this.index].prazoConservacao) +
          parseInt(this.dataContagem);
        //var res2 = parseInt(this.dataContagem) - parseInt(this.auto.zonaControlo[this.index].dataFim)
        var res2 = parseInt(this.dataContagem) - parseInt(this.auto.zonaControlo[this.index].dataInicio)
        if(this.auto.zonaControlo[this.index].prazoConservacao && !(res<=currentTime.getFullYear())) {
          this.erro = help.AutoEliminacao.Erros.DataContagem;
          this.erroDialog = true;
          this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = backup;
        } else if (res2 < 0) {
          this.erro = help.AutoEliminacao.Erros.DataContagem;
          this.erroDialog = true;
          this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = backup;
        } else {
          this.auto.zonaControlo[this.index].agregacoes[this.indexAg] = {
            codigo: this.codigo,
            titulo: this.titulo,
            dataContagem: this.dataContagem,
            ni: this.ni
          };
          this.auto.zonaControlo[this.index].agregacoes.push({});
          this.auto.zonaControlo[this.index].agregacoes.pop();
          this.closeAg();
        }
      }
    }
  }
};
</script>
