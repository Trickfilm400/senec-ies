export declare class SenecIES {
    private host;
    private readonly DataValidationMaxValues;
    private readonly DataValidationOffset;
    private DataValidationCalcLS;
    private SENECDataValidation;
    constructor(host: string);
    getValues(): Promise<{
        responseSchema: EnergyValues;
        validPacket: boolean;
    }>;
    setTestChargeLoad(load: number): Promise<Response>;
    startCharging(load: number): Promise<string>;
    stopCharging(): Promise<string>;
    login(username: string, password: string): Promise<Response>;
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
    loginLevel: string;
    Battery: {
        Current: number;
        Voltage: number;
        FuelGauge: number;
    };
    TestCharge: {
        Charge: any;
        Discharge: any;
        PowerOffset: any;
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
