<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      <v-icon color="white" class="ma-1">create</v-icon>
      Editar o campo:
      {{ campo.nome }}
    </v-card-title>

    <!-- Se o pedido for uma Entidade -->
    <v-card-text v-if="tipoPedido === 'Entidade'">
      <v-row v-if="campo.nome === 'Designação'">
        <v-col cols="2">
          <div class="info-label">
            Nome da Entidade
          </div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            color="indigo"
            single-line
            v-model="valorEditado"
            maxlength="150"
            label="Nome da Entidade"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.nome === 'Sigla'">
        <v-col cols="2">
          <div class="info-label">
            Sigla
          </div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            color="indigo"
            single-line
            v-model="valorEditado"
            maxlength="10"
            label="Sigla"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.nome === 'Internacional'">
        <v-col cols="2">
          <div class="info-label">Internacional</div>
        </v-col>
        <v-col>
          <v-select
            v-model="valorEditado"
            :items="['Sim', 'Não']"
            label="Selecione uma opção"
            item-color="indigo"
            color="indigo"
            filled
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.nome === 'SIOE'">
        <v-col cols="2">
          <div class="info-label">SIOE</div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            color="indigo"
            single-line
            v-model="valorEditado"
            :rules="regraSIOE"
            label="SIOE"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.nome === 'Data Criação'">
        <v-col cols="2">
          <div class="info-label">Data de criação</div>
        </v-col>
        <v-col>
          <SelecionarData
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="valorEditado = $event"
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.nome === 'Data Extinção'">
        <v-col cols="2">
          <div class="info-label">Data de extinção</div>
        </v-col>
        <v-col>
          <SelecionarData
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="valorEditado = $event"
          />
        </v-col>
      </v-row>
      <p>Teste</p>
    </v-card-text>

    <v-card-text v-if="tipoPedido === 'Tipologia'">
      {{ tipoPedido }}
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="fechar()">
        Cancelar
      </v-btn>

      <v-btn color="indigo accent-4 white--text" rounded @click="editar()">
        Editar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
export default {
  props: ["campo", "tipoPedido"],

  components: {
    SelecionarData,
  },

  data() {
    return {
      valorEditado: "",
    };
  },

  methods: {
    fechar() {
      this.$emit("fechar", this.campo.nome);
    },

    editar() {
      this.$emit("editarCampo", {
        dados: this.valorEditado,
        nome: this.campo.nome,
      });
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
