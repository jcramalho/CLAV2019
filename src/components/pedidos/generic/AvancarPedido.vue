<template>
  <v-card v-if="ped">
    <v-card-title class="clav-linear-background white--text">
      <span>{{ text.textoTitulo }} do pedido {{ ped }}</span>
      <v-spacer></v-spacer>
      <unicon name="participacao-icon" width="25" height="25" fill="white" />
    </v-card-title>

    <v-card-text v-if="!utilizadorSelecionado">
      <v-text-field
        filled
        v-model="procuraUtilizador"
        append-icon="search"
        label="Procurar utilizador"
        single-line
        hide-details
      />

      <v-data-table
        :headers="usersHeaders"
        :items="users"
        :items-per-page="5"
        :search="procuraUtilizador"
        :footer-props="footerProps"
      >
        <template v-slot:no-data>
          <v-alert type="error" width="50%" class="m-auto mb-2 mt-2" outlined>
            Não existem utilizadores para selecionar...
          </v-alert>
        </template>

        <template v-slot:no-results>
          <v-alert type="info" width="50%" class="m-auto mb-2 mt-2" outlined>
            Sem resultados para "<strong>{{ procuraUtilizador }}</strong
            >".
          </v-alert>
        </template>

        <template v-slot:item="props">
          <tr @click="utilizadorSelecionado = props.item">
            <td class="subheading">{{ props.item.name }}</td>
            <td class="subheading">
              {{ props.item.entidade.split("_")[1] }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert type="info">
        Clique sobre a linha da tabela para selecionar o utilizador a quem deve ser
        atribuída a {{ text.textoAlert }} do pedido {{ ped }}.
      </v-alert>
    </v-card-text>

    <v-card-text v-else>
      <v-tabs
        v-if="
          pedidoInfo.estado !== 'Submetido' &&
          pedidoInfo.estado !== 'Ressubmetido' &&
          pedidoInfo.estado !== 'Apreciado' &&
          pedidoInfo.estado !== 'Apreciado2v' && 
          pedidoInfo.estado !== 'Em Despacho'
        "
        v-model="tab"
      >
        <v-tab v-for="t in tabs" :key="t">
          {{ t }}
        </v-tab>
      </v-tabs>
      <v-row class="my-2">
        <v-col>
          <!-- Menssagem -->
          <Campo nome="Mensagem" infoHeader="Mensagem" color="neutralpurple">
            <template v-slot:conteudo>
              <v-text-field
                hide-details
                dense
                v-model="mensagemDespacho"
                :label="`Mensagem de ${text.textoTitulo.toLowerCase()}`"
              />
            </template>
          </Campo>
        </v-col>
      </v-row>
      <v-alert type="success">
        Tarefa atribuída a
        <strong>
          {{
            `${this.utilizadorSelecionado.name} (${
              this.utilizadorSelecionado.entidade.split("_")[1]
            })`
          }}
        </strong>
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn v-if="this.$route.path.split('/')[1]=='bpmn' && options.includes('Cancelar')" color="error" text rounded dark @click="cancelar()"> Cancelar </v-btn>
      <v-btn v-else-if="this.$route.path.split('/')[1]!='bpmn'" color="error" text rounded dark @click="cancelar()"> Cancelar </v-btn>

      <v-btn 
        v-if="this.$route.path.split('/')[1]=='bpmn' && (options.includes('Distribuir') || options.includes('Reapreciar') || options.includes('Validação 1') || options.includes('Validação 2'))" 
        :disabled="!utilizadorSelecionado" 
        class="primary" 
        rounded 
        @click="atribuirPedido()"
      > 
          {{ text.textoBotao }} 
      </v-btn>
      
      <v-btn
        v-else-if="this.$route.path.split('/')[1]!='bpmn'"
        :disabled="!utilizadorSelecionado"
        color="primary"
        rounded
        @click="avancar()"
      >
        {{ text.textoBotao }}
      </v-btn>

    </v-card-actions>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";

import CamundaRest from './../../../services/camunda-rest.js';
import DataTransformation from './../../../utils/data-transformation';


export default {
  props: ["texto", "utilizadores", "pedido", "taskId", "options"],
  components: {
    Campo,
  },

  async created() {


    if (this.$route.path.split("/")[1]=='bpmn') {
      
      this.text = await this.getTexto()
      this.users = await this.getUtilizadores()
      this.historico = await this.getHistorico()
      var id = await this.getID();
      const {data} = await this.$request("get", "/pedidos/" + id);

      this.pedidoInfo = data
      this.ped = this.pedidoInfo.codigo 

      /* DEBUGGING */
      //console.log("carreguei os dados! Avançar Pedido..")
      //console.log(this.pedidoInfo)
      //console.log("task id: " + this.taskId)
      //console.log("task options: " + this.options) 
    }

    else {
      this.pedidoInfo = (await this.$request("get", "/pedidos/" + this.pedido)).data;
    }
  },

  data() {
    return {
      procuraUtilizador: null,
      utilizadorSelecionado: null,
      mensagemDespacho: null,
      tabs: ["Validação 1", "Validação 2"],
      tab: "Validação 1",
      usersHeaders: [
        { text: "Nome", value: "name", class: "title" },
        { text: "Entidade", value: "entidade", class: "title" },
      ],
      footerProps: {
        "items-per-page-text": "Utilizadores por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
      formdata: {
         "pedido": '',
         "opcao": '',
      },
      text: this.texto,
      users: this.utilizadores,
      historico: {},
      ped: this.pedido,
      pedidoInfo: this.pedido,
    };
  },

  methods: {

    submit() {
      const variables = DataTransformation.generateVariablesFromFormFields(this.formdata);
      CamundaRest.postCompleteTask(this.taskId, variables).then((result) => {
        if (result.status === 200 || result.status === 204) {
          this.$router.push({ path: '/bpmn/tasklist/' });
        }
      });
    },


    cancelar() {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'cancelar'
        this.submit()
      }
      else {
        this.utilizadorSelecionado = null;
        this.mensagemDespacho = null;
        this.procuraUtilizador = null;
        this.$emit("fecharDialog");
      }
    },

    async historicoToDados(pedido) {
      for (var key in this.historico) {
        if (this.historico[key].dados || this.historico[key].dados=="") pedido.objeto.dados[key] = this.historico[key].dados
        else {
          for (var key2 in this.historico[key]) {
            pedido.objeto.dados[key][key2] = this.historico[key][key2].dados
          }
        }
      }
      return pedido
    },

    async getID() {
      var id = this.idp
      if (!id) {
        await CamundaRest.getTaskVariables(this.taskId, "pedido")
          .then((result) => {
            id = result.data.pedido.value.codigo
          })
      }
      return id
    },

    async getTexto() {
      var id = null
      await CamundaRest.getTaskVariables(this.taskId, "texto")
        .then((result) => {
          id = result.data.texto.value
        })
      return id
    },

    async getHistorico() {
      var id = null
      await CamundaRest.getTaskVariables(this.taskId, "historico")
        .then((result) => {
          id = result.data.historico.value
        })
      return id
    },

    async getUtilizadores() {
      var id = null
      await CamundaRest.getTaskVariables(this.taskId, "utilizadores")
        .then((result) => {
          id = result.data.utilizadores.value
        })
      return id
    },

    avancar() {
      const despacho = {
        utilizadorSelecionado: this.utilizadorSelecionado,
      };

      if (
        this.pedidoInfo.estado !== "Submetido" &&
        this.pedidoInfo.estado !== "Ressubmetido"
      )
        despacho.etapa = this.tabs[this.tab];

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;

      this.$emit("avancarPedido", despacho);

      this.utilizadorSelecionado = false;
      this.mensagemDespacho = null;
      this.procuraUtilizador = null;
    },

    async atribuirPedido() {
      try {

        let pedido = JSON.parse(JSON.stringify(this.pedidoInfo));

        let dadosUtilizador = this.$verifyTokenUser();

        let estado = null

        if (pedido.estado === "Submetido" || pedido.estado === "Ressubmetido") estado = "Distribuído";
        else if (pedido.estado === "Distribuído" || pedido.estado === "Redistribuído") {
            this.tabs[this.tab] === "Validação 1" ? (estado = "Apreciado") : (estado = "Apreciado2v");
        }
        else if (pedido.estado === "Apreciado" || pedido.estado === "Apreciado2v" || pedido.estado === "Em Despacho") {
            this.options.includes("Reapreciar") ? estado = "Redistribuído" : estado = "Apreciado2v";
        }

        pedido.estado = estado;

        if (this.historico=="") pedido.historico.push(this.pedidoInfo.historico[0]);
        else pedido.historico.push(this.historico);

        pedido = await this.historicoToDados(pedido)
        
        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: this.utilizadorSelecionado.name,
            entidade: this.utilizadorSelecionado.entidade,
            email: this.utilizadorSelecionado.email,
          },
          data: new Date(),
          despacho: this.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.formdata.pedido = pedido;

        if (this.options.includes('Validação 1') || this.options.includes('Validação 2')) {
          this.tabs[this.tab]=='Validação 1' ? this.formdata.opcao = 'validacao1' : this.formdata.opcao = 'validacao2'
        }
        else {
          this.options.includes("Reapreciar") ? this.formdata.opcao = 'reapreciarPedido' : this.formdata.opcao = 'distribuirPedido'
        }

        this.submit()

      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style></style>
