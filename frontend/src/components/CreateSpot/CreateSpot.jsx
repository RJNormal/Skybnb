import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpotThunk } from "../../store/spots"; 
import './CreateSpot.css';

const CreateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const imageRegex = /\.(jpg|jpeg|png)$/i;
  const imageFields = ['image1', 'image2', 'image3', 'image4'];
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
        imageFields.forEach((field) => {
    if (formData[field] && !imageRegex.test(formData[field])) {
      validationErrors[field] = 'Image URL needs to end in png, jpg, or jpeg';
    }
  });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newSpot = {
      country: formData.country,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      description: formData.description,
      name: formData.name,
      price: parseFloat(formData.price),
      lat: parseFloat(formData.lat) || 0,   
      lng: parseFloat(formData.lng) || 0,   
      previewImage: formData.previewImage,  
      images: [formData.image1, formData.image2, formData.image3, formData.image4].filter(img => img)  
    };

    console.log("Creating spot with data:", newSpot); 

    const createdSpot = await dispatch(createSpotThunk(newSpot)); 
    
    console.log("Created spot response:", createdSpot); 
    
    if (createdSpot && createdSpot.id) {
      navigate(`/spots/${createdSpot.id}`);
    } else {
      setErrors({ general: "Failed to create spot. Please try again." });
    }
  };

  return (
    <div className="create-spot-wrapper">
    <div className="create-spot">
      <h1>Create a New Spot</h1>
      {Object.values(errors).length > 0 && (
        <div className="errors">
          {Object.values(errors).map((error, i) => <p key={i}>{error}</p>)}
        </div>
      )}
      
      
      <form onSubmit={handleSubmit}>
  <h2>Where is your place located?</h2>
  <p>Guests will only get your exact address once they book a reservation.</p>
  
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

  <input 
    type="text" 
    name="previewImage" 
    placeholder="Preview Image URL" 
    value={formData.previewImage} 
    onChange={handleChange} 
  />
  {errors.previewImage && <p className="error">{errors.previewImage}</p>} 

  <input 
    type="text" 
    name="image1" 
    placeholder="Image URL" 
    value={formData.image1} 
    onChange={handleChange} 
  />
  {errors.image1 && <p className="error">{errors.image1}</p>} 

  <input 
    type="text" 
    name="image2" 
    placeholder="Image URL" 
    value={formData.image2} 
    onChange={handleChange} 
  />
  {errors.image2 && <p className="error">{errors.image2}</p>} 

  <input 
    type="text" 
    name="image3" 
    placeholder="Image URL" 
    value={formData.image3} 
    onChange={handleChange} 
  />
  {errors.image3 && <p className="error">{errors.image3}</p>} 

  <input 
    type="text" 
    name="image4" 
    placeholder="Image URL" 
    value={formData.image4} 
    onChange={handleChange} 
  />
  {errors.image4 && <p className="error">{errors.image4}</p>} 

  <button type="submit">Create Spot</button>
</form>
    </div>
    </div>
  );
};

export default CreateSpot;