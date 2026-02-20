### `<script setup>` {#script-setup}

- Each `*.vue` file can contain at most one `<script setup>` block (excluding normal `<script>`).

- The script is pre-processed and used as the component's `setup()` function, which means it will be executed **for each instance of the component**. Top-level bindings in `<script setup>` are automatically exposed to the template. For more details, see [dedicated documentation on `<script setup>`](/api/sfc-script-setup).
