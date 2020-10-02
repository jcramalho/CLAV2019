<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE CARACTERIZAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        Caracterização do plano de preservação digital
        <InfoBox header="Caracterização ppd" :text="myhelp.Classe.BlocoDecisoes"  helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de referência SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.caracterizacao.nRef"
            label="Identificador do sistema de informação"
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Nome do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.caracterizacao.nomeSI"
            label="Designação oficial do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <hr style="border: 3px solid indigo; border-radius: 2px;" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Nível de dependência do Software</div>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="9"
        >
          <v-select
            :items="dependenciaSoft"
            label="Indique nível de dependência para com fornecedores privados"
            v-model="c.caracterizacao.dependenciaSoft"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Modelo de crescimento</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="modeloCres"
            label="Indique o modelo de adição de dados ao sistema"
            v-model="modeloCresCheck"
            dense
            solo
          ></v-select>
          <span>{{c.caracterizacao.modeloCres}}</span>
          <div v-if="modeloCresCheck ==='Outra situação'">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.caracterizacao.modeloCres"
              label="Indique qual"
              solo
              clearable
            ></v-text-field>
          </div>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Dimensão atual</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.caracterizacao.dimensao"
              label="Indique nº de registos e dimensão em unidades binárias."
              solo
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Crescimento anual</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.caracterizacao.crescimento"
              label="Indique nº de registos e dimensão em unidades binárias."
              solo
              clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Localização de Sistema</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="localSistema"
            label="Indique se os sistemas estão sediados num ponto central ou dispersos"
            v-model="c.caracterizacao.localSistema"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sala técnica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="c.caracterizacao.salaTec" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Acesso reservado a sala técnica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="c.caracterizacao.acessoSalaTec" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sistemas de energia redundantes</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="c.caracterizacao.energiaRed" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Energia socorrida</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
           <v-radio-group v-model="c.caracterizacao.energiaSoc" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Sistema de alarme e extinção de incêndio</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="alarme"
            label="Indique se há segurança relativamente a incêndios"
            v-model="c.caracterizacao.alarme"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Climatização dedicada</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.climatizacao" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Utilização de métodos de prevenção ou mitigação de malware e outras ciberameaças</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="seguranca"
            label="Indique se existe algum tipo de proteção"
            v-model="c.caracterizacao.seguranca"
            dense
            solo
          ></v-select>
        </v-col>

        </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      simNao: ["Sim", "Não"],
      modeloCresCheck: "",

      myhelp: help,
      dependenciaSoft: ["Uso exclusivo de SW não proprietário",
                        "Uso de SW proprietário, mas com adequadas facilidades de exportação de dados",
                        "Uso de SW proprietário com especificações fechadas, e sem adequadas facilidades de exportação de dados"],
      modeloCres: ["Acumulção contínua - dados continuamente adicionados sem se proceder a expurgo",
                   "Substituição de dado - os dados são escritos por cima de registos anteriores criando diferentes versões de um registo qs quais podem ou não ser guardadas",
                   "Expurgo de registos que perdem utilidade operacional - periodicamente o sistema é purgado de dados que perdem utilidade operacional",
                   "Outra situação"],
      seguranca: ["Sim", "Não", "Em estudo"],
      alarme: ["Sim há sistemas de alarme e extinção", "Não há sistemas de alarme ou extinção",
               "Há sistemas de alarme mas não de extinção", "Outros"],
      localSistema: ["Centralizado","Descentralizado","Misto"]
    };
  },

  methods: {

  }
};
</script>
<style>
.info-label {
  color: #2e7d32; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; 
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E; 
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
