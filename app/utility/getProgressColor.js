import defaultStyles from '../config/styles';
const getProgressColor = (progress) => {
    if (progress >= 80) return defaultStyles.colors.primary;
    if (progress >= 60) return interpolateColor(defaultStyles.colors.primaryLight, defaultStyles.colors.primary, (progress - 60) / 20);
    if (progress >= 40) return interpolateColor(defaultStyles.colors.buttonLight, defaultStyles.colors.primaryLight, (progress - 40) / 20);
    if (progress >= 20) return interpolateColor(defaultStyles.colors.secondary, defaultStyles.colors.buttonLight, (progress - 20) / 20);
    return defaultStyles.colors.secondary;
};

const interpolateColor = (color1, color2, factor) => {
    // Simple linear interpolation between two colors
    const hex = (color) => {
        const hexColor = color.replace('#', '');
        return parseInt(hexColor, 16);
    };

    const lerp = (a, b, amount) => {
        return (a + amount * (b - a));
    };

    const color1Hex = hex(color1);
    const color2Hex = hex(color2);

    const r1 = (color1Hex >> 16) & 0xff;
    const g1 = (color1Hex >> 8) & 0xff;
    const b1 = color1Hex & 0xff;

    const r2 = (color2Hex >> 16) & 0xff;
    const g2 = (color2Hex >> 8) & 0xff;
    const b2 = color2Hex & 0xff;

    const r = Math.round(lerp(r1, r2, factor)).toString(16).padStart(2, '0');
    const g = Math.round(lerp(g1, g2, factor)).toString(16).padStart(2, '0');
    const b = Math.round(lerp(b1, b2, factor)).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
};

export default getProgressColor;