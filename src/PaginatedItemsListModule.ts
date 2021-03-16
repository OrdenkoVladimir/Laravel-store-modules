import { GetterTree } from 'vuex';
import ItemsListModule from './ItemsListModule';
import { ModuleState } from './BaseModule';

export default class PaginatedItemsListModule extends ItemsListModule {
    getters(): GetterTree<ModuleState, any> {
        return {
            ...super.getters(),
            nextPage: (state: ModuleState) => (
                state.data.links && state.data.links.next
                    ? state.data.meta.current_page + 1
                    : null
            ),
            meta: (state: ModuleState) => state.data.meta ?? {},
            links: (state: ModuleState) => state.data.links ?? {},
        };
    }
}
