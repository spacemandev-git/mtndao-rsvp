use anchor_lang::prelude::*;

declare_id!("3WMmPtNrkZBPuv2vBdnse7zx2zYdurGXqEva4qDGJe4G");

#[program]
pub mod rsvp {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;

    pub fn init_event(ctx: Context<InitEvent>, args: EventArgs) -> Result<()> {
        let event: &mut Account<'_, Event> = &mut ctx.accounts.event;
        event.admin = *ctx.accounts.admin.key;
        event.event_name = args.event_name;
        event.deposit = args.deposit;
        event.stopped = false;
        event.event_wallet = ctx.accounts.event_wallet.key();
        Ok(())
    }

    pub fn rsvp(ctx: Context<RSVP>) -> Result<()> {
        if ctx.accounts.event.stopped {
            return Err(ErrorCode::EventStopped.into());
        }

        ctx.accounts.rsvp_account.user = ctx.accounts.user.key();
        ctx.accounts.rsvp_account.event = ctx.accounts.event.key();

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.event_wallet.to_account_info(),
                },
            ),
            ctx.accounts.event.deposit, // txn fee for withdraw
        )?;
        Ok(())
    }

    pub fn confirm_rsvp(ctx: Context<ConfirmRSVP>, _evt_name: String, burn: bool) -> Result<()> {
        if burn {
            transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.event_wallet.to_account_info(),
                        to: ctx.accounts.admin.to_account_info(),
                    },
                    &[&[
                        b"event_wallet",
                        ctx.accounts.admin.key().as_ref(),
                        ctx.accounts.event.key().as_ref(),
                        &[ctx.bumps.event_wallet],
                    ]],
                ),
                ctx.accounts.event.deposit,
            )?;
        } else {
            // Transfer from event to user
            transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.event_wallet.to_account_info(),
                        to: ctx.accounts.user.to_account_info(),
                    },
                    &[&[
                        b"event_wallet",
                        ctx.accounts.admin.key().as_ref(),
                        ctx.accounts.event.key().as_ref(),
                        &[ctx.bumps.event_wallet],
                    ]],
                ),
                ctx.accounts.event.deposit,
            )?;
        }

        Ok(())
    }

    pub fn stop_event(ctx: Context<StopEvent>) -> Result<()> {
        ctx.accounts.event.stopped = true;
        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Event is stopped")]
    EventStopped,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EventArgs {
    pub event_name: String,
    pub deposit: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Event {
    pub admin: Pubkey,
    pub stopped: bool,
    #[max_len(128)]
    pub event_name: String,
    pub deposit: u64, //lamports
    pub event_wallet: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct RSVPAccount {
    pub user: Pubkey,
    pub event: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: EventArgs)]
pub struct InitEvent<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        payer = admin,
        space = 8+Event::INIT_SPACE,
        seeds = [b"event".as_ref(), admin.key().as_ref(), args.event_name.as_ref()],
        bump,
    )]
    pub event: Account<'info, Event>,
    /// CHECK: Holds SOL
    #[account(
        mut,
        seeds = [b"event_wallet".as_ref(), admin.key().as_ref(), event.key().as_ref()],
        bump,
    )]
    pub event_wallet: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct RSVP<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = event.event_wallet == event_wallet.key(),
    )]
    pub event: Account<'info, Event>,
    /// CHECK: Holds SOL
    #[account(mut)]
    pub event_wallet: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        payer = user,
        space = 8+RSVPAccount::INIT_SPACE,
        seeds = [b"rsvp".as_ref(), user.key().as_ref(), event.key().as_ref()],
        bump,
    )]
    pub rsvp_account: Account<'info, RSVPAccount>,
}

#[derive(Accounts)]
#[instruction(evt_name: String)]
pub struct ConfirmRSVP<'info> {
    pub admin: Signer<'info>,
    #[account(
        mut,
        constraint = event.admin == admin.key(), 
        constraint = event.event_wallet == event_wallet.key(),
        seeds = [b"event".as_ref(), admin.key().as_ref(), evt_name.as_ref()],
        bump,
    )]
    pub event: Account<'info, Event>,
    #[account(
        mut,
        constraint = event.event_wallet == event_wallet.key(),
        seeds = [b"event_wallet".as_ref(), admin.key().as_ref(), event.key().as_ref()],
        bump,
    )]
    /// CHECK: Holds SOL
    pub event_wallet: UncheckedAccount<'info>,
    #[account(
        mut,
        close = user
    )]
    pub rsvp_account: Account<'info, RSVPAccount>,

    /// CHECK: User Account will receive close RSVP $
    #[account(mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StopEvent<'info> {
    pub admin: Signer<'info>,
    #[account(
        mut,
        constraint = event.admin == admin.key(),
        seeds = [b"event".as_ref(), admin.key().as_ref(), event.event_name.as_ref()],
        bump,
    )]
    pub event: Account<'info, Event>,
}
