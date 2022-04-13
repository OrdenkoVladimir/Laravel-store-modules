import {
    ActionContext, ActionTree, GetterTree, MutationTree,
} from 'vuex';
import isEmpty from 'lodash.isempty';
import BaseModule, { ModuleState, StateParams } from './BaseModule';

enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
}

interface Order {
    value: string,
    direction: OrderDirection,
}

export default class ItemsListModule extends BaseModule {
    constructor(
        endpoint: string,
        stateParams: StateParams = { hasCache: false, cacheDuration: 3600 },
    ) {
        super(endpoint, {
            ...stateParams,
            order: {},
        });
    }

    getters(): GetterTree<ModuleState, any> {
        return {
            ...super.getters(),

            items: (state: ModuleState) => state.data.data ?? [],

            itemsExist: (state: ModuleState, getters) => getters.items.length > 0,

            // eslint-disable-next-line arrow-body-style
            itemById: (state: ModuleState, getters) => (id: number) => {
                return getters.items.find((item: any) => item.id === id) ?? null;
            },

            order: (state) => state.order,

            hasOrder: (state: ModuleState) => !isEmpty(state.order),
        };
    }

    protected actions(): ActionTree<ModuleState, any> {
        return {
            ...super.actions(),

            async updateOrder({
                commit, dispatch, state,
            }: ActionContext<ModuleState, any>, name: string) {
                const order: Order = {
                    value: name,
                    direction: state.order?.direction === OrderDirection.ASC
                        ? OrderDirection.DESC
                        : OrderDirection.ASC,
                };

                commit('SET_ORDER', order);

                const params = {
                    ...state.params,
                    order: order.value,
                    direction: order.direction,
                };

                commit('SET_PARAMS', params);

                await dispatch('get');
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

            SET_ORDER: (state: ModuleState, order: Order) => {
                state.order = order;
            },
        };
    }
}
