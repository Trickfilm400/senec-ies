export declare class SenecIES {
    private readonly options;
    private readonly DataValidationMaxValues;
    private readonly DataValidationOffset;
    private DataValidationCalcLS;
    private SENECDataValidation;

    constructor(host: string);

    handleSenec(): Promise<{
        responseSchema: EnergyValues;
        validPacket: boolean;
    }>;
}


/**
 * @author Jens H.
 */
export declare class DataValidation {
    private readonly n;
    private readonly t;
    private params;
    private xData;
    private yData;

    /**
     * @param maxValues - Max Values used for calculation
     * @param t Max difference between calculation and value to test
     */
    constructor(maxValues: number, t: number);

    private static cov;
    private calcLS;

    addValue(value: number, calcLS?: boolean): void;

    private predicted;

    checkValue(value: number): number;
}


export declare class DataParser {
    static parseXML(xml: string): ResponseSchema;

    static parseData(xml: ResponseSchema): null | EnergyValues;
}


export interface ResponseSchema {
    body: {
        version: {
            _text: string;
        };
        client: {
            _text: string;
        };
        client_ver: {
            _text: string;
        };
        item_list_size: [{}, {
            _text: string;
        }];
        item_list: {
            i: {
                n: {
                    _text: string;
                };
                v: {
                    _text: string;
                };
            }[];
        };
    };
}


export interface EnergyValues {
    Energy: EnergyValuesPlain<number>;
    Power: EnergyValuesPlain<number>;
    StatusString: string;
    Battery: {
        Current: number;
        Voltage: number;
        FuelGauge: number;
    };
}

export interface EnergyValuesPlain<T> {
    BatteryCharge: T;
    BatteryDischarge: T;
    GridExport: T;
    GridImport: T;
    HouseConsumption: T;
    PVGenerated: T;
}



/**
 * Copied from Senec.IES Web application via dev-tools
 */
export declare const StatusStrings: Record<string, string>;
