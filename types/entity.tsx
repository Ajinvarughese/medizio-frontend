export interface Doctor {
  email: string;
  specialization?: string;
  availability?: boolean;
  picture?: string;
  experience?: number;
  fromTime?: string;
  toTime?: string;
  document?: string;
  unavailableDates?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  name?: string;
  email: string;
  dob?: string;
  createdAt: string;
  updatedAt: string;
}
