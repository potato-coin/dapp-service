const dotEnv = require('dotenv-safe');

dotEnv.config({
  allowEmptyValues: true
});

const Koa = require('koa');

const {
    Api,
    JsonRpc,
    JsSignatureProvider,
    RpcError
} = require('pcjs');
const fetch = require('node-fetch');
const {
    TextEncoder,
    TextDecoder
} = require('util');

const signatureProvider = new JsSignatureProvider([
    '5KdC5izmPV6WkY4afTdzzcyx5dyQ2z6Ax9tDCSqFwGBA5twQogz'
]);
const rpc = new JsonRpc(process.env.CHAIN_RPC_URL, {
    fetch: fetch
});
const api = new Api({
    rpc: rpc,
    signatureProvider: signatureProvider,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
});

const account = 'dice2';
const bet_table = 'bet_stats';
setInterval(async () => {
    try {
        let bets = await rpc.get_table_rows({ code: account, scope: account, table: bet_table, limit: 25 });
        // console.log(bets);
        for (const key in bets.rows) {
            const result = await api.transact({
                actions: [{
                    account: account,
                    name: 'resolvebet',
                    authorization: [{
                        actor: account,
                        permission: 'active'
                    }],
                    data: {
                        bet_id: bets.rows[key].id
                    }
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30
            });
            // console.log(result);
        }
    } catch (error) {
        console.log('dice:', error);
    }
}, 3000);


const app = new Koa();
app.listen(4041);