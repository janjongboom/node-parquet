const parquet = require('edge-impulse-parquet');
const { isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    console.error('Worker is ran on the main thread, this is not supported');
    process.exit(1);
}

if (!workerData.filename) {
    return parentPort.postMessage({ type: 'error', message: 'Missing "filename"' });
}

if (!workerData.schema) {
    return parentPort.postMessage({ type: 'error', message: 'Missing "schema"' });
}

let writer = new parquet.ParquetWriter(workerData.filename, workerData.schema);

const onMessage = msg => {
    switch (msg.type) {
        case 'rows':
            writer.write(msg.rows);
            parentPort.postMessage({ type: 'rows-ok' });
            break;
        case 'finalize':
            writer.close();
            parentPort.off('message', onMessage);
            break;
        default:
            parentPort.postMessage({ type: 'error', message: 'Invalid message type "' + msg.type + '"' });
            break;
    }
};

parentPort.on('message', onMessage);
