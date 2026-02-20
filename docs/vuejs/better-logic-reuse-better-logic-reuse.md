### Better Logic Reuse {#better-logic-reuse}

The primary advantage of Composition API is that it enables clean, efficient logic reuse in the form of [Composable functions](/guide/reusability/composables). It solves [all the drawbacks of mixins](/guide/reusability/composables#vs-mixins), the primary logic reuse mechanism for Options API.

Composition API's logic reuse capability has given rise to impressive community projects such as [VueUse](https://vueuse.org/), an ever-growing collection of composable utilities. It also serves as a clean mechanism for easily integrating stateful third-party services or libraries into Vue's reactivity system, for example [immutable data](/guide/extras/reactivity-in-depth#immutable-data), [state machines](/guide/extras/reactivity-in-depth#state-machines), and [RxJS](/guide/extras/reactivity-in-depth#rxjs).
