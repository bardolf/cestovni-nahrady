import React from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import { data } from './data.js'
import { loadState, saveState } from '../localStorage';

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

        data.sort();
        this.distances = [];
        for (var i = 0; i < data.length; i++) {
            this.distances.push({ label: data[i].club, value: i });
        }
    }

    getDistances() {
        return this.distances;
    };

    handleOnChange(event) {
        if (event.target.id == "contractDate") {
            this.setState({ contractDate: event.target.value });
        } else if (event.target.id == "name") {
            this.setState({ name: event.target.value });
        } else if (event.target.id == "address") {
            this.setState({ address: event.target.value });
        } else if (event.target.id == "account") {
            this.setState({ account: event.target.value });
        } else if (event.target.id == "action") {
            this.setState({ action: event.target.value });
        }
    }

    handleGeneratePdf() {
        saveState(this.state);
        var doc = new jsPDF();
        doc.text(this.state.contractDate, 10, 10);

        // doc.save("cestovni-nahrady.pdf");                
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
                            <label htmlFor="account">Číslo smlouvy</label>
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