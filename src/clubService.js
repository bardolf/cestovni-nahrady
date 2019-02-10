import data from './clubs.json';

class ClubService {
    constructor() {
        this.clubs = data.data.sort(function (a, b) {
            if (a.club < b.club) { return -1; }
            if (a.club > b.club) { return 1; }
            return 0;
        });
        this.map = [];
        for (var i = 0; i < this.clubs.length; i++) {
            this.map[this.clubs[i].club] = { club: this.clubs[i].club, city: this.clubs[i].city, distance: this.clubs[i].distance, address: this.clubs[i].address};
        }
    }

    getClubs() {
        return this.clubs;
    }

    getClub(club) {
        return this.map[club];
    }

    getDistance(club) {
        return this.map[club].distance;
    }

    getCity(club) {
        return this.map[club].city;
    }
}


const clubService = new ClubService();
Object.freeze(clubService);

export default clubService;

