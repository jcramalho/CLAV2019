<template>
  <v-card class="ma-4" style="background-color:#fafafa">
    <v-card-title class="indigo darken-4 white--text">
      Criar Relatório de Avaliação de Documentação Acumulada
      <v-spacer />
      <v-btn style="background-color: #1a237e;" dark @click="toSave = true">
        Guardar Trabalho
        <v-icon right>save</v-icon>
      </v-btn>

      <v-icon dark color="red" @click="toDelete = true" right
        >delete_sweep</v-icon
      >
    </v-card-title>
    <v-card-text>
      <v-row justify-center>
        <v-dialog v-model="toSave" width="50%">
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >Pretende continuar o trabalho neste momento?</v-card-title>

            <v-card-text align="center">
              <br />
              <v-spacer></v-spacer>

              <v-btn
                class="ma-3 pa-3"
                color="indigo lighten-3"
                @click="guardarTrabalho('nao')"
              >Não, pretendo continuar depois</v-btn>
              <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="guardarTrabalho('sim')">Sim</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row>
        <v-dialog v-model="toDelete" width="50%">
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >Pretende mesmo eliminar o trabalho?</v-card-title>

            <v-card-text align="center">
              <br />
              <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
              <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarTrabalho">Sim</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <br />
      <v-alert :value="alert_guardar" outlined type="success" text dismissible border="left">
        <b>Trabalho guardado com sucesso!</b>
      </v-alert>
      <v-stepper v-model="e1" vertical class="elevation-0" style="background-color:#fafafa">
        <!-- Informação Geral -->
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1">
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral
            @seguinte="changeE1"
            :RADA="RADA"
            :entidades="entidades"
          />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2">
          <font size="4">
            <b>Relatório Expositivo</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="2">
          <RelatorioExpositivo
            @seguinte="changeE1"
            :RE="RADA.RE"
            :UIs="RADA.tsRada.UIs"
            :classes="RADA.tsRada.classes"
            :entidades="entidades"
            :entidadesProcessadas="entidadesProcessadas"
            :tipologias="tipologias"
          />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step color="amber accent-3" :key="3" :complete="e1 > 3" :step="3">
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada
            @done="concluir(obj._id)"
            @voltar="changeE1"
            :legislacao="legislacao"
            :RE="RADA.RE"
            :TS="RADA.tsRada"
            :entidades="entidades"
            :legislacaoProcessada="legislacaoProcessada"
            :loading_circle.sync="loading_circle_ts"
            :toSave.sync="toSave"
          />
          <v-alert
            width="100%"
            :value="!!erroProdutoras[0] || !!erros_relacoes[0] || !!erros_datas_uis[0]"
            outlined
            type="error"
            prominent
            border="left"
          >
            <div v-if="!!erroProdutoras[0]">
              <b>As seguintes tipologias/entidades produtoras não foram adicionadas a nenhuma série:</b>
              <ul>
                <li v-for="(produtora, i) in erroProdutoras" :key="i">{{produtora}}</li>
              </ul>
              <br />
            </div>
            <div v-if="!!erros_relacoes[0]">
              <b>As seguintes relações entre classes são inválidas devido às datas:</b>
              <ul>
                <li
                  v-for="(erro_rel, i) in erros_relacoes"
                  :key="i"
                >{{erro_rel[0] + " " + erro_rel[2].toLowerCase().trim() + " " + erro_rel[1] + ";"}}</li>
              </ul>
            </div>
            <div v-if="!!erros_datas_uis[0]">
              <b>As seguintes associações entre classes e unidades de instalação são inválidas devido às datas:</b>
              <ul>
                <li
                  v-for="(erro_uis, i) in erros_datas_uis"
                  :key="i"
                >{{"Classe " + erro_uis.codigoClasse + " e UI " + erro_uis.codigoUI + ";"}}</li>
              </ul>
            </div>
          </v-alert>
        </v-stepper-content>
      </v-stepper>
      <v-row justify-center>
        <v-dialog v-model="dialogRADAPendente" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline"
              >Trabalho pendente guardado</v-card-title
            >
            <v-card-text>
              <p>
                Os seus dados foram guardados para que possa retomar o trabalho
                mais tarde.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="$router.push('/pendentes')"
                >Fechar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import RelatorioExpositivo from "@/components/rada/criacao/RelatorioExpositivo.vue";
import TSRada from "@/components/rada/criacao/TSRadaManual.vue";
import InformacaoGeral from "@/components/rada/criacao/InformacaoGeral";

import mixin_criacao_rada from "@/mixins/rada/mixin_criacao_rada";

export default {
  props: ["obj"],
  components: {
    RelatorioExpositivo,
    TSRada,
    InformacaoGeral
  },
  mixins: [mixin_criacao_rada],
  data() {
    return {
      RADA: this.obj.objeto.rada
    };
  },

  methods: {
    //ATUALIZAR O PENDENTE
    guardarTrabalho(continuar_ou_nao) {
      let updatePendente = {
        _id: this.obj._id,
        objeto: {
          rada: this.RADA,
          entidades: this.entidades.filter(e => e.estado_no_sistema == "Nova"),
          legislacao: this.legislacao.filter(e => e.estado == "Nova")
        }
      };

      let response = this.$request("put", "/pendentes", updatePendente);

      response.then(resp => {
        if (continuar_ou_nao == "nao") {
          this.toSave = false;
          this.dialogRADAPendente = true;
        } else {
          this.toSave = false;
          this.alert_guardar = true;

          setTimeout(() => {
            this.alert_guardar = false;
          }, 5000);
        }
      });
    },

    //ELIMINAR O PENDENTE
    eliminarTrabalho() {
      this.$request("delete", "/pendentes/" + this.obj._id).then(response => {
        this.$router.push("/pendentes");
      });
    }
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}

.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  height: 35px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
