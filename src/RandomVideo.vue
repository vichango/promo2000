<template>
    <video v-if="video" :src="video.url" :alt="video.caption" controls></video>
    <p v-if="video" class="text-sm text-center text-gray-500">{{ video.caption }}</p>
</template>

<script>
import videos from './videos.json';

export default {
    name: 'RandomVideo',
    data() {
        return {
            videos,
            video: null
        }
    },
    mounted() {
        this.video = this.videos[Math.floor(Math.random() * this.videos.length)];
    }
}
</script>