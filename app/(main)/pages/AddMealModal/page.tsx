'use client';
import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

interface AddMealModalProps {
  visible: boolean;
  onHide: () => void;
  onAdded?: () => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({ visible, onHide, onAdded }) => {
  const [foodName, setFoodName] = useState('');
  const [foodRating, setFoodRating] = useState<number | null>(null);
  const [foodImage, setFoodImage] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLogo, setRestaurantLogo] = useState('');
  const [restaurantStatus, setRestaurantStatus] = useState<'Open Now' | 'Closed'>('Open Now');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const statusOptions = [
    { label: 'Open Now', value: 'Open Now' },
    { label: 'Closed', value: 'Closed' },
  ];

  const isValidImageUrl = (url: string) => /^(http|https):\/\/[^ "]+$/.test(url);

  const handleSubmit = async () => {
    setSubmitted(true);

    const hasError =
      !foodName ||
      !foodRating ||
      foodRating < 1 ||
      foodRating > 5 ||
      !foodImage ||
      !isValidImageUrl(foodImage) ||
      !restaurantName ||
      !restaurantLogo ||
      !isValidImageUrl(restaurantLogo) ||
      !restaurantStatus;

    if (hasError) return;

    setLoading(true);

    const payload = {
      name: foodName,
      rating: foodRating,
      image: foodImage,
      restaurant: {
        name: restaurantName,
        logo: restaurantLogo,
        status: restaurantStatus,
      },
    };

    try {
      const res = await fetch('https://6852821e0594059b23cdd834.mockapi.io/Food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to add food');
      await res.json();

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Food added successfully!', life: 3000 });
      handleReset();
      onAdded?.();
    } catch (err) {
      console.error(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add food.', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFoodName('');
    setFoodRating(null);
    setFoodImage('');
    setRestaurantName('');
    setRestaurantLogo('');
    setRestaurantStatus('Open Now');
    setSubmitted(false);
    setLoading(false);
    onHide();
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Add Food"
        visible={visible}
        style={{ width: '450px', animation: 'slide-up 0.3s ease-out' }}
        modal
        onHide={handleReset}
      >
        <div className="p-fluid">
          {/* Food Name */}
          <div className="field">
            <label htmlFor="food_name">Food Name<span className="text-red-500 font-bold">*</span></label>
            <InputText
              id="food_name"
              name="food_name"
              value={foodName}
              placeholder="Enter food name"
              aria-describedby="food-name-error"
              onChange={(e) => setFoodName(e.target.value)}
              className={classNames('food-input', { 'p-invalid': submitted && !foodName })}
            />
            {submitted && !foodName && (
              <small id="food-name-error" className="p-error">Food Name is required</small>
            )}
          </div>

          {/* Food Rating */}
          <div className="field">
            <label htmlFor="food_rating">Food Rating<span className="text-red-500 font-bold">*</span></label>
            <InputNumber
              id="food_rating"
              name="food_rating"
              value={foodRating}
              placeholder="Enter food rating (1–5)"
              aria-describedby="food-rating-error"
              min={1}
              max={5}
              showButtons
              onValueChange={(e) => setFoodRating(e.value as number)}
              className={classNames('food-input', { 'p-invalid': submitted && (!foodRating || foodRating < 1 || foodRating > 5) })}
            />
            {submitted && (!foodRating || foodRating < 1 || foodRating > 5) && (
              <small id="food-rating-error" className="p-error">Food Rating must be a number between 1 and 5</small>
            )}
          </div>

          {/* Food Image URL */}
          <div className="field">
            <label htmlFor="food_image">Food Image URL<span className="text-red-500 font-bold">*</span></label>
            <InputText
              id="food_image"
              name="food_image"
              value={foodImage}
              placeholder="Enter food image URL"
              aria-describedby="food-image-error"
              onChange={(e) => setFoodImage(e.target.value)}
              className={classNames('food-input', { 'p-invalid': submitted && (!foodImage || !isValidImageUrl(foodImage)) })}
            />
            {submitted && (!foodImage || !isValidImageUrl(foodImage)) && (
              <small id="food-image-error" className="p-error">Food Image URL is required and must be valid</small>
            )}
          </div>

          {/* Restaurant Name */}
          <div className="field">
            <label htmlFor="restaurant_name">Restaurant Name<span className="text-red-500 font-bold">*</span></label>
            <InputText
              id="restaurant_name"
              name="restaurant_name"
              value={restaurantName}
              placeholder="Enter restaurant name"
              aria-describedby="restaurant-name-error"
              onChange={(e) => setRestaurantName(e.target.value)}
              className={classNames('food-input', { 'p-invalid': submitted && !restaurantName })}
            />
            {submitted && !restaurantName && (
              <small id="restaurant-name-error" className="p-error">Restaurant Name is required</small>
            )}
          </div>

          {/* Restaurant Logo URL */}
          <div className="field">
            <label htmlFor="restaurant_logo">Restaurant Logo URL<span className="text-red-500 font-bold">*</span></label>
            <InputText
              id="restaurant_logo"
              name="restaurant_logo"
              value={restaurantLogo}
              placeholder="Enter restaurant logo URL"
              aria-describedby="restaurant-logo-error"
              onChange={(e) => setRestaurantLogo(e.target.value)}
              className={classNames('food-input', { 'p-invalid': submitted && (!restaurantLogo || !isValidImageUrl(restaurantLogo)) })}
            />
            {submitted && (!restaurantLogo || !isValidImageUrl(restaurantLogo)) && (
              <small id="restaurant-logo-error" className="p-error">Restaurant Logo URL is required and must be valid</small>
            )}
          </div>

          {/* Restaurant Status */}
          <div className="field">
            <label htmlFor="restaurant_status">Restaurant Status<span className="text-red-500 font-bold">*</span></label>
            <Dropdown
              id="restaurant_status"
              name="restaurant_status"
              value={restaurantStatus}
              options={statusOptions}
              placeholder="Select food status"
              aria-describedby="restaurant-status-error"
              onChange={(e) => setRestaurantStatus(e.value)}
              className={classNames('food-input', { 'p-invalid': submitted && !restaurantStatus })}
            />
            {submitted && !restaurantStatus && (
              <small id="restaurant-status-error" className="p-error">Restaurant Status must be ‘Open Now’ or ‘Closed’</small>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-content-end mt-4 gap-2">
            <Button
              label={loading ? 'Adding Food...' : 'Add Food'}
              icon="pi pi-plus"
              loading={loading}
              className="p-button-success p-button-rounded p-button-outlined"
              onClick={handleSubmit}
              disabled={loading}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-danger p-button-rounded p-button-outlined"
              onClick={handleReset}
              disabled={loading}
            />
          </div>
        </div>
      </Dialog>

      {/* ✅ Slide-up Animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AddMealModal;
