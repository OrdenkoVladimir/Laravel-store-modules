// eslint-disable-next-line import/no-cycle
import isEmpty from 'lodash.isempty';
// eslint-disable-next-line import/no-cycle
import BaseModule from './BaseModule';

export default class ModelModule extends BaseModule {
    mutations() {
        return {
            ...super.mutations(),

            SET_ID: (state, id) => {
                state.endpoint += state.endpoint.endsWith('/') ? id : `/${id}`;
            },
        };
    }

    getters() {
        return {
            ...super.getters(),

            model: (state) => state.data.data ?? {},
            isEmpty: (state) => isEmpty(state.data.data ?? {}),
        };
    }

    actions() {
        return {
            ...super.actions(),
            setId({ commit }, id) {
                commit('RESET_STATE');
                commit('SET_ID', id);
            },
        };
    }
}
