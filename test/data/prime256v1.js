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
        message: "0xf3c3fc2bc93f926c16c726097de5bcafec49792d10effc432d4d03bc6aef54fe",
        signatures: [
            [
                "0xab1eb02d8aa687e97da0229337aa8873e6f0eb26be289f28333d183f5d3b7a95",
                "0xc0c869adfb748daee3c5286eed6682c12e5533186baced9c26c167a9ebae950b"
            ],
        ],
        keypairs: [
            {
                priv: "",
                pub: [
                    "0x1a88c88615d437fbb8bf9e1942a1929f28562706ae6c2bd399e7b1bfb6d1e9e7",
                    "0x5b92b4aa42917ae1c61b701ef035c3fe7be3009cbafe5a2f71316c902dcf0d00"
                ]
            },
        ]
    }
};
