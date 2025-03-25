import { useState, useEffect } from "react";
import { csrfFetch } from "../../store/csrf";
import './UpdateSpotForm.css';
import { useNavigate } from 'react-router-dom';

function UpdateSpotFormModal({ spotData}) {
    const [name, setName] = useState(spotData?.name || "");
    const [city, setCity] = useState(spotData?.city || "");
    const [state, setState] = useState(spotData?.state || "");
    const [description, setDescription] = useState(spotData?.description || "");
    const [price, setPrice] = useState(spotData?.price || "");
    const [country, setCountry] = useState(spotData?.country || "");
    const [address, setAddress] = useState(spotData?.address || "");
    const [lat, setLat] = useState(spotData?.lat || 0);
    const [lng, setLng] = useState(spotData?.lng || 0);
    const [previewImage, setPreviewImage] = useState(spotData?.previewImage || "");
    const [image1, setImage1] = useState(spotData?.images?.[0] || "");
    const [image2, setImage2] = useState(spotData?.images?.[1] || "");
    const [image3, setImage3] = useState(spotData?.images?.[2] || "");
    const [image4, setImage4] = useState(spotData?.images?.[3] || "");
    const [errors, setErrors] = useState({});
    const spotId = spotData.id;
    const navigate = useNavigate()
  
    useEffect(() => {
      if (spotData) {
        setName(spotData.name);
        setCity(spotData.city);
        setState(spotData.state);
        setDescription(spotData.description);
        setPrice(spotData.price);
        setCountry(spotData.country);
        setAddress(spotData.address);
        setLat(spotData.lat);
        setLng(spotData.lng);
        setPreviewImage(spotData.previewImage);
        setImage1(spotData.images?.[0]);
        setImage2(spotData.images?.[1]);
        setImage3(spotData.images?.[2]);
        setImage4(spotData.images?.[3]);
      }
    }, [spotData]);
  
    const handleSubmit = async (e) => {
      e.preventDefault(); 
  
      
      const spotData = {
        country,
        address,
        city,
        state,
        description,
        name,
        price: parseFloat(price),
        lat: parseFloat(lat) || 0,
        lng: parseFloat(lng) || 0,
        previewImage,
        images: [image1, image2, image3, image4].filter(img => img) 
      };

  
    try {
      
      const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spotData),
      });
  
      if (!response.ok) {
        
        throw new Error('Failed to update the spot');
      }
  
      const updatedSpot = await response.json(); 
   

      
      
      navigate(`/spots/${updatedSpot.id}`);

      window.location.reload
  
    } catch (err) {
      console.error('Error updating spot:', err);
      
      setErrors({ general: 'Failed to update the spot' });
    }
  };
  return (
    <>
      <h1>Update Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p>{errors.name}</p>}

        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        {errors.city && <p>{errors.city}</p>}

        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        {errors.state && <p>{errors.state}</p>}

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        {errors.description && <p>{errors.description}</p>}

        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        {errors.price && <p>{errors.price}</p>}

        <button type="submit">Update Spot</button>
      </form>
    </>
  );
}

export default UpdateSpotFormModal;