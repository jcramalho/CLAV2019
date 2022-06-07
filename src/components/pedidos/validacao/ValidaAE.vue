<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row v-if="campo == 'legislacao' || campo == 'responsavel' || campo == 'entidades' || campo == 'classes'" dense class="ma-1">
          <v-col cols="2">
            <div
              :key="`${novoHistorico[campo].cor}${animacoes[campo]}`"
              class="info-descricao"
              :class="`info-descricao-${novoHistorico[campo].cor}`"
            >
              {{ transformaKeys(campo) }}
            </div>
          </v-col>

          <v-col> 
            <div v-if="!(info instanceof Array)" class="info-conteudo">
              <span v-if="info === '' || info === null">
                [Campo não preenchido na submissão do pedido]
              </span>
              <span v-else>{{ info }}</span>
            </div>

            <div v-else class="info-conteudo">
              <span v-if="campo === 'entidades'">{{ formatarEntidades(info) }}</span>
              <div v-if="campo === 'classes'">
                <v-list dense color="secondary">
                  <v-list-group
                    v-for="(item, iter) in info"
                    :key="iter"
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title
                          v-if="item.codigo && item.referencia"
                          v-text="item.codigo + ', ' + item.referencia"
                        ></v-list-item-title>
                        <v-list-item-title 
                          v-else-if="item.codigo" 
                          v-text="item.codigo"
                        ></v-list-item-title>
                        <v-list-item-title 
                          v-else 
                          v-text="item.referencia"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item-content>

                      <v-list-item-title> 
                        <div v-for="(atrib, index) in item" :key="index">
                          <v-row v-if="checkIf(atrib,index)">
                            <v-col cols="2">
                              <div
                                  :key="`${novoHistorico[campo].cor}${animacoes[campo]}`"
                                  class="info-descricao"
                                  :class="`info-descricao-${novoHistorico[campo].cor}`"
                              >
                                {{ nomes[index] }}
                              </div>
                            </v-col>
                            <v-col>
                              <div class="info-conteudo">
                                <template>
                                  <v-col cols="auto">
                                    <v-row>
                                      <v-col cols="12" sm="7">
                                        <span> {{ atrib }}</span>
                                      </v-col>
                                      <v-col cols="12" sm="5" align="right">
                                        <!-- Operações -->
                                        <span v-if="!esconderOperacoesClasses[iter][index]">
                                          <v-icon class="mr-1" color="green" @click="verificaClasse(iter,index)"> check </v-icon>
                                          <v-icon class="mr-1" color="red" @click="anulaClasse(iter,index)"> clear </v-icon>
                                        </span>
                                        <v-icon class="mr-1" color="orange" v-if="checkMedicao(index)" @click="editaClasse(iter,index)"> create </v-icon>
                                        <v-icon @click="abrirNotaDialogClasse(iter,index)"> add_comment </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </template>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                        <div v-if="item.dono">
                          <v-row>
                            <v-col cols="2">
                              <div
                                  :key="`${novoHistorico[campo].cor}${animacoes[campo]}`"
                                  class="info-descricao"
                                  :class="`info-descricao-${novoHistorico[campo].cor}`"
                              >
                                Dono
                              </div>
                            </v-col>
                            <v-col>
                              <div class="info-conteudo">
                                <template>
                                  <v-col cols="auto">
                                    <v-row>
                                      <v-col cols="12" sm="7">
                                        <ul :class="{ 'is-collapsed': entCollapsed }">
                                          <li v-for="(l, index) in listaDonos[item.codigo]" v-bind:key="index">
                                            <a :href="'/entidades/ent_' + l">{{ l }}</a>
                                          </li>
                                        </ul>
                                        <a @click="entCollapsed = !entCollapsed" v-if="listaDonos[item.codigo].length > 6">
                                          <span v-if="entCollapsed" style="color:#283593;">Mostrar mais...</span>
                                          <span v-else style="color:#283593;">Mostrar menos...</span>
                                        </a>
                                      </v-col>
                                      <v-col cols="12" sm="5" align="right">
                                        <!-- Operações -->
                                        <span v-if="!esconderOperacoesClasses[iter]['dono']">
                                          <v-icon class="mr-1" color="green" @click="verificaClasse(iter,'dono')"> check </v-icon>
                                          <v-icon class="mr-1" color="red" @click="anulaClasse(iter,'dono')"> clear </v-icon>
                                        </span>
                                        <v-icon @click="abrirNotaDialogClasse(iter,'dono')"> add_comment </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </template>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                        <div class="ma-1" v-if="item.agregacoes && item.agregacoes.length > 0">
                          <v-row style="margin-top:10px" justify="space-between" class="info-label">
                            <v-col>Lista de Agregações</v-col>
                            <v-col>
                              <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Procura"
                                single-line
                                hide-details
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          
                          <v-data-table
                            :headers="cabecalho"
                            :items="item.agregacoes"
                            :items-per-page="5"
                            class="elevation-1 ml-2 mt-3"
                            :footer-props="footer_props"
                            :search="search"
                          >

                            <template v-slot:item ="{item, index}">
                              <tr :class="[item.valor ? 'style-valido' : 'style-anulado']">
                                <td>{{ item.codigoAgregacao }}</td>
                                <td>{{ item.titulo }}</td>
                                <td>{{ item.dataContagem }}</td>
                                <td>{{ item.ni }}</td>
                                <td>
                                  <v-icon color="green" @click="verificaAgregacao(iter, item)"> check </v-icon>
                                  <v-icon color="red" @click="anulaAgregacao(iter, item)"> clear </v-icon>
                                  <v-icon @click="abrirNotaDialogAgregacao(iter, item)"> add_comment </v-icon>
                                </td>
                              </tr>
                            </template>

                          </v-data-table>
                        </div>

                        
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-group>
                </v-list>
              </div>
            </div>
          </v-col>

          <!-- Operações -->
          <v-col v-if="campo != 'classes'" cols="auto">
            <span v-if="!esconderOperacoes[campo]">
              <v-icon class="mr-1" color="green" @click="verifica(campo)"> check </v-icon>
              <v-icon class="mr-1" color="red" @click="anula(campo)"> clear </v-icon>
            </span>
            <v-icon @click="abrirNotaDialog(campo)"> add_comment </v-icon>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-spacer />
        <PO
          operacao="Validar"
          :pedido="p"
          :options="o"
          :historico="novoHistorico"
          @avancarPedido="encaminharPedido($event)"
          @finalizarPedido="verificaEstadoCampos($event)"
          @devolverPedido="despacharPedido($event)"
        />
      </v-row>
    </div>

    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog.visivel" width="70%" persistent>
      <AdicionarNota
        :campo="notaDialog.campo"
        :notaAtual="notaDialog.nota"
        @fechar="notaDialog.visivel = false"
        @adicionar="adicionarNota($event)"
      />
    </v-dialog>

    <!-- Dialog de edição-->
    <v-dialog v-model="editaCampo.visivel" width="70%" persistent>
      <EditarCamposDialog
        :campo="editaCampo"
        :tipoPedido="p.objeto.tipo"
        @fechar="fechaEditaCampoDialog($event)"
        @editarCampo="editarCampo($event)"
      />
    </v-dialog>

    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>

    <!-- Dialog de confirmação de operação -->
    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="fechaDialogConfirmacao()"
        @confirma="finalizarPedido(dialogConfirmacao.dados)"
      />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import SelecionaAutocomplete from "@/components/pedidos/generic/SelecionaAutocomplete";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";

import Loading from "@/components/generic/Loading";
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";
import ErroDialog from "@/components/generic/ErroDialog";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";

import {
  comparaSigla,
  mapKeys,
  identificaItemAdicionado,
  adicionarNotaComRemovidos,
} from "@/utils/utils";

import { eNUV } from "@/utils/validadores";

export default {
  props: ["p", "o","tipo"],

  components: {
    PO,
    ErroAPIDialog,
    Loading,
    ErroDialog,
    SelecionaAutocomplete,
    EditarCamposDialog,
    AdicionarNota,
    ConfirmacaoOperacao,
  },

  data() {
    return {
      nomes: {codigo: "Código da Classe", 
              referencia: "Referência", 
              titulo: "Título", 
              dataInicio: "Ano de Início", 
              dataFim: "Ano de Fim", 
              numAgregacoes: "N.º de agregações", 
              medicaoPapel: "Medição das UI em papel", 
              medicaoDigital: "Medição das UI em digital", 
              medicaoOutro: "Medição noutros suportes" }, 

      entCollapsed: true,
      listaDonos: {},
      loading: true,
      
      search: "",
      cabecalho: [
        { text: "Código de Agregação", align: "left", value: "codigoAgregacao" },
        { text: "Título", align: "left", value: "titulo" },
        { text: "Ano", align: "left", value: "dataContagem" },
        { text: "Natureza de Intervenção", align: "left", value: "ni" },
        { text: "Ações", align: "left", value: "actions", sortable: false },
      ],
      footer_props: {
        "items-per-page-text": "Mostrar",
      },

      animacoes: {},
      animacoesClasses: {},
      animacoesAgregacoes: {},
      esconderOperacoes: {},
      esconderOperacoesClasses: {},
      esconderOperacoesAgregacoes: {},
      
      indexsAgregacoes: {},

      novoHistorico: {},
      classeEditada : 0,
      agregacaoEditada : 0,
      tipoEdicao: null,

      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },

      notaDialog: {
        visivel: false,
        campo: "",
        nota: "",
      },

      editaCampo: {
        visivel: false,
        nome: "",
        key: "",
        valorAtual: "",
      },

      erros: [],
      erroPedido: false,
      erroDialog: {
        visivel: false,
        mensagem: null,
      },

      conversorDeCor: {
        verde: "success",
        amarelo: "warning",
        vermelho: "error",
      },   
    };
  },

  computed: {
    dados() {
      return this.p.objeto.dados;
    },

    historico() {
      return this.p.historico;
    },
  },

  async created() {
    // Preencher array com os indexs das agregacoes
    for(var i = 0; i < this.p.objeto.dados.classes.length; i++) {
      this.indexsAgregacoes[i] = {}
      for(var j = 0; j < this.p.objeto.dados.classes[i].agregacoes.length; j++) {
        var cod = this.p.objeto.dados.classes[i].agregacoes[j]['codigoAgregacao']
        this.indexsAgregacoes[i][cod] = j
      }
    }

    await this.inicializarHistorico()
    this.loading = false;
    this.p.objeto.dados.classes.forEach(
      c => {
        if(c.dono) {
          this.listaDonos[c.codigo] = c.dono.split("#")
          if(!((/[a-zA-Z]+/).test(this.listaDonos[c.codigo][this.listaDonos[c.codigo].length - 1])))
            this.listaDonos[c.codigo].pop()
        }
      }
    )
  },

  mounted() {
    // Inicializar arrays "esconderOperacoes" e "animacoes"
    Object.keys(this.dados).forEach((key) => {
      this.esconderOperacoes[key] = false;
      this.animacoes[key] = true;
    });

    // Inicializar arrays "esconderOperacoes" e "animacoes" para as classes
    for(var i = 0; i < this.dados.classes.length; i++){
      this.esconderOperacoesClasses[i] = {}
      this.animacoesClasses[i] = {}
      Object.keys(this.dados.classes[i]).forEach((key) => {
        this.esconderOperacoesClasses[i][key] = false;
        this.animacoesClasses[i][key] = true;
      });
    }
  },

  methods: {
    async inicializarHistorico(){   
      const copiaHistorico = JSON.parse(JSON.stringify(this.historico[this.historico.length - 1]));

      // Reset nas notas 
      Object.keys(copiaHistorico).forEach((h) => (copiaHistorico[h].nota = null));

      // Reset nas notas das classes
      for(var i = 0; i < copiaHistorico.classes.dados.length; i++)
        Object.keys(copiaHistorico.classes.dados[i]).forEach((h) => (copiaHistorico.classes.dados[i][h].nota = null));

      // Reset nas notas das agregacoes
      for(var i = 0; i < copiaHistorico.classes.dados.length; i++)
        Object.keys(copiaHistorico.classes.dados[i].agregacoes.dados).forEach((h) => (copiaHistorico.classes.dados[i].agregacoes.dados[h].nota = null));
      
      this.novoHistorico = copiaHistorico;
    },

    checkIf(atrib, index) {
      if(atrib && index != "id" && index != "agregacoes" && index != "dono")
        return true
      else return false
    },

    checkMedicao(index) {
      if(index == "medicaoPapel" || index == "medicaoDigital" || index == "medicaoOutro")
        return true
      else return false
    },

    formatarEntidades(lista){
      var listaFormatada = ''
      for(var i=0; i < lista.length; i++){
        listaFormatada = listaFormatada + lista[i].entidade + " - " + lista[i].designacao + ", "
      }
      return listaFormatada.slice(0,-2)
    },

    transformaKeys(key) {
      return mapKeys(key);
    },

    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado = pedido.estado === "Apreciado" ? "Apreciado2v" : "Reapreciado2v";

        pedido.estado = estado;

        this.novoHistorico = adicionarNotaComRemovidos(
          this.historico[this.historico.length - 1],
          this.novoHistorico
        );

        pedido.historico.push(this.novoHistorico);

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email,
          },
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao distribuir o pedido, por favor tente novamente";
      }
    },
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;

        this.novoHistorico = adicionarNotaComRemovidos(
          this.historico[this.historico.length - 1],
          this.novoHistorico
        );

        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao devolver o pedido, por favor tente novamente";
      }
    },

    async validarTipologiaEntidade(dados) {
      let numeroErros = 0;

      // Designação
      if (eNUV(dados.designacao)) {
        this.erros.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio.",
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

      return numeroErros;
    },

    fechaDialogConfirmacao() {
      this.dialogConfirmacao = {
        visivel: false,
        mensagem: "",
        dados: null,
      };
    },

    async verificaEstadoCampos(dados) {
      // procura campos a vermelho
      const haVermelhos = Object.keys(this.novoHistorico).some(
        (key) => this.novoHistorico[key].cor === "vermelho"
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
      else await this.finalizarPedido(dados);
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let numeroErros = await this.validarTipologiaEntidade(pedido.objeto.dados);

        if (numeroErros === 0) {
          for (const key in pedido.objeto.dados) {
            if (pedido.objeto.dados[key] === null || pedido.objeto.dados[key] === "") {
              delete pedido.objeto.dados[key];
            }
          }

          await this.$request("post", "/tipologias", pedido.objeto.dados);

          const estado = "Validado";

          let dadosUtilizador = this.$verifyTokenUser();

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho,
          };

          pedido.estado = estado;

          this.novoHistorico = adicionarNotaComRemovidos(
            this.historico[this.historico.length - 1],
            this.novoHistorico
          );

          pedido.historico.push(this.novoHistorico);

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });

          this.$router.push(`/pedidos/finalizacao/${this.p.codigo}`);
        } else {
          this.erroPedido = true;
        }
      } catch (e) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({
                parametro: mapKeys(erro.param),
                mensagem: erro.msg,
              });
            });
          }
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
        }
      }
    },

    verifica(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "verde",
      };

      this.animacoes[campo] = !this.animacoes[campo];
    },

    anula(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "vermelho",
      };

      this.animacoes[campo] = !this.animacoes[campo];
    },

    edita(campo) {
      this.editaCampo = {
        visivel: true,
        nome: this.transformaKeys(campo),
        key: campo,
        valorAtual: this.dados[campo],
      };
    },

    adicionarNota(dados) {
      this.notaDialog.visivel = false;
      this.novoHistorico[dados.campo] = {
        ...this.novoHistorico[dados.campo],
        nota: dados.nota,
      };
    },

    abrirNotaDialog(campo) {
      this.notaDialog.visivel = true;
      this.notaDialog.campo = campo;
      if (this.novoHistorico[campo].nota !== undefined)
        this.notaDialog.nota = this.novoHistorico[campo].nota;
    },

    fechaEditaCampoDialog(campo) {
      this.editaCampo.visivel = false;
    },

    editarCampo(event) {
      this.editaCampo.visivel = false;

      this.dados[event.campo.key] = event.dados;
      this.novoHistorico[event.campo.key] = {
        ...this.novoHistorico[event.campo.key],
        dados: event.dados,
        cor: "amarelo",
      };

      this.esconderOperacoes[event.campo.key] = true;
      this.animacoes[event.campo.key] = !this.animacoes[event.campo.key];
    },

    fecharErro() {
      this.erros = [];
      this.erroPedido = false;
    },
  },
};
</script>

<style scoped>
.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-verde {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #ffe0b2; /* lighten-4 */
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
