module.exports = require("protobufjs").newBuilder({})['import']({
    "package": "ympp",
    "messages": [
        {
            "name": "YmppMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "version",
                    "id": 1,
                    "options": {
                        "default": 1
                    }
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "intent",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "Header",
                    "name": "header",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "Content",
                    "name": "content",
                    "id": 4
                }
            ],
            "messages": [
                {
                    "name": "Header",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "from",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "to",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "time",
                            "id": 5
                        },
                        {
                            "rule": "map",
                            "type": "string",
                            "keytype": "string",
                            "name": "extra",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "Content",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "encoding",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "charset",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "type",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "data",
                            "id": 4
                        }
                    ]
                }
            ]
        }
    ]
}).build();