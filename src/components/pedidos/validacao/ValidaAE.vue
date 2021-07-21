<template>
  <Loading v-if="loading" :message="'pedido'" />
  <div class="ma-5" v-else>
    <v-row v-if="dados.legislacao">
      <v-col cols="2">
        <div
          :class="[
            'info-descricao',
            `info-descricao-${novoHistorico.legislacao.cor}`,
          ]"
        >
          Fonte de Legitimação
        </div>
      </v-col>
      <v-col class="mt-3">
        {{ dados.legislacao }}
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="novoHistorico.legislacao.cor = 'verde'"
          >check</v-icon
        >
        <v-icon color="red" @click="novoHistorico.legislacao.cor = 'vermelho'"
          >clear</v-icon
        >
        <v-badge
          color="indigo darken-4"
          content="1"
          :value="!!novoHistorico.legislacao.nota"
          overlap
        >
          <v-icon @click="abrirNotaDialog('legislacao', -1)">
            add_comment
          </v-icon>
        </v-badge>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="2">
        <div
          :class="[
            'info-descricao',
            `info-descricao-${novoHistorico.referencial.cor}`,
          ]"
        >
          Referencial Classificativo
        </div>
      </v-col>
      <v-col class="mt-3">
        {{ dados.referencial.split("#")[0] }}
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="novoHistorico.referencial.cor = 'verde'"
          >check</v-icon
        >
        <v-icon color="red" @click="novoHistorico.referencial.cor = 'vermelho'"
          >clear</v-icon
        >
        <v-badge
          color="indigo darken-4"
          content="1"
          :value="!!novoHistorico.referencial.nota"
          overlap
        >
          <v-icon @click="abrirNotaDialog('referencial', -1)">
            add_comment
          </v-icon>
        </v-badge>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div
          :class="[
            'info-descricao',
            `info-descricao-${novoHistorico.fundo.cor}`,
          ]"
        >
          Fundo
        </div>
      </v-col>
      <v-col class="mr-2">
        <div v-for="(f, i) in dados.fundo" :key="i">
          <a :href="'/entidades/ent_' + f.split(' - ')[0]">{{ f }}</a>
        </div>
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="novoHistorico.fundo.cor = 'verde'"
          >check</v-icon
        >
        <v-icon color="red" @click="novoHistorico.fundo.cor = 'vermelho'"
          >clear</v-icon
        >
        <v-badge
          color="indigo darken-4"
          content="1"
          :value="!!novoHistorico.fundo.nota"
          overlap
        >
          <v-icon @click="abrirNotaDialog('fundo', -1)"> add_comment </v-icon>
        </v-badge>
      </v-col>
    </v-row>

    <v-expansion-panels popout>
      <v-expansion-panel class="ma-5">
        <v-expansion-panel-header
          class="pa-2 clav-linear-background title white--text"
          >Classes</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <v-list>
            <v-list-group
              v-for="(item, index) in dados.zonaControlo"
              :key="item.codigo"
              color="grey darken-1"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content
                  :class="[
                    'info-descricao',
                    `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                  ]"
                >
                  <v-list-item-title
                    v-if="item.codigo && item.referencia"
                    v-text="
                      item.codigo + ', ' + item.referencia + ' - ' + item.titulo
                    "
                  ></v-list-item-title>
                  <v-list-item-title
                    v-else-if="item.codigo"
                    v-text="item.codigo + ' - ' + item.titulo"
                  ></v-list-item-title>
                  <v-list-item-title
                    v-else
                    v-text="item.referencia + ' - ' + item.titulo"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item-content>
                <v-list-item-title class="wrap-text">
                  <table class="consulta mx-5">
                    <tr v-if="item.codigo">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Código da Classe
                        </div>
                      </td>
                      <td style="width: 70%">
                        {{ item.codigo }}
                      </td>
                      <td style="width: 10%">
                        <v-icon
                          color="green"
                          @click="
                            novoHistorico.zonaControlo.dados[index].cor =
                              'verde'
                          "
                          >check</v-icon
                        >
                        <v-icon
                          color="red"
                          @click="
                            novoHistorico.zonaControlo.dados[index].cor =
                              'vermelho'
                          "
                          >clear</v-icon
                        >
                        <v-badge
                          color="indigo darken-4"
                          content="1"
                          :value="
                            !!novoHistorico.zonaControlo.dados[index].nota
                          "
                          overlap
                        >
                          <v-icon
                            @click="abrirNotaDialog('zonaControlo', index)"
                          >
                            add_comment
                          </v-icon>
                        </v-badge>
                      </td>
                    </tr>
                    <tr v-if="item.referencia">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Referência
                        </div>
                      </td>
                      <td style="width: 70%">
                        {{ item.referencia }}
                      </td>
                      <td v-if="!item.codigo" style="width: 10%">
                        <v-icon
                          color="green"
                          @click="
                            colorSwitch++;
                            cores.zonaControlo[index] = '#C8E6C9';
                          "
                          >check</v-icon
                        >
                        <v-icon
                          color="red"
                          @click="
                            colorSwitch++;
                            cores.zonaControlo[index] = '#FFCDD2';
                          "
                          >clear</v-icon
                        >
                      </td>
                    </tr>
                    <tr v-if="item.titulo">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Título
                        </div>
                      </td>
                      <td style="width: 80%">
                        {{ item.titulo }}
                      </td>
                    </tr>
                    <tr v-if="item.prazoConservacao">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Prazo de Conservação Administrativa
                        </div>
                      </td>
                      <td style="width: 80%">
                        {{ item.prazoConservacao }}
                        <span v-if="item.prazoConservacao == '1'">Ano</span
                        ><span v-else>Anos</span>
                      </td>
                    </tr>
                    <tr v-if="item.notasPCA">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Notas do PCA
                        </div>
                      </td>
                      <td style="width: 80%">
                        {{ item.notasPCA }}
                      </td>
                    </tr>
                    <tr v-if="item.destino">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Destino final
                        </div>
                      </td>
                      <td v-if="item.destino === 'E'" style="width: 80%">
                        Eliminação
                      </td>
                      <td v-else-if="item.destino === 'C'" style="width: 80%">
                        Conservação
                      </td>
                      <td v-else style="width: 80%">
                        {{ item.destino }}
                      </td>
                    </tr>
                    <tr v-if="item.notaDF">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Nota do DF
                        </div>
                      </td>
                      <td style="width: 80%">
                        {{ item.notaDF }}
                      </td>
                    </tr>
                    <tr v-if="item.destino == 'CP' && item.justificaDF">
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Justificação do DF
                        </div>
                      </td>
                      <td style="width: 80%">
                        <span
                          v-for="(just, index) in item.justificaDF"
                          :key="index"
                          >{{ just }}</span
                        >
                      </td>
                    </tr>
                    <tr
                      v-if="
                        item.ni &&
                        (item.destino === 'C' || item.destino === 'Conservação')
                      "
                    >
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Natureza de intervenção
                        </div>
                      </td>
                      <td style="width: 80%">{{ item.ni }}</td>
                    </tr>
                    <tr
                      v-if="
                        item.dono &&
                        item.dono.length > 0 &&
                        (item.destino === 'C' || item.destino === 'Conservação')
                      "
                    >
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Donos do PN
                        </div>
                      </td>
                      <td style="width: 80%">
                        <li v-for="(d, i) in item.dono" :key="i">{{ d }}</li>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Data de Início
                        </div>
                      </td>
                      <td style="width: 80%">
                        {{ item.dataInicio }}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Data de Fim
                        </div>
                      </td>
                      <td style="width: 80%">{{ item.dataFim }}</td>
                    </tr>
                    <tr>
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          N.º de agregações
                        </div>
                      </td>
                      <td v-if="item.agregacoes.length == 0" style="width: 80%">
                        {{ item.nrAgregacoes }}
                      </td>
                      <td style="width: 80%" v-else>
                        {{ item.agregacoes.length }}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Medição das UI em papel (m.l.)
                        </div>
                      </td>
                      <td style="width: 70%" v-if="item.uiPapel">
                        {{ item.uiPapel }}
                      </td>
                      <td style="width: 70%" v-else>0</td>
                      <td style="width: 10%">
                        <v-icon
                          color="orange"
                          @click="
                            abrirEditor('Medição das UI em papel (m.l.)', index)
                          "
                          >create</v-icon
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Medição das UI em digital (Gb)
                        </div>
                      </td>
                      <td style="width: 70%" v-if="item.uiDigital">
                        {{ item.uiDigital }}
                      </td>
                      <td style="width: 70%" v-else>0</td>
                      <td style="width: 10%">
                        <v-icon
                          color="orange"
                          @click="
                            abrirEditor('Medição das UI em digital (Gb)', index)
                          "
                          >create</v-icon
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%">
                        <div
                          :class="[
                            'info-descricao',
                            `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                          ]"
                        >
                          Medição das UI noutros suportes
                        </div>
                      </td>
                      <td style="width: 70%" v-if="item.uiOutros">
                        {{ item.uiOutros }}
                      </td>
                      <td style="width: 70%" v-else>0</td>
                      <td style="width: 10%">
                        <v-icon
                          color="orange"
                          @click="
                            abrirEditor(
                              'Medição das UI noutros suportes',
                              index
                            )
                          "
                          >create</v-icon
                        >
                      </td>
                    </tr>
                  </table>

                  <div class="ma-1" v-if="item.agregacoes.length > 0">
                    <v-data-table
                      :headers="cabecalho"
                      :items="item.agregacoes"
                      :items-per-page="5"
                      class="elevation-1 mt-3"
                      :footer-props="footer_props"
                      :search="search"
                    >
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-row>
                            <v-col cols="3">
                              <div
                                :class="[
                                  'info-descricao',
                                  `info-descricao-${novoHistorico.zonaControlo.dados[index].cor}`,
                                ]"
                              >
                                Lista de Agregações
                              </div>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Procura"
                                single-line
                                hide-details
                              ></v-text-field
                            ></v-col>
                          </v-row>
                        </v-toolbar>
                      </template>
                      <template v-slot:item="prop">
                        <tr>
                          <td style="text-align: left">
                            {{ prop.item.codigo }}
                          </td>
                          <td style="text-align: left">
                            {{ prop.item.titulo }}
                          </td>
                          <td style="text-align: center">
                            {{ prop.item.dataContagem }}
                          </td>
                          <td style="text-align: center">{{ prop.item.ni }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row>
      <v-spacer />
      <v-btn
        @click="guardarPedido()"
        rounded
        class="mt-5 clav-linear-background accent-4 white--text"
        ><unicon name="guardar-icon" fill="#ffffff" />Guardar Trabalho</v-btn
      >
      <PO
        operacao="Validar"
        @finalizarPedido="verificaCores($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog.visivel" width="70%" persistent>
      <v-card>
        <v-card-title class="indigo darken-4 title white--text mb-4" dark>
          Nota relativa ao campo: {{ converteCampo(notaDialog.campo) }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Nota</div>
            </v-col>

            <v-col>
              <v-textarea
                clearable
                filled
                auto-grow
                color="indigo"
                v-model="notaDialog.nota"
                label="Nota"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-4"
            text
            rounded
            dark
            @click="notaDialog.visivel = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="indigo accent-4 white--text"
            rounded
            @click="adicionarNota()"
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog de Edição -->
    <v-dialog v-model="editar" width="60%" hide-overlay>
      <v-card>
        <v-card>
          <v-card-title class="primary darken-3 title white--text" dark>
            <span>Edição do campo: {{ editarCampo }}</span>
          </v-card-title>
          <v-card-text class="mt-4">
            <v-row class="ma-2">
              <v-text-field
                hint="Exemplo: 11.50"
                label="Insira a medição de UI"
                v-model="medicao"
                solo
                clearable
              />
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text color="red accent-4" @click="close()"> Voltar </v-btn>
            <v-btn class="indigo accent-4" dark @click="adicionar()">
              <span>Alterar</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>

    <!-- Dialog se existir erros no pedido à API -->
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>

    <v-dialog v-model="colorDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="orange darken-4 title white--text" dark
          >Campos por validar!</v-card-title
        >

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap">
            O Pedido de criação do Auto de Eliminação contem campos por validar,
            deseja continuar?
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="colorDialog = false"
            >Fechar</v-btn
          >
          <v-btn
            color="indigo darken-4"
            text
            @click="
              colorDialog = false;
              finalizarPedido(addDados);
            "
            >Continuar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="sucessDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="success darken-4 title white--text" dark
          >Auto de Eliminação adicionado com sucesso!</v-card-title
        >

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap">
            O Pedido de criação do Auto de Eliminação foi efetuado com
            sucesso...
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="$router.go(-1)"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogGuardado" width="50%" persistent>
      <v-card dark class="info-card">
        <v-card-title class="headline mb-2">
          Pedido guardado com sucesso!</v-card-title
        >
        <div class="info-content-card px-3 mx-6 mb-2">
          <v-card-text class="pa-2 px-4 font-weight-medium">
            <p>
              O seu pedido foi guardado com sucesso. Pode abandonar a página.
            </p>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-4"
            rounded
            dark
            elevation="0"
            class="px-4"
            @click="
              {
                dialogGuardado = false;
              }
            "
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";

import Loading from "@/components/generic/Loading";
import { mapKeys } from "@/utils/utils";

export default {
  props: ["p", "tipo"],

  components: {
    PO,
    ErroDialog,
    Loading,
  },

  data() {
    return {
      addDados: null,
      notaDialog: {
        visivel: false,
        campo: "",
        index: -1,
        nota: "",
      },
      novoHistorico: null,
      erros: [],
      erroPedido: false,
      dialogTipologias: false,
      dialogGuardado: false,
      sucessDialog: false,
      colorDialog: false,
      search: "",
      editar: false,
      editarCampo: "",
      editarIndex: 0,
      medicao: "",
      colorSwitch: 0,
      cabecalho: [
        { text: "Código", align: "left", sortable: false, value: "codigo" },
        { text: "Título", align: "left", value: "titulo" },
        { text: "Data de Contagem", align: "center", value: "dataContagem" },
        { text: "Natureza de Intervenção", align: "center", value: "ni" },
      ],
      footer_props: {
        "items-per-page-text": "Mostrar",
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
    const copiaHistorico = JSON.parse(
      JSON.stringify(this.historico[this.historico.length - 1])
    );

    //Object.keys(copiaHistorico).forEach((h) => (copiaHistorico[h].nota = null));

    this.novoHistorico = copiaHistorico;

    this.loading = false;
  },

  methods: {
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

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    verificaCores(dados) {
      var valida = true;
      if (
        this.novoHistorico.legislacao &&
        this.novoHistorico.legislacao.cor != "verde"
      )
        valida = false;
      else if (
        this.novoHistorico.referencial &&
        this.novoHistorico.referencial.cor != "verde"
      )
        valida = false;
      else if (
        this.novoHistorico.fundo &&
        this.novoHistorico.fundo.cor != "verde"
      )
        valida = false;
      else if (this.novoHistorico.zonaControlo) {
        for (var zc of this.novoHistorico.zonaControlo.dados)
          if (zc.cor != "verde") {
            valida = false;
            break;
          }
      }

      if (!valida) {
        this.addDados = dados;
        this.colorDialog = true;
      } else this.finalizarPedido(dados);
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        var numeroErros = 0;

        if (numeroErros > 0) {
          this.erroPedido = true;
        } else {
          for (const key in pedido.objeto.dados) {
            if (
              pedido.objeto.dados[key] === undefined ||
              pedido.objeto.dados[key] === null ||
              pedido.objeto.dados[key] === ""
            ) {
              delete pedido.objeto.dados[key];
            }
          }

          await this.$request("post", "/autosEliminacao", {
            auto: pedido.objeto.dados,
          });

          const estado = "Validado";

          let dadosUtilizador = this.$verifyTokenUser();

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho,
          };

          pedido.estado = estado;

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });
          this.sucessDialog = true;
        }
      } catch (e) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
          //console.log("e :", e);
        }
      }
    },

    async guardarPedido() {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.historico[pedido.historico.length - 1] = this.novoHistorico;

        const novaDistribuicao = {
          estado: pedido.estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.dialogGuardado = true;
      } catch (e) {
        //console.log("e :", e);
      }
    },

    close() {
      this.editar = false;
    },

    abrirEditor(campo, index) {
      this.editarCampo = campo;
      this.editarIndex = index;
      this.editar = true;
    },

    converteCampo(campo) {
      return mapKeys(campo);
    },

    abrirNotaDialog(campo, index) {
      this.notaDialog.visivel = true;
      this.notaDialog.campo = campo;
      this.notaDialog.index = index;
      if (index == -1) {
        if (this.novoHistorico[campo].nota !== undefined)
          this.notaDialog.nota = this.novoHistorico[campo].nota;
      } else {
        if (
          campo != "zonaControlo" &&
          this.novoHistorico[campo][index].nota !== undefined
        )
          this.notaDialog.nota = this.novoHistorico[campo][index].nota;
        else {
          this.notaDialog.nota = this.novoHistorico[campo].dados[index].nota;
        }
      }
    },

    adicionarNota() {
      if (
        this.notaDialog.index == -1 ||
        this.notaDialog.campo != "zonaControlo"
      ) {
        this.novoHistorico[this.notaDialog.campo].nota = this.notaDialog.nota;
      } else {
        if (this.notaDialog.campo != "zonaControlo")
          this.novoHistorico[this.notaDialog.campo][
            this.notaDialog.index
          ].nota = this.notaDialog.nota;
        else
          this.novoHistorico[this.notaDialog.campo].dados[
            this.notaDialog.index
          ].nota = this.notaDialog.nota;
      }

      this.notaDialog = {
        visivel: false,
        campo: "",
        index: -1,
        nota: "",
      };
    },

    fecharErro() {
      this.erroPedido = false;
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
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

.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
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
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  background-color: #ffe0b2; /* lighten-4 */
}
.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
}
</style>
