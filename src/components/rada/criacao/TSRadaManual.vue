<template>
  <v-card flat class="mb-12" style="background-color:#fafafa">
    <v-form ref="form" :lazy-validation="false">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Título</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="TS.titulo"
            label="Título da TS"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" xs="12" sm="12">
          <AddOrgFunc :classes="TS.classes" />
          <Serie
            :classes="TS.classes"
            :legislacao="legislacao"
            :RE="RE"
            :UIs="TS.UIs"
            :formaContagem="formaContagem"
          />
          <SubSerie :classes="TS.classes" :UIs="TS.UIs" :formaContagem="formaContagem" />
        </v-col>
      </v-row>
      <p v-for="(classe, i) in TS.classes" :key="i">{{ classe }}</p>
      <v-row>
        <v-col cols="12" xs="12" sm="12">
          <div v-if="TS.classes.length > 0">
            <v-treeview hoverable :items="preparaTree" item-key="titulo">
              <template v-slot:label="{ item }">
                <EditarSerie
                  v-if="item.tipo == 'Série'"
                  @atualizacao="atualizacao_serie"
                  :treeview_object="item"
                  :classes="TS.classes"
                  :legislacao="legislacao"
                  :RE="RE"
                  :UIs="TS.UIs"
                  :formaContagem="formaContagem"
                  @remover="remover_classe"
                />
                <EditarSubserie
                  v-else-if="item.tipo == 'Subsérie'"
                  @atualizacao="atualizacao_subserie"
                  @remover="remover_classe"
                  :treeview_object="item"
                  :classes="TS.classes"
                  :RE="RE"
                  :UIs="TS.UIs"
                  :formaContagem="formaContagem"
                />
                <EditarOrganicaFunc
                  v-else
                  @atualizacao="atualizacao_area_organico"
                  @remover="remover_classe"
                  :classes="TS.classes"
                  :treeview_object="item"
                />
              </template>
            </v-treeview>
            <br />
            <b v-if="incompleto" style="color:red">*Classes por preencher</b>
          </div>
          <v-alert class="text-center" v-else :value="true" color="amber accent-3" icon="warning">
            <b>Sem Classes!</b> É obrigatório adicionar.
          </v-alert>
          <br />
        </v-col>
      </v-row>
      <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
      <v-row>
        <v-col sm="12" xs="12">
          <ListaUI :TS="TS" :RE="RE" />
        </v-col>
      </v-row>
    </v-form>
    <v-btn dark color="indigo darken-1" @click="sendToFather()">Criar RADA</v-btn>
    <v-btn @click="$emit('voltar', 2)">Voltar</v-btn>
    <v-btn color="indigo darken-4" text @click="apagar">
      <v-icon>delete_sweep</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import AddOrgFunc from "@/components/rada/criacao/classes/OrganicaFunc";
import Serie from "@/components/rada/criacao/classes/Serie";
import SubSerie from "@/components/rada/criacao/classes/Subserie";
import EditarOrganicaFunc from "@/components/rada/alteracao/EditarOrganicaFunc";
import EditarSerie from "@/components/rada/alteracao/EditarSerie";
import EditarSubserie from "@/components/rada/alteracao/EditarSubserie";
import ListaUI from "@/components/rada/criacao/ListaUI";

const labels = require("@/config/labels").criterios;

export default {
  props: ["TS", "entidades", "RE", "legislacao"],
  components: {
    AddOrgFunc,
    Serie,
    SubSerie,
    EditarOrganicaFunc,
    EditarSubserie,
    EditarSerie,
    ListaUI
  },
  data: () => ({
    formaContagem: {
      subFormasContagem: [],
      formasContagem: []
    }
  }),
  computed: {
    preparaTree() {
      var myTree = [];

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.TS.classes.sort((a, b) => a.codigo.localeCompare(b.codigo));

      for (var i = 0; i < this.TS.classes.length; i++) {
        if (this.TS.classes[i].eFilhoDe == null) {
          myTree.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            tipo: this.TS.classes[i].tipo,
            eFilhoDe: this.TS.classes[i].eFilhoDe,
            temUIs_ou_datas: Boolean(
              (this.TS.classes[i].dataInicial != undefined &&
                this.TS.classes[i].dataInicial != null) ||
                (this.TS.classes[i].UIs != undefined &&
                  this.TS.classes[i].UIs.length > 0)
            ),
            temDF: Boolean(
              this.TS.classes[i].df == null ||
                this.TS.classes[i].pca == null ||
                this.TS.classes[i].formaContagem.forma == null
            ),
            children: this.preparaTreeFilhos(this.TS.classes[i].codigo)
          });
        }
      }
      return myTree;
    },
    incompleto() {
      return this.TS.classes.some(
        e =>
          (e.tipo == "Série" &&
            ((!this.TS.classes.some(cl => cl.eFilhoDe == e.codigo) &&
              (e.df == null ||
                e.pca == null ||
                e.formaContagem.forma == null)) ||
              e.eFilhoDe == null ||
              !(
                (e.dataInicial != undefined && e.dataInicial != null) ||
                (e.UIs != undefined && e.UIs.length > 0)
              ))) ||
          (e.tipo == "Subsérie" &&
            (e.df == null ||
              e.eFilhoDe == null ||
              !(
                (e.dataInicial != undefined && e.dataInicial != null) ||
                (e.UIs != undefined && e.UIs.length > 0)
              ))) ||
          (e.eFilhoDe == null && (e.tipo == "N2" || e.tipo == "N3"))
      );
    }
  },
  methods: {
    preparaTreeFilhos: function(pai) {
      let children = [];

      for (let i = 0; i < this.TS.classes.length; i++) {
        if (this.TS.classes[i].eFilhoDe == pai) {
          children.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            tipo: this.TS.classes[i].tipo,
            eFilhoDe: this.TS.classes[i].eFilhoDe,
            temUIs_ou_datas: Boolean(
              (this.TS.classes[i].dataInicial != undefined &&
                this.TS.classes[i].dataInicial != null) ||
                (this.TS.classes[i].UIs != undefined &&
                  this.TS.classes[i].UIs.length > 0)
            ),
            temDF: Boolean(
              this.TS.classes[i].df == null ||
                this.TS.classes[i].pca == null ||
                this.TS.classes[i].formaContagem.forma == null
            ),
            children: this.preparaTreeFilhos(this.TS.classes[i].codigo)
          });
        }
      }

      return children;
    },
    apagar: function() {
      this.$refs.form.reset();
    },
    sendToFather: function() {
      if (this.$refs.form.validate() && this.TS.classes[0]) {
        this.$emit("done");
      }
    },
    atualizacao_area_organico(c) {
      let area_organico = this.TS.classes.find(e => e.codigo == c.codigo);

      area_organico.descricao = c.descricao;
      area_organico.titulo = c.titulo;
      area_organico.eFilhoDe = c.eFilhoDe;
      area_organico.tipo = c.tipo;
    },
    async atualizacao_serie(c) {
      let serie_classe = this.TS.classes.find(e => e.codigo == c.codigo);

      serie_classe.relacoes = await this.editaRelacoes(serie_classe, c);
      serie_classe.UIs = await this.editaUI(serie_classe, c);

      // Se a legislação for alterada pode mudar os critérios legais na subsérie;
      this.alterarCriterioLegalSubseries(serie_classe.codigo, c.legislacao);

      serie_classe.titulo = c.titulo;
      serie_classe.descricao = c.descricao;
      serie_classe.tUA = c.tUA;
      serie_classe.dataInicial = c.dataInicial;
      serie_classe.dataFinal = c.dataFinal;
      serie_classe.tSerie = c.tSerie;
      serie_classe.suporte = c.suporte;
      serie_classe.medicao = c.medicao;
      serie_classe.localizacao = c.localizacao;
      serie_classe.entProdutoras = c.entProdutoras;
      serie_classe.tipologiasProdutoras = c.tipologiasProdutoras;
      serie_classe.legislacao = c.legislacao;
      serie_classe.pca = c.pca;
      serie_classe.formaContagem = c.formaContagem;
      serie_classe.notas = c.notas;
      serie_classe.justificacaoPCA = c.justificacaoPCA;
      serie_classe.df = c.df;
      serie_classe.justificacaoDF = c.justificacaoDF;
      serie_classe.eFilhoDe = c.eFilhoDe;

      serie_classe.justificacaoPCA.forEach(criterio => {
        if (criterio.tipo == "Critério de Utilidade Administrativa") {
          criterio.relacoes.map(rel => delete rel.titulo);
        }
      });

      serie_classe.justificacaoDF.forEach(criterio => {
        if (
          criterio.tipo == "Critério de Complementaridade Informacional" ||
          criterio.tipo == "Critério de Densidade Informacional"
        ) {
          criterio.relacoes.map(rel => delete rel.titulo);
        }
      });
    },
    async atualizacao_subserie(c) {
      let subserie_classe = this.TS.classes.find(e => e.codigo == c.codigo);

      subserie_classe.relacoes = await this.editaRelacoes(subserie_classe, c);
      subserie_classe.UIs = await this.editaUI(subserie_classe, c);

      subserie_classe.dataInicial = c.dataInicial;
      subserie_classe.dataFinal = c.dataFinal;
      subserie_classe.titulo = c.titulo;
      subserie_classe.descricao = c.descricao;
      subserie_classe.pca = c.pca;
      subserie_classe.formaContagem = c.formaContagem;
      subserie_classe.notas = c.notas;
      subserie_classe.justificacaoPCA = c.justificacaoPCA;
      subserie_classe.df = c.df;
      subserie_classe.justificacaoDF = c.justificacaoDF;
      subserie_classe.eFilhoDe = c.eFilhoDe;

      subserie_classe.justificacaoPCA.forEach(criterio => {
        if (criterio.tipo == "Critério de Utilidade Administrativa") {
          criterio.relacoes.map(rel => delete rel.titulo);
        }
      });

      subserie_classe.justificacaoDF.forEach(criterio => {
        if (
          criterio.tipo == "Critério de Complementaridade Informacional" ||
          criterio.tipo == "Critério de Densidade Informacional"
        ) {
          criterio.relacoes.map(rel => delete rel.titulo);
        }
      });
    },
    alterarCriterioLegalSubseries(codigoPai, legislacao) {
      //procurar as subséries que são filhos e tratar dos seus critérios legislativos
      let subseries = this.TS.classes.filter(e => e.eFilhoDe == codigoPai);

      for (let i = 0; i < subseries.length; i++) {
        // 1º remover do critério legal na justificação PCA
        let legalPCA_subserie = subseries[i].justificacaoPCA.find(
          e => e.tipo == "Critério Legal"
        );
        if (legalPCA_subserie != undefined) {
          legalPCA_subserie.relacoes = legalPCA_subserie.relacoes.filter(e =>
            legislacao.some(leg => leg.tipo + " " + leg.numero == e.codigo)
          );

          if (legalPCA_subserie.relacoes.length == 0) {
            subseries[i].justificacaoPCA = subseries[i].justificacaoPCA.filter(
              e => e.tipo != "Critério Legal"
            );
          }
        }
        // 2º remover do critério legal na justificação DF
        let legalDF_subserie = subseries[i].justificacaoDF.find(
          e => e.tipo == "Critério Legal"
        );
        if (legalDF_subserie != undefined) {
          legalDF_subserie.relacoes = legalDF_subserie.relacoes.filter(e =>
            legislacao.some(leg => leg.tipo + " " + leg.numero == e.codigo)
          );

          if (legalDF_subserie.relacoes.length == 0) {
            subseries[i].justificacaoDF = subseries[i].justificacaoDF.filter(
              e => e.tipo != "Critério Legal"
            );
          }
        }
      }
    },
    editaUI(serie_classe, c) {
      let novo_UIs = [];

      // Iterar o array alterado pelo utilizador
      for (let i = 0; i < c.UIs.length; i++) {
        let UIs_igual = serie_classe.UIs.find(ui => ui.codigo == c.UIs[i]);

        if (UIs_igual == undefined) {
          this.adicionaUI(c.UIs[i], serie_classe);
        }
        novo_UIs.push(c.UIs[i]);
      }

      // Iterar o array original de relacoes
      for (let j = 0; j < serie_classe.UIs.length; j++) {
        let UIs_igual = c.UIs.find(ui => ui.codigo == serie_classe.UIs[j]);

        if (UIs_igual == undefined) {
          this.eliminaUI(serie_classe.UIs[j], serie_classe);
        }
      }
      return novo_UIs;
    },
    eliminaUI(velhaUI, serie_classe) {
      let UI = this.TS.UIs.find(e => e.codigo == velhaUI);

      UI.classesAssociadas = UI.classesAssociadas.filter(
        e => e.codigo != serie_classe.codigo
      );
    },
    adicionaUI(novaUI, serie_classe) {
      let UI = this.TS.UIs.find(e => e.codigo == novaUI);

      if (UI != undefined) {
        UI.classesAssociadas.push({
          codigo: serie_classe.codigo,
          tipo: serie_classe.tipo
        });
      } else {
        this.TS.UIs.push({
          codigo: novaUI,
          codCota: "",
          titulo: "",
          dataInicial: null,
          dataFinal: null,
          produtor: {
            tipologiasProdutoras: [],
            entProdutoras: []
          },
          classesAssociadas: [
            {
              codigo: serie_classe.codigo,
              tipo: serie_classe.tipo
            }
          ],
          descricao: "",
          notas: "",
          localizacao: ""
        });
      }
    },
    editaRelacoes(serie_classe, c) {
      let novo_relacoes = [];

      // Iterar o array alterado pelo utilizador
      for (let i = 0; i < c.relacoes.length; i++) {
        let relacao_igual = serie_classe.relacoes.find(
          rel =>
            rel.relacao == c.relacoes[i].relacao &&
            rel.serieRelacionada.codigo == c.relacoes[i].serieRelacionada.codigo
        );

        if (relacao_igual == undefined) {
          this.adicionaRelacoesInversas(c.relacoes[i], serie_classe);
        }

        delete c.relacoes[i].serieRelacionada.titulo;
        novo_relacoes.push(c.relacoes[i]);
      }

      // Iterar o array original de relacoes
      for (let j = 0; j < serie_classe.relacoes.length; j++) {
        let relacao_igual = c.relacoes.find(
          rel =>
            rel.relacao == serie_classe.relacoes[j].relacao &&
            rel.serieRelacionada.codigo ==
              serie_classe.relacoes[j].serieRelacionada.codigo
        );

        if (relacao_igual == undefined) {
          this.removeRelacoesInversas(serie_classe.relacoes[j], serie_classe);
        }
      }
      return novo_relacoes;
    },
    adicionaRelacoesInversas(relacao, serie_classe) {
      // console.log("ADICIONA RELACAO INVERSA");
      let classe_relacionada = this.TS.classes.find(
        e => e.codigo == relacao.serieRelacionada.codigo
      );

      if (classe_relacionada == undefined) {
        if (relacao.serieRelacionada.tipo == "Série") {
          classe_relacionada = {
            codigo: relacao.serieRelacionada.codigo,
            titulo: relacao.serieRelacionada.titulo,
            descricao: "",
            dataInicial: null,
            dataFinal: null,
            tUA: null,
            tSerie: null,
            suporte: null,
            medicao: null,
            localizacao: [],
            entProdutoras: [],
            tipologiasProdutoras: [],
            legislacao: [],
            relacoes: [],
            UIs: [],
            pca: null,
            formaContagem: {
              forma: null
            },
            justificacaoPCA: [],
            df: null,
            justificacaoDF: [],
            notas: "",
            eFilhoDe: null,
            tipo: "Série"
          };
        } else {
          classe_relacionada = {
            codigo: relacao.serieRelacionada.codigo,
            titulo: relacao.serieRelacionada.titulo,
            descricao: "",
            dataInicial: null,
            dataFinal: null,
            relacoes: [],
            UIs: [],
            pca: null,
            formaContagem: {
              forma: null
            },
            justificacaoPCA: [],
            df: null,
            justificacaoDF: [],
            notas: "",
            eFilhoDe: null,
            tipo: "Subsérie"
          };
        }

        this.TS.classes.push(classe_relacionada);
      }

      let relacao_inversa = "";

      switch (relacao.relacao) {
        case "Antecessora de":
          relacao_inversa = "Sucessora de";
          break;
        case "Sucessora de":
          relacao_inversa = "Antecessora de";
          break;
        case "Complementar de":
          relacao_inversa = "Complementar de";
          this.adiciona_criterio_a_relacionada(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Complementaridade Informacional",
            relacao_inversa
          );
          break;
        case "Sintetizado por":
          relacao_inversa = "Síntese de";
          this.adiciona_criterio_a_relacionada(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Densidade Informacional",
            relacao_inversa
          );
          break;
        case "Síntese de":
          relacao_inversa = "Sintetizado por";
          this.adiciona_criterio_a_relacionada(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Densidade Informacional",
            relacao_inversa
          );
          break;
        case "Suplemento de":
          relacao_inversa = "Suplemento para";
          this.adiciona_criterio_a_relacionada(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Utilidade Administrativa",
            relacao_inversa
          );
          break;
        case "Suplemento para":
          relacao_inversa = "Suplemento de";
          break;
      }

      classe_relacionada.relacoes.push({
        relacao: relacao_inversa,
        serieRelacionada: {
          codigo: serie_classe.codigo,
          tipo: serie_classe.tipo
        }
      });
    },
    adicionarDF(classe_relacionada, relacao) {
      // console.log("Adicionar DF");
      if (
        relacao == "Sintetizado por" &&
        !classe_relacionada.relacoes.some(e => e.relacao == "Complementar de")
      ) {
        classe_relacionada.df = "Eliminação";
      } else {
        classe_relacionada.df = "Conservação";
      }
    },
    adiciona_criterio_a_relacionada(
      classe_relacionada,
      codigoClasse,
      tipo_criterio,
      relacao
    ) {
      // console.log("ADICIONAR CRITÉRIO -> " + tipo_criterio);
      if (tipo_criterio == "Critério de Utilidade Administrativa") {
        let criterio = classe_relacionada.justificacaoPCA.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          classe_relacionada.justificacaoPCA.push({
            tipo: tipo_criterio,
            nota: labels.textoCriterioUtilidadeAdministrativa,
            relacoes: [{ codigo: codigoClasse }]
          });
        } else {
          criterio.relacoes.push({ codigo: codigoClasse });
        }
      } else {
        let criterio = classe_relacionada.justificacaoDF.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          let nota = "";

          switch (relacao) {
            case "Sintetizado por":
              nota = labels.textoCriterioDensidadeSinPor;
              break;
            case "Complementar de":
              nota = labels.textoCriterioComplementaridade;
              break;
            case "Síntese de":
              nota = labels.textoCriterioDensidadeSinDe;
              break;
          }
          this.adicionarDF(classe_relacionada, relacao);

          classe_relacionada.justificacaoDF.push({
            tipo: tipo_criterio,
            nota: nota,
            relacoes: [{ codigo: codigoClasse }]
          });
        } else {
          criterio.relacoes.push({ codigo: codigoClasse });
        }
      }
    },
    removerDF(classe_relacionada, tipo_criterio) {
      // console.log("Remover DF");
      if (tipo_criterio == "Critério de Densidade Informacional") {
        if (
          classe_relacionada.justificacaoDF.some(
            e => e.tipo == "Critério de Complementaridade Informacional"
          )
        ) {
          classe_relacionada.df = "Conservação";
        } else {
          classe_relacionada.df = null;
        }
      } else {
        if (classe_relacionada.relacoes.some(e => e.relacao == "Síntese de")) {
          classe_relacionada.df = "Conservação";
        } else {
          if (
            classe_relacionada.relacoes.some(
              e => e.relacao == "Sintetizado por"
            )
          ) {
            classe_relacionada.df = "Eliminação";
          } else {
            classe_relacionada.df = null;
          }
        }
      }
    },
    remove_criterio(classe_relacionada, codigoClasse, tipo_criterio, relacao) {
      // console.log("REMOVER CRITÉRIO -> " + tipo_criterio);
      if (tipo_criterio == "Critério de Utilidade Administrativa") {
        let criterio = classe_relacionada.justificacaoPCA.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio != undefined) {
          criterio.relacoes = criterio.relacoes.filter(
            e => e.codigo != codigoClasse
          );

          if (criterio.relacoes.length == 0) {
            classe_relacionada.justificacaoPCA = classe_relacionada.justificacaoPCA.filter(
              e => e.tipo != tipo_criterio
            );
          }
        }
      } else {
        let criterio = classe_relacionada.justificacaoDF.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio != undefined) {
          criterio.relacoes = criterio.relacoes.filter(
            e => e.codigo != codigoClasse
          );

          if (criterio.relacoes.length == 0) {
            // Remover DF que é dependente do critério que vai ser eliminado;
            classe_relacionada.justificacaoDF = classe_relacionada.justificacaoDF.filter(
              e => e.tipo != tipo_criterio
            );
            this.removerDF(classe_relacionada, tipo_criterio);
          }
        }
      }
    },
    removeRelacoesInversas(relacao, serie_classe) {
      // console.log("REMOVE RELACAO INVERSA");
      let classe_relacionada = this.TS.classes.find(
        e => e.codigo == relacao.serieRelacionada.codigo
      );

      let relacao_inversa = "";

      switch (relacao.relacao) {
        case "Antecessora de":
          relacao_inversa = "Sucessora de";
          break;
        case "Sucessora de":
          relacao_inversa = "Antecessora de";
          break;
        case "Complementar de":
          relacao_inversa = "Complementar de";
          this.remove_criterio(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Complementaridade Informacional"
          );
          break;
        case "Sintetizado por":
          relacao_inversa = "Síntese de";
          this.remove_criterio(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Densidade Informacional"
          );
          break;
        case "Síntese de":
          relacao_inversa = "Sintetizado por";
          this.remove_criterio(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Densidade Informacional"
          );
          break;
        case "Suplemento de":
          relacao_inversa = "Suplemento para";
          this.remove_criterio(
            classe_relacionada,
            serie_classe.codigo,
            "Critério de Utilidade Administrativa"
          );
          break;
        case "Suplemento para":
          relacao_inversa = "Suplemento de";
          break;
      }

      classe_relacionada.relacoes = classe_relacionada.relacoes.filter(e => {
        return (
          e.relacao != relacao_inversa ||
          e.serieRelacionada.codigo != serie_classe.codigo
        );
      });
    },
    remover_classe(classe) {
      this.TS.classes
        .filter(e => e.eFilhoDe == classe.codigo)
        .map(item => {
          item.eFilhoDe = null;
        });

      if (classe.tipo == "Série" || classe.tipo == "Subsérie") {
        // Remover Relações Inversas, critérios e ajustar destino final;
        for (let i = 0; i < classe.relacoes.length; i++) {
          this.removeRelacoesInversas(classe.relacoes[i], classe);
        }
        // Remover UIs;
        for (let j = 0; j < classe.UIs.length; j++) {
          this.eliminaUI(classe.UIs[j], classe);
        }
      }
      this.TS.classes = this.TS.classes.filter(
        cl => cl.codigo != classe.codigo
      );
    }
  },
  created: async function() {
    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem.formasContagem = responseFC.data.map(item => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1]
      };
    });

    let responseSFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaSubformaContagem"
    );

    this.formaContagem.subFormasContagem = responseSFC.data.map(item => {
      return {
        label: item.termo.split(": ")[1] + ": " + item.desc,
        value: item.idtermo.split("#")[1]
      };
    });
  }
};
</script>

<style scoped>
::v-deep .v-treeview-node {
  background-color: rgba(240, 163, 10, 0.2);
}
</style>
