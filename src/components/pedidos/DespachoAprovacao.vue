<template>
  <div>
    <v-card class="ma-8">
      <v-card-title class="pa-2 indigo darken-4 title white--text"
        >Criação do Despacho<v-spacer />
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="2">
              <div class="info-label">Número</div>
            </v-col>

            <v-col>
              <v-text-field
                v-model="numeroDespacho"
                label="Número do Despacho"
                solo
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Súmario</div>
            </v-col>

            <v-col>
              <v-text-field
                :rules="[(v) => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="despacho.sumario"
                label="Súmario do Despacho"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-1">
            <v-col cols="2">
              <div class="info-label">Data do Diploma</div>
            </v-col>

            <v-col>
              <SelecionarData
                @dataSelecionada="despacho.data = $event"
                :label="'AAAA-MM-DD'"
                :dataMinima="new Date().toISOString()"
                :dataMaxima="new Date().toISOString()"
              >
                <template v-slot:default="slotProps">
                  <v-text-field
                    :rules="[
                      (v) => !!v || 'Campo de preenchimento obrigatório!',
                    ]"
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
          </v-row>
          <v-row class="mt-1">
            <v-col cols="2">
              <div class="info-label">Mensagem</div>
            </v-col>

            <v-col>
              <v-textarea
                solo
                hide-details
                color="indigo"
                label="Mensagem sobre o despacho"
                v-model="despacho.mensagem"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          v-if="path!='bpmn' || (path=='bpmn' && this.options.includes('Devolver Pedido'))"
          dark
          rounded
          class="red darken-4"
          @click="devolverPedido()"
        >
          Devolver
        </v-btn>

        <v-btn
         v-if="path!='bpmn' || (path=='bpmn' && this.options.includes('Aprovar Pedido'))"
          style="margin-left: 10px"
          color="indigo darken-4"
          dark
          rounded
          @click="despacharPedido()"
        >
          Despachar
          <v-icon right>check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog persistent v-model="devolverPedidoDialog" width="60%">
      <DevolverPedido
        @fecharDialog="devolverPedidoDialog = false"
        @devolverPedido="$emit('devolver', $event)"
      />
    </v-dialog>
  </div>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData.vue";
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";

import CamundaRest from './../../services/camunda-rest.js';
import DataTransformation from './../../utils/data-transformation';

export default {
  props: ["sumario", "numeroDespacho", "taskId", "options"],
  components: {
    SelecionarData,
    DevolverPedido,
  },
  data() {
    return {
      despacho: {
        data: null,
        mensagem: null,
        sumario: this.sumario,
      },
      formdata: {
        "opcao": ''
      },
      path: this.$route.path.split('/')[1],
      devolverPedidoDialog: false,
    };
  },
  methods: {
    criarDespacho() {
      if (this.$refs.form.validate()) {
        this.$emit("criar", this.despacho);
      }
    },

    devolverPedido() {
      if (this.path=='bpmn') {
        this.formdata.opcao = 'devolverPedido'
        this.submit()
      } 
      else {
        this.devolverPedidoDialog = true;
      }
    },

    despacharPedido() {
      if (this.path=='bpmn') {
        this.formdata.opcao = 'aprovarPedido'
        this.submit()
      } 
      else {
        this.criarDespacho();
      }
    },

    submit() {
      const variables = DataTransformation.generateVariablesFromFormFields(this.formdata);
      CamundaRest.postCompleteTask(this.taskId, variables).then((result) => {
        if (result.status === 200 || result.status === 204) {
          this.$router.push({ path: '/bpmn/tasklist/' });
        }
      });
    },
  },
};
</script>
