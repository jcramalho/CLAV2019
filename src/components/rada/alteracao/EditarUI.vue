<template>
  <v-dialog v-model="dialogState" persistent>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>Editar Unidade de Instalação: {{ UI_clone.codigo + " - " + UI_clone.titulo}}</b>
        <v-spacer />
        <v-icon @click="toDelete = true" dark color="red" right>delete_sweep</v-icon>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-dialog v-model="toDelete" width="50%">
            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >Pretende mesmo eliminar a unidade de instalação: {{ UI_clone.codigo + " - " + UI_clone.titulo}}?</v-card-title>

              <v-card-text align="center">
                <br />
                <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
                <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarUI">Sim</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
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
            <v-col md="2" sm="2">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="6" md="6">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.descricao"
                label="Descrição"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs="12" sm="3">
              <div class="info-label">Data Inicial da Documentação</div>
            </v-col>
            <v-col xs="12" sm="3">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :return-value.sync="UI_clone.dataInicial"
                transition="scale-transition"
                max-width="290px"
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
                <v-date-picker
                  v-model="UI_clone.dataInicial"
                  color="amber accent-3"
                  full-width
                  scrollable
                  locale="pt"
                  :min="RE.dataInicial"
                  :max="RE.dataFinal"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu1 = false">
                    <v-icon>keyboard_backspace</v-icon>
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu1.save(UI_clone.dataInicial)">
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col xs="12" sm="3">
              <div class="info-label">Data Final da Documentação</div>
            </v-col>
            <v-col xs="12" sm="3">
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :return-value.sync="UI_clone.dataFinal"
                transition="scale-transition"
                max-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => data_final_valida(v) || 'Campo obrigatório!']"
                    v-model="UI_clone.dataFinal"
                    label="Data Final"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="UI_clone.dataFinal"
                  color="amber accent-3"
                  full-width
                  scrollable
                  locale="pt"
                  :min="RE.dataInicial"
                  :max="RE.dataFinal"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false">
                    <v-icon>keyboard_backspace</v-icon>
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(UI_clone.dataFinal)">
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <EntidadesProdutoras :newSerie="UI_clone.produtor" :RE="RE" />
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <v-row>
            <v-col md="3" sm="2">
              <div class="info-label">Série/Subsérie</div>
            </v-col>
            <v-col md="9" sm="9">
              <!-- {{ UI_clone.classesAssociadas }} -->
              <v-data-table
                :headers="headers"
                :items="UI_clone.classesAssociadas"
                hide-default-footer
                v-if="!!UI_clone.classesAssociadas[0]"
              >
                <template v-slot:item.codigo="props">
                  <img
                    v-if="props.item.tipo == 'Série'"
                    style="width:23px; height:30px"
                    :src="svg_sr"
                  />
                  <img
                    v-else-if="props.item.tipo == 'Subsérie'"
                    style="width:23px; height:30px"
                    :src="svg_ssr"
                  />
                  {{ props.item.codigo + " - " + props.item.titulo }}
                </template>
                <template v-slot:item.edicao="props">
                  <td>
                    <v-icon color="red darken-2" dark @click="remove(props.item)">remove_circle</v-icon>
                  </td>
                </template>
              </v-data-table>

              <v-alert
                dense
                v-else
                :value="true"
                icon="warning"
                color="amber accent-3"
              >Não tem séries/subséries selecionadas...</v-alert>
            </v-col>
          </v-row>
          <v-card outlined>
            <div class="info-label">Associar Série/Subsérie</div>

            <v-card-text>
              <!-- FORMULÁRIO PARA NOVA CLASSE -->
              <v-form ref="addRel" :lazy-validation="false">
                <v-row>
                  <v-col sm="3" xs="12">
                    <v-combobox
                      :rules="[v => eCodigoClasseValido(v) || !!v || 'Campo obrigatório para associar série/subsérie!']"
                      v-model="cod"
                      :items="classes_processadas"
                      label="Código"
                      item-text="searchField"
                      item-value="codigo"
                      :return-object="false"
                      solo
                      clearable
                      chips
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              Classe
                              <strong>Série</strong> e
                              <strong>Subsérie</strong> em questão não existe no sistema!
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              Pode criar aqui uma nova classe Série ou Subsérie.
                              Para tal, escreva código da nova classe e prima a tecla
                              <i>"Enter"</i>. Posteriormente preencha os restantes campos.
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col sm="6" xs="12">
                    <v-text-field
                      :rules="[v => !!v || 'Campo obrigatório para associar série/subsérie!']"
                      :disabled="iscodvalido"
                      solo
                      clearable
                      v-model="tituloClasse"
                      label="Título da Série/Subsérie"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="2" xs="12">
                    <v-select
                      :rules="[v => !!v || 'Campo obrigatório para associar série/subsérie!']"
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
                    <v-btn text rounded @click="adicionarClasseUI">
                      <v-icon color="green lighten-1">add_circle</v-icon>
                    </v-btn>
                    <v-btn text rounded @click="$refs.addRel.reset()">
                      <v-icon color="red lighten-1">delete_sweep</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="!!alertOn">
                  <v-col>
                    <v-alert dismissible dense text type="error">Associação já existente!</v-alert>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <v-row>
            <v-col md="2" sm="2">
              <div class="info-label">Notas</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.notas"
                label="Notas"
              ></v-text-field>
            </v-col>
            <v-col md="2" sm="2">
              <div class="info-label">Localização</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI_clone.localizacao"
                label="Localização"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-alert width="100%" :value="existe_erros" outlined type="error" prominent border="left">
          É necessário preencher os campos seguintes:
          <ul>
            <li v-for="(erro, i) in erros" :key="i">{{erro}}</li>
          </ul>
        </v-alert>
        <v-spacer></v-spacer>

        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="guardar">Atualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EntidadesProdutoras from "@/components/rada/criacao/classes/partes/EntidadesProdutoras.vue";

export default {
  props: ["UI_clone", "RE", "classes", "dialog"],
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    toDelete: false,
    menu1: false,
    menu2: false,
    cod: null,
    existe_erros: false,
    classes_processadas: [],
    erros: [],
    iscodvalido: false,
    tituloClasse: null,
    tipoClasse: null,
    alertOn: false,
    headers: [
      {
        text: "Série/Subsérie Associada",
        align: "center",
        value: "codigo",
        width: "95%",
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
  components: {
    EntidadesProdutoras
  },
  watch: {
    cod: function(novo, old) {
      let c = this.classes.find(e => e.codigo == novo);

      if (c != undefined) {
        this.iscodvalido = true;
        this.tituloClasse = c.titulo;
        this.tipoClasse = c.tipo;
      } else {
        this.iscodvalido = false;
      }
    }
  },
  methods: {
    async adicionarClasseUI() {
      this.alertOn = false;

      if (this.$refs.addRel.validate()) {
        if (!(await this.validateUI())) {
          this.UI_clone.classesAssociadas.push({
            codigo: this.cod,
            tipo: this.tipoClasse,
            titulo: this.tituloClasse
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
    },
    eCodigoClasseValido(v) {
      if (
        this.classes.some(
          e =>
            e.codigo == v &&
            (e.dataInicial === undefined || e.dataInicial != null)
        )
      ) {
        return "Impossível criar associação, altere o código!";
      } else {
        return false;
      }
    },
    remove(item) {
      this.UI_clone.classesAssociadas = this.UI_clone.classesAssociadas.filter(
        e => {
          return e.codigo != item.codigo;
        }
      );
    },
    data_final_valida(v) {
      if (!!v) {
        if (this.UI_clone.dataInicial != null) {
          let data_inicial = new Date(this.UI_clone.dataInicial);
          let data_final = new Date(v);

          if (data_inicial > data_final) {
            return "Data final inválida! É anterior à data inicial.";
          }
        }
        return true;
      }
      return false;
    },
    elimina_de_classe(classe_eliminada, codigo_UI) {
      let classe = this.classes.find(cl => cl.codigo == classe_eliminada);

      classe.UIs = classe.UIs.filter(e => e != codigo_UI);
    },
    eliminarUI() {
      for (let i = 0; i < this.UI_clone.classesAssociadas.length; i++) {
        this.elimina_de_classe(
          this.UI_clone.classesAssociadas[i].codigo,
          this.UI_clone.codigo
        );
      }
      this.$emit("remover", this.UI_clone.codigo);
      this.dialogState = false;
    },
    recolherErros() {
      this.existe_erros = true;

      if (!this.UI_clone.titulo) {
        this.erros.push("Título;");
      }

      if (!this.UI_clone.codCota) {
        this.erros.push("Código Cota;");
      }

      if (!this.UI_clone.dataInicial || !this.UI_clone.dataFinal) {
        this.erros.push("Datas;");
      }

      if (
        !!this.UI_clone.produtor.entProdutoras[0] == false &&
        !!this.UI_clone.produtor.tipologiasProdutoras[0] == false
      ) {
        this.erros.push("Produtoras;");
      }

      if (!!this.UI_clone.classesAssociadas[0] == false) {
        this.erros.push("Classes Associadas;");
      }
      if (!this.UI_clone.descricao) {
        this.erros.push("Descrição;");
      }

      if (!this.UI_clone.notas) {
        this.erros.push("Notas;");
      }
      if (!this.UI_clone.localizacao) {
        this.erros.push("Localização;");
      }

      // if (!Boolean(this.erros[0])) {
      //   this.erros.push("Datas Inválidas;");
      // }
    },
    async guardar() {
      this.existe_erros = false;
      this.erros = [];

      if (this.$refs.formUI.validate()) {
        this.$emit("atualizar");
      } else {
        this.recolherErros();
      }
    }
  },
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  },
  created() {
    this.classes_processadas = this.classes
      .filter(
        e =>
          (e.tipo == "Série" || e.tipo == "Subsérie") && e.dataInicial == null
      )
      .map(e => {
        return {
          codigo: e.codigo,
          searchField: e.codigo + " - " + e.titulo
        };
      });
  }
};
</script>