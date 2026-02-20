### `<script>` {#script}

- Each `*.vue` file can contain at most one `<script>` block (excluding [`<script setup>`](/api/sfc-script-setup)).

- The script is executed as an ES Module.

- The **default export** should be a Vue component options object, either as a plain object or as the return value of [defineComponent](/api/general#definecomponent).
