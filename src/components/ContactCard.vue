<template>
    <div class="bg-white rounded-5 text-center p-3 p-md-4 p-xxl-5 h-100" :data-aos="animation" :data-aos-duration="duration">
        <i :class="['text-success big-i', iconClass]"></i>
        <div class="pt-3 pt-md-3">
            <h4 class="fw-bold fs-5 fs-md-4 text-wrap">{{ title }}</h4>
            <p class="text-muted mb-0 text-wrap">{{ content }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        iconClass: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        animation: {
            type: String,
            default: 'flip-left'
        },
        duration: {
            type: Number,
            default: 1300
        }
    }
};
</script>

<style scoped>
.big-i {
    font-size: clamp(2.75rem, 8vw, 4rem);
}
</style>
