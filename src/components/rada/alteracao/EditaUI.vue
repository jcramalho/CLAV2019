<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <!-- <v-btn color="indigo lighten-2" dark class="ma-2" v-on="on"></v-btn> -->
      <tr :style="'text-align: center; background-color:' + isComplete" v-on="on" @click="cloneUI">
        <td>{{ UI.codigo }}</td>
        <td>{{ UI.titulo }}</td>
      </tr>
    </template>
    <v-card>
      <v-card-title
        class="indigo darken-1 white--text"
      >Editar Unidade de Instalação: {{ UI.codigo + " - " + UI.titulo}}</v-card-title>
      <v-card-text>
        <v-form ref="formUI" :lazy-validation="false">
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field disabled solo v-model="UI_clone.codigo" label="Código"></v-text-field>
            </v-col>
            <v-col md="3" sm="3">
              <div class="info-label">Titulo</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.titulo"
                label="Título"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2" sm="2">
              <div class="info-label">Código Classificação/Cota</div>
            </v-col>
            <v-col sm="2" md="2">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.codCota"
                label="Código Classificação/Cota"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="2">
              <div class="info-label">Data Inicial da Documentação</div>
            </v-col>
            <v-col xs="12" sm="2">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :return-value.sync="UI_clone.dataInicial"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="UI_clone.dataInicial"
                    label="Data Inicial"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker v-model="UI_clone.dataInicial" no-title scrollable locale="pt">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu1 = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.menu1.save(UI_clone.dataInicial)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" xs="12" sm="2">
              <div class="info-label">Data Final da Documentação</div>
            </v-col>
            <v-col xs="12" sm="2">
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :return-value.sync="UI_clone.dataFinal"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="UI_clone.dataFinal"
                    label="Data Final"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker v-model="UI_clone.dataFinal" no-title scrollable locale="pt">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(UI_clone.dataFinal)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <EntidadesProdutoras :newSerie="UI_clone.produtor" :RE="RE" />
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <v-row>
            <v-col md="4" sm="4">
              <div class="info-label">Série/Subsérie</div>
            </v-col>
            <v-col md="8" sm="8">
              <!-- {{ UI_clone.classesAssociadas }} -->
              <v-data-table
                :headers="headers"
                :items="UI_clone.classesAssociadas"
                hide-default-footer
                v-if="UI_clone.classesAssociadas == undefined || UI_clone.classesAssociadas[0]"
              >
                <template v-slot:item.edicao="props">
                  <td>
                    <v-icon color="red darken-2" dark @click="remove(props.item)">remove_circle</v-icon>
                  </td>
                </template>
              </v-data-table>

              <v-alert
                v-else
                :value="true"
                icon="warning"
                color="amber accent-3"
              >Não tem séries/subséries selecionadas...</v-alert>
            </v-col>
          </v-row>
          <v-card outlined>
            <div class="info-label">Adicionar série/subsérie</div>

            <v-card-text>
              <!-- FORMULÁRIO PARA NOVA CLASSE -->
              <v-form ref="addRel" :lazy-validation="false">
                <v-row>
                  <v-col sm="6" xs="12">
                    <v-combobox
                      :rules="[v => eCodigoClasseValido(v) || !!v || 'Campo obrigatório!']"
                      v-model="cod"
                      :items="getCodigos"
                      label="Código"
                      solo
                      clearable
                    >
                      <!-- <template v-slot:item="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>
                      <template v-slot:selection="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>-->
                    </v-combobox>
                    <!-- <v-text-field v-model="cod" label="Código" solo clearable></v-text-field> -->
                  </v-col>
                  <v-col sm="5" xs="12">
                    <v-select
                      :rules="[v => !!v || 'Campo obrigatório!']"
                      :disabled="iscodvalido"
                      label="Tipo de Classe"
                      v-model="tipoClasse"
                      :items="['Série', 'Subsérie']"
                      chips
                      solo
                      clearable
                    >
                      <template v-slot:selection="data">
                        <v-chip>
                          <v-avatar left color="amber accent-3">{{ data.item[0] }}</v-avatar>
                          {{ data.item }}
                        </v-chip>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col sm="1" xs="12">
                    <v-btn icon text rounded @click="adicionarClasseUI">
                      <v-icon color="green lighten-1">add_circle</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="!!alertOn">
                  <v-col>
                    <v-alert dismissible dense text type="error">Relação já existente!</v-alert>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>

          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Notas</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.notas"
                label="Notas"
              ></v-text-field>
            </v-col>
            <v-col md="3" sm="3">
              <div class="info-label">Localização</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.localizacao"
                label="Título"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4" sm="4">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="8" md="8">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.descricao"
                label="Descrição"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="guardar">Atualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EntidadesProdutoras from "@/components/rada/criacao/classes/partes/EntidadesProdutoras.vue";

export default {
  props: ["UI", "RE", "classes"],
  components: {
    EntidadesProdutoras
  },
  computed: {
    isComplete() {
      let back_color = "#FAFAFA";

      if (this.UI.classesAssociadas.length == 0 || this.UI.titulo == "") {
        back_color = "#FFEBEE";
      }
      return back_color;
    },
    getCodigos() {
      return this.classes
        .filter(
          e =>
            (e.tipo == "Série" || e.tipo == "Subsérie") && e.dataInicial == null
        )
        .map(e => e.codigo);
    }
  },
  watch: {
    cod: function(novo, old) {
      let c = this.classes.find(e => e.codigo == novo);

      if (c != undefined) {
        this.iscodvalido = true;
        this.tipoClasse = c.tipo;
      } else {
        this.iscodvalido = false;
      }
    }
  },
  data: () => ({
    showTable: false,
    alertOn: false,
    menu1: false,
    menu2: false,
    cod: null,
    iscodvalido: false,
    tipoClasse: null,
    UI_clone: {},
    dialog: false,
    headers: [
      {
        text: "Código",
        align: "center",
        value: "codigo",
        width: "75%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo",
        align: "center",
        value: "tipo",
        width: "20%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        value: "edicao",
        align: "center",
        sortable: false,
        width: "5%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  methods: {
    eCodigoClasseValido(v) {
      if (
        this.classes.some(
          e =>
            e.codigo == v &&
            (e.dataInicial === undefined || e.dataInicial != null)
        )
      ) {
        return "Impossível criar relação, altere o código!";
      } else {
        return false;
      }
    },
    elimina_de_classe(classe_eliminada, codigo_UI) {
      let classe = this.classes.find(cl => cl.codigo == classe_eliminada);

      classe.UIs = classe.UIs.filter(e => e.codigo != codigo_UI);
    },
    adiciona_a_classe(classe_adicionada, codigo_UI) {
      let classe = this.classes.find(
        cl => cl.codigo == classe_adicionada.codigo
      );

      if (classe == undefined) {
        if (classe_adicionada.tipo == "Série") {
          classe = {
            codigo: classe_adicionada.codigo,
            titulo: "",
            descricao: "",
            dataInicial: null,
            dataFinal: null,
            tUA: "",
            tSerie: "",
            suporte: "",
            medicao: "",
            localizacao: [],
            entProdutoras: [],
            tipologiasProdutoras: [],
            legislacao: [],
            relacoes: [],
            UIs: [{ codigo: codigo_UI }],
            pca: "",
            formaContagem: "",
            justicacaoPCA: "",
            df: "",
            justificacaoDF: "",
            notas: "",
            eFilhoDe: "",
            tipo: "Série"
          };
        } else {
          classe = {
            codigo: classe_adicionada.codigo,
            titulo: "",
            descricao: "",
            dataInicial: null,
            dataFinal: null,
            relacoes: [],
            UIs: [{ codigo: codigo_UI }],
            pca: "",
            formaContagem: "",
            justicacaoPCA: "",
            df: "",
            justificacaoDF: "",
            notas: "",
            eFilhoDe: "",
            tipo: "Subsérie"
          };
        }
        this.classes.push(classe);
      } else {
        classe.UIs.push({ codigo: codigo_UI });
      }
    },
    async editaClasses(UI_real, UI_copia) {
      let novo_classesAssociadas = [];

      /*
      
        Iterar o array alterado pelo utilizador

      */
      for (let i = 0; i < UI_copia.classesAssociadas.length; i++) {
        let classe_ui_igual = UI_real.classesAssociadas.find(
          ui => ui.codigo == UI_copia.classesAssociadas[i].codigo
        );

        if (classe_ui_igual == undefined) {
          await this.adiciona_a_classe(
            UI_copia.classesAssociadas[i],
            UI_real.codigo
          );
        }

        novo_classesAssociadas.push({
          codigo: UI_copia.classesAssociadas[i].codigo,
          tipo: UI_copia.classesAssociadas[i].tipo
        });
      }
      /*
      
        Iterar o array original de uis

      */
      for (let j = 0; j < UI_real.classesAssociadas.length; j++) {
        let classe_ui_igual = UI_copia.classesAssociadas.find(
          ui => ui.codigo == UI_real.classesAssociadas[j].codigo
        );

        if (classe_ui_igual == undefined) {
          await this.elimina_de_classe(
            UI_real.classesAssociadas[j].codigo,
            UI_real.codigo
          );
        }
      }
      return novo_classesAssociadas;
    },
    async guardar() {
      if (this.$refs.formUI.validate()) {
        this.UI.classesAssociadas = await this.editaClasses(
          this.UI,
          this.UI_clone
        );

        this.UI.titulo = this.UI_clone.titulo;
        this.UI.codCota = this.UI_clone.codCota;
        this.UI.dataInicial = this.UI_clone.dataInicial;
        this.UI.dataFinal = this.UI_clone.dataFinal;
        this.UI.produtor = this.UI_clone.produtor;
        this.UI.descricao = this.UI_clone.descricao;
        this.UI.notas = this.UI_clone.notas;
        this.UI.localizacao = this.UI_clone.localizacao;

        this.dialog = false;
      }
    },
    remove: function(item) {
      this.UI_clone.classesAssociadas = this.UI_clone.classesAssociadas.filter(
        e => {
          return e.codigo != item.codigo;
        }
      );
    },
    cloneUI() {
      //DEEP CLONE OF UI
      this.UI_clone = Object.assign({}, this.UI);

      this.UI_clone.produtor.tipologiasProdutoras = [
        ...this.UI.produtor.tipologiasProdutoras
      ];

      this.UI_clone.produtor.entProdutoras = [
        ...this.UI.produtor.entProdutoras
      ];

      this.UI_clone.classesAssociadas = [...this.UI.classesAssociadas];
    },
    async adicionarClasseUI() {
      this.alertOn = false;

      if (this.$refs.addRel.validate()) {
        if (!(await this.validateUI())) {
          this.UI_clone.classesAssociadas.push({
            codigo: this.cod,
            tipo: this.tipoClasse
          });

          this.$refs.addRel.reset();
        } else {
          this.alertOn = true;
        }
      }
    },
    validateUI: function() {
      return this.UI_clone.classesAssociadas.some(el => {
        return el.codigo == this.cod;
      });
    }
  }
};
</script>