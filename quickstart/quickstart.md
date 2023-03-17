# TS Embed Quickstart

This guide is aimed at quickly starting with embedding ThoughtSpot into your own site.

## Prerequisites

-   You have the appropriate [licenses to embed ThoughtSpot](https://developers.thoughtspot.com/docs/?pageid=get-started-tse) into your own application.
-   You have access to a ThoughtSpot instance, and have either DEVELOPER or ADMIN [privileges](https://developers.thoughtspot.com/docs/?pageid=integration-guidelines).
-   You have already connected ThoughtSpot to the Data Warehouse, created the required [models / Worksheets](https://developers.thoughtspot.com/docs/?pageid=thoughtspot-objects). And, if embedding Liveboards / Answers you have created them.

## Setup

1. Decide what kind of Authentication would you use when embedding TS. [This guide](https://developers.thoughtspot.com/docs/?pageid=embed-auth) will help you choose among the supported authentication types.

2. Allow the target host domain in the [CORS/CSP security settings](https://developers.thoughtspot.com/docs/?pageid=security-settings)

3. Prepare your environment. Make sure the [NPM is installed](https://www.npmjs.com/get-npm) in your environment.

## Install the Visual Embed SDK

```
$ npm i @thoughtspot/visual-embed-sdk
```

The latest version of the Visual Embed SDK is available at https://www.npmjs.com/package/@thoughtspot/visual-embed-sdk.

You can also access Visual Embed SDK, in the ThoughtSpot [Visual Embed SDK GitHub](https://github.com/thoughtspot/visual-embed-sdk) repository.

## Import the SDK in your project

```js
// ESM via NPM
import * as TsEmbedSDK from '@thoughtspot/visual-embed-sdk';
// OR
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk';

// NPM <script>
<script src="https://cdn.jsdelivr.net/npm/@thoughtspot/visual-embed-sdk/dist/tsembed.js"></script>;
// Make the SDK available on global namespace window.tsembed

// ES6 from web
import {
    LiveboardEmbed,
    AuthType,
    init,
} from 'https://cdn.jsdelivr.net/npm/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';
```

## Initialize the SDK

```js
init({
    thoughtSpotHost: "https://<hostname>:<port>",
    authType: <AuthType>,
    ... // other authType dependent properties.
});
```

The `authType` is one of the options you chose earlier as part of the [setup](#setup). See [this](https://developers.thoughtspot.com/docs/?pageid=embed-auth) to help you choose.

## Embed the TS component

<details>
<summary>Javascript</summary>

```js
import {
    LiveboardEmbed,
    EmbedEvent,
    HostEvent,
} from '@thoughtspot/visual-embed-sdk';

const lb = new LiveboardEmbed('#container', {
    frameParams: {
        width: '100%',
        height: '100%',
    },
    liveboardId: '<%=liveboardGUID%>',
    runtimeFilters: [],
});
// [Optional]: Register event listeners.
lb.on(EmbedEvent.LiveboardRendered, (e) => {
    /* handler */
});

// Do not forget to call render.
lb.render();

// [Optional]: Trigger events on the lb
lb.trigger(HostEvent.UpdateRuntimeFilters, [
    {
        columnName: 'col1',
        operator: RuntimeFilterOp.EQ,
        values: ['val1'],
    },
]);
```

`#container` is a selector for the DOM node which above code assumes is already attached to DOM. The SDK will render the ThoughtSpot component inside this container element.

</details>

<details>
<summary>React</summary>

```js
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/react';

const App = () => {
    const embedRef = useEmbedRef();
    const onLiveboardRendered = () => {
        embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
            {
                columnName: 'col1',
                operator: RuntimeFilterOp.EQ,
                values: ['val1'],
            },
        ]);
    };
    return (
        <LiveboardEmbed
            ref={embedRef}
            liveboardId="<liveboard-guid>"
            onLiveboardRendered={onLiveboardRendered}
        />
    );
};
```

All [events](https://developers.thoughtspot.com/docs/typedoc/enums/EmbedEvent.html) are exposed as `on<EventName>` naming convention inside React components.

</details>

## API reference

-   [Full App embed](https://developers.thoughtspot.com/docs/typedoc/classes/AppEmbed.html)
-   [Liveboard](https://developers.thoughtspot.com/docs/typedoc/classes/LiveboardEmbed.html)
-   [Search bar](https://developers.thoughtspot.com/docs/typedoc/classes/SearchBarEmbed.html)
-   [Search / Answer](https://developers.thoughtspot.com/docs/typedoc/classes/SearchEmbed.html)
-   [Events](https://developers.thoughtspot.com/docs/typedoc/enums/EmbedEvent.html) emitted from ThoughtSpot
-   [Events](https://developers.thoughtspot.com/docs/typedoc/enums/HostEvent.html) triggered to ThoughtSpot.

## Resources

-   [Complete React tutorial](https://developers.thoughtspot.com/guides/build-a-data-driven-app-with-thoughtspot-everywhere-and-react)
-   [React reference app](https://codesandbox.io/s/big-tse-react-demo-i4g9xi?file=/src/App.tsx)
-   [Using events tutorial](https://developers.thoughtspot.com/guides/using-lifecycle-events)
