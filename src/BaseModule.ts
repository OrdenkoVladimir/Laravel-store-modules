import { Request } from 'laravel-request-utils';
import {
    ActionContext, ActionTree, GetterTree, MutationTree,
} from 'vuex';

// @ts-ignore
const request = typeof window.request === 'function' && typeof window.request.getInstance === 'function'
    // @ts-ignore
    ? window.request.getInstance()
    : Request.getInstance();

export interface StateParams {
    [key: string]: any,
}

export interface ModuleState {
    endpoint: string,
    loading: boolean,
    data: { data?: any, [key: string]: any },
    initiallyLoaded: boolean,
    [key: string]: any,
}

export default class BaseModule {
    private readonly endpoint: string;

    private readonly defaultState: () => ModuleState;

    constructor(endpoint: string, stateParams: StateParams = {}) {
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

    protected state(): ModuleState {
        return this.defaultState();
    }

    protected getters(): GetterTree<ModuleState, any> {
        return {
            data: (state: ModuleState) => state.data,
            loading: (state: ModuleState) => state.loading,
            initiallyLoaded: (state: ModuleState) => state.initiallyLoaded,
            endpoint: (state: ModuleState) => state.endpoint,
        };
    }

    protected actions(): ActionTree<ModuleState, any> {
        return {
            async get({ state, commit, getters }: ActionContext<ModuleState, any>) {
                commit('SET_LOADING', true);

                await request.get(getters.endpoint, { params: state.params })
                    // @ts-ignore
                    .then((response) => {
                        if (!Object.prototype.hasOwnProperty.call(state.params, 'page')) {
                            commit('SET_DATA', response.data);
                        } else {
                            commit('APPEND_DATA', response.data);
                        }
                    })
                    .finally(() => {
                        commit('SET_INITIALLY_LOADED', true);
                        commit('SET_LOADING', false);
                    });
            },

            async remove({ state }: ActionContext<ModuleState, any>, url) {
                await request.delete(url, { params: state.params });
            },

            setParams: ({ commit }: ActionContext<ModuleState, any>, params) => {
                commit('SET_PARAMS', params);
            },

            clear: ({ commit }: ActionContext<ModuleState, any>) => {
                commit('RESET_STATE');
            },
        };
    }

    protected mutations(): MutationTree<ModuleState> {
        return {
            RESET_STATE: (state: ModuleState) => {
                Object.assign(state, this.defaultState());
            },

            SET_DATA: (state: ModuleState, data: any) => {
                state.data = data;
            },

            APPEND_DATA: (state: ModuleState, responseData) => {
                const { data, meta, links } = responseData;

                data.forEach((item: any) => {
                    state.data.data.push(item);
                });

                state.data.meta = meta;
                state.data.links = links;
            },

            SET_PARAMS: (state: ModuleState, params) => {
                state.params = params;
            },

            SET_INITIALLY_LOADED: (state: ModuleState, data) => {
                state.initiallyLoaded = data;
            },

            SET_LOADING: (state: ModuleState, data: boolean) => {
                state.loading = data;
            },
        };
    }

    public getModule() {
        return {
            namespaced: true,
            state: this.state(),
            getters: this.getters(),
            actions: this.actions(),
            mutations: this.mutations(),
        };
    }
}
