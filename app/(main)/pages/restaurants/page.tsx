'use client';
import { useEffect, useState, useRef } from "react";
import { RestaurantService } from "@/demo/service/restaurantService";
import { Food } from "@/types/food";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import AddMealModal from "../AddMealModal/page";
import EditMealModal from "../EditMealModal/page";
import { InputText } from "primereact/inputtext";

const TableRestaurant = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [layout, setLayout] = useState<"list" | "grid">("grid");
    const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchFoods();
    }, []);

    // Fetch foods
    const fetchFoods = () => {
        setLoading(true);
        RestaurantService.getFeaturedFoods()
            .then((data) => setFoods(data))
            .finally(() => setLoading(false));
    };

    // Filter foods
    const filterFoods = async (name: string) => {
        setLoading(true);
        try {
            const res = await fetch(`https://6852821e0594059b23cdd834.mockapi.io/Food?name=${encodeURIComponent(name)}`);
            const data = await res.json();

            const mappedData: Food[] = data.map((item: any) => ({
                id: item.id,
                food_name: item.name,
                food_rating: item.rating,
                restaurant_status: item.open ? "OPEN" : "CLOSED",
                restaurant_name: "Unknown Restaurant",
                food_image: item.logo || item.avatar,
                Price: item.Price || item.price,
            }));

            setFoods(mappedData);
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to filter foods', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const getSeverity = (food: Food) => {
        switch (food.restaurant_status?.toUpperCase()) {
            case "OPEN": return "success";
            case "CLOSED": return "danger";
            case "BUSY": return "warning";
            default: return "info";
        }
    };

    // Confirm delete dialog
    const confirmDelete = (food: Food) => {
        confirmDialog({
            message: `Are you sure you want to delete "${food.food_name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteFood(food.id),
            reject: () => {},
        });
    };

    // Delete food API call
    const deleteFood = async (id: string) => {
        try {
            setDeletingId(id);
            await fetch(`https://6852821e0594059b23cdd834.mockapi.io/Food/${id}`, {
                method: 'DELETE'
            });
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Meal deleted successfully', life: 3000 });
            fetchFoods(); // refresh the table
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete meal', life: 3000 });
        } finally {
            setDeletingId(null);
        }
    };

    // List layout
    const listItem = (food: Food, index: number) => (
        <div className="col-12" key={`${food.id}-${index}`}>
            <div className={classNames("flex flex-column xl:flex-row xl:align-items-start p-4 gap-4", { "border-top-1 surface-border": index !== 0 })}>
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block mx-auto border-round" src={food.food_image || "/layout/images/placeholder.png"} alt={food.food_name} />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{food.food_name}</div>
                        <Rating value={Number(food.food_rating) || 0} readOnly cancel={false} />
                        <div className="flex align-items-center gap-3">
                            <Tag value={food.restaurant_status || "Unknown"} severity={getSeverity(food)} />
                            <span className="font-semibold text-sm opacity-70">{food.restaurant_name || "Unnamed Restaurant"}</span>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">${food.Price || food.price || 0}</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={food.restaurant_status?.toUpperCase() === "CLOSED"} />
                    </div>
                </div>
            </div>
        </div>
    );

    // Grid layout
    const gridItem = (food: Food, index: number) => {
        const isActive = activeFoodId === food.id;
        const isDeleting = deletingId === food.id;

        return (
            <div className="col-12 sm:col-6 lg:col-4 p-2" key={`${food.id}-${index}`}>
                <div className="p-4 border-1 surface-border surface-card border-round shadow-sm">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-store" />
                            <span className="font-semibold">{food.restaurant_name}</span>
                        </div>
                        <Tag value={food.restaurant_status || "Unknown"} severity={getSeverity(food)} />
                    </div>

                    <div className="flex flex-column align-items-center gap-3 py-4">
                        <img className="w-9 shadow-2 border-round" src={food.food_image || "/layout/images/placeholder.png"} alt={food.food_name} />
                        <div className="text-xl font-bold text-center">{food.food_name}</div>
                        <Rating value={Number(food.food_rating) || 0} readOnly cancel={false} />
                    </div>

                    <div className="flex align-items-center justify-content-between mt-3 cursor-pointer" onClick={() => setActiveFoodId(isActive ? null : food.id)}>
                        <span className="text-2xl font-semibold">${food.Price || food.price || 0}</span>
                        <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text" />
                    </div>

                    {isActive && (
                        <div className="flex justify-content-end gap-2 mt-3">
                            <Button label="Add" icon="pi pi-plus" size="small" severity="success" onClick={() => { setSelectedFood(food); setAddModalVisible(true); }} />
                            <Button label="Edit" icon="pi pi-pencil" size="small" severity="info" onClick={() => { setSelectedFood(food); setEditModalVisible(true); }} />
                            <Button
                                label={isDeleting ? "" : "Delete"}
                                icon={isDeleting ? undefined : "pi pi-trash"}
                                size="small"
                                severity="danger"
                                onClick={() => confirmDelete(food)}
                            >
                                {isDeleting && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // DataView template
    const itemTemplate = (food: Food, layout: "list" | "grid") => {
        if (!food) return null;
        const index = foods.findIndex((f) => f.id === food.id);
        return layout === "list" ? listItem(food, index) : gridItem(food, index);
    };

    const header = (
        <div className="flex justify-content-between mb-3">
            <InputText
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') filterFoods(searchTerm); }}
            />
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as any)} />
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h5 className="mb-4">🍔 Featured Foods</h5>

            {loading ? (
                <div className="flex justify-content-center my-6">
                    <ProgressSpinner />
                </div>
            ) : (
                <DataView
                    value={foods}
                    itemTemplate={itemTemplate}
                    layout={layout}
                    header={header}
                    paginator
                    rows={6}
                />
            )}

            {/* Add Meal Modal */}
            <AddMealModal
                visible={isAddModalVisible}
                onHide={() => setAddModalVisible(false)}
                onAdded={() => { setAddModalVisible(false); fetchFoods(); }}
            />

            {/* Edit Meal Modal */}
            <EditMealModal
                visible={isEditModalVisible}
                food={selectedFood}
                onHide={() => setEditModalVisible(false)}
                onAdded={() => { setEditModalVisible(false); fetchFoods(); }}
            />
        </div>
    );
};

export default TableRestaurant;
