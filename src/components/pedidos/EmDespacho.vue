<template>
  <div>
    <DespachoAprovacao
      v-if="!!sumario"
      @criar="finalizarPedido"
      @devolver="devolverPedido"
      :sumario="sumario"
      :numeroDespacho="numeroDespacho"
    />
    <ConsultaPedido :idp="idPedido" @pedido_original="pedido = $event" />
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
import { nanoid } from 'nanoid'

export default {
  props: ["idPedido"],
  data() {
    return {
      showPedido: false,
      pedido: null,
      sumario: null,
      erroDialog: {
        visivel: false,
        mensagem: null
      },
      numeroDespacho: null
    };
  },
  async created() {
    let res = await this.$request("get", "/contador/despacho");
    this.numeroDespacho = res.data.valor.toString() + "/" + new Date().getFullYear();
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
        case "Auto de Eliminação":
          this.sumario = "Auto de Eliminação";
          break;
        default:
          this.sumario = newValue.objeto.dados.titulo;
          break;
      }
    }
  },
  methods: {
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
      //alert(this.pedido.objeto.tipo)
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


        } else if (this.pedido.objeto.tipo == 'PPD') {
          //for (const key in this.pedido.objeto.dados) {
          //  if (
          //    this.pedido.objeto.dados[key] === undefined ||
          //    this.pedido.objeto.dados[key] === null ||
          //    this.pedido.objeto.dados[key] === ""
          //  ) {
          //    delete this.pedido.objeto.dados[key];
          //  }
          //}
          //alert(JSON.stringify(this.pedido.objeto))
          //alert(JSON.stringify(this.pedido.objeto.dados))
          this.showPedido = true
          //await this.$request("post", "/ppd/registar",  this.pedido.objeto.dados );
        } /*else if (this.pedido.objeto.tipo == 'Auto de Eliminação') {
          despachoAprovacao = {
            id: "leg_" + nanoid(),
            numero: this.numeroDespacho,
            sumario: despacho.sumario,
            tipo: "Despacho",
            data: despacho.data,
            link: "",
            diplomaFonte: this.pedido.objeto.dados.tipo.slice(3).replace("_","/"),
            dataRevogacao: "",
            estado: "Ativo",
            entidadesSel: [],
            processosSel: []
          };
        }*/
    
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

        this.$router.push(`/pedidos/finalizacao/${this.idPedido}`);
        
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
