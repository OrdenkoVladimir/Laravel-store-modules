import { GetterTree, MutationTree } from 'vuex';
import BaseModule, { ModuleState } from './BaseModule';

export default class ItemsListModule extends BaseModule {
    getters(): GetterTree<ModuleState, any> {
        return {
            ...super.getters(),

            items: (state: ModuleState) => state.data.data ?? [],
            itemsExist: (state: ModuleState, getters) => getters.items.length > 0,

            // eslint-disable-next-line arrow-body-style
            itemById: (state: ModuleState, getters) => (id: number) => {
                return getters.items.find((item: any) => item.id === id) ?? null;
            },
        };
    }

    mutations(): MutationTree<ModuleState> {
        return {
            ...super.mutations(),

            UPDATE_ONE: (state: ModuleState, replace) => {
                const index = state.data.data.findIndex((item: any) => item.id === replace.id);
                if (index > -1) {
                    state.data.data.splice(index, 1, replace);
                }
            },

            APPEND_ONE: (state: ModuleState, item) => {
                state.data.data.push(item);
            },

            REMOVE_ONE: (state: ModuleState, id) => {
                const index = state.data.data.findIndex((item: any) => item.id === id);
                if (index > -1) {
                    state.data.data.splice(index, 1);
                }
            },
        };
    }
}
