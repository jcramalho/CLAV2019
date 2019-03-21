<template>
    <div>
        <div class="subheading font-weight-medium">Exemplos de Notas de Aplicação</div>
        <span>
            <ul>
                <li v-for="e in this.exemplos" :key="e.idExemplo">
                    {{ e.exemplo }}
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
export default {
    props: ["exemplos"]
}
</script>
