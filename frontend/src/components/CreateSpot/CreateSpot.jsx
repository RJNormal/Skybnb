import { useState } from "react";
import { useDispatch} from "react-redux";
import { useNavigate} from "react-router-dom";
import { createSpot } from "../../store/spots";

const CreateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
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
    if (!formData.country) validationErrors.country = "Country is required.";
    if (!formData.address) validationErrors.address = "Street Address is required.";
    if (!formData.city) validationErrors.city = "City is required.";
    if (!formData.state) validationErrors.state = "State is required.";
    if (formData.description.length < 30)
      validationErrors.description = "Description needs 30 or more characters.";
    if (!formData.name) validationErrors.name = "Spot name is required.";
    if (!formData.price || formData.price <= 0)
      validationErrors.price = "Price must be a positive number.";
    if (!formData.previewImage)
      validationErrors.previewImage = "A preview image URL is required.";
    
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
      previewImage: formData.previewImage,
      images: [formData.image1, formData.image2, formData.image3, formData.image4].filter(img => img)
    };

    const createdSpot = await dispatch(createSpot(newSpot));
    
    if (createdSpot?.id) {
      navigate(`/spots/${createdSpot.id}`);
    }
  };

  return (
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
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
        <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />

     
        <h2>Describe your place to guests</h2>
        <textarea name="description" placeholder="Please write at least 30 characters" value={formData.description} onChange={handleChange} />

 
        <h2>Create a title for your spot</h2>
        <input type="text" name="name" placeholder="Name of your spot" value={formData.name} onChange={handleChange} />

   
        <h2>Set a base price for your spot</h2>
        <input type="number" name="price" placeholder="Price per night (USD)" value={formData.price} onChange={handleChange} />


        <h2>Liven up your spot with photos</h2>
        <input type="text" name="previewImage" placeholder="Preview Image URL" value={formData.previewImage} onChange={handleChange} />
        <input type="text" name="image1" placeholder="Image URL" value={formData.image1} onChange={handleChange} />
        <input type="text" name="image2" placeholder="Image URL" value={formData.image2} onChange={handleChange} />
        <input type="text" name="image3" placeholder="Image URL" value={formData.image3} onChange={handleChange} />
        <input type="text" name="image4" placeholder="Image URL" value={formData.image4} onChange={handleChange} />


        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;