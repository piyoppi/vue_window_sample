# Vue.jsでモーダルウインドウなサンプルプログラム

## 概要
私が自分のプロダクトのために作ったモーダルウインドウのサンプルプログラムを公開しています

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
│   ├ img                     --- サンプルで使う画像たち
│   │     hakoneko.png
│   ├ index.html              --- サンプルを実行できる環境
│   └ js
│       └ main.bundle.js
├  package-lock.json
├  package.json
├── src
│   ├ main.js                 --- vueオブジェクトの生成周り
│   ├ main.vue                --- サンプルウインドウの表示
│   ├ store.js                --- vuex周りの定義
│   └ wnd.vue                 --- ウインドウコンポーネント
└  webpack.config.js
```

