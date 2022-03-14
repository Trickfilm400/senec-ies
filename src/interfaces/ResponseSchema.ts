export interface ResponseSchema {
    body: {
        version: { _text: string },
        client: { _text: string },
        client_ver: { _text: string },
        item_list_size: [{}, { _text: string }],
        item_list: { i: { n: { _text: string }, v: { _text: string } }[] }
    };
}

