### Landmarks {#landmarks}

[Landmarks](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) provide programmatic access to sections within an application. Users who rely on assistive technology can navigate to each section of the application and skip over content. You can use [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) to help you achieve this.

| HTML            | ARIA Role            | Landmark Purpose                                                                                                 |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| header          | role="banner"        | Prime heading: title of the page                                                                                 |
| nav             | role="navigation"    | Collection of links suitable for use when navigating the document or related documents                           |
| main            | role="main"          | The main or central content of the document.                                                                     |
| footer          | role="contentinfo"   | Information about the parent document: footnotes/copyrights/links to privacy statement                           |
| aside           | role="complementary" | Supports the main content, yet is separated and meaningful on its own content                                    |
| search          | role="search"        | This section contains the search functionality for the application                                               |
| form            | role="form"          | Collection of form-associated elements                                                                           |
| section         | role="region"        | Content that is relevant and that users will likely want to navigate to. Label must be provided for this element |

[Read more about landmarks](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Semantic Forms {#semantic-forms}

When creating a form, you can use the following elements: `<form>`, `<label>`, `<input>`, `<textarea>`, and `<button>`

Labels are typically placed on top or to the left of the form fields:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

Notice how you can include `autocomplete='on'` on the form element and it will apply to all inputs in your form. You can also set different [values for autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for each input.
