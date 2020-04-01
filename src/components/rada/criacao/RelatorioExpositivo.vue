<template>
  <v-card flat class="mb-12" style="background-color:#fafafa">
    <v-form ref="form" :lazy-validation="false">
      <div v-if="!RE.tipologiasProd[0]">
        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Entidades Produtoras</div>
          </v-col>
          <v-col xs="12" sm="9">
            <!-- {{ tipologiasProcessadas }} -->
            <v-autocomplete
              :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
              v-model="RE.entidadesProd"
              :items="entidadesProcessadas"
              item-text="searchField"
              placeholder="Selecione as Entidades Produtoras."
              multiple
              return-object
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
                  :close="produtoraEntidadeClasse(data.item, data.item.sigla, data.item.designacao)"
                  @click:close="removeEnt(data.item)"
                >{{ data.item.searchField }}</v-chip>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <NovaEntidade :entidades="entidades" :produtoras="RE.entidadesProd" />
      </div>
      <v-row v-if="!RE.entidadesProd[0]">
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Tipologias das Entidades Produtoras</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-autocomplete
            :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
            v-model="RE.tipologiasProd"
            :items="tipologiasProcessadas"
            item-text="searchField"
            return-object
            placeholder="Selecione as Tipologias das Entidades Produtoras."
            multiple
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  <strong>Tipologia</strong> em questão não existe!
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                :close="produtoraTipologiaClasse(data.item, data.item.sigla, data.item.designacao)"
                @click:close="removeTip(data.item)"
              >{{ data.item.searchField }}</v-chip>
            </template>
          </v-autocomplete>
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
                clearable
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="RE.dataInicial"
              no-title
              scrollable
              locale="pt"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu1 = false">Cancelar</v-btn>
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
                clearable
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="RE.dataFinal"
              no-title
              scrollable
              locale="pt"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu2 = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.menu2.save(RE.dataFinal)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de Unidades de Instalação</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-text-field
            v-model="RE.dimSuporte.nUI"
            placeholder="Nº de Unidades de Instalação."
            :rules="[
              v =>
                (!isNaN(parseInt(v)) && parseInt(v) >= 0) ||
                'Campo Obrigatório! Valor tem que ser inteiro.'
            ]"
            single-line
            type="number"
          />
        </v-col>
      </v-row> -->
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
import NovaEntidade from "./classes/partes/NovaEntidade";

export default {
  props: ["RE", "entidades", "tipologias", "classes", "UIs"],
  components: {
    NovaEntidade
  },
  computed: {
    entidadesProcessadas() {
      return this.entidades.map(item => {
        item["searchField"] = item.sigla + " - " + item.designacao;
        item["disabled"] = false;
        return item;
      });
    },
    tipologiasProcessadas() {
      return this.tipologias.map(item => {
        item["searchField"] = item.sigla + " - " + item.designacao;
        item["disabled"] = false;
        return item;
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
    },
    removeEnt: function(item) {
      const index = this.RE.entidadesProd.findIndex(
        i => i.sigla === item.sigla
      );
      if (index >= 0) this.RE.entidadesProd.splice(index, 1);
    },
    removeTip: function(item) {
      const index = this.RE.tipologiasProd.findIndex(
        i => i.sigla === item.sigla
      );
      if (index >= 0) this.RE.tipologiasProd.splice(index, 1);
    },
    produtoraEntidadeClasse(item, sigla, desi) {
      let classes = this.classes.filter(
        e =>
          e.tipo == "Série" &&
          e.entProdutoras.some(
            ent => ent.sigla == sigla && ent.designacao == desi
          )
      );

      let uis = this.UIs.filter(e =>
        e.produtor.entProdutoras.some(
          ent => ent.sigla == sigla && ent.designacao == desi
        )
      );

      if (classes.length > 0 || uis.length > 0) {
        item.disabled = true;
        return false;
      }

      item.disabled = false;
      return true;
    },
    produtoraTipologiaClasse(item, sigla, desi) {
      let classes = this.classes.filter(
        e =>
          e.tipo == "Série" &&
          e.tipologiasProdutoras.some(
            tip => tip.sigla == sigla && tip.designacao == desi
          )
      );

      let uis = this.UIs.filter(e =>
        e.produtor.tipologiasProdutoras.some(
          ent => ent.sigla == sigla && ent.designacao == desi
        )
      );

      if (classes.length > 0 || uis.length > 0) {
        item.disabled = true;
        return false;
      }

      item.disabled = false;
      return true;
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
