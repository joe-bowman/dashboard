/**
 * Transactions often have amino decoded objects in them {type, value}.
 * We need to strip this clutter as we need to sign only the values.
 *
 * TODO: Add tests.
 */
export const prepareSignBytes = (jsonTransaction: any): any => {
  if (Array.isArray(jsonTransaction)) {
    return jsonTransaction.map(prepareSignBytes);
  }

  // string or number
  if (typeof jsonTransaction !== "object") {
    return jsonTransaction;
  }

  const sorted = {};
  Object.keys(jsonTransaction)
    .sort()
    .forEach(key => {
      if (jsonTransaction[key] === undefined || jsonTransaction[key] === null) {
        return;
      }

      // TODO: Refactor this
      // @ts-ignore
      // tslint:disable-next-line
      sorted[key] = prepareSignBytes(jsonTransaction[key]);
    });
  return sorted;
};

/**
 * The SDK expects a certain message format to serialize and then sign:
 *
 * type StdSignMsg struct {
 *   ChainID       string      `json:"chain_id"`
 *   AccountNumber uint64      `json:"account_number"`
 *   Sequence      uint64      `json:"sequence"`
 *   Fee           auth.StdFee `json:"fee"`
 *   Msgs          []sdk.Msg   `json:"msgs"`
 *   Memo          string      `json:"memo"`
 * }
 *
 * TODO: Add tests.
 */
export const createSignMessage = (
  jsonTransaction: any,
  { sequence, account_number, chain_id }: any,
) => {
  // sign bytes need amount to be an array
  const fee = {
    amount: jsonTransaction.fee.amount || [],
    gas: jsonTransaction.fee.gas,
  };

  console.log(sequence, account_number, chain_id);

  return JSON.stringify(
    prepareSignBytes({
      fee,
      sequence,
      chain_id,
      account_number,
      memo: jsonTransaction.memo,
      msgs: jsonTransaction.msg, // weird msg vs. msgs
    }),
  );
};
