<template>
  <v-dialog v-model="dialogState" persistent>
    <!-- <template v-slot:activator="{ on }">
      <v-btn color="#dee2f8" class="ma-2" v-on="on">
        <v-icon dark left>add</v-icon>Unidade de Instalação
      </v-btn>
    </template>-->
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
              <div class="info-label">Cota</div>
            </v-col>
            <v-col sm="2" md="2">
              <v-text-field solo clearable v-model="UI.codCota" label="Cota"></v-text-field>
            </v-col>

            <v-col md="2" sm="2">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="6" md="6">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                solo
                clearable
                v-model="UI.descricao"
                label="Descrição"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs="12" sm="3">
              <div class="info-label">Data Inicial da Documentação</div>
            </v-col>
            <v-col xs="12" sm="3">
              <SelecionarData
                label="Data Inicial"
                :d="UI.dataInicial"
                @dataSelecionada="UI.dataInicial = $event"
                :dataMinima="RE.dataInicial"
                :dataMaxima="RE.dataFinal"
              >
                <template v-slot:default="slotProps">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="slotProps.item.dataValor"
                    :label="slotProps.item.label"
                    prepend-icon="event"
                    readonly
                    v-on="slotProps.item.on"
                    solo
                  ></v-text-field>
                </template>
              </SelecionarData>
            </v-col>
            <v-col xs="12" sm="3">
              <div class="info-label">Data Final da Documentação</div>
            </v-col>
            <v-col xs="12" sm="3">
              <SelecionarData
                label="Data Inicial"
                :d="UI.dataFinal"
                @dataSelecionada="UI.dataFinal = $event"
                :dataMinima="RE.dataInicial"
                :dataMaxima="RE.dataFinal"
              >
                <template v-slot:default="slotProps">
                  <v-text-field
                    :rules="[v => data_final_valida(v, UI) || 'Campo obrigatório!']"
                    v-model="slotProps.item.dataValor"
                    :label="slotProps.item.label"
                    prepend-icon="event"
                    readonly
                    v-on="slotProps.item.on"
                    solo
                  ></v-text-field>
                </template>
              </SelecionarData>
            </v-col>
          </v-row>
          <EntidadesProdutoras :newSerie="UI.produtor" :RE="RE" />
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
                v-if="!!UI.classesAssociadas[0]"
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
                  <v-col sm="4" xs="12">
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
                      <template v-slot:item="{item}">
                        <img
                          v-if="item.tipo == 'Série'"
                          style="width:23px; height:30px"
                          :src="svg_sr"
                        />
                        <img
                          v-else-if="item.tipo == 'Subsérie'"
                          style="width:23px; height:30px"
                          :src="svg_ssr"
                        />
                        <span style="padding-left: 20px;">{{ item.searchField }}</span>
                      </template>
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
                  <v-col sm="5" xs="12">
                    <v-text-field
                      :rules="[v => !!v || 'Campo obrigatório para associar série/subsérie!']"
                      :disabled="iscodvalido"
                      solo
                      clearable
                      v-model="tituloClasse"
                      label="Título"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="2" xs="12">
                    <v-select
                      :rules="[v => !!v || 'Campo obrigatório para associar série/subsérie!']"
                      :disabled="iscodvalido"
                      label="Série / Subsérie"
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
                    <v-btn text rounded @click="adicionarClasseUI(UI)">
                      <v-icon size="35" color="green lighten-1">add_circle</v-icon>
                    </v-btn>
                    <v-btn text rounded @click="$refs.addRel.reset()">
                      <v-icon size="35" color="red lighten-1">delete_sweep</v-icon>
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
          <v-row>
            <v-col md="2" sm="2">
              <div class="info-label">Notas</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field solo clearable v-model="UI.notas" label="Notas"></v-text-field>
            </v-col>
            <v-col md="2" sm="2">
              <div class="info-label">Localização</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field solo clearable v-model="UI.localizacao" label="Localização"></v-text-field>
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
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="guardar">Criar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EntidadesProdutoras from "@/components/rada/criacao/classes/partes/EntidadesProdutoras.vue";
import SelecionarData from "@/components/generic/SelecionarData";

import mixin_unidade_instalacao from "@/mixins/rada/mixin_unidade_instalacao";

export default {
  props: ["UIs", "RE", "classes", "dialog", "UI_para_copiar"],
  components: {
    EntidadesProdutoras,
    SelecionarData
  },
  mixins: [mixin_unidade_instalacao],
  data: () => ({
    UI: null
  }),
  methods: {
    remove(item) {
      this.UI.classesAssociadas = this.UI.classesAssociadas.filter(e => {
        return e.codigo != item.codigo;
      });
    },
    apagar() {
      this.existe_erros = false;
      this.erros = [];

      this.UI = {
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
      };
      this.$refs.formUI.resetValidation();
    },
    guardar() {
      this.existe_erros = false;
      this.erros = [];

      if (this.$refs.formUI.validate()) {
        // Alterei await aqui
        this.adicionarClasse();
        this.UI.classesAssociadas.forEach(
          associacao => delete associacao.titulo
        );
        this.UIs.push(Object.assign({}, this.UI));
        this.dialogState = false;
        // this.apagar();
      } else {
        if (!this.UI.codigo || this.UIs.some(e => e.codigo == this.UI.codigo)) {
          this.erros.push("Código;");
        }
        this.recolherErros(this.UI);
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
          classe.UIs.push(this.UI.codigo);
        } else {
          if (this.UI.classesAssociadas[i].tipo == "Série") {
            this.classes.push({
              codigo: this.UI.classesAssociadas[i].codigo,
              titulo: this.UI.classesAssociadas[i].titulo,
              tipo: "Série",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              tUA: null,
              tSerie: null,
              suporte_e_medicao: [{ suporte: null, medicao: null }],
              localizacao: [],
              UIs: [this.UI.codigo],
              entProdutoras: [],
              tipologiasProdutoras: [],
              legislacao: [],
              relacoes: [],
              pca: null,
              notaPCA: null,
              notaDF: null,
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: null,
              justificacaoDF: [],
              eFilhoDe: null
            });
          } else {
            this.classes.push({
              codigo: this.UI.classesAssociadas[i].codigo,
              titulo: this.UI.classesAssociadas[i].titulo,
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              relacoes: [],
              pca: null,
              notaPCA: null,
              notaDF: null,
              UIs: [this.UI.codigo],
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: null,
              justificacaoDF: [],
              eFilhoDe: null,
              tipo: "Subsérie"
            });
          }
        }
      }
    }
  },
  created() {
    this.UI =
      this.UI_para_copiar != null
        ? this.UI_para_copiar
        : {
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
          };
  },
  beforeDestroy() {
    this.$emit("limpar_copia");
  }
};
</script>
