# Vue.jsでウインドウなサンプルプログラム

## 概要
私が自分のプロダクトのために作ったウインドウのサンプルプログラムを公開しています。
製作途中で見苦しいところもあるかもですが、ご了承ください。

## 使い方
```
$ npm install
$ npm run build
```

`dist/index.html` にアクセスすると、いくつかのウインドウが表示されます。

## ファイル構成
以下のようになっています。
```
├  README.md
├── dist
│   ├ img                     --- サンプルで使う画像たち
│   │  └ hakoneko.png
│   ├ index.html              --- サンプルを実行できる環境
│   └ js
│       └ main.bundle.js
├  package-lock.json
├  package.json
├── src
│   ├ main.js                 --- vueオブジェクトの生成周り
│   ├ main.vue                --- サンプルウインドウの表示
│   ├ store.js                --- vuex周りの定義
│   └ wnd.vue                 --- ウインドウコンポーネント
└  webpack.config.js
```

## あそびかた
`src/main.vue` を参考にしていただければなんとなくわかると思いますので、参考にしてください。

テンプレートに設定する各パラメータは以下の通りです
```vue
<wnd-component caption="..."                                                --- ウインドウのキャプション 
               :visible.sync="..."                                          --- ウインドウの表示状態
               @require-inner-item="..."                                    --- ウインドウ内に収める要素が要求されるときに呼び出されるイベント
               :initial-position="[30, 30]"                                 --- 初期位置（任意：デフォルトはページ中央）
               :select-buttons="[{caption: 'はい'}, {caption: 'いいえ'}]"   --- ウインドウ内に表示するボタン（任意：デフォルトは表示しない）
               @button-clicked="..."                                        --- ウインドウ内のボタンが押されたとき（任意）
               ></wnd-component>
```

ウインドウ内に格納する要素は、ウインドウコンポーネントから指示があったときに指定します。
`@require-inner-item` に設定した関数のコールバック関数に内包すべき要素を設定してください。

```vue
# hoge.vue

<template>
    <wnd-component caption="Window1"
                   @require-inner-item="setInnerElement"
                   :visible.sync="isVisibleWindow"></wnd-component>
    <div ref="windowInner">
        Hello world!!
    </div>
</template>

<script>
    import wndComponent from "./wnd.vue"
    import store from "./store.js"

export default {
    components: {
        wndComponent
    },
    data: function () {
        return {
            isVisibleWindow: true
        }
    },
    store,
    methods: {
       setInnerElement: function(callback){
           callback(this.$refs.windowInner);
       }
    }
}
<script>
```
