<template>
    <NIcon :size="size" :component="wrapedIcon" />
</template>

<script>
import { defineComponent, h } from 'vue';
import { defineStore } from 'pinia';
import { NIcon } from 'naive-ui';

import { ErrorFilled } from '@vicons/material'

import * as si from 'simple-icons';
import * as mi from '@vicons/material';

const useIconsStore = defineStore('icons-store', {
    state() {
        return {
            simpleIcons: Object.fromEntries(Object.values(si).map(v => [v.title, v])),
            materialIcons: Object.fromEntries(Object.values(mi).map(v => [v.name, v])),
        };
    },
    actions: {
        getIconMeta(group, slug) {
            switch (group) {
                case 'simple-icons':
                    return this.simpleIcons[slug];
                default:
                    return this.materialIcons[slug];
            }
        }
    },
});

export default defineComponent({
    name: 'simple-icon',
    setup() {
        const iconStore = useIconsStore();
        return { iconStore };
    },
    components: {
        NIcon
    },
    props: {
        size: {
            type: Number,
            default: 24
        },
        slug: {
            type: String,
            required: true
        },
        group: {
            type: String,
            default: '@vicons/material',
        }
    },
    computed: {
        wrapedIcon() {
            const iconMeta = this.iconStore.getIconMeta(this.group, this.slug);
            if(iconMeta === undefined) {
                return h(ErrorFilled);
            }
            switch (this.group) {
                case 'simple-icons':
                    return this.wrapSimpleIcon(iconMeta);
                default:
                    return h({ name: iconMeta.name, render: iconMeta.render });
            }
        },
    },
    methods: {
        wrapSimpleIcon({ path, title, source }) {
            return h('svg', { role: 'img', viewBox: '0 0 24 24' }, [
                h('title', { textContent: title, 'data-source': source }),
                h('path', { d: path }),
            ]);
        },
    }
});

</script>