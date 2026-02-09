import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var customvisualtarjetamultiple9A2F8D7C6B5E4A3D1F0E9C8B7A6D5E4F: IVisualPlugin = {
    name: 'customvisualtarjetamultiple9A2F8D7C6B5E4A3D1F0E9C8B7A6D5E4F',
    displayName: 'Tarjeta Multiple',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["customvisualtarjetamultiple9A2F8D7C6B5E4A3D1F0E9C8B7A6D5E4F"] = customvisualtarjetamultiple9A2F8D7C6B5E4A3D1F0E9C8B7A6D5E4F;
}
export default customvisualtarjetamultiple9A2F8D7C6B5E4A3D1F0E9C8B7A6D5E4F;