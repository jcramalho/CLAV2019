<template>
  <v-card class="ma-8">
    <v-card-title class="pa-2 green darken-5 title white--text"
      >Criação do despacho de aprovação<v-spacer />
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="2">
            <div class="info-label">Súmario do Despacho</div>
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
                  :rules="[(v) => !!v || 'Campo de preenchimento obrigatório!']"
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
            <div class="info-label">Data de revogação</div>
          </v-col>

          <v-col>
            <SelecionarData
              @dataSelecionada="despacho.dataRevogacao = $event"
              :label="'AAAA-MM-DD'"
              :dataFuturoInfinito="true"
            >
              <template v-slot:default="slotProps">
                <v-text-field
                  :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
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
        style="margin-left: 10px"
        color="indigo darken-4"
        dark
        @click="criarDespacho"
      >
        Finalizar Validação
        <v-icon right>check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData.vue";

export default {
  props: ["sumario"],
  components: {
    SelecionarData,
  },
  data() {
    return {
      despacho: {
        data: null,
        mensagem: null,
        sumario: this.sumario,
        dataRevogacao: null,
      },
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