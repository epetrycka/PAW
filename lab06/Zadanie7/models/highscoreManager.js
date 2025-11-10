export class HighscoreManager {
    constructor(npointHash) {
        if (!npointHash) {
            console.error("Brak hasha. Ranking będzie wyłączony.");
            this.url = null;
        } else {
            this.url = `https://api.npoint.io/${npointHash}`;
        }
    }

    async fetchScores() {
        if (!this.url) return [];
        try {
            const response = await fetch(this.url);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.error("Błąd pobierania rankingu:", e);
            return [];
        }
    }

    async saveScores(scores) {
        if (!this.url) return;
        try {
            await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(scores)
            });
        } catch (e) {
            console.error("Błąd zapisywania rankingu:", e);
        }
    }

    async processNewScore(nick, score) {
        const scores = await this.fetchScores();
        console.log(scores);
        const existingScoreIndex = scores.findIndex(
            entry => entry.nick.toLowerCase() === nick.toLowerCase()
        );

        if (existingScoreIndex > -1) {
            const existingScore = scores[existingScoreIndex];
            
            if (score > existingScore.score) {
                existingScore.score = score;
                existingScore.date = new Date().toLocaleDateString('pl-PL');
                console.log(`Nowy rekord dla ${nick}! Wynik: ${score}`);
            } else {
                console.log(`Wynik ${score} nie pobił rekordu ${nick} (${existingScore.score})`);
            }

        } else {
            const newEntry = {
                nick: nick,
                score: score,
                date: new Date().toLocaleDateString('pl-PL')
            };
            scores.push(newEntry);
            console.log(`Nowy gracz ${nick} dodany z wynikiem ${score}`);
        }
        
        scores.sort((a, b) => b.score - a.score);

        const top7 = scores.slice(0, 7);

        await this.saveScores(top7);
        
        return top7;
    }

    displayScores(scores, listElement) {
        listElement.innerHTML = '';
        if (scores.length === 0) {
            listElement.innerHTML = "<li>Brak wyników. Bądź pierwszy!</li>";
            return;
        }

        scores.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${index + 1}.</span>
                <span>${entry.nick}</span>
                <span>${entry.score} pkt</span>
                <span>(${entry.date})</span>
            `;
            listElement.appendChild(li);
        });
    }
}