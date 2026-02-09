import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsCompositeCard = formattingSettings.CompositeCard;
import FormattingSettingsGroup = formattingSettings.Group;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Cuadrícula Card Settings
 */
declare class GridCardSettings extends FormattingSettingsCard {
    autoFit: formattingSettings.ToggleSwitch;
    fitMode: formattingSettings.ItemDropdown;
    minWidth: formattingSettings.NumUpDown;
    minHeight: formattingSettings.NumUpDown;
    spacing: formattingSettings.NumUpDown;
    padding: formattingSettings.NumUpDown;
    limitCards: formattingSettings.ToggleSwitch;
    maxCards: formattingSettings.NumUpDown;
    restTitle: formattingSettings.TextInput;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Tarjeta (agrupado)
 */
declare class CardStyleSettings extends FormattingSettingsCompositeCard {
    showTitle: formattingSettings.ToggleSwitch;
    showValueInTitle: formattingSettings.ToggleSwitch;
    titleValueIndex: formattingSettings.NumUpDown;
    titleFont: formattingSettings.FontControl;
    titleColor: formattingSettings.ColorPicker;
    titleAlign: formattingSettings.AlignmentGroup;
    titleLetterSpacing: formattingSettings.NumUpDown;
    titleLineHeight: formattingSettings.NumUpDown;
    titlePaddingHorizontal: formattingSettings.NumUpDown;
    titlePaddingVertical: formattingSettings.NumUpDown;
    titleBoxWidth: formattingSettings.NumUpDown;
    titleBoxHeight: formattingSettings.NumUpDown;
    showTitleBackground: formattingSettings.ToggleSwitch;
    titleBackground: formattingSettings.ColorPicker;
    borderColor: formattingSettings.ColorPicker;
    borderWidth: formattingSettings.NumUpDown;
    borderRadius: formattingSettings.NumUpDown;
    background: formattingSettings.ColorPicker;
    cardBoxGroup: formattingSettings.Group;
    titleGroup: formattingSettings.Group;
    name: string;
    displayName: string;
    groups: Array<FormattingSettingsGroup>;
    onPreProcess(): void;
}
/**
 * Etiquetas Card Settings
 */
declare class LabelCardSettings extends FormattingSettingsCompositeCard {
    applyTo: formattingSettings.ItemDropdown;
    valueOverrides: formattingSettings.TextInput;
    valueLayout: formattingSettings.ItemDropdown;
    mosaicColumns: formattingSettings.NumUpDown;
    mosaicGap: formattingSettings.NumUpDown;
    mosaicRows: formattingSettings.NumUpDown;
    tableColumns: formattingSettings.NumUpDown;
    tableRows: formattingSettings.NumUpDown;
    labelFont: formattingSettings.FontControl;
    labelAlign: formattingSettings.AlignmentGroup;
    labelColor: formattingSettings.ColorPicker;
    valueFont: formattingSettings.FontControl;
    valueAlign: formattingSettings.AlignmentGroup;
    valueColor: formattingSettings.ColorPicker;
    customLabels: formattingSettings.TextInput;
    pendingNote: formattingSettings.ReadOnlyText;
    name: string;
    displayName: string;
    presentationGroup: formattingSettings.Group;
    applyGroup: formattingSettings.Group;
    shapeGroup: formattingSettings.Group;
    spacingGroup: formattingSettings.Group;
    valueGroup: formattingSettings.Group;
    labelGroup: formattingSettings.Group;
    imageGroup: formattingSettings.Group;
    backgroundGroup: formattingSettings.Group;
    groups: Array<FormattingSettingsGroup>;
    onPreProcess(): void;
}
/**
 * Tooltip Card Settings
 */
declare class TooltipCardSettings extends FormattingSettingsCard {
    showCategory: formattingSettings.ToggleSwitch;
    showValues: formattingSettings.ToggleSwitch;
    showExtra: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Comportamiento Card Settings
 */
declare class BehaviorCardSettings extends FormattingSettingsCard {
    enableSelection: formattingSettings.ToggleSwitch;
    enableTooltip: formattingSettings.ToggleSwitch;
    colorBySign: formattingSettings.ToggleSwitch;
    positiveColor: formattingSettings.ColorPicker;
    negativeColor: formattingSettings.ColorPicker;
    sortByValueIndex: formattingSettings.NumUpDown;
    sortDescending: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Configuración de gráfico
 */
declare class ChartConfigSettings extends FormattingSettingsCard {
    showChart: formattingSettings.ToggleSwitch;
    chartType: formattingSettings.ItemDropdown;
    useValueIndex: formattingSettings.NumUpDown;
    chartHeight: formattingSettings.NumUpDown;
    chartWidth: formattingSettings.NumUpDown;
    chartBottomSpacing: formattingSettings.NumUpDown;
    chartColor: formattingSettings.ColorPicker;
    chartBackColor: formattingSettings.ColorPicker;
    markerColor: formattingSettings.ColorPicker;
    markerWidth: formattingSettings.NumUpDown;
    maxValue: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Valores de gráfico
 */
declare class ChartValuesSettings extends FormattingSettingsCard {
    showPercentage: formattingSettings.ToggleSwitch;
    percentSource: formattingSettings.ItemDropdown;
    percentageMode: formattingSettings.ItemDropdown;
    percentageDecimals: formattingSettings.NumUpDown;
    percentLabelColor: formattingSettings.ColorPicker;
    percentLabelSize: formattingSettings.NumUpDown;
    percentLabelPosition: formattingSettings.ItemDropdown;
    showActualLabel: formattingSettings.ToggleSwitch;
    showTargetLabel: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * visual settings model class
 */
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    gridCard: GridCardSettings;
    cardStyle: CardStyleSettings;
    labelCard: LabelCardSettings;
    tooltipCard: TooltipCardSettings;
    behaviorCard: BehaviorCardSettings;
    chartConfig: ChartConfigSettings;
    chartValues: ChartValuesSettings;
    cards: (GridCardSettings | CardStyleSettings | LabelCardSettings | TooltipCardSettings | BehaviorCardSettings | ChartConfigSettings | ChartValuesSettings)[];
}
export {};
