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


    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>

  </div>

</template>

<script>

import CamundaRest from './../../../services/camunda-rest.js';
import DataTransformation from './../../../utils/data-transformation';

import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import { eNUV, eNV,  eDataFormatoErrado, testarRegex } from "@/utils/validadores";
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";

import nanoid from "nanoid";

export default {
  props: ["vai_para_despacho", 'taskId'],
  components: {
    ConfirmacaoOperacao,
    ErroAPIDialog
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
      erroPedido: false,
      validators: [
        //ENTIDADE CRIAÇÃO
        {
        "nome": 'Entidade',
        "tipo": 'Criação',
        "validar": [
          {
            "value": "designacao",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Nome da Entidade", 
            "mens": "O nome da entidade não pode ser vazio.", 
          },
          {
            "value": "sigla",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Sigla", 
            "mens": "A sigla não pode ser vazia.", 
          },
          {
            "value": "internacional",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Internacional", 
            "mens": "O campo internacional tem de ter uma opção.", 
          },
          {
            "value": "sioe",
            "func": 'valSIOE',
            "func2": 'eNUV',
            "sob": "SIOE", 
            "mens": "O campo SIOE tem de ter menos que 12 digitos numéricos.", 
            "mens2": "O campo SIOE só pode ter digitos numéricos.", 
            "regex": /^\d+$/,
            "max": 12
          },
          {
            "value": "dataCriacao",
            "func": 'valDataCriacao',
            "func2": 'eNUV',
            "sob": "Data de Criação", 
            "mens": "A data de criação está no formato errado.", 
          },
          {
            "value": "dataCriacao",
            "value2": "dataExtincao",
            "func": 'valDataExtincao',
            "func2": 'eNUV',
            "sob": "Data de Extinçao", 
            "mens": "A data de extinção tem de ser superior à data de criação.", 
          }]
        },


        //ENTIDADE ALTERAÇÃO
        {
        "nome": 'Entidade',
        "tipo": 'Alteração',
        "validar": [
         {
            "value": "designacao",
            "func": 'val',
            "func2": 'eNV',
            "sob": "Nome da Entidade", 
            "mens": "O nome da entidade não pode ser vazio.", 
          },
          {
            "value": "internacional",
            "func": 'val',
            "func2": 'eNV',
            "sob": "Internacional", 
            "mens": "O campo internacional tem de ter uma opção.", 
          },
          {
            "value": "sioe",
            "func": 'valSIOE',
            "func2": 'eNUV',
            "func3": 'testarRegex',
            "sob": "SIOE", 
            "mens": "O campo SIOE tem de ter menos que 12 digitos numéricos.", 
            "mens2": "O campo SIOE só pode ter digitos numéricos.", 
            "regex": /^\d+$/,
            "max": 12
          },
          {
            "value": "dataCriacao",
            "func": 'valDataCriacao',
            "func2": 'eNUV',
            "sob": "Data de Criação", 
            "mens": "A data de criação está no formato errado.", 
          }]
        },


        //ENTIDADE EXTINÇÃO
        {
        "nome": 'Entidade',
        "tipo": 'Extinção',
        "validar": [
          {
            "value": "dataExtincao",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Data de Extinção", 
            "mens": "A data de extinção não pode ser vazia.", 
          },
          {
            "value": "dataExtincao",
            "func": 'valDataCriacao',
            "func2": 'eNUV',
            "sob": "Data de Extinção", 
            "mens": "A data de extinção está no formato errado.", 
          },
          {
            "value": "dataExtincao",
            "value2": "data",
            "func": 'valDataExtincao',
            "func2": 'eNUV',
            "sob": "Data de Extinçao", 
            "mens": "A data de extinção tem de ser superior à data do diploma.", 
          }]
        },


        //LEGISLAÇÃO CRIAÇÃO
        {
        "nome": 'Legislação',
        "tipo": 'Criação',
        "validar": [
         {
            "value": "tipo",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Tipo de Diploma", 
            "mens": "O tipo de diploma não pode ser vazio.", 
          },
          {
            "value": "numero",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Número de Diploma", 
            "mens": "O número de diploma não pode ser vazio.", 
          },
          {
            "value": "sumario",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Sumário", 
            "mens": "O sumário não pode ser vazio.", 
          },
          {
            "value": "dataCriacao",
            "func": 'val',
            "func2": 'eNV',
            "sob": "Data do Diploma", 
            "mens": "A data do diploma não pode ser vazia.", 
          },
          {
            "value": "dataRevogacao",
            "func": 'valDataCriacao',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de Revogação está no formato errado.", 
          },
          {
            "value": "dataCriacao",
            "func": 'valDataCriacao',
            "func2": 'eNV',
            "sob": "Data de Criação", 
            "mens": "A data de criação está no formato errado.", 
          },
          {
            "value": "data",
            "value2": "dataRevogacao",
            "func": 'valDataExtincao',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de revogação tem de ser superior à data do diploma.", 
          }]
        },


        //LEGISLAÇÃO ALTERAÇÃO
        {
        "nome": 'Legislação',
        "tipo": 'Alteração',
        "validar": [
          {
            "value": "sumario",
            "func": 'val',
            "func2": 'eNV',
            "sob": "Sumário", 
            "mens": "O sumário não pode ser vazio.", 
          },
          {
            "value": "dataRevogacao",
            "func": 'valDataCriacao',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de Revogação está no formato errado.", 
          },
          {
            "value": "data",
            "value2": "dataRevogacao",
            "func": 'valDataExtincao',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de revogação tem de ser superior à data do diploma.", 
          }]
        },


        //LEGISLAÇÃO REVOGAÇÃO
        {
        "nome": 'Legislação',
        "tipo": 'Revogação',
        "validar": [
          {
            "value": "dataRevogacao",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de revogação não pode ser vazia.", 
          },
          {
            "value": "dataRevogacao",
            "func": 'valDataCriacao',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de Revogação está no formato errado.", 
          },
          {
            "value": "data",
            "value2": "dataRevogacao",
            "func": 'valDataExtincao',
            "func2": 'eNUV',
            "sob": "Data de Revogação", 
            "mens": "A data de revogação tem de ser superior à data do diploma.", 
          }]
        },


        //TIPOLOGIA CRIAÇÃO
        {
        "nome": 'Tipologia',
        "tipo": 'Criação',
        "validar": [
          {
            "value": "designacao",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Nome da Entidade", 
            "mens": "O nome da entidade não pode ser vazio.", 
          },
          {
            "value": "sigla",
            "func": 'val',
            "func2": 'eNUV',
            "sob": "Sigla", 
            "mens": "A sigla não pode ser vazia.", 
          }]
        },


        //TIPOLOGIA ALTERAÇÃO
        {
        "nome": 'Tipologia',
        "tipo": 'Alteração',
        "validar": [
          {
            "value": "designacao",
            "func": 'val',
            "func2": 'eNV',
            "sob": "Nome da Entidade", 
            "mens": "O nome da entidade não pode ser vazio.", 
          }]
        }
      ]
    };
  },

  async created() {
    this.historico = await this.getHistorico()
    console.log("historico: " + JSON.stringify(this.historico))

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

    fecharErro() {
      this.erros = [];
      this.erroPedido = false;
    },

    async historicoToDados(pedido) {
      for (var key in this.historico) {
        pedido.objeto.dados[key] = this.historico[key].dados
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

    async getValidator(nome, tipo) {
      let validator = null

      this.validators.forEach(elem => {
        if (elem.nome == nome && elem.tipo == tipo) validator = elem.validar
      })

      return validator
    },

    //VALIDAR
    val(func, value, sob, mens, list, nErros) {
      if (func(value)) {
        list.push({
          sobre: sob,
          mensagem: mens
        })
        nErros++
      }
      return nErros
    },

    valSIOE(func, value, sob, mens, mens2, list, nErros, max, regex) {
      if (!func(value)) {
        if (value.length > max) {
          list.push({
            sobre: sob,
            mensagem: mens
          })
        }
        else if (!testarRegex(value, regex)) {
          list.push({
            sobre: sob,
            mensagem: mens2
          })
          nErros++
        }
      }
      return nErros
    },

    valDataCriacao(func, value, sob, mens, list, nErros) {
      if (!func(value)) {
        if (eDataFormatoErrado(value)) {
          list.push({
            sobre: sob,
            mensagem: mens
          })
          nErros++
        }
      }
      return nErros
    },

    valDataExtincao(func, value, value2, sob, mens, list, nErros) {
      if (!func(value) && !func(value2)) {
        if (new Date(value) >= new Date(value2)) {
          list.push({
            sobre: sob,
            mensagem: mens
          })
          nErros++
        }
      }
      return nErros 
    },


    async validar(dados) {

      let numeroErros = 0;
      let listaValidar = await this.getValidator(dados.tipo, dados.acao)
      
      let info = dados.dados

      listaValidar.forEach(elem => {
        
        if (elem.func == 'val' && elem.func2 == 'eNV') {
          numeroErros = this.val(eNV, info[elem.value], elem.sob, elem.mens, this.erros, numeroErros)
        }

        if (elem.func == 'val' && elem.func2 == 'eNUV') {
          numeroErros = this.val(eNUV, info[elem.value], elem.sob, elem.mens, this.erros, numeroErros)
        }

        if (elem.func == 'valSIOE' && elem.func2 == 'eNV') {
          numeroErros = this.valSIOE(eNV, info[elem.value], elem.sob, elem.mens, elem.mens2, this.erros, numeroErros, elem.max, elem.regex)
        }

        if (elem.func == 'valSIOE' && elem.func2 == 'eNUV') {
          numeroErros = this.valSIOE(eNUV, info[elem.value], elem.sob, elem.mens, elem.mens2, this.erros, numeroErros, elem.max, elem.regex)
        }

        if (elem.func == 'valDataCriacao' && elem.func2 == 'eNV') {
          if (info[elem.value]) numeroErros = this.valDataCriacao(eNV, info[elem.value], elem.sob, elem.mens, this.erros, numeroErros)
        }

        if (elem.func == 'valDataCriacao' && elem.func2 == 'eNUV') {
          if (info[elem.value]) numeroErros = this.valDataCriacao(eNUV, info[elem.value], elem.sob, elem.mens, this.erros, numeroErros)
        }

        if (elem.func == 'valDataExtincao' && elem.func2 == 'eNV') {
          if (info[elem.value]) numeroErros = this.valDataExtincao(eNV, info[elem.value], info[elem.value2], elem.sob, elem.mens, this.erros, numeroErros)
        }

        if (elem.func == 'valDataExtincao' && elem.func2 == 'eNUV') {
          if (info[elem.value]) numeroErros = this.valDataExtincao(eNUV, info[elem.value], info[elem.value2], elem.sob, elem.mens, this.erros, numeroErros)
        }
      })

      return numeroErros
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

        console.log(pedido.objeto)

        pedido = await this.historicoToDados(pedido)

        console.log("vou validar")

        let numeroErros = await this.validar(pedido.objeto)

        console.log("erros: " + numeroErros)

        if (numeroErros === 0) {
          
          for (const key in pedido.objeto.dadosOriginais) {

            if (!pedido.objeto.dados.hasOwnProperty(key)) {
              pedido.objeto.dados[key] = pedido.objeto.dadosOriginais[key];
            }

            if (eNV(pedido.objeto.dados[key])) {
              delete pedido.objeto.dados[key];
            }

            if (pedido.objeto.dados.diplomaFonte === "Não especificada")
              delete pedido.objeto.dados.diplomaFonte;
          }

          console.log("terminei o for")
          
          //ENTIDADES
          if (pedido.objeto.tipo == 'Entidade') {

            if (pedido.objeto.acao == 'Criação') await this.$request("post", "/entidades", pedido.objeto.dados);

            if (pedido.objeto.acao == 'Alteração') {
              await this.$request(
                "put",
                `/entidades/ent_${pedido.objeto.dadosOriginais.sigla}`,
                pedido.objeto.dados
              );
            }

            if (pedido.objeto.dados.dataExtincao && pedido.objeto.acao == 'Criação'|| pedido.objeto.acao == 'Extinção') {
              await this.$request(
                "put",
                `/entidades/ent_${pedido.objeto.dados.sigla}/extinguir`,
                { dataExtincao: pedido.objeto.dados.dataExtincao }
              );
            } 

          }

          //LEGISLAÇÃO
          if (pedido.objeto.tipo == 'Legislação') {
            
            console.log(pedido.objeto)

            if (pedido.objeto.acao == 'Criação') {

              console.log("vou buscar o nanoid")

              const id = `leg_${nanoid()}`;

              console.log("nanoid: " + id)

              pedido.objeto.dados.id = id;

              await this.$request(
                "post",
                "/legislacao",
                pedido.objeto.dados
              );

              if (pedido.objeto.dados.dataRevogacao) {
                await this.$request(
                  "put", 
                  `/legislacao/${id}/revogar`, 
                  { dataRevogacao: pedido.objeto.dados.dataRevogacao}
                );
              }
            }

          
            if (pedido.objeto.acao == 'Revogação') {

              await this.$request(
                "put",
                `/legislacao/${pedido.objeto.dadosOriginais.id}/revogar`,
                { dataRevogacao: pedido.objeto.dados.dataRevogacao }
              );

              let responseLeg = await this.$request(
                "get",
                "/legislacao/" + pedido.objeto.dadosOriginais.id
              );

              let legislacao = responseLeg.data;

              await this.$request(
                "put",
                "/rada/revogar/" +
                  legislacao.aprovou.split("#")[1].split("rada_")[1],
                { dataRevogacao: pedido.objeto.dados.dataRevogacao }
              );
            }

            if (pedido.objeto.acao == 'Alteração') {
              await this.$request(
                "put",
                `/legislacao/${pedido.objeto.dadosOriginais.id}`,
                pedido.objeto.dados
              );
            }
          }


          //TIPOLOGIAS
          if (pedido.objeto.tipo == 'Tipologia') {

            if (pedido.objeto.acao == 'Criação') await this.$request("post", "/tipologias", pedido.objeto.dados);

            else {
              await this.$request(
                "put",
                `/tipologias/tip_${pedido.objeto.dadosOriginais.sigla}`,
                pedido.objeto.dados
               );
            }
          
          }

          //GERAL

          let estado = "Validado";

          let dadosUtilizador = this.$verifyTokenUser();
          
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
          this.erroPedido = true;
          console.log("Erros no pedido na hora de finalizar pedido! Este contém " +numeroErros + " erros!")
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
