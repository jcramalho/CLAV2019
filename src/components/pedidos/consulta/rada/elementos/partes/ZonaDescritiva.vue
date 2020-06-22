<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Descrição</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field solo v-model="classe.descricao" readonly label="Sem descrição"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <!-- DATA INICIAL -->
      <v-col md="3" sm="3">
        <div class="info-label">Data Inicial</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field v-model="classe.dataInicial" prepend-icon="event" readonly></v-text-field>
      </v-col>
      <!-- DATA FINAL -->
      <v-col md="3" sm="3">
        <div class="info-label">Data Final</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field v-model="classe.dataFinal" prepend-icon="event" readonly></v-text-field>
      </v-col>
    </v-row>
    <!-- UNIDADES DE INSTALAÇÃO -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Unidades de Instalação</div>
      </v-col>
      <v-col md="9" sm="9" xs="12">
        <v-combobox
          readonly
          v-model="classe.UIs"
          :items="[]"
          multiple
          item-text="searchField"
          item-value="codigo"
          chips
          label="Sem unidades de instalação associadas"
          solo
        ></v-combobox>
      </v-col>
    </v-row>

    <div v-if="classe.tipo != 'Subsérie'">
      <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
      <v-row>
        <!-- TUArq -->
        <v-col md="3" sm="3">
          <div class="info-label">Tipo de Unidade Arquivística</div>
        </v-col>
        <v-col md="3" sm="3">
          <v-select
            readonly
            v-if="classe.tipo != 'Subsérie'"
            v-model="classe.tUA"
            :items="tiposUA"
            label="Sem tipo de unidade arquivística"
            chips
            solo
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
            readonly
            label="Sem tipo de série"
            :items="aberto_fechado"
            solo
            v-model="classe.tSerie"
          ></v-select>
        </v-col>
      </v-row>
      <v-card outlined>
        <v-row v-for="(valores, i) in newSerie.suporte_e_medicao" :key="i">
          <v-col md="3" sm="3">
            <div class="info-label">Suporte ({{ i+1 }})</div>
          </v-col>
          <v-col sm="3" md="3">
            <v-select
              :items="suporte_items"
              label="Sem suporte"
              solo
              v-model="valores.suporte"
              readonly
            ></v-select>
          </v-col>
          <v-col md="3" sm="3">
            <div class="info-label">Medição ({{ i+1 }})</div>
          </v-col>
          <v-col sm="3" md="3">
            <v-text-field type="number" label="Sem medição" solo v-model="valores.medicao" readonly></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-row>
        <v-col md="3" sm="3">
          <div class="info-label">Localização</div>
        </v-col>
        <v-col sm="9" md="9">
          <v-combobox
            readonly
            multiple
            solo
            v-model="classe.localizacao"
            chips
            label="Sem localização"
          ></v-combobox>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ["classe"],
  data: () => ({
    tiposUA: ["Processo", "Coleção", "Dossier", "Registo"],
    aberto_fechado: ["Aberta", "Fechada"],
    suporte_items: [
      "Eletrónico Digitalizado",
      "Eletrónico Nativo",
      "Papel",
      "Outro"
    ]
  })
};
</script>