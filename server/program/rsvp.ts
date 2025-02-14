/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rsvp.json`.
 */
export type Rsvp = {
  "address": "31CP2WABMdSAKCnMkPRU1XcYm43mTYUJyZZFewAZSr33",
  "metadata": {
    "name": "rsvp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "confirmRsvp",
      "discriminator": [
        193,
        62,
        68,
        35,
        17,
        71,
        81,
        42
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              },
              {
                "kind": "arg",
                "path": "evtName"
              }
            ]
          }
        },
        {
          "name": "rsvpAccount",
          "writable": true
        },
        {
          "name": "user",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "evtName",
          "type": "string"
        },
        {
          "name": "burn",
          "type": "bool"
        }
      ]
    },
    {
      "name": "initEvent",
      "discriminator": [
        187,
        76,
        29,
        231,
        45,
        94,
        249,
        84
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              },
              {
                "kind": "arg",
                "path": "args.event_name"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "eventArgs"
            }
          }
        }
      ]
    },
    {
      "name": "rsvp",
      "discriminator": [
        134,
        164,
        221,
        33,
        183,
        12,
        73,
        32
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "event",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rsvpAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  115,
                  118,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "event"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "stopEvent",
      "discriminator": [
        191,
        106,
        139,
        240,
        206,
        37,
        73,
        46
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              },
              {
                "kind": "account",
                "path": "event.event_name",
                "account": "event"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "event",
      "discriminator": [
        125,
        192,
        125,
        158,
        9,
        115,
        152,
        233
      ]
    },
    {
      "name": "rsvpAccount",
      "discriminator": [
        40,
        134,
        57,
        98,
        47,
        223,
        208,
        113
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "eventStopped",
      "msg": "Event is stopped"
    }
  ],
  "types": [
    {
      "name": "event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "stopped",
            "type": "bool"
          },
          {
            "name": "eventName",
            "type": "string"
          },
          {
            "name": "deposit",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "eventArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "eventName",
            "type": "string"
          },
          {
            "name": "deposit",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "rsvpAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "event",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
