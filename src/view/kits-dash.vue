<template>
    <div class="dash">
        <NCard>hello</NCard>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { NCard } from 'naive-ui';

export default defineComponent({
    name: 'kits-dash',
    components: {
        NCard,
    },
});

</script>