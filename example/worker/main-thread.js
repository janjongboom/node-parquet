const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js', {
    workerData: {
        filename: 'test.parquet',
        schema: {
            timestamp: { type: 'timestamp' },
            float1: { type: 'float' },
            float2: { type: 'float' }
        }
    }
});

worker.on('message', msg => console.log('main thread got message', msg));
worker.on('error', err => console.log('main thread got error', err));
worker.on('exit', code => console.log('main thread got exit', code));
worker.on('online', async () => {
    console.log('worker is online');

    function waitForRowsOK() {
        return new Promise((resolve, reject) => {
            let to = setTimeout(() => reject('Worker timed out when writing rows (max. 3000 ms.)'), 3000);

            const onMessage = msg => {
                if (msg.type === 'rows-ok') {
                    clearTimeout(to);
                    resolve();
                    worker.off('message', onMessage);
                }
            };

            worker.on('message', onMessage);
        });
    }

    let tx = 0;
    for (let ix = 0; ix < 100; ix++) {
        let rows = [];
        for (let jx = 0; jx < 1000; jx++) {
            rows.push([ Date.now(), tx, tx * 2 ]);
            tx++;
        }
        worker.postMessage({ type: 'rows', rows: rows });
        await waitForRowsOK();
    }

    worker.postMessage({ type: 'finalize' });
});

console.log('hello world');
