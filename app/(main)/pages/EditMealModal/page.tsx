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
  const [restaurantStatus, setRestaurantStatus] = useState<'open' | 'close' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef<Toast>(null);

  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'Close', value: 'close' }
  ];

  // Prefill form when `food` changes
  useEffect(() => {
    if (food) {
      setFoodName(food.food_name || '');
      setFoodRating(Number(food.food_rating) || null);
      setFoodImage(food.food_image || '');
      setRestaurantName(food.restaurant_name || '');
      setRestaurantLogo(food.restaurant_logo || '');
      setRestaurantStatus(food.restaurant_status?.toLowerCase() === 'open' ? 'open' : 'close');
    }
  }, [food]);

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!foodName || !foodRating || !foodImage || !restaurantName || !restaurantLogo || !restaurantStatus) {
      return;
    }

    if (!food) return;

    const payload = {
      food_name: foodName,
      food_rating: foodRating,
      food_image: foodImage,
      restaurant_name: restaurantName,
      restaurant_logo: restaurantLogo,
      restaurant_status: restaurantStatus
    };

    try {
      const res = await fetch(`https://6852821e0594059b23cdd834.mockapi.io/Food/${food.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await res.json();
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Meal updated!', life: 3000 });
      handleReset();
      onAdded?.();
    } catch (err) {
      console.error(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update meal', life: 3000 });
    }
  };

  const handleReset = () => {
    setFoodName('');
    setFoodRating(null);
    setFoodImage('');
    setRestaurantName('');
    setRestaurantLogo('');
    setRestaurantStatus(null);
    setSubmitted(false);
    onHide();
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog header="Edit Meal" visible={visible} style={{ width: '450px' }} modal onHide={handleReset}>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="foodName">Food Name*</label>
            <InputText
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className={classNames({ 'p-invalid': submitted && !foodName })}
            />
            {submitted && !foodName && <small className="p-error">Food name is required</small>}
          </div>

          <div className="field">
            <label htmlFor="foodRating">Food Rating*</label>
            <InputNumber
              id="foodRating"
              value={foodRating}
              onValueChange={(e) => setFoodRating(e.value as any)}
              min={1}
              max={5}
              showButtons
              className={classNames({ 'p-invalid': submitted && !foodRating })}
            />
            {submitted && !foodRating && <small className="p-error">Food rating is required</small>}
          </div>

          <div className="field">
            <label htmlFor="foodImage">Food Image (link)*</label>
            <InputText
              id="foodImage"
              value={foodImage}
              onChange={(e) => setFoodImage(e.target.value)}
              className={classNames({ 'p-invalid': submitted && !foodImage })}
            />
            {submitted && !foodImage && <small className="p-error">Food image is required</small>}
          </div>

          <div className="field">
            <label htmlFor="restaurantName">Restaurant Name*</label>
            <InputText
              id="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className={classNames({ 'p-invalid': submitted && !restaurantName })}
            />
            {submitted && !restaurantName && <small className="p-error">Restaurant name is required</small>}
          </div>

          <div className="field">
            <label htmlFor="restaurantLogo">Restaurant Logo (link)*</label>
            <InputText
              id="restaurantLogo"
              value={restaurantLogo}
              onChange={(e) => setRestaurantLogo(e.target.value)}
              className={classNames({ 'p-invalid': submitted && !restaurantLogo })}
            />
            {submitted && !restaurantLogo && <small className="p-error">Restaurant logo is required</small>}
          </div>

          <div className="field">
            <label htmlFor="restaurantStatus">Restaurant Status*</label>
            <Dropdown
              id="restaurantStatus"
              value={restaurantStatus}
              options={statusOptions}
              onChange={(e) => setRestaurantStatus(e.value)}
              placeholder="Select Status"
              className={classNames({ 'p-invalid': submitted && !restaurantStatus })}
            />
            {submitted && !restaurantStatus && <small className="p-error">Restaurant status is required</small>}
          </div>

          <div className="flex justify-content-end mt-4 gap-2">
            <Button label="Cancel" className="p-button-secondary" onClick={handleReset} />
            <Button label="Save" className="p-button-primary" onClick={handleSubmit} />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EditMealModal;
