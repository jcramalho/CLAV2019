<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text mb-4" dark>
      <v-icon color="white" class="ma-1">create</v-icon>
      Editar o campo:
      {{ campo.nome }}
    </v-card-title>

    <!-- Se o pedido for uma Entidade -->
    <v-card-text v-if="tipoPedido === 'Entidade'">
      <v-row v-if="campo.key === 'designacao'">
        <v-col cols="2">
          <div class="info-label">
            Nome da Entidade
          </div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="Nome da Entidade"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'sigla'">
        <v-col cols="2">
          <div class="info-label">
            Sigla
          </div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="Sigla"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'internacional'">
        <v-col cols="2">
          <div class="info-label">Internacional</div>
        </v-col>
        <v-col>
          <v-select
            v-model="valorEditado"
            :items="internacionalItems"
            label="Selecione uma opção"
            item-color="indigo"
            color="indigo"
            filled
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'sioe'">
        <v-col cols="2">
          <div class="info-label">SIOE</div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="SIOE"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'dataCriacao'">
        <v-col cols="2">
          <div class="info-label">Data de criação</div>
        </v-col>
        <v-col>
          <SelecionarData
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="valorEditado = $event"
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'dataExtincao'">
        <v-col cols="2">
          <div class="info-label">Data de extinção</div>
        </v-col>
        <v-col>
          <SelecionarData
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="valorEditado = $event"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Se o pedido for uma Tipologia -->
    <v-card-text v-if="tipoPedido === 'Tipologia'">
      <v-row v-if="campo.key === 'designacao'">
        <v-col cols="2">
          <div class="info-label">Nome da Tipologia</div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="Nome da Tipologia"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'sigla'">
        <v-col cols="2">
          <div class="info-label">Sigla</div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            clearable
            color="indigo"
            outlined
            single-line
            v-model="valorEditado"
            label="Sigla"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Se o pedido for uma Legislação-->
    <v-card-text v-if="tipoPedido === 'Legislação'">
      <v-row v-if="campo.key === 'tipo'">
        <v-col cols="2">
          <div class="info-label">Tipo de diploma</div>
        </v-col>
        <v-col>
          <v-select
            filled
            item-color="indigo"
            outlined
            color="indigo"
            v-model="valorEditado"
            :items="tiposDiploma"
            label="Selecione uma opção"
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'numero'">
        <v-col cols="2">
          <div class="info-label">Número de diploma</div>
        </v-col>
        <v-col>
          <v-text-field
            filled
            label="Número do diploma"
            clearable
            color="indigo"
            single-line
            v-model="valorEditado"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'data'">
        <v-col cols="2">
          <div class="info-label">Data do diploma</div>
        </v-col>
        <v-col>
          <SelecionarData
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="valorEditado = $event"
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'sumario'">
        <v-col cols="2">
          <div class="info-label">Sumário</div>
        </v-col>
        <v-col>
          <v-textarea
            auto-grow
            filled
            label="Sumário"
            clearable
            color="indigo"
            v-model="valorEditado"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'link'">
        <v-col cols="2">
          <div class="info-label">Link</div>
        </v-col>
        <v-col>
          <v-text-field
            v-model="valorEditado"
            filled
            label="Link"
            clearable
            color="indigo"
            single-line
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'diplomaFonte'">
        <v-col cols="2">
          <div class="info-label">Tipo de fonte de legitimação</div>
        </v-col>
        <v-col>
          <v-select
            filled
            label="Selecione uma opção"
            item-color="indigo"
            color="indigo"
            v-model="valorEditado"
            :items="diplomaFonteItems"
            dense
          />
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'dataRevogacao'">
        <v-col cols="2">
          <div class="info-label">
            Data de revogação
          </div>
        </v-col>
        <v-col>
          <SelecionarData
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="valorEditado = $event"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text
      v-if="tipoPedido === 'Classe_N1' || 'Classe_N2' || 'Classe_N3'"
    >
      <v-row v-if="campo.key === 'nivel'">
        <v-col cols="2">
          <div class="info-label">
            Nivel
          </div>
        </v-col>
        <v-col>
          <v-text-field
            class="text-field"
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="Nivel"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="campo.key === 'codigo'">
        <v-col cols="2">
          <div class="info-label">
            Codigo
          </div>
        </v-col>
        <v-col>
          <v-text-field
            class="text-field"
            filled
            clearable
            color="indigo"
            outlined
            single-line
            v-model="valorEditado"
            label="codigo"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="campo.key === 'titulo'">
        <v-col cols="2">
          <div class="info-label">
            Título
          </div>
        </v-col>
        <v-col>
          <v-text-field
            class="text-field"
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="titulo"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="campo.key === 'descricao'">
        <v-col cols="2">
          <div class="info-label">
            Descrição
          </div>
        </v-col>
        <v-col>
          <v-text-field
            class="text-field"
            filled
            clearable
            outlined
            color="indigo"
            single-line
            v-model="valorEditado"
            label="titulo"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="campo.key === 'tipoProc'">
        <v-col cols="2">
          <div class="info-label">
            Tipo de Processo
          </div>
        </v-col>
        <v-col>
          <v-radio-group v-model="valorEditado" row>
            <v-radio
              v-for="(p, i) in tipoProc"
              :key="i"
              :label="p.label"
              :value="p.value"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row v-if="campo.key === 'procTrans'">
        <v-col cols="2">
          <div class="info-label">
            Processo Transversal
          </div>
        </v-col>
        <v-col>
          <v-radio-group v-model="valorEditado" row>
            <v-radio
              v-for="(p, i) in procTrans"
              :key="i"
              :label="p.label"
              :value="p.value"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="fechar()">
        Cancelar
      </v-btn>

      <v-btn color="indigo accent-4 white--text" rounded @click="editar()">
        Editar
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="erroDialog" width="50%">
      <v-card>
        <v-card-title class="warning title white--text" dark>
          <v-icon color="white" class="ma-1">warning</v-icon>
          Aviso
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="3">
              <div class="info-label">Mensagem</div>
            </v-col>
            <v-col>
              <div class="info-content">O campo não pode estar vazio.</div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="indigo accent-4" rounded dark @click="fecharDialog()">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
export default {
  props: ["campo", "tipoPedido"],

  components: {
    SelecionarData
  },

  data() {
    return {
      tiposDiploma: [],
      internacionalItems: ["Sim", "Não"],
      diplomaFonteItems: ["Não especificada", "PGD", "PGD/LC", "RADA"],
      tipoProc: [
        { label: "Processo Comum", value: "PC" },
        { label: "Processo Específico", value: "PE" }
      ],
      procTrans: [
        { label: "Sim", value: "S" },
        { label: "Não", value: "N" }
      ],
      valorEditado: "",
      erroDialog: false
    };
  },

  created() {
    this.loadTipoDiploma();
  },

  computed: {
    valorAtual() {
      return this.campo.valorAtual;
    }
  },

  watch: {
    valorAtual(novoValor, antigoValor) {
      if (novoValor !== null && novoValor !== undefined)
        this.valorEditado = novoValor;
      else this.valorEditado = "";
    }
  },

  mounted() {
    if (this.valorAtual !== null && this.valorAtual !== undefined)
      this.valorEditado = this.valorAtual;
    else this.valorEditado = "";
  },

  methods: {
    async loadTipoDiploma() {
      try {
        let response = await this.$request(
          "get",
          "/vocabularios/vc_tipoDiplomaLegislativo"
        );
        for (let i = 0; i < response.data.length; i++) {
          this.tiposDiploma[i] = response.data[i].termo;
        }
        this.tiposDiploma.sort();
      } catch (error) {
        return error;
      }
    },

    fechar() {
      this.$emit("fechar", this.campo.key);
    },

    editar() {
      if (this.valorEditado === "" || this.valorEditado === null) {
        this.erroDialog = true;
      } else if (this.valorAtual !== this.valorEditado) {
        this.$emit("editarCampo", {
          dados: this.valorEditado,
          campo: this.campo
        });
      } else {
        this.fechar();
      }
    },

    fecharDialog() {
      if (this.valorAtual !== null && this.valorAtual !== undefined)
        this.valorEditado = this.valorAtual;

      this.erroDialog = false;
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
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

.text-field {
  border-top: 0.9px solid #97999c;
}
</style>
