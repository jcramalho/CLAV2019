<template>
    <div>
        <div class="subheading font-weight-medium">Notas de Aplicação</div>
        <span>
            <ul>
                <li v-for="n in this.notas" :key="n.idNota">
                    {{ n.nota }}
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
export default {
    props: ["notas"]
}
</script>
