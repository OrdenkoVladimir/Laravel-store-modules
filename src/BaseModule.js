import { Request } from 'laravel-request-utils';

const request = Request.getInstance();

export default class BaseModule {
    constructor(endpoint, stateParams = {}) {
        this.endpoint = endpoint;
        this.defaultState = () => ({
            ...stateParams,
            params: {},
            endpoint: this.endpoint,
            loading: false,
            data: {},
            initiallyLoaded: false,
        });
    }

    state() {
        return this.defaultState();
    }

    getters() {
        return {
            data: (state) => state.data,
            loading: (state) => state.loading,
            initiallyLoaded: (state) => state.initiallyLoaded,
            endpoint: (state) => state.endpoint,
        };
    }

    actions() {
        return {
            async get({ state, commit }) {
                commit('setLoading', true);
                await request.get(state.endpoint, { params: state.params })
                    .then((response) => {
                        if (!Object.prototype.hasOwnProperty.call(state.params, 'page')) {
                            commit('setData', response.data);
                        } else {
                            commit('appendData', response.data);
                        }
                    })
                    .finally(() => {
                        commit('setInitiallyLoaded', true);
                        commit('setLoading', false);
                    });
            },
            async remove({ state }, url) {
                await request.delete(url, { params: state.params });
            },
            setParams: ({ commit }, params) => {
                commit('setParams', params);
            },
        };
    }

    mutations() {
        return {
            RESET_STATE: (state) => {
                Object.assign(state, this.defaultState());
            },
            setData: (state, data) => {
                state.data = data;
            },
            appendData: (state, responseData) => {
                const { data, meta, links } = responseData;
                data.forEach((i) => {
                    if (state.data.data.find((fIndex) => fIndex.id === i.id) === undefined) {
                        state.data.data.push(i);
                    }
                });
                state.data.meta = meta;
                state.data.links = links;
            },
            setParams: (state, params) => {
                state.params = params;
            },

            setInitiallyLoaded: (state, data) => {
                state.initiallyLoaded = data;
            },

            setLoading: (state, data) => {
                state.loading = data;
            },
        };
    }

    getModule() {
        return {
            namespaced: true,
            state: this.state(),
            getters: this.getters(),
            actions: this.actions(),
            mutations: this.mutations(),
        };
    }
}
