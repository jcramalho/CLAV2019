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
      <v-col md="3" sm="3">
        <div class="info-label">Data Inicial</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-menu
          ref="menu1"
          v-model="data_inicial_menu"
          :close-on-content-click="false"
          :return-value.sync="newSerie.dataInicial"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :rules="[v => !!v || 'Campo obrigatório!']"
              v-model="newSerie.dataInicial"
              label="Data Inicial"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="newSerie.dataInicial"
            no-title
            scrollable
            locale="pt"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="data_inicial_menu = false"
              >Cancel</v-btn
            >
            <v-btn
              text
              color="primary"
              @click="$refs.menu1.save(newSerie.dataInicial)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <!-- DATA FINAL -->
      <v-col md="3" sm="3">
        <div class="info-label">Data Final</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-menu
          ref="menu2"
          v-model="data_final_menu"
          :close-on-content-click="false"
          :return-value.sync="newSerie.dataFinal"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :rules="[v => !!v || 'Campo obrigatório!']"
              v-model="newSerie.dataFinal"
              label="Data Final"
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="newSerie.dataFinal"
            no-title
            scrollable
            locale="pt"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="data_final_menu = false"
              >Cancel</v-btn
            >
            <v-btn
              text
              color="primary"
              @click="$refs.menu2.save(newSerie.dataFinal)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
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
            v-model="newSerie.tUa"
            :items="tiposUA"
            chips
            solo
            clearable
          >
            <template v-slot:selection="data">
              <v-chip>
                <v-avatar left color="amber accent-3">{{
                  data.item[0]
                }}</v-avatar>
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
      <v-row>
        <v-col md="3" sm="3">
          <div class="info-label">Suporte</div>
        </v-col>
        <v-col sm="3" md="3">
          <v-select
            :rules="[v => !!v || 'Campo obrigatório!']"
            :items="suporte_items"
            solo
            clearable
            v-model="newSerie.suporte"
            label="Suporte"
          ></v-select>
        </v-col>
        <v-col md="3" sm="3">
          <div class="info-label">Medição</div>
        </v-col>
        <v-col sm="3" md="3">
          <v-text-field
            :rules="[
              v =>
                (!isNaN(parseInt(v)) && parseInt(v) > 0) ||
                'Campo Obrigatório! Valor tem que ser um número positivo.'
            ]"
            solo
            clearable
            v-model="newSerie.medicao"
            label="Medição"
          ></v-text-field>
        </v-col>
      </v-row>
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
export default {
  props: ["newSerie"],
  data: () => ({
    data_inicial_menu: false,
    data_final_menu: false,
    tiposUA: ["Processo", "Coleção", "Dossier", "Registo"],
    aberto_fechado: ["Aberto", "Fechado"],
    suporte_items: [
      "Eletrónica Digitalizado",
      "Eletrónico Nativo",
      "Papel",
      "Outro"
    ]
  })
};
</script>
