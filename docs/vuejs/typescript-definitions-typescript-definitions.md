### TypeScript Definitions {#typescript-definitions}

We may ship incompatible changes to TypeScript definitions between **minor** versions. This is because:

1. Sometimes TypeScript itself ships incompatible changes between minor versions, and we may have to adjust types to support newer versions of TypeScript.

2. Occasionally we may need to adopt features that are only available in a newer version of TypeScript, raising the minimum required version of TypeScript.

If you are using TypeScript, you can use a semver range that locks the current minor and manually upgrade when a new minor version of Vue is released.
