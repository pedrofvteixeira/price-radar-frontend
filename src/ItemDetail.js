import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import './ItemDetail.css';

const ItemDetail = () => {
  const [itemDetails, setItemDetails] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/api/v1/items/${id}`)
      .then(response => setItemDetails(response.data))
      .catch(error => console.error('There was an error fetching the item details:', error));
  }, [id]);

  const getLatestPrice = (prices) => {
    if (!prices || prices.length === 0) return "N/A";
    const sortedPrices = [...prices].sort((a, b) => b.id.created_at - a.id.created_at);
    return sortedPrices[0].price_in_eur;
  };

  const priceData = itemDetails ? {
    labels: itemDetails.prices.map(price => new Date(price.id.created_at * 1000).toLocaleDateString()),
    datasets: [{
      label: 'Price History',
      data: itemDetails.prices.sort((a, b) => a.id.created_at - b.id.created_at).map(price => price.price_in_eur),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  } : {};

  return (
    <div className="item-detail-container">
      {itemDetails ? (
        <div>
          <div className="header-section">
            <button className="go-back-btn" onClick={() => navigate('/')}>
            <img src={`${process.env.PUBLIC_URL}/back.webp`} alt="Go back" />
            </button>
            <div className="item-details">
              <h2 className="item-name">{itemDetails.name}</h2>
              <div className="tags">
                <span className="tag">{itemDetails.category.group}</span>
                <span className="tag">{itemDetails.category.subgroup}</span>
              </div>
            </div>
          </div>
          <div className="latest-price">
            <span className="price-value">€{getLatestPrice(itemDetails.prices)}</span>
            <span className="price-value-dot-a" />
            <span className="price-value-dot-b" />
          </div>
          <div className="chart-container">
            {itemDetails.prices && itemDetails.prices.length > 0 && (
              <Line data={priceData} />
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ItemDetail;
