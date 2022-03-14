import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {DataParser} from "./lib/dataParser";
import {EnergyValuesPlain} from "./interfaces/EnergyValues";
import {DataValidation} from "./lib/DataValidation";


export class SenecIES {

    private readonly options: AxiosRequestConfig;
    //
    private readonly DataValidationMaxValues = 10;
    private readonly DataValidationOffset = 2;
    //count to 5, then calculate new
    private DataValidationCalcLS = 0;
    private SENECDataValidation: EnergyValuesPlain<DataValidation> = {
        BatteryCharge: new DataValidation(this.DataValidationMaxValues, this.DataValidationOffset),
        BatteryDischarge: new DataValidation(this.DataValidationMaxValues, this.DataValidationOffset),
        GridExport: new DataValidation(this.DataValidationMaxValues, this.DataValidationOffset),
        GridImport: new DataValidation(this.DataValidationMaxValues, this.DataValidationOffset),
        PVGenerated: new DataValidation(this.DataValidationMaxValues, this.DataValidationOffset),
        HouseConsumption: new DataValidation(this.DataValidationMaxValues, this.DataValidationOffset)
    };

    //configure request parameters
    constructor(host: string) {
        this.options =
            {
                method: "POST",
                timeout: 2000,
                //headers: {'Access-Control-Allow-Origin': 'http://localhost:8888'},
                url: `http://${host}/cgi-bin/ILRReadValues.exe`,
                data: '<body><version>1.0</version><client>IMasterPhoenix5_14_05</client><client_ver>5.14.0501</client_ver><item_list_size></item_list_size><item_list_size>23</item_list_size><item_list><i><n>@GV.RTC_SECONDS</n></i><i><n>@GV.GuiData.OverView.Energy.HouseConsumption</n></i><i><n>@GV.GuiData.OverView.Power.HouseConsumption</n></i><i><n>@GV.GuiData.OverView.Energy.BatteryCharge</n></i><i><n>@GV.GuiData.OverView.Power.BatteryCharge</n></i><i><n>@GV.GuiData.OverView.Energy.GridImport</n></i><i><n>@GV.GuiData.OverView.Power.GridImport</n></i><i><n>@GV.GuiData.OverView.Energy.PVGenerated</n></i><i><n>@GV.GuiData.OverView.Power.PVGenerated</n></i><i><n>@GV.GuiData.OverView.Energy.BatteryDischarge</n></i><i><n>@GV.GuiData.OverView.Power.BatteryDischarge</n></i><i><n>@GV.GuiData.OverView.Energy.GridExport</n></i><i><n>@GV.GuiData.OverView.Power.GridExport</n></i><i><n>@GV.GuiData.DateConfig.DateString</n></i><i><n>@GV.GuiData.Status.SystemState</n></i><i><n>@GV.PLCMODE_RUN</n></i><i><n>@GV.GuiData.Login.userLevel</n></i><i><n>@GV.GuiData.Status.LicenseIsOk</n></i><i><n>@GV.GuiData.Status.SerialNumber</n></i><i><n>@GV.GuiData.Configuration.ConfigMissing</n></i><i><n>@GV.GuiData.Configuration.RunWizard</n></i><i><n>@GV.GuiData.Status.MaintenanceRequired</n></i><i><n>@GV.GuiData.Network.UpdateStatus</n></i></item_list></body>'
            };
    }

    async handleSenec() {
        try {
            const data: AxiosResponse<string> = await axios(this.options);
            if (!data?.data) {
                console.error(data);
                throw new Error(data.data);
            }
            //parse data for sending
            const responseSchema = DataParser.parseData(DataParser.parseXML(data.data));
            //DataValidation
            let key: keyof EnergyValuesPlain<number>;
            //will be false if NULL was in packet values
            let validPacket = true;
            for (key in responseSchema.Energy) {
                //check value
                const checkedValue = this.SENECDataValidation[key].checkValue(responseSchema.Energy[key]);
                if (checkedValue === null) validPacket = false;
                //add value and count calcLS counter
                this.SENECDataValidation[key].addValue(responseSchema.Energy[key], this.DataValidationCalcLS === 5);
                //set after addValue was executed
                responseSchema.Energy[key] = checkedValue;
                if (this.DataValidationCalcLS >= 5) {
                    this.DataValidationCalcLS = 0;
                }
                this.DataValidationCalcLS++;
            }
            return {responseSchema, validPacket};
        } catch (e) {
            throw new Error(e.message);
        }
    }
}
