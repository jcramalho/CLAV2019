<template>
  <v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-col cols="12" xs="12" sm="4">
          <v-btn
            v-if="importarPPD === false"
            color="indigo darken-2"
            dark
            class="ma-2"
            v-bind="attrs"
            v-on="on"
          >
            Novo SI
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
          <v-btn v-if="importarPPD === true" color="indigo lighten-2" dark class="ma-2" @click="importarSI = true">
            Importar SI
            <v-icon dark right>file_upload</v-icon>
          </v-btn>
        </v-col>
      </template>

      <v-card>
        <v-app-bar
          absolute
          color="indigo darken-2"
          dark
          elevate-on-scroll
          scroll-target="#scrolling"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>clear</v-icon>
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
              @click="newSistema()"
            >
              Guardar
            </v-btn>
          </v-toolbar-items>
        </v-app-bar>
        <v-sheet id="scrolling" class="overflow-y-auto overflow-x-hidden">
          <v-container style="height: 70px;"></v-container>
          <v-row >
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Número de referência SI
                <InfoBox header="Número de referência do Sistema de informação" :text="myhelp.Ppd.numeroSI"/>
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="8">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="ppd.si.numeroSI"
                label="Identificador do sistema de informação"
                solo
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Nome do SI
                <InfoBox header="Nome do Sistema de informação" :text="myhelp.Ppd.nomeSI"/>
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="8">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="ppd.si.nomeSI"
                label="Designação oficial do sistema"
                solo
                clearable
              ></v-text-field>
            </v-col>
            <v-expansion-panels>
              <!-- BLOCO IDENTIFICAÇÃO -->
              <BlocoIdentificacao
                :ppd="ppd"
                :semaforos="semaforos"
                :entidades="entidades"
              />
              <!-- BLOCO AVALIAÇÃO -->
              <BlocoAvaliacao
                :ppd="ppd"
                :semaforos="semaforos"
                :listaLegislacao="listaLegislacao"
                @newSistemasRelacionados="newSistemasRelacionados($event, ppd.si.avaliacao.sistemasRelacionados)"
                @unselectSistemasRelacionados="unselectSistemasRelacionados($event)"
              />
              <!-- BLOCO CARACTERIZAÇÃO -->
              <BlocoCaracterizacao
                :ppd="ppd"
              />
              <!-- BLOCO ESTRATÉGIA -->
              <BlocoEstrategia
                :ppd="ppd"
              />
            </v-expansion-panels>
          </v-row>
          <v-snackbar v-model="erroValidacao" :color="'warning'" :timeout="60000">
            <div v-for="(m, i) in mensagensErro" :key="i">{{ m }}</div>
            <v-btn dark text @click="fecharErros">Fechar</v-btn>
          </v-snackbar>
        </v-sheet>
      </v-card>
    </v-dialog>
    <ImportarSI
      :ppd = "ppd"
      :dialog="importarSI"
      @fecharDialog="importarSI = false"
    />
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";
import ImportarSI from "@/components/ppd/criacao/sistemaInformacao/importacao/ImportarSI.vue";
import BlocoIdentificacao from "@/components/ppd/criacao/sistemaInformacao/BlocoIdentificacao.vue";
import BlocoAvaliacao from "@/components/ppd/criacao/sistemaInformacao/BlocoAvaliacao.vue";
import BlocoCaracterizacao from "@/components/ppd/criacao/sistemaInformacao/BlocoCaracterizacao.vue";
import BlocoEstrategia from "@/components/ppd/criacao/sistemaInformacao/BlocoEstrategia.vue";


export default {
  props: ["ppd", "semaforos", "listaLegislacao", "sistema", "entidades", "importarPPD"],

  components: {
    InfoBox,
    BlocoIdentificacao,
    BlocoAvaliacao,
    BlocoCaracterizacao,
    BlocoEstrategia,
    ImportarSI
    },

  data: function() {
    return {
      erroValidacao: false,
      mensagensErro: [],
      valid: false,
      dialog: false,
      simNao: ["Sim","Não"],
      importarSI: false,
      myhelp: help,


    };
  },

  created: async function() {
  },

  methods: {

    newSistemasRelacionados: function(sistema, lista) {
        lista.push(sistema);
    },

    unselectSistemasRelacionados: function(sistema) {
      // Recoloca o sistema nos selecionáveis
      this.ppd.listaSistemasInfoAuxiliar.push(sistema);
      var index = this.ppd.si.avaliacao.sistemasRelacionados.findIndex(e => e.numeroSI === sistema.numeroSI);
      this.ppd.si.avaliacao.sistemasRelacionados.splice(index, 1);
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
        this.mensagensErro.push("O insourcing não pode ficar sem escolha!");
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
      if(/*this.validaAll("O campo número do SI",this.ppd.si.numeroSI) &&
        this.validaAll("O campo  nome do SI",this.ppd.si.nomeSI) &&
        this.validaAll("O campo administrador do sistema",this.ppd.si.identificacao.adminSistema) &&
        this.validaAll("O campo administrador de dados",this.ppd.si.identificacao.adminDados) &&
        this.validaAll("O campo proprietário do SI - entidade pública",this.ppd.si.identificacao.propSistemaPublico) &&
        this.validaAll("O campo proprietário do SI - entidade privada",this.ppd.si.identificacao.propSistemaPrivado) &&
        this.validaAll("O campo proprietário dos dados",this.ppd.si.identificacao.propDados) &&
        this.validaAll("O campo localização dos dados - entidade pública",this.ppd.si.identificacao.localDadosPublico) &&
        this.validaAll("O campo localização dos dados - entidade privada",this.ppd.si.identificacao.localDadosPrivado) &&
        this.validaDef(this.ppd.si.identificacao.defResponsavel, this.ppd.si.identificacao.defCheck) &&
        this.validaInsourcing(this.ppd.si.identificacao.insourcing, this.ppd.si.identificacao.insourcingCheck) &&
        this.validaOutsourcing(this.ppd.si.identificacao.outsourcing, this.ppd.si.identificacao.outsourcingCheck) &&
        this.validaAll("O campo notas", this.ppd.si.identificacao.notas) &&
        this.validaAll("O campo de utilizadores",this.ppd.si.identificacao.userList)*/1
      ){
        var sistema = {
          numeroSI: this.ppd.si.numeroSI,
          nomeSI: this.ppd.si.nomeSI,
          adminSistema: this.ppd.si.identificacao.adminSistema,
          adminDados: this.ppd.si.identificacao.adminDados,
          propSistemaPublico: this.ppd.si.identificacao.propSistemaPublico,
          propSistemaPrivado: this.ppd.si.identificacao.propSistemaPrivado,
          propDados: this.ppd.si.identificacao.propDados,
          localDadosPublico: this.ppd.si.identificacao.localDadosPublico,
          localDadosPrivado: this.ppd.si.identificacao.localDadosPrivado,
          userList: this.ppd.si.identificacao.userList,
          defResponsavel: this.ppd.si.identificacao.defResponsavel,
          expressaoResponsavel:this.ppd.si.identificacao.expressaoResponsavel,
          insourcing: this.ppd.si.identificacao.insourcing,
          outsourcing: this.ppd.si.identificacao.outsourcing,
          notas: this.ppd.si.identificacao.notas,
        };
        this.ppd.si.numeroSI= "";
        this.ppd.si.nomeSI= "";
        this.ppd.si.identificacao.adminSistema= [];
        this.ppd.si.identificacao.adminDados= [];
        this.ppd.si.identificacao.propSistemaPublico= [];
        this.ppd.si.identificacao.propSistemaPrivado= "";
        this.ppd.si.identificacao.propDados= [];
        this.ppd.si.identificacao.localDadosPublico= [];
        this.ppd.si.identificacao.localDadosPrivado= "";
        this.ppd.si.identificacao.userList= [];
        this.ppd.si.identificacao.defResponsavel= "";
        this.ppd.si.identificacao.expressaoResponsavel="";
        this.ppd.si.identificacao.insourcing= "";
        this.ppd.si.identificacao.outsourcing= "";
        this.ppd.si.identificacao.notas= "";
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
