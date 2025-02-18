import { BN, Program } from "@coral-xyz/anchor";
import { ComputeBudgetProgram, Connection, PublicKey, TransactionMessage } from "@solana/web3.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import idl from "../program/rsvp.json";
import { type Rsvp as RSVPTypes} from "../program/rsvp.ts"
const app = new Hono();
const connection = new Connection(process.env.RPC_URL!, "confirmed");
const program = new Program<RSVPTypes>(idl as RSVPTypes, {connection});

app.get("/", (c) => c.text("MTNDAO RSVP API"));

// CORS
app.use("*", cors());

// PUBLIC
// TODO: Do a GPA for events
app.get("/events", async (c) => {
    const events = await program.account.event.all();
    return c.json(events);
})

app.get("/events/:user", async (c) => {
    const { user } = c.req.param();
    const pubkey = new PublicKey(user);
    const rsvps = await program.account.rsvpAccount.all(
    [
        {
            memcmp: {
                offset: 8,
                encoding: 'base58',
                bytes: pubkey.toBase58()
            }
        }
       ]
    );
    return c.json(rsvps);
})

app.post("/event/rsvp", async (c) => {
    try {
        const { event, address } = await c.req.json();
        const eventAdmin =(await program.account.event.fetch(new PublicKey(event))).admin;
        const eventWallet = PublicKey.findProgramAddressSync(
            [
                Buffer.from("event_wallet"),
                eventAdmin.toBytes(),
                new PublicKey(event).toBytes()
            ],
            program.programId)[0];
        const rsvpIx = await program.methods.rsvp()
            .accounts({
                user: new PublicKey(address),
                event: new PublicKey(event),
                eventWallet: eventWallet,
            })
            .instruction();
    
        const msg = new TransactionMessage({
            payerKey: new PublicKey(address),
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 500_000
                }),
                rsvpIx
            ]
        })

        const serialized = msg.compileToV0Message().serialize();
        const b64 = Buffer.from(serialized).toString("base64");
        const rsvpAddress = PublicKey.findProgramAddressSync(
            [
                Buffer.from("rsvp"),
                new PublicKey(address).toBytes(),
                new PublicKey(event).toBytes()
            ],
            program.programId
        )[0];

        return c.json({
            event,
            msg: b64, rsvpAddress: rsvpAddress.toBase58()
        })
    } catch (e: any) {
        return c.json({
            error: e.message
        }, 500)
    }
})


// ADMIN
app.post("/event/create", async (c) => {
    try {
        const { name, lamports, admin } = await c.req.json();

        const eventAddress = PublicKey.findProgramAddressSync(
            [
                Buffer.from("event"),
                new PublicKey(admin).toBytes(),
                Buffer.from(name)
            ],
            program.programId
        )[0];

        const createEventIx = await program.methods.initEvent({
            eventName: name,
            deposit: new BN(lamports) // in lamports
        })
            .accounts({
                admin: new PublicKey(admin),
            })
            .instruction();
        const msg = new TransactionMessage({
            payerKey: new PublicKey(admin),
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 500_000
                }),
                createEventIx
            ]
        });
        const serialized = msg.compileToV0Message().serialize();
        const b64 = Buffer.from(serialized).toString("base64");
    
        return c.json({
            event: eventAddress.toBase58(),
            msg: b64
        }); 
    } catch (e) {
        console.log({e})
        return c.json({
            error: e
        }, 500)
    }
});

/** Confirm an RSVP IF you are admin of the event */
// Can confirm as "ATTENDED" or "BURN"
app.post("/event/confirm", async (c) => {
    try {
        const { event, attendee, burn, admin } = await c.req.json();

        const evtAccount = await program.account.event.fetch(new PublicKey(event));


        const confirmIx = await program.methods.confirmRsvp(evtAccount.eventName, burn)
            .accountsPartial({
                admin: new PublicKey(admin),
                user: new PublicKey(attendee),
                rsvpAccount: PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("rsvp"),
                        new PublicKey(attendee).toBytes(),
                        new PublicKey(event).toBytes()
                    ],
                    program.programId)[0],
            })
            .instruction();

        const msg = new TransactionMessage({
            payerKey: new PublicKey(admin),
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 500_000
                }),
                confirmIx
            ]
        });

        const serialized = msg.compileToV0Message().serialize();
        const b64 = Buffer.from(serialized).toString("base64");
        
        return c.json({
            event,
            msg: b64
        });
    } catch (e: any) {
        return c.json({
            error: e.message
    }, 500)
    }
})

/** Remove an RSVP IF you are admin of the event */
app.post("/event/remove", async     (c) => {
    try {
        const { event, admin } = await c.req.json();

        const account = await program.account.event.fetch(new PublicKey(event));
        if(account.admin.toBase58() !== admin) {
            return c.json({
                error: "You are not the admin of this event"
            }, 403)
        }

        const removeIx = await program.methods.stopEvent()
            .accountsPartial({
                admin: new PublicKey(admin),
                event: PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("event"),
                        new PublicKey(admin).toBytes(),
                        Buffer.from(event)
                    ],
                    program.programId)[0]
            })
            .instruction();

        const msg = new TransactionMessage({
            payerKey: new PublicKey(admin),
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 500_000
                }),
                removeIx
            ]
        });

        const serialized = msg.compileToV0Message().serialize();
        const b64 = Buffer.from(serialized).toString("base64");

        return c.json({
            event,
            msg: b64
        });
    } catch (e: any) {
        return c.json({
            error: e.message
        }, 500)
    }
})

export default app;