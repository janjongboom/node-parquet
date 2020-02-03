// Type definitions for edge-impulse-parquet
// This file is far from complete, but at least good enough for our simple usecase

export type ParquetType = 'boolean' | 'int32' | 'int64' | 'int96' | 'float' | 'double' |
                          'byte_array' | 'timestamp' | 'utf8';

export type ParquetSchema = { [k: string]: { type: ParquetType, optional?: boolean } };
export type ParquetRows = ((number | string | boolean | undefined)[] | Buffer | string)[];

export class ParquetWriter {
    constructor(file: string, schema: ParquetSchema, compression?: string);
    write(rows: ParquetRows): number;
    close(): void;
}

export class ParquetReader {
    constructor(file: string);
    info(): {
        version: number;
        createdBy: string;
        rowGroups: number;
        columns: number;
        rows: number;
        schema: ParquetSchema;
    };
    close(): void;
    rows(count: number): ParquetRows;
}
