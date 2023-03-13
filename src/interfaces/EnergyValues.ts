export interface EnergyValues {
    Energy: EnergyValuesPlain<number>,
    Power: EnergyValuesPlain<number>,
    StatusString: string
}


export interface EnergyValuesPlain<T> {
    BatteryCharge: T,
    BatteryDischarge: T,
    GridExport: T,
    GridImport: T,
    HouseConsumption: T,
    PVGenerated: T
}
