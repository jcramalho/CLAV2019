<template>
  <v-card>
    <v-card-title class="expansion-panel-heading">Classe</v-card-title>
    <v-card-text class="mt-4">
      <v-row>
        <v-col :md="2">
          <div class="info-label">Classe</div>
        </v-col>
        <v-col>
          <v-autocomplete
            label="Selecione a classe"
            :items="classes"
            v-model="classe"
            @change="defClasse()"
            solo
            dense
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row v-if="prazo && df">
        <v-col :md="2">
          <div class="info-label">Prazo de Conservação Administrativa</div>
        </v-col>
        <v-col>
          <v-text-field :value="prazo" solo dense readonly></v-text-field>
        </v-col>
        <v-col :md="2">
          <div class="info-label">Destino Final</div>
        </v-col>
        <v-col>
          <v-text-field :value="df" solo dense readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="df== 'Conservação'">
        <v-col>
          <div class="info-label">Natureza de Intervenção</div>
        </v-col>
        <v-col>
          <v-text-field
            :value="ni"
            solo
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Donos do PN</div>
        </v-col>
        <v-col>
          <v-autocomplete
            label="Selecione a entidade dona do processo"
            :items="donos"
            v-model="dono"
            solo
            dense
            chips
            multiple
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="info-label">Data de Início</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 1995"
            label="Insira o ano de início"
            v-model="dataInicio"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Data de Fim</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 1995"
            label="Insira o ano de fim"
            v-model="dataFim"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="info-label">Medição de UI em Papel</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 11.50"
            label="Insira a medição de UI"
            v-model="uiPapel"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Medição de UI Digital</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 16.00"
            label="Insira a medição de UI"
            v-model="uiDigital"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Medição de UI noutro Suporte</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 150.75"
            label="Insira a medição de UI"
            v-model="uiOutros"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn
          color="red darken-4"
          v-if="!this.zona"
          dark
          text
          @click="limparZC"
          >Limpar</v-btn
        >
        <v-btn color="red darken-4" v-else dark text @click="closeZC"
          >Fechar</v-btn
        >
        <v-btn
          v-if="!this.zona"
          color="green darken-4"
          dark
          text
          @click="adicionarZC"
        >
          Adicionar
        </v-btn>
        <v-btn v-else color="green darken-4" dark text @click="editarZC">
          Guardar
        </v-btn>
      </v-row>
    </v-card-text>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Erro: Não foi possível adicionar a Classe
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro">
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
const help = require("@/config/help").help;

export default {
  props: [
    "classes",
    "entidades",
    "auto",
    "closeZC",
    "zona",
    "index",
    "classesCompletas",
    "donos"
  ],
  data: () => ({
    classe: null,
    ni: null,
    dono: [],
    dataInicio: null,
    dataFim: null,
    uiPapel: null,
    uiDigital: null,
    uiOutros: null,

    df: null,
    prazo: null,

    natureza: ["Dono", "Participante"],

    erro: null,
    erroDialog: false
  }),
  watch: {
    index: function() {
      if (this.zona) {
        this.classe = this.zona.codigo + " - " + this.zona.titulo;
        if (this.zona.destino == "C") this.df = "Conservação";
        else this.df = "Eliminação";
        this.prazo = this.zona.prazoConservacao;
        this.ni = this.zona.ni;
        this.dono = this.zona.dono;
        this.dataInicio = this.zona.dataInicio;
        this.dataFim = this.zona.dataFim;
        this.uiPapel = this.zona.uiPapel;
        this.uiDigital = this.zona.uiDigital;
        this.uiOutros = this.zona.uiOutros;
      }
    }
  },
  created: async function() {
    if (this.zona) {
      this.classe = this.zona.codigo + " - " + this.zona.titulo;
      if (this.zona.destino == "C") this.df = "Conservação";
      else this.df = "Eliminação";
      this.prazo = this.zona.prazoConservacao + " Anos";
      this.ni = this.zona.ni;
      this.dono = this.zona.dono;
      this.dataInicio = this.zona.dataInicio;
      this.dataFim = this.zona.dataFim;
      this.uiPapel = this.zona.uiPapel;
      this.uiDigital = this.zona.uiDigital;
      this.uiOutros = this.zona.uiOutros;
    }
  },
  methods: {
    defClasse: async function() {
      var c = this.classesCompletas.filter(
        c => c.codigo == this.classe.split(" - ")[0]
      );
      if (c[0]) {
        if(c[0].pca.valores=="1") this.prazo = c[0].pca.valores + " Ano";
        else this.prazo = c[0].pca.valores + " Anos";
        if (c[0].df.valor === "C") {
          this.df = "Conservação";
          this.ni = "Participante";
        } else if (c[0].df.valor === "E") {
          this.df = "Eliminação";
          this.ni = null;
          this.dono = [];
        } else this.df = c[0].df.valor;
      }
    },
    limparZC: function() {
      this.classe = null;
      this.ni = "Vazio";
      this.df = null;
      this.prazo = null;
      this.dono = null;
      this.dataInicio = null;
      this.dataFim = null;
      this.uiPapel = null;
      this.uiDigital = null;
      this.uiOutros = null;
    },
    adicionarZC: async function() {
      const re = /\d{4}/;
      const reUI = /^-?\d*(\.\d\d?)?$/;
      var result = this.auto.zonaControlo.filter(
        zc => zc.codigo + " - " + zc.titulo == this.classe
      );
      var uiPapel = parseFloat(this.uiPapel) || 0;
      var uiDigital = parseFloat(this.uiDigital) || 0;
      var uiOutros = parseFloat(this.uiOutros) || 0;
      if (!this.classe || !this.dataInicio || !this.dataFim) {
        this.erro = help.AutoEliminacao.Erros.FaltaCampos;
        this.erroDialog = true;
      } else if (result.length > 0) {
        this.erro = help.AutoEliminacao.Erros.CodigoClasse;
        this.erroDialog = true;
      } else if (
        !re.test(this.dataInicio) ||
        !re.test(this.dataFim) ||
        this.dataInicio.length != 4 ||
        this.dataFim.length != 4
      ) {
        this.erro = help.AutoEliminacao.Erros.DatasExtremas;
        this.erroDialog = true;
      } else if (parseInt(this.dataInicio) > parseInt(this.dataFim)) {
        this.erro = help.AutoEliminacao.Erros.DataInicio;
        this.erroDialog = true;
      } else if (this.uiPapel && !reUI.test(this.uiPapel)) {
        this.erro = help.AutoEliminacao.Erros.MedicaoPapel;
        this.erroDialog = true;
      } else if (this.uiDigital && !reUI.test(this.uiDigital)) {
        this.erro = help.AutoEliminacao.Erros.MedicaoDigital;
        this.erroDialog = true;
      } else if (this.uiOutros && !reUI.test(this.uiOutros)) {
        this.erro = help.AutoEliminacao.Erros.MedicaoOutro;
        this.erroDialog = true;
      } else if (this.df == "Conservação" && this.dono.length == 0) {
        this.erro = help.AutoEliminacao.Erros.DonoPN;
        this.erroDialog = true;
      } else if (uiPapel + uiDigital + uiOutros <= 0) {
        this.erro = help.AutoEliminacao.Erros.Medicoes;
        this.erroDialog = true;
      } else {
        var codigo = this.classe.split(" - ")[0];
        var classe = await this.$request("get", "/classes/c" + codigo);
        var titulo = classe.data.titulo;
        var prazoConservacao = classe.data.pca.valores;
        var destino = classe.data.df.valor;
        var dataInicio = this.dataInicio;
        var dataFim = this.dataFim;
        var ni = this.ni;
        var dono = this.dono;

        if (!this.uiPapel || this.uiPapel == "0") uiPapel = "";
        else uiPapel = this.uiPapel;
        if (!this.uiDigital || this.uiDigital == "0") uiDigital = "";
        else uiDigital = this.uiDigital;
        if (!this.uiOutros || this.uiOutros == "0") uiOutros = "";
        else uiOutros = this.uiOutros;
        
        var added = false;

        for(var i in this.auto.zonaControlo) {
          if(this.auto.zonaControlo[i].codigo > codigo) {
            this.auto.zonaControlo.splice(i,0,{
              codigo: codigo,
              titulo: titulo,
              prazoConservacao: prazoConservacao,
              destino: destino,
              ni: ni,
              dono: dono,
              dataInicio: dataInicio,
              dataFim: dataFim,
              uiPapel: uiPapel,
              uiDigital: uiDigital,
              uiOutros: uiOutros,
              agregacoes: []
            })
            added = true;
            break;
          }
        }
        if(added == false) this.auto.zonaControlo.push({
              codigo: codigo,
              titulo: titulo,
              prazoConservacao: prazoConservacao,
              destino: destino,
              ni: ni,
              dono: dono,
              dataInicio: dataInicio,
              dataFim: dataFim,
              uiPapel: uiPapel,
              uiDigital: uiDigital,
              uiOutros: uiOutros,
              agregacoes: []
            })
        
        this.limparZC();
        this.closeZC();
      }
    },
    editarZC: async function() {
      var backup = this.auto.zonaControlo[this.index];
      this.auto.zonaControlo[this.index] = {};
      const re = /\d{4}/;
      const reUI = /^-?\d*(\.\d\d?)?$/;
      var result = this.auto.zonaControlo.filter(
        zc => zc.codigo + " - " + zc.titulo == this.classe
      );
      var uiPapel = parseInt(this.uiPapel) || 0;
      var uiDigital = parseInt(this.uiDigital) || 0;
      var uiOutros = parseInt(this.uiOutros) || 0;
      if (!this.classe || !this.dataInicio || !this.dataFim) {
        this.erro = help.AutoEliminacao.Erros.FaltaCampos;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (result.length > 0) {
        this.erro = help.AutoEliminacao.Erros.CodigoClasse;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (
        !re.test(this.dataInicio) ||
        !re.test(this.dataFim) ||
        this.dataInicio.length != 4 ||
        this.dataFim.length != 4
      ) {
        this.erro = help.AutoEliminacao.Erros.DatasExtremas;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (parseInt(this.dataInicio) > parseInt(this.dataFim)) {
        this.erro = help.AutoEliminacao.Erros.DataInicio;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (this.uiPapel && !reUI.test(this.uiPapel)) {
        this.erro = help.AutoEliminacao.Erros.MedicaoPapel;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (this.uiDigital && !reUI.test(this.uiDigital)) {
        this.erro = help.AutoEliminacao.Erros.MedicaoDigital;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (this.uiOutros && !reUI.test(this.uiOutros)) {
        this.erro = help.AutoEliminacao.Erros.MedicaoOutro;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (this.df == "Conservação" && this.dono.length == 0) {
        this.erro = help.AutoEliminacao.Erros.DonoPN;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if (uiPapel + uiDigital + uiOutros <= 0) {
        this.erro = help.AutoEliminacao.Erros.Medicoes;
        this.erroDialog = true;
      } else {
        var codigo = this.classe.split(" - ")[0];
        var classe = await this.$request("get", "/classes/c" + codigo);
        var titulo = classe.data.titulo;
        var prazoConservacao = classe.data.pca.valores;
        var destino = classe.data.df.valor;
        var dataInicio = this.dataInicio;
        var dataFim = this.dataFim;
        var ni = this.ni;
        var dono = this.dono;

        if (!this.uiPapel || this.uiPapel == "0") uiPapel = "";
        else uiPapel = this.uiPapel;
        if (!this.uiDigital || this.uiDigital == "0") uiDigital = "";
        else uiDigital = this.uiDigital;
        if (!this.uiOutros || this.uiOutros == "0") uiOutros = "";
        else uiOutros = this.uiOutros;

        this.auto.zonaControlo[this.index] = {
          codigo: codigo,
          titulo: titulo,
          prazoConservacao: prazoConservacao,
          destino: destino,
          ni: ni,
          dono: dono,
          dataInicio: dataInicio,
          dataFim: dataFim,
          uiPapel: uiPapel,
          uiDigital: uiDigital,
          uiOutros: uiOutros,
          agregacoes: backup.agregacoes
        };

        this.closeZC();
      }
    }
  }
};
</script>
