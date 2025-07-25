import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.photos,places.id"
  }
};

export const GetplaceDetails = (data) => axios.post(BASE_URL, data, config);

export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}&maxWidthPx=800`;