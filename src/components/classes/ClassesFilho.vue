<template>
    <div>
        <div class="subheading font-weight-medium">Descendência</div>
        <span>
            <ul>
                <li v-for="c in this.subclasses" :key="c.codigo">
                    <a @click="go(c.codigo)">{{ c.codigo }}: {{ c.titulo }}</a>
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
export default {
    props: ["subclasses"],
    methods: {
        go: function(idClasse){
            this.$router.push('/classes/c'+idClasse);
            this.$router.go();
        }
    }
}
</script>
