<template>
  <div>
    <v-card>
    <v-card-title class="warning title white--text" dark>
      <v-icon color="white" class="ma-1">warning</v-icon>Aviso
    </v-card-title>
    <v-card-text>
      <v-container>
        <h4>Deseja mesmo finalizar o pedido?</h4>
        <div v-if="!vai_para_despacho">
          <br />
          <h6>
            Ao clicar em Sim está a introduzir toda a informação validada no
            sistema.
          </h6>
        </div>
      </v-container>

      <hr />

      <v-container>
        <v-row>
          <v-col cols="3">
            <div class="info-label">Despacho</div>
          </v-col>

          <v-col>
            <v-textarea
              solo
              hide-details
              color="indigo"
              label="Mensagem de despacho"
              v-model="mensagemDespacho"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" dark rounded text @click="cancelar()"
        >Não</v-btn
      >


      <v-btn v-if="this.$route.path.split('/')[1]=='bpmn'" class="indigo accent-4" rounded dark @click="verificaEstadoCampos(formdata.pedido)">Sim</v-btn>
      <v-btn v-else class="indigo accent-4" rounded dark @click="finalizarPedido()">Sim</v-btn
      >
    </v-card-actions>
    </v-card>


    <!-- Dialog de confirmação de operação -->
    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="fechaDialogConfirmacao()"
        @confirma="finalizar()"
      />
    </v-dialog>

  </div>

</template>

<script>

import CamundaRest from './../../../services/camunda-rest.js';
import DataTransformation from './../../../utils/data-transformation';

import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import { eNUV, eDataFormatoErrado, testarRegex } from "@/utils/validadores";

export default {
  props: ["vai_para_despacho", 'taskId'],
  components: {
    ConfirmacaoOperacao
  },
  data() {
    return {
      mensagemDespacho: null,
      formdata: {
        "opcao": ''
      },
      erros: [],
      historico: {},
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
    };
  },

  async created() {
    this.historico = await this.getHistorico()
    console.log("historico: " + this.historico)
  },

  methods: {
    cancelar() {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'cancelar'
        this.submit()
      }
      else {
        this.utilizadorSelecionado = null;
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

    fechaDialogConfirmacao() {
      this.dialogConfirmacao = {
        visivel: false,
        mensagem: "",
        dados: null,
      };
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

    async getHistorico() {
      var id = null
      await CamundaRest.getTaskVariables(this.taskId, "historico")
        .then((result) => {
          id = result.data.historico.value
        })
      return id
    },

    finalizarPedido() {
      const despacho = {};

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;
      
      this.$emit("finalizarPedido", despacho);
    },

    async validarEntidade(dados) {
      let numeroErros = 0;

      // Designação
      if (eNUV(dados.designacao)) {
        this.erros.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio.",
        });
        numeroErros++;
      }

      // Sigla
      if (eNUV(dados.sigla)) {
        this.erros.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia.",
        });
        numeroErros++;
      }

      // Internacional
      if (eNUV(dados.internacional)) {
        this.erros.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção.",
        });
        numeroErros++;
      }

      // SIOE
      if (!eNUV(dados.sioe)) {
        if (dados.sioe.length > 12) {
          this.erros.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
          });
          numeroErros++;
        } else if (!testarRegex(dados.sioe, /^\d+$/)) {
          this.erros.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE só pode ter digitos numéricos.",
          });
          numeroErros++;
        }
      }

      //Data Criação
      if (!eNUV(dados.dataCriacao)) {
        if (eDataFormatoErrado(dados.dataCriacao)) {
          this.erros.push({
            sobre: "Data de Criação",
            mensagem: "A data de criação está no formato errado",
          });
          numeroErros++;
        }
      }

      // Data de Extinção
      if (!eNUV(dados.dataCriacao) && !eNUV(dados.dataExtincao)) {
        if (new Date(dados.dataCriacao) >= new Date(dados.dataExtincao)) {
          this.erros.push({
            sobre: "Data de Extinçao",
            mensagem: "A data de extinção tem de ser superior à data de criação.",
          });
          numeroErros++;
        }
      }

      return numeroErros;
    },

    async verificaEstadoCampos(dados) {
      // procura campos a vermelho
      const haVermelhos = Object.keys(this.historico).some(
        (key) => this.historico[key].cor === "vermelho"
      );
      // Se existirem abre dialog de confirmação
      if (haVermelhos)
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem um ou mais campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados,
        };
      // Caso contrário segue para a finalização do pedido
      else await this.finalizar();
    },

    async finalizar() {
      try {

        var id = await this.getID();

        console.log("id: " + id)

        const { data } = await this.$request("get", "/pedidos/" + id);

        let pedido = data

        let estado = "Validado";

        let dadosUtilizador = this.$verifyTokenUser();

        let numeroErros = await this.validarEntidade(pedido.objeto.dados);

        if (numeroErros === 0) {
          
          for (const key in pedido.objeto.dados) {
            if (pedido.objeto.dados[key] === null || pedido.objeto.dados[key] === "") {
              delete pedido.objeto.dados[key];
            }
          }
          
          await this.$request("post", "/entidades", pedido.objeto.dados);
          
          if (pedido.objeto.dados.dataExtincao) {
            await this.$request(
              "put",
              `/entidades/ent_${pedido.objeto.dados.sigla}/extinguir`,
              { dataExtincao: pedido.objeto.dados.dataExtincao }
            );
          } 
          
          pedido.historico.push(this.historico);
          
          console.log(pedido.historico) 

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: this.mensagemDespacho,
          };

          console.log(novaDistribuicao)

          console.log("estado inicial: " + pedido.estado)

          pedido.estado = estado;

          console.log("estado final: " + pedido.estado)


          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });       

          console.log(pedido)


          this.formdata.opcao = 'aprovarPedido'
          this.submit()
    
          //this.$router.push(`/pedidos/finalizacao/${this.p.codigo}`)

        } else {
          console.log("Erros no pedido na hora de finalizar pedido: " + e)
        }
      } catch (e) {
        console.log("Erro a finalizar pedido: " + e)
      }
    },
  },
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
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
