export default function NormalizeSpace(data: string){
    return data.trim().replace(/\s+/g, ' ');
}