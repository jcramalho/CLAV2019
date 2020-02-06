<template>
  <v-card flat class="mb-12">
    <v-form ref="form" :lazy-validation="false">
      <v-row v-if="!RE.tipologiasProd[0]">
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Entidades Produtoras</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-autocomplete
            deletable-chips
            :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
            v-model="RE.entidadesProd"
            :items="entidadesProcessadas"
            placeholder="Selecione as Entidades Produtoras."
            chips
            multiple
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row v-if="!RE.entidadesProd[0]">
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Tipologias das Entidades Produtoras</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-autocomplete
            deletable-chips
            :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
            v-model="RE.tipologiasProd"
            :items="tipologias"
            chips
            placeholder="Selecione as Tipologias das Entidades Produtoras."
            multiple
          ></v-autocomplete>
        </v-col>
      </v-row>
      <hr style="border: 2px solid indigo; border-radius: 1px;" />
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Data Inicial da Documentação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            :return-value.sync="RE.dataInicial"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :rules="basicRule"
                v-model="RE.dataInicial"
                label="Data Inicial"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="RE.dataInicial" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu1.save(RE.dataInicial)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Data Final da Documentação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :return-value.sync="RE.dataFinal"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :rules="basicRule"
                v-model="RE.dataFinal"
                label="Data Final"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="RE.dataFinal" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu2.save(RE.dataFinal)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de Unidades de Instalação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-text-field
            v-model="RE.dimSuporte.nUI"
            placeholder="Nº de Unidades de Instalação."
            :rules="[v => !isNaN(parseInt(v)) && parseInt(v) >= 0 || 'Campo Obrigatório! Valor tem que ser inteiro.']"
            single-line
            type="number"
          />
        </v-col>
      </v-row>
      <v-expansion-panels v-model="panels" accordion :multiple="isMultiple">
        <v-expansion-panel popout focusable>
          <v-expansion-panel-header class="expansion-panel-heading">
            <b>Contexto</b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">História Administrativa/Biográfica</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-text-field
                  placeholder="História Administrativa/Biográfica"
                  v-model="RE.hist_admin"
                  solo
                  clearable
                  :rules="basicRule"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">História Custodial</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-text-field
                  :rules="basicRule"
                  placeholder="História Custodial"
                  v-model="RE.hist_cust"
                  solo
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel popout focusable>
          <v-expansion-panel-header class="expansion-panel-heading">
            <b>Conteúdo e Estrutura</b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Sistema de Organização</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-text-field
                  :rules="basicRule"
                  placeholder="Sistema de Organização"
                  v-model="RE.sist_org"
                  solo
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel popout focusable>
          <v-expansion-panel-header class="expansion-panel-heading">
            <b>Condições de Acesso e Utilização</b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Localização</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-text-field
                  :rules="basicRule"
                  placeholder="Localização"
                  v-model="RE.localizacao"
                  solo
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Estado de Conservação</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-text-field
                  :rules="basicRule"
                  placeholder="Estado de Conservação"
                  v-model="RE.est_conser"
                  solo
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <br />
    <v-btn dark color="indigo darken-1" @click="next">Continuar</v-btn>
    <v-btn @click="$emit('seguinte', 1)">Voltar</v-btn>
    <v-btn color="indigo darken-4" text @click="apagar">
      <v-icon>delete_sweep</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  props: ["RE", "entidades", "tipologias"],
  computed: {
    entidadesProcessadas() {
      return this.entidades.map(item => {
        return item.sigla + " - " + item.designacao;
      });
    }
  },
  data: () => ({
    panels: [0, 0, 0],
    menu1: false,
    menu2: false,
    isMultiple: false,
    basicRule: [v => !!v || "Campo de preenchimento obrigatório!"]
  }),
  methods: {
    apagar: function() {
      this.$refs.form.reset();
      this.isMultiple = false;
      this.panels = [0, 0, 0];
    },
    next: function() {
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(() => {
        if (this.$refs.form.validate()) {
          this.$emit("seguinte", 3);
        }
      }, 1);
    }
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
