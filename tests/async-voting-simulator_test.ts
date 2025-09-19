import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.4.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "async-voting-simulator: Voting event creation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('async-voting-simulator', 'create-voting-event', [
                types.ascii('Community Budget'),
                types.utf8('Allocate community funding'),
                types.uint(1000),
                types.uint(1), // Self-verification
                types.uint(1)  // Public event
            ], deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "async-voting-simulator: Vote submission",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('async-voting-simulator', 'create-voting-event', [
                types.ascii('Community Budget'),
                types.utf8('Allocate community funding'),
                types.uint(1000),
                types.uint(1), // Self-verification
                types.uint(1)  // Public event
            ], deployer.address),
            Tx.contractCall('async-voting-simulator', 'submit-vote', [
                types.uint(1), // Voting event ID
                types.uint(0), // Option index
                types.bool(true) // Vote choice
            ], deployer.address)
        ]);

        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectOk().expectBool(true);
    }
});