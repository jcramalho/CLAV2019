<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn color="#dee2f8" class="ma-2" v-on="on">
        <v-icon dark left>add</v-icon>Unidade de Instalação
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">Adicionar Unidade de Instalação</v-card-title>
      <br />

      <v-card-text>
        <v-form ref="formUI" :lazy-validation="false">
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                :rules="[v => verificaCodigoUI(v) || !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI.codigo"
                label="Código"
              ></v-text-field>
            </v-col>
            <v-col md="3" sm="3">
              <div class="info-label">Titulo</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI.titulo"
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
                v-model="UI.codCota"
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
                :return-value.sync="UI.dataInicial"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="UI.dataInicial"
                    label="Data Inicial"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker v-model="UI.dataInicial" no-title scrollable locale="pt">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu1 = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.menu1.save(UI.dataInicial)">OK</v-btn>
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
                :return-value.sync="UI.dataFinal"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="UI.dataFinal"
                    label="Data Final"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker v-model="UI.dataFinal" no-title scrollable locale="pt">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(UI.dataFinal)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <EntidadesProdutoras :newSerie="UI.produtor" :RE="RE" />
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <!-- {{classesUI}}
          {{UI.classesAssociadas}}-->
          <v-row>
            <v-col md="4" sm="4">
              <div class="info-label">Série/Subsérie</div>
            </v-col>
            <v-col md="8" sm="8">
              <v-data-table
                :headers="headers"
                :items="UI.classesAssociadas"
                hide-default-footer
                v-if="UI.classesAssociadas[0]"
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
                v-model="UI.notas"
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
                v-model="UI.localizacao"
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
                v-model="UI.descricao"
                label="Descrição"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="guardar">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EntidadesProdutoras from "@/components/rada/criacao/classes/partes/EntidadesProdutoras.vue";

export default {
  props: ["UIs", "RE", "classes"],
  components: {
    EntidadesProdutoras
  },
  computed: {
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
    menu1: false,
    menu2: false,
    alertOn: false,
    iscodvalido: false,
    tipoClasse: null,
    dialog: false,
    cod: null,
    UI: {
      codigo: "",
      codCota: "",
      titulo: "",
      dataInicial: null,
      dataFinal: null,
      produtor: {
        tipologiasProdutoras: [],
        entProdutoras: []
      },
      classesAssociadas: [],
      descricao: "",
      notas: "",
      localizacao: ""
    },
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
    remove: function(item) {
      this.UI.classesAssociadas = this.UI.classesAssociadas.filter(e => {
        return e.codigo != item.codigo;
      });
    },
    apagar: function() {
      this.$refs.formUI.reset();
      this.UI.produtor = {
        tipologiasProdutoras: [],
        entProdutoras: []
      };
      this.UI.classesAssociadas = [];
    },
    guardar: function() {
      if (this.$refs.formUI.validate()) {
        // Alterei await aqui
        this.adicionarClasse();
        this.UIs.push(Object.assign({}, this.UI));
        this.dialog = false;
        this.apagar();
      }
    },
    verificaCodigoUI(v) {
      if (this.UIs.some(e => e.codigo == v)) {
        return "Código já existente!";
      } else {
        return false;
      }
    },
    adicionarClasse() {
      for (let i = 0; i < this.UI.classesAssociadas.length; i++) {
        let classe = this.classes.find(
          e => e.codigo == this.UI.classesAssociadas[i].codigo
        );

        if (classe != undefined) {
          classe.UIs.push({
            codigo: this.UI.codigo
          });
        } else {
          if (this.UI.classesAssociadas[i].tipo == "Série") {
            this.classes.push({
              codigo: this.UI.classesAssociadas[i].codigo,
              titulo: "",
              tipo: "Série",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              tUA: "",
              tSerie: "",
              suporte: "",
              medicao: "",
              localizacao: [],
              UIs: [{ codigo: this.UI.codigo }],
              entProdutoras: [],
              tipologiasProdutoras: [],
              legislacao: [],
              relacoes: [],
              pca: "",
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: "",
              justificacaoDF: "",
              notas: "",
              eFilhoDe: ""
            });
          } else {
            this.classes.push({
              codigo: this.UI.classesAssociadas[i].codigo,
              titulo: "",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              relacoes: [],
              pca: "",
              UIs: [{ codigo: this.UI.codigo }],
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: "",
              justificacaoDF: "",
              notas: "",
              eFilhoDe: "",
              tipo: "Subsérie"
            });
          }
        }
      }
    },
    async adicionarClasseUI() {
      if (this.$refs.addRel.validate()) {
        if (!(await this.validateUI())) {
          this.UI.classesAssociadas.push({
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
      return this.UI.classesAssociadas.some(el => {
        return el.codigo == this.cod;
      });
    }
  }
};
</script>
