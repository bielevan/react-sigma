export default function styleElement(id: string, propertier: any, value: string) {
    let element = document.getElementById(id) as HTMLElement | null;
    if (element) 
        element.style[propertier] = value;
} 