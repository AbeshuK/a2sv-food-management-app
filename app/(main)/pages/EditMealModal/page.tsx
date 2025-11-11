'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Food } from '@/types/food';

interface EditMealModalProps {
  visible: boolean;
  food: Food | null;
  onHide: () => void;
  onAdded?: () => void;
}

const EditMealModal: React.FC<EditMealModalProps> = ({ visible, food, onHide, onAdded }) => {
  const [foodName, setFoodName] = useState('');
  const [foodRating, setFoodRating] = useState<number | null>(null);
  const [foodImage, setFoodImage] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLogo, setRestaurantLogo] = useState('');
  const [restaurantStatus, setRestaurantStatus] = useState<'Open Now' | 'Closed' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const statusOptions = [
    { label: 'Open Now', value: 'Open Now' },
    { label: 'Closed', value: 'Closed' },
  ];

  useEffect(() => {
    if (food) {
      setFoodName(food.name || '');
      setFoodRating(Number(food.rating) || null);
      setFoodImage(food.image || '');
      setRestaurantName(food.restaurantName || '');
      setRestaurantLogo(food.restaurant_logo || '');
      setRestaurantStatus(food.restaurant_status === 'Open Now' ? 'Open Now' : 'Closed');
    }
  }, [food]);

  const isValidURL = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (
      !foodName ||
      !foodRating ||
      foodRating < 1 ||
      foodRating > 5 ||
      !foodImage ||
      !isValidURL(foodImage) ||
      !restaurantName ||
      !restaurantLogo ||
      !isValidURL(restaurantLogo) ||
      !restaurantStatus
    ) {
      return;
    }

    if (!food) return;

    const payload = {
      name: foodName,
      rating: foodRating,
      image: foodImage,
      restaurantName,
      restaurant_logo: restaurantLogo,
      restaurant_status: restaurantStatus,
    };

    setLoading(true);
    try {
      const res = await fetch(`https://6852821e0594059b23cdd834.mockapi.io/Food/${food.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await res.json();
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Food updated successfully!', life: 3000 });
      handleReset();
      onAdded?.();
    } catch (err) {
      console.error(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update food', life: 3000 });
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
    setRestaurantStatus('Open Now'); // default first option
    setSubmitted(false);
    onHide();
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog header="Edit Food" visible={visible} style={{ width: '450px' }} modal onHide={handleReset}>
        <div className="p-fluid">
          {/* Food Name */}
          <div className="field">
            <label htmlFor="food_name">
              Food Name <span className="text-red-500 font-bold">*</span>
            </label>
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
              <small id="food-name-error" className="p-error">
                Food Name is required
              </small>
            )}
          </div>

          {/* Food Rating */}
          <div className="field">
            <label htmlFor="food_rating">
              Food Rating <span className="text-red-500 font-bold">*</span>
            </label>
            <InputNumber
              id="food_rating"
              name="food_rating"
              value={foodRating}
              placeholder="Enter food rating (1-5)"
              aria-describedby="food-rating-error"
              onValueChange={(e) => setFoodRating(e.value as number)}
              min={1}
              max={5}
              showButtons
              className={classNames('food-input', { 'p-invalid': submitted && (!foodRating || foodRating < 1 || foodRating > 5) })}
            />
            {submitted && (!foodRating || foodRating < 1 || foodRating > 5) && (
              <small id="food-rating-error" className="p-error">
                Food Rating must be between 1 and 5
              </small>
            )}
          </div>

          {/* Food Image */}
          <div className="field">
            <label htmlFor="food_image">
              Food Image URL <span className="text-red-500 font-bold">*</span>
            </label>
            <InputText
              id="food_image"
              name="food_image"
              value={foodImage}
              placeholder="Enter food image URL"
              aria-describedby="food-image-error"
              onChange={(e) => setFoodImage(e.target.value)}
              className={classNames('food-input', { 'p-invalid': submitted && (!foodImage || !isValidURL(foodImage)) })}
            />
            {submitted && (!foodImage || !isValidURL(foodImage)) && (
              <small id="food-image-error" className="p-error">
                Food Image URL is required
              </small>
            )}
          </div>

          {/* Restaurant Name */}
          <div className="field">
            <label htmlFor="restaurant_name">
              Restaurant Name <span className="text-red-500 font-bold">*</span>
            </label>
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
              <small id="restaurant-name-error" className="p-error">
                Restaurant Name is required
              </small>
            )}
          </div>

          {/* Restaurant Logo */}
          <div className="field">
            <label htmlFor="restaurant_logo">
              Restaurant Logo URL <span className="text-red-500 font-bold">*</span>
            </label>
            <InputText
              id="restaurant_logo"
              name="restaurant_logo"
              value={restaurantLogo}
              placeholder="Enter restaurant logo URL"
              aria-describedby="restaurant-logo-error"
              onChange={(e) => setRestaurantLogo(e.target.value)}
              className={classNames('food-input', { 'p-invalid': submitted && (!restaurantLogo || !isValidURL(restaurantLogo)) })}
            />
            {submitted && (!restaurantLogo || !isValidURL(restaurantLogo)) && (
              <small id="restaurant-logo-error" className="p-error">
                Restaurant Logo URL is required
              </small>
            )}
          </div>

          {/* Restaurant Status */}
          <div className="field">
            <label htmlFor="restaurant_status">
              Restaurant Status <span className="text-red-500 font-bold">*</span>
            </label>
            <Dropdown
              id="restaurant_status"
              name="restaurant_status"
              value={restaurantStatus}
              options={statusOptions}
              onChange={(e) => setRestaurantStatus(e.value)}
              placeholder="Select food status"
              aria-describedby="restaurant-status-error"
              className={classNames('food-input', { 'p-invalid': submitted && !restaurantStatus })}
            />
            {submitted && !restaurantStatus && (
              <small id="restaurant-status-error" className="p-error">
                Restaurant Status must be “Open Now” or “Closed”
              </small>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-content-end mt-4 gap-2">
            <Button
              label={loading ? 'Editing Food...' : 'Edit Food'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-pencil'}
              className="p-button-info p-button-rounded p-button-outlined"
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
    </>
  );
};

export default EditMealModal;
