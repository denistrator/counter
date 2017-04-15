## Simple counter on native JS

See [example](http://denistrator.esy.es/counter/index.html).

#### How to initialize 
```var myCounter = new Counter(container, variants, params);```

`container` - HTMLElement or string (with CSS Selector). Required.

`variants` - List of words separeted by comma. Required.

`params` - Object with counter parameters. Optional.

#### params:
`minDelay` - Number

`maxDelay` - Number

`backwards` - Boolean. Count direction

You can use negative number, as initial counter value.

Counter uses local Storage.
