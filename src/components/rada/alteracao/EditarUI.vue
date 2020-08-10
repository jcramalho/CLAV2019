<template>
  <v-dialog v-model="dialogState" persistent max-width="90%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>Editar Unidade de Instalação: {{ UI_clone.codigo + " - " + UI_clone.titulo}}</b>
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
                <v-btn
                  class="ma-3 pa-3"
                  color="indigo darken-4"
                  dark
                  @click="toDelete = false"
                >Voltar</v-btn>
                <v-btn class="ma-3 pa-5" color="red darken-4" dark @click="eliminarUI">Sim</v-btn>
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
              <div class="info-label">Cota</div>
            </v-col>
            <v-col sm="2" md="2">
              <v-text-field solo clearable v-model="UI_clone.codCota" label="Cota"></v-text-field>
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
              <SelecionarData
                label="Data Inicial"
                :d="UI_clone.dataInicial"
                @dataSelecionada="UI_clone.dataInicial = $event"
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
                :d="UI_clone.dataFinal"
                label="Data Final"
                @dataSelecionada="UI_clone.dataFinal = $event"
                :dataMinima="RE.dataInicial"
                :dataMaxima="RE.dataFinal"
              >
                <template v-slot:default="slotProps">
                  <v-text-field
                    :rules="[v => data_final_valida(v, UI_clone) || 'Campo obrigatório!']"
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
          <EntidadesProdutoras :newSerie="UI_clone.produtor" :RE="RE" :editar="true" />
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
                  <v-col cols="4" xs="12">
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
                  <v-col sm="6" xs="12">
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
                          <v-avatar left>
                            <img
                              v-if="data.item == 'Série'"
                              style="width:23px; height:30px"
                              :src="svg_sr"
                            />
                            <img
                              v-if="data.item == 'Subsérie'"
                              style="width:23px; height:30px"
                              :src="svg_ssr"
                            />
                          </v-avatar>
                          {{ data.item }}
                        </v-chip>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="text-right">
                    <v-btn
                      @click="adicionarClasseUI(UI_clone)"
                      color="green lighten-1"
                      style="margin-left: 10px"
                      dark
                    >Clique para associar série/subsérie à unidade de instalação</v-btn>
                    <v-btn
                      style="margin-left: 10px"
                      dark
                      color="red darken-4"
                      @click="$refs.addRel.reset()"
                    >Limpar</v-btn>
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
              <v-text-field solo clearable v-model="UI_clone.notas" label="Notas"></v-text-field>
            </v-col>
            <v-col md="2" sm="2">
              <div class="info-label">Localização</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field solo clearable v-model="UI_clone.localizacao" label="Localização"></v-text-field>
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
        <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
        <v-btn color="indigo darken-4" dark @click="guardar">Atualizar</v-btn>
        <v-btn @click="toDelete = true" dark color="red darken-4">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EntidadesProdutoras from "@/components/rada/criacao/classes/partes/EntidadesProdutoras.vue";
import SelecionarData from "@/components/generic/SelecionarData";

import mixin_unidade_instalacao from "@/mixins/rada/mixin_unidade_instalacao";

export default {
  props: ["UI_clone", "RE", "classes", "dialog"],
  data: () => ({
    toDelete: false,
  }),
  components: {
    EntidadesProdutoras,
    SelecionarData,
  },
  mixins: [mixin_unidade_instalacao],
  methods: {
    remove(item) {
      this.UI_clone.classesAssociadas = this.UI_clone.classesAssociadas.filter(
        (e) => {
          return e.codigo != item.codigo;
        }
      );
    },
    elimina_de_classe(classe_eliminada, codigo_UI) {
      let classe = this.classes.find((cl) => cl.codigo == classe_eliminada);

      classe.UIs = classe.UIs.filter((e) => e != codigo_UI);
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
    async guardar() {
      this.existe_erros = false;
      this.erros = [];

      if (this.$refs.formUI.validate() && (await this.validaDatas())) {
        this.$emit("atualizar");
      } else {
        this.recolherErros(this.UI_clone);
      }
    },
    validaDatas() {
      try {
        let data_inicial = new Date(this.UI_clone.dataInicial);
        let data_final = new Date(this.UI_clone.dataFinal);
        let r = true;

        for (let i = 0; i < this.UI_clone.classesAssociadas.length; i++) {
          let classe = this.classes.find(
            (e) => e.codigo == this.UI_clone.classesAssociadas[i].codigo
          );

          if (classe != undefined) {
            if (
              !(
                (!!classe.dataInicial
                  ? new Date(classe.dataInicial) <= data_inicial
                  : true) &&
                (!!classe.dataFinal
                  ? new Date(classe.dataFinal) >= data_final
                  : true)
              )
            ) {
              r = false;
              this.erros.push(
                "Datas da classe associada " +
                  classe.codigo +
                  " é entre " +
                  classe.dataInicial +
                  " e " +
                  classe.dataFinal
              );
            }
          }
        }
        return r;
      } catch (e) {
        return false;
      }
    },
  },
};
</script>