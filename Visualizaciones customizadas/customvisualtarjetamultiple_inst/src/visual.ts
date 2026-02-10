/*
*  Power BI Visual CLI
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

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { dataViewObjects } from "powerbi-visuals-utils-dataviewutils";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import { VisualFormattingSettingsModel } from "./settings";

interface CardData {
    category: string;
    values: ValueData[];
    index?: number;
    chartActual?: number;
    chartTarget?: number;
    chartActualFormatted?: string;
    chartTargetFormatted?: string;
    percentValue?: number;
    percentFormatted?: string;
    selectionId?: powerbi.visuals.ISelectionId;
    isHighlighted?: boolean;
    isRest?: boolean;
    restDetails?: CardData[];
}

interface ValueData {
    label: string;
    value: string;
    rawValue: number;
    index: number;
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private container: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private host: IVisualHost;
    private selectionManager: powerbi.extensibility.ISelectionManager;
    private selectedIds: powerbi.visuals.ISelectionId[] = [];
    private lastApplyItems: Array<powerbi.IEnumMember> = [];
    private lastApplyValue: powerbi.IEnumMember | null = null;
    private lastApplyKey: string = "all";
    private lastOverridesJson: string = "";
    private valueKeyByLabel: Record<string, string> = {};
    private valueOverrides: Record<string, any> = {};
    private baseConfig: Record<string, any> | null = null;
    private valueColumns: powerbi.DataViewValueColumn[] = [];
    private metadataObjects: powerbi.DataViewObjects | null = null;
    private categoryObjects: powerbi.DataViewObjects[] | null = null;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.host = options.host;
        this.selectionManager = options.host.createSelectionManager();
        this.target = options.element;
        
        // Create container
        this.container = document.createElement("div");
        this.container.className = "cardGrid";
        this.target.appendChild(this.container);
    }

    public update(options: VisualUpdateOptions) {
        try {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel,
                options.dataViews[0]
            );

            const dataView: DataView = options.dataViews[0];
            this.metadataObjects = dataView?.metadata?.objects || null;
            // --- Sincronizar settings de etiquetas con metadataObjects si existen ---
            const formatObjects = dataView?.metadata?.objects;
            if (formatObjects && formatObjects.chartValues) {
                // ActualLabelUnits
                if (formatObjects.chartValues.actualLabelUnits !== undefined) {
                    const v = formatObjects.chartValues.actualLabelUnits;
                    const val = typeof v === 'object' && v !== null && 'value' in v ? v.value : v;
                    const found = this.formattingSettings.chartValues.actualLabelUnits.items.find(i => i.value === val);
                    if (found) this.formattingSettings.chartValues.actualLabelUnits.value = found;
                }
                // TargetLabelUnits
                if (formatObjects.chartValues.targetLabelUnits !== undefined) {
                    const v = formatObjects.chartValues.targetLabelUnits;
                    const val = typeof v === 'object' && v !== null && 'value' in v ? v.value : v;
                    const found = this.formattingSettings.chartValues.targetLabelUnits.items.find(i => i.value === val);
                    if (found) this.formattingSettings.chartValues.targetLabelUnits.value = found;
                }
                // ActualLabelFontSize
                if (formatObjects.chartValues.actualLabelFontSize !== undefined) {
                    this.formattingSettings.chartValues.actualLabelFontSize.value = Number(formatObjects.chartValues.actualLabelFontSize);
                }
                // TargetLabelFontSize
                if (formatObjects.chartValues.targetLabelFontSize !== undefined) {
                    this.formattingSettings.chartValues.targetLabelFontSize.value = Number(formatObjects.chartValues.targetLabelFontSize);
                }
                // ActualLabelColor
                if (formatObjects.chartValues.actualLabelColor !== undefined) {
                    const v = formatObjects.chartValues.actualLabelColor;
                    if (typeof v === 'string') {
                        this.formattingSettings.chartValues.actualLabelColor.value = { value: v };
                    }
                    // Si no es string, ignorar (evita error de tipo)
                }
                // TargetLabelColor
                if (formatObjects.chartValues.targetLabelColor !== undefined) {
                    const v = formatObjects.chartValues.targetLabelColor;
                    if (typeof v === 'string') {
                        this.formattingSettings.chartValues.targetLabelColor.value = { value: v };
                    }
                    // Si no es string, ignorar (evita error de tipo)
                }
                // ActualLabelPosition
                if (formatObjects.chartValues.actualLabelPosition !== undefined) {
                    const v = formatObjects.chartValues.actualLabelPosition;
                    const val = typeof v === 'object' && v !== null && 'value' in v ? v.value : v;
                    const found = this.formattingSettings.chartValues.actualLabelPosition.items.find(i => i.value === val);
                    if (found) this.formattingSettings.chartValues.actualLabelPosition.value = found;
                }
                // TargetLabelPosition
                if (formatObjects.chartValues.targetLabelPosition !== undefined) {
                    const v = formatObjects.chartValues.targetLabelPosition;
                    const val = typeof v === 'object' && v !== null && 'value' in v ? v.value : v;
                    const found = this.formattingSettings.chartValues.targetLabelPosition.items.find(i => i.value === val);
                    if (found) this.formattingSettings.chartValues.targetLabelPosition.value = found;
                }
            }
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }

            if (!dataView || !dataView.categorical) {
                return;
            }

            const categorical = dataView.categorical;
            const categories = categorical.categories;
            const allValues = categorical.values || [];
            const rawDisplayValues = allValues.filter(v => v.source.roles && v.source.roles["values"]);
            const percentValues = allValues.filter(v => v.source.roles && v.source.roles["percent"]);
            const actualValues = allValues.filter(v => v.source.roles && v.source.roles["actual"]);
            const targetValues = allValues.filter(v => v.source.roles && v.source.roles["target"]);

            if (rawDisplayValues.length === 0) {
                return;
            }

            const displayValues: powerbi.DataViewValueColumn[] = rawDisplayValues;

            this.valueColumns = displayValues;
            this.categoryObjects = categories && categories.length > 0 ? (categories[0].objects as powerbi.DataViewObjects[] | undefined) || null : null;

            // Extract data
            let cardsData: CardData[] = [];

            if (categories && categories.length > 0) {
                // Multi-card mode
                const categoryValues = categories[0].values;
                
                for (let i = 0; i < categoryValues.length; i++) {
                    const actualRaw = (actualValues[0]?.values[i] as number) ?? undefined;
                    const targetRaw = (targetValues[0]?.values[i] as number) ?? undefined;
                    const percentRaw = (percentValues[0]?.values[i] as number) ?? undefined;
                    const actualFormat = actualValues[0]?.source?.format;
                    const targetFormat = targetValues[0]?.source?.format;
                    const percentFormat = percentValues[0]?.source?.format;
                    const selectionId = categories[0]?.identity && categories[0].identity[i]
                        ? this.host.createSelectionIdBuilder().withCategory(categories[0], i).createSelectionId()
                        : undefined;

                    const cardData: CardData = {
                        category: categoryValues[i] as string,
                        index: i,
                        values: [],
                        chartActual: actualRaw,
                        chartTarget: targetRaw,
                        chartActualFormatted: actualRaw !== undefined ? this.formatValue(actualRaw, actualFormat) : undefined,
                        chartTargetFormatted: targetRaw !== undefined ? this.formatValue(targetRaw, targetFormat) : undefined,
                        percentValue: percentRaw,
                        percentFormatted: percentRaw !== undefined ? this.formatValue(percentRaw, percentFormat) : undefined,
                        selectionId: selectionId,
                        isHighlighted: false
                    };

                    for (let j = 0; j < displayValues.length; j++) {
                        const valueMeta = displayValues[j].source;
                        const label = valueMeta.displayName || `Value ${j + 1}`;
                        const queryName = valueMeta.queryName || label;
                        const rawValue = displayValues[j].values[i] as number;
                        let formattedValue = "--";

                        // Soporte para overrides por-métrica
                        let units = this.formattingSettings.labelCard.valueDisplayUnits.value.value;
                        let customFormat = this.formattingSettings.labelCard.valueFormatCode.value;
                        // Overrides por-métrica
                        let valueOverrides = {};
                        try {
                            valueOverrides = JSON.parse(this.formattingSettings.labelCard.valueOverrides.value || "{}") || {};
                        } catch {}
                        // Usar queryName como clave principal para overrides
                        const overrideKey = queryName;
                        if (valueOverrides[overrideKey]) {
                            if (valueOverrides[overrideKey].units) units = valueOverrides[overrideKey].units;
                            if (valueOverrides[overrideKey].customFormat) customFormat = valueOverrides[overrideKey].customFormat;
                        } else if (valueOverrides[label]) {
                            // Fallback solo si no hay queryName
                            if (valueOverrides[label].units) units = valueOverrides[label].units;
                            if (valueOverrides[label].customFormat) customFormat = valueOverrides[label].customFormat;
                        }

                        if (rawValue !== null && rawValue !== undefined) {
                            if (units === "custom" && customFormat) {
                                // Soporte para formato personalizado con %
                                if (customFormat.includes("%")) {
                                    const decimals = (customFormat.split(".")[1] || "").replace(/[^0-9]/g, "").length;
                                    formattedValue = (rawValue * 100).toFixed(decimals) + " %";
                                } else {
                                    try {
                                        formattedValue = rawValue.toLocaleString(undefined, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 20 });
                                    } catch {
                                        formattedValue = rawValue.toString();
                                    }
                                }
                            } else if (units === "percent") {
                                // Mostrar como porcentaje
                                formattedValue = (rawValue * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " %";
                            } else if (units === "millions") {
                                formattedValue = (rawValue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
                            } else if (units === "billions") {
                                formattedValue = (rawValue / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " MM";
                            } else if (units === "thousands") {
                                formattedValue = (rawValue / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
                            } else if (units === "none") {
                                formattedValue = rawValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                            } else {
                                // Auto/fallback: usar sufijos en español
                                if (Math.abs(rawValue) >= 1e9) {
                                    formattedValue = (rawValue / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " MM";
                                } else if (Math.abs(rawValue) >= 1e6) {
                                    formattedValue = (rawValue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
                                } else if (Math.abs(rawValue) >= 1e3) {
                                    formattedValue = (rawValue / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
                                } else {
                                    formattedValue = rawValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                                }
                            }
                        }

                        const highlightValue = displayValues[j].highlights ? displayValues[j].highlights[i] : null;
                        if (highlightValue !== null && highlightValue !== undefined) {
                            cardData.isHighlighted = true;
                        }

                        cardData.values.push({
                            label: label,
                            value: formattedValue,
                            rawValue: rawValue || 0,
                            index: j
                        });
                    }

                    cardsData.push(cardData);
                }

                // Apply sorting
                if (this.formattingSettings.behaviorCard.sortByValueIndex.value > 0) {
                    const sortIndex = this.formattingSettings.behaviorCard.sortByValueIndex.value - 1;
                    const descending = this.formattingSettings.behaviorCard.sortDescending.value;

                    if (sortIndex < displayValues.length) {
                        cardsData.sort((a, b) => {
                            const aVal = a.values[sortIndex]?.rawValue || 0;
                            const bVal = b.values[sortIndex]?.rawValue || 0;
                            return descending ? bVal - aVal : aVal - bVal;
                        });
                    }
                }

                // Apply card limit and create "Resto" (INCLUSIVE)
                if (this.formattingSettings.gridCard.limitCards.value && 
                    this.formattingSettings.gridCard.maxCards.value > 0) {
                    const maxCards = this.formattingSettings.gridCard.maxCards.value;
                    
                    // If we have more cards than limit, show (maxCards - 1) + 1 Resto = maxCards total
                    if (cardsData.length > maxCards) {
                        const mainCards = cardsData.slice(0, maxCards - 1); // Take one less to make room for Resto
                        const restCards = cardsData.slice(maxCards - 1); // Everything else goes to Resto

                        // Aggregate rest cards
                        const restCard: CardData = {
                            category: this.formattingSettings.gridCard.restTitle.value || "Resto",
                            values: [],
                            isRest: true,
                            restDetails: restCards
                        };

                        // Sum values for resto
                        for (let j = 0; j < displayValues.length; j++) {
                            const valueMeta = displayValues[j].source;
                            const label = valueMeta.displayName || `Value ${j + 1}`;
                            let sum = 0;

                            restCards.forEach(card => {
                                sum += card.values[j]?.rawValue || 0;
                            });

                            const formattedValue = this.formatValue(sum, valueMeta.format);
                            restCard.values.push({
                                label: label,
                                value: formattedValue,
                                rawValue: sum,
                                index: j
                            });
                        }

                        if (actualValues.length > 0) {
                            const sumActual = restCards.reduce((acc, card) => acc + (card.chartActual || 0), 0);
                            restCard.chartActual = sumActual;
                            restCard.chartActualFormatted = this.formatValue(sumActual, actualValues[0]?.source?.format);
                        }
                        if (targetValues.length > 0) {
                            const sumTarget = restCards.reduce((acc, card) => acc + (card.chartTarget || 0), 0);
                            restCard.chartTarget = sumTarget;
                            restCard.chartTargetFormatted = this.formatValue(sumTarget, targetValues[0]?.source?.format);
                        }
                        if (percentValues.length > 0) {
                            const sumPercent = restCards.reduce((acc, card) => acc + (card.percentValue || 0), 0);
                            restCard.percentValue = sumPercent;
                            restCard.percentFormatted = this.formatValue(sumPercent, percentValues[0]?.source?.format);
                        }

                        restCard.isHighlighted = restCards.some(card => card.isHighlighted);

                        mainCards.push(restCard);
                        cardsData = mainCards;
                    }
                }

            } else {
                // Single card mode (no category)
                const cardData: CardData = {
                    category: "Total",
                    index: 0,
                    values: []
                };

                for (let j = 0; j < displayValues.length; j++) {
                    const valueMeta = displayValues[j].source;
                    const label = valueMeta.displayName || `Value ${j + 1}`;
                    const rawValue = displayValues[j].values[0] as number;
                    const formattedValue = this.formatValue(rawValue, valueMeta.format);

                    cardData.values.push({
                        label: label,
                        value: formattedValue,
                        rawValue: rawValue || 0,
                        index: j
                    });
                }

                if (actualValues.length > 0) {
                    const actualRaw = actualValues[0].values[0] as number;
                    cardData.chartActual = actualRaw;
                    cardData.chartActualFormatted = this.formatValue(actualRaw, actualValues[0]?.source?.format);
                }
                if (targetValues.length > 0) {
                    const targetRaw = targetValues[0].values[0] as number;
                    cardData.chartTarget = targetRaw;
                    cardData.chartTargetFormatted = this.formatValue(targetRaw, targetValues[0]?.source?.format);
                }
                if (percentValues.length > 0) {
                    const percentRaw = percentValues[0].values[0] as number;
                    cardData.percentValue = percentRaw;
                    cardData.percentFormatted = this.formatValue(percentRaw, percentValues[0]?.source?.format);
                }

                cardsData.push(cardData);
            }

            // Populate "Aplicar configuración a" items based on values (use stable keys)
            const applyItems: Array<powerbi.IEnumMember> = [{ value: "all", displayName: "Todas" }];
            const labelItems: Array<{ key: string; label: string }> = [];
            this.valueKeyByLabel = {};
            displayValues.forEach((v, index) => {
                const label = v.source.displayName || `Value ${index + 1}`;
                const key = v.source.queryName || label;
                labelItems.push({ key, label });
                applyItems.push({ value: key, displayName: label });
                this.valueKeyByLabel[label] = key;
            });

            this.formattingSettings.labelCard.applyTo.items = applyItems;

            const objects = dataView.metadata?.objects as powerbi.DataViewObjects | undefined;
            const storedApply = (objects?.labelCard as any)?.applyToKey as string | undefined;
            const rawApply = storedApply ?? String(this.formattingSettings.labelCard.applyTo.value.value || "all");
            const currentApply = rawApply.replace(/^['"]|['"]$/g, "");
            const matchedItem = applyItems.find(item =>
                String(item.value) === currentApply || String(item.displayName) === currentApply
            );
            if (matchedItem) {
                this.formattingSettings.labelCard.applyTo.value = matchedItem;
            }

            let overrides: Record<string, any> = this.valueOverrides || {};
            const storedOverridesJson = (objects?.labelCard as any)?.valueOverrides as string | undefined;
            if (storedOverridesJson !== undefined && storedOverridesJson !== this.lastOverridesJson) {
                try {
                    const parsed = storedOverridesJson ? JSON.parse(storedOverridesJson) : {};
                    overrides = (parsed && typeof parsed === "object") ? parsed : {};
                } catch {
                    overrides = {};
                }
                this.valueOverrides = overrides;
                this.lastOverridesJson = storedOverridesJson || "";
            }

            displayValues.forEach((v, index) => {
                const label = v.source.displayName || `Value ${index + 1}`;
                const key = v.source.queryName || label;
                if (!overrides[key] && overrides[label]) {
                    overrides[key] = overrides[label];
                }
            });

            const applyKey = String(this.formattingSettings.labelCard.applyTo.value.value || "all");
            const applyChanged = this.lastApplyKey !== applyKey;
            const currentConfig = {
                labelFontFamily: this.formattingSettings.labelCard.labelFont.fontFamily.value,
                labelFontSize: this.formattingSettings.labelCard.labelFont.fontSize.value,
                labelBold: this.formattingSettings.labelCard.labelFont.bold?.value,
                labelItalic: this.formattingSettings.labelCard.labelFont.italic?.value,
                labelUnderline: this.formattingSettings.labelCard.labelFont.underline?.value,
                labelAlign: this.formattingSettings.labelCard.labelAlign.value,
                labelColor: this.formattingSettings.labelCard.labelColor.value.value,
                valueFontFamily: this.formattingSettings.labelCard.valueFont.fontFamily.value,
                valueFontSize: this.formattingSettings.labelCard.valueFont.fontSize.value,
                valueBold: this.formattingSettings.labelCard.valueFont.bold?.value,
                valueItalic: this.formattingSettings.labelCard.valueFont.italic?.value,
                valueUnderline: this.formattingSettings.labelCard.valueFont.underline?.value,
                valueAlign: this.formattingSettings.labelCard.valueAlign.value,
                valueColor: this.formattingSettings.labelCard.valueColor.value.value,
                enableColorRules: this.formattingSettings.labelCard.enableColorRules.value,
                rule1Min: this.formattingSettings.labelCard.rule1Min.value,
                rule1Max: this.formattingSettings.labelCard.rule1Max.value,
                rule1LabelColor: this.formattingSettings.labelCard.rule1LabelColor.value.value,
                rule1ValueColor: this.formattingSettings.labelCard.rule1ValueColor.value.value,
                rule1BackgroundColor: this.formattingSettings.labelCard.rule1BackgroundColor.value.value,
                rule2Min: this.formattingSettings.labelCard.rule2Min.value,
                rule2Max: this.formattingSettings.labelCard.rule2Max.value,
                rule2LabelColor: this.formattingSettings.labelCard.rule2LabelColor.value.value,
                rule2ValueColor: this.formattingSettings.labelCard.rule2ValueColor.value.value,
                rule2BackgroundColor: this.formattingSettings.labelCard.rule2BackgroundColor.value.value,
                rule3Min: this.formattingSettings.labelCard.rule3Min.value,
                rule3Max: this.formattingSettings.labelCard.rule3Max.value,
                rule3LabelColor: this.formattingSettings.labelCard.rule3LabelColor.value.value,
                rule3ValueColor: this.formattingSettings.labelCard.rule3ValueColor.value.value,
                rule3BackgroundColor: this.formattingSettings.labelCard.rule3BackgroundColor.value.value,
                childBackgroundEnabled: this.formattingSettings.labelCard.childBackgroundEnabled.value,
                childBackgroundColor: this.formattingSettings.labelCard.childBackgroundColor.value.value,
                childCornerRadius: this.formattingSettings.labelCard.childCornerRadius.value,
                childCornerIndividual: this.formattingSettings.labelCard.childCornerIndividual.value,
                childCornerTopLeft: this.formattingSettings.labelCard.childCornerTopLeft.value,
                childCornerTopRight: this.formattingSettings.labelCard.childCornerTopRight.value,
                childCornerBottomLeft: this.formattingSettings.labelCard.childCornerBottomLeft.value,
                childCornerBottomRight: this.formattingSettings.labelCard.childCornerBottomRight.value
            };

            if (!this.baseConfig) {
                this.baseConfig = overrides["all"] || currentConfig;
            }
            if (applyKey === "all") {
                this.baseConfig = overrides["all"] || currentConfig;
            }

            const saveOverrides = this.formattingSettings.labelCard.saveOverrides.value;

            if (applyKey === "all") {
                if (!applyChanged) {
                    if (saveOverrides) {
                        const previousAll = overrides["all"] || this.baseConfig || currentConfig;
                        overrides["all"] = this.mergeOverrideConfig(previousAll, currentConfig);
                    }
                } else {
                    this.applyOverrideToSettings(overrides["all"] || this.baseConfig || currentConfig);
                }
            } else {
                // Usar queryName como clave para guardar el override
                const metricKey = applyKey;
                if (applyChanged) {
                    const baseOverride = overrides["all"] || this.baseConfig || currentConfig;
                    const metricOverride = overrides[metricKey] || {};
                    const targetOverride = { ...baseOverride, ...metricOverride };
                    this.applyOverrideToSettings(targetOverride);
                } else {
                    if (saveOverrides) {
                        const previousMetric = overrides[metricKey]
                            || overrides["all"]
                            || this.baseConfig
                            || currentConfig;
                        overrides[metricKey] = this.mergeOverrideConfig(previousMetric, currentConfig);
                    }
                }
            }

            this.valueOverrides = overrides;
            this.lastApplyKey = applyKey;

            if (saveOverrides) {
                this.persistOverridesJson(overrides);
            }

            this.lastApplyItems = applyItems;
            this.lastApplyValue = this.formattingSettings.labelCard.applyTo.value;

            // Render cards
            this.renderCards(cardsData, options.viewport.width, options.viewport.height);

        } catch (error) {
            console.error('Error in update:', error);
        }
    }

    private renderCards(cardsData: CardData[], width: number, height: number): void {
        const settings = this.formattingSettings;

        // Calculate grid layout
        let cardWidth = settings.gridCard.minWidth.value;
        let cardHeight = settings.gridCard.minHeight.value;
        const fitMode = String(settings.gridCard.fitMode.value.value || 'fit');
        const userSpacing = settings.gridCard.spacing.value;
        const effectiveSpacing = settings.gridCard.autoFit.value && fitMode === 'fit' ? 0 : userSpacing;
        const padding = settings.gridCard.padding.value;

        this.container.classList.remove("fitGrid");

        if (settings.gridCard.autoFit.value) {
            // Auto-fit calculation - MEJORADO para garantizar que todas las tarjetas quepan
            const availableWidth = width - (2 * padding);
            const availableHeight = height - (2 * padding);
            
            const numCards = cardsData.length;
            
            // Calcular número óptimo de columnas y filas
            let cols = Math.ceil(Math.sqrt(numCards * availableWidth / availableHeight));
            let rows = Math.ceil(numCards / cols);
            
            // Ajustar si las filas calculadas no caben todas las tarjetas
            while (cols * rows < numCards) {
                cols++;
                rows = Math.ceil(numCards / cols);
            }
            
            // Calcular tamaños de tarjeta basados en columnas/filas
            const testCardWidth = (availableWidth - ((cols - 1) * effectiveSpacing)) / cols;
            const testCardHeight = (availableHeight - ((rows - 1) * effectiveSpacing)) / rows;
            
            // En autoFit, NO bloquear por minWidth/minHeight
            cardWidth = testCardWidth;
            cardHeight = testCardHeight;

            // Scale fonts based on card size
            const scale = Math.min(cardWidth / 150, cardHeight / 100);
            const titleFontSize = Math.max(8, Math.min(16, settings.cardStyle.titleFont.fontSize.value * scale));
            const labelFontSize = Math.max(7, Math.min(12, settings.labelCard.labelFont.fontSize.value * scale));
            const valueFontSize = Math.max(9, Math.min(16, settings.labelCard.valueFont.fontSize.value * scale));

            this.container.style.setProperty('--title-font-size', `${titleFontSize}px`);
            this.container.style.setProperty('--label-font-size', `${labelFontSize}px`);
            this.container.style.setProperty('--value-font-size', `${valueFontSize}px`);
        } else {
            this.container.style.setProperty('--title-font-size', `${settings.cardStyle.titleFont.fontSize.value}px`);
            this.container.style.setProperty('--label-font-size', `${settings.labelCard.labelFont.fontSize.value}px`);
            this.container.style.setProperty('--value-font-size', `${settings.labelCard.valueFont.fontSize.value}px`);
        }

        // Set CSS variables
        this.container.style.setProperty('--card-width', `${cardWidth}px`);
        this.container.style.setProperty('--card-height', `${cardHeight}px`);
        this.container.style.setProperty('--spacing', `${effectiveSpacing}px`);
        this.container.style.setProperty('--padding', `${padding}px`);
        this.container.style.setProperty('--border-color', settings.cardStyle.borderColor.value.value);
        const baseBorderWidth = settings.cardStyle.borderWidth.value;
        this.container.style.setProperty('--border-width', `${baseBorderWidth}px`);
        this.container.style.setProperty('--border-top', settings.cardStyle.borderTop.value ? `${baseBorderWidth}px` : '0px');
        this.container.style.setProperty('--border-right', settings.cardStyle.borderRight.value ? `${baseBorderWidth}px` : '0px');
        this.container.style.setProperty('--border-bottom', settings.cardStyle.borderBottom.value ? `${baseBorderWidth}px` : '0px');
        this.container.style.setProperty('--border-left', settings.cardStyle.borderLeft.value ? `${baseBorderWidth}px` : '0px');
        this.container.style.setProperty('--border-radius', `${settings.cardStyle.borderRadius.value}px`);
        const cardBackground = settings.cardStyle.showBackground.value
            ? settings.cardStyle.background.value.value
            : "transparent";
        this.container.style.setProperty('--card-background', cardBackground);
        this.container.style.setProperty('--title-color', settings.cardStyle.titleColor.value.value);
        this.container.style.setProperty('--title-background', settings.cardStyle.showTitleBackground.value ? settings.cardStyle.titleBackground.value.value : 'transparent');
        this.container.style.setProperty('--title-font-family', String(settings.cardStyle.titleFont.fontFamily.value || 'Segoe UI'));
        this.container.style.setProperty('--title-font-weight', settings.cardStyle.titleFont.bold?.value ? 'bold' : 'normal');
        this.container.style.setProperty('--title-font-style', settings.cardStyle.titleFont.italic?.value ? 'italic' : 'normal');
        this.container.style.setProperty('--title-text-decoration', settings.cardStyle.titleFont.underline?.value ? 'underline' : 'none');
        this.container.style.setProperty('--title-align', String(settings.cardStyle.titleAlign.value || 'center'));
        this.container.style.setProperty('--title-letter-spacing', `${settings.cardStyle.titleLetterSpacing.value}px`);
        this.container.style.setProperty('--title-line-height', String(settings.cardStyle.titleLineHeight.value));
        this.container.style.setProperty('--title-padding-h', `${settings.cardStyle.titlePaddingHorizontal.value}px`);
        this.container.style.setProperty('--title-padding-v', `${settings.cardStyle.titlePaddingVertical.value}px`);
        this.container.style.setProperty('--label-color', settings.labelCard.labelColor.value.value);
        this.container.style.setProperty('--label-font-family', String(settings.labelCard.labelFont.fontFamily.value || 'Segoe UI'));
        this.container.style.setProperty('--label-font-weight', settings.labelCard.labelFont.bold?.value ? 'bold' : 'normal');
        this.container.style.setProperty('--label-font-style', settings.labelCard.labelFont.italic?.value ? 'italic' : 'normal');
        this.container.style.setProperty('--label-text-decoration', settings.labelCard.labelFont.underline?.value ? 'underline' : 'none');
        this.container.style.setProperty('--label-align', String(settings.labelCard.labelAlign.value || 'left'));
        this.container.style.setProperty('--value-font-family', String(settings.labelCard.valueFont.fontFamily.value || 'Segoe UI'));
        this.container.style.setProperty('--value-font-weight', settings.labelCard.valueFont.bold?.value ? 'bold' : 'normal');
        this.container.style.setProperty('--value-font-style', settings.labelCard.valueFont.italic?.value ? 'italic' : 'normal');
        this.container.style.setProperty('--value-text-decoration', settings.labelCard.valueFont.underline?.value ? 'underline' : 'none');
        this.container.style.setProperty('--value-align', String(settings.labelCard.valueAlign.value || 'right'));
        this.container.style.setProperty('--value-color', settings.labelCard.valueColor.value.value);

        this.container.style.backgroundColor = "transparent";
        this.container.style.setProperty('--grid-background', "transparent");
        this.target.style.backgroundColor = "transparent";
        this.target.style.background = "transparent";

        if (settings.gridCard.autoFit.value && fitMode === 'fit') {
            this.container.classList.add("fitGrid");
            const availableWidth = width - (2 * padding);
            const availableHeight = height - (2 * padding);
            const numCards = cardsData.length;
            let cols = Math.ceil(Math.sqrt(numCards * availableWidth / availableHeight));
            let rows = Math.ceil(numCards / cols);
            while (cols * rows < numCards) {
                cols++;
                rows = Math.ceil(numCards / cols);
            }
            this.container.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            this.container.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
        } else if (fitMode === 'fill') {
            this.container.style.justifyContent = 'space-between';
            this.container.style.alignContent = 'space-between';
        } else if (fitMode === 'center') {
            this.container.style.justifyContent = 'center';
            this.container.style.alignContent = 'center';
        } else {
            this.container.style.justifyContent = 'space-between';
            this.container.style.alignContent = 'space-between';
        }

        // Calculate max value for charts (consider actual + target)
        let maxChartValue = settings.chartConfig.maxValue.value;
        if (maxChartValue === 0 && settings.chartConfig.showChart.value) {
            const chartValueIndex = settings.chartConfig.useValueIndex.value - 1;
            cardsData.forEach(cardData => {
                const fallbackActual = chartValueIndex >= 0 ? (cardData.values[chartValueIndex]?.rawValue || 0) : 0;
                const actualVal = cardData.chartActual ?? fallbackActual;
                const targetVal = cardData.chartTarget ?? 0;
                maxChartValue = Math.max(maxChartValue, Math.abs(actualVal), Math.abs(targetVal));
            });
        }

        const cardElements: Array<{ element: HTMLElement; data: CardData }> = [];
        const titleElements: HTMLElement[] = [];
        const hasHighlights = cardsData.some(card => card.isHighlighted);
        const selectedKeys = new Set(this.selectedIds.map(id => id.getKey()));

        // Create cards
        cardsData.forEach(cardData => {
            const cardElement = document.createElement("div");
            cardElement.className = "card";
            if (cardData.selectionId) {
                cardElement.setAttribute("data-selection-id", cardData.selectionId.getKey());
            }

            // Title (with optional value)
            if (settings.cardStyle.showTitle.value) {
                const titleElement = document.createElement("div");
                titleElement.className = "cardTitle";

                const titleAlign = String(settings.cardStyle.titleAlign.value || "center");
                titleElement.style.textAlign = titleAlign;

                const titleBoxWidth = settings.cardStyle.titleBoxWidth.value;
                if (titleBoxWidth && titleBoxWidth > 0) {
                    titleElement.style.width = `${Math.min(100, titleBoxWidth)}%`;
                    titleElement.style.marginLeft = "auto";
                    titleElement.style.marginRight = "auto";
                }

                const titleBoxHeight = settings.cardStyle.titleBoxHeight.value;
                if (titleBoxHeight && titleBoxHeight > 0) {
                    titleElement.style.height = `${titleBoxHeight}px`;
                    titleElement.style.display = "flex";
                    titleElement.style.alignItems = "center";
                    if (titleAlign === "left") {
                        titleElement.style.justifyContent = "flex-start";
                    } else if (titleAlign === "right") {
                        titleElement.style.justifyContent = "flex-end";
                    } else {
                        titleElement.style.justifyContent = "center";
                    }
                }
                
                let titleText = cardData.category;
                
                // Add value to title if enabled
                if (settings.cardStyle.showValueInTitle.value) {
                    const titleValueIndex = settings.cardStyle.titleValueIndex.value - 1;
                    if (titleValueIndex >= 0 && titleValueIndex < cardData.values.length) {
                        const titleValue = cardData.values[titleValueIndex].value;
                        titleText += " : " + titleValue;
                    }
                }
                
                titleElement.textContent = titleText;
                titleElement.title = titleText;
                cardElement.appendChild(titleElement);
                titleElements.push(titleElement);
            }

            // Content container (everything below title)
            const contentContainer = document.createElement("div");
            contentContainer.className = "cardContent";
            contentContainer.style.flexDirection = "column";
            contentContainer.style.flex = "1";
            contentContainer.style.padding = "10px";

            // Chart (if enabled) - ALWAYS on top
            if (settings.chartConfig.showChart.value) {
                const chartValueIndex = settings.chartConfig.useValueIndex.value - 1;
                const fallbackActual = chartValueIndex >= 0 ? (cardData.values[chartValueIndex]?.rawValue || 0) : 0;
                const actualValue = cardData.chartActual ?? fallbackActual;
                const targetValue = cardData.chartTarget;

                const chartElement = this.createChart(
                    actualValue,
                    targetValue,
                    cardData.chartActualFormatted,
                    cardData.chartTargetFormatted,
                    cardData.percentValue,
                    cardData.percentFormatted,
                    maxChartValue,
                    String(settings.chartConfig.chartType.value.value || "band"),
                    settings
                );
                const topSpacing = Math.max(0, settings.chartConfig.chartDividerSpacingTop.value || 0);
                chartElement.style.marginBottom = `${topSpacing}px`;
                contentContainer.appendChild(chartElement);

                if (settings.chartConfig.showDivider.value) {
                    const divider = document.createElement("div");
                    divider.className = "chartDivider";
                    divider.style.height = `${Math.max(1, settings.chartConfig.dividerWidth.value || 1)}px`;
                    divider.style.backgroundColor = settings.chartConfig.dividerColor.value.value;
                    divider.style.marginBottom = `${Math.max(0, settings.chartConfig.chartDividerSpacingBottom.value || 0)}px`;
                    contentContainer.appendChild(divider);
                }
            }

            // Values container - ALWAYS below chart
            const valuesContainer = document.createElement("div");
            const valueLayout = String(settings.labelCard.valueLayout.value.value || "table");
            valuesContainer.className = `cardValues ${valueLayout}`;
            valuesContainer.style.flex = "1";
            if (valueLayout === "table") {
                const columns = Math.max(1, Math.min(99, settings.labelCard.tableColumns.value || 1));
                const rows = Math.max(0, Math.min(99, settings.labelCard.tableRows.value || 0));
                valuesContainer.style.setProperty('--table-columns', String(columns));
                valuesContainer.style.setProperty('--table-rows', String(rows));
                if (rows > 0) {
                    valuesContainer.style.gridTemplateRows = `repeat(${rows}, minmax(0, auto))`;
                } else {
                    valuesContainer.style.removeProperty('grid-template-rows');
                }
            }
            if (valueLayout === "mosaic") {
                const columns = Math.max(1, Math.min(99, settings.labelCard.mosaicColumns.value || 2));
                const rows = Math.max(0, Math.min(99, settings.labelCard.mosaicRows.value || 0));
                const gap = Math.max(0, settings.labelCard.mosaicGap.value || 0);
                valuesContainer.style.setProperty('--mosaic-columns', String(columns));
                valuesContainer.style.setProperty('--mosaic-rows', String(rows));
                valuesContainer.style.setProperty('--mosaic-gap', `${gap}px`);
                if (rows > 0) {
                    valuesContainer.style.gridTemplateRows = `repeat(${rows}, minmax(0, auto))`;
                } else {
                    valuesContainer.style.removeProperty('grid-template-rows');
                }
            }

            cardData.values.forEach(valueData => {
                const valueRow = document.createElement("div");
                valueRow.className = "valueRow";

                const label = document.createElement("div");
                label.className = "valueLabel";
                label.textContent = valueData.label;

                const value = document.createElement("div");
                value.className = "valueText";
                value.textContent = valueData.value;

                const valueKey = this.valueKeyByLabel[valueData.label] || valueData.label;
                const override = (valueKey && this.valueOverrides[valueKey])
                    || this.valueOverrides[valueData.label]
                    || this.valueOverrides["all"];
                if (override) {
                    if (override.labelFontFamily) label.style.fontFamily = override.labelFontFamily;
                    if (override.labelFontSize) label.style.fontSize = `${override.labelFontSize}px`;
                    if (override.labelBold !== undefined) label.style.fontWeight = override.labelBold ? "bold" : "normal";
                    if (override.labelItalic !== undefined) label.style.fontStyle = override.labelItalic ? "italic" : "normal";
                    if (override.labelUnderline !== undefined) label.style.textDecoration = override.labelUnderline ? "underline" : "none";
                    if (override.labelAlign) label.style.textAlign = override.labelAlign;

                    if (override.valueFontFamily) value.style.fontFamily = override.valueFontFamily;
                    if (override.valueFontSize) value.style.fontSize = `${override.valueFontSize}px`;
                    if (override.valueBold !== undefined) value.style.fontWeight = override.valueBold ? "bold" : "normal";
                    if (override.valueItalic !== undefined) value.style.fontStyle = override.valueItalic ? "italic" : "normal";
                    if (override.valueUnderline !== undefined) value.style.textDecoration = override.valueUnderline ? "underline" : "none";
                    if (override.valueAlign) value.style.textAlign = override.valueAlign;
                }

                const childBackgroundEnabled = override?.childBackgroundEnabled ?? settings.labelCard.childBackgroundEnabled.value;
                const childBackgroundColor = override?.childBackgroundColor ?? settings.labelCard.childBackgroundColor.value.value;
                if (childBackgroundEnabled) {
                    valueRow.style.backgroundColor = childBackgroundColor;
                }

                const useIndividual = override?.childCornerIndividual ?? settings.labelCard.childCornerIndividual.value;
                if (useIndividual) {
                    const topLeft = override?.childCornerTopLeft ?? settings.labelCard.childCornerTopLeft.value;
                    const topRight = override?.childCornerTopRight ?? settings.labelCard.childCornerTopRight.value;
                    const bottomRight = override?.childCornerBottomRight ?? settings.labelCard.childCornerBottomRight.value;
                    const bottomLeft = override?.childCornerBottomLeft ?? settings.labelCard.childCornerBottomLeft.value;
                    valueRow.style.borderRadius = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
                } else {
                    const radius = override?.childCornerRadius ?? settings.labelCard.childCornerRadius.value;
                    valueRow.style.borderRadius = `${radius}px`;
                }

                const valueColumn = this.valueColumns[valueData.index];
                const categoryObjectsForPoint = this.categoryObjects && cardData.index !== undefined
                    ? this.categoryObjects[cardData.index]
                    : undefined;
                const valueObjectsForPoint = valueColumn?.objects && cardData.index !== undefined
                    ? (valueColumn.objects as powerbi.DataViewObjects[])[cardData.index]
                    : undefined;

                const valueObjectsLabel = (valueObjectsForPoint?.labelCard as any)?.labelColor !== undefined;
                const valueObjectsValue = (valueObjectsForPoint?.labelCard as any)?.valueColor !== undefined;
                const categoryObjectsLabel = (categoryObjectsForPoint?.labelCard as any)?.labelColor !== undefined;
                const categoryObjectsValue = (categoryObjectsForPoint?.labelCard as any)?.valueColor !== undefined;

                const labelObjectsForPoint = valueObjectsLabel
                    ? valueObjectsForPoint
                    : (categoryObjectsLabel ? categoryObjectsForPoint : undefined);
                const valueObjectsForPointWithColor = valueObjectsValue
                    ? valueObjectsForPoint
                    : (categoryObjectsValue ? categoryObjectsForPoint : undefined);

                const conditionalLabelColor = this.getConditionalColorFromObjects(labelObjectsForPoint, "labelColor");
                const conditionalValueColor = this.getConditionalColorFromObjects(valueObjectsForPointWithColor, "valueColor");

                const hasRuleObjects = Boolean(labelObjectsForPoint || valueObjectsForPointWithColor);

                let rulesApplied = false;
                if (override?.enableColorRules) {
                    const rule = this.findColorRule(valueData.rawValue, override);
                    if (rule) {
                        if (rule.labelColor) {
                            label.style.color = rule.labelColor;
                        }
                        if (rule.valueColor) {
                            value.style.color = rule.valueColor;
                        }
                        if (rule.backgroundColor) {
                            valueRow.style.backgroundColor = rule.backgroundColor;
                            valueRow.style.borderColor = rule.backgroundColor;
                        }
                        rulesApplied = true;
                    }
                }

                if (!rulesApplied) {
                    if (conditionalLabelColor) {
                        label.style.color = conditionalLabelColor;
                    } else if (!hasRuleObjects && override?.labelColor) {
                        label.style.color = override.labelColor;
                    }

                    if (conditionalValueColor) {
                        value.style.color = conditionalValueColor;
                    } else if (!hasRuleObjects && override?.valueColor) {
                        value.style.color = override.valueColor;
                    }
                }

                valueRow.appendChild(label);
                valueRow.appendChild(value);
                valuesContainer.appendChild(valueRow);
            });

            contentContainer.appendChild(valuesContainer);
            cardElement.appendChild(contentContainer);

            // Tooltip
            if (settings.behaviorCard.enableTooltip.value && cardData.isRest && cardData.restDetails) {
                const tooltipContent = this.createRestTooltip(cardData);
                cardElement.title = tooltipContent;
            }

            if (settings.behaviorCard.enableSelection.value && cardData.selectionId) {
                cardElement.addEventListener("click", () => {
                    this.selectionManager
                        .select(cardData.selectionId as powerbi.visuals.ISelectionId, false)
                        .then(ids => {
                            this.selectedIds = ids as powerbi.visuals.ISelectionId[];
                            this.applySelectionStyles(cardElements, hasHighlights, new Set(this.selectedIds.map(id => id.getKey())));
                        });
                });
            }

            this.container.appendChild(cardElement);
            cardElements.push({ element: cardElement, data: cardData });
        });

        const baseTitleFontSize = settings.gridCard.autoFit.value
            ? parseFloat(this.container.style.getPropertyValue('--title-font-size')) || settings.cardStyle.titleFont.fontSize.value
            : settings.cardStyle.titleFont.fontSize.value;
        this.fitTitlesToWidth(titleElements, baseTitleFontSize, 8);

        if (titleElements.length > 0) {
            const maxTitleHeight = Math.max(...titleElements.map(el => el.offsetHeight));
            const maxAllowed = Math.max(24, cardHeight * 0.35);
            const finalHeight = Math.min(maxTitleHeight, maxAllowed);
            if (!settings.cardStyle.titleBoxHeight.value || settings.cardStyle.titleBoxHeight.value <= 0) {
                this.container.style.setProperty('--title-height', `${finalHeight}px`);
            } else {
                this.container.style.setProperty('--title-height', `${settings.cardStyle.titleBoxHeight.value}px`);
            }
        } else {
            this.container.style.removeProperty('--title-height');
        }

        this.applySelectionStyles(cardElements, hasHighlights, selectedKeys);

        // Set overflow - siempre auto para mostrar todas las tarjetas
        this.container.style.overflow = 'auto';
    }

    private fitTitlesToWidth(titleElements: HTMLElement[], maxFontSize: number, minFontSize: number): void {
        if (titleElements.length === 0) {
            return;
        }

        let fontSize = maxFontSize;
        let safety = 60;

        const fitsAll = () => titleElements.every(el => el.scrollWidth <= el.clientWidth);

        titleElements.forEach(el => {
            el.style.fontSize = `${fontSize}px`;
        });

        while (safety > 0 && fontSize > minFontSize && !fitsAll()) {
            fontSize -= 0.5;
            titleElements.forEach(el => {
                el.style.fontSize = `${fontSize}px`;
            });
            safety -= 1;
        }

        // If any title still overflows, allow up to 2 lines for that card
        titleElements.forEach(el => {
            if (el.scrollWidth > el.clientWidth) {
                el.classList.add("wrapTitle");
            } else {
                el.classList.remove("wrapTitle");
            }
        });
    }

    private applyOverrideToSettings(override: {
        labelFontFamily?: string;
        labelFontSize?: number;
        labelBold?: boolean;
        labelItalic?: boolean;
        labelUnderline?: boolean;
        labelAlign?: string;
        labelColor?: string;
        valueFontFamily?: string;
        valueFontSize?: number;
        valueBold?: boolean;
        valueItalic?: boolean;
        valueUnderline?: boolean;
        valueAlign?: string;
        valueColor?: string;
        enableColorRules?: boolean;
        rule1Min?: string;
        rule1Max?: string;
        rule1LabelColor?: string;
        rule1ValueColor?: string;
        rule1BackgroundColor?: string;
        rule2Min?: string;
        rule2Max?: string;
        rule2LabelColor?: string;
        rule2ValueColor?: string;
        rule2BackgroundColor?: string;
        rule3Min?: string;
        rule3Max?: string;
        rule3LabelColor?: string;
        rule3ValueColor?: string;
        rule3BackgroundColor?: string;
        childBackgroundEnabled?: boolean;
        childBackgroundColor?: string;
        childCornerRadius?: number;
        childCornerIndividual?: boolean;
        childCornerTopLeft?: number;
        childCornerTopRight?: number;
        childCornerBottomLeft?: number;
        childCornerBottomRight?: number;
    }): void {
        if (override.labelFontFamily !== undefined) {
            this.formattingSettings.labelCard.labelFont.fontFamily.value = override.labelFontFamily;
        }
        if (override.labelFontSize !== undefined) {
            this.formattingSettings.labelCard.labelFont.fontSize.value = override.labelFontSize;
        }
        if (override.labelBold !== undefined && this.formattingSettings.labelCard.labelFont.bold) {
            this.formattingSettings.labelCard.labelFont.bold.value = override.labelBold;
        }
        if (override.labelItalic !== undefined && this.formattingSettings.labelCard.labelFont.italic) {
            this.formattingSettings.labelCard.labelFont.italic.value = override.labelItalic;
        }
        if (override.labelUnderline !== undefined && this.formattingSettings.labelCard.labelFont.underline) {
            this.formattingSettings.labelCard.labelFont.underline.value = override.labelUnderline;
        }
        if (override.labelAlign !== undefined) {
            this.formattingSettings.labelCard.labelAlign.value = override.labelAlign as any;
        }
        if (override.labelColor !== undefined) {
            this.formattingSettings.labelCard.labelColor.value.value = override.labelColor;
        }
        if (override.valueFontFamily !== undefined) {
            this.formattingSettings.labelCard.valueFont.fontFamily.value = override.valueFontFamily;
        }
        if (override.valueFontSize !== undefined) {
            this.formattingSettings.labelCard.valueFont.fontSize.value = override.valueFontSize;
        }
        if (override.valueBold !== undefined && this.formattingSettings.labelCard.valueFont.bold) {
            this.formattingSettings.labelCard.valueFont.bold.value = override.valueBold;
        }
        if (override.valueItalic !== undefined && this.formattingSettings.labelCard.valueFont.italic) {
            this.formattingSettings.labelCard.valueFont.italic.value = override.valueItalic;
        }
        if (override.valueUnderline !== undefined && this.formattingSettings.labelCard.valueFont.underline) {
            this.formattingSettings.labelCard.valueFont.underline.value = override.valueUnderline;
        }
        if (override.valueAlign !== undefined) {
            this.formattingSettings.labelCard.valueAlign.value = override.valueAlign as any;
        }
        if (override.valueColor !== undefined) {
            this.formattingSettings.labelCard.valueColor.value.value = override.valueColor;
        }
        if (override.enableColorRules !== undefined) {
            this.formattingSettings.labelCard.enableColorRules.value = override.enableColorRules;
        }
        if (override.rule1Min !== undefined) {
            this.formattingSettings.labelCard.rule1Min.value = override.rule1Min;
        }
        if (override.rule1Max !== undefined) {
            this.formattingSettings.labelCard.rule1Max.value = override.rule1Max;
        }
        if (override.rule1LabelColor !== undefined) {
            this.formattingSettings.labelCard.rule1LabelColor.value.value = override.rule1LabelColor;
        }
        if (override.rule1ValueColor !== undefined) {
            this.formattingSettings.labelCard.rule1ValueColor.value.value = override.rule1ValueColor;
        }
        if (override.rule1BackgroundColor !== undefined) {
            this.formattingSettings.labelCard.rule1BackgroundColor.value.value = override.rule1BackgroundColor;
        }
        if (override.rule2Min !== undefined) {
            this.formattingSettings.labelCard.rule2Min.value = override.rule2Min;
        }
        if (override.rule2Max !== undefined) {
            this.formattingSettings.labelCard.rule2Max.value = override.rule2Max;
        }
        if (override.rule2LabelColor !== undefined) {
            this.formattingSettings.labelCard.rule2LabelColor.value.value = override.rule2LabelColor;
        }
        if (override.rule2ValueColor !== undefined) {
            this.formattingSettings.labelCard.rule2ValueColor.value.value = override.rule2ValueColor;
        }
        if (override.rule2BackgroundColor !== undefined) {
            this.formattingSettings.labelCard.rule2BackgroundColor.value.value = override.rule2BackgroundColor;
        }
        if (override.rule3Min !== undefined) {
            this.formattingSettings.labelCard.rule3Min.value = override.rule3Min;
        }
        if (override.rule3Max !== undefined) {
            this.formattingSettings.labelCard.rule3Max.value = override.rule3Max;
        }
        if (override.rule3LabelColor !== undefined) {
            this.formattingSettings.labelCard.rule3LabelColor.value.value = override.rule3LabelColor;
        }
        if (override.rule3ValueColor !== undefined) {
            this.formattingSettings.labelCard.rule3ValueColor.value.value = override.rule3ValueColor;
        }
        if (override.rule3BackgroundColor !== undefined) {
            this.formattingSettings.labelCard.rule3BackgroundColor.value.value = override.rule3BackgroundColor;
        }
        if (override.childBackgroundEnabled !== undefined) {
            this.formattingSettings.labelCard.childBackgroundEnabled.value = override.childBackgroundEnabled;
        }
        if (override.childBackgroundColor !== undefined) {
            this.formattingSettings.labelCard.childBackgroundColor.value.value = override.childBackgroundColor;
        }
        if (override.childCornerRadius !== undefined) {
            this.formattingSettings.labelCard.childCornerRadius.value = override.childCornerRadius;
        }
        if (override.childCornerIndividual !== undefined) {
            this.formattingSettings.labelCard.childCornerIndividual.value = override.childCornerIndividual;
        }
        if (override.childCornerTopLeft !== undefined) {
            this.formattingSettings.labelCard.childCornerTopLeft.value = override.childCornerTopLeft;
        }
        if (override.childCornerTopRight !== undefined) {
            this.formattingSettings.labelCard.childCornerTopRight.value = override.childCornerTopRight;
        }
        if (override.childCornerBottomLeft !== undefined) {
            this.formattingSettings.labelCard.childCornerBottomLeft.value = override.childCornerBottomLeft;
        }
        if (override.childCornerBottomRight !== undefined) {
            this.formattingSettings.labelCard.childCornerBottomRight.value = override.childCornerBottomRight;
        }
    }

    private getConditionalColorFromObjects(
        objects: powerbi.DataViewObjects | undefined,
        propertyName: "labelColor" | "valueColor"
    ): string | undefined {
        if (!objects) {
            return undefined;
        }

        const fillColor = dataViewObjects.getFillColor(
            objects,
            { objectName: "labelCard", propertyName }
        );
        if (fillColor) {
            return fillColor;
        }

        const rawValue = dataViewObjects.getValue(
            objects,
            { objectName: "labelCard", propertyName }
        ) as any;

        return this.extractColorValue(rawValue);
    }

    private mergeOverrideConfig(
        previousConfig: Record<string, any>,
        currentConfig: Record<string, any>
    ): Record<string, any> {
        const merged: Record<string, any> = { ...(previousConfig || {}) };
        Object.keys(currentConfig).forEach((key) => {
            const currentValue = currentConfig[key];
            const previousValue = previousConfig ? previousConfig[key] : undefined;
            if (currentValue !== previousValue) {
                merged[key] = currentValue;
            }
        });
        return merged;
    }

    private extractColorValue(value: any): string | undefined {
        if (!value) {
            return undefined;
        }

        if (typeof value === "string") {
            return value;
        }

        if (typeof value === "object") {
            const solidColor = value.solid?.color ?? value.color;
            if (typeof solidColor === "string") {
                return solidColor;
            }
            if (solidColor && typeof solidColor === "object") {
                return solidColor.value || solidColor.literal || solidColor.hex || solidColor.color;
            }
        }

        return undefined;
    }

    private findColorRule(
        rawValue: number,
        override: Record<string, any>
    ): { labelColor?: string; valueColor?: string; backgroundColor?: string } | null {
        const rules = [
            this.buildColorRule(override, 1),
            this.buildColorRule(override, 2),
            this.buildColorRule(override, 3)
        ];

        for (const rule of rules) {
            if (!rule) {
                continue;
            }
            const minOk = rule.min === undefined || rawValue >= rule.min;
            const maxOk = rule.max === undefined || rawValue <= rule.max;
            if (minOk && maxOk) {
                return {
                    labelColor: rule.labelColor,
                    valueColor: rule.valueColor,
                    backgroundColor: rule.backgroundColor
                };
            }
        }

        return null;
    }

    private buildColorRule(
        override: Record<string, any>,
        index: number
    ): { min?: number; max?: number; labelColor?: string; valueColor?: string; backgroundColor?: string } | null {
        const minText = override[`rule${index}Min`]
            ?? this.formattingSettings.labelCard[`rule${index}Min`].value;
        const maxText = override[`rule${index}Max`]
            ?? this.formattingSettings.labelCard[`rule${index}Max`].value;
        const min = this.parseRuleNumber(minText);
        const max = this.parseRuleNumber(maxText);

        const labelColor = override[`rule${index}LabelColor`]
            ?? this.formattingSettings.labelCard[`rule${index}LabelColor`].value.value;
        const valueColor = override[`rule${index}ValueColor`]
            ?? this.formattingSettings.labelCard[`rule${index}ValueColor`].value.value;
        const backgroundColor = override[`rule${index}BackgroundColor`]
            ?? this.formattingSettings.labelCard[`rule${index}BackgroundColor`].value.value;

        if (min === undefined && max === undefined) {
            return {
                labelColor,
                valueColor,
                backgroundColor
            };
        }

        return {
            min,
            max,
            labelColor,
            valueColor,
            backgroundColor
        };
    }

    private parseRuleNumber(value: string | undefined): number | undefined {
        if (!value) {
            return undefined;
        }
        const normalized = value.replace(",", ".").trim();
        if (!normalized) {
            return undefined;
        }
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : undefined;
    }


    private persistOverridesJson(overrides: Record<string, any>): void {
        try {
            const json = JSON.stringify(overrides || {});
            if (json === this.lastOverridesJson) {
                return;
            }
            this.lastOverridesJson = json;
            this.formattingSettings.labelCard.valueOverrides.value = json;
            this.host.persistProperties({
                merge: [
                    {
                        objectName: "labelCard",
                        selector: null,
                        properties: { valueOverrides: json }
                    }
                ]
            });
        } catch {
            // no-op
        }
    }

    private applySelectionStyles(
        cardElements: Array<{ element: HTMLElement; data: CardData }>,
        hasHighlights: boolean,
        selectedKeys: Set<string>
    ): void {
        cardElements.forEach(({ element, data }) => {
            element.classList.remove("dimmed", "selected", "highlighted");

            if (hasHighlights) {
                if (data.isHighlighted) {
                    element.classList.add("highlighted");
                } else {
                    element.classList.add("dimmed");
                }
                return;
            }

            if (selectedKeys.size > 0) {
                const key = data.selectionId ? data.selectionId.getKey() : "";
                if (key && selectedKeys.has(key)) {
                    element.classList.add("selected");
                } else {
                    element.classList.add("dimmed");
                }
            }
        });
    }

    private createChart(
        actualValue: number,
        targetValue: number | undefined,
        actualFormatted: string | undefined,
        targetFormatted: string | undefined,
        percentValue: number | undefined,
        percentFormatted: string | undefined,
        maxValue: number,
        chartType: string,
        settings: VisualFormattingSettingsModel
    ): HTMLElement {
        const chartContainer = document.createElement("div");
        chartContainer.className = "chartContainer";
        
        const chartHeight = settings.chartConfig.chartHeight.value;
        const chartWidth = settings.chartConfig.chartWidth.value;
        const chartColor = settings.chartConfig.chartColor.value.value;
        const chartBackColor = settings.chartConfig.chartBackColor.value.value;
        const markerColor = settings.chartConfig.markerColor.value.value;
        const markerWidth = settings.chartConfig.markerWidth.value;
        const showPercentage = settings.chartValues.showPercentage.value;
        const showActualLabel = settings.chartValues.showActualLabel.value;
        const showTargetLabel = settings.chartValues.showTargetLabel.value;
        const percentSource = settings.chartValues.percentSource.value.value || "auto";
        const percentageMode = settings.chartValues.percentageMode.value.value || "actualTarget";
        const percentageDecimals = settings.chartValues.percentageDecimals.value;
        const percentLabelColor = settings.chartValues.percentLabelColor.value.value;
        const percentLabelSize = settings.chartValues.percentLabelSize.value;
        const percentLabelPosition = settings.chartValues.percentLabelPosition.value.value || "center";

        // Calculate percentage
        const baseMax = maxValue > 0 ? maxValue : 1;
        const percentage = baseMax > 0 ? Math.abs(actualValue) / baseMax : 0;
        const targetPercentage = (targetValue !== undefined && baseMax > 0) ? Math.abs(targetValue) / baseMax : undefined;
        const computedPercent = (percentageMode === "actualTarget" && targetValue && targetValue !== 0)
            ? Math.abs(actualValue) / Math.abs(targetValue)
            : percentage;


        // Formato personalizado para valores gráficos
        const chartValueFormat = settings.chartValues.chartValueFormatCode.value;
        let percentText: string;
        if (percentSource === "measure" && percentFormatted) {
            percentText = percentFormatted;
        } else if (chartValueFormat && chartValueFormat.trim() !== "") {
            try {
                let value = computedPercent;
                let addPercent = false;
                if (chartValueFormat.includes("%")) {
                    value = computedPercent * 100;
                    addPercent = true;
                }
                let formatted = "";
                if (chartValueFormat.includes("0.00")) {
                    formatted = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (chartValueFormat.includes("0.0")) {
                    formatted = value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                } else if (chartValueFormat.includes("0")) {
                    formatted = value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                } else {
                    formatted = value.toLocaleString();
                }
                percentText = addPercent ? formatted + " %" : formatted;
            } catch {
                percentText = (computedPercent * 100).toFixed(percentageDecimals) + " %";
            }
        } else {
            percentText = (computedPercent * 100).toFixed(percentageDecimals) + " %";
        }

        if (chartType === "band") {
            // Banda (gauge horizontal) - centered with width control
            chartContainer.style.height = `${chartHeight}px`;
            chartContainer.style.width = "100%";
            chartContainer.style.display = "flex";
            chartContainer.style.justifyContent = "center";
            chartContainer.style.alignItems = "center";
            chartContainer.style.position = "relative";
            chartContainer.style.margin = "10px 0";

            const background = document.createElement("div");
            background.style.width = `${chartWidth}%`;
            background.style.height = "100%";
            background.style.backgroundColor = chartBackColor;
            background.style.borderRadius = "20px";
            background.style.position = "relative";
            background.style.overflow = "visible";

            const fill = document.createElement("div");
            fill.style.width = `${percentage * 100}%`;
            fill.style.height = "100%";
            fill.style.backgroundColor = chartColor;
            fill.style.borderRadius = "20px";
            fill.style.transition = "width 0.3s ease";

            background.appendChild(fill);
            
            if (targetPercentage !== undefined) {
                const marker = document.createElement("div");
                marker.style.position = "absolute";
                marker.style.left = `${Math.min(targetPercentage * 100, 100)}%`;
                marker.style.top = "-6px";
                marker.style.transform = "translateX(-50%)";
                marker.style.width = `${markerWidth}px`;
                marker.style.height = `calc(100% + 12px)`;
                marker.style.backgroundColor = markerColor;
                marker.style.borderRadius = "2px";
                background.appendChild(marker);

                if (showActualLabel && actualFormatted) {
                    const actualLabel = document.createElement("div");
                    // Custom format or units
                    let actualText = actualFormatted;
                    const actualFormat = settings.chartValues.actualLabelCustomFormat?.value;
                    if (actualFormat && actualFormat.trim() !== "") {
                        let value = actualValue;
                        let addPercent = false;
                        if (actualFormat.includes("%")) {
                            value = actualValue * 100;
                            addPercent = true;
                        }
                        let formatted = "";
                        if (actualFormat.includes("0.00")) {
                            formatted = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        } else if (actualFormat.includes("0.0")) {
                            formatted = value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                        } else if (actualFormat.includes("0")) {
                            formatted = value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        } else {
                            formatted = value.toLocaleString();
                        }
                        actualText = addPercent ? formatted + " %" : formatted;
                    } else {
                        const actualUnits = settings.chartValues.actualLabelUnits.value.value;
                        if (actualUnits === "percent") {
                            actualText = (actualValue * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " %";
                        } else if (actualUnits === "millions") {
                            actualText = (actualValue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
                        } else if (actualUnits === "thousands") {
                            actualText = (actualValue / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
                        } else if (actualUnits === "none") {
                            actualText = actualValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                        }
                    }
                    actualLabel.textContent = actualText;
                    actualLabel.style.position = "absolute";
                    // Posición extendida
                    const actualPos = settings.chartValues.actualLabelPosition.value.value;
                    const baseLeft = Math.min(targetPercentage * 100, 100);
                    switch (actualPos) {
                        case "top":
                            actualLabel.style.left = `${baseLeft}%`;
                            actualLabel.style.top = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                            break;
                        case "bottom":
                            actualLabel.style.left = `${baseLeft}%`;
                            actualLabel.style.bottom = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                            break;
                        case "left":
                            actualLabel.style.left = `calc(${baseLeft}% - 40px)`;
                            actualLabel.style.top = "50%";
                            actualLabel.style.transform = "translateY(-50%)";
                            break;
                        case "right":
                            actualLabel.style.left = `calc(${baseLeft}% + 40px)`;
                            actualLabel.style.top = "50%";
                            actualLabel.style.transform = "translateY(-50%)";
                            break;
                        case "top-left":
                            actualLabel.style.left = `calc(${baseLeft}% - 30px)`;
                            actualLabel.style.top = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                            break;
                        case "top-right":
                            actualLabel.style.left = `calc(${baseLeft}% + 30px)`;
                            actualLabel.style.top = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                            break;
                        case "bottom-left":
                            actualLabel.style.left = `calc(${baseLeft}% - 30px)`;
                            actualLabel.style.bottom = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                            break;
                        case "bottom-right":
                            actualLabel.style.left = `calc(${baseLeft}% + 30px)`;
                            actualLabel.style.bottom = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                            break;
                        case "side":
                            actualLabel.style.left = `calc(${baseLeft}% + 50px)`;
                            actualLabel.style.top = "50%";
                            actualLabel.style.transform = "translateY(-50%)";
                            break;
                        default:
                            actualLabel.style.left = `${baseLeft}%`;
                            actualLabel.style.top = "-18px";
                            actualLabel.style.transform = "translateX(-50%)";
                    }
                    actualLabel.style.fontSize = `${settings.chartValues.actualLabelFontSize.value}px`;
                    actualLabel.style.fontWeight = "600";
                    actualLabel.style.color = settings.chartValues.actualLabelColor.value.value;
                    background.appendChild(actualLabel);
                }

                if (showTargetLabel && targetFormatted) {
                    const targetLabel = document.createElement("div");
                    // Custom format or units
                    let targetText = targetFormatted;
                    const targetFormat = settings.chartValues.targetLabelCustomFormat?.value;
                    if (targetFormat && targetFormat.trim() !== "") {
                        let value = targetValue;
                        let addPercent = false;
                        if (targetFormat.includes("%")) {
                            value = targetValue * 100;
                            addPercent = true;
                        }
                        let formatted = "";
                        if (targetFormat.includes("0.00")) {
                            formatted = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        } else if (targetFormat.includes("0.0")) {
                            formatted = value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                        } else if (targetFormat.includes("0")) {
                            formatted = value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        } else {
                            formatted = value.toLocaleString();
                        }
                        targetText = addPercent ? formatted + " %" : formatted;
                    } else {
                        const targetUnits = settings.chartValues.targetLabelUnits.value.value;
                        if (targetUnits === "percent") {
                            targetText = (targetValue * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " %";
                        } else if (targetUnits === "millions") {
                            targetText = (targetValue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
                        } else if (targetUnits === "thousands") {
                            targetText = (targetValue / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
                        } else if (targetUnits === "none") {
                            targetText = targetValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                        }
                    }
                    targetLabel.textContent = targetText;
                    targetLabel.style.position = "absolute";
                    // Posición extendida
                    const targetPos = settings.chartValues.targetLabelPosition.value.value;
                    const baseLeft = Math.min(targetPercentage * 100, 100);
                    switch (targetPos) {
                        case "top":
                            targetLabel.style.left = `${baseLeft}%`;
                            targetLabel.style.top = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                            break;
                        case "bottom":
                            targetLabel.style.left = `${baseLeft}%`;
                            targetLabel.style.bottom = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                            break;
                        case "left":
                            targetLabel.style.left = `calc(${baseLeft}% - 40px)`;
                            targetLabel.style.top = "50%";
                            targetLabel.style.transform = "translateY(-50%)";
                            break;
                        case "right":
                            targetLabel.style.left = `calc(${baseLeft}% + 40px)`;
                            targetLabel.style.top = "50%";
                            targetLabel.style.transform = "translateY(-50%)";
                            break;
                        case "top-left":
                            targetLabel.style.left = `calc(${baseLeft}% - 30px)`;
                            targetLabel.style.top = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                            break;
                        case "top-right":
                            targetLabel.style.left = `calc(${baseLeft}% + 30px)`;
                            targetLabel.style.top = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                            break;
                        case "bottom-left":
                            targetLabel.style.left = `calc(${baseLeft}% - 30px)`;
                            targetLabel.style.bottom = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                            break;
                        case "bottom-right":
                            targetLabel.style.left = `calc(${baseLeft}% + 30px)`;
                            targetLabel.style.bottom = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                            break;
                        case "side":
                            targetLabel.style.left = `calc(${baseLeft}% - 50px)`;
                            targetLabel.style.top = "50%";
                            targetLabel.style.transform = "translateY(-50%)";
                            break;
                        default:
                            targetLabel.style.left = `${baseLeft}%`;
                            targetLabel.style.top = "-18px";
                            targetLabel.style.transform = "translateX(-50%)";
                    }
                    targetLabel.style.fontSize = `${settings.chartValues.targetLabelFontSize.value}px`;
                    targetLabel.style.fontWeight = "600";
                    targetLabel.style.color = settings.chartValues.targetLabelColor.value.value;
                    background.appendChild(targetLabel);
                }
            }

            if (showPercentage) {
                const percentLabel = document.createElement("div");
                percentLabel.textContent = percentText;
                percentLabel.style.position = "absolute";
                if (percentLabelPosition === "top") {
                    percentLabel.style.top = "-18px";
                    percentLabel.style.left = "50%";
                    percentLabel.style.transform = "translateX(-50%)";
                } else if (percentLabelPosition === "bottom") {
                    percentLabel.style.bottom = "-18px";
                    percentLabel.style.left = "50%";
                    percentLabel.style.transform = "translateX(-50%)";
                } else if (percentLabelPosition === "right") {
                    percentLabel.style.top = "50%";
                    percentLabel.style.right = "6px";
                    percentLabel.style.transform = "translateY(-50%)";
                } else if (percentLabelPosition === "left") {
                    percentLabel.style.top = "50%";
                    percentLabel.style.left = "6px";
                    percentLabel.style.transform = "translateY(-50%)";
                } else {
                    percentLabel.style.top = "50%";
                    percentLabel.style.left = "50%";
                    percentLabel.style.transform = "translate(-50%, -50%)";
                }
                percentLabel.style.fontSize = `${percentLabelSize}px`;
                percentLabel.style.fontWeight = "bold";
                percentLabel.style.color = percentLabelColor;
                percentLabel.style.zIndex = "10";
                background.appendChild(percentLabel);
            }

            chartContainer.appendChild(background);

        } else if (chartType === "bar") {
            // Barra horizontal - centered with width control
            chartContainer.style.height = `${chartHeight}px`;
            chartContainer.style.width = "100%";
            chartContainer.style.display = "flex";
            chartContainer.style.justifyContent = "center";
            chartContainer.style.alignItems = "center";
            chartContainer.style.position = "relative";
            chartContainer.style.margin = "10px 0";

            const background = document.createElement("div");
            background.style.width = `${chartWidth}%`;
            background.style.height = "100%";
            background.style.backgroundColor = chartBackColor;
            background.style.borderRadius = "4px";
            background.style.position = "relative";
            background.style.overflow = "visible";

            const fill = document.createElement("div");
            fill.style.width = `${percentage * 100}%`;
            fill.style.height = "100%";
            fill.style.backgroundColor = chartColor;
            fill.style.transition = "width 0.3s ease";

            background.appendChild(fill);

            if (targetPercentage !== undefined) {
                const marker = document.createElement("div");
                marker.style.position = "absolute";
                marker.style.left = `${Math.min(targetPercentage * 100, 100)}%`;
                marker.style.top = "-4px";
                marker.style.transform = "translateX(-50%)";
                marker.style.width = `${markerWidth}px`;
                marker.style.height = `calc(100% + 8px)`;
                marker.style.backgroundColor = markerColor;
                marker.style.borderRadius = "2px";
                background.appendChild(marker);

                // Etiqueta Actual
                if (showActualLabel && actualFormatted) {
                    const actualLabel = document.createElement("div");
                    let actualText = actualFormatted;
                    const actualUnits = settings.chartValues.actualLabelUnits.value.value;
                    if (actualUnits === "percent") {
                        actualText = (actualValue * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " %";
                    } else if (actualUnits === "millions") {
                        actualText = (actualValue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
                    } else if (actualUnits === "thousands") {
                        actualText = (actualValue / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
                    } else {
                        // "none" o "auto": solo valor numérico, sin sufijo
                        actualText = actualValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                    }
                    actualLabel.textContent = actualText;
                    actualLabel.style.position = "absolute";
                    // Posición
                    const actualPos = settings.chartValues.actualLabelPosition.value.value;
                    if (actualPos === "top") {
                        setTimeout(() => {
                            const box = background.getBoundingClientRect();
                            const label = actualLabel.getBoundingClientRect();
                            let left = (targetPercentage * box.width) - (label.width / 2);
                            // Justificación dinámica
                            if (left < 10) {
                                actualLabel.style.left = `0px`;
                                actualLabel.style.textAlign = "left";
                            } else if (left + label.width > box.width - 10) {
                                actualLabel.style.left = `${box.width - label.width}px`;
                                actualLabel.style.textAlign = "right";
                            } else {
                                actualLabel.style.left = `${left}px`;
                                actualLabel.style.textAlign = "center";
                            }
                            actualLabel.style.top = "-16px";
                            actualLabel.style.transform = "none";
                            actualLabel.style.whiteSpace = "nowrap";
                            actualLabel.style.maxWidth = "none";
                            actualLabel.style.overflow = "visible";
                            actualLabel.style.textOverflow = "unset";
                        }, 0);
                    } else if (actualPos === "bottom") {
                        actualLabel.style.left = `${Math.min(targetPercentage * 100, 100)}%`;
                        actualLabel.style.bottom = "-16px";
                        actualLabel.style.transform = "translateX(-50%)";
                    } else if (actualPos === "left") {
                        actualLabel.style.left = `calc(${Math.min(targetPercentage * 100, 100)}% - 40px)`;
                        actualLabel.style.top = "50%";
                        actualLabel.style.transform = "translateY(-50%)";
                    } else if (actualPos === "right") {
                        actualLabel.style.left = `calc(${Math.min(targetPercentage * 100, 100)}% + 40px)`;
                        actualLabel.style.top = "50%";
                        actualLabel.style.transform = "translateY(-50%)";
                    }
                    actualLabel.style.fontSize = `${settings.chartValues.actualLabelFontSize.value}px`;
                    actualLabel.style.fontWeight = "600";
                    actualLabel.style.color = settings.chartValues.actualLabelColor.value.value;
                    background.appendChild(actualLabel);
                }

                // Etiqueta Objetivo
                if (showTargetLabel && targetFormatted) {
                    const targetLabel = document.createElement("div");
                    let targetText = targetFormatted;
                    const targetUnits = settings.chartValues.targetLabelUnits.value.value;
                    if (targetUnits === "percent") {
                        targetText = (targetValue * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " %";
                    } else if (targetUnits === "millions") {
                        targetText = (targetValue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
                    } else if (targetUnits === "thousands") {
                        targetText = (targetValue / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
                    } else {
                        // "none" o "auto": solo valor numérico, sin sufijo
                        targetText = targetValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                    }
                    targetLabel.textContent = targetText;
                    targetLabel.style.position = "absolute";
                    // Posición
                    const targetPos = settings.chartValues.targetLabelPosition.value.value;
                    if (targetPos === "top") {
                        setTimeout(() => {
                            const box = background.getBoundingClientRect();
                            const label = targetLabel.getBoundingClientRect();
                            let left = (targetPercentage * box.width) - (label.width / 2);
                            // Justificación dinámica
                            if (left < 10) {
                                targetLabel.style.left = `0px`;
                                targetLabel.style.textAlign = "left";
                            } else if (left + label.width > box.width - 10) {
                                targetLabel.style.left = `${box.width - label.width}px`;
                                targetLabel.style.textAlign = "right";
                            } else {
                                targetLabel.style.left = `${left}px`;
                                targetLabel.style.textAlign = "center";
                            }
                            targetLabel.style.top = "-16px";
                            targetLabel.style.transform = "none";
                            targetLabel.style.whiteSpace = "nowrap";
                            targetLabel.style.maxWidth = "none";
                            targetLabel.style.overflow = "visible";
                            targetLabel.style.textOverflow = "unset";
                        }, 0);
                    } else if (targetPos === "bottom") {
                        targetLabel.style.left = `${Math.min(targetPercentage * 100, 100)}%`;
                        targetLabel.style.bottom = "-16px";
                        targetLabel.style.transform = "translateX(-50%)";
                    } else if (targetPos === "left") {
                        targetLabel.style.left = `calc(${Math.min(targetPercentage * 100, 100)}% - 40px)`;
                        targetLabel.style.top = "50%";
                        targetLabel.style.transform = "translateY(-50%)";
                    } else if (targetPos === "right") {
                        targetLabel.style.left = `calc(${Math.min(targetPercentage * 100, 100)}% + 40px)`;
                        targetLabel.style.top = "50%";
                        targetLabel.style.transform = "translateY(-50%)";
                    }
                    targetLabel.style.fontSize = `${settings.chartValues.targetLabelFontSize.value}px`;
                    targetLabel.style.fontWeight = "600";
                    targetLabel.style.color = settings.chartValues.targetLabelColor.value.value;
                    background.appendChild(targetLabel);
                }
            }

            if (showPercentage) {
                const percentLabel = document.createElement("div");
                percentLabel.textContent = percentText;
                percentLabel.style.position = "absolute";
                if (percentLabelPosition === "top") {
                    percentLabel.style.top = "-16px";
                    percentLabel.style.left = "50%";
                    percentLabel.style.transform = "translateX(-50%)";
                } else if (percentLabelPosition === "bottom") {
                    percentLabel.style.bottom = "-16px";
                    percentLabel.style.left = "50%";
                    percentLabel.style.transform = "translateX(-50%)";
                } else if (percentLabelPosition === "right") {
                    percentLabel.style.top = "50%";
                    percentLabel.style.right = "6px";
                    percentLabel.style.transform = "translateY(-50%)";
                } else if (percentLabelPosition === "left") {
                    percentLabel.style.top = "50%";
                    percentLabel.style.left = "6px";
                    percentLabel.style.transform = "translateY(-50%)";
                } else {
                    percentLabel.style.top = "50%";
                    percentLabel.style.left = "50%";
                    percentLabel.style.transform = "translate(-50%, -50%)";
                }
                percentLabel.style.fontSize = `${percentLabelSize}px`;
                percentLabel.style.fontWeight = "bold";
                percentLabel.style.color = percentLabelColor;
                percentLabel.style.zIndex = "10";
                background.appendChild(percentLabel);
            }

            chartContainer.appendChild(background);
        }

        return chartContainer;
    }

    private createRestTooltip(restCard: CardData): string {
        if (!restCard.restDetails) return '';

        let tooltip = 'Agrupados en Resto:\n\n';
        restCard.restDetails.forEach(detail => {
            tooltip += `${detail.category}:\n`;
            detail.values.forEach(val => {
                tooltip += `  ${val.label}: ${val.value}\n`;
            });
            tooltip += '\n';
        });
        return tooltip;
    }

    private formatValue(value: number, format?: string): string {
        if (value === null || value === undefined) {
            return "--";
        }
        // Formato español: mil, M, MM
        if (Math.abs(value) >= 1e9) {
            return (value / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " MM";
        } else if (Math.abs(value) >= 1e6) {
            return (value / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " M";
        } else if (Math.abs(value) >= 1e3) {
            return (value / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " mil";
        } else {
            return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        if (this.formattingSettings && this.lastApplyItems.length > 0) {
            this.formattingSettings.labelCard.applyTo.items = this.lastApplyItems;
            const currentValue = this.formattingSettings.labelCard.applyTo.value?.value ?? this.lastApplyValue?.value;
            if (currentValue !== undefined && currentValue !== null) {
                const match = this.lastApplyItems.find(item => String(item.value) === String(currentValue));
                if (match) {
                    this.formattingSettings.labelCard.applyTo.value = match;
                }
            }
        }
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}