# @webreflection/qrcode

Based on [@zxing/library](https://github.com/zxing-js/library), this module exports a `scan({ facingMode = 'environment' })` async utility that helps users finding a QR Code and grab its result as data.

The *facingMode* property is [described on MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode#value).

```js
// pre-bundled file @ https://cdn.jsdelivr.net/npm/@webreflection/qrcode/dist.js
import { scan } from '@webreflection/qrcode';

const result = await scan();

console.log(result);
```

The *LICENSE* is the same used in `@zxing/library` as I haven't added/done much else in here, just re-packaged and added minimalistic logic to help scanning.
