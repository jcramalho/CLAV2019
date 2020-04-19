<template>
  <div>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Fonte de Legitimação:</div>
      </v-col>
      <v-col class="mt-3">{{ p.objeto.dados.ae.legislacao }}</v-col>
      <v-col cols="1">
        <v-icon color="green" @click="verifica(info)">check</v-icon>
        <v-icon color="red" @click="anula(info)">clear</v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Fundo:</div>
      </v-col>
      <v-col class="mt-3">
        <li v-for="(f,i) in p.objeto.dados.ae.fundo" :key="i">{{f}}</li>
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="verifica(info)">check</v-icon>
        <v-icon color="red" @click="anula(info)">clear</v-icon>
      </v-col>
    </v-row>

    <v-expansion-panels popout>
      <v-expansion-panel class="ma-1">
        <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">Classes</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-group
              v-for="item in p.objeto.dados.ae.zonaControlo"
              :key="item.codigo"
              color="grey darken-1"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content class="info-label">
                  <v-list-item-title
                    v-if="item.codigo && item.referencia"
                    v-text="
                          'Zona de Controlo - ' +
                            item.codigo +
                            ' ' +
                            item.referencia
                        "
                  ></v-list-item-title>
                  <v-list-item-title
                    v-else-if="item.codigo"
                    v-text="'Zona de Controlo - ' + item.codigo"
                  ></v-list-item-title>
                  <v-list-item-title v-else v-text="'Zona de Controlo - ' + item.referencia"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row v-if="item.codigo">
                    <v-col cols="4">
                      <div class="info-label">Código da class:</div>
                    </v-col>
                    <v-col class="mt-3">
                      <a
                        v-if="!item.referencia"
                        :href="'/classes/consultar/c' + item.codigo"
                      >{{ item.codigo }}</a>
                      <div v-else>{{ item.codigo }}</div>
                    </v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.referencia">
                    <v-col cols="4">
                      <div class="info-label">Referência:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.referencia }}</v-col>
                    <v-col cols="1" v-if="!item.codigo">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.titulo">
                    <v-col cols="4">
                      <div class="info-label">Título:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.titulo }}</v-col>
                  </v-row>
                  <v-row v-if="item.prazoConservacao">
                    <v-col cols="4">
                      <div class="info-label">Prazo de Conservação Administrativa:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.prazoConservacao }} Anos</v-col>
                  </v-row>
                  <v-row v-if="item.destino">
                    <v-col cols="4">
                      <div class="info-label">Destino Final:</div>
                    </v-col>
                    <v-col class="mt-3">
                      <span v-if="item.destino === 'E'">Eliminação</span>
                      <span v-else-if="item.destino === 'C'">Conservação</span>
                      <span v-else >{{ item.destino }}</span>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.ni">
                    <v-col cols="4">
                      <div class="info-label">Natureza de intervenção:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.ni }}</v-col>
                  </v-row>
                  <v-row v-if="item.dono">
                    <v-col cols="4">
                      <div class="info-label">Dono do PN:</div>
                    </v-col>
                    <v-col class="mt-3">
                      <li v-for="(d,i) in item.dono" :key="i">{{ d }}</li>
                    </v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Data de Início:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.dataInicio }}</v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Data de Fim:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.dataFim }}</v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.uiPapel">
                    <v-col cols="4">
                      <div class="info-label">Medição das UI em papel (m.l.):</div>
                    </v-col>
                    <v-col class="mt-3">
                      {{ item.uiPapel }}
                    </v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.uiDigital">
                    <v-col cols="4">
                      <div class="info-label">Medição das UI em digital (Gb):</div>
                    </v-col>
                    <v-col class="mt-3">
                      {{ item.uiDigital }}
                    </v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.uiOutros">
                    <v-col cols="4">
                      <div class="info-label">Medição das UI noutros suportes:</div>
                    </v-col>
                    <v-col class="mt-3">
                      {{ item.uiOutros }}
                    </v-col>
                    <v-col cols="1">
                      <v-icon color="green" @click="verifica(info)">check</v-icon>
                      <v-icon color="red" @click="anula(info)">clear</v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">N.º de agregações:</div>
                    </v-col>
                    <v-col class="mt-3">{{ item.agregacoes.length }}</v-col>
                  </v-row>
                  <div class="ma-1">
                    <v-row justify="space-between" class="info-label">
                      <v-col>Lista de Agregações</v-col>
                      <v-col class="mt-3">
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels> 
    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog se existir erros no pedido à API -->
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";

export default {
  props: ["p"],

  components: {
    PO,
    ErroDialog,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      dialogTipologias: false,
      search: "",
      cabecalho: [
        { text: "Código", align: "left", sortable: false, value: "codigo" },
        { text: "Título", align: "left", value: "titulo" },
        { text: "Data de Contagem", align: "center", value: "dataContagem" },
        { text: "Natureza de Intervenção", align: "center", value: "ni" }
      ],
      footer_props: {
        "items-per-page-text": "Mostrar"
      }
    };
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
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        var numeroErros = 0

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

          await this.$request("post", "/autosEliminacao",  {auto: pedido.objeto.dados.ae});

          const estado = "Validado";

          let dadosUtilizador = this.$verifyTokenUser();

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho,
          };

          pedido.estado = estado;
          pedido.token = this.$store.state.token;

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });

          this.$router.go(-1);
        }
      } catch (e) {
        this.erros.push({
          sobre: "Acesso à Ontologia",
          mensagem: "Ocorreu um erro ao aceder à ontologia.",
        });
        this.erroPedido = true;
        //console.log("e :", e);
      }
    },

    verifica(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "red lighten-3";
    },

    fecharErro() {
      this.erroPedido = false;
    },

    close() {
      this.dialogTipologias = false;
    },

    async validarEntidade(acao, dados) {
      let numeroErros = 0;

      // Designação
      if (
        (dados.designacao === "" || dados.designacao === null) &&
        acao === "Criação"
      ) {
        this.erros.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio.",
        });
        numeroErros++;
      } else if (acao === "Criação") {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/entidades/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            this.erros.push({
              sobre: "Nome da Entidade",
              mensagem: "Nome da entidade já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação.",
          });
        }
      }

      // Sigla
      if ((dados.sigla === "" || dados.sigla === null) && acao === "Criação") {
        this.erros.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia.",
        });
        numeroErros++;
      } else if (acao === "Criação") {
        try {
          let existeSigla = await this.$request(
            "get",
            "/entidades/sigla?valor=" + encodeURIComponent(dados.sigla)
          );
          if (existeSigla.data) {
            this.erros.push({
              sobre: "Sigla",
              mensagem: "Sigla já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da sigla.",
          });
        }
      }

      // Internacional
      if (dados.internacional === "" || dados.internacional === null) {
        this.erros.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção.",
        });
        numeroErros++;
      }

      // SIOE
      if (dados.sioe !== "" && dados.sioe !== null) {
        if (dados.sioe.length > 12) {
          this.erros.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
          });
          numeroErros++;
        }
      }

      return numeroErros;
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
</style>
