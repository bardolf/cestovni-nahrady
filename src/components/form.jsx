import React from 'react';
import jsPDF from 'jspdf';

export default class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contractDate: '',
            name: '',
            address: '',
            account: '',
            transits: []
        };
    }

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

    handleSubmit(event) {
        var doc = new jsPDF();
        doc.text(this.state.contractDate, 10, 10);
        doc.save("cestovni-nahrady.pdf");
        event.preventDefault();
    }

    handleAddTransit() {
        this.setState({
            transits: this.state.transits.concat([{ date: "", from: "Říčany", to: "" }])
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

    render() {
        return (
            <form onSubmit={() => this.handleSubmit()}>
                <div className="form-group">
                    <div className="form-row">
                        <div class="col">
                            <input type="text" id="name" className="form-control input-md" value={this.state.name} onChange={(e) => this.handleOnChange(e)} placeholder="Jméno" />
                        </div>
                        <div class="col">
                            <input type="text" id="address" className="form-control input-md" value={this.state.address} onChange={(e) => this.handleOnChange(e)} placeholder="Adresa bydliště" />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="form-row">
                        <div class="col-md-3 mb-3">
                            <input type="text" id="contractDate" className="form-control input-md" value={this.state.contractDate} onChange={(e) => this.handleOnChange(e)} placeholder="Datum" />
                            <small className="form-text text-muted">Datum smlouvy, typicky dnešní datum</small>
                        </div>
                        <div class="col-md-3 mb-3">
                            <input type="text" id="account" className="form-control input-md" value={this.state.account} onChange={(e) => this.handleOnChange(e)} placeholder="Číslo účtu" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <input type="text" id="action" className="form-control input-md" value={this.state.action} onChange={(e) => this.handleOnChange(e)} placeholder="Událost" />
                            <small className="form-text text-muted">Událost, akce nebo soutěž, které se smlouva týká</small>
                        </div>
                    </div>
                </div>


                {this.state.transits.map((transit, idx) => (
                    <div className="form-group" key={`divTransit${idx}`}>
                        <label>{`Přeprava #${idx + 1}`}</label>
                        <div className="form-row">
                            <div class="col-md-3 mb-3">
                                <input type="text" id={`transitDate${idx}`} className="form-control input-md" value={transit.date} onChange={(e) => this.handleTransitDateChange(idx, e.target.value)} placeholder="Datum přepravy" />
                            </div>
                            <div class="col-md-3 mb-3">
                                <input type="text" id={`transitFrom${idx}`} className="form-control input-md" value={transit.from} readonly />
                            </div>
                            <div class="col-md-3 mb-3">
                                
                            </div>

                        </div>
                        <button type="button" id={`transitRemove${idx}`} onClick={() => this.handleRemoveTransit(idx)} className="small">Odebrat přepravu</button>
                    </div>
                ))}

                <button type="button" onClick={() => this.handleAddTransit()} className="small">Přidat přepravu</button>


                <button type="submit" className="btn btn-primary">Smlouva</button>


            </form >
        );
    }
}