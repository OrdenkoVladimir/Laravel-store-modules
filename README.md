# Laravel Store Modules

### Installation
```sh
npm i laravel-store-modules
```

### Usage
1. Create store module
```js
import { ItemsListModule } from 'laravel-store-modules';

export default class Products extends ItemsListModule {
    constructor() {
        super('/api/product');
    }
}
```
2. Create a new Vue component.
```vue
<template>
   <div>
     <product-list-item
         v-for="product in products"
         :key="product.id"
         :product="product"
     />
   </div>
</template>

<script>

    export default {
      name: 'Products',
      computed: {
        ...mapGetters({
          products: `products/items`,
        }),
        created() {
          this.getProducts();
        },
        methods: {
          ...mapActions({
            getProducts: `products/get`,
          }),
        },
</script>
```
