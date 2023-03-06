import React, { useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import StudyDeck from "../deckComponents/StudyDeck";
import CreateDeck from "../deckComponents/CreateDeck";
import CreateCard from "../cardComponents/CreateCard";
import DeckView from "../deckComponents/DeckView";
import Home from "./Home";
import { useHistory, Switch, Route } from "react-router-dom";
import { listDecks } from "../utils/api";

function Layout() {
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState([]);

  const history = useHistory();

  useEffect(() => {
    setDecks([]);

    const abortController = new AbortController();

    async function loadDecks() {
      try {
        const deckList = await listDecks();
        setDecks(deckList);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          throw error;
        }
      }
    }
    loadDecks();

    return () => abortController.abort();
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Home decks={decks} />
          </Route>
          <Route exact path="/decks/new">
            <CreateDeck />
          </Route>
          <Route path="/decks/:deckId/edit">
            <CreateDeck deck={deck} setDeck={setDeck} />
          </Route>
          <Route path="/decks/:deckId/study">
            <StudyDeck />
          </Route>
          <Route exact path="/decks/:deckId">
            <DeckView deck={deck} setDeck={setDeck} />
          </Route>
          <Route path="/decks/:deckId/cards/new">
            <CreateCard />
          </Route>
          <Route path="/decks/:deckId/cards/:cardId/edit">
            <CreateCard />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Layout;

/* TODO: 
        display create deck button, route to create deck screen
        deckList should display all existing decks here
          decks should have 
            study option that routes to study screen
            view option that routes to deckview screen
            delete option that displays a warning then deletes the deck
*/
