<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE CARACTERIZAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        3.  Caracterização do sistema de informação (SI)
        <InfoBox header="Caracterização SI" :text="myhelp"  helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de referência SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.caracterizacao.nRef"
            label="Identificador do sistema de informação"
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Nome do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.caracterizacao.nomeSI"
            label="Designação oficial do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <hr style="border: 3px solid indigo; border-radius: 2px;" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Nível de dependência do Software</div>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="9"
        >
          <v-select
            :items="dependenciaSoft"
            label="Indique nível de dependência para com fornecedores privados"
            v-model="c.caracterizacao.dependenciaSoft"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Modelo de crescimento</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="modeloCres"
            label="Indique o modelo de adição de dados ao sistema"
            v-model="modeloCresCheck"
            dense
            solo
          ></v-select>
          <span>{{c.caracterizacao.modeloCres}}</span>
          <div v-if="modeloCresCheck ==='Outra situação'">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.caracterizacao.modeloCres"
              label="Indique qual"
              solo
              clearable
            ></v-text-field>
          </div>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Dimensão atual</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.caracterizacao.dimensao"
              label="Indique a dimensão em unidades binárias (Gb)."
              solo
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Crescimento anual</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="c.caracterizacao.crescimento"
              label="Indique a dimensão em unidades binárias (Gb)."
              solo
              clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Localização de Sistema</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="localSistema"
            label="Indique se os sistemas estão sediados num ponto central ou dispersos"
            v-model="c.caracterizacao.localSistema"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sala técnica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="c.caracterizacao.salaTec" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Acesso reservado a sala técnica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="c.caracterizacao.acessoSalaTec" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sistemas de energia redundantes</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="c.caracterizacao.energiaRed" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Energia socorrida</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
           <v-radio-group v-model="c.caracterizacao.energiaSoc" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Sistema de alarme e extinção de incêndio</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="alarme"
            label="Indique se há segurança relativamente a incêndios"
            v-model="c.caracterizacao.alarme"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Climatização dedicada</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.climatizacao" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Utilização de métodos de prevenção ou mitigação de malware e outras ciberameaças</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="seguranca"
            label="Indique se existe algum tipo de proteção"
            v-model="c.caracterizacao.seguranca"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Comunicação externa segura</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.comunicacaoEx" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Plano contingência</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="simNaoDesen"
            label="Indique se existe plano de contingência"
            v-model="c.caracterizacao.planoContingencia"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Plano para gerir mudança e evolução da plataforma tecnológica</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="simNaoDesen"
            label="Indique se existe plano para gerir mudança e evolução da plataforma"
            v-model="c.caracterizacao.planoMudEvolucao"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Privilégios de acesso</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.privAcesso" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Categorias de segurança dos dados</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="catSegDados"
            label="Indique se a informação residente nos sistemas tem algum tipo de classificação de segurança"
            v-model="c.caracterizacao.catSegDados"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Rotinas de auditoria configuradas</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.rotinaAuditoria" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Logs das rotinas periodicamente analisados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.logsRotinas" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Integridade da informação do sistema</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="integridadeInfo"
            label="Indique como a integridade da informação contida no sistema é verificada"
            v-model="c.caracterizacao.integridadeInfo"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Armazenamento dedicado</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="armazenamento"
            label="Indique se a organização dispõe de armazenamento com maior ou menor grau de sofisticação"
            v-model="c.caracterizacao.armazenamento"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Replicação de dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.replicacaoDados" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Backups regulares</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="backupsRegular"
            label="Indique se são produzidos backups regularmente"
            v-model="c.caracterizacao.backupsRegular"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Modelo do backup</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="modeloBackup"
            label="Indique o tipo do modelo do backup"
            v-model="c.caracterizacao.modeloBackup"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Qualidade do backup</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="integridadeInfo"
            label="Indique se a qualidade do backup é testada"
            v-model="c.caracterizacao.qualidadeBackup"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Inventário de Software</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="inventario"
            label="Indique a metainformção e documentação do sistema"
            v-model="c.caracterizacao.inventarioSoft"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Inventário de HardWare</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="inventario"
            label="Indique a metainformção e documentação do sistema"
            v-model="c.caracterizacao.inventarioHard"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Documentação dos sistemas</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="documentacaoSis"
            label="Indique a metainformção e documentação do sistema"
            v-model="c.caracterizacao.documentacaoSis"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Documentação de procedimentos</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="documentacaoProc"
            label="Indique se os procedimentos técnicos informáticos de manutenção são facilmente acessíveis pelo pessoal TIC"
            v-model="c.caracterizacao.documentacaoProc"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Controlo de versões</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="c.caracterizacao.controlVersaoDProc" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Contratos de manutenção</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="contratoAtivos"
            label="Indique se tem contratos de manutenção ativos"
            v-model="c.caracterizacao.contratoAtivos"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Plano recuperação de dados</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="planoRecuperacao"
            label="Indique se existe um plano de contingência em caso de paragem programada ou intempestiva de sistema"
            v-model="c.caracterizacao.planoRecuperacao"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Notas</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-textarea
              v-model="c.caracterizacao.notas"
              label=""
              solo
              clearable
          ></v-textarea>
        </v-col>


        </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      simNao: ["Sim", "Não"],
      modeloCresCheck: "",

      myhelp: help,
      dependenciaSoft: ["Uso exclusivo de SW não proprietário",
                        "Uso de SW proprietário, mas com adequadas facilidades de exportação de dados",
                        "Uso de SW proprietário com especificações fechadas, e sem adequadas facilidades de exportação de dados"],
      modeloCres: ["Acumulção contínua - dados continuamente adicionados sem se proceder a expurgo",
                   "Substituição de dado - os dados são escritos por cima de registos anteriores criando diferentes versões de um registo qs quais podem ou não ser guardadas",
                   "Expurgo de registos que perdem utilidade operacional - periodicamente o sistema é purgado de dados que perdem utilidade operacional",
                   "Outra situação"],
      seguranca: ["Sim", "Não", "Em estudo"],
      simNaoDesen: ["Sim","Não","Em desenvolvimento"],
      integridadeInfo: ["Reativamente em resposta a incidentes","Proativamente de forma rotineira","Proativamente de forma aleatória","Não é verificada"],
      catSegDados: ["Sim. Para toda a informação do sistema", "Sim. Para alguma informação do sistema","Não"],
      armazenamento: ["Sim (NAS, CAS, SAN, outros)","Sim (arquivos óticos, e similares)","Não (informação reside em servidores, discos externos, etc)","Outros"],
      alarme: ["Sim há sistemas de alarme e extinção", "Não há sistemas de alarme ou extinção",
               "Há sistemas de alarme mas não de extinção", "Outros"],
      modeloBackup: ["Armazenamento","Incremental","Diferencial","Misto","Outro"],
      backupsRegular: ["Sim. De acordo com política formalizada", "Sim. Sem política formalizada","Sim. Backups aleatórios ou ocasionais", "Não"],
      localSistema: ["Centralizado","Descentralizado","Misto"],
      inventario: ["Sim","Não","Em construção"],
      documentacaoSis: ["Existe toda a documentação considerada necessária para a utilização, recuperação e salvagurda do sistema.",
                        "Existe alguma documentação mas não a consideramos suficiente para a utilização, recuperação ou salvagarda do sistema.",
                        "Existe apenas documentação comercial não personalizada para o sistema na organização.","Sistema não documentado."],
      documentacaoProc: ["Sim, todos", "Sim, alguns", "Não"],
      contratoAtivos: ["Sim", "Não", "N/A (Não aplicável. Manutenção assegurada internamente)"],
      planoRecuperacao: ["Sim", "Não", "Em planeamento"],
    };
  },

  methods: {

  }
};
</script>
<style>
.info-label {
  color: #2e7d32; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; 
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E; 
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
