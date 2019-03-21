<template>
    <div>
        <div class="subheading font-weight-medium">Termos de Índice</div>
        <span>
            <ul>
                <li v-for="t in this.termos" :key="t.idTI">
                    {{ t.termo }}
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
export default {
    props: ["termos"]
}
</script>
