<template>
  <v-row>
    <div class="separador">Caracterização</div>
    <v-col cols="12" xs="12" sm="12">
        <div class="separadorMini">Dependência</div>
    </v-col>
    <v-col cols="12" xs="12" sm="3" >
      <div class="info-label">Nível de dependência do Software</div>
    </v-col>
    <v-col cols="12" xs="12" sm="9" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.dependenciaSoft"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Categoria dos dados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.categoriaDados"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Formatos</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.formatos"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12">
        <div class="separadorMini">Crescimento do</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Modelo de crescimento</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.modeloCres"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Dimensão atual</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.dimensao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Crescimento anual</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.crescimento"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12">
        <div class="separadorMini">Segurança geral da plataforma</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Localização de Sistema</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.localSistema"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Sala técnica</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.salaTec"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Acesso reservado a sala técnica</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.acessoSalaTec"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Sistemas de energia redundantes</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.energiaRed"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Energia socorrida</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.energiaSoc"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Sistema de alarme e extinção de incêndio</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.alarme"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Climatização dedicada</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.climatizacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Utilização de métodos de prevenção ou mitigação de malware e outras ciberameaças</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.seguranca"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Comunicação externa segura</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.comunicacaoEx"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Plano contingência</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.planoContingencia"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Plano para gerir mudança e evolução da plataforma tecnológica</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.planoMudEvolucao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12">
        <div class="separadorMini">Segurança específica dos sistemas</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Privilégios de acesso</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.privAcesso"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Categorias de segurança dos dados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.catSegDados"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Rotinas de auditoria configuradas</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.rotinaAuditoria"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Logs das rotinas periodicamente analisados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.logsRotinas"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Integridade da informação do sistema</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.integridadeInfo"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12">
        <div class="separadorMini">Armazenamento</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Armazenamento dedicado</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.armazenamento"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Replicação de dados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.replicacaoDados"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Backups regulares</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.backupsRegular"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Modelo do backup</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.modeloBackup"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Qualidade do backup</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.qualidadeBackup"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12" >
      <div class="separadorMini">Documentação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Inventário de Software</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.inventarioSoft"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Inventário de Hardware</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.inventarioHard"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Documentação dos sistemas</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.documentacaoSis"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Documentação de procedimentos</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.documentacaoProc"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Controlo de versões</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.controlVersaoDProc"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Contratos de manutenção</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.contratoAtivos"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Plano recuperação de dados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.planoRecuperacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Notas</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.caracterizacao.notas"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>

export default {
  props: ["siSpec"],


}

</script>


<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
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
