<template>
  <v-row>
    <v-col cols="12" xs="12" sm="12">
      <template>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            width="90%"
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="indigo darken-2"
                dark
                rounded
                v-bind="attrs"
                v-on="on"
              >
                Criar SI
              </v-btn>
            </template>
            <v-card>
              <v-app-bar
                absolute
                color="indigo darken-2"
                dark
                scroll-target="#scrolling"
              >
                <v-btn
                  icon
                  dark
                  @click="dialog = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Novo Sistema de informação</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    @click="dialog = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    dark
                    text
                    @click="newSistema"
                  >
                    Guardar
                  </v-btn>
                </v-toolbar-items>
              </v-app-bar>
              <v-sheet id="scrolling" class="overflow-y-auto" max-height="600">
                <v-container style="height: 70px;"></v-container>
                <v-row>
                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Número de referência SI</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8">
                    <v-text-field
                      :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                      v-model="c.identificacao.numeroSI"
                      label="Identificador do sistema de informação"
                      solo
                      clearable
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Nome do SI</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8">
                    <v-text-field
                      :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                      v-model="c.identificacao.nomeSI"
                      label="Designação oficial do sistema"
                      solo
                      clearable
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Administrador do Sistema</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8" v-if="entidadesReady">
                    <v-autocomplete
                      v-model="adminSistema"
                      :items="entidades"
                      item-text="label"
                      placeholder="Selecione o organismo que tem a administração operacional do sistema"
                      multiple
                      chips
                      deletable-chips
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col v-else>
                    <v-alert dense type="info">
                      Ainda não foi possível carregar as entidades...
                    </v-alert>
                  </v-col>

                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Administrador de Dados</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8" v-if="entidadesReady">
                    <v-autocomplete
                      v-model="c.identificacao.adminDados"
                      :items="entidades"
                      item-text="label"
                      placeholder="Selecione o organismo que tem a administração operacional dos dados"
                      multiple
                      chips
                      deletable-chips
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col v-else>
                    <v-alert dense type="info">
                      Ainda não foi possível carregar as entidades...
                    </v-alert>
                  </v-col>

                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Proprietário do SI - Entidade pública</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8" v-if="entidadesReady">
                    <v-autocomplete
                      v-model="c.identificacao.propSistemaPublico"
                      :items="entidades"
                      item-text="label"
                      placeholder="Selecione o organismo que tem a propriedade intelectual/responsabilidade de gestão do SI"
                      multiple
                      chips
                      deletable-chips
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col v-else>
                    <v-alert dense type="info">
                      Ainda não foi possível carregar as entidades...
                    </v-alert>
                  </v-col>


                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Proprietário do SI - Entidade privada</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8">
                    <v-text-field
                      :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                      v-model="c.identificacao.propSistemaPrivado"
                      label="Indique o nome do organismo responsável pela gestão dos dados"
                      solo
                      clearable
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Proprietário dos dados</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8" v-if="entidadesReady">
                    <v-autocomplete
                      v-model="c.identificacao.propDados"
                      :items="entidades"
                      item-text="label"
                      placeholder="Selecione o organismo que tem a propriedade intelectual/responsabilidade de gestão dos dados"
                      multiple
                      chips
                      deletable-chips
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col v-else>
                    <v-alert dense type="info">
                      Ainda não foi possível carregar as entidades...
                    </v-alert>
                  </v-col>


                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Localização dos dados - Entidade pública</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8" v-if="entidadesReady">
                    <v-autocomplete
                      v-model="c.identificacao.localDadosPublico"
                      :items="entidades"
                      item-text="label"
                      placeholder="Selecione o organismo que tem a propriedade intelectual/responsabilidade de gestão dos dados"
                      multiple
                      chips
                      deletable-chips
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col v-else>
                    <v-alert dense type="info">
                      Ainda não foi possível carregar as entidades...
                    </v-alert>
                  </v-col>

                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Localização dos dados - Entidade privada</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8">
                    <v-text-field
                      :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                      v-model="c.identificacao.localDadosPrivado"
                      label="Indique o nome da entidade privada onde os dados residem"
                      solo
                      clearable
                    ></v-text-field>
                  </v-col>


                  <v-col cols="12" xs="12" sm="3">
                    <div class="info-label">Definição formal de responsabilidades</div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="8">
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
                  <v-col cols="12" xs="12" sm="8">
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
                  <v-col cols="12" xs="12" sm="8">
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
                  <v-col cols="12" xs="12" sm="8">
                    <v-textarea
                        v-model="c.identificacao.notas"
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
                      <v-col cols="12" xs="12" sm="8">
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
                </v-row>
              </v-sheet>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </v-col>

    <v-snackbar v-model="naVaziaFlag" :color="'warning'" :timeout="60000">
      {{ mensagemUserVazio }}
      <v-btn dark text @click="naVaziaFlag = false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="naDuplicadoFlag" :color="'error'" :timeout="60000">
      {{ mensagemUserDuplicado }}
      <v-btn dark text @click="naDuplicadoFlag = false">Fechar</v-btn>
    </v-snackbar>

    <v-snackbar v-model="erroValidacao" :color="'warning'" :timeout="60000">
      <div v-for="(m, i) in mensagensErro" :key="i">{{ m }}</div>
      <v-btn dark text @click="fecharErros">Fechar</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";


export default {
  props: ["c", "sistema","entidades","entidadesReady"],

  components: {
      InfoBox,
    },

  data: function() {
    return {
      listaTipos: [],
      erroValidacao: false,
      mensagensErro: [],
      valid: false,
      dialog: false,
      simNao: ["Sim","Não"],
      adminSistema: [],
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

  created: async function() {
    try {
      var tipos = await this.$request(
        "get",
        "/vocabularios/vc_tipoDiplomaLegislativo"
      );
      this.listaTipos = tipos.data.map(t => {
        return { label: t.termo, value: t.termo };
      });
    } catch (e) {
      return e;
    }
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
    },

    fecharErros: function() {
      this.mensagensErro = [];
      this.erroValidacao = false;
    },

    validaDups: async function(t, n) {
      try {
        var legs = await this.$request("get", "/sistema");
        var test = legs.data.filter(l => l.tipo == t && l.numero == n);
        if (test.length > 0) {
          this.mensagensErro.push(
            "Já existe um documento sistema na BD com o mesmo número!"
          );
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    },

    validaDupsLocais: function(t, n) {
      var test = this.sistema.filter(l => l.tipo == t && l.numero == n);
      if (test.length > 0) {
        this.mensagensErro.push(
          "Já foi criado um item com esse número!"
        );
        return false;
      } else {
        return true;
      }
    },

    validaAll: function(tipo, s) {
      if (s != "") return true;
      else {
        this.mensagensErro.push(tipo + " não pode ficar vazio!");
        return false;
      }
    },

    validaDef: function(res, s) {
      if (s == ""){
        this.mensagensErro.push("A definição de responsabilidaes não pode ficar sem escolha!");
        return false;
      }
      if (s == "Não") return true;
      if (res != "") return true;
      else {
        this.mensagensErro.push("A expressão da formalização de responsabilidade não pode ficar vazia!");
        return false;
      }
    },

    validaInsourcing: function(res, s) {
      if (s == ""){
        this.mensagensErro.push("O insouring não pode ficar sem escolha!");
        return false;
      }
      if (s == "Não") return true;
      if (res != "") return true;
      else {
        this.mensagensErro.push("O campo natureza dos serviços do insourcing não pode ficar vazio!");
        return false;
      }
    },
    validaOutsourcing: function(res, s) {
      if (s == ""){
        this.mensagensErro.push("O outsourcing não pode ficar sem escolha!");
        return false;
      }
      if (s == "Não") return true;
      if (res != "") return true;
      else {
        this.mensagensErro.push("O campo natureza dos serviços do outsourcing não pode ficar vazio!");
        return false;
      }
    },

    newSistema: async function() {
      if(this.validaAll("O campo número do SI",this.c.identificacao.numeroSI) &&
        this.validaAll("O campo  nome do SI",this.c.identificacao.nomeSI) &&
        this.validaAll("O campo administrador do sistema",this.adminSistema) &&
        this.validaAll("O campo administrador de dados",this.c.identificacao.adminDados) &&
        this.validaAll("O campo proprietário do SI - entidade pública",this.c.identificacao.propSistemaPublico) &&
        this.validaAll("O campo proprietário do SI - entidade privada",this.c.identificacao.propSistemaPrivado) &&
        this.validaAll("O campo proprietário dos dados",this.c.identificacao.propDados) &&
        this.validaAll("O campo localização dos dados - entidade pública",this.c.identificacao.localDadosPublico) &&
        this.validaAll("O campo localização dos dados - entidade privada",this.c.identificacao.localDadosPrivado) &&
        this.validaDef(this.c.identificacao.defResponsavel, this.defCheck) &&
        this.validaInsourcing(this.c.identificacao.outsourcing, this.outsourcingCheck) &&
        this.validaAll("O campo notas", this.c.identificacao.notas) &&
        this.validaAll("O campo de utilizadores",this.c.identificacao.userList)
      ){
        var sistema = {
          numeroSI: this.c.identificacao.numeroSI,
          nomeSI: this.c.identificacao.nomeSI,
          adminSistema: this.adminSistema,
          adminDados: this.c.identificacao.adminDados,
          propSistemaPublico: this.c.identificacao.propSistemaPublico,
          propSistemaPrivado: this.c.identificacao.propSistemaPrivado,
          propDados: this.c.identificacao.propDados,
          localDadosPublico: this.c.identificacao.localDadosPublico,
          localDadosPrivado: this.c.identificacao.localDadosPrivado,
          userList: this.c.identificacao.userList,
          defResponsavel: this.c.identificacao.defResponsavel,
          expressaoResponsavel:this.c.identificacao.expressaoResponsavel,
          insourcing: this.c.identificacao.insourcing,
          outsourcing: this.c.identificacao.outsourcing,
          notas: this.c.identificacao.notas,
        };
        this.c.identificacao.numeroSI= "";
        this.c.identificacao.nomeSI= "";
        this.adminSistema= [];
        this.c.identificacao.adminDados= [];
        this.c.identificacao.propSistemaPublico= [];
        this.c.identificacao.propSistemaPrivado= "";
        this.c.identificacao.propDados= [];
        this.c.identificacao.localDadosPublico= [];
        this.c.identificacao.localDadosPrivado= "";
        this.c.identificacao.userList= [];
        this.c.identificacao.defResponsavel= "";
        this.c.identificacao.expressaoResponsavel="";
        this.c.identificacao.insourcing= "";
        this.c.identificacao.outsourcing= "";
        this.c.identificacao.notas= "";
        this.dialog= false;
        this.$emit("newSistema", sistema);
      } else {
        this.dialog= true;
        this.erroValidacao = true;
      }
    }

  }
};
</script>
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
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
