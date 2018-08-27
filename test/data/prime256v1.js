const BN = require("bn.js");

module.exports = {
    name: "prime256v1",
    fieldSize: new BN("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF", 16),
    groupOrder: new BN("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551", 16),
    cofactor: new BN(1),
    Gx: new BN("6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296", 16),
    Gy: new BN("4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5", 16),
    lowSmax: new BN("7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0", 16),
    A: new BN("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC", 16),
    B: new BN("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B", 16),
    testdata: {
        message: "0x09ca7e4eaa6e8ae9c7d261167129184883644d07dfba7cbfbc4c8a2e08360d5b",
        signatures: [
            [
                "0xf2f2ef803b2aa52f3950cd5c16b3e96f56cbe2d3919a3d15fb8dcbd753e8b255",
                "0x63ed976ed34fe3c26f984a05a02b300baa9ea61d4b2d2f4ddb6f7901d5a91344"
            ],
            [
                "0xda4056cab0db52c8eccb1ae3a4e11ec9d34197789a19c5a5b52e10b0907c18a3",
                "0xc18044103b5301ebd9ab433c4984f6fc68c7e95074d671a375bed45159d6c0e"
            ],
            [
                "0x11bf1a9368450cbcb2e476b52fcbf30b5ce3ae43a83ba1e6352220fdd01f564",
                "0xee74d1db3d5b2763695f25595c810a7d454cb0dcd632c588062ff779ea796d5"
            ]
        ],
        keypairs: [
            {
                priv: "0xce027caa7ff4bef85499ebd4002252ce16717bf05c15457c42174a98c7241a24",
                pub: [
                    "0xe31dbd00c1f8d928493266e1cb8376ed9d2bfeb494b9183869fa9392badb6932",
                    "0xfc3a88131d6f311e92c9d67f0ca1e8a68b7ab62f891178c7fb43c639d5dd598e"
                ]
            },
            {
                priv: "0xc9abc5d806a6f9232cfb721b70e5a9f1324fcd7be42e6bd2b23a0b5d15beccc3",
                pub: [
                    "0x32dfe5873aafba0abb4b97bff4a35ebb8217fb8109668866d988ec41bfcc69dd",
                    "0x8e82545372fc48602670f220e947eacb7200b51dc78c53acc8afad3bbc397691"
                ]
            },
            {
                priv: "0x39af88453f1aacf4d86cbf525c0224314a701c3ff404cd5199b00d44301e718b",
                pub: [
                    "0xeff28e04159e6ca7c4504a1fbba7602bb90d0557ce0b40cfaab9f36e16d5ba52",
                    "0x226cb9ca5fa4f75a4280c93ce87d7d1f2bf8638ab633b84d59c86e8c90fec962"
                ]
            },
        ]
    }
};
