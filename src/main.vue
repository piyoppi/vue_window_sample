<template>
    <div class="wnd-area">
        <!-- Window 1 -->
        <wnd-component caption="Window1"
                       :visible.sync="isVisibleWindow"
                       @require-inner-item="window1RequireInnerItem"
                       ref="wnd"
                       ></wnd-component>
        <div ref="window1Inner" class="window-first-inner">
            Hello world!!
        </div>

        <!-- Window 2 -->
        <wnd-component caption="Window2"
                       :visible.sync="isVisibleWindow2"
                       @require-inner-item="window2RequireInnerItem"
                       ></wnd-component>
        <div ref="window2Inner" class="window-second-inner">
            <img src="img/hakoneko.png" alt="neko">
        </div>

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
            isVisibleWindow2: true,
        }
    },
    store,
    methods: {
        window1RequireInnerItem: function(callback){
            callback(this.$refs.window1Inner);
        },
        window2RequireInnerItem: function(callback){
            callback(this.$refs.window2Inner);
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
.window-second-inner {
    color: white;
}
.window-second-inner img {
    display: block;
    width: 300px;
    height: 300px;
}
</style>
