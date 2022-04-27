<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <Campo
          v-if="campo == 'legislacao' || campo == 'responsavel' || campo == 'entidades' || campo == 'classes'"
          :key="`${novoHistorico[campo].cor}${animacoes[campo]}`"
          :nome="transformaKeys(campo)"
          :color="conversorDeCor[novoHistorico[campo].cor] + ' lighten-1'"
        >
          <template v-slot:conteudo>
            <v-row dense>
              <v-col>
                <div v-if="!(info instanceof Array)">
                  <span v-if="info === '' || info === null">
                    [Campo não preenchido na submissão do pedido]
                  </span>
                  <span v-else>{{ info }}</span>
                </div>

                <div v-else>
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
                                <CampoAE
                                  v-if="checkIf(atrib,index)"
                                  :nome="nomes[index]"
                                  :infoHeader="nomes[index]"
                                  :key="`${novoHistorico.classes.dados[iter][index].cor}${animacoesClasses[iter][index]}`"
                                  :color="conversorDeCor[novoHistorico.classes.dados[iter][index].cor] + ' lighten-1'"
                                >
                                  <template v-slot:conteudo>
                                    <v-col cols="auto">
                                      <v-row>
                                        <v-col cols="12" sm="7">
                                          <span> {{ atrib }}</span>
                                        </v-col>
                                        <v-col cols="12" sm="5" align="right">
                                          <!-- Operações -->
                                          <span v-if="!esconderOperacoes[campo]">
                                            <v-icon class="mr-1" color="green" @click="verifica(index)"> check </v-icon>
                                            <v-icon class="mr-1" color="red" @click="anulaClasse(iter,index)"> clear </v-icon>
                                          </span>
                                          <v-icon class="mr-1" color="orange" v-if="checkMedicao(index)" @click="edita(campo)"> create </v-icon>
                                          <v-icon @click="abrirNotaDialog(campo)"> add_comment </v-icon>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </template>
                                </CampoAE>
                              </div>
                              
                              <CampoAE
                                v-if="item.dono"
                                nome="Dono"
                                infoHeader="Dono"
                                color="neutralpurple"
                              >
                                <template v-slot:conteudo>
                                  <ul class="info-content" :class="{ 'is-collapsed': entCollapsed }">
                                    <li v-for="(l, index) in listaDonos[item.codigo]" v-bind:key="index">
                                      <a :href="'/entidades/ent_' + l">{{ l }}</a>
                                    </li>
                                  </ul>
                                  <a @click="entCollapsed = !entCollapsed" v-if="listaDonos.length > 6">
                                    <span v-if="entCollapsed" style="color:#283593;"
                                    >Mostrar mais...</span>
                                    <span v-else style="color:#283593;">Mostrar menos...</span>
                                  </a>
                                </template>
                              </CampoAE>
                              
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
                                />
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
                <span>
                  <v-icon class="mr-1" color="green" @click="verifica(campo)"> check </v-icon>
                  <v-icon class="mr-1" color="red" @click="anula(campo)"> clear </v-icon>
                </span>
                <v-icon @click="abrirNotaDialog(campo)"> add_comment </v-icon>
              </v-col>
            </v-row>
          </template>
        </Campo>
      </div>

      <v-row>
        <v-spacer />
        <PO
          operacao="Analisar"
          @avancarPedido="encaminharPedido($event)"
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

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>

  </div>
</template>

<script>
import { criarHistorico } from "@/utils/utils";
import PO from "@/components/pedidos/generic/PainelOperacoes";
import SelecionaAutocomplete from "@/components/pedidos/generic/SelecionaAutocomplete";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";
import Campo from "@/components/generic/CampoCLAV";
import CampoAE from "@/components/generic/CampoAE";

import Loading from "@/components/generic/Loading";
import ErroDialog from "@/components/generic/ErroDialog";

import {
  comparaSigla,
  mapKeys,
  identificaItemAdicionado,
  adicionarNotaComRemovidos,
} from "@/utils/utils";

export default {
  props: ["p"],

  components: {
    PO,
    Loading,
    ErroDialog,
    SelecionaAutocomplete,
    EditarCamposDialog,
    AdicionarNota,
    Campo,
    CampoAE,
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

      search: "",
      cabecalho: [
        { text: "Código de Agregação", align: "left", value: "codigoAgregacao" },
        { text: "Título", align: "left", value: "titulo" },
        { text: "Ano", align: "left", value: "dataContagem" },
        { text: "Natureza de Intervenção", align: "left", value: "ni" },
      ],
      footer_props: {
        "items-per-page-text": "Mostrar",
      },

      animacoes: {},
      animacoesClasses: {},
      esconderOperacoes: {},
      notaDialog: {
        visivel: false,
        campo: "",
        nota: "",
      },
      novoHistorico: {},
      loading: false,
      editaCampo: {
        visivel: false,
        nome: "",
        key: "",
        valorAtual: "",
      },
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      entidadesHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center",
        },
      ],
      footerProps: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },

      mensagemAutocomplete: {
        titulo: "entidades",
        autocomplete: "entidades",
      },
      dialogEntidades: false,
      entidades: [],
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

  mounted() {
    // Inicializar o histórico 
    this.p.historico[0] = criarHistorico(this.p.objeto.dados)

    // Inicializar o histórico para as classes
    for(var i = 0; i < this.p.objeto.dados.classes.length; i++)
      this.p.historico[0].classes.dados[i]= criarHistorico(this.p.objeto.dados.classes[i])

    const copiaHistorico = JSON.parse(JSON.stringify(this.historico[this.historico.length - 1]));

    // Reset nas notas (?)
    Object.keys(copiaHistorico).forEach((h) => (copiaHistorico[h].nota = null));

    // Reset nas notas das classes
    for(var i = 0; i < copiaHistorico.classes.dados.length; i++)
      Object.keys(copiaHistorico.classes.dados[i]).forEach((h) => (copiaHistorico.classes.dados[i][h].nota = null));

    this.novoHistorico = copiaHistorico;

    // Inicializar arrays "esconderOperacoes" e "animacoes"
    Object.keys(this.dados).forEach((key) => {
      this.esconderOperacoes[key] = false;
      this.animacoes[key] = true;
    });

    // Inicializar arrays "esconderOperacoes" e "animacoes" para as classes
    this.esconderOperacoes["classes"] = []
    for(var i = 0; i < this.dados.classes.length; i++){
      this.esconderOperacoes["classes"][i] = {}
      this.animacoesClasses[i] = {}
      Object.keys(this.dados.classes[i]).forEach((key) => {
        this.esconderOperacoes["classes"][i][key] = false;
        this.animacoesClasses[i][key] = true;
      });
    }
  },

  created() {
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

  methods: {
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

    novoItemAdicionado(item, lista) {
      return identificaItemAdicionado(
        item,
        lista,
        this.historico[this.historico.length - 1]
      );
    },

    transformaKeys(key) {
      return mapKeys(key);
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

    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        var estado;
        if (pedido.estado === "Distribuído" || pedido.estado === "Redistribuído")
          dados.etapa === "Validação 1"
            ? (estado = "Apreciado")
            : (estado = "Apreciado2v");
        else
          dados.etapa === "Validação 1"
            ? (estado = "Reapreciado")
            : (estado = "Reapreciado2v");

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

    anulaClasse(iter,index) { //index da classe, parâmetro da classe
      this.novoHistorico.classes.dados[iter][index] = {
        ...this.novoHistorico.classes.dados[iter][index],
        cor: "vermelho",
      };
      this.animacoesClasses[iter][index] = !this.animacoesClasses[iter][index];
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
