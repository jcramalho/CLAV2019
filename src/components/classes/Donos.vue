<template>
    <div>
        <div class="subheading font-weight-medium">Donos</div>
        <span>
            <ul>
                <li v-for="e in this.entidades" :key="e.sigla">
                    <a @click="go(e.idDono)">{{ e.sigla }}</a>
                    ({{ e.idTipo }}): {{ e.designacao }}
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
export default {
    props: ["entidades"],
    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        }
    }
}
</script>
