class DeckOfCards {
    constructor() {
      this.suits = ["♠", "♥", "♦", "♣"];
      this.ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
      this.deck = this.generateDeck();
      this.shuffleDeck();
    }
  
    generateDeck() {
      const deck = [];
      for (const suit of this.suits) {
        for (const rank of this.ranks) {
          const card = {
            suit,
            rank
          }
          deck.push(card);
        }
      }
      return deck;
    }
  
    shuffleDeck() {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    }
  
    getDeck() {
      return this.deck;
    }
  }

  module.exports = DeckOfCards