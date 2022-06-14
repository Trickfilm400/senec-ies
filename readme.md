# senec-ies

This NPM package provides a full nodejs-api for senec.ies devices to fetch the data.

## Usage

- Install NPM package from GitHub.
- Function return a Promise

## Example

```typescript


import SenecIES from "@trickfilm400/senec-ies";

const client = new SenecIES("<IP / Host of device");

client.handleSenec().then((res) => {
    console.log(res);
    /*
    * {
        responseSchema: EnergyValues;
        validPacket: boolean;
      }
    *
    *
    */
}).catch(console.error);
```

© 2022 Trickfilm400
