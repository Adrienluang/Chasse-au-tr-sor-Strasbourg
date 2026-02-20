### JSX Type Inference {#jsx-type-inference}

Similar to the transform, Vue's JSX also needs different type definitions.

Starting in Vue 3.4, Vue no longer implicitly registers the global `JSX` namespace. To instruct TypeScript to use Vue's JSX type definitions, make sure to include the following in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

You can also opt-in per file by adding a `/* @jsxImportSource vue */` comment at the top of the file.

If there is code that depends on the presence of the global `JSX` namespace,  you can retain the exact pre-3.4 global behavior by explicitly importing or referencing `vue/jsx` in your project, which registers the global `JSX` namespace.

## Render Function Recipes {#render-function-recipes}

Below we will provide some common recipes for implementing template features as their equivalent render functions / JSX.
