<template>
  <div>
    <v-row justify="end" class="mx-2">
      <v-btn @click="addZC=true" style="color: #1a237e; background-color: #dee2f8;">Adicionar Zona de Controlo</v-btn>
    </v-row>
    <v-dialog v-model="addZC">
      <v-card>
        <v-card-title class="expansion-panel-heading">Adicionar Zona de Controlo</v-card-title>

        <v-card-text class="mt-4">

      <v-row>
        <v-col :md="2">
          <div class="info-label">Código da Classe:</div>
        </v-col>
        <v-col>
          <v-autocomplete label="Selecione a classe" :items="classes" v-model="classe" solo dense></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
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
        <v-col>
          <div class="info-label">Dono PN:</div>
        </v-col>
        <v-col>
          <v-autocomplete
            label="Selecione a entidade dona do processo"
            :items="entidades"
            v-model="dono"
            solo
            dense
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="info-label">Data de Início:</div>
        </v-col>
        <v-col>
          <v-text-field hint="Exemplo: 1995" label="Insira o ano de início" v-model="dataInicio" solo clearable>Insira um ano</v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Data de Fim:</div>
        </v-col>
        <v-col>
          <v-text-field hint="Exemplo: 1995" label="Insira o ano de fim" v-model="dataFim" solo clearable>Insira um ano</v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="info-label">Medição de UI em Papel:</div>
        </v-col>
        <v-col>
          <v-text-field hint="Exemplo: 11.50" label="Insira a medição de UI" v-model="uiPapel" solo clearable>Insira um ano</v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Medição de UI Digital:</div>
        </v-col>
        <v-col>
          <v-text-field hint="Exemplo: 16.00" label="Insira a medição de UI" v-model="uiDigital" solo clearable>Insira um ano</v-text-field>
        </v-col>
        <v-col>
          <div class="info-label">Medição de UI noutro Suporte:</div>
        </v-col>
        <v-col>
          <v-text-field hint="Exemplo: 150.75" label="Insira a medição de UI" v-model="uiOutros" solo clearable>Insira um ano</v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn color="red darken-4" dark text @click="limparZC">Limpar</v-btn>
        <v-btn color="green darken-4" dark text @click="adicionarZC">Adicionar</v-btn>
      </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro: Não foi possível adicionar a Zona de Controlo</v-card-title>

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
      Zona de Controlo adicionada com sucesso
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
  props: ["classes", "entidades", "auto"],

  data: () => ({
    classe: null,
    ni: "Vazio",
    dono: null,
    dataInicio: null,
    dataFim: null,
    uiPapel: null,
    uiDigital: null,
    uiOutros: null,

    natureza: ["Vazio", "Dono", "Paticipante"],

    snackbar: false,
    erro: null,
    erroDialog: false,
    addZC: false,
  }),
  methods: {
    limparZC: function() {
      this.classe = null;
      this.ni = "Vazio";
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
      var result = this.auto.zonaControlo.filter(zc => zc.codigo == this.classe)
      if (!this.classe || !this.dataInicio || !this.dataFim) {
        this.erro =
          " Verifique se os campos <strong>Código da Classe," +
          " Data de Início e Data de Fim</strong> se encontram devidamente preenchidos.";
        this.erroDialog = true;
      } else if(result.length>0) {
        this.erro =
          "O <strong>Código da Agregação</strong> que tentou inserir já existe. ";
        this.erroDialog = true;
      } else if (!re.test(this.dataInicio) || !re.test(this.dataFim)) {
        this.erro =
          " Verifique se os campos <strong>" +
          " Data de Início e Data de Fim</strong> se encontram devidamente preenchidos.";
        this.erroDialog = true;
      } else if(parseInt(this.dataInicio) > parseInt(this.dataFim)) {
        this.erro =
          " O campo <strong>Data de Início</strong> têm de ser <strong>menor"+
          " ou igual</strong> ao campo <strong>Data de Fim</strong>.";
        this.erroDialog = true;
      } else {
        var codigo = this.classe.split(" - ")[0];
        var classe = await this.$request("get", "/api/classes/c" + codigo);
        var titulo = classe.data.titulo;
        var prazoConservacao = classe.data.pca.valores;
        var destino = classe.data.df.valor;
        var dataInicio = this.dataInicio;
        var dataFim = this.dataFim;
        var ni = "";
        var dono = "";
        var uiPapel;
        var uiDigital;
        var uiOutros;
        if (!this.ni == "Vazio") ni = this.ni;
        if (this.dono) dono = this.dono.split(" - ")[1];
        if (!this.uiPapel || this.uiPapel == "0") uiPapel = "";
        else if (!reUI.test(this.uiPapel)) {
          this.erro =
            " Verifique se o campo <strong>" +
            "Medição de UI em Papel</strong> se encontra devidamente preenchido.";
          this.erroDialog = true;
        } else uiPapel = this.uiPapel;
        if (!this.uiDigital || this.uiDigital == "0") uiDigital = "";
        else if (!reUI.test(this.uiDigital)) {
          this.erro =
            " Verifique se o campo <strong>" +
            "Medição de UI Digital</strong> se encontra devidamente preenchido.";
          this.erroDialog = true;
        } else uiDigital = this.uiDigital;
        if (!this.uiOutros || this.uiOutros == "0") uiOutros = "";
        else if (!reUI.test(this.uiOutros)) {
          this.erro =
            " Verifique se o campo <strong>" +
            "Medição de UI noutro Suporte</strong> se encontra devidamente preenchido.";
          this.erroDialog = true;
        } else uiOutros = this.uiOutros;

        this.auto.zonaControlo.push({
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
        });

        this.limparZC();
        this.snackbar = true;
        this.addZC = false;
      }
    }
  }
};
</script>