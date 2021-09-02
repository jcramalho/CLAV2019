<template>
  <div>
    <VerHistoricoCampo campoText="Código" :historicoCampo="historico.codigo" />
    <VerHistoricoCampo campoText="Título" :historicoCampo="historico.titulo" />
    <VerHistoricoCampo
      v-if="!!historico.descricao.dados"
      campoText="Descrição"
      :historicoCampo="historico.descricao"
    />
    <VerHistoricoCampo
      v-if="!!historico.codCota.dados"
      campoText="Cota"
      :historicoCampo="historico.codCota"
    />

    <VerHistoricoCampo campoText="Data inicial" :historicoCampo="historico.dataInicial" />
    <VerHistoricoCampo campoText="Data final" :historicoCampo="historico.dataFinal" />

    <VerHistoricoCampo
      v-if="!!historico.produtor.dados.entProdutoras[0]"
      campoText="Entidade produtora"
      :historicoCampo="historico.produtor"
    >
      <template v-slot:campo>
        <span>
          <ul>
            <li v-for="(v, i) in historico.produtor.dados.entProdutoras" :key="i">{{ v }}</li>
          </ul>
        </span>
      </template>
    </VerHistoricoCampo>
    <VerHistoricoCampo
      v-else
      campoText="Tipologias Produtoras"
      :historicoCampo="historico.produtor"
    >
      <template v-slot:campo>
        <span>
          <ul>
            <li v-for="(v, i) in historico.produtor.dados.tipologiasProdutoras" :key="i">{{ v }}</li>
          </ul>
        </span>
      </template>
    </VerHistoricoCampo>
    <VerHistoricoCampo campoText="Classes Associadas" :historicoCampo="historico.classesAssociadas">
      <template v-slot:campo>
        <span>
          <ul>
            <li v-for="(v, i) in historico.classesAssociadas.dados" :key="i">{{ v.codigo }}</li>
          </ul>
        </span>
      </template>
    </VerHistoricoCampo>
    <VerHistoricoCampo
      v-if="!!historico.notas.dados"
      campoText="Notas"
      :historicoCampo="historico.notas"
    />
    <VerHistoricoCampo
      v-if="!!historico.localizacao.dados"
      campoText="Localização"
      :historicoCampo="historico.localizacao"
    />
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/rada/generic/VerHistoricoCampo";

export default {
  props: ["historico"],
  components: {
    VerHistoricoCampo,
  },
};
</script>