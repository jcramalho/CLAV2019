<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE IDENTIFICAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        Identificação do plano de preservação digital
        <InfoBox header="Identificação ppd" helpColor="white"/>
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
            v-model="c.nRef"
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
            v-model="c.identificacao.nomeSI"
            label="Designação oficial do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Localização dos dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.local"
            label="Indique nome do(s) organismo(s) onde os dados estão armazenados"
            solo
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Adminstrador do Sistema</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.adminSistema"
            label="Indique nome do organismo adminstrador operacional do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Adminstrador de Dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.adminDados"
            label="Indique nome do organismo adminstrador operacional dos dados"
            solo
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Proprietário do Sistema</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.propSistema"
            label="Indique nome do organismo responsável pela gestão do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Proprietário de Dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.propDados"
            label="Indique nome do organismo responsável pela gestão dos dados"
            solo
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Definição formal de responsabilidades</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="defCheck" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
          <div v-if="defCheck === 'Sim'">
              <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.identificacao.defResponsavel"
              label="Indique a expressão dessa formalização de mandatos"
              solo
              clearable
              ></v-text-field>
          </div>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Insourcing</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="insourcingCheck" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
          <div v-if="insourcingCheck === 'Sim'">
              <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.identificacao.insourcing"
              label="Indique a natureza dos serviços prestados"
              solo
              clearable
              ></v-text-field>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Outsourcing</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="outsourcingCheck" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
          <div v-if="outsourcingCheck === 'Sim'">
              <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.identificacao.outsourcing"
              label="Indique a natureza dos serviços prestados"
              solo
              clearable
              ></v-text-field>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Notas</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-textarea
              v-model="c.identificacao.notas"
              label=""
              solo
              clearable
          ></v-textarea>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Menção de responsabilidade</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-textarea
              v-model="c.identificacao.mencaoResp"
              label=""
              solo
              clearable
          ></v-textarea>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">
            Utilizador(es) do organismo
            <InfoBox header="Utilizador(es) do organismo"/>
          </div>

          <v-btn
          color="indigo darken-2"
          small
          dark
          rounded
          elevation="24"
          @click="insereNovoUser(c.identificacao.userList, 'na')"
          >
            Novo utilizador
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-row v-for="(user, index) in c.identificacao.userList" :key="index">
            <v-col cols="12" xs="12" sm="9">
              <v-textarea
              v-model="user.user"
              auto-grow
              solo
              label="Novo utilizador"
              rows="1"
              ></v-textarea>
            </v-col>
            <v-col>
              <v-btn
              color="red darken-2"
              dark
              rounded
              small
              elevation="7"
              @click="c.identificacao.userList.splice(index, 1)"
              >
                Remover
                <v-icon dark right>remove_circle_outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>


        <v-snackbar v-model="naVaziaFlag" :color="'warning'" :timeout="60000">
          {{ mensagemUserVazio }}
          <v-btn dark text @click="naVaziaFlag = false">Fechar</v-btn>
        </v-snackbar>

        <v-snackbar v-model="naDuplicadoFlag" :color="'error'" :timeout="60000">
          {{ mensagemUserDuplicado }}
          <v-btn dark text @click="naDuplicadoFlag = false">Fechar</v-btn>
        </v-snackbar>

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
      simNao: ["Sim","Não"],
      defCheck: "",
      insourcingCheck: "",
      outsourcingCheck: "",

      myhelp: help,
      naVaziaFlag: false,
      naDuplicadoFlag: false,
      mensagemUserVazio:
        "O utilizador anterior encontra-se vazio. Queira preenchê-lo antes de criar novo.",
      mensagemUserDuplicado:
        "O último utilizador introduzido é um duplicado de outro já introduzido previamente!"
    };
  },
  methods: {
    userDuplicado: function(user) {
      if (user.length > 1) {
        var lastUser = user[user.length - 1].user;
        var duplicados = user.filter(n => n.user == lastUser);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    insereNovoUser: async function(user, tipo) {
      if (user.length > 0 && user[user.length - 1].user == "") {
        this.naVaziaFlag = true;
      } else if (this.userDuplicado(user)) {
        this.naDuplicadoFlag = true;
      } else {
        var n = { id: tipo + "_" + nanoid(), user: "" };
        user.push(n);
      }
    }
  },

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
  background-color: #1a237e;
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
