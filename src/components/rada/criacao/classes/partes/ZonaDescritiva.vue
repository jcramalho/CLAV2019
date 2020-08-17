<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Descrição</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          solo
          clearable
          :rules="[v => !!v || 'Campo obrigatório!']"
          v-model="newSerie.descricao"
          label="Descrição"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <!-- DATA INICIAL -->
      <v-col :cols="newSerie.tipo == 'Subsérie' ? 2 : 3">
        <div class="info-label">Data Inicial</div>
      </v-col>
      <v-col sm="3" md="3">
        <SelecionarData
          :d="newSerie.dataInicial"
          label="Data Inicial"
          @dataSelecionada="newSerie.dataInicial = $event"
          :dataMinima="RE.dataInicial"
          :dataMaxima="RE.dataFinal"
        >
          <template v-slot:default="slotProps">
            <v-text-field
              :rules="[v => !!v || 'Campo obrigatório!']"
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
      <!-- DATA FINAL -->
      <v-col :cols="newSerie.tipo == 'Subsérie' ? 2 : 3">
        <div class="info-label">Data Final</div>
      </v-col>
      <v-col sm="3" md="3">
        <SelecionarData
          :d="newSerie.dataFinal"
          label="Data Final"
          @dataSelecionada="newSerie.dataFinal = $event"
          :dataMinima="RE.dataInicial"
          :dataMaxima="RE.dataFinal"
        >
          <template v-slot:default="slotProps">
            <v-text-field
              :rules="[v => data_final_valida(v) || 'Campo obrigatório!']"
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
      <v-col v-if="newSerie.tipo == 'Subsérie'" cols="2">
        <v-btn
          :disabled="!Boolean(newSerie.eFilhoDe)"
          @click="herdarDatasExtremas()"
          class="ma-2"
          color="indigo darken-2"
          rounded
          style="width:100%;"
        >
          <font style="color: white">Herdar Datas</font>
        </v-btn>
      </v-col>
    </v-row>
    <!-- UNIDADES DE INSTALAÇÃO -->
    <!-- v-if="newSerie.dataInicial == null && newSerie.dataFinal == null" -->
    <AssociarUI :newSerie="newSerie" :UIs="UIs" />
    <div v-if="newSerie.tipo != 'Subsérie'">
      <v-row>
        <!-- TUArq -->
        <v-col md="3" sm="3">
          <div class="info-label">Tipo de Unidade Arquivística</div>
        </v-col>
        <v-col md="3" sm="3">
          <v-select
            :rules="[v => !!v || 'Campo obrigatório!']"
            v-if="newSerie.tipo != 'Subsérie'"
            label="Tipo de Unidade Arquivística"
            v-model="newSerie.tUA"
            :items="tiposUA"
            chips
            solo
            clearable
          >
            <template v-slot:selection="data">
              <v-chip>
                <v-avatar left color="amber accent-3">{{ data.item[0] }}</v-avatar>
                {{ data.item }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
        <v-col md="3" sm="3">
          <div class="info-label">Tipo de Série</div>
        </v-col>
        <v-col sm="3" md="3">
          <v-select
            :rules="[v => !!v || 'Campo obrigatório!']"
            :items="aberto_fechado"
            solo
            clearable
            v-model="newSerie.tSerie"
            label="Serie Aberta/Fechada"
          ></v-select>
        </v-col>
      </v-row>
      <SuporteMedicao :newSerie="newSerie" />
      <v-row>
        <v-col md="3" sm="3">
          <div class="info-label">Localização</div>
        </v-col>
        <v-col sm="9" md="9">
          <v-combobox
            :rules="[v => !!v[0] || 'Campo obrigatório!']"
            multiple
            solo
            clearable
            v-model="newSerie.localizacao"
            chips
            deletable-chips
            label="Localização"
          ></v-combobox>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import AssociarUI from "@/components/rada/criacao/classes/partes/AssociarUI";
import SuporteMedicao from "@/components/rada/criacao/classes/partes/SuporteMedicao";

export default {
  props: ["newSerie", "classes", "UIs", "RE"],
  components: {
    AssociarUI,
    SelecionarData,
    SuporteMedicao
  },
  data: () => ({
    data_inicial_menu: false,
    data_final_menu: false,
    tiposUA: ["Processo", "Coleção", "Dossier", "Registo"],
    aberto_fechado: ["Aberta", "Fechada"]
  }),
  methods: {
    herdarDatasExtremas() {
      let classe_pai = this.classes.find(
        e => e.codigo == this.newSerie.eFilhoDe
      );

      this.newSerie.dataInicial = classe_pai.dataInicial;
      this.newSerie.dataFinal = classe_pai.dataFinal;
    },
    data_final_valida(v) {
      if (!!v) {
        if (this.newSerie.dataInicial != null) {
          let data_inicial = new Date(this.newSerie.dataInicial);
          let data_final = new Date(v);

          if (data_inicial > data_final) {
            return "Data final inválida. Data selecionada é anterior à data inicial.";
          }
        }
        return true;
      }
      return false;
    }
  }
};
</script>
