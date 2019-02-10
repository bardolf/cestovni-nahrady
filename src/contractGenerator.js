import jsPDF from 'jspdf';
import clubService from './clubService';
import { dejavu_serif_font } from './customFonts'

const PRICE_KM = 3.5;

export default class ContractGenerator {
    static generate(contractDate, name, address, account, action, transits) {
        
        var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.addFileToVFS('DejavuSerif.ttf', dejavu_serif_font);
        doc.addFont('DejavuSerif.ttf', 'DejavuSerif', 'normal');
        doc.setFont('DejavuSerif');
        doc.setFontType('normal');

        doc.setFontSize(24);
        doc.text('SMLOUVA', 80, 20);
        doc.setFontSize(12);
        doc.text('uzavřená dle §1746 odst. 2 zákona č. 89/2012 Sb., občanského zákoníku, kterou', 10, 35);
        doc.text('uzavřeli dne ' + contractDate, 10, 40);
        doc.text('Klub šachistů Říčany 1925, z.s. se sídlem v Říčanech, zastoupený předsedou', 10, 50);
        doc.text('ing. Jaroslavem Říhou na straně jedné ', 10, 55);
        doc.text('a', 100, 65);
        doc.text('pan/paní ' + name, 10, 75);
        doc.text('bytem ' + address, 10, 80);
        doc.text('číslo účtu ' + account, 10, 85);
        doc.text('(dále jen příjemce) na straně druhé takto: ', 10, 95);
        doc.text('I.', 100, 105);
        doc.text('Příjemce se zavazuje zajistit v rámci konání akce ' + action, 10, 115);
        doc.text('přepravu na utkání: ', 10, 120);

        var data = [];
        var sum = 0;
        for (var i = 0; i < transits.length; i++) {
            var t = transits[i];
            if (!t.to) {
                continue;
            }
            var record = clubService.getClub(t.to.label);
            data.push([t.date, t.from, record.city, record.distance + " km", record.distance * PRICE_KM + " Kč"]);
            sum = sum + record.distance * PRICE_KM;
        }

        doc.autoTable({
            head: [['Datum', 'Odkud', 'Kam', 'Vzdálenost', 'Úhrada']],
            body: data,
            // ...

            startY: 130,
            styles: { font: "DejavuSerif", fontStyle: "normal" }
        });

        var offset = 145 + transits.length * 10;
        doc.text('II.', 100, offset);
        doc.text('Klub šachistů Říčany 1925 se zavazuje vyplatit příjemci příspěvek na cestovní výdaje', 10, offset = offset + 10);
        doc.text('(§4 odst. 1, písm. k zákona č. 586/1992 Sb.) v souvislosti s používáním osobního', 10, offset = offset + 5);
        doc.text('automobilu ve výši 3,50 Kč(*) za ujetý kilometr, tj. celkem: ' + sum + ',- Kč', 10, offset = offset + 5);

        doc.text('...............................', 30, offset = offset + 20);
        doc.text('...............................', 130, offset);
        doc.setFontSize(10);
        doc.text('Podpis příjemce', 35, offset = offset + 5);
        doc.text('Podpis zástupce z.s.', 135, offset);
        doc.text('(*) schváleno valnou hromadou dne 23.1.2015', 10, 280);
        doc.save('cestovni-nahrady.pdf');
    }
}
