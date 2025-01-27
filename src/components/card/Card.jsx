import React, { useContext, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DataContext } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import './Card.css';

function Card() {
  const data = useContext(DataContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [cards, setCards] = useState([
    { id: 'topGainers', title: 'Top Gainers', content: [] },
    { id: 'topLosers', title: 'Top Losers', content: [] },
  ]);

  const [removedCards, setRemovedCards] = useState([]);

  useEffect(() => {
    if (data) {
      const topGainers = [...data]
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 3);

      const topLosers = [...data]
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 3);

      setCards([
        { id: 'topGainers', title: 'Top Gainers', content: topGainers },
        { id: 'topLosers', title: 'Top Losers', content: topLosers },
      ]);
    }
  }, [data]);

  const handleCoinClick = (coin) => {
    navigate('/coins', { state: { row: coin } });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedCards = Array.from(cards);
    const [movedCard] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, movedCard);

    setCards(reorderedCards);
  };

  const addCard = (id) => {
    const cardToAdd = removedCards.find(card => card.id === id);
    if (cardToAdd) {
      setCards([...cards, cardToAdd]);
      setRemovedCards(removedCards.filter(card => card.id !== id));
    }
  };

  const removeCard = (id) => {
    const cardToRemove = cards.find(card => card.id === id);
    setCards(cards.filter(card => card.id !== id));
    setRemovedCards([...removedCards, cardToRemove]);
  };

  return (
    <div className={`card-container ${theme}`}>
      <div className={`add-card-dropdown ${theme}`}>
        <button className="add-card-button">Add Card</button>
        <div className="dropdown-content">
          {removedCards.map(card => (
            <button key={card.id} onClick={() => addCard(card.id)}>
              {card.title}
            </button>
          ))}
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards" direction="horizontal">
          {(provided) => (
            <div className="cards-container" {...provided.droppableProps} ref={provided.innerRef}>
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`card ${theme}`}
                    >
                      <div className="card-header">
                        <h2>{card.title}</h2>
                        <button className="remove-card-button" onClick={() => removeCard(card.id)}>X</button>
                      </div>
                      {card.content.map((coin) => (
                        <div key={coin.id} className="coin" onClick={() => handleCoinClick(coin)}>
                          <img src={coin.image} alt={coin.name} />
                          <div className="coin-details">
                            <h3>{coin.name}</h3>
                            <p>{coin.symbol.toUpperCase()}</p>
                            <p>Price: ${coin.current_price.toLocaleString()}</p>
                            <p>Change: {coin.price_change_percentage_24h.toFixed(2)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Card;