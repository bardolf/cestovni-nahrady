import React from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable';
import { data } from './data.js'
import { dejavu_serif_font } from '../customFonts'
import { loadState, saveState } from '../localStorage';

const PRICE_KM = 3.5;

export default class NameForm extends React.Component {
    constructor(props) {
        super(props);

        if ((this.state = loadState()) == undefined) {
            this.state = {
                contractDate: '',
                name: '',
                address: '',
                account: '',
                transits: [],
            };
        }
        this.data = data.sort();
        this.distances = [];
        for (var i = 0; i < this.data.length; i++) {
            this.distances.push({ label: this.data[i].club, value: i });
        }
    }

    getDistances() {
        return this.distances;
    };

    handleOnChange(event) {
        if (event.target.id == 'contractDate') {
            this.setState({ contractDate: event.target.value });
        } else if (event.target.id == 'name') {
            this.setState({ name: event.target.value });
        } else if (event.target.id == 'address') {
            this.setState({ address: event.target.value });
        } else if (event.target.id == 'account') {
            this.setState({ account: event.target.value });
        } else if (event.target.id == 'action') {
            this.setState({ action: event.target.value });
        }
    }

    handleGeneratePdf() {
        saveState(this.state);
        var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        console.log(doc.getFontList());
        doc.addFileToVFS('DejavuSerif.ttf', dejavu_serif_font);
        doc.addFont('DejavuSerif.ttf', 'DejavuSerif', 'normal');
        doc.setFont('DejavuSerif');
        doc.setFontType('normal');

        doc.setFontSize(24);
        doc.text('SMLOUVA', 80, 20);
        doc.setFontSize(12);
        doc.text('uzavřená dle §1746 odst. 2 zákona č. 89/2012 Sb., občanského zákoníku, kterou', 10, 35);
        doc.text('uzavřeli dne ' + this.state.contractDate, 10, 40);
        doc.text('Klub šachistů Říčany 1925, z.s. se sídlem v Říčanech, zastoupený předsedou', 10, 50);
        doc.text('ing. Jaroslavem Říhou na straně jedné ', 10, 55);
        doc.text('a', 100, 65);
        doc.text('pan/paní ' + this.state.name, 10, 75);
        doc.text('bytem ' + this.state.address, 10, 80);
        doc.text('číslo účtu ' + this.state.account, 10, 85);
        doc.text('(dále jen příjemce) na straně druhé takto: ', 10, 95);
        doc.text('I.', 100, 105);
        doc.text('Příjemce se zavazuje zajistit v rámci konání akce ' + this.state.action, 10, 115);
        doc.text('přepravu na utkání: ', 10, 120);

        var data = [];
        var sum = 0;
        for (var i = 0; i < this.state.transits.length; i++) {
            var t = this.state.transits[i];
            var record = this.data[t.to.value];
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

        var offset = 145 + this.state.transits.length * 10;
        doc.text('II.', 100, offset);
        doc.text('Klub šachistů Říčany 1925 se zavazuje vyplatit příjemci příspěvek na cestovní výdaje', 10, offset = offset + 10);
        doc.text('(§4 odst. 1, písm. k zákona č. 586/1992 Sb.) v souvislosti s používáním osobního', 10, offset = offset + 5);
        doc.text('automobilu ve výši 3,50 Kč(*) za ujetý kilometr tj. celkem: ' + sum + ',- Kč', 10, offset = offset + 5);

        doc.text('...............................', 30, offset = offset + 20);
        doc.text('...............................', 130, offset);
        doc.setFontSize(10);
        doc.text('Podpis příjemce', 35, offset = offset + 5);
        doc.text('Podpis zástupce z.s.', 135, offset);
        doc.text('(*) schváleno valnou hromadou dne 23.1.2015', 10, 280);
        doc.save('cestovni-nahrady.pdf');
    }

    handleAddTransit() {
        this.setState({
            transits: this.state.transits.concat([{ date: "", from: "Říčany", to: null }])
        });
    }

    handleRemoveTransit(idx) {
        this.setState({
            transits: this.state.transits.filter((s, sidx) => idx !== sidx)
        });
    }

    handleTransitDateChange(idx, value) {
        this.setState(state => {
            const list = state.transits.map((item, j) => {
                if (j === idx) {
                    return item.date = value;
                } else {
                    return item;
                }
            });
            return {
                list,
            };
        });
    }

    handleTransitToChange(idx, value) {
        this.setState(state => {
            const list = state.transits.map((item, j) => {
                if (j === idx) {
                    return item.to = value;
                } else {
                    return item;
                }
            });
            return {
                list,
            };
        });
    }

    render() {
        return (
            <form>
                <div className="form-group">
                    <div className="form-row">
                        <div className="col">
                            <label htmlFor="name">Jméno a příjmení</label>
                            <input type="text" id="name" className="form-control input-md" value={this.state.name} onChange={(e) => this.handleOnChange(e)} placeholder="Zde vyplňte jméno" />
                        </div>
                        <div className="col">
                            <label htmlFor="address">Adresa bydliště</label>
                            <input type="text" id="address" className="form-control input-md" value={this.state.address} onChange={(e) => this.handleOnChange(e)} placeholder="Zde vyplňte bydliště" />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="form-row">
                        <div className="col-md-3 mb-3">
                            <label htmlFor="contractDate">Datum smlouvy</label>
                            <input type="text" id="contractDate" className="form-control input-md" value={this.state.contractDate} onChange={(e) => this.handleOnChange(e)} placeholder="Zde vyplňte datum" />
                            <small className="form-text text-muted">Typicky dnešní datum</small>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="account">Číslo účtu</label>
                            <input type="text" id="account" className="form-control input-md" value={this.state.account} onChange={(e) => this.handleOnChange(e)} placeholder="Zde vyplňte číslo účtu" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="action">Událost</label>
                            <input type="text" id="action" className="form-control input-md" value={this.state.action} onChange={(e) => this.handleOnChange(e)} placeholder="Zde vyplňte událost" />
                            <small className="form-text text-muted">Událost, akce nebo soutěž, které se smlouva týká</small>
                        </div>
                    </div>
                </div>

                {this.state.transits.map((transit, idx) => (
                    <div className="form-group" key={`divTransit${idx}`}>
                        <div className="form-row">
                            <div className="col-md-1 mb-3">
                                <label>{`#${idx + 1}`}</label>
                            </div>
                            <div className="col-md-3 mb-3">
                                <input type="text" id={`transitDate${idx}`} className="form-control input-md" value={transit.date} onChange={(e) => this.handleTransitDateChange(idx, e.target.value)} placeholder="Datum přepravy" />
                            </div>
                            <div className="col-md-2 mb-3">
                                <input type="text" id={`transitFrom${idx}`} className="form-control input-md" value={transit.from} readOnly />
                            </div>

                            <div className="col-md-3 mb-3">
                                <Select value={transit.to} onChange={(e) => this.handleTransitToChange(idx, e)} options={this.getDistances()} placeholder="Vyberte cíl" />
                            </div>
                            <div className="col-md-3 mb-3">
                                <button type="button" id={`transitRemove${idx}`} onClick={() => this.handleRemoveTransit(idx)} className="btn btn-primary">Odebrat</button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="form-group">
                    <div className="form-row">
                        <button type="button" className="btn btn-primary" onClick={() => this.handleAddTransit()}>Přidat přepravu</button>
                    </div>
                </div>

                <div className="form-group">
                    <div className="form-row">
                        <button type="button" className="btn btn-success" onClick={() => this.handleGeneratePdf()}>PDF Smlouva</button>
                    </div>
                </div>

            </form >
        );
    }
}