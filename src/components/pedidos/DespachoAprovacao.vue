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
              <template v-slot:append> 
                <p>OLA</p>
              </template>
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
          dark
          rounded
          class="red darken-4"
          @click="devolverPedidoDialog = true"
        >
          Devolver
        </v-btn>
        <v-btn
          style="margin-left: 10px"
          color="indigo darken-4"
          dark
          rounded
          @click="criarDespacho"
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

export default {
  props: ["sumario", "numeroDespacho"],
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
      devolverPedidoDialog: false,
    };
  },
  methods: {
    criarDespacho() {
      if (this.$refs.form.validate()) {
        this.$emit("criar", this.despacho);
      }
    },
  },
};
</script>
