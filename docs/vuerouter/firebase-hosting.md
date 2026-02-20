### Firebase hosting

Add this to your `firebase.json`:

```json [firebase.json ~vscode-icons:file-type-firebase~]
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```
