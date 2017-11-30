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
                       :initial-position="[160, 160]"
                       @require-inner-item="window2RequireInnerItem"
                       ></wnd-component>
        <div ref="window2Inner" class="window-second-inner">
            <img src="img/hakoneko.png" alt="neko">
        </div>

        <!-- Window 3 -->
        <wnd-component caption="Window3"
                       :visible.sync="isVisibleWindow3"
                       @require-inner-item="window3RequireInnerItem"
                       @button-clicked="buttonClicked"
                       :initial-position="[30, 30]"
                       :select-buttons="[{caption: 'はい'}, {caption: 'いいえ'}]"
                       ></wnd-component>
        <div ref="window3Inner" class="window-third-inner">
            （はい：いいえボタンのテストです）これでいいですか？
        </div>
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
            isVisibleWindow: true,                              //Window1 visible
            isVisibleWindow2: true,                             //Window2 visible
            isVisibleWindow3: true,                             //Window3 visible
        }
    },
    store,
    methods: {
        window1RequireInnerItem: function(callback){
            //ウインドウ1に内包すべき要素を設定
            callback(this.$refs.window1Inner);
        },
        window2RequireInnerItem: function(callback){
            //ウインドウ2に内包すべき要素を設定
            callback(this.$refs.window2Inner);
        },
        window3RequireInnerItem: function(callback){
            //ウインドウ3に内包すべき要素を設定
            callback(this.$refs.window3Inner);
        },
        buttonClicked: function(item) {
            //押されたボタンを表示する
            alert(`押されたボタンは「${item.caption}」`);
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
.window-second-inner, .window-third-inner {
    color: white;
}
.window-second-inner img {
    display: block;
    width: 300px;
    height: 300px;
}
</style>
