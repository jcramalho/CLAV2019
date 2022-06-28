<template>
  <div>
    <DespachoAprovacao
      v-if="!!sumario"
      @criar="finalizarPedido"
      @devolver="devolverPedido"
      :sumario="sumario"
      :numeroDespacho="numeroDespacho"
      :options="options"
      :taskId="taskId"
    />
    <ConsultaPedido 
      v-if="idPed" 
      :idp="idPed" 
      :options="options"
      :taskId="taskId"
      @pedido_original="pedido = $event" 
    />

    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>
    <v-dialog v-model="showPedido">
      <span>{{pedido}}</span>
    </v-dialog>
  </div>
</template>

<script>
import ConsultaPedido from "@/components/pedidos/ConsultaPedido.vue"; // @ is an alias to /src
import DespachoAprovacao from "@/components/pedidos/DespachoAprovacao.vue";
import { converterParaTriplosRADA } from "@/utils/conversorTriplosRADA";
import ErroDialog from "@/components/generic/ErroDialog";
const { nanoid } = require("nanoid");


import CamundaRest from './../../services/camunda-rest.js';

export default {
  props: ["idPedido", "taskId", "options"],
  data() {
    return {
      showPedido: false,
      pedido: null,
      idPed: this.idPedido,
      sumario: null,
      erroDialog: {
        visivel: false,
        mensagem: null
      },
      numeroDespacho: null
    };
  },
  async created() {
     //ISTO NAO FUNCIONA...
     /*
    let res = await this.$request("get", "/contador/despacho");
    console.log(res)
    this.numeroDespacho = res.data.valor.toString() + "/" + new Date().getFullYear();
    console.log(this.numeroDespacho)
    */

    //ISTO FOI INVENTADO E TEM DE SER CORRIGIDO PORQUE A ROTA NÃO ESTAVA A FUNCIONAR
    let res = new Date().getMinutes();
    console.log(res)
    this.numeroDespacho = res.toString() + "/" + new Date().getFullYear();
    console.log(this.numeroDespacho)

    //new

    if (this.$route.path.split("/")[1]=='bpmn') {
      
      var id = await this.getID();

      console.log("id: " + id)

      const {data} = await this.$request("get", "/pedidos/" + id);

      this.pedido = data 
      this.idPed = data.codigo

      console.log("carreguei os dados! Despachar Pedido..")
      console.log(this.pedido)
      console.log("task id: " + this.taskId)
      console.log("task options: " + this.options)
    }
  },
  watch: {
    pedido(newValue) {
      switch (newValue.objeto.tipo) {
        case "TS Organizacional":
          this.sumario = newValue.objeto.dados.ts.designacao;
          break;
        case "TS Pluriorganizacional":
          this.sumario = newValue.objeto.dados.designacao;
          break;
        case "PPD":
          this.sumario = newValue.objeto.dados.geral.nomePPD;
          break;
        default:
          this.sumario = newValue.objeto.dados.titulo;
          break;
      }
    }
  },
  methods: {

    async getID() {
      var id = this.idPedido
      if (!id) {
        await CamundaRest.getTaskVariables(this.taskId, "pedido")
          .then((result) => {
            id = result.data.pedido.value.codigo
          })
      }
      return id
    },

    async criarDependentes(pedidos_dependencias) {
      try {
        for (let i = 0; i < pedidos_dependencias.length; i++) {
          if (!!pedidos_dependencias[i].sigla) {
            let novoEnt = {
              estado: "Ativa",
              designacao: pedidos_dependencias[i].designacao,
              internacional: pedidos_dependencias[i].internacional,
              sigla: pedidos_dependencias[i].sigla,
              sioe: pedidos_dependencias[i].sioe,
              tipologiasSel: pedidos_dependencias[i].tipologiasSel.map(
                tipologia => {
                  let tip = tipologia.split(" - ");
                  return {
                    sigla: tip[0],
                    designacao: tip[1],
                    id: "tip_" + tip[0]
                  };
                }
              ),
              dataCriacao: pedidos_dependencias[i].dataCriacao,
              dataExtincao: pedidos_dependencias[i].dataExtincao
            };

            await this.$request("post", "/entidades", novoEnt);
          } else {
            let novoLeg = {
              id: pedidos_dependencias[i].id,
              numero: pedidos_dependencias[i].numero,
              sumario: pedidos_dependencias[i].sumario,
              tipo: pedidos_dependencias[i].tipo,
              data: pedidos_dependencias[i].data,
              diplomaFonte: "RADA",
              dataRevogacao: "",
              estado: "Ativo",
              entidadesSel: pedidos_dependencias[i].entidadesSel,
              processosSel: []
            };

            if (!!pedidos_dependencias[i].link) {
              novoLeg["link"] = pedidos_dependencias[i].link;
            }

            await this.$request("post", "/legislacao", novoLeg);
          }
        }
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao criar as dependências!";
      }
    },

    async finalizarPedido(despacho) {
      let res;
      let despachoAprovacao;
      try {
        if (this.pedido.objeto.tipo === "RADA") {
          if (!!this.pedido.pedidos_dependentes[0]) {
            await this.criarDependentes(this.pedido.pedidos_dependentes);
          }

          res = await this.$request("get", "/contador/despacho");

          this.numeroDespacho =
            res.data.valor.toString() + "/" + new Date().getFullYear();

          console.log("vo buscar o nanoid")
          console.log("valor do nanoid: " + nanoid())

          despachoAprovacao = {
            id: "leg_" + nanoid(),
            numero: this.numeroDespacho,
            sumario: despacho.sumario,
            tipo: "Despacho",
            data: despacho.data,
            link: "/rada/" + this.pedido.objeto.dados.id,
            diplomaFonte: "RADA",
            dataRevogacao: "",
            estado: "Ativo",
            entidadesSel: [
              {
                sigla: "DGLAB",
                designacao:
                  "Direção-Geral do Livro, dos Arquivos e das Bibliotecas",
                id: "ent_DGLAB"
              }
            ],
            processosSel: []
          };

          //Isso faz com que tenhamos uma object property ou data property, tendo que se verificar na construção dos triplos;
          let responseSFC = await this.$request(
            "get",
            "/vocabularios/vc_pcaSubformaContagem"
          );

          let subformasContagem = responseSFC.data.map(item => {
            return {
              label: item.termo.split(": ")[1] + ": " + item.desc,
              value: item.idtermo.split("#")[1]
            };
          });

          let triplos = await converterParaTriplosRADA(
            this.pedido.objeto.dados,
            subformasContagem,
            despachoAprovacao.data,
            despachoAprovacao.id
          );

          await this.$request("post", "/rada", { triplos });
        } else if (this.pedido.objeto.tipo.includes("TS ")) {
          for (const key in this.pedido.objeto.dados) {
            if (
              this.pedido.objeto.dados[key] === undefined ||
              this.pedido.objeto.dados[key] === null ||
              this.pedido.objeto.dados[key] === ""
            ) {
              delete this.pedido.objeto.dados[key];
            }
          }

          despachoAprovacao = {
            id: "leg_" + nanoid(),
            numero: this.numeroDespacho,
            sumario: despacho.sumario,
            tipo: "Despacho",
            data: despacho.data,
            link: "/ts/",
            diplomaFonte: "TS/LC",
            dataRevogacao: "",
            estado: "Ativo",
            entidadesSel: [
              {
                sigla: "DGLAB",
                designacao:
                  "Direção-Geral do Livro, dos Arquivos e das Bibliotecas",
                id: "ent_DGLAB"
              }
            ],
            processosSel: []
          };

          let response = await this.$request("post", "/tabelasSelecao", {
            tabela: this.pedido,
            leg:despachoAprovacao.id
          });
          despachoAprovacao.link = despachoAprovacao.link.concat(response.data.id);
          this.pedido.objeto.dados.id = response.data.id
          res = await this.$request("get", "/contador/despacho");

          this.numeroDespacho =
            res.data.valor.toString() + "/" + new Date().getFullYear();


        }
        else if (this.pedido.objeto.tipo == 'PPD') {
          this.showPedido = true
        }

        await this.$request("post", "/legislacao", despachoAprovacao);

        let dadosUtilizador = this.$verifyTokenUser();

        let novaDistribuicao = {
          estado: "Validado",
          responsavel: dadosUtilizador.email,
          data: new Date()
        };

        if (!!despacho.mensagem) {
          novaDistribuicao["despacho"] = despacho.mensagem;
        }

        this.pedido.estado = "Validado";

        await this.$request("put", "/pedidos", {
          pedido: this.pedido,
          distribuicao: novaDistribuicao
        });

        await this.$request("put", "/contador/despacho");

        this.$router.push(`/pedidos/finalizacao/${this.idPed}`);
        
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao finalizar o pedido!";
      }
    },
    async devolverPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Devolvido",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        this.pedido.estado = "Devolvido";

        await this.$request("put", "/pedidos", {
          pedido: this.pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao devolver o pedido!";
      }
    }
  },
  components: {
    ConsultaPedido,
    DespachoAprovacao,
    ErroDialog
  }
};
</script>
