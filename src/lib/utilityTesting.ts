import { processImageServerSide, resizeImage } from '@/lib/utilityFunctions';

function main() {

    /*
    const inputFilePath = '/Users/michaelkwok/Code/toys-to-stories-web-next/public/toy-photos/png/0-nobg.png';
    const outputFilePath = '/Users/michaelkwok/Code/toys-to-stories-web-next/public/toy-photos/bmp';
    const outputFileName = '0';
    const squareSize = 500;

    processImageServerSide(inputFilePath, outputFilePath, outputFileName)
} */

    for (let i = 0; i < 7; i++) {
        const inputFilePath = `/Users/michaelkwok/Code/toys-to-stories-web-next/public/toy-photos/no-bg/${i}-nobg.png`;
        const outputFilePath = '/Users/michaelkwok/Code/toys-to-stories-web-next/public/toy-photos/no-bg/compressed';
        const outputFileName = `${i}`;
        resizeImage(inputFilePath, outputFilePath, outputFileName);
    }
}

main();
