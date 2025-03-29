export interface EnergyValues {
    Energy: EnergyValuesPlain<number>,
    Power: EnergyValuesPlain<number>,
    StatusString: string,
    loginLevel: string,
    Battery: {
        Current: number,
        Voltage: number,
        FuelGauge: number,
    },
    TestCharge: {
        Charge: any,
        Discharge: any,
        PowerOffset: any
    }
}


export interface EnergyValuesPlain<T> {
    BatteryCharge: T,
    BatteryDischarge: T,
    GridExport: T,
    GridImport: T,
    HouseConsumption: T,
    PVGenerated: T
}
