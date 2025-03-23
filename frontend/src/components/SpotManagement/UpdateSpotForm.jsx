import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [spotData, setSpotData] = useState(null);
  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    name: "",
    price: "",
    previewImage: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });

  useEffect(() => {
    
    fetch(`/api/spots/:spotID`)
      .then(res => res.json())
      .then(data => {
        setSpotData(data);
        setFormData({
          country: data.country,
          address: data.address,
          city: data.city,
          state: data.state,
          name: data.name,
          description : data.description,
          price: data.price,
        });
      });
  }, [spotId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!formData.country.trim()) validationErrors.country = "Country is required.";
    if (!formData.address.trim()) validationErrors.address = "Street Address is required.";
    if (!formData.city.trim()) validationErrors.city = "City is required.";
    if (!formData.state.trim()) validationErrors.state = "State is required.";
    if (formData.description.length < 30)
      validationErrors.description = "Description needs 30 or more characters.";
    if (!formData.name.trim()) validationErrors.name = "Spot name is required.";
    if (!formData.price || formData.price <= 0)
      validationErrors.price = "Price must be a positive number.";
    if (!formData.previewImage.trim())
      validationErrors.previewImage = "A preview image URL is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate(`/spots/${spotId}`);
    } else {
      console.error("Failed to update spot.");
    }
  };

  if (!spotData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Update Your Spot</h1>
      <form onSubmit={handleSubmit}>
      <input 
    type="text" 
    name="country" 
    placeholder="Country" 
    value={formData.country} 
    onChange={handleChange} 
  />
  {errors.country && <p className="error">{errors.country}</p>}  

  <input 
    type="text" 
    name="address" 
    placeholder="Street Address" 
    value={formData.address} 
    onChange={handleChange} 
  />
  {errors.address && <p className="error">{errors.address}</p>} 

  <input 
    type="text" 
    name="city" 
    placeholder="City" 
    value={formData.city} 
    onChange={handleChange} 
  />
  {errors.city && <p className="error">{errors.city}</p>} 

  <input 
    type="text" 
    name="state" 
    placeholder="State" 
    value={formData.state} 
    onChange={handleChange} 
  />
  {errors.state && <p className="error">{errors.state}</p>} 

  <textarea 
    name="description" 
    placeholder="Please write at least 30 characters" 
    value={formData.description} 
    onChange={handleChange} 
  />
  {errors.description && <p className="error">{errors.description}</p>} 

  <input 
    type="text" 
    name="name" 
    placeholder="Name of your spot" 
    value={formData.name} 
    onChange={handleChange} 
  />
  {errors.name && <p className="error">{errors.name}</p>} 

  <input 
    type="number" 
    name="price" 
    placeholder="Price per night (USD)" 
    value={formData.price} 
    onChange={handleChange} 
  />
  {errors.price && <p className="error">{errors.price}</p>} 
      </form>
    </div>
  );
};

export default UpdateSpotForm;