<template>
  <v-card>
    <v-card-title class="expansion-panel-heading">Classe {{tipo.replace(/\_/g,"/")}}</v-card-title>
    <v-card-text class="mt-4">
      <v-row>
        <v-col :md="2">
          <div class="info-label">Classe</div>
        </v-col>
        <v-col>
          <v-autocomplete v-if="!this.zona"
            label="Selecione a classe"
            :items="classes"
            v-model="classe"
            @change="defClasse()"
            solo
            dense
          ></v-autocomplete>
           <v-text-field v-else :value="classe" solo dense readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :md="2" v-if="prazo.split(' ')[0]">
          <div class="info-label">Prazo de Conservação Administrativa</div>
        </v-col>
        <v-col v-if="prazo.split(' ')[0]">
          <v-text-field :value="prazo" solo dense readonly></v-text-field>
        </v-col>
        <v-col :md="2" v-if="df">
          <div class="info-label">Destino Final</div>
        </v-col>
        <v-col v-if="df">
          <v-text-field :value="df" solo dense readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="df=='Conservação' && tipo!='RADA_CLAV' && tipo!='RADA' && tipo!='PGD'">
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
            deletable-chips
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
          <div class="info-label">Medição de UI em Papel (m.l.)</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 11,50"
            label="Insira a medição de UI"
            v-model="uiPapel"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Medição de UI Digital (GB)</div>
        </v-col>
        <v-col>
          <v-text-field
            hint="Exemplo: 16,00"
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
            hint="Exemplo: 150,75"
            label="Insira a medição de UI"
            v-model="uiOutros"
            solo
            clearable
          >
            Insira um ano
          </v-text-field>
        </v-col>
      </v-row>
      <v-row style="margin:0px !important;">
        <v-checkbox dense v-if="notasPCA" v-model="validaNotaPCA">
          <template v-slot:label>
            <span  style="font-size: small">Confirmo que as agregações que pretendo eliminar cumprem a condição do PCA <b>"{{notasPCA}}"</b></span>
          </template>
        </v-checkbox>
      </v-row>
      <v-row style="margin:0px !important;">
        <v-checkbox dense v-if="notaDF" v-model="validaNotaDF">
          <template v-slot:label>
            <span style="font-size: small">Confirmo que as agregações que pretendo eliminar cumprem a condição do DF <b>"{{notaDF}}"</b></span>
          </template>
        </v-checkbox>
      </v-row>
      <v-row style="margin:0px !important;" v-for="(just,index) in justificaDF" :key="index" >
        <v-checkbox dense v-if="(tipo=='TS_LC' || tipo=='PGD_LC') && df=='CP'" v-model="validaJustificaDF">
          <template v-slot:label>
            <span style="font-size: small">Confirmo que as agregações que pretendo eliminar cumprem as condição de justificação do DF <b>"{{just}}"</b></span>
          </template>
        </v-checkbox>
      </v-row>
      <v-row justify="end">
        <v-btn class="mx-1" color="indigo darken-4" dark @click="closeZC">Voltar</v-btn>
        <v-btn
          v-if="!this.zona"
          class="mx-1" 
          color="indigo darken-4"
          dark
          @click="adicionarZC"
        >
          Adicionar
        </v-btn>
        <v-btn v-else class="mx-1" color="indigo darken-4" dark @click="editarZC">
          Guardar
        </v-btn>
        <v-btn class="mx-1" color="red darken-4" dark @click="limparZC">Limpar</v-btn>
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
    "donos",
    "tipo"
  ],
  data: () => ({
    classe: null,
    ni: "",
    dono: [],
    dataInicio: "",
    dataFim: "",
    uiPapel: "",
    uiDigital: "",
    uiOutros: "",

    df: "",
    notaDF: "",
    validaNotaDF: false,
    justificaDF: "",
    validaJustificaDF: false,
    prazo: "",
    notasPCA: "",
    validaNotaPCA: false,

    natureza: ["Dono", "Participante"],

    erro: null,
    erroDialog: false
  }),
  watch: {
    "index": function() {
      if (this.zona) {
        if(this.zona.codigo && this.zona.referencia) this.classe = this.zona.codigo + " " + this.zona.referencia + " - " + this.zona.titulo;
        else if(this.zona.codigo) this.classe = this.zona.codigo + " - " + this.zona.titulo;
        else if(this.zona.referencia) this.classe = this.zona.referencia + " - " + this.zona.titulo;
      
        if(this.zona.destino=="C") this.df = "Conservação"
        else if(this.zona.destino=="E") this.df = "Eliminação"
        else this.df = this.zona.destino
        this.prazo = this.zona.prazoConservacao;
        this.notasPCA = this.zona.notasPCA;
        this.ni = this.zona.ni;
        this.dono = this.zona.dono;
        this.notaDF = this.zona.notaDF;
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
      if(this.zona.codigo && this.zona.referencia) this.classe = this.zona.codigo + " " + this.zona.referencia + " - " + this.zona.titulo;
      else if(this.zona.codigo) this.classe = this.zona.codigo + " - " + this.zona.titulo;
      else if(this.zona.referencia) this.classe = this.zona.referencia + " - " + this.zona.titulo;

      if(this.zona.destino=="C") this.df = "Conservação"
      else if(this.zona.destino=="E") this.df = "Eliminação"
      else this.df = this.zona.destino
      if(this.zona.prazoConservacao=="1") this.prazo = this.zona.prazoConservacao + " Ano"
      else this.prazo = this.zona.prazoConservacao + " Anos"
      this.notasPCA = this.zona.notasPCA;
      this.ni = this.zona.ni;
      this.dono = this.zona.dono;
      this.notaDF = this.zona.notaDF;
      this.dataInicio = this.zona.dataInicio;
      this.dataFim = this.zona.dataFim;
      this.uiPapel = this.zona.uiPapel;
      this.uiDigital = this.zona.uiDigital;
      this.uiOutros = this.zona.uiOutros;
    }
  },
  methods: {
    defClasse: async function() {
      var c = this.classesCompletas.filter(c => {
          if(c.codigo && c.referencia) return (c.codigo+" "+c.referencia == this.classe.split(" - ")[0])
          else if(c.codigo) return (c.codigo == this.classe.split(" - ")[0]) 
          else if(c.referencia) return (c.referencia == this.classe.split(" - ")[0]) 
        }
      );
      if (c[0]) {
        if(c[0].pca.valores=="1") this.prazo = (c[0].pca.valores || "") + " Ano";
        else this.prazo = (c[0].pca.valores || "") + " Anos";
        if(c[0].pca.notas) this.notasPCA = c[0].pca.notas
        if(c[0].df.nota) this.notaDF = c[0].df.nota
        if((this.tipo=="TS_LC" || this.tipo=="PGD_LC") && c[0].df.valor=="CP" && c[0].df.justificacao) this.justificaDF = c[0].df.justificacao.map(just => {return just.conteudo})
        if (c[0].df.valor === "C") {
          this.df = "Conservação";
          this.ni = "Participante";
        } else if (c[0].df.valor === "E") {
          this.df = "Eliminação";
          this.ni = null;
          this.dono = []
        } else this.df = c[0].df.valor;
      }
    },

    limparZC: function() {
      this.classe = null;
      this.ni = "Vazio";
      this.df = "";
      this.prazo = "";
      this.notasPCA = "";
      this.validaNotaPCA = false;
      this.dono = "";
      this.notaDF = "";
      this.validaNotaDF = false;
      this.justificaDF = "";
      this.validaJustificaDF = false;
      this.dataInicio = "";
      this.dataFim = "";
      this.uiPapel = "";
      this.uiDigital = "";
      this.uiOutros = "";
    },
    adicionarZC: async function() {
      const date = new Date()
      const re = /\d{4}/;
      const reUI = /^-?\d*(,\d\d?)?$/;
      var result = this.auto.zonaControlo.filter(
        zc => {
          if(zc.codigo && zc.referencia) return zc.codigo + " "+ zc.referencia + " - " + zc.titulo == this.classe
          else if(zc.codigo) return zc.codigo + " - " + zc.titulo == this.classe
          else if(zc.referencia) return zc.referencia + " - " + zc.titulo == this.classe
        }
      );
      var uiPapel = parseFloat(this.uiPapel.replace(',', '.')) || 0;
      var uiDigital = parseFloat(this.uiDigital.replace(',', '.')) || 0;
      var uiOutros = parseFloat(this.uiOutros.replace(',', '.')) || 0;
      var dataInicio = parseInt(this.dataInicio) || 0;
      var dataFim = parseInt(this.dataFim) || 0;
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
      } else if(dataInicio < date.getFullYear()-100) {
        this.erro = "Não é permitido eliminar documentação com mais de 100 anos, por favor verifique a Data de Início";
        this.erroDialog = true;
      } else if(this.notasPCA && !this.validaNotaPCA) {
        this.erro = "É necessária confirmação de cumprimento da nota do PCA <b>\""+this.notasPCA+"\"</b>"
        this.erroDialog = true;
      } else if(this.notaDF && !this.validaNotaDF) {
        this.erro = "É necessária confirmação de cumprimento da nota do DF <b>\""+this.notaDF+"\"</b>"
        this.erroDialog = true;
      } else if((this.tipo=="TS_LC" || this.tipo=="PGD_LC") && this.df=="CP" && !this.validaJustificaDF) {
        this.erro = ""
        for(var just of this.justificaDF)
          this.erro += "<p>É necessária confirmação de cumprimento da justificação do DF <b>\""+just+"\"</b></p>\n"
        this.erroDialog = true;
      } else if(dataInicio > date.getFullYear() - parseInt(this.prazo)) {
        this.erro = "A Data de inicio deve ser inferior à subtração do Prazo de conservação administrativa ao ano corrente."
        this.erroDialog = true;
      } else if(dataFim > date.getFullYear()) {
        this.erro = "A Data de Fim deve ser anterior à data atual";
        this.erroDialog = true;
      }
      else if (parseInt(this.dataInicio) > parseInt(this.dataFim)) {
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
      } else if(this.df == "Conservação" && this.dono.length==0 && this.tipo!="RADA_CLAV" && this.tipo!="RADA" && this.tipo!="PGD") {
        this.erro = help.AutoEliminacao.Erros.DonoPN;
        this.erroDialog = true;
      } else if(uiPapel+uiDigital+uiOutros<=0) {
        this.erro = help.AutoEliminacao.Erros.Medicoes;
        this.erroDialog = true;
      } else {
        var classe = this.classesCompletas.filter(c => {
            if(c.codigo && c.referencia) return (c.codigo+" "+c.referencia == this.classe.split(" - ")[0])
            else if(c.codigo) return (c.codigo == this.classe.split(" - ")[0]) 
            else if(c.referencia) return (c.referencia == this.classe.split(" - ")[0]) 
          }
        );
        var idClasse = classe[0].idClasse || ""
        var codigo = classe[0].codigo || "";
        var referencia = classe[0].referencia || ""
        var titulo = classe[0].titulo;
        var prazoConservacao = this.prazo.split(" ")[0] || "";
        var destino = this.df;
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
          var tituloZC = this.auto.zonaControlo[i].codigo + " " + this.auto.zonaControlo[i].referencia
          if(tituloZC > (codigo + " " +referencia)) {
            this.auto.zonaControlo.splice(i,0,{
              idClasse: idClasse,
              codigo: codigo,
              referencia: referencia,
              titulo: titulo,
              prazoConservacao: prazoConservacao,
              notasPCA: this.notasPCA || "",
              destino: destino,
              notaDF: this.notaDF || "",
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
              idClasse: idClasse,
              codigo: codigo,
              referencia: referencia,
              titulo: titulo,
              prazoConservacao: prazoConservacao,
              notasPCA: this.notasPCA || "",
              destino: destino,
              notaDF: this.notaDF || "",
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
      const date = new Date()
      var backup = this.auto.zonaControlo[this.index];
      this.auto.zonaControlo[this.index] = {};
      const re = /\d{4}/;
      const reUI = /^-?\d*(\.\d\d?)?$/;
      var result = this.auto.zonaControlo.filter(
        zc => {
          if(zc.codigo && zc.referencia) return zc.codigo + " "+ zc.referencia + " - " + zc.titulo == this.classe
          else if(zc.codigo) return zc.codigo + " - " + zc.titulo == this.classe
          else if(zc.referencia) return zc.referencia + " - " + zc.titulo == this.classe
        }
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
      } else if(parseInt(this.dataInicio) < date.getFullYear()-100) {
        this.erro = "Não é permitido eliminar documentação com mais de 100 anos, por favor verifique a Data de Início";
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if(this.notasPCA && !this.validaNotaPCA) {
        this.erro = "É necessária confirmação de cumprimento da nota do PCA <b>\""+this.notasPCA+"\"</b>"
        this.erroDialog = true;
      } else if(this.notaDF && !this.validaNotaDF) {
        this.erro = "É necessária confirmação de cumprimento da nota do DF <b>\""+this.notaDF+"\"</b>"
        this.erroDialog = true;
      } else if((this.tipo=="TS_LC" || this.tipo=="PGD_LC") && this.df=="CP" && !this.validaJustificaDF) {
        this.erro = ""
        for(var just of this.justificaDF)
          this.erro += "<p>É necessária confirmação de cumprimento da justificação do DF <b>\""+just+"\"</b></p>\n"
        this.erroDialog = true;
      } else if(parseInt(this.dataInicio) > date.getFullYear() - parseInt(this.prazo)) {
        this.erro = "A Data de inicio deve ser inferior à subtração do Prazo de conservação administrativa ao ano corrente."
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if(parseInt(this.dataFim) > date.getFullYear()) {
        this.erro = "A Data de Fim deve ser anterior à data atual";
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
      } else if(this.df == "Conservação" && this.dono.length==0 && this.tipo!="RADA_CLAV" && this.tipo!="RADA" && this.tipo!="PGD") {
        this.erro = help.AutoEliminacao.Erros.DonoPN;
        this.erroDialog = true;
        this.auto.zonaControlo[this.index] = backup;
      } else if(uiPapel+uiDigital+uiOutros<=0) {
        this.erro = help.AutoEliminacao.Erros.Medicoes;
        this.erroDialog = true;
      }  else {
        var classe = this.classesCompletas.filter(c => {
            if(c.codigo && c.referencia) return (c.codigo+" "+c.referencia == this.classe.split(" - ")[0])
            else if(c.codigo) return (c.codigo == this.classe.split(" - ")[0]) 
            else if(c.referencia) return (c.referencia == this.classe.split(" - ")[0]) 
          }
        );
        var idClasse = classe[0].idClasse || ""
        var codigo = classe[0].codigo || "";
        var referencia = classe[0].referencia || ""
        var titulo = classe[0].titulo;
        var prazoConservacao = this.prazo.split(" ")[0] || "";
        var destino = this.df;
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

        var newAgregacoes = backup.agregacoes.filter(ag=> (parseInt(ag.dataContagem) + parseInt(prazoConservacao) + 1)<= date.getFullYear()).map(ag => {
          if((destino=="C" || destino=="Conservação") && ag.ni == "Dono")
            return {
              codigo: ag.codigo,
              titulo: ag.titulo,
              dataContagem: ag.dataContagem,
              ni: "Participante"
            }
          else return ag;
        })

        this.auto.zonaControlo[this.index] = {
          idClasse: idClasse,
          codigo: codigo,
          referencia: referencia,
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
          agregacoes: newAgregacoes
        };

        this.closeZC();
      }
    }
  }
};
</script>
