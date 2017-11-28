import Vuex from "vuex"
import Vue from "vue"

export default new Vuex.Store({
    state: {
        apiToken: "",
        mapID: -1,
        wndStatuses: {},
        wndCount: 0,
        maxWndZIndex: 0,
    },
    mutations: {
        setApiToken: (state, payload) => state.apiToken = payload.value,
        setMapID: (state, payload) => state.mapID = payload.value,
        setWndStatuses: (state, payload) => {
            if( !state.wndStatuses[payload.wndID] ) {
                Vue.set(state.wndStatuses, payload.wndID, {
                    zIndex: state.wndCount,
                });
                state.maxWndZIndex = state.wndCount;
                state.wndCount = state.wndCount+1;
            }
        },
        moveWndToTop: (state, payload) => {
            let oldZIndex = state.wndStatuses[payload.wndID].zIndex;
            state.wndStatuses[payload.wndID].zIndex = state.maxWndZIndex;
            for(let key in state.wndStatuses){
                if( (state.wndStatuses[key].zIndex > oldZIndex) && (key != payload.wndID) ) {
                    state.wndStatuses[key].zIndex -= 1;
                }
            }
        },
    },
    actions: {
        setWndStatuses(context, payload) {
            context.commit('setWndStatuses', payload);
        }
    }
});
