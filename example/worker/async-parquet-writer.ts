import { ParquetSchema, ParquetRows } from "../../edge-impulse-parquet";
import { Worker } from 'worker_threads';
import Path from 'path';

export class AsyncParquetWriter {
    private _worker: Worker;
    private _initialized = false;
    private _error: string | undefined;
    private _exited = false;

    constructor(file: string, schema: ParquetSchema) {
        this._worker = new Worker(Path.join(__dirname, 'write-worker.js'), {
            workerData: {
                filename: file,
                schema: schema
            }
        });

        this._worker.on('online', () => this._initialized = true);
        this._worker.on('error', err => this._error = err.message || err.toString());
        this._worker.on('exit', code => {
            if (!this._error && code !== 0) {
                this._error = 'Worker exited with code ' + code;
            }

            this._exited = true;
        });
    }

    /**
     * Waits for the device to start
     */
    async init() {
        if (!this._initialized) {
            function awaitWorkerOnline() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => reject('Worker did not come online within 5s'), 5000);
                    this._worker.once('online', resolve);
                });
            }

            await awaitWorkerOnline();
        }

        if (this._error || this._exited) {
            throw this._error;
        }

        // OK...
    }

    async write(rows: ParquetRows, timeout: number = 3000) {
        this._worker.postMessage({ type: 'rows', rows: rows });
        await this.waitForMessage('rows-ok', timeout);
    }

    async finalize(timeout: number = 5000) {
        this._worker.postMessage({ type: 'finalize' });
        await this.waitForMessage('finalize-ok', timeout);
    }

    private async waitForMessage(type: string, timeout: number) {
        return new Promise((resolve, reject) => {
            let to = setTimeout(() => {
                if (this._error) {
                    reject(this._error);
                }
                else {
                    reject(`Worker timed out when writing rows (max. ${timeout} ms.)`);
                }
            }, timeout);

            const onMessage = (msg: { type: string }) => {
                if (msg.type === type) {
                    clearTimeout(to);
                    resolve();
                    this._worker.off('message', onMessage);
                }
            };

            this._worker.on('message', onMessage);
        });
    }
}
