
export function capitaizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function getCfnNameFromApp(name: string): string {
    return name.split("-")
        .map(capitaizeFirstLetter)
        .join("")
}
