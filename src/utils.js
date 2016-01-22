export function payment(conn, credit, debit, amount, description) {
  return conn.insert({
    debit_account: debit,
    credit_account: credit,
    amount: amount,
    description: description
  })
  .into('ledger')
  .returning('id')
}

function checkAmount(conn, account, name) {
  return conn
    .select(conn.raw('COALESCE(sum(amount), 0.0)'))
    .from('ledger')
    .where(account, name)
    .first()
    .then(res => res.coalesce)
}