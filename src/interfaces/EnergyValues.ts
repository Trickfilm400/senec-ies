export interface EnergyValues {
    Energy: EnergyValuesPlain<number>,
    Power: EnergyValuesPlain<number>,
    StatusString: string,
    Battery: {
        Current: number,
        Voltage: number,
        FuelGauge: number,
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
