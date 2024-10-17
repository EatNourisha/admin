export interface ILineUpFoodItem {
  mealId: {
    images: [];
    isSwallow: false;
    _id: string;
    name: string;
    slug: string;
    meals: [];
    image_url: string;
    is_available: true;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  extraId: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface ILineUpItem {
  _id: string;
  customer: string;
  monday: {
    lunch: ILineUpFoodItem;
    dinner: ILineUpFoodItem;
  };
  tuesday: {
    lunch: ILineUpFoodItem;
    dinner: ILineUpFoodItem;
  };
  wednesday: {
    lunch: ILineUpFoodItem;
    dinner: ILineUpFoodItem;
  };
  isReturningCustomer?:boolean;
  thursday: {
    lunch: ILineUpFoodItem;
    dinner: {
      mealId: {
        images: [];
        isSwallow: false;
        _id: "64b7a9940576e907baf984b9";
        name: "Jollof Rice, Peppered Chicken, Fried Plantain Sides";
        slug: "jollof_rice,_peppered_chicken,_fried_plantain_sides";
        meals: [];
        image_url: "https://nourisha-bucket.s3.us-east-1.amazonaws.com/Jollof Rice, Peppered Chicken, Fried Plantain Sides.jpeg_17633116.655119333.jpeg";
        is_available: true;
        createdAt: "2023-07-19T09:15:00.096Z";
        updatedAt: "2023-07-19T09:15:00.096Z";
        __v: 0;
      };
    };
  };
  friday: {
    lunch: ILineUpFoodItem;
    dinner: ILineUpFoodItem;
  };
  saturday: {
    lunch: ILineUpFoodItem;
    dinner: ILineUpFoodItem;
  };
  sunday: {
    lunch: ILineUpFoodItem;
    dinner: ILineUpFoodItem;
  };
  delivery_date: string;
  week: number;
  swallow: false;
  status: "active";
  sub_end_date: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}



export interface IReport {
  _id:string;
  by:{
    report:[],
    first_name:string;
    last_name:string;
    email:string;
  },
  text:string;
  createdAt: string;
  updatedAt:string
}