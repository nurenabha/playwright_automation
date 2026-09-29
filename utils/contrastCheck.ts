import { expect, Locator } from '@playwright/test';

function getLuminance(rgb: number[]): number {
    const values = rgb.map(value => {
        const channel = value / 255;
        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return (
        0.2126 * values[0] +
        0.7152 * values[1] +
        0.0722 * values[2]
    );
}

function getContrastRatio(
    foreground: number[],
    background: number[]
): number {
    const foregroundLuminance = getLuminance(foreground);
    const backgroundLuminance = getLuminance(background);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);

    return (lighter + 0.05) / (darker + 0.05);
}

function parseRGB(color: string): number[] {
    const match = color.match(/\d+/g);

    if (!match || match.length < 3) {
        throw new Error(`Unable to parse color: ${color}`);
    }

    return [
        Number(match[0]),
        Number(match[1]),
        Number(match[2])
    ];
}

export type ContrastCheck = [locator: Locator, elementName: string, pseudoElement?: string | null];

// pseudoElement: pass '::placeholder' to check an input's placeholder text instead of its own text
// Uses a soft assertion so every element is checked and reported, not just the first failure
export async function checkContrast(
    locator: Locator,
    elementName: string,
    pseudoElement: string | null = null
) {
    if (pseudoElement) {
        await expect(locator).toBeVisible();
    }

    const result = await locator.evaluate((element: HTMLElement, pseudoElement: string | null) => {
        const style = pseudoElement
            ? window.getComputedStyle(element, pseudoElement)
            : window.getComputedStyle(element);

        let current: HTMLElement | null = element;
        let backgroundColor = 'rgb(255, 255, 255)';

        while (current) {
            const bg = window.getComputedStyle(current).backgroundColor;

            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                backgroundColor = bg;
                break;
            }

            current = current.parentElement;
        }

        return {
            color: style.color,
            backgroundColor
        };
    }, pseudoElement);

    const foreground = parseRGB(result.color);
    const background = parseRGB(result.backgroundColor);
    const contrastRatio = getContrastRatio(foreground, background);

    console.log(
        `${elementName}: ${result.color} on ${result.backgroundColor} = ${contrastRatio.toFixed(2)}:1`
    );

    expect.soft(
        contrastRatio,
        `${elementName} contrast ratio is below WCAG 2.1 AA requirement`
    ).toBeGreaterThanOrEqual(4.5);
}
