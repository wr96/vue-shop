<template>
    <div>
        <el-button type='info' v-on:click='tc'>退出</el-button>
        </div>
</template>
<script>
export default {
    methods:{
        tc () {
            sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>