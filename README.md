# WORK IN PROGRESS

This is an extremely simple demo of a binary options trading platform.

- Asset prices are randomly generated, as are the payouts.

- New prices are updated on every "tick" (approx. one second, but since it uses setInterval
this is not precise). Updates will be pushed to clients using websockets as long as there is 
at least one listener on the channel.

- There is a cental ledger that uses basic double-entry bookkeeping for all financial transactions on the platform,
and ensures that no user can ever be overdrawn, nor can the platform itself be overextended.

- Settlement (examining expired options and deciding if they finished in or out of the money, then making appropriate transactions)
takes place every 15 seconds.

- Order submission is kept secure using JWT, preventing the strike price/payout being tampered with.

- There is a simple REST API to obtain historical asset prices, and submit and retrieve
user options.

Weaknesses:
- There is no security or authorization at all.
- There is no logic to the asset price or payouts.
- There is only basic error catching, little input validation and no testing

