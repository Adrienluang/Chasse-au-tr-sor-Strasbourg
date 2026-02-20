### Redirect records cannot use special paths

Previously, a non documented feature allowed to set a redirect record to a special path like `/events/:id` and it would reuse an existing param `id`. This is no longer possible and there are two options:

* Using the name of the route without the param: `redirect: { name: 'events' }`. Note this won't work if the param `:id` is optional
* Using a function to recreate the new location based on the target: `redirect: to => ({ name: 'events', params: to.params })`

**Reason**: This syntax was rarely used and *another way of doing things* that wasn't shorter enough compared to the versions above while introducing some complexity and making the router heavier.
