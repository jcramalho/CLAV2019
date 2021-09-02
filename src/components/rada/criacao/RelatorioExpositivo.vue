<template>
  <v-card flat class="mb-12" style="background-color:#fafafa">
    <v-form ref="form" :lazy-validation="false">
      <v-row v-if="!this.classes.some(e => e.tipo == 'Série' || e.tipo == 'Subsérie')">
        <v-col cols="12" class="text-right">
          <v-btn color="indigo lighten-2" dark class="ma-2" @click="importar_re = true">
            <v-icon dark left>add</v-icon>Importar Relatório Expositivo
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="RE.tipologiasProd == null">
        <NovaEntidade
          :entidades="entidades"
          :produtoras="RE.entidadesProd"
          :tipologias="tipologias"
          :entidadesProcessadas="entidadesProcessadas"
        />
        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Entidade produtora</div>
          </v-col>
          <v-col xs="12" sm="9">
            <v-autocomplete
              :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
              v-model="RE.entidadesProd"
              :items="entidadesProcessadas"
              item-text="entidade"
              item-value="entidade"
              placeholder="Selecione uma ou mais entidades."
              multiple
              solo
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    <strong>Entidade</strong> em questão não existe!
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :close="produtoraEntidadeClasse(data.item, data.item.entidade)"
                  @click:close="removeEnt(data.item)"
                >{{ data.item.entidade }}</v-chip>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </div>
      <v-row v-if="!RE.entidadesProd[0]">
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Tipologia de entidade</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-autocomplete
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="RE.tipologiasProd"
            :items="tipologias"
            item-text="tipologia"
            item-value="tipologia"
            placeholder="Selecione a Tipologia de entidade"
            solo
            :disabled="produtoraTipologiaClasse(RE.tipologiasProd)"
            chips
            deletable-chips
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  <strong>Tipologia</strong> em questão não existe!
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Data inicial da documentação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <SelecionarData
            :d="RE.dataInicial"
            label="Data inicial"
            @dataSelecionada="RE.dataInicial = $event"
            data-minima="1200-01-01"
          >
            <template v-slot:default="slotProps">
              <v-text-field
                :disabled="bloquearData()"
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="slotProps.item.dataValor"
                :label="slotProps.item.label"
                prepend-icon="event"
                readonly
                v-on="slotProps.item.on"
                solo
              ></v-text-field>
            </template>
          </SelecionarData>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Data final da documentação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <SelecionarData
            :d="RE.dataFinal"
            label="Data final"
            @dataSelecionada="RE.dataFinal = $event"
            data-minima="1200-01-01"
          >
            <template v-slot:default="slotProps">
              <v-text-field
                :disabled="bloquearData()"
                :rules="[v => data_final_valida(v) || 'Campo de preenchimento obrigatório!']"
                v-model="slotProps.item.dataValor"
                :label="slotProps.item.label"
                prepend-icon="event"
                readonly
                v-on="slotProps.item.on"
                solo
              ></v-text-field>
            </template>
          </SelecionarData>
        </v-col>
      </v-row>
      <v-expansion-panels v-model="panels" accordion :multiple="isMultiple">
        <v-expansion-panel class="ma-1" popout focusable>
          <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
            <b>Contexto</b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">História administrativa/biográfica</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-textarea
                  solo
                  name="input-7-4"
                  v-model="RE.hist_admin"
                  placeholder="História administrativa/biográfica"
                  :rules="basicRule"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">História custodial</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-textarea
                  solo
                  name="input-7-4"
                  v-model="RE.hist_cust"
                  placeholder="História custodial"
                  :rules="basicRule"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel class="ma-1" popout focusable>
          <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
            <b>Conteúdo e Estrutura</b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Sistema de organização</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-textarea
                  solo
                  name="input-7-4"
                  v-model="RE.sist_org"
                  placeholder="Sistema de organização"
                  :rules="basicRule"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel class="ma-1" popout focusable>
          <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
            <b>Condições de Acesso e Utilização</b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Localização</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-textarea
                  solo
                  name="input-7-4"
                  v-model="RE.localizacao"
                  placeholder="Localização"
                  :rules="basicRule"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Estado de conservação</div>
              </v-col>
              <v-col xs="12" sm="9">
                <v-textarea
                  solo
                  name="input-7-4"
                  v-model="RE.est_conser"
                  placeholder="Estado de conservação"
                  :rules="basicRule"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <ImportarRE
        :dialog="importar_re"
        @fecharDialog="importar_re = false"
        :entidades="entidades"
        :tipologias="tipologias"
        :RE="RE"
      />
    </v-form>
    <br />
    <v-btn color="indigo darken-4" dark @click="$emit('seguinte', 1)">Voltar</v-btn>
    <v-btn style="margin-left: 10px" color="indigo darken-4" dark @click="$emit('guardar', 'sim')">
      Guardar Trabalho
      <v-icon right>save</v-icon>
    </v-btn>
    <v-btn
      style="margin-left: 10px"
      color="indigo darken-4"
      dark
      @click="$emit('guardar', 'nao')"
    >Continuar Depois</v-btn>
    <v-btn dark color="indigo darken-4" style="margin-left: 10px" @click="next">Continuar</v-btn>
    <v-btn color="red darken-4" style="margin-left: 10px" dark @click="apagar">Limpar</v-btn>
  </v-card>
</template>

<script>
import NovaEntidade from "./classes/partes/NovaEntidade";
import SelecionarData from "@/components/generic/SelecionarData";
import ImportarRE from "@/components/rada/importacao/importarRE";

export default {
  props: [
    "RE",
    "entidades",
    "tipologias",
    "classes",
    "UIs",
    "entidadesProcessadas",
  ],
  components: {
    NovaEntidade,
    SelecionarData,
    ImportarRE,
  },
  data: () => ({
    panels: [0, 0, 0],
    menu1: false,
    menu2: false,
    isMultiple: false,
    basicRule: [(v) => !!v || "Campo de preenchimento obrigatório!"],
    importar_re: false,
  }),
  methods: {
    data_final_valida(v) {
      if (!!v) {
        if (this.RE.dataInicial != null) {
          let data_inicial = new Date(this.RE.dataInicial);
          let data_final = new Date(v);

          if (data_inicial > data_final) {
            return "Data final inválida. Data selecionada é anterior à data inicial.";
          }
        }
        return true;
      }
      return false;
    },
    bloquearData() {
      let classes = this.classes.some(
        (e) =>
          (e.tipo == "Série" || e.tipo == "Subsérie") &&
          (e.dataInicial != null || e.dataFinal != null)
      );

      let uis = this.UIs.some(
        (e) => e.dataInicial != null || e.dataFinal != null
      );

      if (classes || uis) {
        return true;
      }
      return false;
    },
    apagar() {
      this.RE.hist_admin = "";
      this.RE.hist_cust = "";
      this.RE.sist_org = "";
      this.RE.localizacao = "";
      this.RE.est_conser = "";

      if (
        !this.classes.some((e) => e.tipo == "Série" || e.tipo == "Subsérie")
      ) {
        this.RE.entidadesProd = [];
        this.RE.tipologiasProd = null;
        this.RE.dataInicial = null;
        this.RE.dataFinal = null;
      }
      this.isMultiple = false;
      this.panels = [0, 0, 0];
    },
    next: function () {
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(() => {
        if (this.$refs.form.validate()) {
          this.$emit("seguinte", 3);
        }
      }, 1);
    },
    removeEnt: function (item) {
      const index = this.RE.entidadesProd.findIndex((i) => i === item.entidade);
      if (index >= 0) this.RE.entidadesProd.splice(index, 1);
    },
    produtoraEntidadeClasse(item, entidade) {
      let classes = this.classes.filter(
        (e) =>
          e.tipo == "Série" && e.entProdutoras.some((ent) => ent == entidade)
      );

      let uis = this.UIs.filter((e) =>
        e.produtor.entProdutoras.some((ent) => ent == entidade)
      );

      if (classes.length > 0 || uis.length > 0) {
        item.disabled = true;
        return false;
      }

      item.disabled = false;
      return true;
    },
    produtoraTipologiaClasse(tipologia) {
      let classes = this.classes.filter(
        (e) => e.tipo == "Série" && e.tipologiasProdutoras == tipologia
      );

      let uis = this.UIs.filter(
        (e) => e.produtor.tipologiasProdutoras == tipologia
      );

      if (classes.length > 0 || uis.length > 0) {
        return true;
      }
      return false;
    },
  },
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
