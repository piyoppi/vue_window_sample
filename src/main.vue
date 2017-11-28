<template>
    <div class="wnd-area">
        <!-- Window 1 -->
        <wnd-component caption="Window1"
                       :visible="isVisibleWindow"
                       @require-inner-item="window1RequireInnerItem"
                       ref="wnd"
                       ></wnd-component>
        <div ref="window1Inner" class="window-first-inner">
            Hello world!!
        </div>

        <!-- Window 2 -->

        <!-- Window 3 -->
    </div>
</template>

<script>

import Vue from "vue"
import store from "./store.js"
import wndComponent from "./wnd.vue"

export default {
    components: {
        wndComponent
    },
    data: function () {
        return {
            isVisibleWindow: true,
        }
    },
    store,
    methods: {
        window1RequireInnerItem: function(callback){
            callback(this.$refs.window1Inner);
        }
    },
}

</script>

<style scoped>
.wnd-area {
    width: 100%;
    height: 100%;
    position: absolute;
    user-select: none;
}
.window-first-inner {
    width: 200px;
    height: 100px;
    color: white;
}
</style>
