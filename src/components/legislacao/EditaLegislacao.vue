<template>
  <v-card flat class="pa-3">
    <!-- Header -->
    <v-row align="center" justify="center">
      <v-col align="center" justify="center">
        <div class="clav-content-title-1">Alterar Diploma</div>
        <div class="clav-content-title-2">
          {{ legislacaoOriginal.tipo }} -
          {{ legislacaoOriginal.numero }}
        </div>
      </v-col>
    </v-row>

    <!-- Content -->
    <v-card-text class="ma-0 pa-0">
      <v-stepper v-model="etapa" vertical>
        <!-- Step 1 -->
        <v-stepper-step :complete="etapa > 1" step="1" editable>
          Escolha a operação
        </v-stepper-step>

        <v-stepper-content step="1">
          <div class="ma-4">
            <v-radio-group v-model="acao" row>
              <v-radio label="Editar" value="Alteração"></v-radio>
              <v-radio
                v-if="legislacao.estado === 'Ativo'"
                label="Revogar"
                value="Revogação"
              ></v-radio>
            </v-radio-group>
          </div>

          <v-btn rounded color="primary" @click="etapa = 2"> Continuar </v-btn>
        </v-stepper-content>

        <!-- Step 2 -->
        <v-stepper-step :complete="etapa > 2" step="2">{{ acao }}</v-stepper-step>

        <v-stepper-content step="2">
          <div v-if="acao === 'Alteração'">
            <Campo nome="Sumário" color="neutralpurple">
              <template v-slot:conteudo>
                <v-text-field
                  filled
                  clearable
                  single-line
                  hide-details
                  dense
                  v-model="legislacao.sumario"
                  label="Sumário"
                ></v-text-field>
              </template>
            </Campo>
            <Campo nome="Link" color="neutralpurple" class="mb-3">
              <template v-slot:conteudo>
                <v-text-field
                  v-model="legislacao.link"
                  filled
                  clearable
                  single-line
                  hide-details
                  dense
                  label="Link"
                ></v-text-field>
              </template>
            </Campo>

            <!-- Blocos expansivos -->
            <v-expansion-panels>
              <PainelCLAV titulo="Entidade responsável pela publicação" icon="mdi-bank">
                <template v-slot:conteudo>
                  <DesSelEnt
                    :entidades="entSel"
                    tipo="legislacao"
                    @unselectEntidade="unselectEntidade($event)"
                  />

                  <hr style="border-top: 1px dashed #dee2f8" />

                  <SelEnt
                    :entidadesReady="entidadesReady"
                    :entidades="entidades"
                    @selectEntidade="selectEntidade($event)"
                  />
                </template>
              </PainelCLAV>

              <!-- Segundo bloco expansivo -->

              <PainelCLAV
                titulo="Processos de negócio que regula ou enquadra"
                icon="mdi-inbox-multiple-outline"
              >
                <template v-slot:conteudo
                  ><DesSelProc
                    :processos="procSel"
                    @unselectProcesso="unselectProcesso($event)"
                  />

                  <hr style="border-top: 1px dashed #dee2f8" />

                  <SelProc
                    :processosReady="processosReady"
                    :processos="processos"
                    @selectProcesso="selectProcesso($event)"
                  />
                </template>
              </PainelCLAV>
            </v-expansion-panels>
          </div>

          <Campo v-else nome="Data de revogação" color="neutralpurple" class="mb-3">
            <template v-slot:conteudo>
              <SelecionarData
                :d="legislacao.dataRevogacao"
                :label="'Data: AAAA-MM-DD'"
                @dataSelecionada="legislacao.dataRevogacao = $event"
              />
            </template>
          </Campo>
        </v-stepper-content>
      </v-stepper>

      <!-- j  -->
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <!-- Painel Operações -->
    <PainelOpsLeg
      v-if="etapa === 2"
      :l="legislacao"
      :original="legislacaoOriginal"
      :acao="acao"
    />
  </v-card>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs.vue";
import SelProc from "@/components/generic/selecao/SelecionarPNs.vue";

import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";
import Voltar from "@/components/generic/Voltar";
import Campo from "@/components/generic/CampoCLAV";
import PainelCLAV from "@/components/generic/PainelCLAV";

export default {
  props: ["l"],

  components: {
    DesSelEnt,
    SelEnt,
    DesSelProc,
    SelProc,
    PainelOpsLeg,
    SelecionarData,
    Voltar,
    Campo,
    PainelCLAV,
  },

  data() {
    return {
      etapa: 1,
      legislacao: {
        numero: "",
        sumario: "",
        tipo: "",
        data: "",
        link: "",
        dataRevogacao: "",
        entidadesSel: [],
        processosSel: [],
      },
      legislacaoOriginal: {},
      acao: "Alteração",

      tiposDiploma: [],

      // Para o seletor de entidades
      entidades: [],
      entSel: [],
      entidadesReady: false,

      tipoReady: true,

      // Para o seletor de processos
      processos: [],
      procSel: [],
      processosReady: false,

      // para mostrar mensagens de erro
      snackbar: false,
      text: "",
    };
  },

  methods: {
    // Vai a API buscar todos os tipos de diplomas legislativos
    loadTipoDiploma: async function () {
      try {
        let response = await this.$request(
          "get",
          "/vocabularios/vc_tipoDiplomaLegislativo"
        );
        for (let i = 0; i < response.data.length; i++) {
          this.tiposDiploma[i] = response.data[i].termo;
        }
        this.tiposDiploma.sort();
        this.tipoReady = false;
      } catch (error) {
        return error;
      }
    },

    unselectEntidade: function (entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex((e) => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.legislacao.entidadesSel = this.entSel;
    },

    selectEntidade: function (entidade) {
      this.entSel.push(entidade);
      this.legislacao.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex((e) => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

    // Vai à API buscar todas as entidades
    loadEntidades: async function () {
      try {
        let response = await this.$request("get", "/entidades");
        this.entidades = response.data.map((item) => {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
          };
        });
        this.entidadesReady = true;
      } catch (error) {
        return error;
      }
    },

    unselectProcesso: function (processo) {
      // Recoloca o processo nos selecionáveis
      this.processos.push(processo);
      let index = this.procSel.findIndex((e) => e.id === processo.id);
      this.procSel.splice(index, 1);
      this.legislacao.processosSel = this.procSel;
    },

    selectProcesso: function (processo) {
      this.procSel.push(processo);
      this.legislacao.processosSel = this.procSel;
      // Remove dos selecionáveis
      let index = this.processos.findIndex((e) => e.id === processo.id);
      this.processos.splice(index, 1);
    },

    // Vai à API buscar todas as classes de nivel 3
    loadClasses: async function () {
      try {
        let response = await this.$request("get", "/classes?nivel=3");
        this.processos = response.data.map(function (item) {
          return {
            codigo: item.codigo,
            titulo: item.titulo,
            id: item.id.split("#")[1],
          };
        });
        this.processosReady = true;
      } catch (error) {
        return error;
      }
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
  },

  async created() {
    this.legislacao = JSON.parse(JSON.stringify(this.l));
    this.legislacaoOriginal = JSON.parse(JSON.stringify(this.l));

    await this.loadTipoDiploma();
    await this.loadEntidades();
    await this.loadClasses();

    try {
      if (this.legislacao.entidadesSel.length != 0) {
        this.legislacao.entidadesSel.forEach((ent) => {
          this.entSel.push(ent);

          // Remove dos selecionáveis
          let index = this.entidades.findIndex((e) => {
            return e.id === ent.id;
          });
          this.entidades.splice(index, 1);
        });
      }
    } catch (e) {
      this.text = "Erro ao carregar os dados, por favor tente novamente";
      this.snackbar = true;
    }

    try {
      if (this.legislacao.processosSel.length != 0) {
        this.legislacao.processosSel.forEach((proc) => {
          this.procSel.push(proc);

          // Remove dos selecionáveis
          let index = this.processos.findIndex((p) => p.id === proc.id);
          this.processos.splice(index, 1);
        });
      }
    } catch (e) {
      this.text = "Erro ao carregar os dados, por favor tente novamente";
      this.snackbar = true;
    }
  },
};
</script>

<style scoped></style>
