export function isEven(n: number) {
    return n % 2 === 0;
}

type Art = string;

let chars = {
    hStart: "┌",
    hMid: "┬",
    hEnd: "┐",
    vStart: "┌",
    vMid: "├",
    vEnd: "└",
    h: "┌┬┐",
    v: "┌├└",

}

function splitBoxed(input: string): Art[][] {
    let hSegs = input.split('\n')[0]
        .split('')
        .map((c, i) => ({c, i}))
        .filter((a) => chars.h.includes(a.c))
        .map((v, i, a) => [v.i+1, a[i+1]?.i-1])
        .filter((a) => a[1])
    let vSegs = input.split('\n')
        .map((l) => l[0])
        .map((c, i) => ({c, i}))
        .filter((a) => chars.v.includes(a.c))
        .map((v, i, a) => [v.i+1, a[i+1]?.i-1])
        .filter((a) => a[1])
    return hSegs.map(h => vSegs.map(v => {
        let lines = input.split('\n').slice(v[0], v[1]+1);
        return lines.map((l) => l.slice(h[0], h[1]+1)).join('\n');
    }));
}

// @ts-ignore
import nix_logo from '@/nix-logo.txt?raw';
import kleur from 'kleur';
import fs from 'fs/promises';

console.log(fs)

let arts = splitBoxed(nix_logo);

let colors = [
    kleur.blue,
    kleur.magenta
]

for (let i in arts) {
    let art = arts[i];
    let neofetch_res = ""
    for (let char in art[0].split('')) {
        let c0 = art[0][char];
        let c1 = art[1][char];
        let idx = Number(c0 === c1);
        process.stdout.write(colors[idx](c0))
        neofetch_res += `\${c${idx+1}}${c0}`
    }
    fs.writeFile(`neofetch_art${i}.txt`, neofetch_res).then();

    process.stdout.write('\n');
}
