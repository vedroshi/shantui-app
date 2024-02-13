<template>
    <v-dialog v-model="props.open" width="auto">
        <v-date-picker v-model.range="props.range">
        <template #footer>
            <v-btn
                style="background-color: var(--secondary); width: auto; margin: 1rem"
                @click="clearRange"
            >
            Clear
            </v-btn>
        </template>
        </v-date-picker>
    </v-dialog>
</template>

<script>
export default {
    props: {
        open : Boolean,
        range : Object
    },
    methods: {
        clearRange() {
            this.$emit('update:range', { start: null, end: null });
            this.$emit('update:open', false);
        },
    }
}
</script>