/**
 * Formats the price based on the currency.
 * Examples:
 * - 12 CZK → 12 Kč
 * - 4.2 EUR → 4,2 €
 * - 1234 CZK → 1 234 Kč
 * @param price The price value
 * @param currency The currency string (e.g., "CZK", "EUR")
 */
export function formatPrice(price: number, currency: string): string {
    const locale = "cs-CZ"; // Czech locale for correct formatting
    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    const formattedPrice = formatter.format(price);

    if (currency === "CZK") {
        return `${formattedPrice} Kč`;
    } else if (currency === "EUR") {
        return `${formattedPrice.replace(".", ",")} €`;
    }

    return `${formattedPrice} ${currency}`;
}

/**
 * Formats the creation date for display in the table.
 * - If created today, shows time in `HH:mm` format.
 * - If this year, shows in `DD.MM.` format.
 * - If another year, shows in `DD.MM.YYYY` format.
 * @param dateStr ISO string or Date object to format.
 */
export function formatCreationDate(dateStr: string | Date): string {
    const date = typeof dateStr === "string" ? new Date(dateStr) : new Date;
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
    }

    const isThisYear = date.getFullYear() === now.getFullYear();
    if (isThisYear) {
        return date.toLocaleDateString("cs-CZ", { day: "2-digit", month: "2-digit" });
    }

    return date.toLocaleDateString("cs-CZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/**
 * Formats the last update date for display in the table.
 * - If updated today, shows time in `HH:mm:ss` format.
 * - If this year, shows in `DD.MM.` format.
 * - If another year, shows in `DD.MM.YYYY` format.
 * @param dateStr ISO string or Date object to format.
 */
export function formatLastUpdate(dateStr: string | Date): string {
    const date = typeof dateStr === "string" ? new Date(dateStr) : new Date();
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    const isThisYear = date.getFullYear() === now.getFullYear();
    if (isThisYear) {
        return date.toLocaleDateString("cs-CZ", { day: "2-digit", month: "2-digit" });
    }

    return date.toLocaleDateString("cs-CZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
