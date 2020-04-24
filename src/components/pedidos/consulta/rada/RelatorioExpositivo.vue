<template>
  <v-card flat class="mb-12">
    <div v-if="!RE.tipologiasProd[0]">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Entidades Produtoras</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-combobox
            readonly
            v-model="RE.entidadesProd"
            :items="[]"
            item-text="entidade"
            item-value="entidade"
            multiple
            chips
          ></v-combobox>
        </v-col>
      </v-row>
    </div>
    <v-row v-if="!RE.entidadesProd[0]">
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Tipologias das Entidades Produtoras</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-combobox
          readonly
          v-model="RE.tipologiasProd"
          :items="[]"
          item-text="tipologia"
          item-value="tipologia"
          multiple
          chips
        ></v-combobox>
      </v-col>
    </v-row>
    <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    <v-row>
      <v-col cols="12" xs="12" sm="3" md="3">
        <div class="info-label">Data Inicial da Documentação</div>
      </v-col>
      <v-col xs="12" sm="9" md="9">
        <v-text-field readonly v-model="RE.dataInicial" prepend-icon="event"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12" sm="3" md="3">
        <div class="info-label">Data Final da Documentação</div>
      </v-col>
      <v-col xs="12" sm="9" md="9">
        <v-text-field readonly v-model="RE.dataFinal" prepend-icon="event"></v-text-field>
      </v-col>
    </v-row>
    <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    <v-card flat outlined>
      <div class="info-label">Dimensão e Suporte</div>
      <v-card-text>
        <v-row>
          <v-col xs="12" sm="3" md="3">
            <div class="info-label">Número de Séries</div>
          </v-col>
          <v-col xs="12" sm="1" md="1">
            <v-text-field readonly v-model="RE.dimSuporte.nSeries" solo></v-text-field>
          </v-col>
          <v-col xs="12" sm="3" md="3">
            <div class="info-label">Número de Subséries</div>
          </v-col>
          <v-col xs="12" sm="1" md="1">
            <v-text-field readonly v-model="RE.dimSuporte.nSubseries" solo></v-text-field>
          </v-col>
          <v-col xs="12" sm="3" md="3">
            <div class="info-label">Número de Unidades de Instalação</div>
          </v-col>
          <v-col xs="12" sm="1" md="1">
            <v-text-field readonly v-model="RE.dimSuporte.nUI" solo></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="3" md="3">
            <div class="info-label">Medição das UIs em Papel</div>
          </v-col>
          <v-col sm="1" md="1">
            <v-text-field v-model="RE.dimSuporte.medicaoUI_papel" solo readonly></v-text-field>
          </v-col>
          <v-col sm="3" md="3">
            <div class="info-label">Medição das UIs em Digital</div>
          </v-col>
          <v-col sm="1" md="1">
            <v-text-field readonly v-model="RE.dimSuporte.medicaoUI_digital" solo></v-text-field>
          </v-col>
          <v-col sm="3" md="3">
            <div class="info-label">Medição das UIs em noutros suportes</div>
          </v-col>
          <v-col sm="1" md="1">
            <v-text-field readonly v-model="RE.dimSuporte.medicaoUI_outros" solo></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <br />
    <v-expansion-panels accordion>
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
              <v-text-field readonly v-model="RE.hist_admin" solo></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">História Custodial</div>
            </v-col>
            <v-col xs="12" sm="9">
              <v-text-field readonly v-model="RE.hist_cust" solo></v-text-field>
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
              <v-text-field readonly v-model="RE.sist_org" solo></v-text-field>
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
              <v-text-field readonly v-model="RE.localizacao" solo></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Estado de Conservação</div>
            </v-col>
            <v-col xs="12" sm="9">
              <v-text-field readonly v-model="RE.est_conser" solo></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  props: ["RE"]
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
</style>