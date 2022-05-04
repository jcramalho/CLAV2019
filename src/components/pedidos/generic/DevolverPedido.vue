<template>
  <v-card>
    <v-card-title class="clav-linear-background white--text">
      Insira uma mensagem para devolução
      <v-spacer></v-spacer>
      <unicon
        name="devolver-icon"
        width="25"
        height="25"
        viewBox="0 0 20.71 12.943"
        fill="white"
      />
    </v-card-title>

    <v-card-text>
      <!-- Menssagem -->
      <Campo nome="Mensagem" infoHeader="Mensagem" color="neutralpurple">
        <template v-slot:conteudo>
          <v-text-field
            hide-details
            dense
            v-model="mensagemDespacho"
            label="Mensagem para devolução"
          />
        </template>
      </Campo>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="error" rounded text @click="cancelar()"> Cancelar </v-btn>
      <v-btn v-if="this.$route.path.split('/')[1]=='bpmn'" class="primary" rounded @click="devolvePedido()"> Devolver </v-btn>
      <v-btn v-else class="primary" rounded @click="despacho()"> Devolver </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";

import CamundaRest from './../../../services/camunda-rest.js';
import DataTransformation from './../../../utils/data-transformation';

export default {
  data() {
    return {
      mensagemDespacho: null,
      formdata: {
        "opcao": '',
      }
    };
  },
  components: {
    Campo,
  },

  props: ['taskId'],

  methods: {
    cancelar() {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'cancelar'
        this.submit()
      }
      else {
        this.mensagemDespacho = null;
        this.$emit("fecharDialog");
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

    despacho() {
      const despacho = {};

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;

      this.$emit("devolverPedido", despacho);

      this.mensagemDespacho = null;
    },

    async getPedido() {
      var id = null
      await CamundaRest.getTaskVariables(this.taskId, "pedido")
        .then((result) => {
          id = result.data.pedido.value
        })
      return id
    },

    async devolvePedido() {
      try {
        let ped = await this.getPedido()

        let pedido = JSON.parse(JSON.stringify(ped));

        let estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: this.mensagemDespacho,
        };

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.formdata.opcao = 'devolverPedido'
        this.submit()

      } catch (e) {
        console.log("Erro a devolver pedido: " + e)
      }
    },
  },
};
</script>

<style></style>
