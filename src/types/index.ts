export interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  technologies_back: string[];
  technologies_front: string[];
  technologies_cloud: string[];
  types_postes: string[];
  location: {
    lat: number;
    lng: number;
  };
  address: string;
}