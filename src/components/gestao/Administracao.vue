<template>
  <v-card flat class="pa-3">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="elevation-12">
          <v-card-title class="indigo accent-4 text-white"> Administração </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-card>
              <v-card-title class="indigo accent-4 text-white">
                Reload da cache do servidor
              </v-card-title>
              <v-card-text class="pa-5">
                <p>
                  Realiza o reload da cache do servidor API. Faz o reset das travessias
                  especiais, o reload da cache das classes, o reload da cache do índice de
                  pesquisa, o reload da cache da legislação, o reload da cache das
                  entidades e gera o ficheiro com toda a informação das classes.
                </p>
                <p class="font-weight-bold">
                  <span style="color: red">CUIDADO:</span> Pedido pesado que deve ser
                  apenas executado se houver alterações nas classes, na legislação ou nas
                  entidades. Este pedido deve ser executado fora das 'horas de ponta' do
                  servidor.
                </p>
                <v-row>
                  <v-col class="text-center">
                    <v-btn dark :color="color" @click="reloadDialog = true">
                      Iniciar reload
                    </v-btn>
                  </v-col>
                </v-row>
                <v-alert :type="type" :value="reloadAlert" dismissible>
                  {{ text }}
                </v-alert>
              </v-card-text>
            </v-card>
            <br />
            <v-card>
              <v-card-title class="indigo accent-4 text-white">
                Recálculo dos fechos transitivos
              </v-card-title>
              <v-card-text>
                <v-row justify="center">
                  <v-col>
                    <p>
                      Calcula e guarda todas as travessias de todas as classes (fecho
                      transitivo). Como as relações entre classes eComplementarDe,
                      eSintetizadoPor e eSuplementoPara não podem ser quebradas na criação
                      de TS's e sendo este cálculo pesado e necessário efetuar sempre que
                      se cria uma TS, pretende-se com esta secção calcular o fecho
                      transitivo apenas uma única vez e posteriormente colocá-lo em cache.
                    </p>
                    <p>
                      Calcula também o fecho transitivo apenas para a relação
                      eSintetizadoPor.
                    </p>
                    <p class="font-weight-bold">
                      <span style="color: red">CUIDADO:</span> Pedido pesado que deve ser
                      apenas executado se houver alterações nas classes. Este pedido deve
                      ser executado fora das 'horas de ponta' do servidor.
                    </p>
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <v-btn dark :color="color" @click="calcDialog = true">
                          Calcular e guardar fechos transitivos
                        </v-btn>
                      </v-col>
                    </v-row>

                    <p>
                      Após calcular os fechos transitivos das classes é necessário
                      atualizar os fechos transitivos presentes na cache do servidor. Para
                      atualizar a cache carregue no seguinte botão.
                    </p>
                    <p class="font-weight-bold">
                      <span style="color: red">AVISO:</span> Caso este passo não seja
                      efetuado os novos fechos transitivos calculados não estarão
                      visíveis/acessíveis para os utilizadores, continuando a serem
                      apresentados os fechos transitivos anteriores.
                    </p>
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <v-btn dark :color="color" @click="loadDialog = true">
                          Carregar fechos transitivos para cache (reset)
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-alert :type="type" :value="loadAlert" dismissible>
                      {{ text }}
                    </v-alert>
                  </v-col>
                </v-row>

                <v-row v-if="aCalcular || fechoTotalCalculado" justify="center">
                  <v-col cols="12">
                    <v-card>
                      <v-toolbar :color="color" dark>
                        <v-toolbar-title v-if="aCalcular">
                          Progresso do cálculo do fecho transitivo
                          {{ fechoTipo }}
                        </v-toolbar-title>
                        <v-toolbar-title v-if="fechoTotalCalculado">
                          Fecho Transitivo {{ fechoTipo }} calculado
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12">
                            <v-alert
                              :value="!fechoTotalCalculado && !calcAlert"
                              color="warning"
                              class="title text-center text-white"
                            >
                              A calcular o fecho transitivo {{ fechoTipo }}... Classe:
                              {{ processo }}
                            </v-alert>
                            <v-alert
                              :value="fechoTotalCalculado && !calcAlert"
                              color="success"
                              class="title text-center text-white"
                            >
                              Fechos transitivos calculados e guardados com sucesso!<br />
                              Carregue os fechos transitivos para cache!
                            </v-alert>
                            <v-alert :type="type" :value="calcAlert" dismissible>
                              {{ text }}
                            </v-alert>
                          </v-col>
                        </v-row>

                        <v-row v-if="!fechoTotalCalculado">
                          <v-col cols="12" class="text-center">
                            <v-btn color="error" @click="cancelar()">
                              Cancelar Cálculo do Fecho Transitivo
                            </v-btn>
                          </v-col>
                        </v-row>

                        <!--
                        <v-row>
                          <v-col cols="12" class="text-center">
                            <v-btn dark :color="color" @click="show = !show">
                              <span v-if="!show">Ver</span>
                              <span v-else>Esconder</span>
                              Fecho Transitivo
                            </v-btn>
                          </v-col>
                        </v-row>

                        <v-row v-if="show">
                          <v-col cols="12">
                            <span
                              class="card title indigo accent-4 text-white pa-2"
                            >
                              Fecho Transitivo:
                            </span>
                            <span
                              style="white-space: pre-wrap"
                              class="card grey darken-4 text-white pa-2"
                            >{{ JSON.stringify(resultadosJSON, null, 4) }}
                            </span>
                          </v-col>
                        </v-row>
                        -->
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog :value="reloadDialog" max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende realizar o reload da cache?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="reloadDialog = false"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              reloadCache();
              reloadDialog = false;
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="calcDialog" max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende calcular e guardar fecho transitivo?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="calcDialog = false"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              calcAndWrite();
              calcDialog = false;
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="loadDialog" max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende carregar o fecho transitivo para cache?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="loadDialog = false"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              travessiasReset();
              loadDialog = false;
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "Administração",
  data: () => ({
    text: "",
    type: "success",
    reloadDialog: false,
    calcDialog: false,
    loadDialog: false,
    reloadAlert: false,
    calcAlert: false,
    loadAlert: false,
    //show: false,
    processo: "",
    listaProcessos: [],
    color: "indigo accent-4",
    fechoTotalCalculado: false,
    resultadosJSON: [],
    aCalcular: false,
    fechoTipo: "",
  }),

  methods: {
    async reloadCache() {
      this.reloadAlert = false;

      try {
        var response = await this.$request("get", "/reload/cache");
        this.text = response.data;
        this.type = "success";
      } catch (erro) {
        this.text = erro.response.data[0].msg || erro.response.data;
        this.type = "error";
      }

      this.reloadAlert = true;
    },

    loadProcessos: async function () {
      try {
        var response = await this.$request("get", "/classes?nivel=3");
        this.listaProcessos = response.data.map((e) => e.id.split("#c")[1]);
        //garantir que a lista com os códigos das classes está ordenada
        this.listaProcessos.sort();
      } catch (erro) {
        throw erro.response.data;
      }
    },

    loadRels: async function (p, relacao) {
      try {
        var response = await this.$request(
          "get",
          "/classes/c" + p + "/procRel/" + relacao
        );
        return response.data.map((e) => e.codigo);
      } catch (erro) {
        throw erro.response.data;
      }
    },

    calcRel: async function (processo, niveis, relacoes) {
      var listaResultados = [];
      var stackProc = [];
      var profundidade = 1;
      var p;

      stackProc.push([]);
      stackProc[0].push(processo);

      while (profundidade <= niveis && stackProc[profundidade - 1].length > 0) {
        stackProc.push([]);

        for (var i = 0; i < stackProc[profundidade - 1].length; i++) {
          p = stackProc[profundidade - 1][i];

          //verifica se já se possui a travessia de p
          if (p < processo) {
            //caso já se possua a travessia de p apenas é necessário adicionar a travessia aos resultados para o processo (evitando duplicados)
            var elem = this.resultadosJSON.find((o) => {
              return o.processo == p;
            });
            listaResultados = this.merge(listaResultados, elem.travessia);
          } else {
            //caso não se possua é necessário calcular...
            for (var j = 0; j < relacoes.length; j++) {
              var procs = await this.loadRels(p, relacoes[j]);
              if (procs.length > 0) {
                //guardar as novas classes no próximo nível para depois obter as suas relações
                stackProc[profundidade] = stackProc[profundidade].concat(
                  this.minus(procs, [p].concat(listaResultados))
                );
                listaResultados = this.merge(listaResultados, procs);
              }
            }

            //ordena as classes do próximo nível por forma a que primeiro se processe as classes das quais já temos a travessia
            stackProc[profundidade].sort();
          }
        }
        profundidade++;
      }

      listaResultados.sort();
      return listaResultados;
    },

    merge: function (i, x) {
      var h = {};
      var n = [];
      for (var a = 2; a--; i = x)
        i.map(function (b) {
          h[b] = h[b] || n.push(b);
        });
      return n;
    },

    minus: function (a, b) {
      var s = new Set(b);
      return Array.from(new Set(a.filter((x) => !s.has(x))));
    },

    calcRelTotal: async function (relacoes) {
      var niveis = 1000;

      for (var i = 0; i < this.listaProcessos.length; i++) {
        this.processo = this.listaProcessos[i];
        var lista = await this.calcRel(this.processo, niveis, relacoes);

        this.resultadosJSON.push({
          processo: this.processo,
          travessia: lista,
        });
      }
    },

    writeJSON: async function (path) {
      try {
        var response = await this.$request("post", path, this.resultadosJSON);
      } catch (e) {
        throw e.response.data;
      }
    },

    calcAndWrite: async function () {
      this.calcAlert = false;

      try {
        this.fechoTotalCalculado = false;
        this.aCalcular = true;
        this.fechoTipo = "completo";

        await this.loadProcessos();

        await this.calcRelTotal([
          "eComplementarDe",
          "eSintetizadoPor",
          "eSuplementoPara",
        ]);
        await this.writeJSON("/travessia");
        this.resultadosJSON = [];

        this.fechoTipo = "de síntese";

        await this.calcRelTotal(["eSintetizadoPor"]);
        await this.writeJSON("/travessiaDeSintese");
        this.resultadosJSON = [];

        this.fechoTotalCalculado = true;
        this.aCalcular = false;
      } catch (e) {
        this.text = e;
        this.type = "error";
        this.calcAlert = true;
      }
    },

    travessiasReset: async function () {
      this.loadAlert = false;

      try {
        var response = await this.$request("get", "/travessia/reset");
        response = await this.$request("get", "/travessiaDeSintese/reset");
        this.text = "Reset dos fechos transitivos efetuado com sucesso! ";
        this.type = "success";
      } catch (e) {
        this.text = e.response.data[0].msg || e.response.data;
        this.type = "error";
      }

      this.loadAlert = true;
    },

    cancelar: function () {
      window.location.reload();
    },
  },
};
</script>
