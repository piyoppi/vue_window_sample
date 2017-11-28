<template>
    <div class="map-area">
        <div id="map" class="map-area"
             @mousedown="mapMouseDown"
             @mousemove="mapMouseMove"
             @mouseup="mapMouseUp"
             >
             <size-change-component v-bind="selectedItemRect" @sizeChanging="sizeChanging"></size-change-component>
        </div>
        <material-image-wnd-component :visible.sync="isVisibleMaterialImages"></material-image-wnd-component>
        <loginwnd-component 
            @signed-in="signIn"
            :visible.sync="isVisibleLogin"
        ></loginwnd-component>
        <create-map-wnd-component
            :visible.sync="isVisibleCreateMapDialog"
            @create-map="createMap"
        ></create-map-wnd-component>
        <open-map-component
            :visible.sync="isVisibleMapList"
            @selected-map="selectedMap"
        ></open-map-component>
        <animation-list-wnd-component :animations="animations" :visible.sync="isVisibleAnimationList" @created="addAnimation"></animation-list-wnd-component>
        <!--
        <edit-avatar-wnd-component v-if="isVisibleEditAvatar" @update:visible="isVisibleEditAvatar=!isVisibleEditAvatar" :image-url="avatar.imageUrl"></edit-avatar-wnd-component>
        -->
        <edit-avatar-wnd-component :visible.sync="isVisibleEditAvatar"></edit-avatar-wnd-component>
        <animation-list-wnd-component 
            :animations="animations"
            :visible.sync="isVisibleSelectAnimationList"
            :editEnable="false"
            :dialog-mode="true"
            @closed="selectAnimationListClosed"
            @selected="animationSelected"
            ></animation-list-wnd-component>
        <toolbox-component
            :position="toolboxPosition"
            :item="selectedItems[0]"
            v-if="selectedItems.length > 0"
            @set-animation-clicked="setAnimation"
            @pin-switch-clicked="switchPin"
            ></toolbox-component>
        <div class="tools">
            <button class="toolbutton" id="login" v-if="!isLogin" v-on:click="showSignup()">login</button>
            <div v-show="isLogin">
                <button class="toolbutton" id="material" v-on:click="showMaterialImages()">
                    素材
                </button>
                <button class="toolbutton" id="addobject" v-on:click="addObject()">
                    <img src="../../img/obj.png">追加
                </button>
                <button class="toolbutton" id="animation" v-on:click="showAnimation()">アニメーション</button>
                <button class="toolbutton" id="save" v-on:click="saveMap()">
                    <img src="../../img/save.png"> 
                </button>
                <button class="toolbutton" id="open" v-on:click="openMap()">マップリスト</button>
                <button class="toolbutton" v-on:click="editAvatar">アバター</button>
            </div>
        </div>
    </div>
</template>

<script>

//components
import loginwndComponent from "./auth/login_with_wnd.vue"
import editAvatarWndComponent from "./avatar/editAvatarWithWnd.vue"
import materialImageWndComponent from "./uploader/materialImageUploader_with_wnd.vue"
import materialImageHelper from "./uploader/materialImageHelper.js"
import createMapWndComponent from "./map/createMap_with_wnd.vue"
import openMapComponent from "./map/openMap.vue"
import animationListWndComponent from "./animation/animationListWithWnd.vue"
import sizeChangeComponent from "./edit/sizeChange.vue"
import toolboxComponent from "./toolbox/toolbox.vue"
import sharedResource from "./../core/sharedResource.js"
import basicItem from "./../core/basicItem.js"
import linearMove from "./../core/move_controller/linear_move.js"
import circleMove from "./../core/move_controller/circle_move.js"
import editAnimationHelper from "./animation/editAnimationHelper.js"
import map from "./map/editableMap.js"
import mapSetupHelper from "./map/mapSetupHelper.js"

//renderer
import rendererPixi from "./../core/renderer/pixi/renderer.js"
import animationPixi from "./../core/renderer/pixi/animation.js"

import Vue from "vue"
import store from "./store.js"


let mapItem = new map({width: 1500, height: 1500, gravityEnable: false, changeForceEnable: false});
let renderer = null;
let mapElement = null;

import mapHelper from "./map/mapHelper.js"
import moveItemHelper from "./edit/moveItemHelper.js"

let moveItems = new moveItemHelper();

export default {
    data: function () {
        return {
            isVisibleLogin: true,
            isVisibleMaterialImages: false,
            isVisibleCreateMapDialog: false,
            isVisibleMapList: false,
            isVisibleAnimationList: false,
            isVisibleSelectAnimationList: false,
            isVisibleEditAvatar: false,
            apiToken: null,
            selectedItemRect: {x: 0, y: 0, width: 0, height: 0},
            selectedItems: [],
            isLogin: false,
            avatar: {
            }
        }
    },
    computed: {
        animations: function(){
            return sharedResource.animations;
        },
        toolboxPosition: function() {
            if( this.selectedItems.length > 0 ){
                return {x: this.selectedItemRect.x + this.selectedItemRect.width + 10, y: this.selectedItemRect.y + this.selectedItemRect.height + 10}
            } else {
                return {x: 0, y: 0}
            }
        }
    },
    components: {
        loginwndComponent,
        materialImageWndComponent,
        createMapWndComponent,
        openMapComponent,
        sizeChangeComponent,
        animationListWndComponent,
        toolboxComponent,
        editAvatarWndComponent,
    },
    store,
    mounted: function(){
        mapElement = document.getElementById('map');
        renderer = new rendererPixi(mapElement);

        function freq(){
            mapItem.executeStep();
            renderer.render(mapItem.objects);
            let frameRate = sharedResource.frameRateManager.completeFrame();
            setTimeout( freq, 16 );
        }
        freq();
    },
    created: function(){
    },
    methods: {
        showSignup: function() {
            this.isVisibleLogin = !this.isVisibleLogin;               
        },
        showMaterialImages: function() {
            this.isVisibleMaterialImages = !this.isVisibleMaterialImages;               
        },
        signIn: function(response) {
            this.isLogin = true;
        },
        addObject: function() {
            let addItem = new basicItem({
                position: [300, 230],
                width: 50,
                height: 50,
            })
            mapItem.addObjects(addItem, {autoSetID: true});
            renderer.addItem(addItem, sharedResource.animations.items["none"]);
        },
        showAnimation: function() {
            this.isVisibleAnimationList = !this.isVisibleAnimationList;
        },

        //
        //      Map I/O
        //
        openMap: function() {
            this.isVisibleMapList = true;
        },
        selectedMap: function(value) {
            this.$store.commit('setMapID', {value: value.selectedMapID});
            mapSetupHelper.loadMap({
                token: this.$store.state.apiToken,
                id: value.selectedMapID,
                withImage: true,
            }, mapItem, renderer)
        },
        saveMap: function() {
            if( this.$store.state.mapID < 0 ) {
                this.isVisibleCreateMapDialog = true;
            } else {
                mapHelper.update({
                    token: this.$store.state.apiToken,
                    id: this.$store.state.mapID,
                    data: {
                        mapObject: mapItem.toObject(),
                        animations: sharedResource.animations.toObject(),
                    }
                });
            }
        },
        createMap: function(name, callback){
            mapHelper.create({
                name: name,
                token: this.$store.state.apiToken,
                data: {
                    mapObject: mapItem.toObject(),
                    animations: sharedResource.animations.toObject(),
                }
            })
            .then( response => {
                this.$store.commit('setMapID', {value: response.data.id});
                callback(true);
            })
            .catch( err => {
                callback(false);
            });
        },

        //
        //      オブジェクト移動関連
        //

        mapMouseDown: function(e){
            if( moveItems.isMoving() ) this.endMoving();

            let clientRect = mapElement.getBoundingClientRect();
            let hitObjects = mapItem.hitCheckWithRect({position: [e.clientX - clientRect.left + 1, e.clientY - clientRect.top + 1], width: 2, height: 2}, true);
            moveItems.startMove(e.pageX, e.pageY, hitObjects);

            this.selectedItemRect = hitObjects.length > 0 ? {x: moveItems.selectedItems[0].position[0], y: moveItems.selectedItems[0].position[1], width: moveItems.selectedItems[0].width, height: moveItems.selectedItems[0].height } : {x: 0, y: 0, width: 0, height: 0};
            if( hitObjects.length == 0 ) moveItems.clearSelectedItems();
            this.selectedItems = hitObjects;
        },
        mapMouseMove: function(e){
            if( !moveItems.isMoving() ) return;
            moveItems.moveSelectedItems(e.pageX, e.pageY);
            this.selectedItemRect = {x: moveItems.selectedItems[0].position[0], y: moveItems.selectedItems[0].position[1], width: moveItems.selectedItems[0].width, height: moveItems.selectedItems[0].height };
        },
        mapMouseUp: function(e){
            this.endMoving();
        },
        endMoving: function() {
            mapItem.updateMovedItem(moveItems.selectedItems);
            moveItems.endMove();
        },
        sizeChanging: function(info) {
            if( this.selectedItems.length > 0 ){
                this.selectedItems[0].width = info.width;
                this.selectedItems[0].height= info.height;
                this.selectedItems[0].position = [info.x, info.y];
            }
            this.selectedItemRect = info;
        },

        //
        //      アニメーション関連
        //

        addAnimation: function(animation, endSettings) {
            editAnimationHelper.addAnimation(animation)
            .then( data => {
                if( !data.isCreated ){
                    editAnimationHelper.postCreatedAnimation(data.animation, this.$store.state.apiToken);
                }
                endSettings();
            });
        },
        setAnimation: function() {
            this.isVisibleSelectAnimationList = true;   
        },
        animationSelected: function(item) {
            if( this.selectedItems.length > 0 ) {
                editAnimationHelper.setAnimationToItem(this.selectedItems[0], item, renderer);
            }
        },
        selectAnimationListClosed: function() {
            this.isVisibleSelectAnimationList = false;   
        },

        //
        //      ピン
        //

        switchPin: function(callback) {
            if( this.selectedItems.length == 0 ) return;
            this.selectedItems[0].pin = !this.selectedItems[0].pin;
            callback(this.selectedItems[0].pin);
        },

        //
        //      アバター編集
        //

        editAvatar: function() {
            this.isVisibleEditAvatar = !this.isVisibleEditAvatar;
        },
    }
}

</script>

<style scoped>
.map-area {
    width: 100%;
    height: 100%;
    position: absolute;
    user-select: none;
}
.login-form {
    position: absolute;
    left: 0;
    top: 0;
}
.material-form {
    position: absolute;
    left: 0;
    top: 0;
}

.loginwnd {
    position: absolute;
}
.tools {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: #333;
    height: 38px;
}
.toolbutton {
    margin: 0;
    padding: 5px;
    color: white;
    background-color: #333;
    border-width: 0 1px 0 0;
    cursor: pointer;
    height: 38px;
    vertical-align: middle;
}
.toolbutton > img {
    height: 22px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 3px;
    margin-right: 3px;
}
</style>
