import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemList.css';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState([]);

  const navigate = useNavigate();

  const handleItemClick = (id) => {
        navigate(`/items/${id}`);
  };

  const getLatestDate = (prices) => {
      if (prices.length === 0) return "N/A";
      const latest = prices.sort((a, b) => b.id.created_at - a.id.created_at)[0];
      return new Date(latest.id.created_at * 1000).toLocaleDateString({}, {day: "2-digit", month: "short", year: "numeric", timeZone: "UTC"});
  };

  const getLatestPrice = (prices) => {
      if (prices.length === 0) return "N/A";
      const latest = prices.sort((a, b) => b.id.created_at - a.id.created_at)[0];
      return latest.price_in_eur;
  };

  // Fetch all distinct group names
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/api/v1/categories/groups/distinct`)
      .then(response => setGroups(response.data))
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  // Fetch subgroups whenever a group is selected
  useEffect(() => {
    if (selectedGroup) {
      axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/api/v1/categories/groups/${selectedGroup}`)
        .then(response => setSubgroups(response.data))
        .catch(error => console.error('Error fetching subgroups:', error));
    }
  }, [selectedGroup]);

  // Fetch items based on the selected group and subgroup
  useEffect(() => {
    if (selectedGroup && selectedSubgroup) {
      axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/api/v1/items`, { params: { group: selectedGroup, subgroup: selectedSubgroup }})
        .then(response => setItems(response.data))
        .catch(error => console.error('Error fetching items:', error));
    } else if (selectedGroup) {
      axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/api/v1/items`, { params: { group: selectedGroup }})
        .then(response => setItems(response.data))
        .catch(error => console.error('Error fetching items:', error));
    } else {
      axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/api/v1/items`)
         .then(response => setItems(response.data))
         .catch(error => console.error('Error fetching items:', error));
      }
  }, [selectedGroup, selectedSubgroup]);

  return (
    <div>
      <div className="dropdowns-container">
          <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
            <option value="">Group</option>
            {groups.map(group => <option key={group} value={group}>{group}</option>)}
          </select>
          <select value={selectedSubgroup} onChange={e => setSelectedSubgroup(e.target.value)} disabled={!selectedGroup}>
            <option value="">Subgroup</option>
            {subgroups.map(subgroup => <option key={subgroup.id} value={subgroup.subgroup}>{subgroup.subgroup}</option>)}
          </select>
      </div>
      {items.map(item => (
        <div key={item.id} className="item" onClick={() => handleItemClick(item.id)}>
          <h3>{item.name}</h3>
          <div className="tags">
            <span className="tag">{item.category.group}</span>
            <span className="tag">{item.category.subgroup}</span>
          </div>
          <div className="price">
            €{getLatestPrice(item.prices)}
            <span className="price-date">({getLatestDate(item.prices)})</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
