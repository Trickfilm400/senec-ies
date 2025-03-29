import {xml2js} from "xml-js";
import {ResponseSchema} from "../interfaces/ResponseSchema";
import {EnergyValues} from "../interfaces/EnergyValues";
import {StatusStrings} from "./StatusStrings";

export class DataParser {
    static parseXML(xml: string): ResponseSchema {
        return xml2js(xml, {compact: true}) as ResponseSchema;
    }

    static parseData(xml: ResponseSchema): null | EnergyValues {
        //filter irrelevant data out of array
        //(check if string has type and parent type => filter "@GV.RTC_SECONDS" out)
        const filteredArray = xml.body.item_list.i.filter(el => el.n._text.includes("@GV.GuiData.OverView"));
        //check if xml is ok
        if (filteredArray.length !== 12) return null;
        //save data in new json object
        let z: EnergyValues = {
            Power: {
                BatteryCharge: null,
                BatteryDischarge: null,
                GridExport: null,
                GridImport: null,
                HouseConsumption: null,
                PVGenerated: null
            },
            Energy: {
                BatteryCharge: null,
                GridExport: null,
                PVGenerated: null,
                BatteryDischarge: null,
                GridImport: null,
                HouseConsumption: null
            },
            Battery: {
                Current: parseFloat(xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.Battery.Current").v._text),
                Voltage: parseFloat(xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.Battery.Voltage").v._text),
                FuelGauge: parseFloat(xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.Battery.FuelGauge").v._text)
            },
            TestCharge: {
                Charge: xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.TestCharge.Charge").v._text === "1",
                Discharge: xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.TestCharge.Discharge").v._text === "1",
                PowerOffset: parseInt(xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.TestCharge.PowerOffset").v._text)
            },
            StatusString: StatusStrings[xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.Status.SystemState").v._text],
            loginLevel: xml.body.item_list.i.find(el => el.n._text === "@GV.GuiData.Login.userLevel").v._text
        };
        //loop over array and parse values into json to save and return it
        filteredArray.forEach(el => {
            const [, , , parent, type] = el.n._text.split(".");
            z[parent][type] = parseFloat(el.v._text);
        });
        return z;

    }
}
