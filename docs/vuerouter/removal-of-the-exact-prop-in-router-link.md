### Removal of the `exact` prop in `<router-link>`

The `exact` prop has been removed because the caveat it was fixing is no longer present so you should be able to safely remove it. There are however two things you should be aware of:

* Routes are now active based on the route records they represent instead of the generated route location objects and their `path`, `query`, and `hash` properties
* Only the `path` section is matched, `query`, and `hash` aren't taken into account anymore

If you wish to customize this behavior, e.g. take into account the `hash` section, you should use the [`v-slot` API](/guide/advanced/composition-api#useLink) to extend `<router-link>`.

**Reason**: See the [RFC about active matching](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0028-router-active-link.md#summary) changes for more details.
