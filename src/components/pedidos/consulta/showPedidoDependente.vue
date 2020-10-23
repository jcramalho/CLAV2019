<template>
  <div>
    <div v-if="!!pedido_informacao['sigla']">
      <RADAEntry label="Sigla" :value="pedido_informacao.sigla" />
      <RADAEntry label="Designação" :value="pedido_informacao.designacao" />
      <RADAEntry label="Estado" :value="pedido_informacao.estado" />
      <RADAEntry label="SIOE" :value="pedido_informacao.sioe" />
      <RADAEntry
        label="Internacional"
        :value="pedido_informacao.internacional"
      />
      <RADAEntry
        label="Data de Criação"
        :value="pedido_informacao.dataCriacao"
      />
      <RADAEntry
        v-if="!!pedido_informacao.dataExtincao"
        label="Data de Extinção"
        :value="pedido_informacao.dataExtincao"
      />
      <RADAEntry
        v-if="!!pedido_informacao.tipologiasSel[0]"
        label="Tipologias Selecionadas"
      >
        <template v-slot:valor>
          <ul>
            <li v-for="(tip, i) in pedido_informacao.tipologiasSel" :key="i">
              {{ tip }}
            </li>
          </ul>
        </template>
      </RADAEntry>
    </div>
    <div v-else>
      <RADAEntry label="Data do diploma" :value="pedido_informacao.data" />
      <RADAEntry label="Sumário" :value="pedido_informacao.sumario" />
      <RADAEntry label="Fonte de legitimação" value="RADA" />
      <RADAEntry label="Link" :value="pedido_informacao.link" />
      <RADAEntry label="Estado" :value="pedido_informacao.estado" />
      <RADAEntry label="Entidades">
        <template v-slot:valor>
          <ul>
            <li v-for="(ent, i) in pedido_informacao.entidadesSel" :key="i">
              {{ ent.sigla + " - " + ent.designacao }}
            </li>
          </ul>
        </template>
      </RADAEntry>
    </div>
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  components: {
    RADAEntry,
  },
  props: ["pedido_informacao"],
};
</script>