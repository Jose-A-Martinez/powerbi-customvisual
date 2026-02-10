/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsCompositeCard = formattingSettings.CompositeCard;
import FormattingSettingsGroup = formattingSettings.Group;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Cuadrícula Card Settings
 */
class GridCardSettings extends FormattingSettingsCard {
    autoFit = new formattingSettings.ToggleSwitch({
        name: "autoFit",
        displayName: "Ajuste automático",
        value: true
    });

    fitMode = new formattingSettings.ItemDropdown({
        name: "fitMode",
        displayName: "Modo de ajuste",
        items: [
            { value: "fit", displayName: "Ajustar" },
            { value: "fill", displayName: "Rellenar" },
            { value: "center", displayName: "Centro" }
        ],
        value: { value: "fit", displayName: "Ajustar" }
    });

    minWidth = new formattingSettings.NumUpDown({
        name: "minWidth",
        displayName: "Ancho mínimo",
        value: 150
    });

    minHeight = new formattingSettings.NumUpDown({
        name: "minHeight",
        displayName: "Alto mínimo",
        value: 100
    });

    spacing = new formattingSettings.NumUpDown({
        name: "spacing",
        displayName: "Separación",
        value: 0
    });

    padding = new formattingSettings.NumUpDown({
        name: "padding",
        displayName: "Margen interno",
        value: 0
    });


    limitCards = new formattingSettings.ToggleSwitch({
        name: "limitCards",
        displayName: "Limitar tarjetas",
        value: false
    });

    maxCards = new formattingSettings.NumUpDown({
        name: "maxCards",
        displayName: "Máximo de tarjetas",
        value: 8
    });

    restTitle = new formattingSettings.TextInput({
        name: "restTitle",
        displayName: "Título para Resto",
        value: "Resto",
        placeholder: "Resto"
    });

    name: string = "gridCard";
    displayName: string = "Cuadrícula";
    slices: Array<FormattingSettingsSlice> = [this.autoFit, this.fitMode, this.minWidth, this.minHeight, this.spacing, this.padding, this.limitCards, this.maxCards, this.restTitle];
}

/**
 * Tarjeta (agrupado)
 */
class CardStyleSettings extends FormattingSettingsCompositeCard {
    showTitle = new formattingSettings.ToggleSwitch({
        name: "showTitle",
        displayName: "Mostrar título",
        value: true
    });

    showValueInTitle = new formattingSettings.ToggleSwitch({
        name: "showValueInTitle",
        displayName: "Mostrar valor en título",
        value: false,
        description: "Activa para agregar un valor al título usando 'Valor # en título (1..n)'."
    });

    titleValueIndex = new formattingSettings.NumUpDown({
        name: "titleValueIndex",
        displayName: "Valor # en título (1..n)",
        value: 1,
        description: "Se usa solo si 'Mostrar valor en título' está activado."
    });

    titleFont = new formattingSettings.FontControl({
        name: "titleFont",
        displayName: "Fuente",
        fontFamily: new formattingSettings.FontPicker({
            name: "titleFontFamily",
            displayName: "Fuente",
            value: "Calibri"
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: "titleFontSize",
            displayName: "Tamaño",
            value: 10
        }),
        bold: new formattingSettings.ToggleSwitch({
            name: "titleBold",
            displayName: "Negrita",
            value: false
        }),
        italic: new formattingSettings.ToggleSwitch({
            name: "titleItalic",
            displayName: "Cursiva",
            value: false
        }),
        underline: new formattingSettings.ToggleSwitch({
            name: "titleUnderline",
            displayName: "Subrayado",
            value: false
        })
    });

    titleColor = new formattingSettings.ColorPicker({
        name: "titleColor",
        displayName: "Color del título",
        value: { value: "#666666" }
    });

    titleAlign = new formattingSettings.AlignmentGroup({
        name: "titleAlign",
        displayName: "Alineación",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        value: "center"
    });

    titleLetterSpacing = new formattingSettings.NumUpDown({
        name: "titleLetterSpacing",
        displayName: "Espaciado letras del título",
        value: 0
    });

    titleLineHeight = new formattingSettings.NumUpDown({
        name: "titleLineHeight",
        displayName: "Interlineado del título",
        value: 1.2
    });

    titlePaddingHorizontal = new formattingSettings.NumUpDown({
        name: "titlePaddingHorizontal",
        displayName: "Margen horizontal del título",
        value: 0
    });

    titlePaddingVertical = new formattingSettings.NumUpDown({
        name: "titlePaddingVertical",
        displayName: "Margen vertical del título",
        value: 0
    });

    titleBoxWidth = new formattingSettings.NumUpDown({
        name: "titleBoxWidth",
        displayName: "Ancho del box del título (%)",
        value: 0,
        description: "0 = automático."
    });

    titleBoxHeight = new formattingSettings.NumUpDown({
        name: "titleBoxHeight",
        displayName: "Alto del box del título (px)",
        value: 0,
        description: "0 = automático."
    });


    showTitleBackground = new formattingSettings.ToggleSwitch({
        name: "showTitleBackground",
        displayName: "Fondo del título",
        value: true
    });

    titleBackground = new formattingSettings.ColorPicker({
        name: "titleBackground",
        displayName: "Color de fondo",
        value: { value: "#f5f5f5" }
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Color del borde",
        value: { value: "#d0d0d0" }
    });

    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Ancho del borde",
        value: 1
    });

    borderTop = new formattingSettings.ToggleSwitch({
        name: "borderTop",
        displayName: "Borde superior",
        value: true
    });

    borderRight = new formattingSettings.ToggleSwitch({
        name: "borderRight",
        displayName: "Borde derecho",
        value: true
    });

    borderBottom = new formattingSettings.ToggleSwitch({
        name: "borderBottom",
        displayName: "Borde inferior",
        value: true
    });

    borderLeft = new formattingSettings.ToggleSwitch({
        name: "borderLeft",
        displayName: "Borde izquierdo",
        value: true
    });

    borderRadius = new formattingSettings.NumUpDown({
        name: "borderRadius",
        displayName: "Radio del borde",
        value: 4
    });

    showBackground = new formattingSettings.ToggleSwitch({
        name: "showBackground",
        displayName: "Fondo",
        value: true
    });

    background = new formattingSettings.ColorPicker({
        name: "background",
        displayName: "Fondo",
        value: { value: "#ffffff" }
    });

    cardBoxGroup = new formattingSettings.Group({
        name: "cardBoxGroup",
        displayName: "Configuracion tarjeta",
        collapsible: true,
        slices: [
            this.borderColor,
            this.borderWidth,
            this.borderTop,
            this.borderRight,
            this.borderBottom,
            this.borderLeft,
            this.borderRadius,
            this.showBackground,
            this.background
        ]
    });


    titleGroup = new formattingSettings.Group({
        name: "cardTitleGroup",
        displayName: "Título",
        collapsible: true,
        slices: [this.showTitle, this.showValueInTitle, this.titleValueIndex, this.titleFont, this.titleAlign, this.titleLetterSpacing, this.titleLineHeight, this.titlePaddingHorizontal, this.titlePaddingVertical, this.titleBoxWidth, this.titleBoxHeight, this.titleColor, this.showTitleBackground, this.titleBackground]
    });

    name: string = "cardStyle";
    displayName: string = "Tarjetas general";
    groups: Array<FormattingSettingsGroup> = [this.cardBoxGroup, this.titleGroup];

    onPreProcess() {
        this.titleBackground.visible = this.showTitleBackground.value;
        this.background.visible = this.showBackground.value;
    }
}

/**
 * Etiquetas Card Settings
 */
class LabelCardSettings extends FormattingSettingsCompositeCard {
    allowDrag = new formattingSettings.ToggleSwitch({
        name: "allowDrag",
        displayName: "Facilitar arrastre visual",
        value: false
    });

    valueDisplayUnits = new formattingSettings.ItemDropdown({
        name: "valueDisplayUnits",
        displayName: "Mostrar unidades",
        items: [
            { value: "auto", displayName: "Automático" },
            { value: "none", displayName: "Ninguno" },
            { value: "thousands", displayName: "Miles" },
            { value: "millions", displayName: "Millones" },
            { value: "billions", displayName: "Mil millones" },
            { value: "trillions", displayName: "Billones" },
            { value: "percent", displayName: "Porcentaje (%)" },
            { value: "custom", displayName: "Personalizado" }
        ],
        value: { value: "auto", displayName: "Automático" }
    });

    valueFormatCode = new formattingSettings.TextInput({
        name: "valueFormatCode",
        displayName: "Formato de código",
        value: "",
        placeholder: "Ej: #,0.00"
    });

    applyTo = new formattingSettings.ItemDropdown({
        name: "applyToKey",
        displayName: "Tarjetas",
        items: [
            { value: "all", displayName: "Todas" }
        ],
        value: { value: "all", displayName: "Todas" }
    });

    saveOverrides = new formattingSettings.ToggleSwitch({
        name: "saveOverrides",
        displayName: "Guardar cambios por métrica",
        value: false
    });

    valueOverrides = new formattingSettings.TextInput({
        name: "valueOverrides",
        displayName: "",
        value: "",
        placeholder: ""
    });
    valueLayout = new formattingSettings.ItemDropdown({
        name: "valueLayout",
        displayName: "Mostrar como",
        items: [
            { value: "table", displayName: "Tabla" },
            { value: "mosaic", displayName: "Mosaicos" }
        ],
        value: { value: "mosaic", displayName: "Mosaicos" }
    });

    mosaicColumns = new formattingSettings.NumUpDown({
        name: "mosaicColumns",
        displayName: "Columnas",
        value: 2,
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 1 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 99 }
        }
    });

    mosaicGap = new formattingSettings.NumUpDown({
        name: "mosaicGap",
        displayName: "Separación",
        value: 6
    });

    mosaicRows = new formattingSettings.NumUpDown({
        name: "mosaicRows",
        displayName: "Filas",
        value: 0,
        description: "0 = automático.",
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 99 }
        }
    });

    tableColumns = new formattingSettings.NumUpDown({
        name: "tableColumns",
        displayName: "Columnas",
        value: 1,
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 1 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 99 }
        }
    });

    tableRows = new formattingSettings.NumUpDown({
        name: "tableRows",
        displayName: "Filas",
        value: 0,
        description: "0 = automático.",
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 0 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 99 }
        }
    });

    labelFont = new formattingSettings.FontControl({
        name: "labelFont",
        displayName: "Fuente etiqueta",
        fontFamily: new formattingSettings.FontPicker({
            name: "labelFontFamily",
            displayName: "Fuente",
            value: "Calibri"
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: "labelFontSize",
            displayName: "Tamaño",
            value: 10
        }),
        bold: new formattingSettings.ToggleSwitch({
            name: "labelBold",
            displayName: "Negrita",
            value: false
        }),
        italic: new formattingSettings.ToggleSwitch({
            name: "labelItalic",
            displayName: "Cursiva",
            value: false
        }),
        underline: new formattingSettings.ToggleSwitch({
            name: "labelUnderline",
            displayName: "Subrayado",
            value: false
        })
    });

    labelAlign = new formattingSettings.AlignmentGroup({
        name: "labelAlign",
        displayName: "Alineación",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        value: "center"
    });

    labelColor = new formattingSettings.ColorPicker({
        name: "labelColor",
        displayName: "Color de etiqueta",
        value: { value: "#666666" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    valueFont = new formattingSettings.FontControl({
        name: "valueFont",
        displayName: "Fuente valor",
        fontFamily: new formattingSettings.FontPicker({
            name: "valueFontFamily",
            displayName: "Fuente",
            value: "Calibri"
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: "valueFontSize",
            displayName: "Tamaño",
            value: 10
        }),
        bold: new formattingSettings.ToggleSwitch({
            name: "valueBold",
            displayName: "Negrita",
            value: false
        }),
        italic: new formattingSettings.ToggleSwitch({
            name: "valueItalic",
            displayName: "Cursiva",
            value: false
        }),
        underline: new formattingSettings.ToggleSwitch({
            name: "valueUnderline",
            displayName: "Subrayado",
            value: false
        })
    });

    valueAlign = new formattingSettings.AlignmentGroup({
        name: "valueAlign",
        displayName: "Alineación",
        mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
        value: "center"
    });

    valueColor = new formattingSettings.ColorPicker({
        name: "valueColor",
        displayName: "Color valor",
        value: { value: "#666666" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        description: "Se aplica cuando las reglas de color están desactivadas."
    });

    enableColorRules = new formattingSettings.ToggleSwitch({
        name: "enableColorRules",
        displayName: "Reglas de color",
        value: false
    });

    rule1Title = new formattingSettings.ReadOnlyText({
        name: "rule1Title",
        displayName: "Regla 1",
        value: ""
    });

    rule1Min = new formattingSettings.TextInput({
        name: "rule1Min",
        displayName: "Mínimo",
        value: "",
        placeholder: "Sin límite"
    });

    rule1Max = new formattingSettings.TextInput({
        name: "rule1Max",
        displayName: "Máximo",
        value: "",
        placeholder: "Sin límite"
    });

    rule1LabelColor = new formattingSettings.ColorPicker({
        name: "rule1LabelColor",
        displayName: "Color etiqueta",
        value: { value: "#c00000" }
    });

    rule1ValueColor = new formattingSettings.ColorPicker({
        name: "rule1ValueColor",
        displayName: "Color valor",
        value: { value: "#c00000" }
    });

    rule1BackgroundColor = new formattingSettings.ColorPicker({
        name: "rule1BackgroundColor",
        displayName: "Color fondo",
        value: { value: "#fff0f0" }
    });

    rule2Title = new formattingSettings.ReadOnlyText({
        name: "rule2Title",
        displayName: "Regla 2",
        value: ""
    });

    rule2Min = new formattingSettings.TextInput({
        name: "rule2Min",
        displayName: "Mínimo",
        value: "",
        placeholder: "Sin límite"
    });

    rule2Max = new formattingSettings.TextInput({
        name: "rule2Max",
        displayName: "Máximo",
        value: "",
        placeholder: "Sin límite"
    });

    rule2LabelColor = new formattingSettings.ColorPicker({
        name: "rule2LabelColor",
        displayName: "Color etiqueta",
        value: { value: "#666666" }
    });

    rule2ValueColor = new formattingSettings.ColorPicker({
        name: "rule2ValueColor",
        displayName: "Color valor",
        value: { value: "#666666" }
    });

    rule2BackgroundColor = new formattingSettings.ColorPicker({
        name: "rule2BackgroundColor",
        displayName: "Color fondo",
        value: { value: "#ffffff" }
    });

    rule3Title = new formattingSettings.ReadOnlyText({
        name: "rule3Title",
        displayName: "Regla 3",
        value: ""
    });

    rule3Min = new formattingSettings.TextInput({
        name: "rule3Min",
        displayName: "Mínimo",
        value: "",
        placeholder: "Sin límite"
    });

    rule3Max = new formattingSettings.TextInput({
        name: "rule3Max",
        displayName: "Máximo",
        value: "",
        placeholder: "Sin límite"
    });

    rule3LabelColor = new formattingSettings.ColorPicker({
        name: "rule3LabelColor",
        displayName: "Color etiqueta",
        value: { value: "#00b050" }
    });

    rule3ValueColor = new formattingSettings.ColorPicker({
        name: "rule3ValueColor",
        displayName: "Color valor",
        value: { value: "#00b050" }
    });

    rule3BackgroundColor = new formattingSettings.ColorPicker({
        name: "rule3BackgroundColor",
        displayName: "Color fondo",
        value: { value: "#f0fff4" }
    });

    customLabels = new formattingSettings.TextInput({
        name: "customLabels",
        displayName: "Etiquetas personalizadas",
        value: "",
        placeholder: "Separar con comas"
    });

    childBackgroundEnabled = new formattingSettings.ToggleSwitch({
        name: "childBackgroundEnabled",
        displayName: "Fondo",
        value: false
    });

    childBackgroundColor = new formattingSettings.ColorPicker({
        name: "childBackgroundColor",
        displayName: "Color de fondo",
        value: { value: "#ffffff" }
    });

    childFixedWidthEnabled = new formattingSettings.ToggleSwitch({
        name: "childFixedWidthEnabled",
        displayName: "Ancho fijo",
        value: false
    });

    childFixedWidth = new formattingSettings.NumUpDown({
        name: "childFixedWidth",
        displayName: "Ancho fijo (px)",
        value: 0
    });

    childFixedHeightEnabled = new formattingSettings.ToggleSwitch({
        name: "childFixedHeightEnabled",
        displayName: "Alto fijo",
        value: false
    });

    childFixedHeight = new formattingSettings.NumUpDown({
        name: "childFixedHeight",
        displayName: "Alto fijo (px)",
        value: 0
    });

    contentPaddingTop = new formattingSettings.NumUpDown({
        name: "contentPaddingTop",
        displayName: "Margen contenido arriba",
        value: 10
    });

    contentPaddingRight = new formattingSettings.NumUpDown({
        name: "contentPaddingRight",
        displayName: "Margen contenido derecha",
        value: 10
    });

    contentPaddingBottom = new formattingSettings.NumUpDown({
        name: "contentPaddingBottom",
        displayName: "Margen contenido abajo",
        value: 10
    });

    contentPaddingLeft = new formattingSettings.NumUpDown({
        name: "contentPaddingLeft",
        displayName: "Margen contenido izquierda",
        value: 10
    });

    valuesPaddingTop = new formattingSettings.NumUpDown({
        name: "valuesPaddingTop",
        displayName: "Margen valores arriba",
        value: 5
    });

    valuesPaddingRight = new formattingSettings.NumUpDown({
        name: "valuesPaddingRight",
        displayName: "Margen valores derecha",
        value: 10
    });

    valuesPaddingBottom = new formattingSettings.NumUpDown({
        name: "valuesPaddingBottom",
        displayName: "Margen valores abajo",
        value: 5
    });

    valuesPaddingLeft = new formattingSettings.NumUpDown({
        name: "valuesPaddingLeft",
        displayName: "Margen valores izquierda",
        value: 10
    });

    childCornerRadius = new formattingSettings.NumUpDown({
        name: "childCornerRadius",
        displayName: "Radio de la esquina (px)",
        value: 4
    });

    childCornerIndividual = new formattingSettings.ToggleSwitch({
        name: "childCornerIndividual",
        displayName: "Esquinas individuales",
        value: false
    });

    childCornerTopLeft = new formattingSettings.NumUpDown({
        name: "childCornerTopLeft",
        displayName: "Esquina superior izquierda (px)",
        value: 4
    });

    childCornerTopRight = new formattingSettings.NumUpDown({
        name: "childCornerTopRight",
        displayName: "Esquina superior derecha (px)",
        value: 4
    });

    childCornerBottomLeft = new formattingSettings.NumUpDown({
        name: "childCornerBottomLeft",
        displayName: "Esquina inferior izquierda (px)",
        value: 4
    });

    childCornerBottomRight = new formattingSettings.NumUpDown({
        name: "childCornerBottomRight",
        displayName: "Esquina inferior derecha (px)",
        value: 4
    });

    pendingNote = new formattingSettings.ReadOnlyText({
        name: "pendingNote",
        displayName: "",
        value: "(Configuración pendiente)"
    });

    name: string = "labelCard";
    displayName: string = "Diseño de multiples tarjetas";
    presentationGroup = new formattingSettings.Group({
        name: "presentationGroup",
        displayName: "Presentación",
        collapsible: true,
        slices: [this.valueLayout, this.tableColumns, this.tableRows, this.mosaicColumns, this.mosaicRows]
    });

    applyGroup = new formattingSettings.Group({
        name: "applyGroup",
        displayName: "Aplicar configuración a",
        collapsible: true,
        slices: [this.applyTo, this.saveOverrides, this.valueOverrides]
    });

    shapeGroup = new formattingSettings.Group({
        name: "shapeGroup",
        displayName: "Forma",
        collapsible: true,
        slices: [
            this.childFixedWidthEnabled,
            this.childFixedWidth,
            this.childFixedHeightEnabled,
            this.childFixedHeight,
            this.childCornerRadius,
            this.childCornerIndividual,
            this.childCornerTopLeft,
            this.childCornerTopRight,
            this.childCornerBottomLeft,
            this.childCornerBottomRight
        ]
    });

    spacingGroup = new formattingSettings.Group({
        name: "spacingGroup",
        displayName: "Espaciado",
        collapsible: true,
        slices: [
            this.mosaicGap,
            this.contentPaddingTop,
            this.contentPaddingRight,
            this.contentPaddingBottom,
            this.contentPaddingLeft,
            this.valuesPaddingTop,
            this.valuesPaddingRight,
            this.valuesPaddingBottom,
            this.valuesPaddingLeft
        ]
    });

    valueGroup = new formattingSettings.Group({
        name: "valueGroup",
        displayName: "Valor",
        collapsible: true,
        slices: [
            this.valueFont,
            this.valueAlign,
            this.valueColor,
            this.valueDisplayUnits,
            this.valueFormatCode
        ]
    });

    labelGroup = new formattingSettings.Group({
        name: "labelGroup",
        displayName: "Formato etiqueta",
        collapsible: true,
        slices: [this.labelFont, this.labelAlign, this.labelColor]
    });

    colorRulesGroup = new formattingSettings.Group({
        name: "colorRulesGroup",
        displayName: "Reglas de color",
        collapsible: true,
        slices: [
            this.enableColorRules,
            this.rule1Title,
            this.rule1Min,
            this.rule1Max,
            this.rule1LabelColor,
            this.rule1ValueColor,
            this.rule1BackgroundColor,
            this.rule2Title,
            this.rule2Min,
            this.rule2Max,
            this.rule2LabelColor,
            this.rule2ValueColor,
            this.rule2BackgroundColor,
            this.rule3Title,
            this.rule3Min,
            this.rule3Max,
            this.rule3LabelColor,
            this.rule3ValueColor,
            this.rule3BackgroundColor
        ]
    });

    imageGroup = new formattingSettings.Group({
        name: "imageGroup",
        displayName: "Imagen",
        collapsible: true,
        slices: [this.pendingNote]
    });

    backgroundGroup = new formattingSettings.Group({
        name: "backgroundGroup",
        displayName: "Fondo",
        collapsible: true,
        slices: [this.childBackgroundEnabled, this.childBackgroundColor]
    });

    groups: Array<FormattingSettingsGroup> = [
        this.applyGroup,
        this.presentationGroup,
        this.shapeGroup,
        this.spacingGroup,
        this.labelGroup,
        this.valueGroup,
        this.colorRulesGroup,
        this.imageGroup,
        this.backgroundGroup
    ];

    onPreProcess(): void {
        const layout = String(this.valueLayout.value.value || "table");
        const isTable = layout === "table";
        this.tableColumns.visible = isTable;
        this.tableRows.visible = isTable;
        this.mosaicColumns.visible = !isTable;
        this.mosaicRows.visible = !isTable;
        this.mosaicGap.visible = !isTable;

        const showNative = !isTable;
        this.applyGroup.visible = showNative;
        this.shapeGroup.visible = showNative;
        this.spacingGroup.visible = showNative;
        this.valueGroup.visible = showNative;
        this.labelGroup.visible = showNative;
        this.colorRulesGroup.visible = showNative;
        this.imageGroup.visible = showNative;
        this.backgroundGroup.visible = showNative;
        this.valueOverrides.visible = false;

        this.childBackgroundColor.visible = this.childBackgroundEnabled.value;

        this.childFixedWidth.visible = this.childFixedWidthEnabled.value;
        this.childFixedHeight.visible = this.childFixedHeightEnabled.value;

        const showIndividual = this.childCornerIndividual.value;
        this.childCornerRadius.visible = !showIndividual;
        this.childCornerTopLeft.visible = showIndividual;
        this.childCornerTopRight.visible = showIndividual;
        this.childCornerBottomLeft.visible = showIndividual;
        this.childCornerBottomRight.visible = showIndividual;

        const showRules = showNative && this.enableColorRules.value;
        this.rule1Title.visible = showRules;
        this.rule1Min.visible = showRules;
        this.rule1Max.visible = showRules;
        this.rule1LabelColor.visible = showRules;
        this.rule1ValueColor.visible = showRules;
        this.rule1BackgroundColor.visible = showRules;
        this.rule2Title.visible = showRules;
        this.rule2Min.visible = showRules;
        this.rule2Max.visible = showRules;
        this.rule2LabelColor.visible = showRules;
        this.rule2ValueColor.visible = showRules;
        this.rule2BackgroundColor.visible = showRules;
        this.rule3Title.visible = showRules;
        this.rule3Min.visible = showRules;
        this.rule3Max.visible = showRules;
        this.rule3LabelColor.visible = showRules;
        this.rule3ValueColor.visible = showRules;
        this.rule3BackgroundColor.visible = showRules;

        // Mostrar formato solo si es personalizado
        this.valueFormatCode.visible = this.valueDisplayUnits.value.value === "custom";
    }
}

/**
 * Tooltip Card Settings
 */
class TooltipCardSettings extends FormattingSettingsCard {
    showCategory = new formattingSettings.ToggleSwitch({
        name: "showCategory",
        displayName: "Mostrar categoría",
        value: true
    });

    showValues = new formattingSettings.ToggleSwitch({
        name: "showValues",
        displayName: "Mostrar valores",
        value: false
    });

    showExtra = new formattingSettings.ToggleSwitch({
        name: "showExtra",
        displayName: "Mostrar campos extra",
        value: true
    });

    name: string = "tooltipCard";
    displayName: string = "Tooltip";
    slices: Array<FormattingSettingsSlice> = [this.showCategory, this.showValues, this.showExtra];
}

/**
 * Comportamiento Card Settings
 */
class BehaviorCardSettings extends FormattingSettingsCard {
    enableSelection = new formattingSettings.ToggleSwitch({
        name: "enableSelection",
        displayName: "Habilitar selección",
        value: true
    });

    enableTooltip = new formattingSettings.ToggleSwitch({
        name: "enableTooltip",
        displayName: "Habilitar tooltip",
        value: true
    });


    sortByValueIndex = new formattingSettings.NumUpDown({
        name: "sortByValueIndex",
        displayName: "Ordenar tarjetas por valor # (1..n)",
        value: 0
    });

    sortDescending = new formattingSettings.ToggleSwitch({
        name: "sortDescending",
        displayName: "Orden descendente",
        value: false
    });

    name: string = "behaviorCard";
    displayName: string = "Comportamiento";
    slices: Array<FormattingSettingsSlice> = [this.enableSelection, this.enableTooltip, this.sortByValueIndex, this.sortDescending];
}

/**
 * Configuración de gráfico
 */
class ChartConfigSettings extends FormattingSettingsCard {
    showChart = new formattingSettings.ToggleSwitch({
        name: "showChart",
        displayName: "Mostrar gráfico",
        value: true,
        description: "Activa o desactiva el gráfico dentro de la tarjeta."
    });

    chartType = new formattingSettings.ItemDropdown({
        name: "chartType",
        displayName: "Tipo de gráfico",
        items: [
            { value: "band", displayName: "Banda" },
            { value: "bar", displayName: "Barra horizontal" }
        ],
        value: { value: "band", displayName: "Banda" },
        description: "Define el estilo del gráfico cuando 'Mostrar gráfico' está activado."
    });

    useValueIndex = new formattingSettings.NumUpDown({
        name: "useValueIndex",
        displayName: "Usar valor # (1..n)",
        value: 0,
        description: "Se usa solo si no cargas 'Valor actual (Grafico)'. Si ya lo cargaste, esta opción no cambia el resultado."
    });

    chartHeight = new formattingSettings.NumUpDown({
        name: "chartHeight",
        displayName: "Altura del gráfico",
        value: 15,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: 15
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: 100
            }
        },
        description: "Altura del gráfico (en px)."
    });

    chartWidth = new formattingSettings.NumUpDown({
        name: "chartWidth",
        displayName: "Ancho del gráfico",
        value: 90,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: 50
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: 100
            }
        },
        description: "Ancho del gráfico en % dentro de la tarjeta."
    });

    chartDividerSpacingTop = new formattingSettings.NumUpDown({
        name: "chartDividerSpacingTop",
        displayName: "Espacio entre gráfico y linea",
        value: 10,
        description: "Separación vertical (px) entre el gráfico y la linea divisoria."
    });

    chartDividerSpacingBottom = new formattingSettings.NumUpDown({
        name: "chartDividerSpacingBottom",
        displayName: "Espacio entre linea y valores",
        value: 10,
        description: "Separación vertical (px) entre la linea divisoria y los valores."
    });

    showDivider = new formattingSettings.ToggleSwitch({
        name: "showDivider",
        displayName: "Linea divisoria",
        value: false
    });

    dividerColor = new formattingSettings.ColorPicker({
        name: "dividerColor",
        displayName: "Color de linea",
        value: { value: "#d0d0d0" }
    });

    dividerWidth = new formattingSettings.NumUpDown({
        name: "dividerWidth",
        displayName: "Grosor de linea",
        value: 1
    });

    chartColor = new formattingSettings.ColorPicker({
        name: "chartColor",
        displayName: "Color del gráfico",
        value: { value: "#CDC4BE" }
    });

    chartBackColor = new formattingSettings.ColorPicker({
        name: "chartBackColor",
        displayName: "Color de fondo",
        value: { value: "#E0E0E0" }
    });

    markerColor = new formattingSettings.ColorPicker({
        name: "markerColor",
        displayName: "Color del marcador",
        value: { value: "#9B9B9B" }
    });

    markerWidth = new formattingSettings.NumUpDown({
        name: "markerWidth",
        displayName: "Ancho del marcador",
        value: 2,
        description: "Grosor de la línea del marcador de objetivo."
    });

    maxValue = new formattingSettings.NumUpDown({
        name: "maxValue",
        displayName: "Valor máximo (0=auto)",
        value: 0
    });

    name: string = "chartConfig";
    displayName: string = "Configuracion grafico";
    slices: Array<FormattingSettingsSlice> = [this.showChart, this.chartType, this.useValueIndex, this.chartHeight, this.chartWidth, this.chartDividerSpacingTop, this.chartDividerSpacingBottom, this.showDivider, this.dividerColor, this.dividerWidth, this.chartColor, this.chartBackColor, this.markerColor, this.markerWidth, this.maxValue];
}

/**
 * Valores de gráfico
 */
class ChartValuesSettings extends FormattingSettingsCard {
        // Etiqueta Actual
        actualLabelFontSize = new formattingSettings.NumUpDown({
            name: "actualLabelFontSize",
            displayName: "Tamaño etiqueta Actual",
            value: 10,
            description: "Tamaño de fuente para la etiqueta Actual."
        });
        actualLabelColor = new formattingSettings.ColorPicker({
            name: "actualLabelColor",
            displayName: "Color etiqueta Actual",
            value: { value: "#111111" },
            description: "Color de la etiqueta Actual."
        });
        actualLabelUnits = new formattingSettings.ItemDropdown({
            name: "actualLabelUnits",
            displayName: "Unidades etiqueta Actual",
            items: [
                { value: "auto", displayName: "Automático" },
                { value: "none", displayName: "Ninguno" },
                { value: "thousands", displayName: "Miles" },
                { value: "millions", displayName: "Millones" },
                { value: "percent", displayName: "Porcentaje (%)" },
                { value: "custom", displayName: "Personalizado" } // ✅ AGREGADO
            ],
            value: { value: "auto", displayName: "Automático" },
            description: "Unidades para la etiqueta Actual."
        });

        actualLabelCustomFormat = new formattingSettings.TextInput({
            name: "actualLabelCustomFormat",
            displayName: "Formato personalizado Actual",
            value: "",
            placeholder: "Ej: #,0.00"
        });
        actualLabelPosition = new formattingSettings.ItemDropdown({
            name: "actualLabelPosition",
            displayName: "Posición etiqueta Actual",
            items: [
                { value: "top", displayName: "Arriba" },
                { value: "bottom", displayName: "Abajo" },
                { value: "left", displayName: "Izquierda" },
                { value: "right", displayName: "Derecha" },
                { value: "top-left", displayName: "Arriba-Izquierda" },
                { value: "top-right", displayName: "Arriba-Derecha" },
                { value: "bottom-left", displayName: "Abajo-Izquierda" },
                { value: "bottom-right", displayName: "Abajo-Derecha" },
                { value: "side", displayName: "Al lado del marcador" }
            ],
            value: { value: "top", displayName: "Arriba" },
            description: "Posición de la etiqueta Actual respecto al marcador o al lado del marcador."
        });

        // Etiqueta Objetivo
        targetLabelFontSize = new formattingSettings.NumUpDown({
            name: "targetLabelFontSize",
            displayName: "Tamaño etiqueta Objetivo",
            value: 10,
            description: "Tamaño de fuente para la etiqueta Objetivo."
        });
        targetLabelColor = new formattingSettings.ColorPicker({
            name: "targetLabelColor",
            displayName: "Color etiqueta Objetivo",
            value: { value: "#111111" },
            description: "Color de la etiqueta Objetivo."
        });
        targetLabelUnits = new formattingSettings.ItemDropdown({
            name: "targetLabelUnits",
            displayName: "Unidades etiqueta Objetivo",
            items: [
                { value: "auto", displayName: "Automático" },
                { value: "none", displayName: "Ninguno" },
                { value: "thousands", displayName: "Miles" },
                { value: "millions", displayName: "Millones" },
                { value: "percent", displayName: "Porcentaje (%)" },
                { value: "custom", displayName: "Personalizado" } // ✅ AGREGADO
            ],
            value: { value: "auto", displayName: "Automático" },
            description: "Unidades para la etiqueta Objetivo."
        });

        targetLabelCustomFormat = new formattingSettings.TextInput({
            name: "targetLabelCustomFormat",
            displayName: "Formato personalizado Objetivo",
            value: "",
            placeholder: "Ej: #,0.00"
        });
        targetLabelPosition = new formattingSettings.ItemDropdown({
            name: "targetLabelPosition",
            displayName: "Posición etiqueta Objetivo",
            items: [
                { value: "top", displayName: "Arriba" },
                { value: "bottom", displayName: "Abajo" },
                { value: "left", displayName: "Izquierda" },
                { value: "right", displayName: "Derecha" },
                { value: "top-left", displayName: "Arriba-Izquierda" },
                { value: "top-right", displayName: "Arriba-Derecha" },
                { value: "bottom-left", displayName: "Abajo-Izquierda" },
                { value: "bottom-right", displayName: "Abajo-Derecha" },
                { value: "side", displayName: "Al lado del marcador" }
            ],
            value: { value: "bottom", displayName: "Abajo" },
            description: "Posición de la etiqueta Objetivo respecto al marcador o al lado del marcador."
        });
    chartValueFormatCode = new formattingSettings.TextInput({
        name: "chartValueFormatCode",
        displayName: "Formato de número",
        value: "",
        placeholder: "Ej: #,0.00"
    });

    chartValueUnits = new formattingSettings.ItemDropdown({
        name: "chartValueUnits",
        displayName: "Mostrar unidades",
        items: [
            { value: "auto", displayName: "Automático" },
            { value: "none", displayName: "Ninguno" },
            { value: "thousands", displayName: "Miles" },
            { value: "millions", displayName: "Millones" },
            { value: "billions", displayName: "Mil millones" },
            { value: "trillions", displayName: "Billones" },
            { value: "percent", displayName: "Porcentaje (%)" },
            { value: "custom", displayName: "Personalizado" }
        ],
        value: { value: "auto", displayName: "Automático" },
        description: "Elige el tipo de unidades o formato para los valores del gráfico."
    });
    showPercentage = new formattingSettings.ToggleSwitch({
        name: "showPercentage",
        displayName: "Valor en barra",
        value: true,
        description: "Activa o desactiva la etiqueta de valor/porcentaje del gráfico."
    });

    percentSource = new formattingSettings.ItemDropdown({
        name: "percentSource",
        displayName: "Tipo de calculo",
        items: [
            { value: "auto", displayName: "Cálculo automático" },
            { value: "measure", displayName: "Personalizado" }
        ],
        value: { value: "auto", displayName: "Cálculo automático" },
        description: "Auto usa el cálculo interno. Personalizado usa la medida en 'Valor calculo'."
    });

    percentageMode = new formattingSettings.ItemDropdown({
        name: "percentageMode",
        displayName: "Calculo basado en",
        items: [
            { value: "actualTarget", displayName: "Actual / Objetivo" },
            { value: "actualMax", displayName: "Actual / Máximo" }
        ],
        value: { value: "actualTarget", displayName: "Actual / Objetivo" },
        description: "Aplica solo si 'Tipo de calculo' está en Cálculo automático."
    });

    percentageDecimals = new formattingSettings.NumUpDown({
        name: "percentageDecimals",
        displayName: "Decimales",
        value: 0,
        description: "Cantidad de decimales en el valor mostrado."
    });

    percentLabelColor = new formattingSettings.ColorPicker({
        name: "percentLabelColor",
        displayName: "Color",
        value: { value: "#111111" },
        description: "Color del texto del valor/porcentaje."
    });

    percentLabelSize = new formattingSettings.NumUpDown({
        name: "percentLabelSize",
        displayName: "Tamaño",
        value: 11,
        description: "Tamaño del texto del valor/porcentaje."
    });

    percentLabelPosition = new formattingSettings.ItemDropdown({
        name: "percentLabelPosition",
        displayName: "Posición",
        items: [
            { value: "left", displayName: "Izquierda" },
            { value: "center", displayName: "Centro" },
            { value: "right", displayName: "Derecha" },
            { value: "top", displayName: "Arriba" },
            { value: "bottom", displayName: "Abajo" }
        ],
        value: { value: "center", displayName: "Centro" },
        description: "Posición del texto dentro o fuera del gráfico."
    });

    showActualLabel = new formattingSettings.ToggleSwitch({
        name: "showActualLabel",
        displayName: "Mostrar etiqueta Actual",
        value: true,
        description: "Muestra el valor actual junto al marcador."
    });

    showTargetLabel = new formattingSettings.ToggleSwitch({
        name: "showTargetLabel",
        displayName: "Mostrar etiqueta Objetivo",
        value: true,
        description: "Muestra el valor objetivo junto al marcador."
    });

    name: string = "chartValues";
    displayName: string = "Valores graficos";
    slices: Array<FormattingSettingsSlice> = [
        this.showPercentage,
        this.chartValueUnits,
        this.percentSource,
        this.percentageMode,
        this.percentageDecimals,
        this.percentLabelColor,
        this.percentLabelSize,
        this.percentLabelPosition,
        this.chartValueFormatCode,
        this.showActualLabel,
        this.actualLabelFontSize,
        this.actualLabelColor,
        this.actualLabelUnits,
        this.actualLabelCustomFormat,
        this.actualLabelPosition,
        this.showTargetLabel,
        this.targetLabelFontSize,
        this.targetLabelColor,
        this.targetLabelUnits,
        this.targetLabelCustomFormat,
        this.targetLabelPosition
    ];

    onPreProcess() {
        // Mostrar formato personalizado solo cuando se selecciona "custom"
        this.actualLabelCustomFormat.visible = this.actualLabelUnits.value.value === "custom";
        this.targetLabelCustomFormat.visible = this.targetLabelUnits.value.value === "custom";
    }
}

/**
 * visual settings model class
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    gridCard = new GridCardSettings();
    cardStyle = new CardStyleSettings();
    labelCard = new LabelCardSettings();
    tooltipCard = new TooltipCardSettings();
    behaviorCard = new BehaviorCardSettings();
    chartConfig = new ChartConfigSettings();
    chartValues = new ChartValuesSettings();

    cards = [this.gridCard, this.cardStyle, this.labelCard, this.tooltipCard, this.behaviorCard, this.chartConfig, this.chartValues];
}
