import { BN, Program } from "@coral-xyz/anchor";
import { ComputeBudgetProgram, Connection, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { EventStatus, PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import idl from "../../common/rsvp.json";
import { type Rsvp as RSVPTypes} from "../../common/rsvp.ts"
const app = new Hono();
const prisma = new PrismaClient();
const connection = new Connection(process.env.RPC_URL!);
const program = new Program<RSVPTypes>(idl as RSVPTypes, {connection});

app.get("/", (c) => c.text("MTNDAO RSVP API"));

// PUBLIC
app.get("/events", async (c) => {
    return c.json(await prisma.event.findMany({
        where: {
            status: EventStatus.OPEN
        }
    }));
})

app.post("/event/rsvp", async (c) => {
    try {
        const { event, address } = await c.req.json();

        const rsvpIx = await program.methods.rsvp()
            .accounts({
                user: new PublicKey(address),
                event: new PublicKey(event),
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
        const { name, description, lamports, admin } = await c.req.json();

        const eventAddress = PublicKey.findProgramAddressSync(
            [
                Buffer.from("event"),
                new PublicKey(admin).toBytes(),
                Buffer.from(name)
            ],
            program.programId
        )[0];
    
        await prisma.event.create({
            data: {
                name,
                description,
                deposit: lamports,
                admin,
                address: eventAddress.toBase58(),
                status: EventStatus.OPEN
            }
        });
    
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

        const confirmIx = await program.methods.confirmRsvp(burn)
            .accounts({
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

        const eventDB = await prisma.event.findUnique({
            where: {
                address: event
            }
        });

        if (!eventDB) {
            return c.json({
                error: "Event not found"
            }, 404)
        }

        if (eventDB.admin !== admin) {
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
                        Buffer.from(eventDB.name)
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