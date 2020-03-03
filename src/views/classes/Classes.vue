<template>
  <v-card class="mx-auto">
    <v-sheet class="pa-3 indigo lighten-2">
      <v-row align="center" no-gutters>
        <v-col xs="12" md="7" sm="7" lg="7" xl="7">
          <v-text-field
            v-model="search"
            label="Pesquisar por código, título, notas de aplicação, exemplos de notas de aplicação ou termos de índice..."
            text
            dark
            solo-inverted
            hide-details
            clearable
            @click:clear="classesTree = classesOriginal"
            clear-icon="delete_forever"
          ></v-text-field>
        </v-col>
        <v-col xs="12" md="2" sm="2" lg="2" xl="2">
          <div class="text-center">
            <v-btn @click="processaPesquisa()">
              <v-icon left>search</v-icon>Pesquisar
            </v-btn>
          </div>
        </v-col>
        <v-col xs="12" md="3" sm="3" lg="3" xl="3">
          <div class="text-center">
            <v-btn
              @click="
                search = '';
                showClasses = false;
              "
            >
              <v-icon left>filter_list</v-icon>Pesquisa Avançada
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-row align="center" no-gutters v-if="showClasses">
      <v-col>
        <v-card-text>
          <div v-if="classesCarregadas">
            <v-treeview
              hoverable
              multiple-active
              :items="classesTree"
              item-key="id"
              :open="selectedParents"
              :active="selected"
            >
              <template slot="label" slot-scope="{ item }">
                <v-btn
                  text
                  depressed
                  @click="$router.push('/classes/consultar/c' + item.id)"
                >
                  {{ item.name }}
                </v-btn>
                <br />
              </template>
            </v-treeview>
          </div>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-card-text>
          <v-form
            v-for="(campo, index) in camposUsados"
            :key="index"
            ref="forms"
            lazy-validation
          >
            <v-row>
              <v-col cols="5">
                <v-autocomplete
                  :items="camposPesquisa"
                  label="Campo a pesquisar"
                  :rules="regraCampo"
                  v-model="camposUsados[index].campo"
                />
              </v-col>
              <v-col cols="5" v-if="camposUsados[index].campo">
                <div v-if="camposUsados[index].campo.label">
                  <v-autocomplete
                    :items="camposUsados[index].campo.enum"
                    label="É"
                    :rules="regraV"
                    v-model="camposUsados[index].campo.nome"
                  />
                  <v-autocomplete
                    :items="entidades"
                    :label="camposUsados[index].campo.label"
                    :rules="regraV"
                    v-model="camposUsados[index].valor"
                  />
                </div>
                <div v-else>
                  <div v-if="camposUsados[index].campo.enum.length > 0">
                    <v-autocomplete
                      :items="camposUsados[index].campo.enum"
                      label="Valor a pesquisar"
                      :rules="regraValor"
                      v-model="camposUsados[index].valor"
                    />
                  </div>
                  <div v-else>
                    <v-text-field
                      v-if="camposUsados[index].campo.mask"
                      label="Valor a pesquisar"
                      :rules="regraValor"
                      v-mask="camposUsados[index].campo.mask"
                      v-model="camposUsados[index].valor"
                    />
                    <v-text-field
                      v-else
                      label="Valor a pesquisar"
                      :rules="regraValor"
                      v-model="camposUsados[index].valor"
                    />
                  </div>
                </div>
              </v-col>
              <v-col>
                <v-select
                  :items="opLogicas"
                  v-model="conetor"
                  @input="
                    camposUsados.push({ campo: null, valor: '' });
                    opLogicas = [conetor];
                  "
                />
              </v-col>
              <v-col cols="1" v-if="camposUsados.length > 1">
                <v-btn text @click="removerCampo(index)">
                  <v-icon dark color="error">remove_circle_outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-spacer />
            <v-btn
              class="mx-2"
              dark
              color="indigo accent-4"
              @click="cancelarPesquisa"
            >
              Cancelar
            </v-btn>
            <v-btn
              class="mx-2"
              dark
              color="indigo accent-4"
              @click="pesquisaAvancada"
            >
              <v-icon left>search</v-icon>Pesquisar
            </v-btn>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    showClasses: true,
    regraCampo: [v => !!v || "Campo a pesquisar é obrigatório."],
    regraValor: [v => !!v || "Valor a pesquisar é obrigatório."],
    regraV: [v => !!v || "Obrigatório. Escolha um valor."],
    conetor: "E",
    opLogicas: ["E", "OU"],
    camposUsados: [{ campo: null, valor: "" }],
    camposPesquisa: [
      {
        text: "Código",
        value: { nome: "id", mask: "###.##.###.##", enum: [] }
      },
      { text: "Título", value: { nome: "titulo", enum: [] } },
      { text: "Estado", value: { nome: "status", enum: [] } },
      { text: "Descrição", value: { nome: "descricao", enum: [] } },
      { text: "Notas de Aplicação", value: { nome: "na", enum: [] } },
      {
        text: "Exemplos de Notas de Aplicação",
        value: { nome: "exemploNa", enum: [] }
      },
      { text: "Notas de Exclusão", value: { nome: "ne", enum: [] } },
      {
        text: "Termos de Índice",
        value: { nome: "ti", enum: [] }
      },
      { text: "PCA", value: { nome: "pca", mask: "#########", enum: [] } },
      { text: "Forma de contagem do PCA", value: { nome: "fc_pca", enum: [] } },
      {
        text: "Subforma de contagem do PCA",
        value: { nome: "sfc_pca", enum: [] }
      },
      { text: "Justificação do PCA", value: { nome: "crit_pca", enum: [] } },
      {
        text: "DF",
        value: {
          nome: "df",
          enum: [
            { text: "Conservação", value: "C" },
            { text: "Conservação Parcial", value: "CP" },
            { text: "Eliminação", value: "E" }
          ]
        }
      },
      { text: "Justificação do DF", value: { nome: "crit_df", enum: [] } },
      {
        text: "Entidade",
        value: {
          nome: "",
          label: "Entidade a pesquisar",
          enum: [
            { text: "Dona", value: "donos" },
            { text: "Participante", value: "participantes" }
          ]
        }
      }
    ],
    classesTree: [],
    classesOriginal: [],
    entidades: [],
    classesCarregadas: false,
    search: null,
    selected: [],
    selectedParents: []
  }),
  created: async function() {
    var myClasses = await this.$request("get", "/classes?info=completa");
    this.classesTree = await this.preparaTree(myClasses.data);
    this.classesOriginal = this.classesTree;

    await this.loadStatus();
    await this.loadPCAFormasContagem();
    await this.loadPCASubFormasContagem();
    this.loadCriterios();

    var entidades = await this.$request("get", "/entidades");
    this.entidades = entidades.data.map(e => {
      return { text: e.designacao, value: e.id };
    });
    this.classesCarregadas = true;
  },
  methods: {
    //Necessário para o caso especial de pesquisar com o campo Entidade
    cleanNome: function() {
      for (var i = 0; i < this.camposPesquisa.length; i++) {
        if (this.camposPesquisa[i].text == "Entidade") {
          this.camposPesquisa[i].value.nome = "";
        }
      }
    },
    loadEnum: function(nomeCampo, n_enum) {
      var found = false;

      for (var i = 0; i < this.camposPesquisa.length && !found; i++) {
        if (this.camposPesquisa[i].text == nomeCampo) {
          this.camposPesquisa[i].value.enum = n_enum;
          found = true;
        }
      }
    },
    loadStatus: async function() {
      var response = await this.$request("get", "/vocabularios/vc_status");
      var status = response.data
        .map(item => {
          return {
            text: item.termo,
            value: item.idtermo.split("#vc_status_")[1]
          };
        })
        .sort((a, b) => a.text.localeCompare(b.text));

      this.loadEnum("Estado", status);
    },
    loadPCAFormasContagem: async function() {
      var response = await this.$request(
        "get",
        "/vocabularios/vc_pcaFormaContagem"
      );

      var pcaFormasContagem = response.data.map(item => item.termo).sort();
      this.loadEnum("Forma de contagem do PCA", pcaFormasContagem);
    },
    loadPCASubFormasContagem: async function() {
      var response = await this.$request(
        "get",
        "/vocabularios/vc_pcaSubformaContagem"
      );

      var pcaSubFormasContagem = response.data.map(item => item.desc).sort();
      this.loadEnum("Subforma de contagem do PCA", pcaSubFormasContagem);
    },
    loadCriterios: function() {
      var criterios = [
        {
          text: "Critério Legal",
          value: "CriterioJustificacaoLegal"
        }
      ];
      var criteriosPCA = criterios.concat([
        {
          text: "Critério Gestionário",
          value: "CriterioJustificacaoGestionario"
        },
        {
          text: "Critério de Utilidade Administrativa",
          value: "CriterioJustificacaoUtilidadeAdministrativa"
        }
      ]);
      var criteriosDF = criterios.concat([
        {
          text: "Critério de Densidade Informacional",
          value: "CriterioJustificacaoDensidadeInfo"
        },
        {
          text: "Critério de Complementaridade Informacional",
          value: "CriterioJustificacaoComplementaridadeInfo"
        }
      ]);

      this.loadEnum("Justificação do PCA", criteriosPCA);
      this.loadEnum("Justificação do DF", criteriosDF);
    },
    addActive: function(code) {
      if (!this.selected.includes(code)) {
        this.selected.push(code);
      }
    },
    buscarpais: function(code) {
      let levelIds = code.split(".");
      let iter = levelIds.length;

      for (let i = 0; i < iter; i++) {
        levelIds.splice(levelIds.length - 1, 1);
        let levelId = levelIds.join(".");

        if (!this.selectedParents.includes(levelId)) {
          this.selectedParents.push(levelId);
        }
      }
    },

    removerCampo: function(index) {
      this.camposUsados.splice(index, 1);
      if (this.camposUsados.length == 1) {
        this.opLogicas = ["E", "OU"];
      }
    },

    cancelarPesquisa: function() {
      this.classesTree = this.classesOriginal;
      this.selected = [];
      this.selectedParents = [];
      this.camposUsados = [{ campo: null, valor: "" }];
      this.cleanNome();
      this.opLogicas = ["E", "OU"];
      this.conetor = "E";
      this.showClasses = true;
    },

    advancedFilter: async function(classes, op) {
      var classesAux = [];

      for (var i = 0; i < classes.length; i++) {
        classes[i].children = await this.advancedFilter(
          classes[i].children,
          op
        );

        var stat = op;
        for (let c of this.camposUsados) {
          var statAux;
          if (c.campo.enum.length > 0) {
            if (classes[i][c.campo.nome] instanceof Array) {
              statAux = classes[i][c.campo.nome].includes(c.valor);
            } else {
              statAux = classes[i][c.campo.nome] == c.valor;
            }
          } else {
            statAux = classes[i][c.campo.nome].indexOf(c.valor) > -1;
          }

          if (op) stat = stat && statAux;
          else stat = stat || statAux;
        }

        if (stat) {
          this.addActive(classes[i].id);
          this.buscarpais(classes[i].id);
        }

        if (stat || classes[i].children.length > 0) classesAux.push(classes[i]);
      }

      return classesAux;
    },

    pesquisaAvancada: async function() {
      var valid = true;

      for (var i = 0; i < this.camposUsados.length; i++) {
        if (!this.$refs.forms[i].validate()) {
          valid = false;
        }
      }

      if (valid) {
        var classesFiltradas = JSON.parse(JSON.stringify(this.classesOriginal));
        this.selected = [];
        this.selectedParents = [];

        for (let c of this.camposUsados) {
          c.valor = c.valor.toLowerCase();
        }

        if (this.conetor == "E") {
          classesFiltradas = await this.advancedFilter(classesFiltradas, true);
        } else if (this.conetor == "OU") {
          classesFiltradas = await this.advancedFilter(classesFiltradas, false);
        }

        this.classesTree = classesFiltradas;
        this.camposUsados = [{ campo: null, valor: "" }];
        this.cleanNome();
        this.opLogicas = ["E", "OU"];
        this.conetor = "E";
        this.showClasses = true;
      }
    },

    simpleFilter: async function(classes, searchText) {
      var classesAux = [];

      for (var classe of classes) {
        var c = JSON.parse(JSON.stringify(classe));
        c.children = await this.simpleFilter(c.children, searchText);

        if (
          c.id.indexOf(searchText) > -1 ||
          c.titulo.indexOf(searchText) > -1 ||
          c.na.indexOf(searchText) > -1 ||
          c.exemploNa.indexOf(searchText) > -1 ||
          c.ti.indexOf(searchText) > -1
        ) {
          this.addActive(c.id);
          this.buscarpais(c.id);
          if (classe.children.length == 0 && c.children.length == 0)
            classesAux.push(c);
        }

        if (c.children.length > 0) classesAux.push(c);
      }
      return classesAux;
    },

    processaPesquisa: async function() {
      this.classesTree = this.classesOriginal;
      var classesFiltradas = [];
      this.selected = [];
      this.selectedParents = [];

      if (this.search != "" && this.search != null) {
        var searchText = this.search.toLowerCase();

        classesFiltradas = await this.simpleFilter(
          this.classesOriginal,
          searchText
        );
      } else {
        classesFiltradas = this.classesOriginal;
      }

      this.classesTree = classesFiltradas;
      this.showClasses = true;
    },
    preparaTree: async function(lclasses) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo + " - " + lclasses[i].titulo,
            titulo: lclasses[i].titulo.toLowerCase(),
            status: lclasses[i].status.toLowerCase(),
            na: lclasses[i].notasAp
              ? lclasses[i].notasAp
                  .map(n => n.nota)
                  .join(" ")
                  .toLowerCase()
              : [],
            exemploNa: lclasses[i].exemplosNotasAp
              ? lclasses[i].exemplosNotasAp
                  .map(e => e.exemplo)
                  .join(" ")
                  .toLowerCase()
              : [],
            ne: lclasses[i].notasEx
              ? lclasses[i].notasEx
                  .map(n => n.nota)
                  .join(" ")
                  .toLowerCase()
              : [],
            ti: lclasses[i].termosInd
              ? lclasses[i].termosInd
                  .map(t => t.termo)
                  .join(" ")
                  .toLowerCase()
              : [],
            pca: lclasses[i].pca.valores
              ? lclasses[i].pca.valores.toLowerCase()
              : "",
            fc_pca: lclasses[i].pca.formaContagem
              ? lclasses[i].pca.formaContagem.toLowerCase()
              : "",
            sfc_pca: lclasses[i].pca.subFormaContagem
              ? lclasses[i].pca.subFormaContagem.toLowerCase()
              : "",
            crit_pca: lclasses[i].pca.justificacao
              ? lclasses[i].pca.justificacao.map(j => j.tipoId.toLowerCase())
              : [],
            df: lclasses[i].df.valor
              ? lclasses[i].df.valor.toLowerCase()
              : "NE",
            crit_df: lclasses[i].df.justificacao
              ? lclasses[i].df.justificacao.map(j => j.tipoId.toLowerCase())
              : [],
            donos: lclasses[i].donos
              ? lclasses[i].donos.map(e => e.idDono.toLowerCase())
              : [],
            participantes: lclasses[i].participantes
              ? lclasses[i].participantes.map(e =>
                  e.idParticipante.toLowerCase()
                )
              : [],
            children: await this.preparaTree(lclasses[i].filhos)
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
    }
  },
  watch: {
    search: function(newValue) {
      if (newValue == "" || newValue == null) {
        this.selected = [];
        this.selectedParents = [];
        this.classesTree = this.classesOriginal;
      }
    }
  }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>
