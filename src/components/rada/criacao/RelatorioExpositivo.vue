<template>
  <v-card flat class="mb-12">
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Entidades Produtoras:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-autocomplete
          v-model="entSel"
          :items="entidades"
          outlined
          dense
          placeholder="Selecione as Entidades Produtoras."
          chips
          multiple
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Tipologias das Entidades Produtoras:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-autocomplete
          v-model="tipoSel"
          :items="tipologias"
          outlined
          chips
          placeholder="Selecione as Tipologias das Entidades Produtoras."
          multiple
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Data Inicial da Documentação:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :return-value.sync="dataInicial"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dataInicial"
              label="Data Inicial"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dataInicial" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu1.save(dataInicial)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Data Final da Documentação:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :return-value.sync="dataFinal"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dataFinal"
              label="Data Final"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dataFinal" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu2.save(dataFinal)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Número de Unidades de Instalação:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          :rules="rules"
          v-model="numberValue"
          single-line
          type="number"
        />
      </v-col>
    </v-row>
    <hr />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">História Administrativa/Biográfica:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          placeholder="História Administrativa/Biográfica"
          v-model="hist_admin"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">História Custodial:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          placeholder="História Custodial"
          v-model="hist_cust"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <hr />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Sistema de Organização:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          placeholder="Sistema de Organização"
          v-model="sist_org"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <hr />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Localização:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          placeholder="Localização"
          v-model="localizacao"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Estado de Conservação:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          placeholder="Estado de Conservação"
          v-model="est_conser"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn :disabled="allDone()" color="indigo darken-1" @click="sendToFather()"
      >Continuar</v-btn
    >
    <v-btn @click="$emit('voltar', 1)">Voltar</v-btn>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    dataInicial: "",
    dataFinal: "",
    menu1: false,
    menu2: false,
    entidades: [],
    entSel: [],
    tipologias: [],
    tipoSel: [],
    numberValue: 0,
    rules: [v => v > 0 || "Tem que ser um número inteiro."],
    hist_admin: "",
    hist_cust: "",
    sist_org: "",
    localizacao: "",
    est_conser: ""
  }),
  methods: {
    allDone: function() {
      return !(
        this.entSel[0] &&
        this.dataInicial &&
        this.dataFinal &&
        this.tipoSel[0] &&
        this.hist_admin &&
        this.hist_cust &&
        this.sist_org &&
        this.localizacao &&
        this.est_conser
      );
    },
    sendToFather: function() {
      var relatorioExpositivo = {
        entidadesProd: this.entSel,
        tipologiasProd: this.tipoSel,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal,
        nUI: this.numberValue,
        hist_admin: this.hist_admin,
        hist_cust: this.hist_cust,
        sist_org: this.sist_org,
        localizacao: this.localizacao,
        est_conser: this.est_conser
      };
      this.$emit("relatorioExpositivo", relatorioExpositivo);
    }
  },
  created: async function() {
    let response = await this.$request("get", "/api/entidades");
    this.entidades = response.data.map(item => {
      return item.sigla + " - " + item.designacao;
    });

    response = await this.$request("get", "/api/tipologias");
    this.tipologias = response.data.map(item => {
      return item.sigla + " - " + item.designacao;
    });
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}

.adicao tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.adicao td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.adicao td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
