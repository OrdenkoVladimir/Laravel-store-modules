// @ts-ignore
import isEmpty from 'lodash.isempty';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import BaseModule, { ModuleState } from './BaseModule';

export default class ModelModule extends BaseModule {
    mutations(): MutationTree<ModuleState> {
        return {
            ...super.mutations(),

            SET_ID: (state: ModuleState, id) => {
                state.endpoint += state.endpoint.endsWith('/') ? id : `/${id}`;
            },
        };
    }

    getters(): GetterTree<ModuleState, any> {
        return {
            ...super.getters(),

            model: (state: ModuleState) => state.data.data ?? {},
            modelExists: (state: ModuleState) => !isEmpty(state.data.data),
        };
    }

    actions(): ActionTree<ModuleState, any> {
        return {
            ...super.actions(),

            setId({ commit }, id) {
                commit('SET_ID', id);
            },
        };
    }
}
