<template>
  <v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-col cols="12" xs="12" sm="3">
          <v-btn
            color="indigo darken-2"
            dark
            rounded
            v-bind="attrs"
            v-on="on"
          >
            Novo SI
            <v-icon dark right>add_circle_outline</v-icon>
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
              @click="newSistema()"
            >
              Guardar
            </v-btn>
          </v-toolbar-items>
        </v-app-bar>
        <v-sheet id="scrolling" class="overflow-y-auto overflow-x-hidden" >
          <v-container style="height: 70px;"></v-container>
          <v-row >
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Número de referência SI</div>
            </v-col>
            <v-col cols="12" xs="12" sm="8">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="ppd.identificacao.numeroSI"
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
                v-model="ppd.identificacao.nomeSI"
                label="Designação oficial do sistema"
                solo
                clearable
              ></v-text-field>
            </v-col>
            <v-expansion-panels>
              <!-- BLOCO IDENTIFICAÇÃO -->
              <BlocoIdentificacao
                :c="ppd"
                :semaforos="semaforos"
                :sis="listaSistema"
                :entidadesReady="entidadesReady"
                :entidades="entidades"
              />
              <!-- BLOCO AVALIAÇÃO -->
              <BlocoAvaliacao
                :c="ppd"
              />
              <!-- BLOCO CARACTERIZAÇÃO -->
              <BlocoCaracterizacao
                :c="ppd"
              />
              <!-- BLOCO ESTRATÉGIA -->
              <BlocoEstrategia
                :c="ppd"
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
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import BlocoIdentificacao from "@/components/ppd/criacao/sistemaInformacao/BlocoIdentificacao.vue";
import BlocoAvaliacao from "@/components/ppd/criacao/sistemaInformacao/BlocoAvaliacao.vue";
import BlocoCaracterizacao from "@/components/ppd/criacao/sistemaInformacao/BlocoCaracterizacao.vue";
import BlocoEstrategia from "@/components/ppd/criacao/sistemaInformacao/BlocoEstrategia.vue";

//import InfoBox from "@/components/generic/infoBox.vue";


export default {
  props: ["ppd", "semaforos", "listaSistema", "sistema", "entidades", "entidadesReady"],

  components: {
  //    InfoBox,
    BlocoIdentificacao,
    BlocoAvaliacao,
    BlocoCaracterizacao,
    BlocoEstrategia
    },

  data: function() {
    return {
      listaTipos: [],
      erroValidacao: false,
      mensagensErro: [],
      valid: false,
      dialog: false,
      simNao: ["Sim","Não"],

      myhelp: help,

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
      if(this.validaAll("O campo número do SI",this.ppd.identificacao.numeroSI) &&
        this.validaAll("O campo  nome do SI",this.ppd.identificacao.nomeSI) &&
        this.validaAll("O campo administrador do sistema",this.ppd.identificacao.adminSistema) &&
        this.validaAll("O campo administrador de dados",this.ppd.identificacao.adminDados) &&
        this.validaAll("O campo proprietário do SI - entidade pública",this.ppd.identificacao.propSistemaPublico) &&
        this.validaAll("O campo proprietário do SI - entidade privada",this.ppd.identificacao.propSistemaPrivado) &&
        this.validaAll("O campo proprietário dos dados",this.ppd.identificacao.propDados) &&
        this.validaAll("O campo localização dos dados - entidade pública",this.ppd.identificacao.localDadosPublico) &&
        this.validaAll("O campo localização dos dados - entidade privada",this.ppd.identificacao.localDadosPrivado) &&
        this.validaDef(this.ppd.identificacao.defResponsavel, this.ppd.identificacao.defCheck) &&
        this.validaInsourcing(this.ppd.identificacao.insourcing, this.ppd.identificacao.insourcingCheck) &&
        this.validaOutsourcing(this.ppd.identificacao.outsourcing, this.ppd.identificacao.outsourcingCheck) &&
        this.validaAll("O campo notas", this.ppd.identificacao.notas) &&
        this.validaAll("O campo de utilizadores",this.ppd.identificacao.userList)
      ){
        var sistema = {
          numeroSI: this.ppd.identificacao.numeroSI,
          nomeSI: this.ppd.identificacao.nomeSI,
          adminSistema: this.ppd.identificacao.adminSistema,
          adminDados: this.ppd.identificacao.adminDados,
          propSistemaPublico: this.ppd.identificacao.propSistemaPublico,
          propSistemaPrivado: this.ppd.identificacao.propSistemaPrivado,
          propDados: this.ppd.identificacao.propDados,
          localDadosPublico: this.ppd.identificacao.localDadosPublico,
          localDadosPrivado: this.ppd.identificacao.localDadosPrivado,
          userList: this.ppd.identificacao.userList,
          defResponsavel: this.ppd.identificacao.defResponsavel,
          expressaoResponsavel:this.ppd.identificacao.expressaoResponsavel,
          insourcing: this.ppd.identificacao.insourcing,
          outsourcing: this.ppd.identificacao.outsourcing,
          notas: this.ppd.identificacao.notas,
        };
        this.ppd.identificacao.numeroSI= "";
        this.ppd.identificacao.nomeSI= "";
        this.ppd.identificacao.adminSistema= [];
        this.ppd.identificacao.adminDados= [];
        this.ppd.identificacao.propSistemaPublico= [];
        this.ppd.identificacao.propSistemaPrivado= "";
        this.ppd.identificacao.propDados= [];
        this.ppd.identificacao.localDadosPublico= [];
        this.ppd.identificacao.localDadosPrivado= "";
        this.ppd.identificacao.userList= [];
        this.ppd.identificacao.defResponsavel= "";
        this.ppd.identificacao.expressaoResponsavel="";
        this.ppd.identificacao.insourcing= "";
        this.ppd.identificacao.outsourcing= "";
        this.ppd.identificacao.notas= "";
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
