'use client';
import { useEffect, useState } from "react";
import { RestaurantService } from "@/demo/service/restaurantService";
import { Food } from "@/types/food";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";

const TableRestaurant = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [layout, setLayout] = useState<"list" | "grid">("grid");
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null); 

  useEffect(() => {
    RestaurantService.getFeaturedFoods().then((data) => {
      setFoods(data);
    });
  }, []);

  const getSeverity = (food: Food) => {
    switch (food.restaurant_status?.toUpperCase()) {
      case "OPEN":
        return "success";
      case "CLOSED":
        return "danger";
      case "BUSY":
        return "warning";
      default:
        return "info";
    }
  };

  // 🧾 List layout
  const listItem = (food: Food, index: number) => (
    <div className="col-12" key={`${food.id}-${index}`}>
      <div
        className={classNames(
          "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
          { "border-top-1 surface-border": index !== 0 }
        )}
      >
        <img
          className="w-9 sm:w-16rem xl:w-10rem shadow-2 block mx-auto border-round"
          src={
            food.food_image ||
            "/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png"
          }
          alt={food.food_name}
        />
        <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
          <div className="flex flex-column align-items-center sm:align-items-start gap-3">
            <div className="text-2xl font-bold text-900">{food.food_name}</div>
            <Rating value={Number(food.food_rating) || 0} readOnly cancel={false} />
            <div className="flex align-items-center gap-3">
              <Tag
                value={food.restaurant_status || "Unknown"}
                severity={getSeverity(food)}
              />
              <span className="font-semibold text-sm opacity-70">
                {food.restaurant_name || "Unnamed Restaurant"}
              </span>
            </div>
          </div>
          <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
            <span className="text-2xl font-semibold">
              ${food.Price || food.price || 0}
            </span>
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              disabled={food.restaurant_status?.toUpperCase() === "CLOSED"}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 🍱 Grid layout
  const gridItem = (food: Food, index: number) => {
    const isActive = activeFoodId === food.id; // 👈 Check if this card is active

    return (
      <div className="col-12 sm:col-6 lg:col-4 p-2" key={`${food.id}-${index}`}>
        <div className="p-4 border-1 surface-border surface-card border-round shadow-sm">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-store" />
              <span className="font-semibold">{food.restaurant_name}</span>
            </div>
            <Tag
              value={food.restaurant_status || "Unknown"}
              severity={getSeverity(food)}
            />
          </div>

          <div className="flex flex-column align-items-center gap-3 py-4">
            <img
              className="w-9 shadow-2 border-round"
              src={food.food_image || "/layout/images/placeholder.png"}
              alt={food.food_name}
            />
            <div className="text-xl font-bold text-center">{food.food_name}</div>
            <Rating value={Number(food.food_rating) || 0} readOnly cancel={false} />
          </div>

          {/* 👇 Toggle Section */}
          <div
            className="flex align-items-center justify-content-between mt-3 cursor-pointer"
            onClick={() => setActiveFoodId(isActive ? null : food.id)}
          >
            <span className="text-2xl font-semibold">${food.Price || food.price || 0}</span>
            <Button
              icon="pi pi-ellipsis-h"
              className="p-button-rounded p-button-text"
            />
          </div>

          {/* 👇 Action Buttons */}
          {isActive && (
            <div className="flex justify-content-end gap-2 mt-3">
              <Button
                label="Add"
                icon="pi pi-plus"
                size="small"
                severity="success"
                onClick={() => console.log("Add Meal:", food.food_name)}
              />
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="info"
                onClick={() => console.log("Edit Meal:", food.food_name)}
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => console.log("Delete Meal:", food.food_name)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // ✅ DataView Template
  const itemTemplate = (food: Food, layout: "list" | "grid") => {
    if (!food) return null;
    const index = foods.findIndex((f) => f.id === food.id);
    return layout === "list" ? listItem(food, index) : gridItem(food, index);
  };

  const header = (
    <div className="flex justify-content-end mb-3">
      <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as any)} />
    </div>
  );

  return (
    <div className="card">
      <h5 className="mb-4">🍔 Featured Foods</h5>
      <DataView
        value={foods}
        itemTemplate={itemTemplate}
        layout={layout}
        header={header}
        paginator
        rows={6}
      />
    </div>
  );
};

export default TableRestaurant;
